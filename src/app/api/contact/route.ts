import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rateLimit';

const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  phone: z.string().min(1, 'Phone is required').max(20),
  activity: z.string().min(1, 'Activity is required').max(500),
  inquiryType: z.enum([
    'office-flex',
    'office-pioneer',
    'office-pioneer-plus',
    'office-corporate',
    'room-riyadah-1',
    'room-riyadah-2',
    'room-bina',
    'theater-ithraa',
    'theater-tarabut',
    'theater-rakeeza',
    'general',
  ]),
});

function normalizeSaudiPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  // Accept 9665xxxxxxxx or 05xxxxxxxx
  if (/^9665\d{8}$/.test(digits)) {
    return `+${digits}`;
  }
  if (/^05\d{8}$/.test(digits)) {
    return `+966${digits.slice(1)}`;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'contact', 5, 10 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { fullName, activity, inquiryType } = parsed.data;
    const phone = normalizeSaudiPhone(parsed.data.phone);

    if (!phone) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please use a Saudi +966 number.' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({
      data: {
        fullName,
        phone,
        activity,
        inquiryType,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
