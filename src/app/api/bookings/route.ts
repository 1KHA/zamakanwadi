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

function generateReference() {
  return 'ZMK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
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

    const body = await req.json();

    function combineDateTime(date: string, time?: string) {
      if (!date) return null;
      const result = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        result.setHours(hours, minutes, 0, 0);
      }
      return result;
    }

    const space = body.spaceId
      ? await prisma.space.findUnique({ where: { id: body.spaceId } })
      : null;

    // Server-side pricing when the space and duration are resolvable;
    // client total is only a fallback for legacy items without a spaceId.
    const serverTotal = space ? computeServerTotal(space, body.durationType) ?? body.total : body.total;

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
            data: { total, appliedHours: coveredHours },
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
