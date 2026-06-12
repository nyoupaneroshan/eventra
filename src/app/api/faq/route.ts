import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole, hasAuthHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (hasAuthHeader(request)) {
    const auth = await verifyAuth(request);
    if (auth.authorized) {
      const faqs = await db.fAQ.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json(faqs);
    }
  }
  const faqs = await db.fAQ.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'editor');
  if (!auth.authorized) return auth.error!;

  try {
    const data = await request.json();
    const faq = await db.fAQ.create({ data: { question: data.question, answer: data.answer, category: data.category || 'General', order: data.order || 0, active: data.active ?? true } });
    return NextResponse.json(faq);
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to create' }, { status: 500 }); }
}
