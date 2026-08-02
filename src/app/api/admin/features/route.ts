import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { validateFeaturePayload, type FeaturePayload } from '@/lib/featureValidation';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const features = await prisma.feature.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(features);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body: FeaturePayload = await req.json();
    const invalid = validateFeaturePayload(body, false);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

    const existing = await prisma.feature.findUnique({ where: { id: body.id! } });
    if (existing) {
      return NextResponse.json({ error: 'Feature ID already exists' }, { status: 409 });
    }

    const created = await prisma.feature.create({
      data: {
        id: body.id!,
        kind: body.kind as 'INFO' | 'TIME' | 'QUANTITY',
        nameAr: body.nameAr!.trim(),
        nameEn: body.nameEn!.trim(),
        descAr: body.descAr ?? null,
        descEn: body.descEn ?? null,
        category: body.category ?? null,
        unitPrice: body.unitPrice ?? null,
        purchasable: body.purchasable ?? false,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}
