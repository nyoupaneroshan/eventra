import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user || !user.active) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Support both hashed and legacy plaintext passwords
    const hashedInput = hashPassword(password);
    if (user.password !== password && user.password !== hashedInput) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Auto-upgrade plaintext passwords to hashed on successful login
    if (user.password === password) {
      await db.adminUser.update({ where: { id: user.id }, data: { password: hashedInput } });
    }

    // Clean up expired sessions
    await db.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Store userId in session so we can look up the user's role on subsequent requests
    await db.adminSession.create({ data: { token, userId: user.id, expiresAt } });
    
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
