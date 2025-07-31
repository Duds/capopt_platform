/**
 * Mining Sector Framework Configuration
 * 
 * Comprehensive sector classification system for mining operations
 * Supports multiple sector types: commodity-based, value chain, business model, and support services
 */

export interface SectorDefinition {
  name: string
  description: string
  subSectors?: string[]
  operationalStreams: string[]
  complianceRequirements: string[]
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: 'COMMODITY' | 'VALUE_CHAIN' | 'BUSINESS_MODEL' | 'SUPPORT_SERVICES'
}

export interface SectorSelection {
  sectorCode: string
  sectorType: 'COMMODITY' | 'VALUE_CHAIN' | 'BUSINESS_MODEL' | 'SUPPORT_SERVICES'
  isPrimary: boolean
}

// Commodity-Based Sectors
export const COMMODITY_SECTORS: Record<string, SectorDefinition> = {
  COAL: {
    name: 'Coal',
    description: 'Thermal coal (energy generation) and metallurgical coal (steelmaking)',
    subSectors: ['THERMAL_COAL', 'METALLURGICAL_COAL', 'COKING_COAL', 'ANTHRACITE'],
    operationalStreams: ['OPEN_CUT_MINING', 'UNDERGROUND_MINING', 'COAL_PROCESSING', 'WASHING', 'TRANSPORT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT', 'WATER_MANAGEMENT_ACT'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  },
  IRON_ORE: {
    name: 'Iron Ore',
    description: 'Major input for steel production',
    subSectors: ['HEMATITE', 'MAGNETITE', 'DIRECT_SHIPPING_ORE', 'PELLET_FEED'],
    operationalStreams: ['OPEN_PIT_MINING', 'CRUSHING', 'SCREENING', 'BENEFICIATION', 'PELLETIZING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  },
  PRECIOUS_METALS: {
    name: 'Precious Metals',
    description: 'Gold, silver, platinum group metals (PGMs)',
    subSectors: ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'RHODIUM', 'RUTHENIUM'],
    operationalStreams: ['UNDERGROUND_MINING', 'OPEN_PIT_MINING', 'REFINING', 'SECURITY_TRANSPORT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'SECURITY_LEGISLATION', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  },
  BASE_METALS: {
    name: 'Base Metals',
    description: 'Copper, zinc, lead, nickel – used in construction, electronics, etc.',
    subSectors: ['COPPER', 'ZINC', 'LEAD', 'NICKEL', 'ALUMINUM', 'TIN'],
    operationalStreams: ['OPEN_PIT_MINING', 'UNDERGROUND_MINING', 'SMELTING', 'REFINING', 'TAILINGS_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  },
  BATTERY_MINERALS: {
    name: 'Battery Minerals',
    description: 'Lithium, cobalt, graphite, manganese – critical for energy storage and EVs',
    subSectors: ['LITHIUM', 'COBALT', 'GRAPHITE', 'MANGANESE', 'NICKEL_SULFATE', 'VANADIUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'SOLAR_EVAPORATION', 'CHEMICAL_PROCESSING', 'REFINING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'CHEMICAL_CONTROL_ACT', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  },
  INDUSTRIAL_MINERALS: {
    name: 'Industrial Minerals',
    description: 'Bauxite, phosphate, potash, salt, silica – used in construction, agriculture, chemicals',
    subSectors: ['BAUXITE', 'PHOSPHATE', 'POTASH', 'SALT', 'SILICA', 'LIMESTONE', 'GYPSUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'PROCESSING', 'GRINDING', 'CLASSIFICATION'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'MEDIUM',
    category: 'COMMODITY'
  },
  RARE_EARTH_ELEMENTS: {
    name: 'Rare Earth Elements (REEs)',
    description: 'Used in high-tech applications: magnets, wind turbines, electronics',
    subSectors: ['LIGHT_REES', 'HEAVY_REES', 'NEODYMIUM', 'PRASEODYMIUM', 'DYSPROSIUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'CHEMICAL_PROCESSING', 'SOLVENT_EXTRACTION', 'REFINING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'CHEMICAL_CONTROL_ACT', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  },
  URANIUM: {
    name: 'Uranium',
    description: 'For nuclear energy production',
    subSectors: ['URANIUM_OXIDE', 'URANIUM_HEXAFLOURIDE', 'ENRICHED_URANIUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'UNDERGROUND_MINING', 'RADIATION_SAFETY', 'NUCLEAR_COMPLIANCE'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'NUCLEAR_NON_PROLIFERATION_TREATY', 'ARPANSA_ACT'],
    riskProfile: 'CRITICAL',
    category: 'COMMODITY'
  },
  GEMSTONES: {
    name: 'Gemstones',
    description: 'Diamonds, sapphires, emeralds, etc.',
    subSectors: ['DIAMONDS', 'SAPPHIRES', 'EMERALDS', 'RUBIES', 'OPALS'],
    operationalStreams: ['ALLUVIAL_MINING', 'UNDERGROUND_MINING', 'SORTING', 'CUTTING', 'POLISHING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'KIMBERLEY_PROCESS', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH',
    category: 'COMMODITY'
  }
}

// Value Chain Sectors
export const VALUE_CHAIN_SECTORS: Record<string, SectorDefinition> = {
  EXPLORATION: {
    name: 'Exploration',
    description: 'Geological surveys, drilling, and resource identification',
    operationalStreams: ['GEOLOGICAL_SURVEY', 'GEOPHYSICAL_SURVEY', 'DRILLING', 'SAMPLE_ANALYSIS', 'RESOURCE_MODELING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT', 'NATIVE_TITLE_ACT'],
    riskProfile: 'MEDIUM',
    category: 'VALUE_CHAIN'
  },
  DEVELOPMENT: {
    name: 'Development',
    description: 'Feasibility studies, environmental approvals, mine construction',
    operationalStreams: ['FEASIBILITY_STUDIES', 'ENVIRONMENTAL_APPROVALS', 'MINE_PLANNING', 'CONSTRUCTION', 'COMMISSIONING'],
    complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'PLANNING_ACT', 'NATIVE_TITLE_ACT'],
    riskProfile: 'HIGH',
    category: 'VALUE_CHAIN'
  },
  PRODUCTION: {
    name: 'Production (Operations)',
    description: 'Active extraction and processing of minerals',
    operationalStreams: ['MINING_OPERATIONS', 'PROCESSING', 'MAINTENANCE', 'LOGISTICS', 'QUALITY_CONTROL'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT', 'WATER_MANAGEMENT_ACT'],
    riskProfile: 'HIGH',
    category: 'VALUE_CHAIN'
  },
  PROCESSING: {
    name: 'Processing/Beneficiation',
    description: 'Crushing, milling, smelting, refining of raw ores',
    operationalStreams: ['CRUSHING', 'MILLING', 'FLOTATION', 'SMELTING', 'REFINING', 'TAILINGS_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'CHEMICAL_CONTROL_ACT', 'ENVIRONMENTAL_PROTECTION_ACT', 'WATER_MANAGEMENT_ACT'],
    riskProfile: 'HIGH',
    category: 'VALUE_CHAIN'
  },
  CLOSURE: {
    name: 'Closure & Rehabilitation',
    description: 'Decommissioning mines, environmental restoration, post-closure monitoring',
    operationalStreams: ['DECOMMISSIONING', 'ENVIRONMENTAL_RESTORATION', 'MONITORING', 'POST_CLOSURE_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'MINING_ACT_1992', 'CLOSURE_LEGISLATION'],
    riskProfile: 'MEDIUM',
    category: 'VALUE_CHAIN'
  }
}

// Business Model Sectors
export const BUSINESS_MODEL_SECTORS: Record<string, SectorDefinition> = {
  MAJOR_MINERS: {
    name: 'Major Mining Companies',
    description: 'Vertically integrated, global operators (e.g. BHP, Rio Tinto)',
    operationalStreams: ['INTEGRATED_OPERATIONS', 'GLOBAL_LOGISTICS', 'TECHNOLOGY_INNOVATION', 'SUSTAINABILITY_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'CORPORATE_GOVERNANCE', 'INTERNATIONAL_STANDARDS', 'SUSTAINABILITY_REPORTING'],
    riskProfile: 'HIGH',
    category: 'BUSINESS_MODEL'
  },
  JUNIOR_MINERS: {
    name: 'Junior Miners',
    description: 'Smaller, often exploration-focused or early-stage producers',
    operationalStreams: ['EXPLORATION', 'FEASIBILITY_STUDIES', 'SMALL_SCALE_PRODUCTION', 'PARTNERSHIP_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'FINANCIAL_REPORTING', 'CORPORATE_GOVERNANCE'],
    riskProfile: 'HIGH',
    category: 'BUSINESS_MODEL'
  },
  STATE_OWNED: {
    name: 'State-Owned Enterprises',
    description: 'Government-operated or majority-owned mining entities',
    operationalStreams: ['GOVERNMENT_RELATIONS', 'SOCIAL_LICENSE', 'INFRASTRUCTURE_DEVELOPMENT', 'COMMUNITY_ENGAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'GOVERNMENT_PROCUREMENT', 'PUBLIC_ACCOUNTABILITY', 'SOCIAL_OBLIGATIONS'],
    riskProfile: 'HIGH',
    category: 'BUSINESS_MODEL'
  },
  ARTISANAL_SMALL_SCALE: {
    name: 'Artisanal & Small-Scale Mining (ASM)',
    description: 'Informal or small-scale operations, often in developing regions',
    operationalStreams: ['MANUAL_MINING', 'BASIC_PROCESSING', 'LOCAL_MARKETING', 'COMMUNITY_COOPERATION'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'LABOR_STANDARDS', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'MEDIUM',
    category: 'BUSINESS_MODEL'
  }
}

// Support Services Sectors
export const SUPPORT_SERVICES_SECTORS: Record<string, SectorDefinition> = {
  METS: {
    name: 'Mining Equipment & Technology (METS)',
    description: 'OEMs, engineering firms, automation, and software providers',
    operationalStreams: ['EQUIPMENT_MANUFACTURING', 'ENGINEERING_SERVICES', 'AUTOMATION_SOLUTIONS', 'SOFTWARE_DEVELOPMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'QUALITY_STANDARDS', 'INTELLECTUAL_PROPERTY', 'EXPORT_CONTROLS'],
    riskProfile: 'MEDIUM',
    category: 'SUPPORT_SERVICES'
  },
  CONTRACT_MINING: {
    name: 'Contract Mining Services',
    description: 'Companies that provide drilling, blasting, hauling, or labour hire',
    operationalStreams: ['DRILLING_SERVICES', 'BLASTING_SERVICES', 'HAULAGE_SERVICES', 'LABOR_HIRE'],
    complianceRequirements: ['WHS_ACT_2011', 'CONTRACT_LAW', 'LABOR_STANDARDS', 'INSURANCE_REQUIREMENTS'],
    riskProfile: 'HIGH',
    category: 'SUPPORT_SERVICES'
  },
  ENVIRONMENTAL_SERVICES: {
    name: 'Environmental & Geotechnical Services',
    description: 'Monitoring, rehabilitation, impact assessments',
    operationalStreams: ['ENVIRONMENTAL_MONITORING', 'IMPACT_ASSESSMENTS', 'REHABILITATION', 'GEOTECHNICAL_ANALYSIS'],
    complianceRequirements: ['ENVIRONMENTAL_PROTECTION_ACT', 'SCIENTIFIC_STANDARDS', 'QUALITY_ASSURANCE'],
    riskProfile: 'MEDIUM',
    category: 'SUPPORT_SERVICES'
  },
  LOGISTICS_INFRASTRUCTURE: {
    name: 'Logistics & Export Infrastructure',
    description: 'Rail, ports, shipping, supply chain',
    operationalStreams: ['RAIL_TRANSPORT', 'PORT_OPERATIONS', 'SHIPPING', 'SUPPLY_CHAIN_MANAGEMENT'],
    complianceRequirements: ['TRANSPORT_SAFETY_ACT', 'CUSTOMS_REGULATIONS', 'INTERNATIONAL_TRADE_LAW'],
    riskProfile: 'MEDIUM',
    category: 'SUPPORT_SERVICES'
  }
}

// Combined sector definitions
export const ALL_SECTORS = {
  ...COMMODITY_SECTORS,
  ...VALUE_CHAIN_SECTORS,
  ...BUSINESS_MODEL_SECTORS,
  ...SUPPORT_SERVICES_SECTORS
}

// Sector validation rules
export const SECTOR_VALIDATION_RULES = {
  // Must have at least one commodity sector
  requireCommodity: (sectors: SectorSelection[]): string | null => {
    const hasCommodity = sectors.some(s => s.sectorType === 'COMMODITY')
    if (!hasCommodity) {
      return 'At least one commodity sector is required'
    }
    return null
  },

  // Cannot mix certain commodity types
  incompatibleCommodities: (sectors: SectorSelection[]): string | null => {
    const commoditySectors = sectors.filter(s => s.sectorType === 'COMMODITY')
    const hasUranium = commoditySectors.some(s => s.sectorCode === 'URANIUM')
    const hasGemstones = commoditySectors.some(s => s.sectorCode === 'GEMSTONES')
    
    if (hasUranium && hasGemstones) {
      return 'Uranium and gemstone operations are incompatible due to different regulatory and operational requirements'
    }
    
    return null
  },

  // Value chain sectors must align with commodity sectors
  valueChainAlignment: (sectors: SectorSelection[]): string | null => {
    const commoditySectors = sectors.filter(s => s.sectorType === 'COMMODITY')
    const valueChainSectors = sectors.filter(s => s.sectorType === 'VALUE_CHAIN')
    
    if (valueChainSectors.some(s => s.sectorCode === 'PRODUCTION') && commoditySectors.length === 0) {
      return 'Production operations require at least one commodity sector'
    }
    
    return null
  },

  // Support services cannot be primary sectors
  supportServicesNotPrimary: (sectors: SectorSelection[]): string | null => {
    const supportSectors = sectors.filter(s => s.sectorType === 'SUPPORT_SERVICES')
    const primarySupportSectors = supportSectors.filter(s => s.isPrimary)
    
    if (primarySupportSectors.length > 0) {
      return 'Support service sectors cannot be designated as primary sectors'
    }
    
    return null
  }
}

// Utility functions
export const getSectorData = (sectorCode: string, sectorType: string): SectorDefinition | undefined => {
  return ALL_SECTORS[sectorCode]
}

export const getSectorName = (sectorCode: string, sectorType: string): string => {
  const sector = getSectorData(sectorCode, sectorType)
  return sector?.name || sectorCode
}

export const generateOperationalStreams = (sectors: SectorSelection[]): string[] => {
  const streams = new Set<string>()
  
  sectors.forEach(sector => {
    const sectorData = getSectorData(sector.sectorCode, sector.sectorType)
    if (sectorData?.operationalStreams) {
      sectorData.operationalStreams.forEach(stream => streams.add(stream))
    }
  })
  
  return Array.from(streams)
}

export const generateComplianceRequirements = (sectors: SectorSelection[]): string[] => {
  const requirements = new Set<string>()
  
  sectors.forEach(sector => {
    const sectorData = getSectorData(sector.sectorCode, sector.sectorType)
    if (sectorData?.complianceRequirements) {
      sectorData.complianceRequirements.forEach(req => requirements.add(req))
    }
  })
  
  return Array.from(requirements)
}

export const validateSectorCombination = (sectors: SectorSelection[]): string[] => {
  const errors: string[] = []
  
  // Run all validation rules
  Object.values(SECTOR_VALIDATION_RULES).forEach(rule => {
    const error = rule(sectors)
    if (error) {
      errors.push(error)
    }
  })
  
  return errors
}

// Legacy sector mapping for backward compatibility
export const LEGACY_SECTOR_MAPPING: Record<string, string[]> = {
  'COPPER': ['BASE_METALS'],
  'GOLD': ['PRECIOUS_METALS'],
  'URANIUM': ['URANIUM'],
  'IRON_ORE': ['IRON_ORE'],
  'COAL': ['COAL'],
  'LITHIUM': ['BATTERY_MINERALS'],
  'RARE_EARTHS': ['RARE_EARTH_ELEMENTS']
} 