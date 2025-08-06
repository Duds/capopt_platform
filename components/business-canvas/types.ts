/**
 * Business Canvas Types - TypeScript Type Definitions
 * 
 * Defines TypeScript interfaces for the business canvas functionality:
 * - CanvasItem: Individual elements within canvas sections
 * - BusinessModel: Complete business model with 9 canvas sections
 * - CanvasSection: Section configuration and layout information
 * - CanvasVisualizationProps: Props for the main visualization component
 * - CanvasItemProps: Props for individual canvas items
 * 
 * These types ensure type safety and consistency across
 * the business canvas implementation.
 */

export interface CanvasItem {
  id: string
  title?: string
  name?: string
  description?: string
  priority?: "high" | "medium" | "low" | "HIGH" | "MEDIUM" | "LOW" | "CRITICAL"
  color?: string
  isImplemented?: boolean
  // Additional properties for different sections
  type?: string
  size?: number
  estimatedValue?: number
  frequency?: string
  value?: string
  availability?: string
  cost?: number
  amount?: number
  category?: string
  effectiveness?: string
}

// Enhanced CanvasItem interface with strategic and operational context
export interface EnhancedCanvasItem extends CanvasItem {
  // Strategic Context
  strategicObjective?: string;
  competitiveAdvantage?: string;
  uniqueSellingPoint?: string;
  
  // Operational Integration
  operationalDeliveryPoints?: string[];
  processDependencies?: string[];
  resourceRequirements?: string[];
  
  // Risk & Control
  criticalControls?: string[];
  riskMitigation?: string;
  complianceRequirements?: string[];
  
  // Performance Metrics
  effectiveness?: string;
  efficiency?: number;
  satisfaction?: number;
  
  // Australian Context
  whsRequirements?: string[];
  isoStandards?: string[];
  icmmGuidelines?: string[];
}

export interface BusinessModel {
  partnerships: CanvasItem[]
  activities: CanvasItem[]
  resources: CanvasItem[]
  valuePropositions: CanvasItem[]
  channels: CanvasItem[]
  customerSegments: CanvasItem[]
  costStructures: CanvasItem[]
  revenueStreams: CanvasItem[]
}

// Enhanced BusinessModel with enhanced items
export interface EnhancedBusinessModel {
  partnerships: EnhancedPartnership[]
  activities: EnhancedActivity[]
  resources: EnhancedResource[]
  valuePropositions: EnhancedValueProposition[]
  channels: EnhancedChannel[]
  customerSegments: EnhancedCustomerSegment[]
  costStructures: EnhancedCostStructure[]
  revenueStreams: EnhancedRevenueStream[]
}

// Section-specific enhanced interfaces
export interface EnhancedValueProposition extends EnhancedCanvasItem {
  targetCustomerSegment?: string;
  customerPainPoints?: string[];
  solutionBenefits?: string[];
  valueQuantification?: string;
  measurableOutcomes?: string[];
  successCriteria?: string[];
  valueEffectiveness?: string;
  customerSatisfaction?: number;
  marketPosition?: string;
}

export interface EnhancedCustomerSegment extends EnhancedCanvasItem {
  customerType?: string;
  geographicRegion?: string;
  industrySector?: string;
  companySize?: string;
  purchaseBehavior?: string;
  usagePatterns?: string;
  decisionFactors?: string[];
  loyaltyLevel?: string;
  revenuePotential?: number;
  profitability?: number;
  lifetimeValue?: number;
  acquisitionCost?: number;
  serviceDeliveryChannels?: string[];
  supportProcesses?: string[];
  relationshipManagement?: string[];
  customerRiskProfile?: string;
  dataProtectionNeeds?: string[];
  retentionRate?: number;
  growthPotential?: string;
}

export interface EnhancedChannel extends EnhancedCanvasItem {
  channelType?: string; // DIRECT/INDIRECT/PARTNER
  reach?: string;
  coverage?: string;
  deliveryMethod?: string;
  serviceLevel?: string;
  responseTime?: string;
  availability?: string;
  channelCost?: number;
  revenueShare?: number;
  profitability?: number;
  investmentRequired?: number;
  operationalProcesses?: string[];
  systemDependencies?: string[];
  resourceAllocation?: string[];
  channelRisks?: string[];
  qualityControls?: string[];
  channelEffectiveness?: string;
  costEfficiency?: number;
}

export interface EnhancedRevenueStream extends EnhancedCanvasItem {
  pricingStrategy?: string;
  revenueModel?: string; // SUBSCRIPTION/TRANSACTION/LICENSING
  revenuePotential?: number;
  profitMargin?: number;
  costStructure?: string;
  breakEvenPoint?: number;
  marketSize?: number;
  competitivePosition?: string;
  growthRate?: number;
  seasonality?: string;
  revenueProcesses?: string[];
  billingSystems?: string[];
  collectionProcedures?: string[];
  revenueRisks?: string[];
  financialControls?: string[];
  revenueGrowth?: number;
  cashFlow?: number;
  forecastAccuracy?: number;
}

export interface EnhancedResource extends EnhancedCanvasItem {
  resourceCategory?: string;
  criticality?: string;
  uniqueness?: string;
  scarcity?: string;
  capacity?: string;
  utilization?: number;
  scalability?: string;
  replacementCost?: number;
  reliability?: number;
  maintenanceRequirements?: string;
  operationalAssets?: string[];
  skillRequirements?: string[];
  resourceRisks?: string[];
  protectionMeasures?: string[];
  backupPlans?: string[];
  optimizationOpportunities?: string[];
  improvementTargets?: string[];
  investmentPriorities?: string[];
}

