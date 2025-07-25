"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react"
import { ControlCard } from "@/components/controls/control-card"
import { CriticalControl } from "@/types"

// Mock data for demonstration
const mockControls: CriticalControl[] = [
  {
    id: "1",
    facilityId: "1",
    name: "Pressure Relief Valve PRV-001",
    code: "PRV-001",
    type: "engineering",
    category: "prevention",
    description: "Primary pressure relief valve for distillation column T-101. Prevents overpressure conditions in the column.",
    location: { x: 25, y: 30 },
    specifications: {
      manufacturer: "Crosby",
      model: "JOSV-6",
      serialNumber: "CRB-2024-001",
      installationDate: new Date("2024-01-15"),
      lastCalibration: new Date("2024-06-15"),
      nextCalibration: new Date("2024-12-15")
    },
    hazards: ["Overpressure", "Thermal expansion", "Chemical reaction"],
    status: "active",
    priority: 1,
    currentStatus: {
      id: "1",
      controlId: "1",
      status: "active",
      reliability: 95,
      availability: 98,
      effectiveness: 92,
      lastVerified: new Date("2024-07-20"),
      nextVerificationDue: new Date("2024-08-20"),
      verifiedBy: "John Smith",
      notes: "All parameters within normal range",
      createdAt: new Date()
    },
    verificationSchedule: {
      id: "1",
      controlId: "1",
      frequency: "monthly",
      frequencyValue: 1,
      lastVerified: new Date("2024-07-20"),
      nextDue: new Date("2024-08-20"),
      responsibleRole: "Process Engineer",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    performance: {
      id: "1",
      controlId: "1",
      metricType: "effectiveness",
      value: 92,
      unit: "%",
      timestamp: new Date(),
      createdAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    facilityId: "1",
    name: "Emergency Shutdown System ESD-001",
    code: "ESD-001",
    type: "engineering",
    category: "mitigation",
    description: "Emergency shutdown system for the entire facility. Activates on critical safety conditions.",
    location: { x: 45, y: 60 },
    specifications: {
      manufacturer: "Honeywell",
      model: "Safety Manager",
      serialNumber: "HNY-2024-002",
      installationDate: new Date("2024-02-01"),
      lastCalibration: new Date("2024-07-01"),
      nextCalibration: new Date("2024-10-01")
    },
    hazards: ["Fire", "Explosion", "Toxic release", "Equipment failure"],
    status: "active",
    priority: 1,
    currentStatus: {
      id: "2",
      controlId: "2",
      status: "active",
      reliability: 99,
      availability: 100,
      effectiveness: 98,
      lastVerified: new Date("2024-07-15"),
      nextVerificationDue: new Date("2024-08-15"),
      verifiedBy: "Sarah Johnson",
      notes: "System tested successfully",
      createdAt: new Date()
    },
    verificationSchedule: {
      id: "2",
      controlId: "2",
      frequency: "monthly",
      frequencyValue: 1,
      lastVerified: new Date("2024-07-15"),
      nextDue: new Date("2024-08-15"),
      responsibleRole: "Safety Engineer",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    performance: {
      id: "2",
      controlId: "2",
      metricType: "effectiveness",
      value: 98,
      unit: "%",
      timestamp: new Date(),
      createdAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    facilityId: "1",
    name: "Gas Detection System GDS-001",
    code: "GDS-001",
    type: "monitoring",
    category: "detection",
    description: "Fixed gas detection system for hydrogen sulfide and other toxic gases.",
    location: { x: 70, y: 40 },
    specifications: {
      manufacturer: "MSA",
      model: "Ultima X5000",
      serialNumber: "MSA-2024-003",
      installationDate: new Date("2024-03-10"),
      lastCalibration: new Date("2024-06-10"),
      nextCalibration: new Date("2024-09-10")
    },
    hazards: ["Toxic gas exposure", "Asphyxiation", "Corrosion"],
    status: "testing",
    priority: 2,
    currentStatus: {
      id: "3",
      controlId: "3",
      status: "testing",
      reliability: 85,
      availability: 90,
      effectiveness: 88,
      lastVerified: new Date("2024-07-18"),
      nextVerificationDue: new Date("2024-07-25"),
      verifiedBy: "Mike Wilson",
      notes: "Calibration in progress",
      createdAt: new Date()
    },
    verificationSchedule: {
      id: "3",
      controlId: "3",
      frequency: "quarterly",
      frequencyValue: 3,
      lastVerified: new Date("2024-07-18"),
      nextDue: new Date("2024-07-25"),
      responsibleRole: "Instrument Technician",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    performance: {
      id: "3",
      controlId: "3",
      metricType: "effectiveness",
      value: 88,
      unit: "%",
      timestamp: new Date(),
      createdAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function ControlsPage() {
  const [controls] = useState<CriticalControl[]>(mockControls)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredControls = controls.filter(control => {
    const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || control.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return controls.filter(control => control.status === status).length
  }

  const handleViewControl = (control: CriticalControl) => {
    console.log("View control:", control.name)
    // Navigate to control detail page
  }

  const handleEditControl = (control: CriticalControl) => {
    console.log("Edit control:", control.name)
    // Open edit modal or navigate to edit page
  }

  const handleVerifyControl = (control: CriticalControl) => {
    console.log("Verify control:", control.name)
    // Open verification workflow
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Critical Controls</h1>
              <p className="text-sm text-muted-foreground">
                Manage and monitor critical safety controls
              </p>
            </div>
            
            <Button className="bg-control-active hover:bg-control-active/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Control
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search controls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All ({controls.length})
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Active ({getStatusCount("active")})
                </Button>
                <Button
                  variant={statusFilter === "testing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("testing")}
                >
                  Testing ({getStatusCount("testing")})
                </Button>
                <Button
                  variant={statusFilter === "maintenance" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("maintenance")}
                >
                  Maintenance ({getStatusCount("maintenance")})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredControls.map((control) => (
            <ControlCard
              key={control.id}
              control={control}
              onView={handleViewControl}
              onEdit={handleEditControl}
              onVerify={handleVerifyControl}
            />
          ))}
        </div>

        {filteredControls.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No controls found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 