/**
 * Operating Model Canvas Utilities - Campbell, Lancelott, Gutierrez Framework
 * 
 * Utility functions for the Operating Model Canvas following the framework
 * by Andrew Campbell, Mark Lancelott, and Mikel Gutierrez.
 */

import { 
  OperatingModel, 
  OperatingModelSupplier,
  OperatingModelLocation,
  OperatingModelValueChain,
  OperatingModelOrganisation,
  OperatingModelInformation,
  OperatingModelManagementSystem,
  SupplierType,
  LocationType,
  ValueChainType,
  OrganisationType,
  InformationType,
  ManagementSystemType,
  RiskLevel,
  ComplianceStatus,
  MaturityLevel,
  CanvasStatus,
  EditMode
} from './types'

import { 
  Building2, 
  MapPin, 
  Workflow, 
  Users, 
  Database, 
  Monitor,
  Truck,
  Factory,
  Building,
  Warehouse,
  Globe,
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Network,
  Layers,
  Gauge,
  Activity,
  Package,
  Eye,
  Zap,
  Heart,
  BookOpen,
  Target as TargetIcon,
  Leaf,
  Grid3X3,
  List,
  Printer,
  Mail,
  Link,
  FileText,
  Network as NetworkIcon,
  Layers as LayersIcon,
  Gauge as GaugeIcon,
  Clock as ClockIcon,
  ArrowRight,
  ChevronDown,
  MoreHorizontal,
  BarChart3 as BarChart3Icon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-react'

// ============================================================================
// OPERATING MODEL SECTIONS CONFIGURATION
// ============================================================================

export const operatingModelSections = {
  suppliers: {
    title: 'Suppliers',
    description: 'External partners and vendors that support your operations',
    icon: Truck,
    color: 'border-blue-200 bg-blue-50',
    order: 1
  },
  locations: {
    title: 'Locations',
    description: 'Physical and virtual locations where operations occur',
    icon: MapPin,
    color: 'border-green-200 bg-green-50',
    order: 2
  },
  valueChains: {
    title: 'Value Chains',
    description: 'Core business processes that create value',
    icon: Workflow,
    color: 'border-purple-200 bg-purple-50',
    order: 3
  },
  organisation: {
    title: 'Organisation',
    description: 'Structure and people that execute operations',
    icon: Users,
    color: 'border-orange-200 bg-orange-50',
    order: 4
  },
  information: {
    title: 'Information',
    description: 'Data and knowledge management systems',
    icon: Database,
    color: 'border-cyan-200 bg-cyan-50',
    order: 5
  },
  managementSystems: {
    title: 'Management Systems',
    description: 'Technology and tools that enable operations',
    icon: Monitor,
    color: 'border-red-200 bg-red-50',
    order: 6
  }
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

export const getSupplierTypeColor = (type: SupplierType): string => {
  switch (type) {
    case SupplierType.MATERIAL_SUPPLIER:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case SupplierType.SERVICE_PROVIDER:
      return 'bg-green-100 text-green-800 border-green-200'
    case SupplierType.TECHNOLOGY_PARTNER:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case SupplierType.LOGISTICS_PROVIDER:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case SupplierType.CONSULTANT:
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case SupplierType.EQUIPMENT_SUPPLIER:
      return 'bg-red-100 text-red-800 border-red-200'
    case SupplierType.FINANCIAL_PARTNER:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case SupplierType.REGULATORY_PARTNER:
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getLocationTypeColor = (type: LocationType): string => {
  switch (type) {
    case LocationType.HEADQUARTERS:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case LocationType.PRODUCTION_FACILITY:
      return 'bg-green-100 text-green-800 border-green-200'
    case LocationType.WAREHOUSE:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case LocationType.DISTRIBUTION_CENTER:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case LocationType.OFFICE:
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case LocationType.LABORATORY:
      return 'bg-red-100 text-red-800 border-red-200'
    case LocationType.WORKSHOP:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case LocationType.FIELD_OFFICE:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case LocationType.REMOTE_SITE:
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getValueChainTypeColor = (type: ValueChainType): string => {
  switch (type) {
    case ValueChainType.PRIMARY:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case ValueChainType.SUPPORT:
      return 'bg-green-100 text-green-800 border-green-200'
    case ValueChainType.ENABLING:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case ValueChainType.CUSTOMER_FACING:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case ValueChainType.INTERNAL:
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getOrganisationTypeColor = (type: OrganisationType): string => {
  switch (type) {
    case OrganisationType.FUNCTIONAL:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case OrganisationType.DIVISIONAL:
      return 'bg-green-100 text-green-800 border-green-200'
    case OrganisationType.MATRIX:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case OrganisationType.NETWORK:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case OrganisationType.TEAM_BASED:
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case OrganisationType.PROJECT_BASED:
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getInformationTypeColor = (type: InformationType): string => {
  switch (type) {
    case InformationType.OPERATIONAL:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case InformationType.STRATEGIC:
      return 'bg-green-100 text-green-800 border-green-200'
    case InformationType.TACTICAL:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case InformationType.FINANCIAL:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case InformationType.TECHNICAL:
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case InformationType.REGULATORY:
      return 'bg-red-100 text-red-800 border-red-200'
    case InformationType.CUSTOMER:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case InformationType.SUPPLIER:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getManagementSystemTypeColor = (type: ManagementSystemType): string => {
  switch (type) {
    case ManagementSystemType.ERP:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case ManagementSystemType.CRM:
      return 'bg-green-100 text-green-800 border-green-200'
    case ManagementSystemType.SCM:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case ManagementSystemType.HRM:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case ManagementSystemType.FINANCE:
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case ManagementSystemType.QUALITY:
      return 'bg-red-100 text-red-800 border-red-200'
    case ManagementSystemType.SAFETY:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case ManagementSystemType.ENVIRONMENTAL:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case ManagementSystemType.ASSET:
      return 'bg-pink-100 text-pink-800 border-pink-200'
    case ManagementSystemType.PROJECT:
      return 'bg-teal-100 text-teal-800 border-teal-200'
    case ManagementSystemType.ANALYTICS:
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case ManagementSystemType.COLLABORATION:
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case RiskLevel.LOW:
      return 'bg-green-100 text-green-800 border-green-200'
    case RiskLevel.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case RiskLevel.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case RiskLevel.CRITICAL:
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getComplianceStatusColor = (status: ComplianceStatus): string => {
  switch (status) {
    case ComplianceStatus.COMPLIANT:
      return 'bg-green-100 text-green-800 border-green-200'
    case ComplianceStatus.PARTIALLY_COMPLIANT:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case ComplianceStatus.NON_COMPLIANT:
      return 'bg-red-100 text-red-800 border-red-200'
    case ComplianceStatus.UNDER_REVIEW:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case ComplianceStatus.NOT_APPLICABLE:
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getMaturityLevelColor = (level: MaturityLevel): string => {
  switch (level) {
    case MaturityLevel.INITIAL:
      return 'bg-red-100 text-red-800 border-red-200'
    case MaturityLevel.REPEATABLE:
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case MaturityLevel.DEFINED:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case MaturityLevel.MANAGED:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case MaturityLevel.OPTIMIZING:
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// ============================================================================
// ICON UTILITIES
// ============================================================================

export const getSupplierTypeIcon = (type: SupplierType) => {
  switch (type) {
    case SupplierType.MATERIAL_SUPPLIER:
      return Package
    case SupplierType.SERVICE_PROVIDER:
      return Users
    case SupplierType.TECHNOLOGY_PARTNER:
      return Monitor
    case SupplierType.LOGISTICS_PROVIDER:
      return Truck
    case SupplierType.CONSULTANT:
      return BookOpen
    case SupplierType.EQUIPMENT_SUPPLIER:
      return Settings
    case SupplierType.FINANCIAL_PARTNER:
      return DollarSign
    case SupplierType.REGULATORY_PARTNER:
      return Shield
    default:
      return Truck
  }
}

export const getLocationTypeIcon = (type: LocationType) => {
  switch (type) {
    case LocationType.HEADQUARTERS:
      return Building2
    case LocationType.PRODUCTION_FACILITY:
      return Factory
    case LocationType.WAREHOUSE:
      return Warehouse
    case LocationType.DISTRIBUTION_CENTER:
      return Truck
    case LocationType.OFFICE:
      return Building
    case LocationType.LABORATORY:
      return Settings
    case LocationType.WORKSHOP:
      return Settings
    case LocationType.FIELD_OFFICE:
      return MapPin
    case LocationType.REMOTE_SITE:
      return Globe
    default:
      return MapPin
  }
}

export const getValueChainTypeIcon = (type: ValueChainType) => {
  switch (type) {
    case ValueChainType.PRIMARY:
      return Target
    case ValueChainType.SUPPORT:
      return Shield
    case ValueChainType.ENABLING:
      return Zap
    case ValueChainType.CUSTOMER_FACING:
      return Users
    case ValueChainType.INTERNAL:
      return Settings
    default:
      return Workflow
  }
}

export const getOrganisationTypeIcon = (type: OrganisationType) => {
  switch (type) {
    case OrganisationType.FUNCTIONAL:
      return Users
    case OrganisationType.DIVISIONAL:
      return Network
    case OrganisationType.MATRIX:
      return Grid3X3
    case OrganisationType.NETWORK:
      return NetworkIcon
    case OrganisationType.TEAM_BASED:
      return Users
    case OrganisationType.PROJECT_BASED:
      return TargetIcon
    default:
      return Users
  }
}

export const getInformationTypeIcon = (type: InformationType) => {
  switch (type) {
    case InformationType.OPERATIONAL:
      return Activity
    case InformationType.STRATEGIC:
      return Target
    case InformationType.TACTICAL:
      return BarChart3
    case InformationType.FINANCIAL:
      return DollarSign
    case InformationType.TECHNICAL:
      return Settings
    case InformationType.REGULATORY:
      return Shield
    case InformationType.CUSTOMER:
      return Users
    case InformationType.SUPPLIER:
      return Truck
    default:
      return Database
  }
}

export const getManagementSystemTypeIcon = (type: ManagementSystemType) => {
  switch (type) {
    case ManagementSystemType.ERP:
      return Layers
    case ManagementSystemType.CRM:
      return Users
    case ManagementSystemType.SCM:
      return Truck
    case ManagementSystemType.HRM:
      return Users
    case ManagementSystemType.FINANCE:
      return DollarSign
    case ManagementSystemType.QUALITY:
      return CheckCircle
    case ManagementSystemType.SAFETY:
      return Shield
    case ManagementSystemType.ENVIRONMENTAL:
      return Leaf
    case ManagementSystemType.ASSET:
      return Package
    case ManagementSystemType.PROJECT:
      return Target
    case ManagementSystemType.ANALYTICS:
      return BarChart3
    case ManagementSystemType.COLLABORATION:
      return Network
    default:
      return Monitor
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const calculateOperatingModelCompleteness = (operatingModel: OperatingModel): number => {
  const sections = [
    operatingModel.suppliers.length,
    operatingModel.locations.length,
    operatingModel.valueChains.length,
    operatingModel.organisation.length,
    operatingModel.information.length,
    operatingModel.managementSystems.length
  ]
  
  const totalItems = sections.reduce((sum, count) => sum + count, 0)
  const maxItemsPerSection = 5 // Assume 5 items per section is "complete"
  const maxTotalItems = sections.length * maxItemsPerSection
  
  return Math.min(Math.round((totalItems / maxTotalItems) * 100), 100)
}

export const getSectionCount = (operatingModel: OperatingModel, section: keyof OperatingModel): number => {
  const items = operatingModel[section] as any[]
  return items ? items.length : 0
}

export const validateOperatingModel = (operatingModel: OperatingModel): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!operatingModel.name.trim()) {
    errors.push('Operating model name is required')
  }
  
  if (operatingModel.suppliers.length === 0) {
    errors.push('At least one supplier is required')
  }
  
  if (operatingModel.locations.length === 0) {
    errors.push('At least one location is required')
  }
  
  if (operatingModel.valueChains.length === 0) {
    errors.push('At least one value chain is required')
  }
  
  if (operatingModel.organisation.length === 0) {
    errors.push('At least one organisational unit is required')
  }
  
  if (operatingModel.information.length === 0) {
    errors.push('At least one information type is required')
  }
  
  if (operatingModel.managementSystems.length === 0) {
    errors.push('At least one management system is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const exportOperatingModel = (operatingModel: OperatingModel): string => {
  return JSON.stringify(operatingModel, null, 2)
}

// ============================================================================
// BMC INTEGRATION UTILITIES
// ============================================================================

// BMC Context Interface
interface BMCContext {
  valuePropositions: any[]
  customerSegments: any[]
  channels: any[]
  customerRelationships: any[]
  keyActivities: any[]
  keyResources: any[]
  keyPartners: any[]
  costStructure: any[]
  revenueStreams: any[]
}

/**
 * Get BMC context for a business canvas
 */
export const getBMCContext = (businessCanvasId?: string): BMCContext | null => {
  if (!businessCanvasId) return null
  
  // TODO: Implement actual API call to get BMC data
  // For now, return mock data
  return {
    valuePropositions: [
      { id: 'vp1', description: 'Low-cost, high-purity extraction for bulk clients' }
    ],
    customerSegments: [
      { id: 'cs1', name: 'Industrial buyers', description: 'Large industrial customers' },
      { id: 'cs2', name: 'Export markets', description: 'International markets' }
    ],
    channels: [
      { id: 'ch1', type: 'Direct export', description: 'Direct export channels' },
      { id: 'ch2', type: 'Government liaison', description: 'Government relations' }
    ],
    customerRelationships: [
      { id: 'cr1', type: 'Long-term contracts', description: 'Strategic partnerships' }
    ],
    keyActivities: [
      { id: 'ka1', name: 'Leaching', description: 'Chemical leaching process' },
      { id: 'ka2', name: 'Processing', description: 'Material processing' },
      { id: 'ka3', name: 'Quality Assurance', description: 'QA processes' }
    ],
    keyResources: [
      { id: 'kr1', name: 'Processing facilities', type: 'PHYSICAL' },
      { id: 'kr2', name: 'Technical expertise', type: 'INTELLECTUAL' }
    ],
    keyPartners: [
      { id: 'kp1', name: 'Equipment suppliers', type: 'Strategic' },
      { id: 'kp2', name: 'Logistics providers', type: 'Operational' }
    ],
    costStructure: [
      { id: 'cs1', description: 'Energy inputs', amount: 1000000 },
      { id: 'cs2', description: 'Regulatory compliance', amount: 500000 }
    ],
    revenueStreams: [
      { id: 'rs1', type: 'Product sales', estimatedValue: 5000000 }
    ]
  }
}

/**
 * Calculate BMC integration score
 */
export const calculateBMCIntegrationScore = (operatingModel: OperatingModel, bmcContext: BMCContext | null): number => {
  if (!bmcContext) return 0
  
  let totalItems = 0
  let integratedItems = 0
  
  // Check suppliers (from key partners)
  totalItems += bmcContext.keyPartners.length
  integratedItems += operatingModel.suppliers.filter(s => s.businessCanvasPartnershipId).length
  
  // Check value chains (from key activities and value propositions)
  totalItems += bmcContext.keyActivities.length + bmcContext.valuePropositions.length
  integratedItems += operatingModel.valueChains.filter(vc => 
    vc.businessCanvasActivityIds.length > 0 || vc.businessCanvasResourceIds.length > 0
  ).length
  
  // Check organisation (from key resources and customer segments)
  totalItems += bmcContext.keyResources.length + bmcContext.customerSegments.length
  integratedItems += operatingModel.organisation.filter(org => 
    org.businessCanvasResourceIds.length > 0 || org.businessCanvasActivityIds.length > 0
  ).length
  
  // Check information (from key resources and channels)
  totalItems += bmcContext.keyResources.length + bmcContext.channels.length
  integratedItems += operatingModel.information.filter(info => 
    info.businessCanvasResourceIds.length > 0 || info.businessCanvasActivityIds.length > 0
  ).length
  
  // Check management systems (from channels, cost structure, revenue streams)
  totalItems += bmcContext.channels.length + bmcContext.costStructure.length + bmcContext.revenueStreams.length
  integratedItems += operatingModel.managementSystems.filter(ms => 
    ms.businessCanvasResourceIds.length > 0 || ms.businessCanvasActivityIds.length > 0
  ).length
  
  return totalItems > 0 ? Math.round((integratedItems / totalItems) * 100) : 0
}

/**
 * Map BMC elements to OMC sections
 */
export const mapBMCToOMC = (bmcContext: BMCContext, operatingModel: OperatingModel) => {
  const mappedItems: Partial<OperatingModel> = {
    suppliers: operatingModel.suppliers.slice(),
    valueChains: operatingModel.valueChains.slice(),
    organisation: operatingModel.organisation.slice(),
    information: operatingModel.information.slice(),
    managementSystems: operatingModel.managementSystems.slice()
  }
  
  // Map key partners to suppliers
  bmcContext.keyPartners.forEach(partner => {
    const existingSupplier = mappedItems.suppliers?.find(s => s.name === partner.name)
    if (!existingSupplier) {
      mappedItems.suppliers?.push({
        id: generateId(),
        operatingModelId: operatingModel.id,
        name: partner.name,
        description: partner.type,
        supplierType: SupplierType.SERVICE_PROVIDER,
        category: 'Strategic Partner',
        criticality: 'HIGH' as any,
        performance: 'GOOD' as any,
        contractType: 'LONG_TERM' as any,
        riskLevel: RiskLevel.MEDIUM,
        complianceStatus: ComplianceStatus.COMPLIANT,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  })
  
  // Map key activities to value chains
  bmcContext.keyActivities.forEach(activity => {
    const existingValueChain = mappedItems.valueChains?.find(vc => vc.name === activity.name)
    if (!existingValueChain) {
      mappedItems.valueChains?.push({
        id: generateId(),
        operatingModelId: operatingModel.id,
        name: activity.name,
        description: activity.description,
        valueChainType: ValueChainType.PRIMARY,
        sequence: mappedItems.valueChains?.length || 0,
        complexity: 'MODERATE' as any,
        riskLevel: RiskLevel.MEDIUM,
        status: 'ACTIVE' as any,
        activities: [],
        inputs: [],
        outputs: [],
        metrics: [],
        businessCanvasActivityIds: [activity.id],
        businessCanvasResourceIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  })
  
  // Map key resources to organisation
  bmcContext.keyResources.forEach(resource => {
    const existingOrg = mappedItems.organisation?.find(org => org.name === resource.name)
    if (!existingOrg) {
      mappedItems.organisation?.push({
        id: generateId(),
        operatingModelId: operatingModel.id,
        name: resource.name,
        description: `${resource.type} resource`,
        orgType: OrganisationType.FUNCTIONAL,
        level: 'OPERATIONAL' as any,
        responsibilities: ['Resource management'],
        skills: ['Technical expertise'],
        maturity: MaturityLevel.MANAGED,
        status: 'ACTIVE' as any,
        businessCanvasResourceIds: [resource.id],
        businessCanvasActivityIds: [],
        childOrgs: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  })
  
  // Map channels to information
  bmcContext.channels.forEach(channel => {
    const existingInfo = mappedItems.information?.find(info => info.name === channel.type)
    if (!existingInfo) {
      mappedItems.information?.push({
        id: generateId(),
        operatingModelId: operatingModel.id,
        name: channel.type,
        description: channel.description,
        infoType: InformationType.OPERATIONAL,
        category: 'Communication',
        source: 'Internal',
        format: 'Digital',
        frequency: 'REAL_TIME' as any,
        accessibility: 'INTERNAL' as any,
        security: 'STANDARD' as any,
        users: ['Operations'],
        systems: ['Communication systems'],
        businessCanvasResourceIds: [],
        businessCanvasActivityIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  })
  
  // Map cost structure and revenue streams to management systems
  const financialItems = bmcContext.costStructure.concat(bmcContext.revenueStreams)
  financialItems.forEach(item => {
    const existingMS = mappedItems.managementSystems?.find(ms => ms.name === item.description || item.type)
    if (!existingMS) {
      mappedItems.managementSystems?.push({
        id: generateId(),
        operatingModelId: operatingModel.id,
        name: item.description || item.type,
        description: 'Financial management system',
        systemType: ManagementSystemType.FINANCE,
        category: 'Financial',
        status: 'ACTIVE' as any,
        implementation: 'LIVE' as any,
        security: 'ENHANCED' as any,
        compliance: ComplianceStatus.COMPLIANT,
        integration: [],
        features: ['Financial tracking'],
        risks: [],
        businessCanvasResourceIds: [],
        businessCanvasActivityIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  })
  
  return mappedItems
}

// ============================================================================
// LINKING UTILITIES
// ============================================================================

export const linkSupplierToPartnership = (
  supplier: OperatingModelSupplier,
  partnershipId: string
): OperatingModelSupplier => {
  return {
    ...supplier,
    businessCanvasPartnershipId: partnershipId
  }
}

export const linkLocationToBMC = (
  location: OperatingModelLocation,
  resourceIds: string[],
  activityIds: string[]
): OperatingModelLocation => {
  return {
    ...location,
    businessCanvasResourceIds: resourceIds,
    businessCanvasActivityIds: activityIds
  }
}

export const linkValueChainToBMC = (
  valueChain: OperatingModelValueChain,
  activityIds: string[],
  resourceIds: string[]
): OperatingModelValueChain => {
  return {
    ...valueChain,
    businessCanvasActivityIds: activityIds,
    businessCanvasResourceIds: resourceIds
  }
}

export const linkOrganisationToBMC = (
  organisation: OperatingModelOrganisation,
  resourceIds: string[],
  activityIds: string[]
): OperatingModelOrganisation => {
  return {
    ...organisation,
    businessCanvasResourceIds: resourceIds,
    businessCanvasActivityIds: activityIds
  }
}

export const linkInformationToBMC = (
  information: OperatingModelInformation,
  resourceIds: string[],
  activityIds: string[]
): OperatingModelInformation => {
  return {
    ...information,
    businessCanvasResourceIds: resourceIds,
    businessCanvasActivityIds: activityIds
  }
}

export const linkManagementSystemToBMC = (
  managementSystem: OperatingModelManagementSystem,
  resourceIds: string[],
  activityIds: string[]
): OperatingModelManagementSystem => {
  return {
    ...managementSystem,
    businessCanvasResourceIds: resourceIds,
    businessCanvasActivityIds: activityIds
  }
}

// ============================================================================
// TREE VIEW UTILITIES
// ============================================================================

export const buildOperatingModelTree = (operatingModel: OperatingModel) => {
  return {
    id: operatingModel.id,
    name: operatingModel.name,
    type: 'operating-model',
    children: [
      {
        id: 'suppliers',
        name: 'Suppliers',
        type: 'section',
        count: operatingModel.suppliers.length,
        children: operatingModel.suppliers.map(supplier => ({
          id: supplier.id,
          name: supplier.name,
          type: 'supplier',
          supplierType: supplier.supplierType,
          criticality: supplier.criticality
        }))
      },
      {
        id: 'locations',
        name: 'Locations',
        type: 'section',
        count: operatingModel.locations.length,
        children: operatingModel.locations.map(location => ({
          id: location.id,
          name: location.name,
          type: 'location',
          locationType: location.locationType,
          status: location.status
        }))
      },
      {
        id: 'value-chains',
        name: 'Value Chains',
        type: 'section',
        count: operatingModel.valueChains.length,
        children: operatingModel.valueChains.map(valueChain => ({
          id: valueChain.id,
          name: valueChain.name,
          type: 'value-chain',
          valueChainType: valueChain.valueChainType,
          complexity: valueChain.complexity,
          children: valueChain.activities.map(activity => ({
            id: activity.id,
            name: activity.name,
            type: 'activity',
            activityType: activity.activityType,
            sequence: activity.sequence
          }))
        }))
      },
      {
        id: 'organisation',
        name: 'Organisation',
        type: 'section',
        count: operatingModel.organisation.length,
        children: operatingModel.organisation.map(org => ({
          id: org.id,
          name: org.name,
          type: 'organisation',
          orgType: org.orgType,
          level: org.level
        }))
      },
      {
        id: 'information',
        name: 'Information',
        type: 'section',
        count: operatingModel.information.length,
        children: operatingModel.information.map(info => ({
          id: info.id,
          name: info.name,
          type: 'information',
          infoType: info.infoType,
          accessibility: info.accessibility
        }))
      },
      {
        id: 'management-systems',
        name: 'Management Systems',
        type: 'section',
        count: operatingModel.managementSystems.length,
        children: operatingModel.managementSystems.map(system => ({
          id: system.id,
          name: system.name,
          type: 'management-system',
          systemType: system.systemType,
          status: system.status
        }))
      }
    ]
  }
} 