"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react"
import { CriticalControl } from "@/types"
import { cn, formatDate, getStatusColor, getPriorityLabel } from "@/lib/utils"

interface ControlCardProps {
  control: CriticalControl
  onView?: (control: CriticalControl) => void
  onEdit?: (control: CriticalControl) => void
  onVerify?: (control: CriticalControl) => void
}

export function ControlCard({ control, onView, onEdit, onVerify }: ControlCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-control-active" />
      case 'testing':
        return <Clock className="h-4 w-4 text-control-testing" />
      case 'maintenance':
        return <Settings className="h-4 w-4 text-control-maintenance" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-control-critical" />
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getControlTypeIcon = (type: string) => {
    switch (type) {
      case 'engineering':
        return <Settings className="h-4 w-4" />
      case 'administrative':
        return <Shield className="h-4 w-4" />
      case 'ppe':
        return <CheckCircle className="h-4 w-4" />
      case 'monitoring':
        return <Eye className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const isVerificationDue = () => {
    const nextDue = new Date(control.verificationSchedule.nextDue)
    const now = new Date()
    return nextDue <= now
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-control-active'
    if (score >= 75) return 'text-control-warning'
    return 'text-control-critical'
  }

  return (
    <Card 
      className={cn(
        "control-card transition-all duration-200 cursor-pointer",
        control.status,
        isHovered && "shadow-lg scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(control)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getControlTypeIcon(control.type)}
            <CardTitle className="text-lg">{control.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(control.status)}
            <Badge 
              variant="outline" 
              className={cn("capitalize", getStatusColor(control.status))}
            >
              {control.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{control.code}</p>
          <Badge 
            variant="outline" 
            className={cn("text-xs", getStatusColor(control.category))}
          >
            {control.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {control.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Priority</p>
            <p className={cn("font-medium", getStatusColor(getPriorityLabel(control.priority).toLowerCase()))}>
              {getPriorityLabel(control.priority)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Performance</p>
            <p className={cn("font-medium", getPerformanceColor(control.performance?.value || 0))}>
              {control.performance?.value || 0}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Verified</span>
            <span>{formatDate(control.currentStatus.lastVerified)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Due</span>
            <span className={cn(
              isVerificationDue() ? "text-control-critical font-medium" : ""
            )}>
              {formatDate(control.verificationSchedule.nextDue)}
            </span>
          </div>
        </div>

        {control.hazards.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hazards</p>
            <div className="flex flex-wrap gap-1">
              {control.hazards.slice(0, 3).map((hazard, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {hazard}
                </Badge>
              ))}
              {control.hazards.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{control.hazards.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView?.(control)
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {isVerificationDue() && (
              <Button 
                variant="warning" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onVerify?.(control)
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Verify
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(control)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 