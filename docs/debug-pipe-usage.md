# Debug Pipe Usage Guide

The CapOpt Platform includes a comprehensive debugging pipe system that allows you to capture, consume, and analyze debug events in real-time.

## Overview

The debug pipe system consists of:

1. **Server-side Debug Pipe** (`lib/debug-pipe.ts`) - Event emitter for server-side debugging (Edge Runtime compatible)
2. **Client-side Hook** (`hooks/use-debug-pipe.ts`) - React hook for client-side debugging
3. **Debug Panel** (`components/debug/debug-panel.tsx`) - UI component to display debug events
4. **API Endpoints** (`app/api/debug/ws/route.ts`) - HTTP endpoints for debug event logging

## Quick Start

### 1. Enable Debug Pipe

The debug pipe is automatically enabled in development mode. You can also enable it manually:

```typescript
import debugPipe from '@/lib/debug-pipe'

// Enable/disable debug pipe
debugPipe.enable()
debugPipe.disable()
```

### 2. Use in Components

```typescript
import { useDebugPipe } from '@/hooks/use-debug-pipe'

function MyComponent() {
  const debugPipe = useDebugPipe({
    enabled: true,
    maxEvents: 100,
    filterTypes: ['error', 'performance']
  })

  const handleSubmit = async (data) => {
    // Log form submission
    debugPipe.logEvent('state', 'form', {
      action: 'submit',
      data: data
    })

    try {
      const result = await submitForm(data)
      debugPipe.logEvent('response', 'api', {
        success: true,
        result: result
      })
    } catch (error) {
      debugPipe.logEvent('error', 'api', {
        error: error.message,
        data: data
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form content */}
    </form>
  )
}
```

### 3. Add Debug Panel

```typescript
import { DebugPanel } from '@/components/debug/debug-panel'

function App() {
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  return (
    <div>
      {/* Your app content */}
      
      <button onClick={() => setShowDebugPanel(!showDebugPanel)}>
        Toggle Debug Panel
      </button>
      
      <DebugPanel
        isOpen={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
        position="bottom-right"
      />
    </div>
  )
}
```

## Server-Side Usage

### Logging Events

```typescript
import debugPipe from '@/lib/debug-pipe'

// Log different types of events
debugPipe.log('request', 'api', { method: 'POST', url: '/api/users' })
debugPipe.log('error', 'database', { error: 'Connection failed' })
debugPipe.log('performance', 'query', { duration: 150, query: 'SELECT * FROM users' })
debugPipe.log('state', 'auth', { userId: '123', action: 'login' })
```

### Performance Monitoring

```typescript
// Wrap functions to measure performance
const result = debugPipe.performance('database-query', () => {
  return prisma.user.findMany()
})

// Async functions
const result = await debugPipe.performance('api-call', async () => {
  return fetch('/api/data')
})
```

### Request/Response Logging

```typescript
// In your API routes
export async function POST(request: NextRequest) {
  debugPipe.log('request', 'api', {
    method: request.method,
    url: request.url,
    body: await request.json()
  })

  try {
    const result = await processRequest(request)
    
    debugPipe.log('response', 'api', {
      status: 200,
      data: result
    })
    
    return NextResponse.json(result)
  } catch (error) {
    debugPipe.log('error', 'api', {
      error: error.message,
      stack: error.stack
    })
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

## Middleware Integration

The debug pipe is automatically integrated into the Next.js middleware to log all requests and responses:

```typescript
// middleware.ts
import debugPipe from '@/lib/debug-pipe'

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    // Automatically logs requests and responses
    // Adds debug headers to responses
  }
  return NextResponse.next()
}
```

## Client-Side Usage

### React Hook

```typescript
import { useDebugPipe } from '@/hooks/use-debug-pipe'

