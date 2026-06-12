import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole } from '@/lib/auth';

export async function GET() {
  const info = await db.contactInfo.findFirst();
  if (!info) return NextResponse.json({ id: '', phone: '', email: '', address: '', whatsapp: '', viber: '', workingHours: '' });
  return NextResponse.json(info);
}

export async function PUT(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;
  try {
    const body = await request.json();
    const existing = await db.contactInfo.findFirst();
    let info;
    if (existing) {
      info = await db.contactInfo.update({ where: { id: existing.id }, data: body });
    } else {
      info = await db.contactInfo.create({ data: body });
    }
    return NextResponse.json(info);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
