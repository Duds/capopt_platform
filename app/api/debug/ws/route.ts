import { NextRequest } from 'next/server'
import debugPipe from '@/lib/debug-pipe'

export async function GET(request: NextRequest) {
  // Simple health check endpoint
  return new Response(JSON.stringify({ 
    status: 'ok',
    message: 'Debug pipe endpoint is running',
    timestamp: Date.now()
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

// HTTP endpoint for debug events
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Handle client-side debug events
    if (data.type && data.source) {
      debugPipe.log(data.type, data.source, data.data, data.metadata)
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG-PIPE] Received event:', data)
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Debug event logged',
      timestamp: Date.now()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Invalid JSON',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 