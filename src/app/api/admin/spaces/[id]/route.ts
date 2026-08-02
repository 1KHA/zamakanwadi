import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import {
  dbToSpace,
  partialPayloadToPrisma,
  spaceFeaturesInclude,
  syncSpaceFeatures,
  type SpacePayload,
} from '@/lib/spaceMapper';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body: Partial<SpacePayload> = await req.json();

    const existing = await prisma.space.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.space.update({
        where: { id },
        data: partialPayloadToPrisma(body),
      });
      if (Array.isArray(body.catalogFeatures)) {
        await syncSpaceFeatures(tx, id, body.catalogFeatures);
      }
      return tx.space.findUniqueOrThrow({ where: { id }, include: spaceFeaturesInclude });
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
  const { error } = await requireAdmin();
  if (error) return error;

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
