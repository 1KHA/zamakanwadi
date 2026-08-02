import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const [entitlements, ledger] = await Promise.all([
      prisma.entitlement.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.entitlementLedger.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    return NextResponse.json({
      entitlements: entitlements.map((e) => ({
        ...e,
        available: Math.max(0, e.totalAmount - e.usedAmount),
      })),
      ledger,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entitlements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { userId, featureId, amount, note } = body;

    if (!userId || !featureId || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid grant' }, { status: 400 });
    }

    const [user, feature] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.feature.findUnique({ where: { id: featureId } }),
    ]);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!feature) return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    if (feature.kind === 'INFO') {
      return NextResponse.json({ error: 'INFO features cannot be granted as balances' }, { status: 400 });
    }

    const adminId = session?.user?.id ?? null;

    const entitlement = await prisma.$transaction(async (tx) => {
      const created = await tx.entitlement.create({
        data: {
          userId,
          featureId: feature.id,
          nameAr: feature.nameAr,
          nameEn: feature.nameEn,
          kind: feature.kind,
          category: feature.category,
          totalAmount: amount,
          source: 'ADMIN',
        },
      });
      await tx.entitlementLedger.create({
        data: {
          entitlementId: created.id,
          userId,
          action: 'GRANT',
          amount,
          note: note || null,
          actorId: adminId,
          actorRole: 'ADMIN',
        },
      });
      return created;
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Service Added',
        message: `${amount} × ${feature.nameEn} has been added to your account.`,
      },
    });

    return NextResponse.json(entitlement, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to grant entitlement' }, { status: 500 });
  }
}
