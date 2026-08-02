import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbToSpace, spaceFeaturesInclude } from '@/lib/spaceMapper';

export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      include: spaceFeaturesInclude,
    });
    return NextResponse.json(spaces.map(dbToSpace));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}
