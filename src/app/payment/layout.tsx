import Layout from '@/components/Layout';
import { requireUser } from '@/lib/serverSession';

export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await requireUser('/payment');
  return <Layout>{children}</Layout>;
}
