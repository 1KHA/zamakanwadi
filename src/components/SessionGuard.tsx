'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  ACTIVITY_STORAGE_KEY,
  ACTIVITY_THROTTLE_MS,
  IDLE_CHECK_INTERVAL_MS,
  shouldRefresh,
  shouldSignOut,
} from '@/lib/sessionPolicy';

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'] as const;

/**
 * Signs the user out after a period of inactivity, and rolls the session
 * forward while they are active.
 *
 * Deliberately does NOT use SessionProvider's refetchInterval: background
 * polling would renew an idle tab's token and defeat the timeout entirely.
 */
export default function SessionGuard() {
  const { status, update } = useSession();
  // Seeded in the effect — Date.now() is impure and must not run during render.
  const lastActivity = useRef(0);
  const lastRefresh = useRef(0);
  const signingOut = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const startedAt = Date.now();
    lastActivity.current = startedAt;
    lastRefresh.current = startedAt;

    const readShared = () => {
      try {
        const stored = Number(window.localStorage.getItem(ACTIVITY_STORAGE_KEY));
        return Number.isFinite(stored) ? stored : 0;
      } catch {
        return 0;
      }
    };

    const writeShared = (value: number) => {
      try {
        window.localStorage.setItem(ACTIVITY_STORAGE_KEY, String(value));
      } catch {
        // private mode / storage disabled — in-memory tracking still works
      }
    };

    // Seed from other tabs so opening a new tab doesn't reset a stale clock.
    lastActivity.current = Math.max(lastActivity.current, readShared());
    writeShared(lastActivity.current);

    const recordActivity = () => {
      const now = Date.now();
      if (now - lastActivity.current < ACTIVITY_THROTTLE_MS) return;
      lastActivity.current = now;
      writeShared(now);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') recordActivity();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, recordActivity, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibility);

    const interval = window.setInterval(async () => {
      const now = Date.now();
      const latest = Math.max(lastActivity.current, readShared());
      lastActivity.current = latest;

      if (shouldSignOut(now, latest)) {
        if (signingOut.current) return;
        signingOut.current = true;
        writeShared(0);
        await signOut({ callbackUrl: '/signin?expired=1' });
        return;
      }

      // Active user: roll the JWT forward so it never expires under them.
      if (shouldRefresh(now, lastRefresh.current)) {
        lastRefresh.current = now;
        await update();
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, recordActivity);
      }
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, [status, update]);

  return null;
}
