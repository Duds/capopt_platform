"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { Facility, Unit, CriticalControl } from "@/types"
import { cn, getStatusColor } from "@/lib/utils"

interface FacilityMapProps {
  facility: Facility
  onUnitClick?: (unit: Unit) => void
  onControlClick?: (control: CriticalControl) => void
  selectedUnitId?: string
  selectedControlId?: string
}

export function FacilityMap({ 
  facility, 
  onUnitClick, 
  onControlClick, 
  selectedUnitId,
  selectedControlId 
}: FacilityMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getControlStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3 text-control-active" />
      case 'testing':
        return <Clock className="h-3 w-3 text-control-testing" />
      case 'maintenance':
        return <Settings className="h-3 w-3 text-control-maintenance" />
      case 'failed':
        return <AlertTriangle className="h-3 w-3 text-control-critical" />
      default:
        return <Eye className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-control-active bg-control-active/10'
      case 'maintenance':
        return 'border-control-maintenance bg-control-maintenance/10'
      case 'emergency':
        return 'border-control-critical bg-control-critical/10'
      default:
        return 'border-muted bg-muted/10'
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{facility.name} - Facility Map</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="min-w-[60px] justify-center">
              {Math.round(zoom * 100)}%
            </Badge>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div 
          ref={mapRef}
          className="facility-map relative w-full h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Map Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Facility Units */}
            {facility.units.map((unit) => (
              <div
                key={unit.id}
                className={cn(
                  "facility-unit absolute border-2 rounded-lg cursor-pointer transition-all duration-200",
                  getUnitStatusColor(unit.status),
                  selectedUnitId === unit.id && "ring-2 ring-facility-accent ring-offset-2",
                  "hover:shadow-lg hover:scale-105"
                )}
                style={{
                  left: `${unit.location.x}%`,
                  top: `${unit.location.y}%`,
                  width: `${unit.location.width}%`,
                  height: `${unit.location.height}%`,
                }}
                onClick={() => onUnitClick?.(unit)}
              >
                <div className="absolute inset-0 p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium truncate">
                      {unit.name}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs capitalize"
                    >
                      {unit.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {unit.type}
                  </div>

                  {/* Controls within unit */}
                  <div className="absolute bottom-1 right-1 flex items-center space-x-1">
                    {unit.controls.slice(0, 3).map((control) => (
                      <div
                        key={control.id}
                        className={cn(
                          "w-2 h-2 rounded-full cursor-pointer transition-all duration-200",
                          "hover:scale-125 hover:shadow-sm",
                          selectedControlId === control.id && "ring-2 ring-white ring-offset-1",
                          control.status === 'active' && "bg-control-active",
                          control.status === 'testing' && "bg-control-testing",
                          control.status === 'maintenance' && "bg-control-maintenance",
                          control.status === 'failed' && "bg-control-critical animate-pulse"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onControlClick?.(control)
                        }}
                        title={`${control.name} - ${control.status}`}
                      />
                    ))}
                    {unit.controls.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{unit.controls.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Standalone Controls (not in units) */}
            {facility.units.flatMap(unit => unit.controls).filter(control => !control.unitId).map((control) => (
              <div
                key={control.id}
                className={cn(
                  "absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200",
                  "hover:scale-125 hover:shadow-lg",
                  selectedControlId === control.id && "ring-2 ring-white ring-offset-1",
                  control.status === 'active' && "bg-control-active",
                  control.status === 'testing' && "bg-control-testing",
                  control.status === 'maintenance' && "bg-control-maintenance",
                  control.status === 'failed' && "bg-control-critical animate-pulse"
                )}
                style={{
                  left: `${control.location.x}%`,
                  top: `${control.location.y}%`,
                }}
                onClick={() => onControlClick?.(control)}
                title={`${control.name} - ${control.status}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
            <div className="text-xs font-medium mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-control-active rounded-full"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-control-testing rounded-full"></div>
                <span>Testing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-control-maintenance rounded-full"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-control-critical rounded-full"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
            <div className="text-xs font-medium mb-2">Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>Total Units:</span>
                <span className="font-medium">{facility.units.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Controls:</span>
                <span className="font-medium">
                  {facility.units.reduce((sum, unit) => sum + unit.controls.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active:</span>
                <span className="font-medium text-control-active">
                  {facility.units.flatMap(u => u.controls).filter(c => c.status === 'active').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 