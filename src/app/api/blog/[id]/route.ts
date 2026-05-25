import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || new Date() > session.expiresAt) return null;
  return session;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifyAuth(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const data = await request.json();
    const post = await db.blogPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifyAuth(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
