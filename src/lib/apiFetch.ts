'use client';

import { signOut } from 'next-auth/react';

let handlingExpiry = false;

/**
 * fetch() wrapper for authenticated calls. A 401 means the session expired,
 * so send the user to sign in rather than rendering a misleading empty state.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401 && !handlingExpiry) {
    handlingExpiry = true;
    try {
      window.localStorage.removeItem('zamakan-last-activity');
    } catch {
      // ignore storage failures
    }
    await signOut({ callbackUrl: '/signin?expired=1' });
  }

  return res;
}
