import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { SpacePayload } from '../route';

function payloadToPrisma(data: Partial<SpacePayload>) {
  const result: Record<string, unknown> = {};
  if (data.category) result.category = data.category;
  if (data.type) result.type = data.type;
  if (data.title) {
    result.titleAr = data.title.ar;
    result.titleEn = data.title.en;
  }
  if (data.desc) {
    result.descAr = data.desc.ar;
    result.descEn = data.desc.en;
  }
  if (typeof data.price === 'number') result.price = data.price;
  if (data.period) {
    result.periodAr = data.period.ar;
    result.periodEn = data.period.en;
  }
  if (data.capacity) result.capacity = data.capacity;
  if (data.features) {
    result.featuresAr = data.features.ar;
    result.featuresEn = data.features.en;
  }
  if (data.images) result.images = data.images;
  if (data.durationOptions) result.durationOptions = data.durationOptions as Prisma.InputJsonValue;
  if (typeof data.active === 'boolean') result.active = data.active;
  return result;
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body: Partial<SpacePayload> = await req.json();

    const existing = await prisma.space.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    const updated = await prisma.space.update({
      where: { id },
      data: payloadToPrisma(body),
    });
    return NextResponse.json(dbToSpace(updated));
  } catch {
    return NextResponse.json({ error: 'Failed to update space' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const existing = await prisma.space.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    await prisma.space.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete space' }, { status: 500 });
  }
}
