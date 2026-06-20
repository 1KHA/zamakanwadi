import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.office.createMany({
      data: [
        {
          nameEn: 'Individual Office',
          nameAr: 'مكتب فردي',
          type: 'INDIVIDUAL',
          price: 1500,
          capacity: '1',
          amenities: ['WiFi', 'Coffee', 'Parking'],
          featured: false,
        },
        {
          nameEn: 'Small Office',
          nameAr: 'مكتب صغير',
          type: 'SMALL',
          price: 3500,
          capacity: '2-4',
          amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Room'],
          featured: true,
        },
        {
          nameEn: 'Medium Office',
          nameAr: 'مكتب متوسط',
          type: 'MEDIUM',
          price: 6000,
          capacity: '5-10',
          amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Room', 'Printer'],
          featured: true,
        },
        {
          nameEn: 'Large Office',
          nameAr: 'مكتب كبير',
          type: 'LARGE',
          price: 12000,
          capacity: '10-20',
          amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Room', 'Printer', 'Kitchen'],
          featured: false,
        },
        {
          nameEn: 'Small Theater',
          nameAr: 'قاعة عروض صغيرة',
          type: 'THEATER',
          price: 300,
          capacity: '10-20',
          amenities: ['Projector', 'Screen', 'Sound System', 'WiFi'],
          featured: false,
        },
        {
          nameEn: 'Medium Theater',
          nameAr: 'قاعة عروض متوسطة',
          type: 'THEATER',
          price: 600,
          capacity: '20-50',
          amenities: ['4K Projector', 'Large Screen', 'Sound System', 'WiFi', 'Microphone'],
          featured: true,
        },
        {
          nameEn: 'Large Theater',
          nameAr: 'قاعة عروض كبيرة',
          type: 'THEATER',
          price: 1200,
          capacity: '50-100',
          amenities: ['4K Projector', 'Cinema Screen', 'Surround Sound', 'WiFi', 'Wireless Mic', 'Stage'],
          featured: true,
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
