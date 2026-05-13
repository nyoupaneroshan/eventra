import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || new Date() > session.expiresAt) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }
  return NextResponse.json({ valid: true });
}
