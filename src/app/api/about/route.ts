import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const about = await db.aboutContent.findFirst();
    return NextResponse.json({ about });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await db.aboutContent.findFirst();
    let about;
    if (existing) {
      about = await db.aboutContent.update({ where: { id: existing.id }, data: body });
    } else {
      about = await db.aboutContent.create({ data: body });
    }
    return NextResponse.json({ about });
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
