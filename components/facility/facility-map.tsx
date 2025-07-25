'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Building, 
  Settings, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Edit,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/lib/api'

interface Asset {
  id: string
  name: string
  description: string | null
  type: string
  location: string | null
  status: string
  criticality: string
}

interface CriticalControl {
  id: string
  name: string
  description: string | null
  complianceStatus: string
  priority: string
}

interface Unit {
  id: string
  name: string
  description: string | null
  assets: Asset[]
  controls: CriticalControl[]
}

interface Facility {
  id: string
  name: string
  description: string | null
  units: Unit[]
}

interface FacilityMapProps {
  facility: Facility
  onViewAsset?: (asset: Asset) => void
  onEditAsset?: (asset: Asset) => void
  onViewControl?: (control: CriticalControl) => void
  onEditControl?: (control: CriticalControl) => void
  onAddAsset?: (unitId: string) => void
  onAddControl?: (unitId: string) => void
}

export function FacilityMap({ 
  facility, 
  onViewAsset, 
  onEditAsset, 
  onViewControl, 
  onEditControl,
  onAddAsset,
  onAddControl
}: FacilityMapProps) {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'EQUIPMENT':
        return <Settings className="h-4 w-4" />
      case 'INFRASTRUCTURE':
        return <Building className="h-4 w-4" />
      case 'VEHICLE':
        return <MapPin className="h-4 w-4" />
      case 'SYSTEM':
        return <Shield className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getControlStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PARTIALLY_COMPLIANT':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'NON_COMPLIANT':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getAssetStatusIcon = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'MAINTENANCE':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'OUT_OF_SERVICE':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Facility Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{facility.name}</h2>
          <p className="text-gray-600">{facility.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </Button>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facility.units.map((unit) => (
          <Card 
            key={unit.id} 
            className={cn(
              "hover:shadow-md transition-shadow cursor-pointer",
              selectedUnit === unit.id && "ring-2 ring-blue-500"
            )}
            onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  {unit.name}
                </CardTitle>
                <Badge variant="outline">
                  {unit.assets.length} assets
                </Badge>
              </div>
              <CardDescription>{unit.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Assets in Unit */}
              <div>
                <h4 className="font-medium text-sm mb-2">Assets</h4>
                <div className="space-y-2">
                  {unit.assets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {getAssetTypeIcon(asset.type)}
                        <span className="text-sm font-medium">{asset.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getAssetStatusIcon(asset.status)}
                        <Badge variant="outline" className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {unit.assets.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      +{unit.assets.length - 3} more assets
                    </div>
                  )}
                </div>
              </div>

              {/* Controls in Unit */}
              <div>
                <h4 className="font-medium text-sm mb-2">Controls</h4>
                <div className="space-y-2">
                  {unit.controls.slice(0, 3).map((control) => (
                    <div key={control.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">{control.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getControlStatusIcon(control.complianceStatus)}
                        <Badge variant="outline" className={getStatusColor(control.complianceStatus)}>
                          {control.complianceStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {unit.controls.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      +{unit.controls.length - 3} more controls
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddAsset?.(unit.id)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Asset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddControl?.(unit.id)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Control
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Facility-wide Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Facility-wide Controls</CardTitle>
          <CardDescription>
            Controls that apply to the entire facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facility.units.flatMap(unit => unit.controls).filter(control => !control.id.includes('unit')).map((control) => (
              <div key={control.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">{control.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getControlStatusIcon(control.complianceStatus)}
                  <Badge variant="outline" className={getStatusColor(control.complianceStatus)}>
                    {control.complianceStatus}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewControl?.(control)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Facility Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facility.units.length}</div>
            <p className="text-xs text-muted-foreground">
              Operational units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facility.units.reduce((sum, unit) => sum + unit.assets.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facility.units.flatMap(u => u.controls).filter(c => c.complianceStatus === 'COMPLIANT').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Compliant controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facility.units.flatMap(u => u.assets).filter(a => a.status === 'OPERATIONAL').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 