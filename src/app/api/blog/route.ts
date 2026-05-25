import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || new Date() > session.expiresAt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const post = await db.blogPost.create({ data: { title: data.title, slug, excerpt: data.excerpt || '', content: data.content, image: data.image || '', category: data.category || 'General', tags: data.tags || '[]', author: data.author || 'Eventra Team', published: data.published ?? false, metaTitle: data.metaTitle || '', metaDesc: data.metaDesc || '' } });
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
