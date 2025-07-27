/**
 * Assets Management Page - Critical Asset Overview
 * 
 * Provides comprehensive asset management capabilities for the CapOpt Platform:
 * - List and search all critical assets
 * - Filter assets by status, type, and criticality
 * - Asset location and status tracking
 * - Risk assessment and protection mapping
 * - Asset lifecycle management
 * - Criticality classification and monitoring
 * - Integration with risk and control frameworks
 * - Real-time asset status from database
 * 
 * This page serves as the central hub for managing critical assets
 * that support operational capabilities in high-risk industries.
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, Plus, Search, Filter } from 'lucide-react'
import { assetsApi, formatDate, getStatusColor, getPriorityColor } from '@/lib/api'

interface Asset {
  id: string
  name: string
  description: string | null
  type: string
  location: string | null
  status: string
  criticality: string
  createdAt: string
  updatedAt: string
  risks?: Array<{
    id: string
    name: string
  }>
  protections?: Array<{
    id: string
    name: string
  }>
}

export default function AssetsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [criticalityFilter, setCriticalityFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && !authLoading) {
      fetchAssets()
    } else if (!user && !authLoading) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    filterAssets()
  }, [assets, searchTerm, statusFilter, typeFilter, criticalityFilter])

  const fetchAssets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const assetsData = await assetsApi.getAll({ 
        include: 'risks,protections' 
      })
      setAssets(assetsData)
    } catch (error: any) {
      console.error('Error fetching assets:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAssets = () => {
    let filtered = assets

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (asset.location && asset.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(asset => asset.status === statusFilter)
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(asset => asset.type === typeFilter)
    }

    // Criticality filter
    if (criticalityFilter) {
      filtered = filtered.filter(asset => asset.criticality === criticalityFilter)
    }

    setFilteredAssets(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading assets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAssets}>Retry</Button>
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
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Asset Management</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Assets</h2>
            <p className="text-gray-600">Manage critical assets and infrastructure</p>
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search assets..."
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
                      <SelectItem value="OPERATIONAL">Operational</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                      <SelectItem value="RETIRED">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                      <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                      <SelectItem value="VEHICLE">Vehicle</SelectItem>
                      <SelectItem value="SYSTEM">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criticality
                  </label>
                  <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All criticality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All criticality</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full opacity-50" disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                    <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-full mb-2">
              <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.length}</div>
                <p className="text-xs text-muted-foreground">
                  All assets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operational</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assets.filter(a => a.status === 'OPERATIONAL').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
                <Package className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assets.filter(a => a.criticality === 'CRITICAL').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  High criticality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
                <Package className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assets.filter(a => a.status === 'MAINTENANCE').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Under maintenance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Assets List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        {asset.name}
                      </CardTitle>
                      <CardDescription>{asset.description || 'No description'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Status</span>
                          <Badge variant="secondary" className={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Criticality</span>
                          <Badge variant="secondary" className={getPriorityColor(asset.criticality)}>
                            {asset.criticality}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Type: {asset.type}</span>
                          <span>Location: {asset.location || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Risks: {asset.risks?.length || 0}</span>
                          <span>Protections: {asset.protections?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Created: {formatDate(asset.createdAt)}</span>
                          <span>Updated: {formatDate(asset.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredAssets.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No assets found</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Asset
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