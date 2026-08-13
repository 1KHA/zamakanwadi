import type { Role } from '@prisma/client';

/**
 * Only same-origin relative paths are allowed as post-login destinations.
 * Rejects absolute URLs and protocol-relative/backslash tricks that browsers
 * normalise into an external origin (open-redirect).
 */
export function safeCallbackUrl(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;

  const value = raw.trim();
  if (!value.startsWith('/')) return null;
  // "//evil.com" and "/\evil.com" both resolve cross-origin
  if (value.startsWith('//') || value.startsWith('/\\')) return null;
  // control characters can be used to smuggle a scheme past naive checks
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;

  try {
    const parsed = new URL(value, 'http://localhost');
    if (parsed.origin !== 'http://localhost') return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

/** Where a user belongs after signing in, absent an explicit destination. */
export function homePathForRole(role: Role | string | undefined | null): string {
  return role === 'ADMIN' ? '/admin' : '/dashboard';
}

/** Resolve the post-login destination: validated callbackUrl, else role home. */
export function resolveLoginDestination(
  rawCallbackUrl: string | null | undefined,
  role: Role | string | undefined | null
): string {
  return safeCallbackUrl(rawCallbackUrl) ?? homePathForRole(role);
}
