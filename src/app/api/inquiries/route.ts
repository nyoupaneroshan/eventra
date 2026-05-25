import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.authorized) return auth.error!;
  const inquiries = await db.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json(inquiries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, eventType, eventDate, message } = body;
    if (!name || !phone || !email || !eventType || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const inquiry = await db.inquiry.create({
      data: { name, phone, email, eventType, eventDate, message: message || null },
    });
    return NextResponse.json({ message: 'Inquiry submitted!', inquiry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
