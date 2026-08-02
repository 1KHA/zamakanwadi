import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { grantForBooking, refundAutoApplied, revokeForBooking } from '@/lib/entitlements';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
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

    const adminId = session?.user?.id ?? null;
    let grantedCount = 0;

    const updated = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        },
      });

      if (status === 'APPROVED' && existing.status !== 'APPROVED' && existing.spaceId) {
        const space = await tx.space.findUnique({
          where: { id: existing.spaceId },
          include: { spaceFeatures: { include: { feature: true } } },
        });
        if (space) {
          grantedCount = await grantForBooking(
            tx,
            { id: existing.id, userId: existing.userId, durationType: existing.durationType },
            space,
            space.spaceFeatures,
            adminId
          );
        }
      }

      if (status === 'CANCELLED' || status === 'REJECTED') {
        if (existing.status === 'APPROVED') {
          await revokeForBooking(tx, id, adminId);
        }
        await refundAutoApplied(tx, id, adminId);
      }

      return booking;
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
        ? `Your booking for ${existing.itemName} has been approved.${
            grantedCount > 0 ? ' Your package benefits have been added to your account.' : ''
          }`
        : status === 'REJECTED'
        ? `Your booking for ${existing.itemName} was rejected. Reason: ${rejectionReason || 'No reason provided.'}`
        : status === 'CANCELLED'
        ? `Your booking for ${existing.itemName} has been cancelled.${
            existing.status === 'APPROVED' ? ' Unused package benefits from this booking were removed.' : ''
          }`
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
  } catch {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
