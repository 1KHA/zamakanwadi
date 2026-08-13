import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * Data Access Layer for auth. The proxy (src/proxy.ts) is only an optimistic
 * check — per the Next.js docs it "should not be your only line of defense".
 * These run on the server, close to the data, and are the real gate.
 */

export const getSessionUser = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user;
});

/** Require any signed-in user; redirects to sign-in preserving the destination. */
export async function requireUser(callbackPath?: string) {
  const user = await getSessionUser();
  if (!user) {
    const target = callbackPath
      ? `/signin?callbackUrl=${encodeURIComponent(callbackPath)}`
      : '/signin';
    redirect(target);
  }
  return user;
}

/** Require an ADMIN; anyone else goes to the admin sign-in page. */
export async function requireAdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/signin');
  }
  return user;
}
