/**
 * Sidebar Navigation Component - CapOps Platform Navigation
 * 
 * Provides sidebar navigation for the CapOps Platform:
 * - Progress indicator with current implementation status
 * - Strategic layer navigation (Business Canvas, Operating Model, Value Chain)
 * - Operational layer navigation (Process Maps, Playbooks, ControlOps)
 * - Tactical layer navigation (BowtieLab, RiskMap)
 * - Collapsible sidebar with responsive design
 * - Implementation status indicators
 * - Visual feedback for active and disabled states
 * 
 * This component serves as the primary navigation interface
 * for accessing all platform features and modules.
 */

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  TrendingUp, 
  Activity, 
  Target, 
  Workflow, 
  Map,
  Network,
  BookOpen,
  BarChart3
} from 'lucide-react'

interface SidebarNavProps {
  activeLayer: string
  onLayerChange: (layer: string) => void
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export function SidebarNav({
  activeLayer,
  onLayerChange,
  sidebarCollapsed,
  onSidebarToggle
}: SidebarNavProps) {
  return (
    <nav className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 min-h-screen p-4 flex-shrink-0 transition-all duration-300 relative`}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 h-8 w-8 rounded-full border bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center"
        onClick={onSidebarToggle}
      >
        <span className="font-mono text-xs">
          {sidebarCollapsed ? '▶' : '◀'}
        </span>
      </Button>

      {/* Progress Indicator */}
      {!sidebarCollapsed && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">CapOps Progress</span>
            <Badge variant="secondary" className="text-xs">9/12</Badge>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-blue-700 mt-1">75% Complete</p>
          <p className="text-xs text-blue-600 mt-1">✓ CCT, Bowtie, RiskMap implemented</p>
          <p className="text-xs text-gray-500 mt-1">Strategic layer remaining</p>
        </div>
      )}
      
      <div className="space-y-2">
        {/* Dashboard */}
        <Button
          variant={activeLayer === "dashboard" ? "default" : "ghost"}
          className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
          onClick={() => onLayerChange("dashboard")}
        >
          <BarChart3 className="h-4 w-4" />
          {!sidebarCollapsed && <span className="ml-2">Dashboard</span>}
        </Button>

        {/* Strategic Layer */}
        <div className="pt-4">
          {!sidebarCollapsed && <h3 className="text-sm font-medium text-gray-500 mb-2">STRATEGIC LAYER</h3>}
          <Button
            variant={activeLayer === "business-canvas" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("business-canvas")}
          >
            <Target className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Business Canvas</span>}
          </Button>
          <Button
            variant={activeLayer === "operating-model" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("operating-model")}
            disabled
          >
            <Network className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Operating Model</span>}
          </Button>
          <Button
            variant={activeLayer === "value-chain" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("value-chain")}
            disabled
          >
            <Workflow className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Value Chain</span>}
          </Button>
        </div>

        {/* Operational Layer */}
        <div className="pt-4">
          {!sidebarCollapsed && <h3 className="text-sm font-medium text-gray-500 mb-2">OPERATIONAL LAYER</h3>}
          <Button
            variant={activeLayer === "process-maps" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("process-maps")}
            disabled
          >
            <Map className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Process Maps</span>}
          </Button>
          <Button
            variant={activeLayer === "playbooks" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("playbooks")}
            disabled
          >
            <BookOpen className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Playbooks</span>}
          </Button>
          <Button
            variant={activeLayer === "controlops" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("controlops")}
            disabled
          >
            <Shield className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">ControlOps</span>}
          </Button>
        </div>

        {/* Tactical Layer */}
        <div className="pt-4">
          {!sidebarCollapsed && <h3 className="text-sm font-medium text-gray-500 mb-2">TACTICAL LAYER</h3>}
          <Button
            variant={activeLayer === "bowtielab" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("bowtielab")}
            disabled
          >
            <Activity className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">BowtieLab</span>}
          </Button>
          <Button
            variant={activeLayer === "riskmap" ? "default" : "ghost"}
            className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start'}`}
            onClick={() => onLayerChange("riskmap")}
            disabled
          >
            <TrendingUp className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">RiskMap</span>}
          </Button>
        </div>
      </div>
    </nav>
  )
} 