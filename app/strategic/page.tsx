'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target, 
  TrendingUp, 
  Layers,
  Map,
  Network,
  BookOpen,
  Building2,
  Factory,
  Workflow,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { EnterpriseContext } from '@/components/navigation/enterprise-context'
import { StrategicContext } from '@/components/navigation/strategic-context'
import { StrategicBreadcrumbs } from '@/components/navigation/strategic-breadcrumbs'
import { StrategicNavigationFlow } from '@/components/navigation/strategic-navigation-flow'

interface StrategicMetrics {
  businessCanvasAlignment: number
  valueChainAlignment: number
  operatingModelAlignment: number
  serviceModelAlignment: number
  overallAlignment: number
}

interface StrategicObjective {
  id: string
  name: string
  description: string
  status: 'on-track' | 'at-risk' | 'behind'
  progress: number
  target: number
  category: string
}

export default function StrategicDashboard() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<StrategicMetrics>({
    businessCanvasAlignment: 85,
    valueChainAlignment: 78,
    operatingModelAlignment: 72,
    serviceModelAlignment: 65,
    overallAlignment: 75
  })
  const [objectives, setObjectives] = useState<StrategicObjective[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Implementation status - these are not fully implemented in the database
  const implementationStatus = {
    businessCanvasAlignment: true,    // ✅ Implemented in database
    valueChainAlignment: false,       // ⏳ Not implemented in database
    operatingModelAlignment: false,   // ⏳ Not implemented in database
    serviceModelAlignment: false,     // ⏳ Not implemented in database
    overallAlignment: false,          // ⏳ Not implemented in database
    strategicObjectives: false,       // ⏳ Not implemented in database
    strategicMetrics: false,          // ⏳ Not implemented in database
    strategicNavigation: false,       // ⏳ Not implemented in database
    realTimeData: false               // ⏳ Not implemented in database
  }

  useEffect(() => {
    // Mock data for strategic objectives
    setObjectives([
      {
        id: '1',
        name: 'Operational Excellence',
        description: 'Achieve 95% operational efficiency across all streams',
        status: 'on-track',
        progress: 85,
        target: 95,
        category: 'operational'
      },
      {
        id: '2',
        name: 'Safety Performance',
        description: 'Zero safety incidents and 100% compliance',
        status: 'on-track',
        progress: 98,
        target: 100,
        category: 'safety'
      },
      {
        id: '3',
        name: 'Environmental Stewardship',
        description: 'Reduce environmental impact by 15%',
        status: 'at-risk',
        progress: 65,
        target: 85,
        category: 'environmental'
      },
      {
        id: '4',
        name: 'Value Creation',
        description: 'Increase shareholder value by 20%',
        status: 'behind',
        progress: 45,
        target: 80,
        category: 'financial'
      },
      {
        id: '5',
        name: 'Innovation Leadership',
        description: 'Implement 3 new technology initiatives',
        status: 'on-track',
        progress: 75,
        target: 90,
        category: 'innovation'
      },
      {
        id: '6',
        name: 'Stakeholder Engagement',
        description: 'Improve stakeholder satisfaction to 90%',
        status: 'at-risk',
        progress: 70,
        target: 90,
        category: 'stakeholder'
      }
    ])
    setIsLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'behind':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Strategic Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Strategic Navigation Breadcrumbs */}
      <div className="border-b bg-white px-6 py-3">
        <StrategicBreadcrumbs showStrategic={true} />
      </div>

      {/* Strategic Navigation Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnterpriseContext showDetails={true} />
        <StrategicContext showDetails={true} />
        <StrategicNavigationFlow currentLayer="strategic" currentContext="dashboard" />
      </div>

      {/* Strategic Alignment Overview */}
      <Card className={!implementationStatus.strategicMetrics ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategic Alignment Overview
            {implementationStatus.strategicMetrics ? (
              <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Mock Data</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Overall strategic alignment across all layers and objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getAlignmentColor(metrics.businessCanvasAlignment)}`}>
                {metrics.businessCanvasAlignment}%
              </div>
              <div className="text-sm text-gray-500">Business Canvas</div>
              <Progress value={metrics.businessCanvasAlignment} className="mt-2" />
              <Badge variant="secondary" className="text-xs mt-1">✓</Badge>
            </div>
            <div className={`text-center ${!implementationStatus.valueChainAlignment ? 'opacity-50' : ''}`}>
              <div className={`text-3xl font-bold ${getAlignmentColor(metrics.valueChainAlignment)}`}>
                {metrics.valueChainAlignment}%
              </div>
              <div className="text-sm text-gray-500">Value Chain</div>
              <Progress value={metrics.valueChainAlignment} className="mt-2" />
              {!implementationStatus.valueChainAlignment && (
                <Badge variant="outline" className="text-xs mt-1">Mock</Badge>
              )}
            </div>
            <div className={`text-center ${!implementationStatus.operatingModelAlignment ? 'opacity-50' : ''}`}>
              <div className={`text-3xl font-bold ${getAlignmentColor(metrics.operatingModelAlignment)}`}>
                {metrics.operatingModelAlignment}%
              </div>
              <div className="text-sm text-gray-500">Operating Model</div>
              <Progress value={metrics.operatingModelAlignment} className="mt-2" />
              {!implementationStatus.operatingModelAlignment && (
                <Badge variant="outline" className="text-xs mt-1">Mock</Badge>
              )}
            </div>
            <div className={`text-center ${!implementationStatus.serviceModelAlignment ? 'opacity-50' : ''}`}>
              <div className={`text-3xl font-bold ${getAlignmentColor(metrics.serviceModelAlignment)}`}>
                {metrics.serviceModelAlignment}%
              </div>
              <div className="text-sm text-gray-500">Service Model</div>
              <Progress value={metrics.serviceModelAlignment} className="mt-2" />
              {!implementationStatus.serviceModelAlignment && (
                <Badge variant="outline" className="text-xs mt-1">Mock</Badge>
              )}
            </div>
            <div className={`text-center ${!implementationStatus.overallAlignment ? 'opacity-50' : ''}`}>
              <div className={`text-3xl font-bold ${getAlignmentColor(metrics.overallAlignment)}`}>
                {metrics.overallAlignment}%
              </div>
              <div className="text-sm text-gray-500">Overall</div>
              <Progress value={metrics.overallAlignment} className="mt-2" />
              {!implementationStatus.overallAlignment && (
                <Badge variant="outline" className="text-xs mt-1">Mock</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Objectives */}
      <Card className={!implementationStatus.strategicObjectives ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Strategic Objectives
            {implementationStatus.strategicObjectives ? (
              <Badge variant="secondary" className="text-xs">
                {objectives.filter(obj => obj.status === 'on-track').length}/{objectives.length} On Track
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Mock Data</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Key strategic objectives and their current progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((objective) => (
              <Card key={objective.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm">{objective.name}</span>
                    {getStatusIcon(objective.status)}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {objective.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span className="font-medium">{objective.progress}%</span>
                    </div>
                    <Progress value={objective.progress} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>Target</span>
                      <span className="font-medium">{objective.target}%</span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(objective.status)}`}>
                      {objective.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Navigation Actions */}
      <Card className={!implementationStatus.strategicNavigation ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Strategic Navigation Actions
            {!implementationStatus.strategicNavigation && (
              <Badge variant="outline" className="text-xs">Mock Data</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Navigate between strategic and operational layers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Layers className="h-6 w-6" />
              <span>Business Canvas</span>
              <span className="text-xs text-muted-foreground">Strategic Model</span>
              <Badge variant="secondary" className="text-xs">✓</Badge>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" disabled>
              <Map className="h-6 w-6" />
              <span>Operating Model</span>
              <span className="text-xs text-muted-foreground">Operational Strategy</span>
              <Badge variant="outline" className="text-xs">Mock</Badge>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" disabled>
              <Network className="h-6 w-6" />
              <span>Value Chain</span>
              <span className="text-xs text-muted-foreground">Value Creation</span>
              <Badge variant="outline" className="text-xs">Mock</Badge>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Workflow className="h-6 w-6" />
              <span>Process Maps</span>
              <span className="text-xs text-muted-foreground">Operational View</span>
              <Badge variant="secondary" className="text-xs">✓</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 