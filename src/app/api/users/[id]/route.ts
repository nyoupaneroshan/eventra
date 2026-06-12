import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, requireRole } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// PUT /api/users/[id] — Update user (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(await verifyAuth(request), 'admin');
  if (!auth.authorized) return auth.error!;
  
  try {
    const { id } = await params;
    const data = await request.json();
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.password) updateData.password = hashPassword(data.password);
    
    // Prevent the last admin from demoting themselves
    if (data.role && data.role !== 'admin' && auth.userId === id) {
      const adminCount = await db.adminUser.count({ where: { role: 'admin', active: true } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot demote the last active admin' }, { status: 400 });
      }
    }

    // Prevent the last admin from being deactivated
    if (data.active === false && auth.userId === id) {
      const adminCount = await db.adminUser.count({ where: { role: 'admin', active: true } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot deactivate the last active admin' }, { status: 400 });
      }
    }
    
    const user = await db.adminUser.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] — Delete user (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(await verifyAuth(request), 'admin');
  if (!auth.authorized) return auth.error!;
  
  try {
    const { id } = await params;

    // Prevent deleting yourself
    if (auth.userId === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Prevent deleting the last admin
    const user = await db.adminUser.findUnique({ where: { id } });
    if (user?.role === 'admin') {
      const adminCount = await db.adminUser.count({ where: { role: 'admin', active: true } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last active admin' }, { status: 400 });
      }
    }

    await db.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
