/**
 * Processes Management Page - Operational Process Overview
 * 
 * Provides comprehensive process management capabilities for the CapOpt Platform:
 * - List and search all operational processes
 * - Create, edit, and delete processes
 * - Filter processes by status and priority
 * - View process details and relationships
 * - Integration with process map visualization
 * - Role-based access control for process management
 * - Real-time data from the database
 * 
 * This page serves as the central hub for managing operational processes
 * that support the organization's capability optimization framework.
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Workflow, Plus, Search, Filter, Edit, Eye, Trash2 } from 'lucide-react'
import { processesApi, formatDate, getStatusColor, getPriorityColor } from '@/lib/api'
import { EnterpriseContext } from '@/components/navigation/enterprise-context'
import { StrategicContext } from '@/components/navigation/strategic-context'
import { StrategicNavigationFlow } from '@/components/navigation/strategic-navigation-flow'
import { ProcessMapViewer } from '@/components/processes/process-map-viewer'

interface Process {
  id: string
  name: string
  description: string | null
  version: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  steps?: Array<{
    id: string
    name: string
  }>
  controls?: Array<{
    id: string
    name: string
  }>
}

interface ProcessFormData {
  name: string
  description: string
  status: string
  priority: string
  version: string
}

export default function ProcessesPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [processes, setProcesses] = useState<Process[]>([])
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<ProcessFormData>({
    name: '',
    description: '',
    status: 'DRAFT',
    priority: 'MEDIUM',
    version: '1.0'
  })

  useEffect(() => {
    if (user && !authLoading) {
      fetchProcesses()
    } else if (!user && !authLoading) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    filterProcesses()
  }, [processes, searchTerm, statusFilter, priorityFilter])

  const fetchProcesses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const processesData = await processesApi.getAll({ 
        include: 'steps,controls' 
      })
      setProcesses(processesData)
    } catch (error: any) {
      console.error('Error fetching processes:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProcesses = () => {
    let filtered = processes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(process =>
        process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (process.description && process.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(process => process.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(process => process.priority === priorityFilter)
    }

    setFilteredProcesses(filtered)
  }

  const handleCreateProcess = async () => {
    try {
      setIsCreating(true)
      setError(null)
      
      const newProcess = await processesApi.create(formData)
      setProcesses(prev => [...prev, newProcess])
      setIsCreateDialogOpen(false)
      setFormData({
        name: '',
        description: '',
        status: 'DRAFT',
        priority: 'MEDIUM',
        version: '1.0'
      })
    } catch (error: any) {
      console.error('Error creating process:', error)
      setError(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleViewProcess = (process: Process) => {
    router.push(`/processes/${process.id}`)
  }

  const handleEditProcess = (process: Process) => {
    // TODO: Implement process editing
    console.log('Edit process:', process)
  }

  const handleDeleteProcess = async (processId: string) => {
    if (!confirm('Are you sure you want to delete this process?')) return
    
    try {
      await processesApi.delete(processId)
      setProcesses(prev => prev.filter(p => p.id !== processId))
    } catch (error: any) {
      console.error('Error deleting process:', error)
      setError(error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading processes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchProcesses}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Process Management</h1>
          <p className="mt-2 text-gray-600">Manage and document your operational processes</p>
        </div>

        <div className="space-y-6">
          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <Input
                    placeholder="Search processes..."
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
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
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
                
                <div className="flex items-end">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Process
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Process</DialogTitle>
                        <DialogDescription>
                          Create a new operational process with basic information.
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
                            placeholder="Enter process name"
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
                            placeholder="Enter process description"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Status
                          </Label>
                          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="CRITICAL">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="version" className="text-right">
                            Version
                          </Label>
                          <Input
                            id="version"
                            value={formData.version}
                            onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                            className="col-span-3"
                            placeholder="1.0"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateProcess} disabled={isCreating || !formData.name.trim()}>
                          {isCreating ? 'Creating...' : 'Create Process'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-full mb-2">
              <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{processes.length}</div>
                <p className="text-xs text-muted-foreground">
                  All processes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Processes</CardTitle>
                <Workflow className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {processes.filter(p => p.status === 'ACTIVE').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft Processes</CardTitle>
                <Workflow className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {processes.filter(p => p.status === 'DRAFT').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  In development
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Processes</CardTitle>
                <Workflow className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {processes.filter(p => p.priority === 'CRITICAL').length}
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
            <StrategicNavigationFlow currentLayer="operational" currentContext="processes" />
          </div>

          {/* Processes List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredProcesses.length} process{filteredProcesses.length !== 1 ? 'es' : ''} found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProcesses.map((process) => (
                  <Card key={process.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Workflow className="h-5 w-5 mr-2" />
                        {process.name}
                      </CardTitle>
                      <CardDescription>{process.description || 'No description'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Status</span>
                          <Badge variant="secondary" className={getStatusColor(process.status)}>
                            {process.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Priority</span>
                          <Badge variant="secondary" className={getPriorityColor(process.priority)}>
                            {process.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Version: {process.version}</span>
                          <span>Steps: {process.steps?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Controls: {process.controls?.length || 0}</span>
                          <span>Created: {formatDate(process.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedProcess(process.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Map
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProcess(process)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProcess(process.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredProcesses.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No processes found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Process Map Viewer */}
          {selectedProcess && (
            <Card>
              <CardHeader>
                <CardTitle>Process Map</CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessMapViewer 
                  processId={selectedProcess} 
                  onClose={() => setSelectedProcess(null)} 
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 