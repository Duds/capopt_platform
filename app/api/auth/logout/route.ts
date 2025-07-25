import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Clear the JWT cookie
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.set('capopt_jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
  return response
} 