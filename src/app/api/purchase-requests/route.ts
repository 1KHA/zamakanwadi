import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const MAX_PURCHASE_AMOUNT = 100;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const requests = await prisma.purchaseRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch purchase requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { featureId, amount } = body;

    if (
      !featureId ||
      typeof amount !== 'number' ||
      !Number.isInteger(amount) ||
      amount <= 0 ||
      amount > MAX_PURCHASE_AMOUNT
    ) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const feature = await prisma.feature.findUnique({ where: { id: featureId } });
    if (!feature || !feature.active || !feature.purchasable || !feature.unitPrice) {
      return NextResponse.json({ error: 'This service is not available for purchase' }, { status: 400 });
    }

    const request = await prisma.purchaseRequest.create({
      data: {
        userId: user.id,
        featureId: feature.id,
        nameAr: feature.nameAr,
        nameEn: feature.nameEn,
        kind: feature.kind,
        amount,
        unitPrice: feature.unitPrice,
        total: amount * feature.unitPrice,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create purchase request' }, { status: 500 });
  }
}
