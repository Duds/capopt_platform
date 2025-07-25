import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, createAuthErrorResponse, requireRole } from '@/lib/auth-middleware'
import { hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Authenticate and require admin role
    const authenticatedRequest = await authenticateRequest(request)
    await requireRole(['ADMIN'])(authenticatedRequest)

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    if (role) where.role = role
    if (isActive !== null) where.isActive = isActive === 'true'

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error: any) {
    if (error.message.includes('authentication') || error.message.includes('token')) {
      return createAuthErrorResponse(error.message)
    }
    
    if (error.message.includes('permissions')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate and require admin role
    const authenticatedRequest = await authenticateRequest(request)
    await requireRole(['ADMIN'])(authenticatedRequest)

    const body = await request.json()
    const { name, email, password, role = 'USER' } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    if (error.message.includes('authentication') || error.message.includes('token')) {
      return createAuthErrorResponse(error.message)
    }
    
    if (error.message.includes('permissions')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 