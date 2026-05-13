import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const slides = await db.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slide = await db.heroSlide.create({ data: body });
    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}
