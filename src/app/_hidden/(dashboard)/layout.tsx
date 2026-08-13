import Layout from '@/components/Layout';
import { requireUser } from '@/lib/serverSession';

/**
 * These pages are currently unroutable (the `_hidden` prefix makes the folder
 * private). The guard is here so that un-hiding them can never publish a
 * user-area page by accident.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <Layout>{children}</Layout>;
}
