/**
 * OKR/SLA/KPQ Graph-Native Integration Types
 * 
 * Defines TypeScript interfaces for Objectives and Key Results (OKRs),
 * Service Level Agreements (SLAs), and Key Performance Questions (KPQs)
 * as graph-native entities that link strategic intent to operational evidence.
 */

// ============================================================================
// CORE ENTITY TYPES
// ============================================================================

export interface OKR {
  id: string
  title: string
  description?: string
  objective: string
  keyResults: string[]
  period: string // e.g., 'Q3-2025', 'FY2025'
  status: OKRStatus
  priority: Priority
  owner?: string
  targetDate?: Date
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date

  // Graph node relationship
  graphNodeId?: string
  graphNode?: Node

  // Relationships to operational elements
  businessCanvasId?: string
  businessCanvas?: BusinessCanvas
  
  operatingModelId?: string
  operatingModel?: OperatingModel
  
  criticalControlId?: string
  criticalControl?: CriticalControl
  
  processId?: string
  process?: Process

  // OKR relationships
  okrSlas: OKRSLA[]
  okrKpqs: OKRKPQ[]
  okrMetrics: OKRMetric[]
}

export interface SLA {
  id: string
  title: string
  description?: string
  service: string
  target: string // e.g., 'Daily verification', '99.9% uptime'
  acceptableLapse?: string // e.g., '1 day', '0.1%'
  measurementUnit?: string // e.g., 'days', 'percentage', 'hours'
  status: SLAStatus
  priority: Priority
  owner?: string
  reviewPeriod?: string
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date

  // Graph node relationship
  graphNodeId?: string
  graphNode?: Node

  // Relationships to operational elements
  businessCanvasId?: string
  businessCanvas?: BusinessCanvas
  
  operatingModelId?: string
  operatingModel?: OperatingModel
  
  criticalControlId?: string
  criticalControl?: CriticalControl
  
  processId?: string
  process?: Process

  // SLA relationships
  okrSlas: OKRSLA[]
  slaKpqs: SLAKPQ[]
  slaMetrics: SLAMetric[]
}

export interface KPQ {
  id: string
  question: string
  description?: string
  scope: string // e.g., 'Tailings Risk Response', 'Safety Culture'
  category: KPQCategory
  status: KPQStatus
  priority: Priority
  owner?: string
  lastTested?: Date
  nextTestDue?: Date
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date

  // Graph node relationship
  graphNodeId?: string
  graphNode?: Node

  // Relationships to operational elements
  businessCanvasId?: string
  businessCanvas?: BusinessCanvas
  
  operatingModelId?: string
  operatingModel?: OperatingModel
  
  criticalControlId?: string
  criticalControl?: CriticalControl
  
  processId?: string
  process?: Process
  
  playbookId?: string
  playbook?: Playbook

  // KPQ relationships
  okrKpqs: OKRKPQ[]
  slaKpqs: SLAKPQ[]
  kpqMetrics: KPQMetric[]
}

// ============================================================================
// JUNCTION TABLES
// ============================================================================

export interface OKRSLA {
  id: string
  okrId: string
  slaId: string
  metadata: Record<string, any>
  createdAt: Date

  // Relationships
  okr: OKR
  sla: SLA
}

export interface OKRKPQ {
  id: string
  okrId: string
  kpqId: string
  metadata: Record<string, any>
  createdAt: Date

  // Relationships
  okr: OKR
  kpq: KPQ
}

export interface SLAKPQ {
  id: string
  slaId: string
  kpqId: string
  metadata: Record<string, any>
  createdAt: Date

  // Relationships
  sla: SLA
  kpq: KPQ
}

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export interface OKRMetric {
  id: string
  okrId: string
  metric: string
  value: number
  target?: number
  unit?: string
  period: string
  status: MetricStatus
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date

  // Relationships
  okr: OKR
}

export interface SLAMetric {
  id: string
  slaId: string
  metric: string
  value: number
  target: number
  unit?: string
  period: string
  status: MetricStatus
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date

  // Relationships
  sla: SLA
}

export interface KPQMetric {
  id: string
  kpqId: string
  metric: string
  value: number
  target?: number
  unit?: string
  period: string
  status: MetricStatus
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date

  // Relationships
  kpq: KPQ
}

// ============================================================================
// ENUMS
// ============================================================================

export enum OKRStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum SLAStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  BREACHED = 'BREACHED',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED'
}

export enum KPQStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ANSWERED = 'ANSWERED',
  UNANSWERED = 'UNANSWERED',
  OUTDATED = 'OUTDATED'
}

export enum KPQCategory {
  ASSURANCE = 'ASSURANCE',
  AUDIT = 'AUDIT',
  COMPLIANCE = 'COMPLIANCE',
  SAFETY = 'SAFETY',
  QUALITY = 'QUALITY',
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC'
}

