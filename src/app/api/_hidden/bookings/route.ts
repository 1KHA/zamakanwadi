import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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
  } catch (error) {
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

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        officeId: body.officeId,
        itemType: body.itemType,
        itemName: body.itemName,
        itemNameAr: body.itemNameAr,
        total: body.total,
        startDate: combineDateTime(body.startDate, body.startTime),
        endDate: combineDateTime(body.endDate || body.startDate, body.endTime),
        durationType: body.durationType,
        referenceNumber: body.referenceNumber || generateReference(),
        spaceId: body.spaceId,
        notes: body.notes,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
