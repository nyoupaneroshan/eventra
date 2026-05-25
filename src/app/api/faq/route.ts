import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const faqs = await db.fAQ.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || new Date() > session.expiresAt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const faq = await db.fAQ.create({ data: { question: data.question, answer: data.answer, category: data.category || 'General', order: data.order || 0, active: data.active ?? true } });
    return NextResponse.json(faq);
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Failed to create' }, { status: 500 }); }
}