export interface EnhancedActivity extends EnhancedCanvasItem {
  activityType?: string; // PRODUCTION/PROBLEM_SOLVING/PLATFORM
  complexity?: string;
  processSteps?: string[];
  inputs?: string[];
  outputs?: string[];
  dependencies?: string[];
  quality?: string;
  cycleTime?: string;
  operationalProcesses?: string[];
  workflowMappings?: string[];
  systemIntegrations?: string[];
  activityRisks?: string[];
  safetyControls?: string[];
  qualityAssurance?: string[];
  optimizationOpportunities?: string[];
  automationPotential?: string;
  skillRequirements?: string[];
}

export interface EnhancedPartnership extends EnhancedCanvasItem {
  partnershipModel?: string; // STRATEGIC/OPERATIONAL/COMPETITIVE
  exclusivity?: string;
  contractTerms?: string;
  serviceLevel?: string;
  performanceMetrics?: string[];
  communication?: string;
  costStructure?: string;
  revenueShare?: number;
  investment?: number;
  riskSharing?: string;
  supplierProcesses?: string[];
  qualityControls?: string[];
  logisticsManagement?: string[];
  supplierRisks?: string[];
  contingencyPlans?: string[];
  supplierPerformance?: string;
  relationshipStrength?: string;
  valueDelivery?: string;
}

export interface EnhancedCostStructure extends EnhancedCanvasItem {
  costType?: string; // FIXED/VARIABLE
  costDriver?: string;
  allocationMethod?: string;
  budget?: number;
  actual?: number;
  variance?: number;
  trend?: string;
  forecast?: number;
  costCenter?: string;
  responsibility?: string;
  controllability?: string;
  costProcesses?: string[];
  budgetSystems?: string[];
  expenseControls?: string[];
  costRisks?: string[];
  budgetControls?: string[];
  approvalProcedures?: string[];
  costReductionOpportunities?: string[];
  efficiencyTargets?: string[];
  investmentPriorities?: string[];
}

export interface CanvasSection {
  key: keyof BusinessModel
  title: string
  description: string
  icon: React.ReactNode
  color: string
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  isImplemented: boolean
}

export interface BusinessModelCanvasProps {
  businessModel: BusinessModel
  onUpdate: (updatedModel: BusinessModel) => void
  isEditing?: boolean
  viewMode?: 'list' | 'canvas'
  onViewModeChange?: (mode: 'list' | 'canvas') => void
  onEditingChange?: (editing: boolean) => void
}

export interface CanvasItemProps {
  item: CanvasItem
  sectionKey: keyof BusinessModel
  isEditing: boolean
  onEdit?: (item: CanvasItem) => void
  onDelete?: (itemId: string) => void
  onDragStart?: (e: React.DragEvent, item: CanvasItem, sectionKey: keyof BusinessModel) => void
}

// BMC → OMC Integration Types
export interface BMCOMCIntegration {
  id: string;
  businessCanvasId: string;
  operatingModelId: string;
  bmcSection: keyof BusinessModel;
  bmcItemId: string;
  omcSection: string; // suppliers, locations, value_chains, etc.
  omcItemId: string;
  integrationType: 'DIRECT_MAPPING' | 'DERIVED' | 'INFLUENCES';
  integrationStrength: number;
  integrationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BMCGraphRelationship {
  id: string;
  businessCanvasId: string;
  fromSection: keyof BusinessModel;
  fromItemId: string;
  toSection: keyof BusinessModel;
  toItemId: string;
  relationshipType: 'DELIVERS_TO' | 'SUPPORTS' | 'DEPENDS_ON' | 'COMPETES_WITH';
  relationshipStrength: number;
  relationshipNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BMCCriticalControl {
  id: string;
  businessCanvasId: string;
  bmcSection: keyof BusinessModel;
  bmcItemId: string;
  criticalControlId: string;
  controlEffectiveness: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | 'NOT_APPLICABLE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceRequirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced BusinessModelCanvasProps
export interface EnhancedBusinessModelCanvasProps {
  businessModel: EnhancedBusinessModel;
  onUpdate: (updatedModel: EnhancedBusinessModel) => void;
  isEditing?: boolean;
  viewMode?: 'list' | 'canvas';
  onViewModeChange?: (mode: 'list' | 'canvas') => void;
  onEditingChange?: (editing: boolean) => void;
  // BMC → OMC Integration props
  integrations?: BMCOMCIntegration[];
  onIntegrationCreate?: (integration: Omit<BMCOMCIntegration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onIntegrationUpdate?: (id: string, updates: Partial<BMCOMCIntegration>) => void;
  onIntegrationDelete?: (id: string) => void;
  // Graph Relationships props
  relationships?: BMCGraphRelationship[];
  onRelationshipCreate?: (relationship: Omit<BMCGraphRelationship, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onRelationshipUpdate?: (id: string, updates: Partial<BMCGraphRelationship>) => void;
  onRelationshipDelete?: (id: string) => void;
  // Critical Controls props
  criticalControls?: BMCCriticalControl[];
  onControlAssign?: (control: Omit<BMCCriticalControl, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onControlUpdate?: (id: string, updates: Partial<BMCCriticalControl>) => void;
  onControlRemove?: (id: string) => void;
} 