import { z } from 'zod';

/** bcrypt silently truncates beyond 72 bytes, so cap there. */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().min(6).max(20).optional().or(z.literal('')),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export const REFERENCE_PATTERN = /^ZMK-[A-Z0-9]{6}$/;

export const bookingSchema = z.object({
  spaceId: z.string().trim().min(1).max(100),
  itemType: z.string().trim().min(1).max(50),
  itemName: z.string().trim().min(1).max(200),
  itemNameAr: z.string().trim().max(200).optional().nullable(),
  durationType: z.string().trim().min(1).max(50),
  startDate: z.string().trim().min(1).max(40),
  endDate: z.string().trim().max(40).optional().nullable(),
  startTime: z.string().trim().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  referenceNumber: z.string().trim().regex(REFERENCE_PATTERN).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  officeId: z.string().trim().max(100).optional().nullable(),
  // Accepted for backwards compatibility but never trusted: the server prices
  // every booking itself.
  total: z.number().optional(),
});

export const paymentSchema = z.object({
  referenceNumber: z.string().trim().regex(REFERENCE_PATTERN),
  cardName: z.string().trim().min(2).max(100),
  cardNumber: z.string().trim().min(13).max(25),
  expiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
  cvc: z.string().trim().regex(/^\d{3,4}$/),
});

/** First human-readable message from a zod failure. */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0];
  const path = issue?.path?.join('.') ?? '';
  return path ? `${path}: ${issue.message}` : (issue?.message ?? 'Invalid request');
}
