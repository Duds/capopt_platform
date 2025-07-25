import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    const user = await authenticateUser(email, password)
    const token = generateToken({ userId: user.id, email: user.email, role: user.role })

    // Set JWT as httpOnly cookie
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
    response.cookies.set('capopt_jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
} 