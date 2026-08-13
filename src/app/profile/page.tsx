import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/serverSession';

/**
 * The profile lives as a tab inside the dashboard. This route exists so
 * /profile (and any deep link to it) lands there instead of a 404.
 */
export default async function ProfilePage() {
  await requireUser('/profile');
  redirect('/dashboard?tab=profile');
}
