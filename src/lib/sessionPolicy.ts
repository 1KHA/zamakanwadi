// Single source of truth for session/idle policy.
// SESSION_IDLE_MINUTES is overridable so tests can run with a short window.

const idleMinutes = Number(process.env.NEXT_PUBLIC_SESSION_IDLE_MINUTES ?? process.env.SESSION_IDLE_MINUTES ?? 30);

export const IDLE_TIMEOUT_MINUTES = Number.isFinite(idleMinutes) && idleMinutes > 0 ? idleMinutes : 30;
export const IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MINUTES * 60 * 1000;

/** How long the JWT stays valid server-side; matches the idle window. */
export const SESSION_MAX_AGE_SECONDS = IDLE_TIMEOUT_MINUTES * 60;

/** How often NextAuth rewrites the session cookie (throttles token rotation). */
export const SESSION_UPDATE_AGE_SECONDS = Math.max(60, Math.floor(SESSION_MAX_AGE_SECONDS / 6));

/** Re-read the user's role from the DB when the token is older than this. */
export const ROLE_RECHECK_MS = 5 * 60 * 1000;

/** Don't record activity more than once per this interval. */
export const ACTIVITY_THROTTLE_MS = 30 * 1000;

/** How often the idle watcher ticks. */
export const IDLE_CHECK_INTERVAL_MS = 30 * 1000;

/** Roll the session forward at most this often, and only when the user is active. */
export const REFRESH_AFTER_MS = Math.min(10 * 60 * 1000, Math.floor(IDLE_TIMEOUT_MS / 3));

/** Shared across tabs so activity in one tab keeps the others alive. */
export const ACTIVITY_STORAGE_KEY = 'zamakan-last-activity';

export function shouldSignOut(now: number, lastActivity: number): boolean {
  return now - lastActivity >= IDLE_TIMEOUT_MS;
}

export function shouldRefresh(now: number, lastRefresh: number): boolean {
  return now - lastRefresh >= REFRESH_AFTER_MS;
}
