import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { validateFeaturePayload, type FeaturePayload } from '@/lib/featureValidation';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body: FeaturePayload = await req.json();

    const existing = await prisma.feature.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    // Validate the merged result so e.g. switching kind to TIME requires a category
    const merged: FeaturePayload = {
      kind: body.kind ?? existing.kind,
      nameAr: body.nameAr ?? existing.nameAr,
      nameEn: body.nameEn ?? existing.nameEn,
      category: body.category !== undefined ? body.category : existing.category,
      unitPrice: body.unitPrice !== undefined ? body.unitPrice : existing.unitPrice,
      purchasable: body.purchasable ?? existing.purchasable,
    };
    if (body.id !== undefined && body.id !== id) {
      return NextResponse.json({ error: 'id cannot be changed' }, { status: 400 });
    }
    const invalid = validateFeaturePayload(merged, true);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

    const updated = await prisma.feature.update({
      where: { id },
      data: {
        kind: merged.kind as 'INFO' | 'TIME' | 'QUANTITY',
        nameAr: merged.nameAr!.trim(),
        nameEn: merged.nameEn!.trim(),
        descAr: body.descAr !== undefined ? body.descAr : existing.descAr,
        descEn: body.descEn !== undefined ? body.descEn : existing.descEn,
        category: merged.category ?? null,
        unitPrice: merged.unitPrice ?? null,
        purchasable: merged.purchasable ?? false,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : existing.sortOrder,
        active: body.active !== undefined ? body.active : existing.active,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const existing = await prisma.feature.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    const [spaceRefs, purchaseRefs] = await Promise.all([
      prisma.spaceFeature.count({ where: { featureId: id } }),
      prisma.purchaseRequest.count({ where: { featureId: id } }),
    ]);

    if (spaceRefs > 0 || purchaseRefs > 0) {
      await prisma.feature.update({ where: { id }, data: { active: false } });
      return NextResponse.json({ deactivated: true });
    }

    await prisma.feature.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
