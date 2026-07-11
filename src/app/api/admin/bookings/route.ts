import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        office: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    });

    // Create user notification
    const title =
      status === 'APPROVED'
        ? 'Booking Approved'
        : status === 'REJECTED'
        ? 'Booking Rejected'
        : status === 'CANCELLED'
        ? 'Booking Cancelled'
        : status === 'COMPLETED'
        ? 'Booking Completed'
        : 'Booking Updated';

    const message =
      status === 'APPROVED'
        ? `Your booking for ${existing.itemName} has been approved.`
        : status === 'REJECTED'
        ? `Your booking for ${existing.itemName} was rejected. Reason: ${rejectionReason || 'No reason provided.'}`
        : status === 'CANCELLED'
        ? `Your booking for ${existing.itemName} has been cancelled.`
        : status === 'COMPLETED'
        ? `Your booking for ${existing.itemName} has been completed.`
        : `Your booking for ${existing.itemName} has been updated.`;

    await prisma.notification.create({
      data: {
        userId: existing.userId,
        title,
        message,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
