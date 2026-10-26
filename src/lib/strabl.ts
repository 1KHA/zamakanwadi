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
    // README lists sku as required; the SDK's own types and validation treat
    // it as optional (only title/price/quantity/productId/variantId are checked).
    sku: b.durationType ?? undefined,
    url: b.spaceId ? `${origin}/spaces/${b.spaceId}` : undefined,
    // Optional per the SDK; shown next to the line in the hosted checkout.
    // Every seeded space ships public/images/spaces/<id>/main.jpg.
    image: b.spaceId ? `${origin}/images/spaces/${b.spaceId}/main.jpg` : undefined,
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
    // The SDK appends ?orderShortCode=… to successUrl and ?failureReason=… to
    // failureUrl before navigating (verified in dist/index.js, not in the README).
    merchantUrls: {
      successUrl: `${origin}/payment/result?status=success&ref=${referenceNumber}${applied}`,
      failureUrl: `${origin}/payment/result?status=failed&ref=${referenceNumber}`,
      cancelUrl: `${origin}/payment?ref=${referenceNumber}`,
    },
  };

  return { cart, subtotal, vat, amountDue: amountWithVat(subtotal) };
}

// ---------------------------------------------------------------------------
// Webhook — spec: https://docs.strabl.io/webhook-1615585m0 (fetched 2026-10-26)
// ---------------------------------------------------------------------------

/** The three headers Strabl sends with every webhook (Headers API is case-insensitive). */
export const STRABL_WEBHOOK_HEADERS = {
  id: 'x-webhook-id',
  timestamp: 'x-webhook-timestamp',
  signature: 'x-webhook-signature',
} as const;

/** Strabl: "Reject requests where |now - X-Webhook-Timestamp| > 300" seconds. */
export const STRABL_TIMESTAMP_TOLERANCE_S = 300;

export interface StrablWebhookHeaders {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
}

/**
 * X-Webhook-Signature = "v1=" + hex(HMAC-SHA256(secret, `${id}.${timestamp}.${rawBody}`))
 *
 * Fails CLOSED: no secret configured, any header missing, a non-numeric or
 * stale timestamp, or a malformed signature all mean "rejected". The raw body
 * must be the bytes as received — never re-serialised JSON.
 */
