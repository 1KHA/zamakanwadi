import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');
    const date = searchParams.get('date');

    if (!spaceId || !date) {
      return NextResponse.json({ error: 'Missing spaceId or date' }, { status: 400 });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        spaceId,
        status: { not: 'REJECTED' },
        OR: [
          {
            startDate: { gte: startOfDay, lte: endOfDay },
          },
          {
            endDate: { gte: startOfDay, lte: endOfDay },
          },
          {
            AND: [
              { startDate: { lte: startOfDay } },
              { endDate: { gte: endOfDay } },
            ],
          },
        ],
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
