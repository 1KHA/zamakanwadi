import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getSessionUser } from '@/lib/serverSession';
import { homePathForRole } from '@/lib/redirects';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Already signed in? Don't offer a login form — send them home.
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}
