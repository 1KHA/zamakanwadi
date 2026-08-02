import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const adminId = session?.user?.id ?? null;

    const entitlement = await prisma.entitlement.findUnique({ where: { id } });
    if (!entitlement) {
      return NextResponse.json({ error: 'Entitlement not found' }, { status: 404 });
    }
    if (entitlement.revoked) {
      return NextResponse.json({ error: 'This entitlement has been revoked' }, { status: 400 });
    }

    // Claim on behalf of the user
    if (typeof body.claimAmount === 'number') {
      const amount = body.claimAmount;
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({ error: 'Invalid claim amount' }, { status: 400 });
      }
      const available = entitlement.totalAmount - entitlement.usedAmount;
      if (amount > available) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }
      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.entitlement.update({
          where: { id },
          data: { usedAmount: entitlement.usedAmount + amount },
        });
        await tx.entitlementLedger.create({
          data: {
            entitlementId: id,
            userId: entitlement.userId,
            action: 'CLAIM',
            amount,
            note: body.note || null,
            actorId: adminId,
            actorRole: 'ADMIN',
          },
        });
        return result;
      });
      return NextResponse.json(updated);
    }

    // Adjust total amount
    if (typeof body.totalAmount === 'number') {
      const total = body.totalAmount;
      if (!Number.isFinite(total) || total < entitlement.usedAmount) {
        return NextResponse.json(
          { error: 'Total cannot be lower than the amount already used' },
          { status: 400 }
        );
      }
      const delta = total - entitlement.totalAmount;
      if (delta === 0) return NextResponse.json(entitlement);
      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.entitlement.update({
          where: { id },
          data: { totalAmount: total },
        });
        await tx.entitlementLedger.create({
          data: {
            entitlementId: id,
            userId: entitlement.userId,
            action: 'ADJUST',
            amount: Math.abs(delta),
            note: body.note || `Total ${delta > 0 ? 'increased' : 'decreased'} by admin`,
            actorId: adminId,
            actorRole: 'ADMIN',
          },
        });
        return result;
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to update entitlement' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const adminId = session?.user?.id ?? null;

    const entitlement = await prisma.entitlement.findUnique({ where: { id } });
    if (!entitlement) {
      return NextResponse.json({ error: 'Entitlement not found' }, { status: 404 });
    }

    if (entitlement.usedAmount === 0) {
      await prisma.entitlement.delete({ where: { id } });
      return NextResponse.json({ success: true, deleted: true });
    }

    // Partially used: revoke the remaining balance instead of deleting history
    const remaining = entitlement.totalAmount - entitlement.usedAmount;
    await prisma.$transaction(async (tx) => {
      await tx.entitlement.update({
        where: { id },
        data: { totalAmount: entitlement.usedAmount, revoked: true },
      });
      if (remaining > 0) {
        await tx.entitlementLedger.create({
          data: {
            entitlementId: id,
            userId: entitlement.userId,
            action: 'REVOKE',
            amount: remaining,
            actorId: adminId,
            actorRole: 'ADMIN',
          },
        });
      }
    });
    return NextResponse.json({ success: true, revoked: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete entitlement' }, { status: 500 });
  }
}
