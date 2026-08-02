import type { SpaceEntitlementFeature } from './entitlementTypes';

export interface HourlyPriceTier {
  maxHours: number | null;
  price: number;
}

export interface Space {
  id: string;
  category: 'offices' | 'meeting' | 'theater';
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  images: string[];
  features: { ar: string[]; en: string[] };
  price: number;
  hourlyPrices?: HourlyPriceTier[];
  period: { ar: string; en: string };
  capacity: string;
  type: 'workspace' | 'meeting' | 'theater';
  durationOptions: { value: string; label: { ar: string; en: string }; multiplier: number }[];
  active?: boolean;
  entitlementFeatures?: SpaceEntitlementFeature[];
}

export function calculateHourlyTotal(
  hours: number,
  tiers?: HourlyPriceTier[]
): number | null {
  if (!tiers || tiers.length === 0 || hours <= 0) return null;
  const sorted = [...tiers]
    .filter((t) => typeof t.price === 'number' && !Number.isNaN(t.price))
    .sort((a, b) => (a.maxHours ?? Infinity) - (b.maxHours ?? Infinity));
  if (sorted.length === 0) return null;
  for (const tier of sorted) {
    if (tier.maxHours === null || hours <= tier.maxHours) return tier.price;
  }
  return sorted[sorted.length - 1].price;
}

export function getLowestHourlyPrice(tiers?: HourlyPriceTier[]): number | null {
  if (!tiers || tiers.length === 0) return null;
  const valid = tiers.filter((t) => typeof t.price === 'number' && !Number.isNaN(t.price));
  if (valid.length === 0) return null;
  return Math.min(...valid.map((t) => t.price));
}

export interface CartItem {
  id: string;
  spaceId: string;
  name: string;
  nameAr: string;
  type: string;
  price: number;
  quantity: number;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  durationType: string;
  durationLabel: string;
}

export const CART_STORAGE_KEY = 'zamakan-cart';