function MyComponent() {
  const debugPipe = useDebugPipe({
    enabled: process.env.NODE_ENV === 'development',
    filterTypes: ['error', 'state'],
    maxEvents: 50
  })

  // Access events
  const recentEvents = debugPipe.getRecentEvents(10)
  const errorEvents = debugPipe.getEventsByType('error')

  // Log events
  const handleClick = () => {
    debugPipe.logEvent('state', 'button', {
      action: 'click',
      buttonId: 'submit'
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Submit</button>
      
      {/* Display recent events */}
      <div>
        {recentEvents.map((event, index) => (
          <div key={index}>
            {event.type}: {event.source} - {JSON.stringify(event.data)}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Higher-Order Component

```typescript
import { withDebugPipe } from '@/hooks/use-debug-pipe'

const DebuggedComponent = withDebugPipe(MyComponent, {
  enabled: true,
  filterTypes: ['state']
})

// Now MyComponent will automatically log mount/unmount events
```

## Debug Panel Features

The debug panel provides:

- **Real-time event display** with filtering and search
- **Event statistics** and metrics
- **Event details** with expandable data
- **Connection status** indicator
- **Pause/resume** functionality
- **Clear events** button

### Customization

```typescript
<DebugPanel
  isOpen={showDebugPanel}
  onClose={() => setShowDebugPanel(false)}
  position="bottom-right" // or 'top-right', 'bottom-left', 'top-left'
/>
```

## Event Types

The debug pipe supports these event types:

- **`request`** - HTTP requests
- **`response`** - HTTP responses
- **`error`** - Errors and exceptions
- **`performance`** - Performance metrics
- **`state`** - State changes (React components)
- **`custom`** - Custom events

## Configuration Options

### Server-side Options

```typescript
const debugPipe = new DebugPipe({
  enabled: true,
  logToConsole: false,
  saveToFile: false,
  maxEvents: 1000,
  filterTypes: []
})
```

### Client-side Options

```typescript
const debugPipe = useDebugPipe({
  enabled: true,
  filterTypes: ['error', 'performance'],
  maxEvents: 100,
  autoConnect: true
})
```

## Environment Variables

```bash
# Enable debug pipe console logging
DEBUG_PIPE_CONSOLE=true

# Enable debug pipe in production (default: development only)
NODE_ENV=development
```

## Best Practices

1. **Use descriptive sources** - Use meaningful source names like 'user-service', 'auth-middleware'
2. **Include relevant metadata** - Add request IDs, user IDs, timestamps
3. **Filter sensitive data** - Don't log passwords, tokens, or PII
4. **Use appropriate event types** - Choose the right type for your event
5. **Monitor performance impact** - Debug pipe has minimal overhead but monitor in production
6. **Edge Runtime Compatibility** - The debug pipe is designed to work in Next.js Edge Runtime

## Advanced Usage

### Custom Event Handlers

```typescript
// Listen for specific events
debugPipe.on('event', (event) => {
  if (event.type === 'error') {
    // Send to error tracking service
    sendToErrorTracking(event)
  }
})
```

### Event Filtering

```typescript
// Filter events by type
const errorEvents = debugPipe.getEventsByType('error')

// Filter events by source
const apiEvents = debugPipe.events.filter(event => 
  event.source.includes('api')
)
```

### Performance Monitoring

```typescript
// Monitor specific operations
const result = debugPipe.performance('database-query', () => {
  return prisma.user.findMany({
    where: { active: true }
  })
})

// Monitor async operations
const result = await debugPipe.performance('external-api-call', async () => {
  return fetch('https://api.external.com/data')
})
```

## Troubleshooting

### Debug Panel Not Showing Events

1. Check if debug pipe is enabled
2. Verify HTTP connection status
3. Check browser console for errors
4. Ensure events are being logged

### Performance Issues

1. Reduce `maxEvents` limit
2. Use event filtering
3. Disable in production
4. Monitor memory usage

### Connection Issues

1. Check if API endpoints are accessible
2. Verify CORS settings
3. Check network connectivity
4. Review server logs

### Server Crashes

1. **Edge Runtime Compatibility** - The debug pipe is now Edge Runtime compatible
2. **No EventEmitter Dependency** - Uses custom event handling
3. **Memory Usage Checks** - Safely handles missing Node.js APIs
4. **Error Handling** - Graceful error handling in all environments

## Integration Examples

### With Error Boundaries

```typescript
import debugPipe from '@/lib/debug-pipe'

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    debugPipe.log('error', 'react-error-boundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }
}
```

### With API Routes

```typescript
import debugPipe from '@/lib/debug-pipe'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  debugPipe.log('request', 'api', {
    method: 'GET',
    url: request.url
  })

  try {
    const data = await fetchData()
    const duration = Date.now() - startTime
    
    debugPipe.log('response', 'api', {
      status: 200,
      duration,
      data
    })
    
    return NextResponse.json(data)
  } catch (error) {
    debugPipe.log('error', 'api', {
      error: error.message,
      duration: Date.now() - startTime
    })
    
    throw error
  }
}
```

## Recent Fixes

### Version 2.0 - Edge Runtime Compatibility

- **Removed EventEmitter dependency** - Now uses custom event handling
- **Edge Runtime support** - Works in Next.js middleware and Edge Runtime
- **HTTP-based communication** - Replaced WebSocket with HTTP endpoints
- **Memory usage safety** - Safely handles missing Node.js APIs
- **Improved error handling** - Better error recovery and logging

This debug pipe system provides comprehensive debugging capabilities for both client and server-side code, making it easier to track down issues and monitor application performance in Next.js applications. 