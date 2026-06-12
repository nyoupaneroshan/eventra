import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AuthResult {
  authorized: boolean;
  error?: NextResponse;
  userId?: string;
  role?: UserRole;
}

/**
 * Verify the request's auth token and return the user's role.
 * Sessions are linked to users via the userId field.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return { authorized: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const session = await db.adminSession.findUnique({
    where: { token },
    include: { user: { select: { id: true, role: true, active: true } } },
  });
  if (!session || new Date() > session.expiresAt) {
    return { authorized: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!session.user || !session.user.active) {
    return { authorized: false, error: NextResponse.json({ error: 'Account disabled' }, { status: 403 }) };
  }
  return {
    authorized: true,
    userId: session.user.id,
    role: session.user.role as UserRole,
  };
}

/**
 * Role hierarchy: admin > editor > viewer
 * - admin: full access (users, settings, all content CRUD)
 * - editor: content CRUD (no users, no settings)
 * - viewer: read-only (GET only)
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  editor: 2,
  viewer: 1,
};

/**
 * Check if a given role meets the minimum required role level.
 */
export function hasMinRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

/**
 * Require that the authenticated user has at least the specified role.
 * Returns an AuthResult with a 403 error if the role is insufficient.
 */
export function requireRole(auth: AuthResult, minRole: UserRole): AuthResult {
  if (!auth.authorized) return auth;
  if (!hasMinRole(auth.role, minRole)) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Insufficient permissions. Required role: ' + minRole },
        { status: 403 }
      ),
    };
  }
  return auth;
}

export function hasAuthHeader(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return !!token;
}
