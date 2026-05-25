import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.authorized) return auth.error!;
  
  const users = await db.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.authorized) return auth.error!;
  
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    const existing = await db.adminUser.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    
    const user = await db.adminUser.create({
      data: { name: data.name, email: data.email, password: hashPassword(data.password), role: data.role || 'admin', active: true },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
