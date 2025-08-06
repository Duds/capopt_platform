/**
 * Operating Model Canvas Types
 * 
 * Defines the data structures and interfaces for the Operating Model Canvas.
 * 
 * The framework consists of six key components:
 * 1. Suppliers - External partners and vendors
 * 2. Locations - Physical and virtual locations
 * 3. Value Chains - Core business processes
 * 4. Organisation - Structure and people
 * 5. Information - Data and knowledge management
 * 6. Management Systems - Technology and tools
 */

export interface OperatingModel {
  id: string
  name: string
  description?: string
  version: string
  isActive: boolean
  status: CanvasStatus
  editMode: EditMode
  autoSave: boolean
  lastSaved: Date
  createdAt: Date
  updatedAt: Date
  
  // Enterprise context
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
  
  // Operating Model hierarchy
  parentOperatingModelId?: string
  
  // Business Canvas linkage
  businessCanvasId?: string
  
  // Campbell, Lancelott, Gutierrez Operating Model Components
  suppliers: OperatingModelSupplier[]
  locations: OperatingModelLocation[]
  valueChains: OperatingModelValueChain[]
  organisation: OperatingModelOrganisation[]
  information: OperatingModelInformation[]
  managementSystems: OperatingModelManagementSystem[]
  
  // Legacy components (to be deprecated)
  legacyValueChains: ValueChain[]
}

// ============================================================================
// 1. SUPPLIERS - External partners and vendors
// ============================================================================

export interface OperatingModelSupplier {
  id: string
  operatingModelId: string
  name: string
  description?: string
  supplierType: SupplierType
  category: string
  criticality: SupplierCriticality
  performance: SupplierPerformance
  contractType: ContractType
  contractValue?: number
  contractDuration?: number // months
  riskLevel: RiskLevel
  complianceStatus: ComplianceStatus
  location?: string
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // BMC Integration - link to Partnerships
  businessCanvasPartnershipId?: string
  businessCanvasPartnership?: Partnership
}

export enum SupplierType {
  MATERIAL_SUPPLIER = 'MATERIAL_SUPPLIER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  TECHNOLOGY_PARTNER = 'TECHNOLOGY_PARTNER',
  LOGISTICS_PROVIDER = 'LOGISTICS_PROVIDER',
  CONSULTANT = 'CONSULTANT',
  EQUIPMENT_SUPPLIER = 'EQUIPMENT_SUPPLIER',
  FINANCIAL_PARTNER = 'FINANCIAL_PARTNER',
  REGULATORY_PARTNER = 'REGULATORY_PARTNER'
}

export enum SupplierCriticality {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum SupplierPerformance {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
  UNACCEPTABLE = 'UNACCEPTABLE'
}

export enum ContractType {
  LONG_TERM = 'LONG_TERM',
  MEDIUM_TERM = 'MEDIUM_TERM',
  SHORT_TERM = 'SHORT_TERM',
  PROJECT_BASED = 'PROJECT_BASED',
  ON_DEMAND = 'ON_DEMAND',
  FRAMEWORK = 'FRAMEWORK'
}

// ============================================================================
// 2. LOCATIONS - Physical and virtual locations
// ============================================================================

export interface OperatingModelLocation {
  id: string
  operatingModelId: string
  name: string
  description?: string
  locationType: LocationType
  address: string
  city: string
  state: string
  postcode: string
  country: string
  coordinates?: string // lat,lng
  capacity?: string
  utilization?: number // percentage
  status: LocationStatus
  criticality: LocationCriticality
  costCenter?: string
  manager?: string
  employeeCount?: number
  operationalHours?: string
  timezone?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // BMC Integration - link to Resources and Activities
  businessCanvasResourceIds: string[]
  businessCanvasActivityIds: string[]
}

export enum LocationType {
  HEADQUARTERS = 'HEADQUARTERS',
  PRODUCTION_FACILITY = 'PRODUCTION_FACILITY',
  WAREHOUSE = 'WAREHOUSE',
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  OFFICE = 'OFFICE',
  LABORATORY = 'LABORATORY',
  WORKSHOP = 'WORKSHOP',
  FIELD_OFFICE = 'FIELD_OFFICE',
  REMOTE_SITE = 'REMOTE_SITE'
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PLANNED = 'PLANNED',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  DECOMMISSIONED = 'DECOMMISSIONED'
}

export enum LocationCriticality {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

// ============================================================================
// 3. VALUE CHAINS - Core business processes
// ============================================================================

export interface OperatingModelValueChain {
  id: string
  operatingModelId: string
  name: string
  description?: string
  valueChainType: ValueChainType
  sequence: number
  complexity: ValueChainComplexity
  efficiency?: number // percentage
  cost?: number
  duration?: number // days
  riskLevel: RiskLevel
  status: ValueChainStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // Relationships
  activities: OperatingModelValueChainActivity[]
  inputs: OperatingModelValueChainInput[]
  outputs: OperatingModelValueChainOutput[]
  metrics: OperatingModelValueChainMetric[]
  
