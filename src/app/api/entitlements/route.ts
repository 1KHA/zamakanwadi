import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const category = req.nextUrl.searchParams.get('category');

    const entitlements = await prisma.entitlement.findMany({
      where: {
        userId: user.id,
        revoked: false,
        ...(category ? { category, kind: 'TIME' } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    const ledger = await prisma.entitlementLedger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      entitlements: entitlements.map((e) => ({
        id: e.id,
        featureId: e.featureId,
        name: { ar: e.nameAr, en: e.nameEn },
        kind: e.kind,
        category: e.category,
        totalAmount: e.totalAmount,
        usedAmount: e.usedAmount,
        available: Math.max(0, e.totalAmount - e.usedAmount),
        source: e.source,
        bookingId: e.bookingId,
        revoked: e.revoked,
        createdAt: e.createdAt,
      })),
      ledger,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entitlements' }, { status: 500 });
  }
}
