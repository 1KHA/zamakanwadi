import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }
        if (
          req.nextUrl.pathname.startsWith('/profile') ||
          req.nextUrl.pathname.startsWith('/cart') ||
          req.nextUrl.pathname.startsWith('/data-agreement')
        ) {
          return token !== null;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/profile/:path*', '/cart/:path*', '/data-agreement/:path*', '/admin/:path*'],
};
