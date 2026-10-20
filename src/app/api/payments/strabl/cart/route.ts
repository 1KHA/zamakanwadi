import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { buildStrablCart, isStrablConfigured, strablPublicConfig } from '@/lib/strabl';
import { REFERENCE_PATTERN } from '@/lib/validation';

/**
 * Builds the Strabl cart for a booking reference. Prices come from the
 * database, never from the browser's localStorage cart.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isStrablConfigured()) {
      return NextResponse.json(
        { error: 'Online payment is not configured', code: 'STRABL_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const ref = req.nextUrl.searchParams.get('ref') ?? '';
    if (!REFERENCE_PATTERN.test(ref)) {
      return NextResponse.json({ error: 'Invalid reference' }, { status: 400 });
    }

    // Entitlement hours applied at booking time; only forwarded to the success
    // URL so the dashboard can show them. Not security-relevant.
    const appliedRaw = Number(req.nextUrl.searchParams.get('applied') ?? '');
    const applied = Number.isFinite(appliedRaw) && appliedRaw > 0 ? appliedRaw : undefined;

    const result = await buildStrablCart(user.id, ref, req.nextUrl.origin, applied);
    if (!result) {
      return NextResponse.json({ error: 'Nothing to pay for this reference' }, { status: 400 });
    }

    return NextResponse.json({ ...result, config: strablPublicConfig() });
  } catch {
    return NextResponse.json({ error: 'Failed to prepare payment' }, { status: 500 });
  }
}
