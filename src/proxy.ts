import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { enforceRateLimit } from '@/lib/rateLimit';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Credential sign-in attempts allowed per IP per window. */
const SIGNIN_LIMIT = 10;
const SIGNIN_WINDOW_MS = 10 * 60 * 1000;

/** Routes requiring any signed-in user. */
const USER_PATHS = ['/dashboard', '/profile', '/payment'];

function isUnder(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Brute-force protection on credential sign-in ------------------------
  if (request.method === 'POST' && pathname.startsWith('/api/auth/callback/credentials')) {
    const limited = enforceRateLimit(request, 'signin', SIGNIN_LIMIT, SIGNIN_WINDOW_MS);
    if (limited) return limited;
  }

  // --- CSRF defence-in-depth for the custom API ---------------------------
  // sameSite=lax cookies are the primary defence; this rejects cross-site
  // mutations that still manage to carry credentials. A missing Origin (server
  // to server, curl, native clients) is allowed.
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && MUTATING_METHODS.has(request.method)) {
    const origin = request.headers.get('origin');
    if (origin) {
      const host = request.headers.get('host');
      let originHost = '';
      try {
        originHost = new URL(origin).host;
      } catch {
        originHost = '';
      }
      if (!host || originHost !== host) {
        return NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Admin area — /admin/signin must stay reachable or admins can never log in.
  if (isUnder(pathname, '/admin') && !isUnder(pathname, '/admin/signin')) {
    if (token?.role !== 'ADMIN') {
      const signInUrl = new URL('/admin/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (USER_PATHS.some((base) => isUnder(pathname, base))) {
    if (!token) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/payment/:path*',
    '/api/:path*',
  ],
};
