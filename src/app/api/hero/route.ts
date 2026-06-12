import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole, hasAuthHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Admin can see all slides; public only sees active
  if (hasAuthHeader(request)) {
    const auth = await verifyAuth(request);
    if (auth.authorized) {
      const slides = await db.heroSlide.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json(slides);
    }
  }
  const slides = await db.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;
  try {
    const body = await request.json();
    const slide = await db.heroSlide.create({ data: body });
    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}
