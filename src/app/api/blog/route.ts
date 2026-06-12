import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole, hasAuthHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (hasAuthHeader(request)) {
    const auth = await verifyAuth(request);
    if (auth.authorized) {
      const posts = await db.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(posts);
    }
  }
  // Public: only published posts
  const posts = await db.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;

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
