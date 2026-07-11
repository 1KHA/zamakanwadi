import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(offices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const office = await prisma.office.create({
      data: {
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        type: body.type,
        price: body.price,
        capacity: body.capacity,
        amenities: body.amenities || [],
        description: body.description,
        image: body.image,
        featured: body.featured || false,
      },
    });
    return NextResponse.json(office, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create office' }, { status: 500 });
  }
}
