import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  markReferencePaid,
  parseStrablWebhook,
  STRABL_SIGNATURE_HEADER,
  verifyStrablSignature,
} from '@/lib/strabl';
import { notify } from '@/lib/email/notify';

/**
 * Strabl → Zamakan, server to server. There is no session here: the ONLY source
 * of trust is the signature over the raw body. This endpoint is the single
 * place a booking can become PAID through Strabl.
 *
 * Exempt from the Origin CSRF check in src/proxy.ts for the same reason.
 */
export async function POST(req: NextRequest) {
  // Raw body is required for the signature — never req.json() first.
  const raw = await req.text();

  if (!verifyStrablSignature(raw, req.headers.get(STRABL_SIGNATURE_HEADER))) {
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

  // TODO(strabl): confirm the exact status value(s) that mean "paid".
  if (event.status !== 'PAID') {
    return NextResponse.json({ received: true, ignored: event.status });
  }

  try {
    const result = await markReferencePaid(event, body);

    if (result.isNew && result.status === 'PAID') {
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
      // AMOUNT_MISMATCH / UNMATCHED: money is recorded, bookings untouched.
      console.error(
        `[strabl] payment ${result.paymentId} recorded as ${result.status} ` +
          `(ref ${result.referenceNumber}, ${result.amount} SAR) — needs manual review`
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
