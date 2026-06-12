import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole } from '@/lib/auth';

export async function GET() {
  const settings = await db.siteSetting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });
  return NextResponse.json(map);
}

// PUT /api/settings — Admin only
export async function PUT(request: NextRequest) {
  const auth = requireRole(await verifyAuth(request), 'admin');
  if (!auth.authorized) return auth.error!;
  try {
    const body: Record<string, string> = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    return NextResponse.json({ message: 'Settings updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
