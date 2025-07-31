import React, { useEffect, useState, useCallback } from 'react'
import type { DebugEvent } from '@/lib/debug-pipe'

interface UseDebugPipeOptions {
  enabled?: boolean
  filterTypes?: string[]
  maxEvents?: number
  autoConnect?: boolean
}

interface UseDebugPipeReturn {
  events: DebugEvent[]
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  clearEvents: () => void
  getEventsByType: (type: string) => DebugEvent[]
  getRecentEvents: (count: number) => DebugEvent[]
  logEvent: (type: string, source: string, data: any, metadata?: any) => void
}

export function useDebugPipe(options: UseDebugPipeOptions = {}): UseDebugPipeReturn {
  const {
    enabled = process.env.NODE_ENV === 'development',
    filterTypes = [],
    maxEvents = 100,
    autoConnect = true
  } = options

  const [events, setEvents] = useState<DebugEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(() => {
    if (!enabled || isConnected) return

    try {
      // Simple HTTP connection check
      fetch('/api/debug/ws')
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            setIsConnected(true)
            console.log('[DEBUG-PIPE] Connected to debug server')
          }
        })
        .catch(error => {
          console.error('[DEBUG-PIPE] Failed to connect:', error)
          setIsConnected(false)
        })
    } catch (error) {
      console.error('[DEBUG-PIPE] Failed to connect:', error)
      setIsConnected(false)
    }
  }, [enabled, isConnected])

  const disconnect = useCallback(() => {
    setIsConnected(false)
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const getEventsByType = useCallback((type: string) => {
    return events.filter(event => event.type === type)
  }, [events])

  const getRecentEvents = useCallback((count: number) => {
    return events.slice(-count)
  }, [events])

  const logEvent = useCallback(async (type: string, source: string, data: any, metadata?: any) => {
    if (!enabled) return

    const debugEvent: DebugEvent = {
      timestamp: Date.now(),
      type: type as any,
      source,
      data,
      metadata: {
        ...metadata,
        clientSide: true
      }
    }

    // Send to server via HTTP if connected
    if (isConnected) {
      try {
        await fetch('/api/debug/ws', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(debugEvent)
        })
      } catch (error) {
        console.error('[DEBUG-PIPE] Failed to send event:', error)
      }
    }

    // Add to local events
    setEvents(prev => {
      const newEvents = [...prev, debugEvent]
      if (newEvents.length > maxEvents) {
        return newEvents.slice(-maxEvents)
      }
      return newEvents
    })
  }, [enabled, isConnected, maxEvents])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, enabled, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    events,
    isConnected,
    connect,
    disconnect,
    clearEvents,
    getEventsByType,
    getRecentEvents,
    logEvent
  }
}

// Higher-order component for automatic debugging
export function withDebugPipe<P extends object>(
  Component: React.ComponentType<P>,
  debugOptions?: UseDebugPipeOptions
) {
  return function DebuggedComponent(props: P) {
    const debugPipe = useDebugPipe(debugOptions)

    // Log component lifecycle
    useEffect(() => {
      debugPipe.logEvent('state', 'react', {
        component: Component.name,
        action: 'mount',
        props
      })

      return () => {
        debugPipe.logEvent('state', 'react', {
          component: Component.name,
          action: 'unmount'
        })
      }
    }, [debugPipe])

    return React.createElement(Component, props)
  }
} 