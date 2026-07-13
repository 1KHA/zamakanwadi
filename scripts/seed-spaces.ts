import { PrismaClient } from '@prisma/client';
import { defaultSpaces } from '../src/lib/defaultSpaces';

const prisma = new PrismaClient();

function spaceToPrisma(space: (typeof defaultSpaces)[number]) {
  return {
    id: space.id,
    category: space.category,
    type: space.type,
    titleAr: space.title.ar,
    titleEn: space.title.en,
    descAr: space.desc.ar,
    descEn: space.desc.en,
    price: space.price,
    periodAr: space.period.ar,
    periodEn: space.period.en,
    capacity: space.capacity,
    featuresAr: space.features.ar,
    featuresEn: space.features.en,
    images: space.images,
    durationOptions: space.durationOptions as unknown,
    active: true,
  };
}

async function main() {
  for (const space of defaultSpaces) {
    await prisma.space.upsert({
      where: { id: space.id },
      update: spaceToPrisma(space),
      create: spaceToPrisma(space),
    });
  }
  console.log(`Seeded ${defaultSpaces.length} spaces`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
