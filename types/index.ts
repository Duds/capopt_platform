// Core domain types for the CapOpt Platform

// API-compatible types based on Prisma schema
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'USER' | 'AUDITOR' | 'SUPERADMIN' | 'SECURITY_OFFICER' | 'DATA_STEWARD' | 'PROCESS_OWNER' | 'CONTROL_OWNER' | 'VIEWER' | 'EXTERNAL_AUDITOR' | 'MAINTENANCE' | 'DOCUMENTATION_SPECIALIST'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CriticalControl {
  id: string
  name: string
  description?: string
  riskCategoryId?: string
  controlTypeId?: string
  effectivenessId?: string
  complianceStatus?: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'UNDER_REVIEW'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdById: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  riskCategory?: RiskCategory
  controlType?: ControlType
  effectiveness?: ControlEffectiveness
  createdBy?: User
  processes?: Process[]
  assets?: Asset[]
  bowtieAnalyses?: BowtieAnalysis[]
}

export interface RiskCategory {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface ControlType {
  id: string
  name: string
  description?: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface ControlEffectiveness {
  id: string
  rating: string
  description?: string
  score?: number
  createdAt: Date
  updatedAt: Date
}

export interface Process {
  id: string
  name: string
  description?: string
  version?: string
  status?: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdById: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  createdBy?: User
  steps?: ProcessStep[]
  inputs?: ProcessInput[]
  outputs?: ProcessOutput[]
  metrics?: ProcessMetric[]
  risks?: ProcessRisk[]
  controls?: CriticalControl[]
  playbooks?: Playbook[]
  maturityScores?: MaturityAssessment[]
}

export interface ProcessStep {
  id: string
  processId: string
  name: string
  description?: string
  orderIndex: number
  duration?: number
  responsible?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProcessInput {
  id: string
  processId: string
  name: string
  type?: string
  description?: string
  required?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProcessOutput {
  id: string
  processId: string
  name: string
  type?: string
  description?: string
  quality?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProcessMetric {
  id: string
  processId: string
  name: string
  value: number
  unit?: string
  target?: number
  frequency?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProcessRisk {
  id: string
  processId: string
  name: string
  description?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  likelihood?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  impact?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  mitigation?: string
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  id: string
  name: string
  description?: string
  type: 'EQUIPMENT' | 'FACILITY' | 'SYSTEM' | 'INFRASTRUCTURE' | 'VEHICLE' | 'TOOL'
  location?: string
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED'
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdById: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  createdBy?: User
  risks?: AssetRisk[]
  protections?: AssetProtection[]
  monitors?: AssetMonitor[]
  optimisations?: AssetOptimisation[]
  controls?: CriticalControl[]
}

export interface AssetRisk {
  id: string
  assetId: string
  name: string
  description?: string
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  mitigation?: string
  createdAt: Date
  updatedAt: Date
}

export interface AssetProtection {
  id: string
  assetId: string
  name: string
  description?: string
  type: 'PHYSICAL' | 'CYBER' | 'PROCEDURAL' | 'TECHNICAL'
  effectiveness?: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' | 'UNKNOWN'
  createdAt: Date
  updatedAt: Date
}

export interface AssetMonitor {
  id: string
  assetId: string
  name: string
  description?: string
  type: 'CONTINUOUS' | 'PERIODIC' | 'EVENT_DRIVEN'
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'FAILED'
  createdAt: Date
  updatedAt: Date
}

export interface AssetOptimisation {
  id: string
  assetId: string
  name: string
  description?: string
  type: 'PERFORMANCE' | 'EFFICIENCY' | 'RELIABILITY' | 'COST'
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
}

export interface BusinessCanvas {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  
  // Relations
  valuePropositions?: ValueProposition[]
  customerSegments?: CustomerSegment[]
  revenueStreams?: RevenueStream[]
  partnerships?: Partnership[]
  resources?: Resource[]
  activities?: Activity[]
  costStructure?: CostStructure[]
  channels?: Channel[]
}

export interface ValueProposition {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface CustomerSegment {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface RevenueStream {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface Partnership {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface Resource {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  type?: 'PHYSICAL' | 'INTELLECTUAL' | 'HUMAN' | 'FINANCIAL'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface CostStructure {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface Channel {
  id: string
  businessCanvasId: string
  name: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface Playbook {
  id: string
  name: string
  description?: string
  version?: string
  status?: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
  
  // Relations
  procedures?: Procedure[]
  trainingMaterials?: TrainingMaterial[]
  bestPractices?: BestPractice[]
  improvements?: Improvement[]
  processes?: Process[]
}

export interface Procedure {
  id: string
  playbookId: string
  name: string
  description?: string
  steps?: string
  createdAt: Date
  updatedAt: Date
}

export interface TrainingMaterial {
  id: string
  playbookId: string
  title: string
  type?: string
  content?: string
  url?: string
  createdAt: Date
  updatedAt: Date
}

export interface BestPractice {
  id: string
  playbookId: string
  name: string
  description?: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface Improvement {
  id: string
  playbookId: string
  name: string
  description?: string
  status?: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface MaturityAssessment {
  id: string
  name: string
  description?: string
  framework: string
  createdById: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  createdBy?: User
  capabilityScores?: CapabilityScore[]
  improvementRoadmaps?: ImprovementRoadmap[]
  benchmarks?: Benchmark[]
  progress?: Progress[]
}

export interface CapabilityScore {
  id: string
  maturityAssessmentId: string
  capability: string
  score: number
  level: 'INITIAL' | 'REPEATABLE' | 'DEFINED' | 'MANAGED' | 'OPTIMISING'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface ImprovementRoadmap {
  id: string
  maturityAssessmentId: string
  name: string
  description?: string
  targetLevel: 'INITIAL' | 'REPEATABLE' | 'DEFINED' | 'MANAGED' | 'OPTIMISING'
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  createdAt: Date
  updatedAt: Date
}

export interface Benchmark {
  id: string
  maturityAssessmentId: string
  name: string
  description?: string
  score: number
  industry?: string
  createdAt: Date
  updatedAt: Date
}

export interface Progress {
  id: string
  maturityAssessmentId: string
  milestone: string
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED'
  completionDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BowtieAnalysis {
  id: string
  name: string
  description?: string
  controlId?: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  control?: CriticalControl
  threats?: Threat[]
  consequences?: Consequence[]
  barriers?: Barrier[]
}

export interface Threat {
  id: string
  bowtieAnalysisId: string
  name: string
  description?: string
  likelihood?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  createdAt: Date
  updatedAt: Date
}

export interface Consequence {
  id: string
  bowtieAnalysisId: string
  name: string
  description?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  updatedAt: Date
}

export interface Barrier {
  id: string
  bowtieAnalysisId: string
  name: string
  description?: string
  type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'RECOVERY'
  effectiveness?: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' | 'UNKNOWN'
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  details?: string
  timestamp: Date
  
  // Relations
  user?: User
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
  totalProcesses: number
  activeProcesses: number
  totalAssets: number
  operationalAssets: number
  maturityScore: number
}

// Form types
export interface ControlFormData {
  name: string
  description?: string
  riskCategoryId?: string
  controlTypeId?: string
  effectivenessId?: string
  complianceStatus?: CriticalControl['complianceStatus']
  priority?: CriticalControl['priority']
}

export interface ProcessFormData {
  name: string
  description?: string
  version?: string
  status?: Process['status']
  priority?: Process['priority']
  steps?: ProcessStep[]
  inputs?: ProcessInput[]
  outputs?: ProcessOutput[]
  metrics?: ProcessMetric[]
  risks?: ProcessRisk[]
}

export interface AssetFormData {
  name: string
  description?: string
  type: Asset['type']
  location?: string
  status: Asset['status']
  criticality: Asset['criticality']
  risks?: AssetRisk[]
  protections?: AssetProtection[]
  monitors?: AssetMonitor[]
  optimisations?: AssetOptimisation[]
}

// Filter and search types
export interface ControlFilters {
  riskCategoryId?: string
  controlTypeId?: string
  priority?: CriticalControl['priority']
  complianceStatus?: CriticalControl['complianceStatus']
}

export interface ProcessFilters {
  status?: Process['status']
  priority?: Process['priority']
  createdById?: string
}

export interface AssetFilters {
  type?: Asset['type']
  status?: Asset['status']
  criticality?: Asset['criticality']
  createdById?: string
}

// Chart and analytics types
export interface PerformanceTrend {
  date: Date
  value: number
  metric: string
}

export interface ControlPerformance {
  controlId: string
  controlName: string
  complianceStatus: CriticalControl['complianceStatus']
  priority: CriticalControl['priority']
  trend: PerformanceTrend[]
} 