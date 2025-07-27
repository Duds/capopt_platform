/**
 * Critical Controls Management Page - Risk Control Overview
 * 
 * Provides comprehensive critical control management for the CapOpt Platform:
 * - List and search all critical controls
 * - Create, edit, and delete controls
 * - Filter controls by status, priority, and category
 * - Control effectiveness and compliance monitoring
 * - Risk category and control type management
 * - Integration with control detail views
 * - Real-time compliance metrics and dashboards
 * - Role-based access control for control management
 * 
 * This page serves as the central hub for managing critical controls
 * that protect against identified risks in high-risk industries.
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Users
} from 'lucide-react'
import { controlsApi, formatDate, getStatusColor, getPriorityColor } from '@/lib/api'
import { EnterpriseContext } from '@/components/navigation/enterprise-context'
import { StrategicContext } from '@/components/navigation/strategic-context'
import { StrategicNavigationFlow } from '@/components/navigation/strategic-navigation-flow'
import { ControlDetailView } from '@/components/controls/control-detail-view'

interface CriticalControl {
  id: string
  name: string
  description: string | null
  complianceStatus: string
  priority: string
  createdAt: string
  updatedAt: string
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
    name: string
  }
}

interface ControlFormData {
  name: string
  description: string
  complianceStatus: string
  priority: string
  riskCategoryId: string
  controlTypeId: string
  effectivenessId: string
}

export default function ControlsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [controls, setControls] = useState<CriticalControl[]>([])
  const [filteredControls, setFilteredControls] = useState<CriticalControl[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedControl, setSelectedControl] = useState<CriticalControl | null>(null)
  const [showDetailView, setShowDetailView] = useState(false)
  const [formData, setFormData] = useState<ControlFormData>({
    name: '',
    description: '',
    complianceStatus: 'DRAFT',
    priority: 'MEDIUM',
    riskCategoryId: '',
    controlTypeId: '',
    effectivenessId: ''
  })

  useEffect(() => {
    if (user && !authLoading) {
      fetchControls()
    } else if (!user && !authLoading) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    filterControls()
  }, [controls, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const fetchControls = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const controlsData = await controlsApi.getAll({ 
        include: 'riskCategory,controlType,effectiveness' 
      })
      setControls(controlsData)
    } catch (error: any) {
      console.error('Error fetching controls:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filterControls = () => {
    let filtered = controls

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(control =>
        control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (control.description && control.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(control => control.complianceStatus === statusFilter)
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(control => control.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(control => control.riskCategory?.id === categoryFilter)
    }

    setFilteredControls(filtered)
  }

  const handleCreateControl = async () => {
    try {
      setIsCreating(true)
      // API call to create control
      await controlsApi.create(formData)
      setIsCreateDialogOpen(false)
      setFormData({
        name: '',
        description: '',
        complianceStatus: 'DRAFT',
        priority: 'MEDIUM',
        riskCategoryId: '',
        controlTypeId: '',
        effectivenessId: ''
      })
      fetchControls()
    } catch (error: any) {
      console.error('Error creating control:', error)
      setError(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleViewControl = (control: CriticalControl) => {
    setSelectedControl(control)
    setShowDetailView(true)
  }

  const handleEditControl = (control: CriticalControl) => {
    setFormData({
      name: control.name,
      description: control.description || '',
      complianceStatus: control.complianceStatus,
      priority: control.priority,
      riskCategoryId: control.riskCategory?.id || '',
      controlTypeId: control.controlType?.id || '',
      effectivenessId: control.effectiveness?.id || ''
    })
    setIsCreateDialogOpen(true)
  }

  const handleDeleteControl = async (controlId: string) => {
    if (confirm('Are you sure you want to delete this control?')) {
      try {
        await controlsApi.delete(controlId)
        fetchControls()
      } catch (error: any) {
        console.error('Error deleting control:', error)
        setError(error.message)
      }
    }
  }

  const getCompliancePercentage = () => {
    const compliant = controls.filter(c => c.complianceStatus === 'COMPLIANT').length
    return controls.length > 0 ? Math.round((compliant / controls.length) * 100) : 0
  }

  const getEffectivenessPercentage = () => {
    const effective = controls.filter(c => c.effectiveness?.name === 'EFFECTIVE').length
    return controls.length > 0 ? Math.round((effective / controls.length) * 100) : 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading controls...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Controls</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchControls}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (showDetailView && selectedControl) {
    return (
      <ControlDetailView 
        controlId={selectedControl.id} 
        onClose={() => setShowDetailView(false)} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Critical Controls Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor critical controls for operational safety</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Control
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Critical Control</DialogTitle>
                <DialogDescription>
                  Create a new critical control with comprehensive information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter control name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter control description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={formData.complianceStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, complianceStatus: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="col-span-3">
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateControl} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Control'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Control Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-full mb-2">
            <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{controls.length}</div>
              <p className="text-xs text-muted-foreground">
                All controls
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliant Controls</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {controls.filter(c => c.complianceStatus === 'COMPLIANT').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {getCompliancePercentage()}% compliance rate
              </p>
              <Progress value={getCompliancePercentage()} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Effective Controls</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {controls.filter(c => c.effectiveness?.name === 'EFFECTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {getEffectivenessPercentage()}% effectiveness rate
              </p>
              <Progress value={getEffectivenessPercentage()} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Controls</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {controls.filter(c => c.priority === 'CRITICAL').length}
              </div>
              <p className="text-xs text-muted-foreground">
                High priority
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Navigation Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EnterpriseContext showDetails={false} />
          <StrategicContext showDetails={false} />
          <StrategicNavigationFlow currentLayer="operational" currentContext="controls" />
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters and Search</CardTitle>
            <CardDescription>Find specific controls using filters and search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <Input
                  placeholder="Search controls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setPriorityFilter('')
                  setCategoryFilter('')
                }} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredControls.length} control{filteredControls.length !== 1 ? 's' : ''} found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredControls.map((control) => (
                <Card key={control.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      {control.name}
                    </CardTitle>
                    <CardDescription>{control.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Status</span>
                        <Badge variant="secondary" className={getStatusColor(control.complianceStatus)}>
                          {control.complianceStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Priority</span>
                        <Badge variant="secondary" className={getPriorityColor(control.priority)}>
                          {control.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Category</span>
                        <span className="text-sm text-muted-foreground">
                          {control.riskCategory?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Type</span>
                        <span className="text-sm text-muted-foreground">
                          {control.controlType?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Effectiveness: {control.effectiveness?.name || 'N/A'}</span>
                        <span>Created: {formatDate(control.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewControl(control)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditControl(control)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteControl(control.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredControls.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No controls found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter || priorityFilter || categoryFilter
                      ? 'Try adjusting your filters or search terms.'
                      : 'Get started by creating your first critical control.'}
                  </p>
                  {!searchTerm && !statusFilter && !priorityFilter && !categoryFilter && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Control
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 