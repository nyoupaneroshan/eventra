import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyAuth(request: NextRequest): Promise<{ authorized: boolean; error?: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return { authorized: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || new Date() > session.expiresAt) {
    return { authorized: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authorized: true };
}

export function hasAuthHeader(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return !!token;
}
