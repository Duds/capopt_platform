'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Plus, Search, Filter } from 'lucide-react'
import { controlsApi, formatDate, getStatusColor, getPriorityColor } from '@/lib/api'

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

export default function ControlsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [controls, setControls] = useState<CriticalControl[]>([])
  const [filteredControls, setFilteredControls] = useState<CriticalControl[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && !authLoading) {
      fetchControls()
    } else if (!user && !authLoading) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    filterControls()
  }, [controls, searchTerm, statusFilter, priorityFilter])

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

    setFilteredControls(filtered)
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
          <Shield className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchControls}>Retry</Button>
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
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Critical Controls</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Controls</h2>
            <p className="text-gray-600">Manage critical controls and compliance</p>
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
                      placeholder="Search controls..."
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
                      <SelectItem value="COMPLIANT">Compliant</SelectItem>
                      <SelectItem value="PARTIALLY_COMPLIANT">Partially Compliant</SelectItem>
                      <SelectItem value="NON_COMPLIANT">Non-Compliant</SelectItem>
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
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Control
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
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Category: {control.riskCategory?.name || 'N/A'}</span>
                          <span>Type: {control.controlType?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Created: {formatDate(control.createdAt)}</span>
                          <span>Updated: {formatDate(control.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredControls.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No controls found</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Control
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