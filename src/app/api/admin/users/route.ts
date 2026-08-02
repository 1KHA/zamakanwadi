import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const query = req.nextUrl.searchParams.get('query')?.trim() || '';
    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: { id: true, name: true, email: true, phone: true, role: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}
