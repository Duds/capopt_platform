/**
 * Process Map Viewer Component - Process Visualization Interface
 * 
 * Provides interactive process map visualization and management:
 * - Visual process flow diagrams with step-by-step representation
 * - Process step types (start, process, decision, end, subprocess)
 * - Real-time process execution simulation
 * - Zoom and pan controls for large process maps
 * - Step status tracking and progress monitoring
 * - Control and risk integration for each step
 * - Process metadata and version control
 * - Export and sharing capabilities
 * - Interactive step selection and editing
 * 
 * This component enables detailed process analysis and optimization
 * within the operational capability framework.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Workflow, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Share,
  Edit,
  Plus,
  ArrowRight,
  ArrowDown,
  Circle,
  Square as SquareIcon,
  Diamond,
  Hexagon,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface ProcessStep {
  id: string
  name: string
  description: string
  type: 'start' | 'process' | 'decision' | 'end' | 'subprocess'
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  assignedTo: string
  estimatedDuration: number
  actualDuration?: number
  dependencies: string[]
  controls: string[]
  risks: string[]
  position: { x: number; y: number }
}

interface ProcessMap {
  id: string
  name: string
  description: string
  version: string
  status: string
  steps: ProcessStep[]
  connections: Array<{
    id: string
    from: string
    to: string
    condition?: string
  }>
  metadata: {
    createdBy: string
    createdAt: string
    lastModified: string
    totalSteps: number
    estimatedDuration: number
    actualDuration?: number
  }
}

interface ProcessMapViewerProps {
  processId: string
  onClose: () => void
}

export function ProcessMapViewer({ processId, onClose }: ProcessMapViewerProps) {
  const [processMap, setProcessMap] = useState<ProcessMap | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  useEffect(() => {
    fetchProcessMap()
  }, [processId])

  const fetchProcessMap = async () => {
    try {
      setIsLoading(true)
      // Mock data - replace with actual API call
      setProcessMap({
        id: processId,
        name: "Copper Flotation Process",
        description: "Complete process for copper flotation including crushing, grinding, flotation, and dewatering",
        version: "2.1",
        status: "ACTIVE",
        steps: [
          {
            id: "step-1",
            name: "Start Process",
            description: "Initialize copper flotation process",
            type: "start",
            status: "completed",
            assignedTo: "Process Operator",
            estimatedDuration: 5,
            actualDuration: 5,
            dependencies: [],
            controls: ["Process Initiation Control"],
            risks: ["Equipment Failure"],
            position: { x: 100, y: 50 }
          },
          {
            id: "step-2",
            name: "Crushing & Grinding",
            description: "Crush and grind ore to required particle size",
            type: "process",
            status: "completed",
            assignedTo: "Crusher Operator",
            estimatedDuration: 120,
            actualDuration: 115,
            dependencies: ["step-1"],
            controls: ["Particle Size Control", "Equipment Monitoring"],
            risks: ["Equipment Failure", "Particle Size Issues"],
            position: { x: 300, y: 50 }
          },
          {
            id: "step-3",
            name: "Check Particle Size",
            description: "Verify particle size meets specifications",
            type: "decision",
            status: "completed",
            assignedTo: "Quality Control",
            estimatedDuration: 15,
            actualDuration: 12,
            dependencies: ["step-2"],
            controls: ["Quality Control Check"],
            risks: ["Specification Non-compliance"],
            position: { x: 500, y: 50 }
          },
          {
            id: "step-4",
            name: "Flotation Process",
            description: "Separate copper minerals using flotation",
            type: "process",
            status: "in-progress",
            assignedTo: "Flotation Operator",
            estimatedDuration: 180,
            actualDuration: 90,
            dependencies: ["step-3"],
            controls: ["Flotation Control", "Chemical Dosage Control"],
            risks: ["Poor Recovery", "Chemical Issues"],
            position: { x: 700, y: 50 }
          },
          {
            id: "step-5",
            name: "Dewatering",
            description: "Remove water from concentrate",
            type: "process",
            status: "pending",
            assignedTo: "Dewatering Operator",
            estimatedDuration: 60,
            dependencies: ["step-4"],
            controls: ["Moisture Control"],
            risks: ["High Moisture Content"],
            position: { x: 900, y: 50 }
          },
          {
            id: "step-6",
            name: "Quality Check",
            description: "Final quality assessment",
            type: "decision",
            status: "pending",
            assignedTo: "Quality Control",
            estimatedDuration: 30,
            dependencies: ["step-5"],
            controls: ["Final Quality Control"],
            risks: ["Quality Non-compliance"],
            position: { x: 1100, y: 50 }
          },
          {
            id: "step-7",
            name: "End Process",
            description: "Complete copper flotation process",
            type: "end",
            status: "pending",
            assignedTo: "Process Operator",
            estimatedDuration: 5,
            dependencies: ["step-6"],
            controls: ["Process Completion Control"],
            risks: ["Incomplete Process"],
            position: { x: 1300, y: 50 }
          }
        ],
        connections: [
          { id: "conn-1", from: "step-1", to: "step-2" },
          { id: "conn-2", from: "step-2", to: "step-3" },
          { id: "conn-3", from: "step-3", to: "step-4", condition: "Size OK" },
          { id: "conn-4", from: "step-4", to: "step-5" },
          { id: "conn-5", from: "step-5", to: "step-6" },
          { id: "conn-6", from: "step-6", to: "step-7", condition: "Quality OK" }
        ],
        metadata: {
          createdBy: "Michael Chen",
          createdAt: "2024-01-15",
          lastModified: "2024-01-20",
          totalSteps: 7,
          estimatedDuration: 415,
          actualDuration: 222
        }
      })
    } catch (error) {
      console.error('Error fetching process map:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'start':
        return <Circle className="h-4 w-4" />
      case 'process':
        return <SquareIcon className="h-4 w-4" />
      case 'decision':
        return <Diamond className="h-4 w-4" />
      case 'end':
        return <Circle className="h-4 w-4" />
      case 'subprocess':
        return <Hexagon className="h-4 w-4" />
      default:
        return <SquareIcon className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50))
  const handleResetZoom = () => setZoom(100)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Animation logic would go here
  }

  const handleStepClick = (stepId: string) => {
    setSelectedStep(selectedStep === stepId ? null : stepId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading process map...</p>
        </div>
      </div>
    )
  }

  if (!processMap) {
    return (
      <div className="text-center py-8">
        <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Process map not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{processMap.name}</h1>
          <p className="text-muted-foreground">{processMap.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Process Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processMap.metadata.totalSteps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processMap.metadata.estimatedDuration}m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processMap.metadata.actualDuration || 0}m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((processMap.steps.filter(s => s.status === 'completed').length / processMap.steps.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Map Visualization */}
      <Tabs defaultValue="visual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visual">Visual Map</TabsTrigger>
          <TabsTrigger value="list">Step List</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="relative bg-gray-50 rounded-lg p-8 overflow-auto"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left',
                  minHeight: '400px'
                }}
              >
                {/* Process Steps */}
                <div className="relative">
                  {processMap.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`absolute p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStep === step.id 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      } ${
                        currentStep === step.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                      style={{
                        left: step.position.x,
                        top: step.position.y,
                        width: '200px'
                      }}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getStepIcon(step.type)}
                        <span className="font-medium text-sm">{step.name}</span>
                        {getStatusIcon(step.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>{step.assignedTo}</span>
                        <Badge className={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Duration: {step.actualDuration || step.estimatedDuration}m
                      </div>
                    </div>
                  ))}

                  {/* Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {processMap.connections.map((connection) => {
                      const fromStep = processMap.steps.find(s => s.id === connection.from)
                      const toStep = processMap.steps.find(s => s.id === connection.to)
                      
                      if (!fromStep || !toStep) return null

                      const fromX = fromStep.position.x + 200 // Step width
                      const fromY = fromStep.position.y + 50  // Step height / 2
                      const toX = toStep.position.x
                      const toY = toStep.position.y + 50

                      return (
                        <g key={connection.id}>
                          <line
                            x1={fromX}
                            y1={fromY}
                            x2={toX}
                            y2={toY}
                            stroke="#6b7280"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                          {connection.condition && (
                            <text
                              x={(fromX + toX) / 2}
                              y={(fromY + toY) / 2 - 10}
                              textAnchor="middle"
                              className="text-xs fill-gray-600"
                            >
                              {connection.condition}
                            </text>
                          )}
                        </g>
                      )
                    })}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processMap.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStep === step.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          {getStepIcon(step.type)}
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <Badge className={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{step.assignedTo}</span>
                        <span>{step.actualDuration || step.estimatedDuration}m</span>
                        {getStatusIcon(step.status)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedStep && (
            <Card>
              <CardHeader>
                <CardTitle>Step Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const step = processMap.steps.find(s => s.id === selectedStep)
                  if (!step) return null

                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{step.name}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Assigned To:</span>
                          <p className="text-sm">{step.assignedTo}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Duration:</span>
                          <p className="text-sm">{step.actualDuration || step.estimatedDuration} minutes</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Type:</span>
                          <p className="text-sm capitalize">{step.type}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Status:</span>
                          <Badge className={getStatusColor(step.status)}>
                            {step.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Controls:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.controls.map((control, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {control}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Risks:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.risks.map((risk, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-red-600">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 