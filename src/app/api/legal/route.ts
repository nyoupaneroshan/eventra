import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const pages = await db.legalPage.findMany({ orderBy: { title: 'asc' } });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || new Date() > session.expiresAt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const page = await db.legalPage.create({ data: { title: data.title, slug: data.slug, content: data.content, type: data.type || 'general', metaTitle: data.metaTitle || '', metaDesc: data.metaDesc || '' } });
    return NextResponse.json(page);
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to create' }, { status: 500 }); }
}
