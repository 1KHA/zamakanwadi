import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const features = await prisma.feature.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(
      features.map((f) => ({
        id: f.id,
        kind: f.kind,
        name: { ar: f.nameAr, en: f.nameEn },
        desc: { ar: f.descAr, en: f.descEn },
        category: f.category,
        unitPrice: f.unitPrice,
        purchasable: f.purchasable,
        sortOrder: f.sortOrder,
        active: f.active,
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}
