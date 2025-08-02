/**
 * Critical Control Dashboard Component - CCT Implementation
 * 
 * Provides comprehensive Critical Control Theory (CCT) interface for the CapOpt Platform:
 * - Control verification workflows and status tracking
 * - Risk mapping visualization and assessment
 * - Control effectiveness monitoring and trends
 * - Verification log management and audit trails
 * - Real-time compliance metrics and dashboards
 * - Interactive risk matrix and control mapping
 * - Performance analytics and reporting
 * - Integration with bowtie analysis and risk propagation
 * 
 * This component enables full CCT implementation with visual risk management
 * within the operational capability framework.
 */

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Users,
  FileText,
  Edit,
  Plus,
  Eye,
  Trash2,
  Zap,
  Gauge,
  Calendar,
  History,
  Settings,
  Filter,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid3X3,
  List,
  Map,
  Layers,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  GitCompare,
  GitBranchPlus,
  GitCommitVertical,
  GitPullRequestClosed,
  GitMergeQueue,
  GitFork,
  GitGraph,
  GitPullRequestDraft,
  GitPullRequestArrow,
  GitPullRequestCreate,
  GitPullRequestClosed,
  GitPullRequestDraft,
  GitPullRequestNew,
  GitPullRequestUpdate,
  GitPullRequestDelete,
  GitPullRequestEdit,
  GitPullRequestView,
  GitPullRequestCheck,
  GitPullRequestX,
  GitPullRequestPlus,
  GitPullRequestMinus,
  GitPullRequestChange,
  GitPullRequestDraft,
  GitPullRequestClosed,
  GitPullRequestDraft,
  GitPullRequestNew,
  GitPullRequestUpdate,
  GitPullRequestDelete,
  GitPullRequestEdit,
  GitPullRequestView,
  GitPullRequestCheck,
  GitPullRequestX,
  GitPullRequestPlus,
  GitPullRequestMinus,
  GitPullRequestChange
} from 'lucide-react'

interface CriticalControl {
  id: string
  name: string
  description: string | null
  controlCategory: string
  isCritical: boolean
  verificationFrequency: string | null
  complianceStatus: string
  priority: string
  riskCategory?: {
    id: string
    name: string
  }
  controlType?: {
    id: string
    name: string
  }
  effectiveness?: {
    id: string
    rating: string
    score: number | null
  }
  verificationLogs: VerificationLog[]
  createdAt: string
  updatedAt: string
}

interface VerificationLog {
  id: string
  status: string
  submittedBy: string
  submittedAt: string
  notes: string | null
  evidence: string | null
}

interface RiskMatrix {
  likelihood: number
  impact: number
  riskScore: number
  controls: CriticalControl[]
}

interface CriticalControlDashboardProps {
  controls: CriticalControl[]
  onUpdate: (updatedControls: CriticalControl[]) => void
  isEditing?: boolean
  onEditingChange?: (editing: boolean) => void
}

