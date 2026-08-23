import { randomInt } from 'crypto';
import { hash, compare } from 'bcryptjs';
import type { OtpPurpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendEmail } from './transport';
import { renderOtpEmail, type Locale } from './templates';

/**
 * One-time passcodes.
 *
 * Not wired into any existing flow — signin/signup are untouched. These are
 * the building blocks for enabling OTP later.
 *
 * Security posture matches the rest of the app: codes are stored hashed,
 * expire, are single-use, and are attempt-limited so a 6-digit code cannot be
 * brute-forced (1M combinations would otherwise fall in minutes).
 */

export const OTP_LENGTH = 6;
export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
/** Don't let one address request an unlimited number of codes. */
export const OTP_MAX_ACTIVE_PER_WINDOW = 5;
export const OTP_REQUEST_WINDOW_MINUTES = 15;

export type { OtpPurpose };

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Cryptographically-random numeric code, zero-padded to OTP_LENGTH. */
export function generateOtpCode(length = OTP_LENGTH): string {
  const max = 10 ** length;
  return String(randomInt(0, max)).padStart(length, '0');
}

export interface CreateOtpResult {
  /** Plaintext code — only ever returned here, to hand to the mailer. */
  code: string;
  expiresAt: Date;
}

/**
 * Issue a code for (email, purpose). Any earlier unconsumed codes for the same
 * pair are invalidated so only the newest one works.
 */
export async function createOtp(
  email: string,
  purpose: OtpPurpose
): Promise<CreateOtpResult> {
  const normalised = normaliseEmail(email);
  const now = new Date();

  const recentCount = await prisma.emailOtp.count({
    where: {
      email: normalised,
      purpose,
      createdAt: { gte: new Date(now.getTime() - OTP_REQUEST_WINDOW_MINUTES * 60_000) },
    },
  });
  if (recentCount >= OTP_MAX_ACTIVE_PER_WINDOW) {
    throw new Error('Too many verification codes requested. Please try again later.');
  }

  const code = generateOtpCode();
  const codeHash = await hash(code, 10);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60_000);

  await prisma.$transaction(async (tx) => {
    // Supersede outstanding codes so only the newest is valid.
    await tx.emailOtp.updateMany({
      where: { email: normalised, purpose, consumedAt: null },
      data: { consumedAt: now },
    });
    await tx.emailOtp.create({
      data: { email: normalised, purpose, codeHash, expiresAt },
    });
  });

  return { code, expiresAt };
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'expired' | 'too_many_attempts' | 'mismatch' };

/**
 * Check a submitted code and consume it on success.
 * Always returns a result rather than throwing, so callers can map reasons to
 * their own generic user-facing message without leaking which part failed.
 */
export async function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  code: string
): Promise<VerifyOtpResult> {
  const normalised = normaliseEmail(email);

  const record = await prisma.emailOtp.findFirst({
    where: { email: normalised, purpose, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) return { ok: false, reason: 'not_found' };
  if (record.expiresAt.getTime() <= Date.now()) return { ok: false, reason: 'expired' };
  if (record.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: 'too_many_attempts' };

  const matches = await compare(String(code ?? ''), record.codeHash);
  if (!matches) {
    await prisma.emailOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: 'mismatch' };
  }

  await prisma.emailOtp.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });
  return { ok: true };
}

/**
 * Issue a code and email it. Returns whether mail actually went out — when the
 * transport is dormant the code is still created, so a caller can be wired up
 * and tested before Mandrill is switched on.
 */
export async function sendOtp(params: {
  email: string;
  purpose: OtpPurpose;
  locale?: Locale;
  name?: string | null;
}): Promise<{ sent: boolean; transport: string; expiresAt: Date }> {
  const { email, purpose, locale = 'ar', name } = params;

  const { code, expiresAt } = await createOtp(email, purpose);
  const rendered = renderOtpEmail({
    code,
    locale,
    expiresInMinutes: OTP_TTL_MINUTES,
    name,
  });

  const result = await sendEmail({
    to: normaliseEmail(email),
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: ['otp', purpose.toLowerCase()],
  });

  return { sent: result.sent, transport: result.transport, expiresAt };
}

/** Housekeeping: drop expired/consumed rows. Safe to run from a cron. */
export async function purgeExpiredOtps(olderThan = new Date()): Promise<number> {
  const { count } = await prisma.emailOtp.deleteMany({
    where: { OR: [{ expiresAt: { lt: olderThan } }, { consumedAt: { not: null } }] },
  });
  return count;
}
