'use client'

import React, { useState, useEffect } from 'react'
import { useDebugPipe } from '@/hooks/use-debug-pipe'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  X, 
  RefreshCw, 
  Trash2, 
  Play, 
  Pause,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import type { DebugEvent } from '@/lib/debug-pipe'

interface DebugPanelProps {
  isOpen: boolean
  onClose: () => void
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'
}

export function DebugPanel({ 
  isOpen, 
  onClose, 
  position = 'bottom-right' 
}: DebugPanelProps) {
  const debugPipe = useDebugPipe({
    enabled: true,
    maxEvents: 200,
    filterTypes: []
  })

  const [isPaused, setIsPaused] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter events based on type and search term
  const filteredEvents = debugPipe.events.filter(event => {
    if (isPaused) return false
    if (filterType !== 'all' && event.type !== filterType) return false
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        event.source.toLowerCase().includes(searchLower) ||
        JSON.stringify(event.data).toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'request': return <Activity className="h-4 w-4" />
      case 'response': return <CheckCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'performance': return <Zap className="h-4 w-4" />
      case 'state': return <RefreshCw className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'request': return 'bg-blue-500'
      case 'response': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'performance': return 'bg-yellow-500'
      case 'state': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return ''
    return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`
  }

  if (!isOpen) return null

  return (
    <div className={`fixed ${position} m-4 z-50 w-96 max-h-96`}>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Debug Panel
              <Badge variant={debugPipe.isConnected ? "default" : "secondary"} className="text-xs">
                {debugPipe.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="h-6 w-6 p-0"
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={debugPipe.clearEvents}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="mt-2">
              <div className="space-y-2">
                {/* Filters */}
                <div className="flex gap-1">
                  {['all', 'request', 'response', 'error', 'performance', 'state'].map(type => (
                    <Button
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className="text-xs h-6 px-2"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-xs border rounded"
                />
                
                {/* Events List */}
                <ScrollArea className="h-64">
                  <div className="space-y-1">
                    {filteredEvents.slice().reverse().map((event, index) => (
                      <div
                        key={`${event.timestamp}-${index}`}
                        className="p-2 border rounded text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`} />
                            <span className="font-medium">{event.source}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        
                        <div className="text-muted-foreground">
                          {event.metadata?.duration && (
                            <span className="mr-2">Duration: {formatDuration(event.metadata.duration)}</span>
                          )}
                          {event.metadata?.requestId && (
                            <span>ID: {event.metadata.requestId}</span>
                          )}
                        </div>
                        
                        <details className="text-xs">
                          <summary className="cursor-pointer hover:text-foreground">
                            Data
                          </summary>
                          <pre className="mt-1 p-1 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-2">
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded">
                    <div className="font-medium">Total Events</div>
                    <div className="text-lg">{debugPipe.events.length}</div>
                  </div>
                  <div className="p-2 border rounded">
                    <div className="font-medium">Connected</div>
                    <div className="text-lg">{debugPipe.isConnected ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium">Events by Type:</div>
                  {['request', 'response', 'error', 'performance', 'state'].map(type => {
                    const count = debugPipe.getEventsByType(type).length
                    return (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type}:</span>
                        <span>{count}</span>
                      </div>
                    )
                  })}
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={debugPipe.clearEvents}
                    className="w-full"
                  >
                    Clear All Events
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 