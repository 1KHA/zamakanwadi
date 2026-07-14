import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { HourlyPriceTier } from '@/lib/spaces';

export interface SpacePayload {
  id: string;
  category: 'offices' | 'meeting' | 'theater';
  type: 'workspace' | 'meeting' | 'theater';
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  price: number;
  period: { ar: string; en: string };
  capacity: string;
  features: { ar: string[]; en: string[] };
  images: string[];
  durationOptions: { value: string; label: { ar: string; en: string }; multiplier: number }[];
  hourlyPrices?: HourlyPriceTier[];
  active?: boolean;
}

function payloadToPrisma(data: SpacePayload) {
  return {
    id: data.id,
    category: data.category,
    type: data.type,
    titleAr: data.title.ar,
    titleEn: data.title.en,
    descAr: data.desc.ar,
    descEn: data.desc.en,
    price: data.price,
    periodAr: data.period.ar,
    periodEn: data.period.en,
    capacity: data.capacity,
    featuresAr: data.features.ar,
    featuresEn: data.features.en,
    images: data.images,
    durationOptions: data.durationOptions as Prisma.InputJsonValue,
    hourlyPrices: (data.hourlyPrices as unknown) as Prisma.InputJsonValue | undefined,
    active: data.active ?? true,
  };
}

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
    durationOptions: space.durationOptions as SpacePayload['durationOptions'],
    hourlyPrices: space.hourlyPrices as SpacePayload['hourlyPrices'],
    active: space.active,
  };
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const spaces = await prisma.space.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(spaces.map(dbToSpace));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body: SpacePayload = await req.json();

    if (!body.id || !body.category || !body.type || !body.title?.ar || !body.title?.en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.space.findUnique({ where: { id: body.id } });
    if (existing) {
      return NextResponse.json({ error: 'Space ID already exists' }, { status: 409 });
    }

    const created = await prisma.space.create({ data: payloadToPrisma(body) });
    return NextResponse.json(dbToSpace(created), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
  }
}
