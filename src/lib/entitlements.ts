import type { Prisma } from '@prisma/client';
import { calculateHourlyTotal, type HourlyPriceTier } from '@/lib/spaces';

type Tx = Prisma.TransactionClient;

interface SpaceLike {
  price: number;
  durationOptions: unknown;
  hourlyPrices: unknown;
}

interface BookingLike {
  id: string;
  userId: string;
  durationType: string | null;
}

interface SpaceFeatureLike {
  featureId: string;
  amount: number | null;
  feature: {
    id: string;
    kind: string;
    nameAr: string;
    nameEn: string;
    category: string | null;
  };
}

export function parseHourlyDuration(durationType: string | null | undefined): number | null {
  const match = durationType?.match(/^hourly-(\d+(?:\.\d+)?)$/);
  return match ? Number(match[1]) : null;
}

export function getDurationMultiplier(space: SpaceLike, durationType: string | null | undefined): number {
  const hours = parseHourlyDuration(durationType);
  if (hours !== null) return hours;
  const options = space.durationOptions as { value: string; multiplier: number }[] | null;
  const option = Array.isArray(options) ? options.find((o) => o.value === durationType) : undefined;
  return option?.multiplier ?? 1;
}

export function computeServerTotal(space: SpaceLike, durationType: string | null | undefined): number | null {
  const hours = parseHourlyDuration(durationType);
  if (hours !== null) {
    return calculateHourlyTotal(hours, space.hourlyPrices as HourlyPriceTier[] | undefined) ?? space.price * hours;
  }
  const options = space.durationOptions as { value: string; multiplier: number }[] | null;
  const option = Array.isArray(options) ? options.find((o) => o.value === durationType) : undefined;
  if (!option) return null;
  return space.price * option.multiplier;
}

// tierPrice(0) = 0; payable = tier(booked) - tier(covered), clamped at 0.
export function partialCoveragePrice(
  bookedHours: number,
  coveredHours: number,
  tiers: HourlyPriceTier[] | undefined,
  fallbackHourlyPrice: number
): number {
  const tierPrice = (h: number) => {
    if (h <= 0) return 0;
    return calculateHourlyTotal(h, tiers) ?? fallbackHourlyPrice * h;
  };
  return Math.max(0, tierPrice(bookedHours) - tierPrice(coveredHours));
}

export async function getAvailableTimeBalance(tx: Tx, userId: string, category: string) {
  const entitlements = await tx.entitlement.findMany({
    where: { userId, kind: 'TIME', category, revoked: false },
    orderBy: { createdAt: 'asc' },
  });
  const usable = entitlements.filter((e) => e.totalAmount - e.usedAmount > 0);
  const totalAvailable = usable.reduce((sum, e) => sum + (e.totalAmount - e.usedAmount), 0);
  return { entitlements: usable, totalAvailable };
}

export async function applyHours(
  tx: Tx,
  userId: string,
  category: string,
  hours: number,
  bookingId: string
): Promise<{ coveredHours: number }> {
  if (hours <= 0) return { coveredHours: 0 };
  const { entitlements } = await getAvailableTimeBalance(tx, userId, category);
  let remaining = hours;
  let covered = 0;
  for (const entitlement of entitlements) {
    if (remaining <= 0) break;
    const available = entitlement.totalAmount - entitlement.usedAmount;
    const take = Math.min(available, remaining);
    if (take <= 0) continue;
    await tx.entitlement.update({
      where: { id: entitlement.id },
      data: { usedAmount: entitlement.usedAmount + take },
    });
    await tx.entitlementLedger.create({
      data: {
        entitlementId: entitlement.id,
        userId,
        action: 'AUTO_APPLY',
        amount: take,
        bookingId,
        actorId: userId,
        actorRole: 'USER',
      },
    });
    remaining -= take;
    covered += take;
  }
  return { coveredHours: covered };
}

export async function refundAutoApplied(tx: Tx, bookingId: string, actorId: string | null) {
  const existingRefund = await tx.entitlementLedger.findFirst({
    where: { bookingId, action: 'REFUND' },
  });
  if (existingRefund) return;

  const applied = await tx.entitlementLedger.findMany({
    where: { bookingId, action: 'AUTO_APPLY' },
  });
  for (const entry of applied) {
    const entitlement = await tx.entitlement.findUnique({ where: { id: entry.entitlementId } });
    if (!entitlement) continue;
    await tx.entitlement.update({
      where: { id: entitlement.id },
      data: { usedAmount: Math.max(0, entitlement.usedAmount - entry.amount) },
    });
    await tx.entitlementLedger.create({
      data: {
        entitlementId: entitlement.id,
        userId: entry.userId,
        action: 'REFUND',
        amount: entry.amount,
        bookingId,
        actorId,
        actorRole: 'ADMIN',
      },
    });
  }
}

export async function grantForBooking(
  tx: Tx,
  booking: BookingLike,
  space: SpaceLike,
  spaceFeatures: SpaceFeatureLike[],
  actorId: string | null
): Promise<number> {
  const grantable = spaceFeatures.filter(
    (sf) => (sf.feature.kind === 'TIME' || sf.feature.kind === 'QUANTITY') && (sf.amount ?? 0) > 0
  );
  if (grantable.length === 0) return 0;

  const multiplier = getDurationMultiplier(space, booking.durationType);
  let granted = 0;
  for (const sf of grantable) {
    const existing = await tx.entitlement.findFirst({
      where: { bookingId: booking.id, featureId: sf.featureId },
    });
    if (existing) continue;
    const entitlement = await tx.entitlement.create({
      data: {
        userId: booking.userId,
        featureId: sf.featureId,
        nameAr: sf.feature.nameAr,
        nameEn: sf.feature.nameEn,
        kind: sf.feature.kind as 'TIME' | 'QUANTITY',
        category: sf.feature.category,
        totalAmount: (sf.amount ?? 0) * multiplier,
        source: 'BOOKING',
        bookingId: booking.id,
      },
    });
    await tx.entitlementLedger.create({
      data: {
        entitlementId: entitlement.id,
        userId: booking.userId,
        action: 'GRANT',
        amount: entitlement.totalAmount,
        bookingId: booking.id,
        actorId,
        actorRole: 'ADMIN',
      },
    });
    granted += 1;
  }
  return granted;
}

export async function revokeForBooking(tx: Tx, bookingId: string, actorId: string | null) {
  const entitlements = await tx.entitlement.findMany({
    where: { bookingId, revoked: false },
  });
  for (const entitlement of entitlements) {
    const remaining = entitlement.totalAmount - entitlement.usedAmount;
    await tx.entitlement.update({
      where: { id: entitlement.id },
      data: { totalAmount: entitlement.usedAmount, revoked: true },
    });
    if (remaining > 0) {
      await tx.entitlementLedger.create({
        data: {
          entitlementId: entitlement.id,
          userId: entitlement.userId,
          action: 'REVOKE',
          amount: remaining,
          bookingId,
          actorId,
          actorRole: 'ADMIN',
        },
      });
    }
  }
}
