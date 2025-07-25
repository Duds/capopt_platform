'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Workflow, Plus, Search, Filter } from 'lucide-react'
import { processesApi, formatDate, getStatusColor, getPriorityColor } from '@/lib/api'

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

export default function ProcessesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [processes, setProcesses] = useState<Process[]>([])
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          <Workflow className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProcesses}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Workflow className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Process Management</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Processes</h2>
            <p className="text-gray-600">Manage operational processes and workflows</p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search processes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
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
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Process
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredProcesses.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No processes found</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Process
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 