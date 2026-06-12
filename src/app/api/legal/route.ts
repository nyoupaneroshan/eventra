import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole } from '@/lib/auth';

export async function GET() {
  const pages = await db.legalPage.findMany({ orderBy: { title: 'asc' } });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;

  try {
    const data = await request.json();
    const page = await db.legalPage.create({ data: { title: data.title, slug: data.slug, content: data.content, type: data.type || 'general', metaTitle: data.metaTitle || '', metaDesc: data.metaDesc || '' } });
    return NextResponse.json(page);
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to create' }, { status: 500 }); }
}
