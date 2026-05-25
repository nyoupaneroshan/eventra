import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await db.heroSlide.findUnique({ where: { id } });
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(slide);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.authorized) return auth.error!;
  try {
    const { id } = await params;
    const body = await request.json();
    const slide = await db.heroSlide.update({ where: { id }, data: body });
    return NextResponse.json(slide);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request);
  if (!auth.authorized) return auth.error!;
  try {
    const { id } = await params;
    await db.heroSlide.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
