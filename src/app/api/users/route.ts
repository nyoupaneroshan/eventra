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

export async function GET(request: NextRequest) {
  const session = await verifyAuth(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const users = await db.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = await verifyAuth(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const data = await request.json();
    const existing = await db.adminUser.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    
    const user = await db.adminUser.create({
      data: { name: data.name, email: data.email, password: data.password, role: data.role || 'admin', active: true },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