  // BMC Integration - link to Activities and Resources
  businessCanvasActivityIds: string[]
  businessCanvasResourceIds: string[]
}

export interface OperatingModelValueChainActivity {
  id: string
  operatingModelValueChainId: string
  name: string
  description?: string
  activityType: ValueChainActivityType
  sequence: number
  duration: number // minutes
  cost?: number
  efficiency?: number // percentage
  automation?: number // percentage
  skillLevel: SkillLevel
  resources: string[] // Array of resource IDs
  dependencies: string[] // Array of activity IDs
  risks: string[] // Array of risk descriptions
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OperatingModelValueChainInput {
  id: string
  operatingModelValueChainId: string
  name: string
  description?: string
  inputType: ValueChainInputType
  source: string
  quantity: string
  quality: string
  cost?: number
  leadTime?: number // days
  reliability?: number // percentage
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OperatingModelValueChainOutput {
  id: string
  operatingModelValueChainId: string
  name: string
  description?: string
  outputType: ValueChainOutputType
  customer: string
  quantity: string
  quality: string
  value?: number
  deliveryTime?: number // days
  satisfaction?: number // percentage
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OperatingModelValueChainMetric {
  id: string
  operatingModelValueChainId: string
  name: string
  description?: string
  metricType: ValueChainMetricType
  unit: string
  target: number
  current: number
  frequency: MetricFrequency
  trend: MetricTrend
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export enum ValueChainType {
  PRIMARY = 'PRIMARY',
  SUPPORT = 'SUPPORT',
  ENABLING = 'ENABLING',
  CUSTOMER_FACING = 'CUSTOMER_FACING',
  INTERNAL = 'INTERNAL'
}

export enum ValueChainComplexity {
  SIMPLE = 'SIMPLE',
  MODERATE = 'MODERATE',
  COMPLEX = 'COMPLEX',
  VERY_COMPLEX = 'VERY_COMPLEX'
}

export enum ValueChainStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PLANNED = 'PLANNED',
  UNDER_DEVELOPMENT = 'UNDER_DEVELOPMENT',
  OPTIMIZING = 'OPTIMIZING'
}

export enum ValueChainActivityType {
  PRIMARY = 'PRIMARY',
  SUPPORT = 'SUPPORT',
  ENABLING = 'ENABLING',
  DECISION = 'DECISION',
  CONTROL = 'CONTROL'
}

export enum ValueChainInputType {
  MATERIAL = 'MATERIAL',
  INFORMATION = 'INFORMATION',
  CAPITAL = 'CAPITAL',
  HUMAN = 'HUMAN',
  ENERGY = 'ENERGY',
  TECHNOLOGY = 'TECHNOLOGY'
}

export enum ValueChainOutputType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  INFORMATION = 'INFORMATION',
  VALUE = 'VALUE',
  WASTE = 'WASTE'
}

export enum ValueChainMetricType {
  EFFICIENCY = 'EFFICIENCY',
  EFFECTIVENESS = 'EFFECTIVENESS',
  QUALITY = 'QUALITY',
  COST = 'COST',
  TIME = 'TIME',
  SATISFACTION = 'SATISFACTION'
}

export enum MetricFrequency {
  REAL_TIME = 'REAL_TIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

export enum MetricTrend {
  IMPROVING = 'IMPROVING',
  STABLE = 'STABLE',
  DECLINING = 'DECLINING',
  VOLATILE = 'VOLATILE'
}

export enum SkillLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

// ============================================================================
// 4. ORGANISATION - Structure and people
// ============================================================================

export interface OperatingModelOrganisation {
  id: string
  operatingModelId: string
  name: string
  description?: string
  orgType: OrganisationType
  level: OrganisationLevel
  parentOrgId?: string
  manager?: string
  employeeCount?: number
  budget?: number
  costCenter?: string
  location?: string
  responsibilities: string[]
  skills: string[]
  performance?: number // percentage
  maturity: MaturityLevel
  status: OrganisationStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // Relationships
  parentOrg?: OperatingModelOrganisation
  childOrgs: OperatingModelOrganisation[]
  
  // BMC Integration - link to Resources and Activities
  businessCanvasResourceIds: string[]
  businessCanvasActivityIds: string[]
}

export enum OrganisationType {
  FUNCTIONAL = 'FUNCTIONAL',
  DIVISIONAL = 'DIVISIONAL',
  MATRIX = 'MATRIX',
  NETWORK = 'NETWORK',
  TEAM_BASED = 'TEAM_BASED',
  PROJECT_BASED = 'PROJECT_BASED'
}

export enum OrganisationLevel {
  EXECUTIVE = 'EXECUTIVE',
  SENIOR_MANAGEMENT = 'SENIOR_MANAGEMENT',
  MIDDLE_MANAGEMENT = 'MIDDLE_MANAGEMENT',
  SUPERVISORY = 'SUPERVISORY',
  OPERATIONAL = 'OPERATIONAL'
}

export enum OrganisationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PLANNED = 'PLANNED',
  RESTRUCTURING = 'RESTRUCTURING'
}

// ============================================================================
// 5. INFORMATION - Data and knowledge management
// ============================================================================

export interface OperatingModelInformation {
  id: string
  operatingModelId: string
  name: string
  description?: string
  infoType: InformationType
  category: string
  source: string
  format: string
  frequency: InformationFrequency
  quality?: number // percentage
  accessibility: InformationAccessibility
  security: InformationSecurity
  retention?: number // days
  cost?: number
  owner?: string
  users: string[] // Array of user roles
  systems: string[] // Array of system names
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // BMC Integration - link to Resources and Activities
  businessCanvasResourceIds: string[]
  businessCanvasActivityIds: string[]
}

export enum InformationType {
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC',
  TACTICAL = 'TACTICAL',
  FINANCIAL = 'FINANCIAL',
  TECHNICAL = 'TECHNICAL',
  REGULATORY = 'REGULATORY',
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER'
}

export enum InformationFrequency {
  REAL_TIME = 'REAL_TIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ON_DEMAND = 'ON_DEMAND'
}

export enum InformationAccessibility {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL',
  CLASSIFIED = 'CLASSIFIED'
}

export enum InformationSecurity {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  ENHANCED = 'ENHANCED',
  HIGH = 'HIGH',
  MAXIMUM = 'MAXIMUM'
}

// ============================================================================
// 6. MANAGEMENT SYSTEMS - Technology and tools
// ============================================================================

export interface OperatingModelManagementSystem {
  id: string
  operatingModelId: string
  name: string
  description?: string
  systemType: ManagementSystemType
  category: string
  vendor?: string
  version?: string
  status: ManagementSystemStatus
  implementation: ImplementationStatus
  cost?: number
  roi?: number
  users?: number
  performance?: number // percentage
  reliability?: number // percentage
  security: ManagementSystemSecurity
  compliance: ComplianceStatus
  integration: string[] // Array of integrated systems
  features: string[] // Array of key features
  risks: string[] // Array of risk descriptions
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // BMC Integration - link to Resources and Activities
  businessCanvasResourceIds: string[]
  businessCanvasActivityIds: string[]
}

export enum ManagementSystemType {
  ERP = 'ERP',
  CRM = 'CRM',
  SCM = 'SCM',
  HRM = 'HRM',
  FINANCE = 'FINANCE',
  QUALITY = 'QUALITY',
  SAFETY = 'SAFETY',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  ASSET = 'ASSET',
  PROJECT = 'PROJECT',
  ANALYTICS = 'ANALYTICS',
  COLLABORATION = 'COLLABORATION'
}

export enum ManagementSystemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PLANNED = 'PLANNED',
  UNDER_IMPLEMENTATION = 'UNDER_IMPLEMENTATION',
  UPGRADING = 'UPGRADING',
  DECOMMISSIONING = 'DECOMMISSIONING'
}

export enum ImplementationStatus {
  NOT_STARTED = 'NOT_STARTED',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  TESTING = 'TESTING',
  LIVE = 'LIVE',
  OPTIMIZING = 'OPTIMIZING'
}

export enum ManagementSystemSecurity {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  ENHANCED = 'ENHANCED',
  HIGH = 'HIGH',
  MAXIMUM = 'MAXIMUM'
}

// ============================================================================
// COMMON ENUMS AND TYPES
// ============================================================================

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum MaturityLevel {
  INITIAL = 'INITIAL',
  REPEATABLE = 'REPEATABLE',
  DEFINED = 'DEFINED',
  MANAGED = 'MANAGED',
  OPTIMIZING = 'OPTIMIZING'
}

export enum CanvasStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum EditMode {
  SINGLE_USER = 'SINGLE_USER',
  MULTI_USER = 'MULTI_USER',
  READ_ONLY = 'READ_ONLY'
}

// ============================================================================
// LEGACY TYPES (TO BE DEPRECATED)
// ============================================================================

export interface ValueChain {
  id: string
  operatingModelId: string
  name: string
  description?: string
  sequence: number
  activityType?: string
  duration?: number
  resources: string[]
  dependencies: string[]
  createdAt: Date
  updatedAt: Date
  
