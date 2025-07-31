import { NextRequest, NextResponse } from 'next/server'
import debugPipe from '@/lib/debug-pipe'

export function middleware(request: NextRequest) {
  // Only enable debug pipe in development
  if (process.env.NODE_ENV === 'development') {
    const startTime = Date.now()
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Log request
    debugPipe.log('request', 'middleware', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      nextUrl: request.nextUrl?.pathname
    }, { requestId })

    // Create response
    const response = NextResponse.next()

    // Add debug headers
    response.headers.set('X-Debug-Request-ID', requestId)
    response.headers.set('X-Debug-Timestamp', startTime.toString())

    // Override response to capture response data
    const originalResponse = response.clone()
    
    // Log response when it's sent
    setTimeout(() => {
      debugPipe.log('response', 'middleware', {
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        url: request.url
      }, { 
        requestId,
        duration: Date.now() - startTime
      })
    }, 0)

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 