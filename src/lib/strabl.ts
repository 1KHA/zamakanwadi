import { createHmac, timingSafeEqual } from 'crypto';
import type { Prisma } from '@prisma/client';
import type { ICart, IProduct } from '@strabl-engineering/checkout-sdk';
import { prisma } from '@/lib/prisma';
import { REFERENCE_PATTERN } from '@/lib/validation';

/**
 * Strabl checkout — server side. Everything Strabl-specific lives here and in
 * strablClient.ts so the provider is easy to swap. See mdfiles/STRABL_CHECKOUT.md.
 *
 * The one rule that matters: the SDK is browser-only and the cart (prices
 * included) is POSTed from the customer's browser. Nothing the browser says is
 * proof of payment. A booking becomes PAID only when a *signed webhook* arrives
 * AND its amount matches what the database says is owed (markReferencePaid).
 */

// ---------------------------------------------------------------------------
// Provider selection & public config
// ---------------------------------------------------------------------------

export type PaymentProvider = 'demo' | 'strabl';

export function paymentProvider(): PaymentProvider {
  return process.env.PAYMENT_PROVIDER === 'strabl' ? 'strabl' : 'demo';
}

/** Public SDK config. Read at runtime so a container restart picks up changes. */
export function strablPublicConfig() {
  return {
    platformUuid: process.env.STRABL_PLATFORM_UUID?.trim() ?? '',
    environment: (process.env.STRABL_ENV === 'production' ? 'production' : 'sandbox') as
      | 'sandbox'
      | 'production',
  };
}

/** True only when the provider is Strabl AND a platform UUID is present. */
export function isStrablConfigured(): boolean {
  return paymentProvider() === 'strabl' && strablPublicConfig().platformUuid.length > 0;
}

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

/**
 * VAT option A (STRABL_CHECKOUT.md §2.3): booking prices EXCLUDE VAT, which is
 * what /cart and /checkout display today. Set to 0 for option B (prices include
 * VAT) and remove the "Tax (15%)" lines from those pages.
 */
export const VAT_RATE = 0.15;

/**
 * ⚠️ UNCONFIRMED (STRABL_CHECKOUT.md Finding 4): whether IProduct.price is SAR
 * (major units) or halalas. Verify in sandbox — send 1500 and check whether the
 * checkout shows 1,500.00 or 15.00. If halalas, set this to 100. Both the cart
 * builder and the webhook amount check go through this one constant.
 */
export const PRICE_MULTIPLIER = 1;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function vatOn(subtotal: number): number {
  return round2(subtotal * VAT_RATE);
}

export function amountWithVat(subtotal: number): number {
  return round2(subtotal + vatOn(subtotal));
}

/** SAR → the unit Strabl expects. */
export function toProviderAmount(sar: number): number {
  return round2(sar * PRICE_MULTIPLIER);
}

