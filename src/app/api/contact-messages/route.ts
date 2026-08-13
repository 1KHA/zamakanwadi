import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token?.role !== 'ADMIN') {
      console.warn('[contact-messages] Unauthorized access attempt', {
        pathname: request.nextUrl.pathname,
        role: token?.role ?? 'no-token',
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[contact-messages] Fetched ${messages.length} messages`);
    return NextResponse.json(messages);
  } catch (error: unknown) {
    // Log server-side only — Prisma messages carry query/schema internals.
    console.error('[contact-messages] Failed to fetch contact messages:', error);
    return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 });
  }
}
