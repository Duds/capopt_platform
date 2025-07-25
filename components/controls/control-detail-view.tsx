'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText,
  Edit,
  History,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  User,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

interface ControlDetail {
  id: string
  name: string
  description: string
  complianceStatus: string
  priority: string
  riskCategory: string
  controlType: string
  effectiveness: string
  owner: string
  assignedTo: string[]
  lastAssessment: string
  nextAssessment: string
  assessmentFrequency: string
  documentation: string[]
  relatedProcesses: string[]
  relatedAssets: string[]
  effectivenessHistory: Array<{
    date: string
    score: number
    assessor: string
    notes: string
  }>
  complianceHistory: Array<{
    date: string
    status: string
    assessor: string
    notes: string
  }>
  riskAssessment: {
    likelihood: number
    impact: number
    riskScore: number
    mitigationLevel: number
  }
}

interface ControlDetailViewProps {
  controlId: string
  onClose: () => void
}

export function ControlDetailView({ controlId, onClose }: ControlDetailViewProps) {
  const [control, setControl] = useState<ControlDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchControlDetail()
  }, [controlId])

  const fetchControlDetail = async () => {
    try {
      setIsLoading(true)
      // Mock data - replace with actual API call
      setControl({
        id: controlId,
        name: "Critical Control - Equipment Isolation",
        description: "Ensures proper isolation of equipment during maintenance activities to prevent unauthorized operation and potential safety incidents.",
        complianceStatus: "COMPLIANT",
        priority: "CRITICAL",
        riskCategory: "Safety",
        controlType: "Preventive",
        effectiveness: "EFFECTIVE",
        owner: "Michael Chen",
        assignedTo: ["Andrew Taylor", "Sarah Johnson", "David Wilson"],
        lastAssessment: "2024-01-15",
        nextAssessment: "2024-04-15",
        assessmentFrequency: "Quarterly",
        documentation: [
          "Equipment Isolation Procedure v2.1",
          "Maintenance Safety Guidelines",
          "Lockout/Tagout Training Manual"
        ],
        relatedProcesses: [
          "Equipment Maintenance Process",
          "Safety Management Process",
          "Emergency Response Process"
        ],
        relatedAssets: [
          "Crusher Unit 1",
          "Conveyor System A",
          "Flotation Circuit"
        ],
        effectivenessHistory: [
          {
            date: "2024-01-15",
            score: 95,
            assessor: "Michael Chen",
            notes: "Excellent compliance observed. All procedures followed correctly."
          },
          {
            date: "2023-10-15",
            score: 88,
            assessor: "Sarah Johnson",
            notes: "Minor improvements needed in documentation updates."
          },
          {
            date: "2023-07-15",
            score: 92,
            assessor: "David Wilson",
            notes: "Good performance with some training recommendations."
          }
        ],
        complianceHistory: [
          {
            date: "2024-01-15",
            status: "COMPLIANT",
            assessor: "Michael Chen",
            notes: "All requirements met. No issues identified."
          },
          {
            date: "2023-10-15",
            status: "COMPLIANT",
            assessor: "Sarah Johnson",
            notes: "Minor documentation updates required."
          },
          {
            date: "2023-07-15",
            status: "COMPLIANT",
            assessor: "David Wilson",
            notes: "Compliant with minor training recommendations."
          }
        ],
        riskAssessment: {
          likelihood: 3,
          impact: 5,
          riskScore: 15,
          mitigationLevel: 4
        }
      })
    } catch (error) {
      console.error('Error fetching control detail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800'
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800'
      case 'PARTIALLY_COMPLIANT':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'EFFECTIVE':
        return 'bg-green-100 text-green-800'
      case 'PARTIALLY_EFFECTIVE':
        return 'bg-yellow-100 text-yellow-800'
      case 'INEFFECTIVE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading control details...</p>
        </div>
      </div>
    )
  }

  if (!control) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Control not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{control.name}</h1>
          <p className="text-muted-foreground">{control.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Control
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Critical Control</DialogTitle>
                <DialogDescription>
                  Update control information and settings
                </DialogDescription>
              </DialogHeader>
              {/* Edit form would go here */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(control.complianceStatus)}>
              {control.complianceStatus}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getPriorityColor(control.priority)}>
              {control.priority}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effectiveness</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getEffectivenessColor(control.effectiveness)}>
              {control.effectiveness}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{control.riskAssessment.riskScore}</div>
            <p className="text-xs text-muted-foreground">
              High Risk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="related">Related Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Control Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Owner:</span>
                    <p>{control.owner}</p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <p>{control.controlType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p>{control.riskCategory}</p>
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <p>{control.assessmentFrequency}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-sm">Assigned To:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {control.assignedTo.map((person, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Last Assessment:</span>
                    <p>{control.lastAssessment}</p>
                  </div>
                  <div>
                    <span className="font-medium">Next Assessment:</span>
                    <p>{control.nextAssessment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {control.effectivenessHistory.slice(0, 3).map((assessment, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Effectiveness Assessment</p>
                        <p className="text-xs text-muted-foreground">
                          Score: {assessment.score}% by {assessment.assessor}
                        </p>
                        <p className="text-xs text-muted-foreground">{assessment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effectiveness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Effectiveness History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {control.effectivenessHistory.map((assessment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{assessment.date}</span>
                        <Badge variant="outline">{assessment.score}%</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Assessor: {assessment.assessor}
                      </span>
                    </div>
                    <Progress value={assessment.score} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{assessment.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Compliance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {control.complianceHistory.map((compliance, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{compliance.date}</span>
                        <Badge className={getStatusColor(compliance.status)}>
                          {compliance.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Assessor: {compliance.assessor}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{compliance.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Likelihood</span>
                    <div className="text-2xl font-bold">{control.riskAssessment.likelihood}/5</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Impact</span>
                    <div className="text-2xl font-bold">{control.riskAssessment.impact}/5</div>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Risk Score</span>
                  <div className="text-3xl font-bold text-red-600">
                    {control.riskAssessment.riskScore}
                  </div>
                  <p className="text-sm text-muted-foreground">High Risk Level</p>
                </div>

                <div>
                  <span className="text-sm font-medium">Mitigation Level</span>
                  <div className="text-2xl font-bold">{control.riskAssessment.mitigationLevel}/5</div>
                  <p className="text-sm text-muted-foreground">Strong Mitigation</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Risk Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Risk Matrix Visualization</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Visual representation of likelihood vs impact
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {control.documentation.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Related Processes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {control.relatedProcesses.map((process, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{process}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Related Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {control.relatedAssets.map((asset, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{asset}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 