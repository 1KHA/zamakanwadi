import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const requests = await prisma.purchaseRequest.findMany({
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch purchase requests' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { id, status, rejectionReason } = body;

    if (!id || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const existing = await prisma.purchaseRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Purchase request not found' }, { status: 404 });
    }
    if (existing.status !== 'PENDING') {
      return NextResponse.json({ error: 'Request has already been decided' }, { status: 400 });
    }

    const adminId = session?.user?.id ?? null;

    const updated = await prisma.$transaction(async (tx) => {
      const request = await tx.purchaseRequest.update({
        where: { id },
        data: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason || null : null,
          decidedAt: new Date(),
          decidedById: adminId,
        },
      });

      if (status === 'APPROVED') {
        const feature = await tx.feature.findUnique({ where: { id: existing.featureId } });
        const entitlement = await tx.entitlement.create({
          data: {
            userId: existing.userId,
            featureId: existing.featureId,
            nameAr: existing.nameAr,
            nameEn: existing.nameEn,
            kind: existing.kind,
            category: feature?.category ?? null,
            totalAmount: existing.amount,
            source: 'PURCHASE',
            purchaseRequestId: existing.id,
          },
        });
        await tx.entitlementLedger.create({
          data: {
            entitlementId: entitlement.id,
            userId: existing.userId,
            action: 'GRANT',
            amount: existing.amount,
            note: 'Purchase approved',
            actorId: adminId,
            actorRole: 'ADMIN',
          },
        });
      }

      return request;
    });

    await prisma.notification.create({
      data: {
        userId: existing.userId,
        title: status === 'APPROVED' ? 'Purchase Approved' : 'Purchase Rejected',
        message:
          status === 'APPROVED'
            ? `Your purchase of ${existing.amount} × ${existing.nameEn} was approved and added to your account.`
            : `Your purchase of ${existing.amount} × ${existing.nameEn} was rejected.${
                rejectionReason ? ` Reason: ${rejectionReason}` : ''
              }`,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update purchase request' }, { status: 500 });
  }
}
