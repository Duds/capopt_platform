export interface DebugEvent {
  timestamp: number
  type: 'request' | 'response' | 'error' | 'performance' | 'state' | 'custom'
  source: string
  data: any
  metadata?: {
    userId?: string
    sessionId?: string
    requestId?: string
    duration?: number
    memory?: number
  }
}

export interface DebugPipeOptions {
  enabled?: boolean
  logToConsole?: boolean
  saveToFile?: boolean
  maxEvents?: number
  filterTypes?: string[]
}

class DebugPipe {
  private events: DebugEvent[] = []
  private options: DebugPipeOptions
  private isEnabled: boolean
  private listeners: ((event: DebugEvent) => void)[] = []

  constructor(options: DebugPipeOptions = {}) {
    this.options = {
      enabled: true,
      logToConsole: false,
      saveToFile: false,
      maxEvents: 1000,
      filterTypes: [],
      ...options
    }
    this.isEnabled = this.options.enabled!
  }

  private handleDebugEvent(event: DebugEvent) {
    // Add to events array
    this.events.push(event)
    
    // Maintain max events limit
    if (this.events.length > this.options.maxEvents!) {
      this.events.shift()
    }

    // Log to console if enabled
    if (this.options.logToConsole) {
      console.log(`[DEBUG-PIPE] ${event.type.toUpperCase()}:`, {
        source: event.source,
        data: event.data,
        timestamp: new Date(event.timestamp).toISOString(),
        ...event.metadata
      })
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('[DEBUG-PIPE] Listener error:', error)
      }
    })
  }

  // Event listener methods (simplified EventEmitter)
  public on(event: string, listener: (data: any) => void) {
    if (event === 'event' || event === 'debug-event') {
      this.listeners.push(listener)
    }
  }

  public off(event: string, listener: (data: any) => void) {
    if (event === 'event' || event === 'debug-event') {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  public emit(event: string, data?: any): boolean {
    if (!this.isEnabled) return false

    const debugEvent: DebugEvent = {
      timestamp: Date.now(),
      type: 'custom',
      source: 'debug-pipe',
      data: data || event,
      metadata: {
        requestId: this.generateRequestId()
      }
    }

    this.handleDebugEvent(debugEvent)
    return true
  }

  public log(type: string, source: string, data: any, metadata?: any) {
    if (!this.isEnabled) return

    const debugEvent: DebugEvent = {
      timestamp: Date.now(),
      type: type as any,
      source,
      data,
      metadata: {
        ...metadata,
        requestId: this.generateRequestId()
      }
    }

    this.handleDebugEvent(debugEvent)
  }

  public request(req: any, res: any, next?: any) {
    if (!this.isEnabled) {
      if (next) next()
      return
    }

    const startTime = Date.now()
    const requestId = this.generateRequestId()

    // Log request
    this.log('request', 'middleware', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }, { requestId })

    // Override res.end to capture response
    const originalEnd = res.end
    res.end = function(this: any, chunk: any, encoding: any) {
      const duration = Date.now() - startTime
      
      debugPipe.log('response', 'middleware', {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: chunk
      }, { 
        requestId,
        duration,
        memory: process.memoryUsage ? process.memoryUsage() : undefined
      })

      originalEnd.call(this, chunk, encoding)
    }

    if (next) next()
  }

  public performance(label: string, fn: () => any) {
    if (!this.isEnabled) return fn()

    const startTime = Date.now()
    const startMemory = process.memoryUsage ? process.memoryUsage() : undefined

    try {
      const result = fn()
      const duration = Date.now() - startTime
      const endMemory = process.memoryUsage ? process.memoryUsage() : undefined

      this.log('performance', 'performance', {
        label,
        result,
        duration,
        memoryDelta: startMemory && endMemory ? {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
          external: endMemory.external - startMemory.external
        } : undefined
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      this.log('error', 'performance', {
        label,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        duration
      })

      throw error
    }
  }

  public state(component: string, state: any, action?: string) {
    this.log('state', 'react', {
      component,
      state,
      action
    })
  }

  public error(error: Error, context?: any) {
    this.log('error', 'error-handler', {
      message: error.message,
      stack: error.stack,
      context
    })
  }

  // Consumer methods
  public getEvents(type?: string): DebugEvent[] {
    if (type) {
      return this.events.filter(event => event.type === type)
    }
    return [...this.events]
  }

  public getRecentEvents(count: number = 10): DebugEvent[] {
    return this.events.slice(-count)
  }

  public clearEvents() {
    this.events = []
  }

  public enable() {
    this.isEnabled = true
  }

  public disable() {
    this.isEnabled = false
  }

  public isDebugEnabled(): boolean {
    return this.isEnabled
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Create singleton instance
const debugPipe = new DebugPipe({
  enabled: process.env.NODE_ENV === 'development',
  logToConsole: process.env.DEBUG_PIPE_CONSOLE === 'true',
  maxEvents: 1000
})

export default debugPipe
export { DebugPipe } 