export enum MetricStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  OFF_TRACK = 'OFF_TRACK',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

// ============================================================================
// GRAPH RELATIONSHIP TYPES
// ============================================================================

export enum GraphRelationType {
  // OKR relationships
  DRIVES = 'drives',                    // OKR → Capability
  EXPECTS_CHANGE_IN = 'expects_change_in', // OKR → Risk or Process
  
  // SLA relationships
  APPLIES_TO = 'applies_to',            // SLA → Process/Control
  
  // KPQ relationships
  QUESTIONS = 'questions',              // KPQ → Process/Control
  ASSESSES = 'assesses'                 // KPQ → Capability/Playbook
}

// ============================================================================
// CREATION/UPDATE TYPES
// ============================================================================

export interface CreateOKRRequest {
  title: string
  description?: string
  objective: string
  keyResults: string[]
  period: string
  priority?: Priority
  owner?: string
  targetDate?: Date
  metadata?: Record<string, any>
  
  // Optional operational linkages
  businessCanvasId?: string
  operatingModelId?: string
  criticalControlId?: string
  processId?: string
}

export interface CreateSLARequest {
  title: string
  description?: string
  service: string
  target: string
  acceptableLapse?: string
  measurementUnit?: string
  priority?: Priority
  owner?: string
  reviewPeriod?: string
  metadata?: Record<string, any>
  
  // Optional operational linkages
  businessCanvasId?: string
  operatingModelId?: string
  criticalControlId?: string
  processId?: string
}

export interface CreateKPQRequest {
  question: string
  description?: string
  scope: string
  category?: KPQCategory
  priority?: Priority
  owner?: string
  lastTested?: Date
  nextTestDue?: Date
  metadata?: Record<string, any>
  
  // Optional operational linkages
  businessCanvasId?: string
  operatingModelId?: string
  criticalControlId?: string
  processId?: string
  playbookId?: string
}

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface OKRQueryFilters {
  status?: OKRStatus
  priority?: Priority
  period?: string
  owner?: string
  businessCanvasId?: string
  operatingModelId?: string
  criticalControlId?: string
  processId?: string
}

export interface SLAQueryFilters {
  status?: SLAStatus
  priority?: Priority
  service?: string
  owner?: string
  businessCanvasId?: string
  operatingModelId?: string
  criticalControlId?: string
  processId?: string
}

export interface KPQQueryFilters {
  status?: KPQStatus
  category?: KPQCategory
  priority?: Priority
  scope?: string
  owner?: string
  businessCanvasId?: string
  operatingModelId?: string
  criticalControlId?: string
  processId?: string
  playbookId?: string
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface OKRComplianceMap {
  okrId: string
  okrTitle: string
  contributingProcesses: string[]
  contributingMetrics: string[]
  contributingControls: string[]
  complianceScore: number
  gaps: string[]
  conflicts: string[]
  misalignments: string[]
}

export interface SLABreachWarning {
  slaId: string
  slaTitle: string
  service: string
  currentValue: number
  targetValue: number
  breachThreshold: number
  trend: 'improving' | 'stable' | 'deteriorating'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastUpdated: Date
}

export interface KPQAuditPanel {
  kpqId: string
  question: string
  scope: string
  lastResponse?: string
  status: KPQStatus
  openGaps: string[]
  nextTestDue?: Date
  linkedProcesses: string[]
  linkedControls: string[]
  linkedPlaybooks: string[]
}

// ============================================================================
// GRAPH TRAVERSAL TYPES
// ============================================================================

export interface GraphTraversalResult {
  path: string[]
  relationships: GraphRelationType[]
  metadata: Record<string, any>[]
  totalDistance: number
}

export interface GraphGapAnalysis {
  missingLinks: {
    from: string
    to: string
    expectedRelation: GraphRelationType
    impact: 'low' | 'medium' | 'high'
  }[]
  conflicts: {
    element1: string
    element2: string
    conflictType: string
    description: string
  }[]
  misalignments: {
    strategic: string
    operational: string
    misalignmentType: string
    description: string
  }[]
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// Import existing types (these would be defined elsewhere in your codebase)
export interface Node {
  id: string
  type: string
  label: string
  metadata: Record<string, any>
}

export interface BusinessCanvas {
  id: string
  name: string
  // ... other fields
}

export interface OperatingModel {
  id: string
  name: string
  // ... other fields
}

export interface CriticalControl {
  id: string
  name: string
  // ... other fields
}

export interface Process {
  id: string
  name: string
  // ... other fields
}

export interface Playbook {
  id: string
  name: string
  // ... other fields
} 