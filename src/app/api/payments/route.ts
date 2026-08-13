import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rateLimit';
import { firstIssue, paymentSchema } from '@/lib/validation';

// DEMO ONLY — no real payment gateway. Card details are validated for shape
// and never stored beyond the last 4 digits.

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ref = req.nextUrl.searchParams.get('ref');
    if (!ref) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id, referenceNumber: ref, paymentStatus: 'PENDING_PAYMENT' },
      select: {
        id: true,
        itemName: true,
        itemNameAr: true,
        total: true,
        durationType: true,
        startDate: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const amountDue = bookings.reduce((sum, b) => sum + b.total, 0);
    return NextResponse.json({ reference: ref, bookings, amountDue });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch payment details' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'payments', 20, 10 * 60 * 1000);
  if (limited) return limited;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = paymentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    }
    const { referenceNumber, cardNumber } = parsed.data;

    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) {
      return NextResponse.json({ error: 'Invalid card details' }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id, referenceNumber, paymentStatus: 'PENDING_PAYMENT' },
    });
    if (bookings.length === 0) {
      return NextResponse.json({ error: 'Nothing to pay for this reference' }, { status: 400 });
    }

    const amount = bookings.reduce((sum, b) => sum + b.total, 0);
    const paidAt = new Date();

    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          userId: user.id,
          referenceNumber,
          amount,
          method: 'card',
          cardLast4: digits.slice(-4),
          status: 'PAID',
        },
      });
      await tx.booking.updateMany({
        where: { id: { in: bookings.map((b) => b.id) } },
        data: { paymentStatus: 'PAID', paidAt },
      });
      return created;
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Payment Received',
        message: `Payment of ${amount.toLocaleString()} SAR for booking ${referenceNumber} was received. Your booking is pending review.`,
      },
    });

    return NextResponse.json({ success: true, paymentId: payment.id, amount });
  } catch {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
