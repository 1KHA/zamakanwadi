import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

function maskDatabaseUrl(url?: string) {
  if (!url) return 'undefined';
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username}:****@${u.host}${u.pathname}${u.search}`;
  } catch {
    return 'invalid-url';
  }
}

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

    console.log('[contact-messages] DATABASE_URL is', maskDatabaseUrl(process.env.DATABASE_URL));

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[contact-messages] Fetched ${messages.length} messages`);
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('[contact-messages] Failed to fetch contact messages:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch contact messages',
        details: error?.message ?? String(error),
        code: error?.code ?? undefined,
      },
      { status: 500 }
    );
  }
}