/** The unit Strabl reports → SAR. */
export function fromProviderAmount(providerAmount: number): number {
  return round2(providerAmount / PRICE_MULTIPLIER);
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

/**
 * The SDK deletes everything outside [a-zA-Z0-9 ] before sending (Finding 3),
 * so Arabic becomes blank and "Office-A (Monthly)" becomes "OfficeA Monthly".
 * Clean it ourselves first so punctuation turns into a space instead of
 * vanishing, and fall back to something readable if nothing survives.
 */
export function asciiTitle(value: string | null | undefined, fallback: string): string {
  const cleaned = (value ?? '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}

export interface StrablCartResult {
  cart: ICart;
  subtotal: number;
  vat: number;
  /** VAT-inclusive SAR amount the customer will be charged. */
  amountDue: number;
}

/**
 * Builds the Strabl cart from the database — never from the localStorage cart.
 * Only bookings that still owe money are included (a 0 price rejects the whole
 * cart on Strabl's side, Finding 4). Returns null when nothing is pending.
 */
export async function buildStrablCart(
  userId: string,
  referenceNumber: string,
  origin: string,
  appliedHours?: number
): Promise<StrablCartResult | null> {
  const bookings = await prisma.booking.findMany({
    where: { userId, referenceNumber, paymentStatus: 'PENDING_PAYMENT', total: { gt: 0 } },
    orderBy: { createdAt: 'asc' },
  });
  if (bookings.length === 0) return null;

  const lineItems: IProduct[] = bookings.map((b) => ({
    // English only — Arabic would be stripped to nothing (Finding 3).
    title: asciiTitle(b.itemName, 'Zamakan booking'),
    description: asciiTitle(
      `${b.durationType ?? ''} ${b.startDate ? b.startDate.toISOString().slice(0, 10) : ''}`,
      'Booking'
    ),
    price: toProviderAmount(b.total),
    quantity: 1,
    productId: b.spaceId ?? b.id,
    // Unique per booking — useful for reconciliation in Strabl's dashboard.
    variantId: b.id,
    sku: b.durationType ?? undefined,
    url: b.spaceId ? `${origin}/spaces/${b.spaceId}` : undefined,
  }));

  const subtotal = round2(bookings.reduce((sum, b) => sum + b.total, 0));
  const vat = vatOn(subtotal);
  if (vat > 0) {
    lineItems.push({
      // "%" would be stripped by the SDK, hence "percent".
      title: 'VAT 15 percent',
      price: toProviderAmount(vat),
      quantity: 1,
      productId: 'vat',
      variantId: `vat-${referenceNumber}`,
    });
  }

  const applied =
    typeof appliedHours === 'number' && Number.isFinite(appliedHours) && appliedHours > 0
      ? `&applied=${appliedHours}`
      : '';

  const cart: ICart = {
    currency: 'SAR',
    country: 'SA',
    lineItems,
    // Lets the webhook find the bookings. Both values are ours, not the user's.
    extra: { referenceNumber, userId },
    merchantUrls: {
      successUrl: `${origin}/payment/result?status=success&ref=${referenceNumber}${applied}`,
      failureUrl: `${origin}/payment/result?status=failed&ref=${referenceNumber}`,
      cancelUrl: `${origin}/payment?ref=${referenceNumber}`,
    },
  };

  return { cart, subtotal, vat, amountDue: amountWithVat(subtotal) };
}

// ---------------------------------------------------------------------------
// Webhook
// ---------------------------------------------------------------------------

/** TODO(strabl): confirm the real header name with Strabl (§2.2 Q3). */
export const STRABL_SIGNATURE_HEADER = 'x-strabl-signature';

/**
 * ⚠️ ASSUMPTION (STRABL_CHECKOUT.md Step 4): HMAC-SHA256 of the raw request
 * body, hex-encoded. Replace with the scheme Strabl documents (header name,
 * algorithm, encoding) before going live.
 *
 * Fails CLOSED: no secret configured, or no signature sent, means rejected.
 */
export function verifyStrablSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.STRABL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'));
  const received = Buffer.from(signature.trim());
  // Length is not secret; a mismatch here just means a malformed signature.
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export interface StrablWebhookEvent {
  status: string;
  orderShortCode: string;
  /** In Strabl's unit — convert with fromProviderAmount(). */
  amount: number;
  currency: string;
  referenceNumber: string;
  userId: string;
}

/**
 * Normalises a webhook body into the fields we act on.
 *
 * TODO(strabl): the field names below are PLACEHOLDERS until Strabl sends the
 * payload spec (§2.2 Q3). This is the only place that needs to change.
 * Returns null when the body doesn't carry what we need.
 */
export function parseStrablWebhook(event: unknown): StrablWebhookEvent | null {
  if (!event || typeof event !== 'object') return null;
  const e = event as Record<string, unknown>;
  const extra = (e.extra && typeof e.extra === 'object' ? e.extra : {}) as Record<string, unknown>;

  const status = typeof e.status === 'string' ? e.status : '';
  const orderShortCode = typeof e.orderShortCode === 'string' ? e.orderShortCode : '';
  const amount = Number(e.amount);
  const currency = typeof e.currency === 'string' ? e.currency : '';
  const referenceNumber = typeof extra.referenceNumber === 'string' ? extra.referenceNumber : '';
  const userId = typeof extra.userId === 'string' ? extra.userId : '';

  if (!status || !orderShortCode || !Number.isFinite(amount) || !currency) return null;
  if (!REFERENCE_PATTERN.test(referenceNumber) || !userId) return null;

  return { status, orderShortCode, amount, currency, referenceNumber, userId };
}

export type PaymentRecordStatus = 'PAID' | 'AMOUNT_MISMATCH' | 'UNMATCHED';

export interface MarkPaidResult {
  paymentId: string;
  status: PaymentRecordStatus;
  amount: number;
  referenceNumber: string;
  userId: string;
  /** False when this orderShortCode was already recorded (webhook retry). */
  isNew: boolean;
}

/**
 * Records a Strabl payment and, only if the amount matches what the database
 * says is owed, marks the bookings PAID. Idempotent on orderShortCode.
 *
 * The SDK builds the cart in the browser, so a mismatch means the cart was
 * tampered with (e.g. a price edited in DevTools). The money is recorded for
 * reconciliation, but the bookings are NOT confirmed.
 */
export async function markReferencePaid(
  event: StrablWebhookEvent,
  rawPayload: unknown
): Promise<MarkPaidResult> {
  const amountSar = fromProviderAmount(event.amount);

  return prisma.$transaction(async (tx) => {
    // Webhooks are retried — a second delivery for the same order is a no-op.
    const existing = await tx.payment.findUnique({
      where: { providerOrderId: event.orderShortCode },
    });
    if (existing) {
      return {
        paymentId: existing.id,
        status: existing.status as PaymentRecordStatus,
        amount: existing.amount,
        referenceNumber: existing.referenceNumber,
        userId: existing.userId,
        isNew: false,
      };
    }

    const bookings = await tx.booking.findMany({
      where: {
        userId: event.userId,
        referenceNumber: event.referenceNumber,
        paymentStatus: 'PENDING_PAYMENT',
      },
    });

    let status: PaymentRecordStatus;
    if (bookings.length === 0) {
      // Money arrived for nothing we can find. Never drop that silently.
      status = 'UNMATCHED';
    } else {
      // Same formula the cart was built with, so what Strabl was told to charge
      // is exactly what we verify here.
      const expected = amountWithVat(round2(bookings.reduce((sum, b) => sum + b.total, 0)));
      const matches = event.currency === 'SAR' && Math.abs(amountSar - expected) < 0.01;
      status = matches ? 'PAID' : 'AMOUNT_MISMATCH';
    }

    const payment = await tx.payment.create({
      data: {
        userId: event.userId,
        referenceNumber: event.referenceNumber,
        amount: amountSar,
        currency: event.currency,
        method: 'strabl',
        provider: 'strabl',
        providerOrderId: event.orderShortCode,
        status,
        rawPayload: rawPayload as Prisma.InputJsonValue,
      },
    });

    if (status === 'PAID') {
      await tx.booking.updateMany({
        where: { id: { in: bookings.map((b) => b.id) } },
        data: { paymentStatus: 'PAID', paidAt: new Date() },
      });
    }

    return {
      paymentId: payment.id,
      status,
      amount: amountSar,
      referenceNumber: event.referenceNumber,
      userId: event.userId,
      isNew: true,
    };
  });
}
