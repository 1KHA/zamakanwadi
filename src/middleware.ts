import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith('/admin') && pathname !== '/admin/signin') {
          return token?.role === 'ADMIN';
        }
        return true;
      },
    },
    pages: {
      signIn: '/admin/signin',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
