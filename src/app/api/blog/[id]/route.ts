import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;
  try {
    const { id } = await params;
    const data = await request.json();
    const post = await db.blogPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;
  try {
    const { id } = await params;
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
