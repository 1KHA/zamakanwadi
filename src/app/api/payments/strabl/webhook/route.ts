import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  isPaidEvent,
  markReferencePaid,
  parseStrablWebhook,
  STRABL_WEBHOOK_HEADERS,
  strablPublicConfig,
  verifyStrablSignature,
} from '@/lib/strabl';
import { notify } from '@/lib/email/notify';

/**
 * Strabl → Zamakan, server to server. There is no session here: the ONLY source
 * of trust is the signature over (id, timestamp, raw body). This endpoint is the
 * single place a booking can become PAID through Strabl — Strabl's own docs:
 * "Never fulfill an order based on a redirect alone."
 *
 * Strabl expects a 2xx within 10 s and retries once on anything else.
 * Exempt from the Origin CSRF check in src/proxy.ts.
 */
export async function POST(req: NextRequest) {
  // Raw body is required for the signature — never req.json() first.
  const raw = await req.text();

  const headers = {
    id: req.headers.get(STRABL_WEBHOOK_HEADERS.id),
    timestamp: req.headers.get(STRABL_WEBHOOK_HEADERS.timestamp),
    signature: req.headers.get(STRABL_WEBHOOK_HEADERS.signature),
  };
  if (!verifyStrablSignature(raw, headers)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const event = parseStrablWebhook(body);
  if (!event) {
    return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
  }

  // A validly signed event for a different merchant means a misconfiguration.
  const ours = strablPublicConfig().platformUuid;
  if (ours && event.platformUuid && event.platformUuid !== ours) {
    console.error(`[strabl] webhook for platform ${event.platformUuid} but we are ${ours}`);
    return NextResponse.json({ error: 'Unknown platform' }, { status: 400 });
  }

  if (!isPaidEvent(event)) {
    // Logged, not persisted: the paymentStatus vocabulary is undocumented, so
    // this line is how the real values get discovered. No customer data here.
    const log = event.eventType === 'order_refunded' || event.eventType === 'order_chargeback'
      ? console.warn
      : console.log;
    log(
      `[strabl] webhook ${event.eventType} for ${event.orderShortCode} ignored ` +
        `(paymentStatus=${event.paymentStatus || '-'}, status=${event.orderStatus || '-'})`
    );
    return NextResponse.json({ received: true, ignored: event.eventType, paymentStatus: event.paymentStatus });
  }

  try {
    const result = await markReferencePaid(event, body);

    if (result.isNew && result.status === 'PAID' && result.userId && result.referenceNumber) {
      // Non-fatal: notify() swallows email failures itself.
      await notify({
        userIds: [result.userId],
        title: 'Payment Received',
        message: `Payment of ${result.amount.toLocaleString()} SAR for booking ${result.referenceNumber} was received. Your booking is pending review.`,
        titleAr: 'تم استلام الدفع',
        messageAr: `تم استلام مبلغ ${result.amount.toLocaleString()} ريال للحجز ${result.referenceNumber}. حجزك قيد المراجعة.`,
        actionUrl: '/dashboard',
        actionLabel: 'View booking',
      });
    } else if (result.isNew) {
      // AMOUNT_MISMATCH: money recorded, bookings untouched.
      // UNMATCHED: nothing we could attach it to — Strabl's dashboard has the order.
      console.error(
        `[strabl] order ${event.orderShortCode} recorded as ${result.status} ` +
          `(ref ${result.referenceNumber ?? '-'}, ${result.amount} SAR, bookings ${event.bookingIds.join(',') || '-'}) — needs manual review`
      );
    }

    return NextResponse.json({ received: true, status: result.status });
  } catch (err) {
    // Two deliveries racing past findUnique: the unique index caught the second.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ received: true, status: 'DUPLICATE' });
    }
    console.error('[strabl] webhook failed:', err instanceof Error ? err.message : err);
    // 5xx so Strabl retries.
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}