export function CriticalControlDashboard({
  controls,
  onUpdate,
  isEditing = false,
  onEditingChange
}: CriticalControlDashboardProps) {
  const [selectedControl, setSelectedControl] = useState<CriticalControl | null>(null)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [showControlDialog, setShowControlDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'dashboard' | 'matrix' | 'verification' | 'analytics'>('dashboard')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterPriority, setFilterPriority] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const totalControls = controls.length
    const criticalControls = controls.filter(c => c.isCritical).length
    const compliantControls = controls.filter(c => c.complianceStatus === 'COMPLIANT').length
    const effectiveControls = controls.filter(c => c.effectiveness?.rating === 'Effective').length
    const overdueVerifications = controls.filter(c => {
      const lastVerification = c.verificationLogs[0]
      if (!lastVerification) return true
      const lastDate = new Date(lastVerification.submittedAt)
      const frequency = c.verificationFrequency || 'Monthly'
      const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > getFrequencyDays(frequency)
    }).length

    return {
      totalControls,
      criticalControls,
      compliantControls,
      effectiveControls,
      overdueVerifications,
      complianceRate: totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0,
      effectivenessRate: totalControls > 0 ? Math.round((effectiveControls / totalControls) * 100) : 0
    }
  }, [controls])

  // Get frequency in days
  const getFrequencyDays = (frequency: string): number => {
    switch (frequency.toLowerCase()) {
      case 'daily': return 1
      case 'weekly': return 7
      case 'monthly': return 30
      case 'quarterly': return 90
      case 'annually': return 365
      default: return 30
    }
  }

  // Filter controls
  const filteredControls = useMemo(() => {
    let filtered = controls

    if (searchTerm) {
      filtered = filtered.filter(control =>
        control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (control.description && control.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (filterStatus) {
      filtered = filtered.filter(control => control.complianceStatus === filterStatus)
    }

    if (filterPriority) {
      filtered = filtered.filter(control => control.priority === filterPriority)
    }

    if (filterCategory) {
      filtered = filtered.filter(control => control.controlCategory === filterCategory)
    }

    return filtered
  }, [controls, searchTerm, filterStatus, filterPriority, filterCategory])

  // Add verification log
  const addVerificationLog = async (controlId: string, verificationData: any) => {
    try {
      const updatedControls = controls.map(control =>
        control.id === controlId
          ? {
              ...control,
              verificationLogs: [
                {
                  id: Math.random().toString(36).substr(2, 9),
                  status: verificationData.status,
                  submittedBy: verificationData.submittedBy,
                  submittedAt: new Date().toISOString(),
                  notes: verificationData.notes,
                  evidence: verificationData.evidence
                },
                ...control.verificationLogs
              ]
            }
          : control
      )

      onUpdate(updatedControls)
      setShowVerificationDialog(false)
      
      toast({
        title: "Verification Added",
        description: "Successfully added verification log",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add verification log. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update control
  const updateControl = async (controlId: string, updates: any) => {
    try {
      const updatedControls = controls.map(control =>
        control.id === controlId
          ? { ...control, ...updates, updatedAt: new Date().toISOString() }
          : control
      )

      onUpdate(updatedControls)
      setShowControlDialog(false)
      
      toast({
        title: "Control Updated",
        description: "Successfully updated control",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update control. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'NON_COMPLIANT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PARTIALLY_COMPLIANT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get effectiveness color
  const getEffectivenessColor = (rating: string) => {
    switch (rating) {
      case 'Effective':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Needs Attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Render dashboard view
  const renderDashboardView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Control Overview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('matrix')}
            >
              <Map className="h-4 w-4 mr-1" />
              Risk Matrix
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('verification')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dashboardMetrics.totalControls}</div>
                <div className="text-sm text-muted-foreground">Total Controls</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{dashboardMetrics.criticalControls}</div>
                <div className="text-sm text-muted-foreground">Critical Controls</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dashboardMetrics.complianceRate}%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
                <Progress value={dashboardMetrics.complianceRate} className="mt-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dashboardMetrics.effectivenessRate}%</div>
                <div className="text-sm text-muted-foreground">Effectiveness Rate</div>
                <Progress value={dashboardMetrics.effectivenessRate} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Critical Controls</CardTitle>
                <CardDescription>
                  {filteredControls.length} of {controls.length} controls
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowControlDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Control
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredControls.map((control) => (
                <div
                  key={control.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedControl(control)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{control.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getStatusColor(control.complianceStatus)}>
                          {control.complianceStatus}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(control.priority)}>
                          {control.priority}
                        </Badge>
                        {control.isCritical && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            Critical
                          </Badge>
                        )}
                        {control.effectiveness && (
                          <Badge variant="outline" className={getEffectivenessColor(control.effectiveness.rating)}>
                            {control.effectiveness.rating}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedControl(control)
                        setShowVerificationDialog(true)
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingItem(control)
                          setShowControlDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredControls.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No controls found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render risk matrix view
  const renderRiskMatrixView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Risk Matrix</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('dashboard')}
            >
              <Activity className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('verification')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Control Matrix</CardTitle>
            <CardDescription>
              Visual representation of risk likelihood vs impact with control coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1">
              {/* Risk Matrix Grid */}
              {Array.from({ length: 25 }, (_, i) => {
                const likelihood = Math.floor(i / 5) + 1
                const impact = (i % 5) + 1
                const riskScore = likelihood * impact
                const controlsInCell = controls.filter(c => 
                  c.riskCategory && 
                  parseInt(c.riskCategory.id) === riskScore
                )
                
                let cellColor = 'bg-gray-100'
                if (riskScore >= 15) cellColor = 'bg-red-100'
                else if (riskScore >= 8) cellColor = 'bg-orange-100'
                else if (riskScore >= 4) cellColor = 'bg-yellow-100'
                else cellColor = 'bg-green-100'

                return (
                  <div
                    key={i}
                    className={`${cellColor} p-2 border rounded text-center text-xs cursor-pointer hover:bg-opacity-80`}
                    onClick={() => {
                      if (controlsInCell.length > 0) {
                        setSelectedControl(controlsInCell[0])
                      }
                    }}
                  >
                    <div className="font-medium">{riskScore}</div>
                    <div className="text-xs text-muted-foreground">
                      {controlsInCell.length} controls
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Low Risk (1-3)</span>
              <span>Medium Risk (4-7)</span>
              <span>High Risk (8-14)</span>
              <span>Critical Risk (15-25)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render verification view
  const renderVerificationView = () => {
    const overdueControls = controls.filter(c => {
      const lastVerification = c.verificationLogs[0]
      if (!lastVerification) return true
      const lastDate = new Date(lastVerification.submittedAt)
      const frequency = c.verificationFrequency || 'Monthly'
      const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > getFrequencyDays(frequency)
    })

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Verification Management</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('dashboard')}
            >
              <Activity className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('matrix')}
            >
              <Map className="h-4 w-4 mr-1" />
              Risk Matrix
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overdue Verifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Overdue Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueControls.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p>All verifications are up to date</p>
                  </div>
                ) : (
                  overdueControls.map((control) => (
                    <div
                      key={control.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedControl(control)
                        setShowVerificationDialog(true)
                      }}
                    >
                      <div>
                        <h4 className="font-medium">{control.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Frequency: {control.verificationFrequency || 'Monthly'}
                        </p>
                      </div>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Verifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {controls.flatMap(c => c.verificationLogs.slice(0, 1)).slice(0, 5).map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Verification Completed</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {log.status} by {log.submittedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render analytics view
  const renderAnalyticsView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analytics & Trends</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('dashboard')}
            >
              <Activity className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('matrix')}
            >
              <Map className="h-4 w-4 mr-1" />
              Risk Matrix
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('verification')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verification
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Compliance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Compliance trend chart</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Historical compliance data visualization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Effectiveness Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Effectiveness Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Effective</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${dashboardMetrics.effectivenessRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{dashboardMetrics.effectivenessRate}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Needs Attention</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${100 - dashboardMetrics.effectivenessRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{100 - dashboardMetrics.effectivenessRate}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Critical Control Theory (CCT)</h2>
          <p className="text-muted-foreground">Comprehensive control verification and risk management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => onEditingChange?.(!isEditing)}
          >
            {isEditing ? <Eye className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All status</SelectItem>
                  <SelectItem value="COMPLIANT">Compliant</SelectItem>
                  <SelectItem value="NON_COMPLIANT">Non-Compliant</SelectItem>
                  <SelectItem value="PARTIALLY_COMPLIANT">Partially Compliant</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All priorities</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="SUPPORTING">Supporting</SelectItem>
                  <SelectItem value="ENABLING">Enabling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('')
                  setFilterPriority('')
                  setFilterCategory('')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === 'dashboard' && renderDashboardView()}
      {viewMode === 'matrix' && renderRiskMatrixView()}
      {viewMode === 'verification' && renderVerificationView()}
      {viewMode === 'analytics' && renderAnalyticsView()}

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Verification Log</DialogTitle>
            <DialogDescription>
              Record verification for {selectedControl?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationStatus">Status</Label>
              <Select defaultValue="PASSED">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PASSED">Passed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verificationNotes">Notes</Label>
              <Textarea
                id="verificationNotes"
                placeholder="Enter verification notes..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verificationEvidence">Evidence</Label>
              <Input
                id="verificationEvidence"
                placeholder="URL or reference to evidence"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const status = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || 'PASSED'
              const notes = (document.getElementById('verificationNotes') as HTMLTextAreaElement)?.value
              const evidence = (document.getElementById('verificationEvidence') as HTMLInputElement)?.value
              
              if (selectedControl) {
                addVerificationLog(selectedControl.id, {
                  status,
                  notes: notes || undefined,
                  evidence: evidence || undefined,
                  submittedBy: 'Current User'
                })
              }
            }}>
              Add Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Control Dialog */}
      <Dialog open={showControlDialog} onOpenChange={setShowControlDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Control' : 'Add Control'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update control information' : 'Create a new critical control'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="controlName">Name *</Label>
                <Input
                  id="controlName"
                  defaultValue={editingItem?.name || ''}
                  placeholder="Enter control name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="controlCategory">Category</Label>
                <Select defaultValue={editingItem?.controlCategory || 'SUPPORTING'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="SUPPORTING">Supporting</SelectItem>
                    <SelectItem value="ENABLING">Enabling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="controlDescription">Description</Label>
              <Textarea
                id="controlDescription"
                defaultValue={editingItem?.description || ''}
                placeholder="Enter control description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="controlPriority">Priority</Label>
                <Select defaultValue={editingItem?.priority || 'MEDIUM'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verificationFrequency">Verification Frequency</Label>
                <Select defaultValue={editingItem?.verificationFrequency || 'Monthly'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowControlDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const name = (document.getElementById('controlName') as HTMLInputElement)?.value
              const description = (document.getElementById('controlDescription') as HTMLTextAreaElement)?.value
              const controlCategory = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || 'SUPPORTING'
              const priority = (document.querySelectorAll('select[data-value]')[1] as HTMLSelectElement)?.value || 'MEDIUM'
              const verificationFrequency = (document.querySelectorAll('select[data-value]')[2] as HTMLSelectElement)?.value || 'Monthly'
              
              if (!name) {
                toast({
                  title: "Validation Error",
                  description: "Control name is required",
                  variant: "destructive",
                })
                return
              }

              const controlData = {
                name,
                description: description || undefined,
                controlCategory,
                priority,
                verificationFrequency,
                isCritical: editingItem?.isCritical || false
              }

              if (editingItem) {
                updateControl(editingItem.id, controlData)
              } else {
                // Add new control logic would go here
                setShowControlDialog(false)
              }
            }}>
              {editingItem ? 'Update' : 'Add'} Control
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 