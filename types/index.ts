// Core domain types for the petrochemical critical controls platform

export interface Facility {
  id: string
  name: string
  code: string
  type: 'refinery' | 'chemical_plant' | 'terminal' | 'storage_facility'
  location: {
    lat: number
    lng: number
    address: string
  }
  timezone: string
  status: 'active' | 'inactive' | 'maintenance' | 'emergency'
  units: Unit[]
  createdAt: Date
  updatedAt: Date
}

export interface Unit {
  id: string
  facilityId: string
  name: string
  code: string
  type: 'distillation' | 'reactor' | 'storage' | 'piping' | 'compressor' | 'pump'
  location: {
    x: number
    y: number
    width: number
    height: number
  }
  capacity: {
    value: number
    unit: string
  }
  status: 'active' | 'inactive' | 'maintenance' | 'emergency'
  controls: CriticalControl[]
  createdAt: Date
  updatedAt: Date
}

export interface CriticalControl {
  id: string
  facilityId: string
  unitId?: string
  name: string
  code: string
  type: 'engineering' | 'administrative' | 'ppe' | 'monitoring'
  category: 'prevention' | 'mitigation' | 'detection'
  description: string
  location: {
    x: number
    y: number
  }
  specifications: {
    manufacturer?: string
    model?: string
    serialNumber?: string
    installationDate?: Date
    lastCalibration?: Date
    nextCalibration?: Date
  }
  hazards: string[]
  status: 'active' | 'inactive' | 'maintenance' | 'testing' | 'failed'
  priority: 1 | 2 | 3 | 4 | 5
  currentStatus: ControlStatus
  verificationSchedule: VerificationSchedule
  performance: PerformanceMetrics
  createdAt: Date
  updatedAt: Date
}

export interface ControlStatus {
  id: string
  controlId: string
  status: 'active' | 'testing' | 'maintenance' | 'failed'
  reliability: number // 0-100
  availability: number // 0-100
  effectiveness: number // 0-100
  lastVerified: Date
  nextVerificationDue: Date
  verifiedBy: string
  notes: string
  createdAt: Date
}

export interface VerificationSchedule {
  id: string
  controlId: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  frequencyValue: number
  lastVerified: Date
  nextDue: Date
  responsibleRole: string
  checklistTemplateId?: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface VerificationWorkflow {
  id: string
  scheduleId: string
  controlId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  startedBy: string
  completedBy?: string
  result?: 'pass' | 'fail' | 'conditional'
  notes: string
  checklist: VerificationChecklist[]
  createdAt: Date
}

export interface VerificationChecklist {
  id: string
  workflowId: string
  question: string
  type: 'yes_no' | 'numeric' | 'text' | 'photo'
  required: boolean
  answer?: string
  photoUrl?: string
  completed: boolean
  completedAt?: Date
}

export interface PerformanceMetrics {
  id: string
  controlId: string
  metricType: 'reliability' | 'availability' | 'effectiveness'
  value: number
  unit: string
  timestamp: Date
  createdAt: Date
}

export interface Procedure {
  id: string
  facilityId: string
  title: string
  code: string
  type: 'operational' | 'emergency' | 'maintenance' | 'safety'
  category: string
  version: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  content: {
    steps: ProcedureStep[]
    attachments: ProcedureAttachment[]
    relatedControls: string[]
    relatedHazards: string[]
  }
  approvalWorkflow: {
    steps: ApprovalStep[]
    currentStep: number
  }
  createdBy: string
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ProcedureStep {
  id: string
  order: number
  title: string
  description: string
  type: 'instruction' | 'checkpoint' | 'decision' | 'action'
  required: boolean
  estimatedTime?: number // minutes
  relatedControls?: string[]
  attachments?: string[]
}

export interface ProcedureAttachment {
  id: string
  name: string
  type: 'image' | 'document' | 'video'
  url: string
  size: number
  uploadedAt: Date
}

export interface ApprovalStep {
  id: string
  order: number
  role: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: Date
  comments?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'operator' | 'supervisor' | 'engineer' | 'manager' | 'admin'
  facilityId: string
  department: string
  permissions: string[]
  status: 'active' | 'inactive'
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Alert {
  id: string
  facilityId: string
  controlId?: string
  type: 'control_failure' | 'verification_due' | 'maintenance_required' | 'safety_incident'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  status: 'active' | 'acknowledged' | 'resolved'
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolvedBy?: string
  resolvedAt?: Date
  createdAt: Date
}

export interface MaintenanceSchedule {
  id: string
  controlId: string
  type: 'preventive' | 'corrective' | 'predictive'
  frequency: string
  lastMaintenance?: Date
  nextMaintenance: Date
  estimatedDuration: number // minutes
  requiredPersonnel: number
  requiredEquipment: string[]
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceWorkOrder {
  id: string
  scheduleId: string
  controlId: string
  title: string
  description: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: string
  estimatedStart: Date
  estimatedEnd: Date
  actualStart?: Date
  actualEnd?: Date
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Dashboard types
export interface DashboardMetrics {
  totalControls: number
  activeControls: number
  criticalAlerts: number
  pendingVerifications: number
  facilityStatus: 'normal' | 'alert' | 'emergency'
  performanceScore: number
}

export interface FacilityOverview {
  facility: Facility
  metrics: DashboardMetrics
  recentAlerts: Alert[]
  upcomingMaintenance: MaintenanceSchedule[]
  controlsByStatus: Record<string, number>
}

// Real-time types
export interface RealTimeUpdate {
  type: 'control_status' | 'alert' | 'verification' | 'maintenance'
  data: any
  timestamp: Date
}

// Form types
export interface ControlFormData {
  name: string
  code: string
  type: CriticalControl['type']
  category: CriticalControl['category']
  description: string
  unitId?: string
  hazards: string[]
  priority: CriticalControl['priority']
  specifications: CriticalControl['specifications']
}

export interface VerificationFormData {
  controlId: string
  status: ControlStatus['status']
  reliability: number
  availability: number
  effectiveness: number
  notes: string
  checklist: VerificationChecklist[]
}

// Filter and search types
export interface ControlFilters {
  status?: CriticalControl['status']
  type?: CriticalControl['type']
  priority?: CriticalControl['priority']
  unitId?: string
  verificationDue?: boolean
}

export interface AlertFilters {
  severity?: Alert['severity']
  type?: Alert['type']
  status?: Alert['status']
  facilityId?: string
}

// Chart and analytics types
export interface PerformanceTrend {
  date: Date
  reliability: number
  availability: number
  effectiveness: number
}

export interface ControlPerformance {
  controlId: string
  controlName: string
  averageReliability: number
  averageAvailability: number
  averageEffectiveness: number
  trend: PerformanceTrend[]
} 