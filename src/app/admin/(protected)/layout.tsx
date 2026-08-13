import { requireAdminPage } from '@/lib/serverSession';

/**
 * Guards every admin page. Deliberately scoped to the (protected) group so
 * /admin/signin — which lives outside it — is not guarded by its own guard.
 */
export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <>{children}</>;
}
