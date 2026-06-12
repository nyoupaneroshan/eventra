import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole, hasAuthHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Admin sees all; public sees only active
  if (hasAuthHeader(request)) {
    const auth = await verifyAuth(request);
    if (auth.authorized) {
      const items = await db.service.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json(items);
    }
  }
  const items = await db.service.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;
  try {
    const body = await request.json();
    const item = await db.service.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
