import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }
  return NextResponse.json({ valid: true, role: auth.role, userId: auth.userId });
}
