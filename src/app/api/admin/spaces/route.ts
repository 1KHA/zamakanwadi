import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import {
  dbToSpace,
  payloadToPrisma,
  spaceFeaturesInclude,
  syncSpaceFeatures,
  type SpacePayload,
} from '@/lib/spaceMapper';

export type { SpacePayload };

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const spaces = await prisma.space.findMany({
      orderBy: { createdAt: 'asc' },
      include: spaceFeaturesInclude,
    });
    return NextResponse.json(spaces.map(dbToSpace));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body: SpacePayload = await req.json();

    if (!body.id || !body.category || !body.type || !body.title?.ar || !body.title?.en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.space.findUnique({ where: { id: body.id } });
    if (existing) {
      return NextResponse.json({ error: 'Space ID already exists' }, { status: 409 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const space = await tx.space.create({ data: payloadToPrisma(body) });
      if (Array.isArray(body.catalogFeatures)) {
        await syncSpaceFeatures(tx, space.id, body.catalogFeatures);
      }
      return tx.space.findUniqueOrThrow({ where: { id: space.id }, include: spaceFeaturesInclude });
    });
    return NextResponse.json(dbToSpace(created), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
  }
}
