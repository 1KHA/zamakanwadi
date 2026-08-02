import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog = [
  { id: 'access-247', kind: 'INFO', nameAr: '٧/٢٤ على مدار اليوم', nameEn: '24/7 access', sortOrder: 0 },
  { id: 'internet', kind: 'INFO', nameAr: 'انترنت', nameEn: 'Internet', sortOrder: 1 },
  { id: 'lounge', kind: 'INFO', nameAr: 'صالة ترفيهية', nameEn: 'Lounge area', sortOrder: 2 },
  { id: 'prayer-room', kind: 'INFO', nameAr: 'مصلى', nameEn: 'Prayer room', sortOrder: 3 },
  { id: 'smart-access', kind: 'INFO', nameAr: 'دخول ذكي', nameEn: 'Smart access', sortOrder: 6 },
  {
    id: 'meeting-hours',
    kind: 'TIME',
    nameAr: 'ساعات شهريا لقاعات الاجتماعات',
    nameEn: 'hrs/month meeting rooms',
    category: 'meeting',
    purchasable: true,
    unitPrice: 100,
    sortOrder: 4,
  },
  {
    id: 'theater-hours',
    kind: 'TIME',
    nameAr: 'ساعات شهريا للمسرح',
    nameEn: 'hrs/month theater',
    category: 'theater',
    purchasable: true,
    unitPrice: 150,
    sortOrder: 5,
  },
] as const;

const baseInfo = ['access-247', 'internet', 'lounge', 'prayer-room'];

// Meeting/theater spaces keep their legacy text features (room-specific specs);
// only office packages carry catalog features/entitlements for now.
const spaceMappings: Record<string, { featureId: string; amount?: number }[]> = {
  'office-flex': baseInfo.map((featureId) => ({ featureId })),
  'office-pioneer': [...baseInfo.map((featureId) => ({ featureId })), { featureId: 'meeting-hours', amount: 2 }],
  'office-pioneer-plus': [
    ...baseInfo.map((featureId) => ({ featureId })),
    { featureId: 'meeting-hours', amount: 4 },
    { featureId: 'theater-hours', amount: 2 },
  ],
  'office-corporate': [
    ...baseInfo.map((featureId) => ({ featureId })),
    { featureId: 'meeting-hours', amount: 4 },
    { featureId: 'theater-hours', amount: 2 },
    { featureId: 'smart-access' },
  ],
};

async function main() {
  for (const feature of catalog) {
    const data = {
      kind: feature.kind,
      nameAr: feature.nameAr,
      nameEn: feature.nameEn,
      category: 'category' in feature ? feature.category : null,
      purchasable: 'purchasable' in feature ? feature.purchasable : false,
      unitPrice: 'unitPrice' in feature ? feature.unitPrice : null,
      sortOrder: feature.sortOrder,
      active: true,
    };
    await prisma.feature.upsert({
      where: { id: feature.id },
      update: data,
      create: { id: feature.id, ...data },
    });
  }
  console.log(`Seeded ${catalog.length} catalog features`);

  for (const [spaceId, features] of Object.entries(spaceMappings)) {
    const space = await prisma.space.findUnique({ where: { id: spaceId } });
    if (!space) {
      console.log(`Skipping ${spaceId} (space not found)`);
      continue;
    }
    await prisma.spaceFeature.deleteMany({ where: { spaceId } });
    await prisma.spaceFeature.createMany({
      data: features.map((f, index) => ({
        spaceId,
        featureId: f.featureId,
        amount: f.amount ?? null,
        sortOrder: index,
      })),
    });
    console.log(`Linked ${features.length} features to ${spaceId}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
