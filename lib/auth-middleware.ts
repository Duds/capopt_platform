import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'
import { prisma } from './prisma'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
    name: string
  }
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedRequest> {
  // Read JWT from httpOnly cookie
  const token = request.cookies.get('capopt_jwt')?.value
  if (!token) {
    throw new Error('No authentication token provided')
  }
  try {
    const payload = verifyToken(token)
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, name: true, isActive: true }
    })
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive')
    }
    ;(request as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
    return request as AuthenticatedRequest
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

export function createAuthErrorResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function requireRole(roles: string[]) {
  return (request: AuthenticatedRequest) => {
    if (!request.user || !roles.includes(request.user.role)) {
      throw new Error('Insufficient permissions')
    }
  }
} 