  // Relationships
  activities: ValueChainActivity[]
  inputs: ValueChainInput[]
  outputs: ValueChainOutput[]
  metrics: ValueChainMetric[]
}

export interface ValueChainActivity {
  id: string
  valueChainId: string
  name: string
  description?: string
  activityType: string
  sequence: number
  duration: number
  resources: string[]
  dependencies: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ValueChainInput {
  id: string
  valueChainId: string
  name: string
  description?: string
  inputType: string
  source: string
  quantity: string
  quality: string
  createdAt: Date
  updatedAt: Date
}

export interface ValueChainOutput {
  id: string
  valueChainId: string
  name: string
  description?: string
  outputType: string
  customer: string
  quantity: string
  quality: string
  createdAt: Date
  updatedAt: Date
}

export interface ValueChainMetric {
  id: string
  valueChainId: string
  name: string
  description?: string
  metricType: string
  unit: string
  target: number
  current: number
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// BMC INTEGRATION TYPES
// ============================================================================

export interface Partnership {
  id: string
  businessCanvasId: string
  name: string
  type?: string
  description?: string
  value?: string
  createdAt: Date
  updatedAt: Date
  
  // OMC Integration
  operatingModelSuppliers: OperatingModelSupplier[]
}

// ============================================================================
// COMPONENT PROPS AND UTILITIES
// ============================================================================

// Canvas Item interface for consistent editing
export interface CanvasItem {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Props interface for the Operating Model Canvas component
export interface OperatingModelCanvasProps {
  operatingModel: OperatingModel
  onUpdate: (updatedModel: OperatingModel) => void
  isEditing?: boolean
  viewMode?: 'canvas' | 'list' | 'tree'
  onViewModeChange?: (mode: 'canvas' | 'list' | 'tree') => void
  onEditingChange?: (editing: boolean) => void
}

// Default operating model for new canvases
export const defaultOperatingModel: OperatingModel = {
  id: '',
  name: 'New Operating Model',
  description: 'Strategic operational framework',
  version: '1.0',
  isActive: true,
  status: CanvasStatus.DRAFT,
  editMode: EditMode.SINGLE_USER,
  autoSave: true,
  lastSaved: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  suppliers: [],
  locations: [],
  valueChains: [],
  organisation: [],
  information: [],
  managementSystems: [],
  legacyValueChains: []
} 