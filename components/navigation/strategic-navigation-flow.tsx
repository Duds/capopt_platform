/**
 * Strategic Navigation Flow Component - Layer Navigation Interface
 * 
 * Provides strategic navigation between platform layers and contexts:
 * - Navigation between strategic and operational layers
 * - Layer alignment scores and status indicators
 * - Implementation status for each layer
 * - Context-aware navigation suggestions
 * - Strategic flow visualization
 * - Layer-specific routing and navigation
 * - Performance and alignment metrics
 * - Visual status indicators for layer health
 * 
 * This component enables strategic navigation through the
 * operational capability optimization framework.
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight,
  ArrowLeft,
  Layers,
  Map,
  Network,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Workflow,
  Building2,
  Factory
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavigationFlowProps {
  currentLayer: 'operational' | 'strategic'
  currentContext?: string
  className?: string
}

interface LayerInfo {
  name: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'inactive' | 'warning'
  alignment: number
  route: string
  implemented: boolean
}

export function StrategicNavigationFlow({ 
  currentLayer = 'operational', 
  currentContext = 'processes',
  className = '' 
}: NavigationFlowProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  // Implementation status - these are not fully implemented in the database
  const implementationStatus = {
    realTimeAlignment: false, // ⏳ Not implemented in database
    strategicNavigation: false, // ⏳ Not implemented in database
    layerNavigation: false // ⏳ Not implemented in database
  }

  const layers: LayerInfo[] = [
    {
      name: 'Process Maps',
      description: 'Operational processes and workflows',
      icon: <Workflow className="h-5 w-5" />,
      status: currentLayer === 'operational' ? 'active' : 'inactive',
      alignment: 78,
      route: '/processes',
      implemented: true // ✅ Implemented in database
    },
    {
      name: 'Service Model',
      description: 'Service design and delivery',
      icon: <BookOpen className="h-5 w-5" />,
      status: 'inactive',
      alignment: 65,
      route: '/strategic/service-model',
      implemented: false // ⏳ Not implemented in database
    },
    {
      name: 'Value Chain',
      description: 'Value creation and delivery',
      icon: <Network className="h-5 w-5" />,
      status: 'inactive',
      alignment: 72,
      route: '/strategic/value-chain',
      implemented: false // ⏳ Not implemented in database
    },
    {
      name: 'Operating Model',
      description: 'Operational strategy and design',
      icon: <Map className="h-5 w-5" />,
      status: 'inactive',
      alignment: 68,
      route: '/strategic/operating-model',
      implemented: false // ⏳ Not implemented in database
    },
    {
      name: 'Business Canvas',
      description: 'Strategic business model',
      icon: <Layers className="h-5 w-5" />,
      status: 'inactive',
      alignment: 85,
      route: '/strategic/business-canvas',
      implemented: true // ✅ Implemented in database
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'inactive':
        return <Target className="h-4 w-4 text-gray-400" />
      default:
        return <Target className="h-4 w-4 text-gray-400" />
    }
  }

  const getAlignmentColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleLayerClick = (layer: LayerInfo) => {
    if (layer.implemented) {
      router.push(layer.route)
    }
  }

  const handleStrategicNavigation = (direction: 'up' | 'down') => {
    const currentIndex = layers.findIndex(layer => layer.status === 'active')
    let targetIndex: number

    if (direction === 'up') {
      targetIndex = Math.max(0, currentIndex - 1)
    } else {
      targetIndex = Math.min(layers.length - 1, currentIndex + 1)
    }

    const targetLayer = layers[targetIndex]
    if (targetLayer && targetLayer.implemented) {
      router.push(targetLayer.route)
    }
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategic Navigation Flow
            <Badge variant="outline" className="text-xs">Mock Data</Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Context */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Current Context</span>
            <Badge variant="outline" className="text-xs">
              {currentLayer === 'operational' ? 'Operational' : 'Strategic'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {currentLayer === 'operational' ? (
              <>
                <Factory className="h-4 w-4 text-blue-500" />
                <span>Hercules Levee - Processing Operations</span>
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 text-green-500" />
                <span>Cracked Mountain Pty Ltd - Strategic View</span>
              </>
            )}
          </div>
        </div>

        {/* Navigation Flow */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Navigation Flow</div>
          <div className="space-y-2">
            {layers.map((layer, index) => (
              <div
                key={layer.name}
                className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                  layer.status === 'active' 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50 border-gray-200'
                } ${!layer.implemented ? 'opacity-50' : ''}`}
                onClick={() => handleLayerClick(layer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${layer.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {layer.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{layer.name}</div>
                      <div className="text-xs text-muted-foreground">{layer.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${getAlignmentColor(layer.alignment)}`}>
                      {layer.alignment}%
                    </span>
                    {getStatusIcon(layer.status)}
                    {layer.implemented ? (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Mock</Badge>
                    )}
                  </div>
                </div>
                {layer.status === 'active' && (
                  <div className="mt-2">
                    <Progress value={layer.alignment} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStrategicNavigation('up')}
            className="flex-1 text-xs"
            disabled={layers.findIndex(layer => layer.status === 'active') === 0}
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Previous Layer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStrategicNavigation('down')}
            className="flex-1 text-xs"
            disabled={layers.findIndex(layer => layer.status === 'active') === layers.length - 1}
          >
            Next Layer
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        {/* Alignment Summary */}
        {isExpanded && (
          <div className={`space-y-2 pt-2 border-t ${!implementationStatus.realTimeAlignment ? 'opacity-50' : ''}`}>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              Alignment Summary
              {!implementationStatus.realTimeAlignment && (
                <Badge variant="outline" className="text-xs">Mock Data</Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Strategic Alignment</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Operational Alignment</span>
                <span className="font-medium text-blue-600">78%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Risk Alignment</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Performance Alignment</span>
                <span className="font-medium text-yellow-600">72%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 