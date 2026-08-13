import Layout from '@/components/Layout';
import { requireUser } from '@/lib/serverSession';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Real server-side gate; the proxy is only an optimistic pre-check.
  await requireUser('/dashboard');
  return <Layout>{children}</Layout>;
}
