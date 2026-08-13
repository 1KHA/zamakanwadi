import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { entitlementId, amount, note } = body;

    if (!entitlementId || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid claim amount' }, { status: 400 });
    }

    const entitlement = await prisma.entitlement.findUnique({ where: { id: entitlementId } });
    if (!entitlement || entitlement.userId !== user.id) {
      return NextResponse.json({ error: 'Entitlement not found' }, { status: 404 });
    }
    if (entitlement.revoked) {
      return NextResponse.json({ error: 'This entitlement has been revoked' }, { status: 400 });
    }

    const available = entitlement.totalAmount - entitlement.usedAmount;
    if (amount > available) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Conditional update: the balance is re-checked by the database itself,
      // so two concurrent claims can't both pass a stale read and overdraw.
      const claimed = await tx.entitlement.updateMany({
        where: {
          id: entitlementId,
          userId: user.id,
          revoked: false,
          usedAmount: { lte: entitlement.totalAmount - amount },
        },
        data: { usedAmount: { increment: amount } },
      });

      if (claimed.count === 0) return null;

      await tx.entitlementLedger.create({
        data: {
          entitlementId,
          userId: user.id,
          action: 'CLAIM',
          amount,
          note: note || null,
          actorId: user.id,
          actorRole: 'USER',
        },
      });

      return tx.entitlement.findUnique({ where: { id: entitlementId } });
    });

    if (!updated) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    return NextResponse.json({
      id: updated.id,
      totalAmount: updated.totalAmount,
      usedAmount: updated.usedAmount,
      available: Math.max(0, updated.totalAmount - updated.usedAmount),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to claim' }, { status: 500 });
  }
}
