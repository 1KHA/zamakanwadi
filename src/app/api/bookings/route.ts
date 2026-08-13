import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import {
  applyHours,
  computeServerTotal,
  parseHourlyDuration,
  partialCoveragePrice,
} from '@/lib/entitlements';
import type { HourlyPriceTier } from '@/lib/spaces';
import { bookingSchema, firstIssue } from '@/lib/validation';
import { randomBytes } from 'crypto';

const REFERENCE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateReference() {
  const bytes = randomBytes(6);
  let out = '';
  for (const byte of bytes) out += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  return `ZMK-${out}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { office: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const rawBody = await req.json();
    const parsed = bookingSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
    }
    const body = parsed.data;

    function combineDateTime(date: string, time?: string | null) {
      if (!date) return null;
      const result = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        result.setHours(hours, minutes, 0, 0);
      }
      return result;
    }

    const space = await prisma.space.findUnique({ where: { id: body.spaceId } });
    if (!space || !space.active) {
      return NextResponse.json({ error: 'Space not found' }, { status: 400 });
    }

    // The server prices every booking. If the duration can't be resolved we
    // refuse rather than falling back to a client-supplied total — that
    // fallback previously allowed booking for 0 SAR.
    const serverTotal = computeServerTotal(space, body.durationType);
    if (serverTotal === null || !Number.isFinite(serverTotal) || serverTotal < 0) {
      return NextResponse.json({ error: 'Invalid duration for this space' }, { status: 400 });
    }

    // Online (demo) payment applies to offices booked monthly/quarterly and to
    // hourly meeting/theater bookings; yearly offices stay on the
    // request → admin-approval flow (handled manually with the client).
    const isHourlySpace = space?.type === 'meeting' || space?.type === 'theater';
    const requiresPayment =
      (space?.type === 'workspace' && ['monthly', 'quarterly'].includes(body.durationType)) ||
      isHourlySpace;

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          userId: user.id,
          officeId: body.officeId,
          itemType: body.itemType,
          itemName: body.itemName,
          itemNameAr: body.itemNameAr,
          total: serverTotal,
          originalTotal: serverTotal,
          appliedHours: 0,
          paymentStatus: requiresPayment && serverTotal > 0 ? 'PENDING_PAYMENT' : 'NOT_REQUIRED',
          startDate: combineDateTime(body.startDate, body.startTime),
          endDate: combineDateTime(body.endDate || body.startDate, body.endTime),
          durationType: body.durationType,
          referenceNumber: body.referenceNumber || generateReference(),
          spaceId: body.spaceId,
          notes: body.notes,
        },
      });

      const hours = parseHourlyDuration(body.durationType);
      if (space && hours !== null && (space.type === 'meeting' || space.type === 'theater')) {
        const { coveredHours } = await applyHours(tx, user.id, space.type, hours, created.id);
        if (coveredHours > 0) {
          const total = partialCoveragePrice(
            hours,
            coveredHours,
            (space.hourlyPrices as unknown) as HourlyPriceTier[] | undefined,
            space.price
          );
          return tx.booking.update({
            where: { id: created.id },
            data: {
              total,
              appliedHours: coveredHours,
              // Fully covered by included hours → nothing left to pay
              ...(total <= 0 ? { paymentStatus: 'NOT_REQUIRED' as const } : {}),
            },
          });
        }
      }

      return created;
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
