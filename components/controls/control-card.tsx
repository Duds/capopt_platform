/**
 * Control Card Component - Critical Control Display
 * 
 * Renders individual critical control information in card format:
 * - Displays control name, description, and status
 * - Shows compliance status with color-coded indicators
 * - Control type and effectiveness information
 * - Risk category and priority classification
 * - Performance metrics and trends
 * - Action buttons for view, edit, and verify operations
 * - Visual status indicators and icons
 * - Integration with control management system
 * 
 * This component provides a compact view of critical controls
 * for risk management and compliance monitoring.
 */

"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/api'

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

interface ControlCardProps {
  control: CriticalControl
  onView?: (control: CriticalControl) => void
  onEdit?: (control: CriticalControl) => void
  onVerify?: (control: CriticalControl) => void
}

export function ControlCard({ control, onView, onEdit, onVerify }: ControlCardProps) {
  const getControlTypeIcon = (type: string) => {
    switch (type) {
      case 'PREVENTIVE':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'DETECTIVE':
        return <Eye className="h-4 w-4 text-green-600" />
      case 'CORRECTIVE':
        return <Settings className="h-4 w-4 text-orange-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
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

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-lg">{control.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={getStatusColor(control.complianceStatus)}
            >
              {control.complianceStatus}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {control.riskCategory?.name || 'No category'}
          </p>
          <Badge 
            variant="outline" 
            className={getPriorityColor(control.priority)}
          >
            {control.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {control.description || 'No description available'}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Type</p>
            <div className="flex items-center space-x-1">
              {getControlTypeIcon(control.controlType?.name || 'PREVENTIVE')}
              <p className="font-medium">
                {control.controlType?.name || 'Not specified'}
              </p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Effectiveness</p>
            <div className="flex items-center space-x-1">
              {getStatusIcon(control.complianceStatus)}
              <p className="font-medium">
                {control.effectiveness?.name || 'Not rated'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span>{formatDate(control.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Updated</span>
            <span>{formatDate(control.updatedAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView?.(control)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(control)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onVerify?.(control)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 