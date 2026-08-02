import type { Prisma } from '@prisma/client';
import type { HourlyPriceTier } from '@/lib/spaces';
import { composeFeatureLabel, type FeatureKind, type SpaceEntitlementFeature } from '@/lib/entitlementTypes';

export interface SpaceFeatureInput {
  featureId: string;
  amount?: number | null;
}

export interface SpacePayload {
  id: string;
  category: 'offices' | 'meeting' | 'theater';
  type: 'workspace' | 'meeting' | 'theater';
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  price: number;
  period: { ar: string; en: string };
  capacity: string;
  features: { ar: string[]; en: string[] };
  images: string[];
  durationOptions: { value: string; label: { ar: string; en: string }; multiplier: number }[];
  hourlyPrices?: HourlyPriceTier[];
  active?: boolean;
  catalogFeatures?: SpaceFeatureInput[];
}

export function payloadToPrisma(data: SpacePayload) {
  return {
    id: data.id,
    category: data.category,
    type: data.type,
    titleAr: data.title.ar,
    titleEn: data.title.en,
    descAr: data.desc.ar,
    descEn: data.desc.en,
    price: data.price,
    periodAr: data.period.ar,
    periodEn: data.period.en,
    capacity: data.capacity,
    featuresAr: data.features.ar,
    featuresEn: data.features.en,
    images: data.images,
    durationOptions: data.durationOptions as Prisma.InputJsonValue,
    hourlyPrices: (data.hourlyPrices as unknown) as Prisma.InputJsonValue | undefined,
    active: data.active ?? true,
  };
}

export function partialPayloadToPrisma(data: Partial<SpacePayload>) {
  const result: Record<string, unknown> = {};
  if (data.category) result.category = data.category;
  if (data.type) result.type = data.type;
  if (data.title) {
    result.titleAr = data.title.ar;
    result.titleEn = data.title.en;
  }
  if (data.desc) {
    result.descAr = data.desc.ar;
    result.descEn = data.desc.en;
  }
  if (typeof data.price === 'number') result.price = data.price;
  if (data.period) {
    result.periodAr = data.period.ar;
    result.periodEn = data.period.en;
  }
  if (data.capacity) result.capacity = data.capacity;
  if (data.features) {
    result.featuresAr = data.features.ar;
    result.featuresEn = data.features.en;
  }
  if (data.images) result.images = data.images;
  if (data.durationOptions) result.durationOptions = data.durationOptions as Prisma.InputJsonValue;
  if (data.hourlyPrices) result.hourlyPrices = (data.hourlyPrices as unknown) as Prisma.InputJsonValue;
  if (typeof data.active === 'boolean') result.active = data.active;
  return result;
}

export async function syncSpaceFeatures(
  tx: Prisma.TransactionClient,
  spaceId: string,
  features: SpaceFeatureInput[]
) {
  await tx.spaceFeature.deleteMany({ where: { spaceId } });
  if (features.length > 0) {
    await tx.spaceFeature.createMany({
      data: features.map((f, index) => ({
        spaceId,
        featureId: f.featureId,
        amount: f.amount ?? null,
        sortOrder: index,
      })),
    });
  }
}

export interface DbSpaceFeature {
  featureId: string;
  amount: number | null;
  sortOrder: number;
  feature: {
    id: string;
    kind: FeatureKind | string;
    nameAr: string;
    nameEn: string;
    category: string | null;
    active: boolean;
  };
}

export interface DbSpace {
  id: string;
  category: string;
  type: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number;
  periodAr: string;
  periodEn: string;
  capacity: string;
  featuresAr: string[];
  featuresEn: string[];
  images: string[];
  durationOptions: unknown;
  hourlyPrices: unknown;
  active: boolean;
  spaceFeatures?: DbSpaceFeature[];
}

export function dbToSpace(space: DbSpace) {
  const activeFeatures = (space.spaceFeatures ?? [])
    .filter((sf) => sf.feature.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const hasCatalogFeatures = activeFeatures.length > 0;

  const entitlementFeatures: SpaceEntitlementFeature[] = activeFeatures.map((sf) => ({
    featureId: sf.featureId,
    kind: sf.feature.kind as FeatureKind,
    category: sf.feature.category,
    amount: sf.amount,
    name: { ar: sf.feature.nameAr, en: sf.feature.nameEn },
  }));

  return {
    id: space.id,
    category: space.category,
    type: space.type,
    title: { ar: space.titleAr, en: space.titleEn },
    desc: { ar: space.descAr, en: space.descEn },
    price: space.price,
    period: { ar: space.periodAr, en: space.periodEn },
    capacity: space.capacity,
    features: hasCatalogFeatures
      ? {
          ar: activeFeatures.map((sf) => composeFeatureLabel(sf.feature.nameAr, sf.amount)),
          en: activeFeatures.map((sf) => composeFeatureLabel(sf.feature.nameEn, sf.amount)),
        }
      : { ar: space.featuresAr, en: space.featuresEn },
    images: space.images,
    durationOptions: space.durationOptions as {
      value: string;
      label: { ar: string; en: string };
      multiplier: number;
    }[],
    hourlyPrices: space.hourlyPrices as HourlyPriceTier[] | undefined,
    active: space.active,
    entitlementFeatures,
  };
}

export const spaceFeaturesInclude = {
  spaceFeatures: {
    include: { feature: true },
    orderBy: { sortOrder: 'asc' as const },
  },
};
