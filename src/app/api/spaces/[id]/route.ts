import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbToSpace, spaceFeaturesInclude } from '@/lib/spaceMapper';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const space = await prisma.space.findUnique({
      where: { id },
      include: spaceFeaturesInclude,
    });
    if (!space || !space.active) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }
    return NextResponse.json(dbToSpace(space));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch space' }, { status: 500 });
  }
}