export function verifyStrablSignature(
  rawBody: string,
  headers: StrablWebhookHeaders,
  nowMs: number = Date.now()
): boolean {
  const secret = process.env.STRABL_WEBHOOK_SECRET;
  const { id, timestamp, signature } = headers;
  if (!secret || !id || !timestamp || !signature) return false;

  // Replay window. Epoch seconds only; anything else is malformed.
  if (!/^\d{1,12}$/.test(timestamp)) return false;
  if (Math.abs(Math.floor(nowMs / 1000) - Number(timestamp)) > STRABL_TIMESTAMP_TOLERANCE_S) return false;

  const expected = Buffer.from(
    'v1=' + createHmac('sha256', secret).update(`${id}.${timestamp}.${rawBody}`).digest('hex')
  );
  const received = Buffer.from(signature.trim());
  // Length is not secret; a mismatch here just means a malformed signature.
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/** Documented webhookEventType values. */
export type StrablEventType =
  | 'order_created'
  | 'order_updated'
  | 'order_failed'
  | 'order_refunded'
  | 'order_abandoned'
  | 'order_chargeback';

export interface StrablWebhookEvent {
  eventId: string;
  eventType: string;
  platformUuid: string;
  orderUuid: string;
  orderShortCode: string;
  /** payload.orderUpdate.paymentStatus, lower-cased ('' when absent). */
  paymentStatus: string;
  /** payload.orderUpdate.status, lower-cased ('' when absent). */
  orderStatus: string;
  /** payload.orderUpdate.totalPrice in Strabl's unit — convert with fromProviderAmount(). */
  amount: number | null;
  currency: string;
  /**
   * Our booking ids. buildStrablCart sends booking.id as variantId and Strabl
   * echoes it as products[].externalVariantId — the reliable way to find what
   * was paid for. The synthetic "vat-…" line is excluded.
   */
  bookingIds: string[];
  /** Σ payload.orderUpdate.taxes[].value — Strabl-side taxes; should be 0 for us (VAT is our own line). */
  taxes: number;
  /** cart.extra, if echoed. The docs promise it; the schema doesn't say where, so this is best-effort. */
  referenceNumber: string | null;
  userId: string | null;
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const hasKeys = (v: Record<string, unknown>) => Object.keys(v).length > 0;

/** 'orderCreated' / 'ORDER-CREATED' / ' order_created ' → 'order_created'. */
export function normaliseEventType(v: unknown): string {
  return str(v)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** Scalar fields whose values are safe and useful to log (enum-like, no customer data). */
const SHAPE_VALUE_KEYS = new Set([
  'type', 'webhookEventType', 'eventType', 'event', 'status', 'paymentStatus', 'fulfillmentStatus',
  'orderShortCode', 'currency', 'totalPrice',
]);

/**
 * Key structure of a webhook body for the logs — names and types only, never
 * customer values — so an unrecognised payload can be fixed from the logs.
 */
export function describeWebhookShape(value: unknown, depth = 0): string {
  if (Array.isArray(value)) {
    return value.length ? `[${value.length}×${describeWebhookShape(value[0], depth + 1)}]` : '[]';
  }
  if (value === null) return 'null';
  if (typeof value !== 'object') return typeof value;
  if (depth >= 4) return '{…}';
  const parts = Object.entries(value as Record<string, unknown>).map(([k, v]) => {
    const shown = SHAPE_VALUE_KEYS.has(k) && (typeof v === 'string' || typeof v === 'number')
      ? JSON.stringify(String(v).slice(0, 40))
      : describeWebhookShape(v, depth + 1);
    return `${k}:${shown}`;
  });
  return `{${parts.join(',')}}`;
}

/**
 * Normalises a Strabl event into the fields we act on. The docs describe two
 * shapes and the live sandbox rejected the first one we implemented, so both
 * are accepted:
 *   1. envelope — { eventId, webhookEventType, platformUuid, orderUuid, orderShortCode,
 *                   publishedAt, payload: { type, orderUpdate, customerUpdate } }
 *   2. bare    — { type, orderUpdate: {...}, customerUpdate: {...} }   (the per-event schema pages)
 * plus either of those wrapped in { data: … }. Returns null only when no order
 * code can be found anywhere; every real event parses so the route can
 * acknowledge and log it.
 */
export function parseStrablWebhook(event: unknown): StrablWebhookEvent | null {
  let e = obj(event);
  if (!hasKeys(obj(e.payload)) && !hasKeys(obj(e.orderUpdate))) {
    const inner = obj(e.data);
    if (hasKeys(obj(inner.payload)) || hasKeys(obj(inner.orderUpdate))) e = inner;
  }

  const payload = obj(e.payload);
  const order = hasKeys(obj(payload.orderUpdate)) ? obj(payload.orderUpdate) : obj(e.orderUpdate);

  // Event type may be blank: the bare schema only has `type`, whose values are undocumented.
  const eventType = normaliseEventType(
    e.webhookEventType ?? e.eventType ?? e.event ?? e.type ?? payload.type
  );
  const orderShortCode = str(e.orderShortCode) || str(order.orderShortCode);
  if (!orderShortCode) return null;

  const products = Array.isArray(order.products) ? order.products.map(obj) : [];
  const bookingIds = products
    .map((p) => str(p.externalVariantId))
    .filter((id) => id.length > 0 && !id.startsWith('vat-'));

  const taxes = (Array.isArray(order.taxes) ? order.taxes.map(obj) : []).reduce(
    (sum, t) => sum + (Number(t.value) || 0),
    0
  );

  const totalPrice = Number(order.totalPrice);

  // Where `extra` is echoed is not in the published schema — accept the plausible spots.
  const extra = { ...obj(e.extra), ...obj(payload.extra), ...obj(order.extra) };
  const ref = str(extra.referenceNumber);

  return {
    eventId: str(e.eventId),
    eventType,
    platformUuid: str(e.platformUuid) || str(order.platformUuid),
    orderUuid: str(e.orderUuid) || str(order.orderUuid),
    orderShortCode,
    paymentStatus: str(order.paymentStatus).toLowerCase(),
    orderStatus: str(order.status).toLowerCase(),
    amount: Number.isFinite(totalPrice) ? totalPrice : null,
    currency: str(order.currency).toUpperCase(),
    bookingIds,
    taxes,
    referenceNumber: REFERENCE_PATTERN.test(ref) ? ref : null,
    userId: str(extra.userId) || null,
  };
}

/**
 * Documented event types that can never mean "money received". Anything else
 * (order_created, order_updated — "marked paid or fulfilled" — or a blank or
 * unknown label, since the real `type` vocabulary is undocumented) is judged
 * on paymentStatus alone. That is safe because the body is signed and the
 * amount is still checked against our own booking total.
 */
const NON_PAYMENT_EVENT_TYPES = new Set<string>([
  'order_failed',
  'order_refunded',
  'order_abandoned',
  'order_chargeback',
]);
/**
 * The docs type paymentStatus as a free string and list no values, so the
 * accepted set is deliberately broad and the route logs every status it
 * ignores — add the real value here once seen.
 */
const PAID_STATUSES = new Set([
  'paid',
  'captured',
  'success',
  'succeeded',
  'successful',
  'completed',
  'complete',
  'approved',
  'settled',
  'confirmed',
]);

export function isPaidEvent(event: StrablWebhookEvent): boolean {
  return !NON_PAYMENT_EVENT_TYPES.has(event.eventType) && PAID_STATUSES.has(event.paymentStatus);
}

export type PaymentRecordStatus = 'PAID' | 'AMOUNT_MISMATCH' | 'UNMATCHED';

export interface MarkPaidResult {
  /** null for UNMATCHED — there is no user to attach a Payment row to. */
  paymentId: string | null;
  status: PaymentRecordStatus;
  amount: number;
  referenceNumber: string | null;
  userId: string | null;
  /** False when this orderShortCode was already recorded (webhook retry / order_updated after order_created). */
  isNew: boolean;
}

/**
 * Records a successful Strabl payment and, only if the amount matches what the
 * database says is owed, marks the bookings PAID. Idempotent on orderShortCode.
 *
 * Bookings are found by the ids Strabl echoes back (externalVariantId), with
 * cart.extra as a fallback and as a cross-check when both are present. The
 * cart is built in the browser by the SDK, so an amount mismatch means it was
 * tampered with: the money is recorded for reconciliation, bookings stay unpaid.
 */
export async function markReferencePaid(
  event: StrablWebhookEvent,
  rawPayload: unknown
): Promise<MarkPaidResult> {
  const amountSar = event.amount === null ? 0 : fromProviderAmount(event.amount);

  return prisma.$transaction(async (tx) => {
    // Webhooks are retried, and order_updated follows order_created for the
    // same order — a second delivery for the same order is a no-op.
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

    const unmatched: MarkPaidResult = {
      paymentId: null,
      status: 'UNMATCHED',
      amount: amountSar,
      referenceNumber: event.referenceNumber,
      userId: event.userId,
      isNew: true,
    };

    let where: Prisma.BookingWhereInput | null = null;
    if (event.bookingIds.length > 0) {
      where = { id: { in: event.bookingIds }, paymentStatus: 'PENDING_PAYMENT' };
    } else if (event.referenceNumber && event.userId) {
      where = {
        userId: event.userId,
        referenceNumber: event.referenceNumber,
        paymentStatus: 'PENDING_PAYMENT',
      };
    }
    const bookings = where ? await tx.booking.findMany({ where }) : [];
    if (bookings.length === 0) return unmatched;

    // One order pays for one reference of one user — anything else is not ours to confirm.
    const referenceNumber = bookings[0].referenceNumber;
    const userId = bookings[0].userId;
    if (
      !referenceNumber ||
      bookings.some((b) => b.referenceNumber !== referenceNumber || b.userId !== userId) ||
      (event.referenceNumber && event.referenceNumber !== referenceNumber) ||
      (event.userId && event.userId !== userId)
    ) {
      return unmatched;
    }

    // Same formula the cart was built with, so what Strabl was told to charge
    // is exactly what we verify here.
    const expected = amountWithVat(round2(bookings.reduce((sum, b) => sum + b.total, 0)));
    const matches =
      event.currency === 'SAR' && event.amount !== null && Math.abs(amountSar - expected) < 0.01;
    const status: PaymentRecordStatus = matches ? 'PAID' : 'AMOUNT_MISMATCH';

    const payment = await tx.payment.create({
      data: {
        userId,
        referenceNumber,
        amount: amountSar,
        currency: event.currency || 'SAR',
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

    return { paymentId: payment.id, status, amount: amountSar, referenceNumber, userId, isNew: true };
  });
}
