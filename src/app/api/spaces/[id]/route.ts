import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function dbToSpace(space: {
  id: string;
  category: string;
  type: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number;
  periodAr: string;
  periodEn: string;
  capacity: string;
  featuresAr: string[];
  featuresEn: string[];
  images: string[];
  durationOptions: unknown;
  active: boolean;
}) {
  return {
    id: space.id,
    category: space.category,
    type: space.type,
    title: { ar: space.titleAr, en: space.titleEn },
    desc: { ar: space.descAr, en: space.descEn },
    price: space.price,
    period: { ar: space.periodAr, en: space.periodEn },
    capacity: space.capacity,
    features: { ar: space.featuresAr, en: space.featuresEn },
    images: space.images,
    durationOptions: space.durationOptions as {
      value: string;
      label: { ar: string; en: string };
      multiplier: number;
    }[],
    active: space.active,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const space = await prisma.space.findUnique({ where: { id } });
    if (!space || !space.active) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }
    return NextResponse.json(dbToSpace(space));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch space' }, { status: 500 });
  }
}
