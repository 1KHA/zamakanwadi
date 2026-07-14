import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { HourlyPriceTier } from '@/lib/spaces';

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
  hourlyPrices: unknown;
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
    hourlyPrices: space.hourlyPrices as HourlyPriceTier[] | undefined,
    active: space.active,
  };
}

export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(spaces.map(dbToSpace));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}
