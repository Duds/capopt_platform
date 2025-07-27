/**
 * Strategic Context Component - Strategic Alignment Display
 * 
 * Provides strategic-level context and alignment information:
 * - Strategic alignment scores across all layers
 * - Business canvas and value chain alignment
 * - Operating model and risk alignment metrics
 * - Strategic objective tracking and progress
 * - Performance alignment indicators
 * - Strategic navigation context
 * - Real-time alignment monitoring
 * - Strategic decision support information
 * 
 * This component provides strategic context for users
 * navigating the operational capability platform.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface StrategicAlignment {
  businessCanvas: number
  valueChain: number
  operatingModel: number
  riskAlignment: number
  performanceAlignment: number
}

interface StrategicObjective {
  id: string
  name: string
  description: string
  status: 'on-track' | 'at-risk' | 'behind'
  progress: number
  target: number
}

interface StrategicContextProps {
  className?: string
  showDetails?: boolean
}

export function StrategicContext({ className = '', showDetails = false }: StrategicContextProps) {
  const [alignment, setAlignment] = useState<StrategicAlignment>({
    businessCanvas: 85,
    valueChain: 78,
    operatingModel: 72,
    riskAlignment: 92,
    performanceAlignment: 88
  })
  const [objectives, setObjectives] = useState<StrategicObjective[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Implementation status - these are not fully implemented in the database
  const implementationStatus = {
    businessCanvasAlignment: true,    // ✅ Implemented in database
    valueChainAlignment: false,       // ⏳ Not implemented in database
    operatingModelAlignment: false,   // ⏳ Not implemented in database
    riskAlignment: true,              // ✅ Implemented in database (via controls)
    performanceAlignment: false,      // ⏳ Not implemented in database
    strategicObjectives: false,       // ⏳ Not implemented in database
    realTimeAlignment: false          // ⏳ Not implemented in database
  }

  useEffect(() => {
    // Fetch strategic context data
    const fetchStrategicContext = async () => {
      try {
        // Mock data for now - replace with actual API calls
        setObjectives([
          {
            id: '1',
            name: 'Operational Excellence',
            description: 'Achieve 95% operational efficiency across all streams',
            status: 'on-track',
            progress: 85,
            target: 95
          },
          {
            id: '2',
            name: 'Safety Performance',
            description: 'Zero safety incidents and 100% compliance',
            status: 'on-track',
            progress: 98,
            target: 100
          },
          {
            id: '3',
            name: 'Environmental Stewardship',
            description: 'Reduce environmental impact by 15%',
            status: 'at-risk',
            progress: 65,
            target: 85
          },
          {
            id: '4',
            name: 'Value Creation',
            description: 'Increase shareholder value by 20%',
            status: 'behind',
            progress: 45,
            target: 80
          }
        ])

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching strategic context:', error)
        setIsLoading(false)
      }
    }

    fetchStrategicContext()
  }, [])

  const getAlignmentColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAlignmentIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-blue-500" />
    if (score >= 70) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <AlertTriangle className="h-4 w-4 text-red-500" />
  }

  const getObjectiveStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800'
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'behind':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getObjectiveStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'at-risk':
        return <Minus className="h-4 w-4 text-yellow-500" />
      case 'behind':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Strategic Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4" />
          Strategic Alignment
          <Badge variant="outline" className="text-xs">Mock Data</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Alignment Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Alignment</span>
            <span className={`text-lg font-bold ${getAlignmentColor(alignment.businessCanvas)}`}>
              {Math.round((alignment.businessCanvas + alignment.valueChain + alignment.operatingModel + alignment.riskAlignment + alignment.performanceAlignment) / 5)}%
            </span>
          </div>
          <Progress value={Math.round((alignment.businessCanvas + alignment.valueChain + alignment.operatingModel + alignment.riskAlignment + alignment.performanceAlignment) / 5)} className="h-2" />
        </div>

        {/* Strategic Alignment Metrics */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Alignment Metrics</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Business Canvas</span>
              <div className="flex items-center gap-2">
                <span className={getAlignmentColor(alignment.businessCanvas)}>{alignment.businessCanvas}%</span>
                {getAlignmentIcon(alignment.businessCanvas)}
                <Badge variant="secondary" className="text-xs">✓</Badge>
              </div>
            </div>
            <div className={`flex items-center justify-between text-xs ${!implementationStatus.valueChainAlignment ? 'opacity-50' : ''}`}>
              <span>Value Chain</span>
              <div className="flex items-center gap-2">
                <span className={getAlignmentColor(alignment.valueChain)}>{alignment.valueChain}%</span>
                {getAlignmentIcon(alignment.valueChain)}
                {!implementationStatus.valueChainAlignment && (
                  <Badge variant="outline" className="text-xs">Mock</Badge>
                )}
              </div>
            </div>
            <div className={`flex items-center justify-between text-xs ${!implementationStatus.operatingModelAlignment ? 'opacity-50' : ''}`}>
              <span>Operating Model</span>
              <div className="flex items-center gap-2">
                <span className={getAlignmentColor(alignment.operatingModel)}>{alignment.operatingModel}%</span>
                {getAlignmentIcon(alignment.operatingModel)}
                {!implementationStatus.operatingModelAlignment && (
                  <Badge variant="outline" className="text-xs">Mock</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Risk Alignment</span>
              <div className="flex items-center gap-2">
                <span className={getAlignmentColor(alignment.riskAlignment)}>{alignment.riskAlignment}%</span>
                {getAlignmentIcon(alignment.riskAlignment)}
                <Badge variant="secondary" className="text-xs">✓</Badge>
              </div>
            </div>
            <div className={`flex items-center justify-between text-xs ${!implementationStatus.performanceAlignment ? 'opacity-50' : ''}`}>
              <span>Performance Alignment</span>
              <div className="flex items-center gap-2">
                <span className={getAlignmentColor(alignment.performanceAlignment)}>{alignment.performanceAlignment}%</span>
                {getAlignmentIcon(alignment.performanceAlignment)}
                {!implementationStatus.performanceAlignment && (
                  <Badge variant="outline" className="text-xs">Mock</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Objectives */}
        {showDetails && (
          <div className={`space-y-2 ${!implementationStatus.strategicObjectives ? 'opacity-50' : ''}`}>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              Strategic Objectives
              {!implementationStatus.strategicObjectives && (
                <Badge variant="outline" className="text-xs">Mock Data</Badge>
              )}
            </div>
            <div className="space-y-2">
              {objectives.map((objective) => (
                <div key={objective.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{objective.name}</span>
                    <Badge className={`text-xs ${getObjectiveStatusColor(objective.status)}`}>
                      {objective.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{objective.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress: {objective.progress}%</span>
                    <div className="flex items-center gap-1">
                      <span>Target: {objective.target}%</span>
                      {getObjectiveStatusIcon(objective.status)}
                    </div>
                  </div>
                  <Progress value={objective.progress} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full text-xs" disabled={!implementationStatus.strategicObjectives}>
            View Strategic Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 