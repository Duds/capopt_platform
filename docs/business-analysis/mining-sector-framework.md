# Mining Sector Framework - Business Analysis

## 📊 **Executive Summary**

This document provides a comprehensive business analysis for implementing a multi-sector selection framework for mining operations in the CapOpt Platform. The analysis covers industry-standard sector classifications, implementation strategies, and technical considerations for supporting multiple sector selections.

## 🎯 **Business Objectives**

1. **Multi-Sector Support**: Enable users to select multiple sectors for comprehensive business classification
2. **Industry Standard Alignment**: Implement sector classifications recognized by mining industry bodies
3. **Flexible Classification**: Support different sector classification approaches (commodity-based, value chain, business model)
4. **Operational Stream Mapping**: Ensure operational streams align with selected sectors
5. **Compliance Framework**: Maintain compliance requirements based on sector combinations

## 📋 **Current State Analysis**

### **Existing Sector Implementation**
- Single sector selection per canvas
- Basic sector categories: COPPER, GOLD, URANIUM, IRON_ORE, COAL, LITHIUM, RARE_EARTHS
- Limited to commodity-based classification
- No support for value chain or business model sectors

### **Limitations Identified**
1. **Single Selection**: Cannot represent complex mining operations with multiple commodities
2. **Incomplete Coverage**: Missing many important mining sectors and sub-sectors
3. **No Value Chain Support**: Cannot represent different stages of mining operations
4. **Limited Business Model Support**: Cannot represent different ownership structures
5. **No Support Services**: Missing essential mining support and service sectors

## 🚀 **Proposed Enhancement**

### **Multi-Sector Classification Framework**

#### **1. Commodity-Based Sectors**
Primary classification by resource type being extracted:

```typescript
const COMMODITY_SECTORS = {
  COAL: {
    name: 'Coal',
    description: 'Thermal coal (energy generation) and metallurgical coal (steelmaking)',
    subSectors: ['THERMAL_COAL', 'METALLURGICAL_COAL', 'COKING_COAL', 'ANTHRACITE'],
    operationalStreams: ['OPEN_CUT_MINING', 'UNDERGROUND_MINING', 'COAL_PROCESSING', 'WASHING', 'TRANSPORT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT', 'WATER_MANAGEMENT_ACT'],
    riskProfile: 'HIGH'
  },
  IRON_ORE: {
    name: 'Iron Ore',
    description: 'Major input for steel production',
    subSectors: ['HEMATITE', 'MAGNETITE', 'DIRECT_SHIPPING_ORE', 'PELLET_FEED'],
    operationalStreams: ['OPEN_PIT_MINING', 'CRUSHING', 'SCREENING', 'BENEFICIATION', 'PELLETIZING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'HIGH'
  },
  PRECIOUS_METALS: {
    name: 'Precious Metals',
    description: 'Gold, silver, platinum group metals (PGMs)',
    subSectors: ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'RHODIUM', 'RUTHENIUM'],
    operationalStreams: ['UNDERGROUND_MINING', 'OPEN_PIT_MINING', 'REFINING', 'SECURITY_TRANSPORT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'SECURITY_LEGISLATION', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH'
  },
  BASE_METALS: {
    name: 'Base Metals',
    description: 'Copper, zinc, lead, nickel – used in construction, electronics, etc.',
    subSectors: ['COPPER', 'ZINC', 'LEAD', 'NICKEL', 'ALUMINUM', 'TIN'],
    operationalStreams: ['OPEN_PIT_MINING', 'UNDERGROUND_MINING', 'SMELTING', 'REFINING', 'TAILINGS_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'HIGH'
  },
  BATTERY_MINERALS: {
    name: 'Battery Minerals',
    description: 'Lithium, cobalt, graphite, manganese – critical for energy storage and EVs',
    subSectors: ['LITHIUM', 'COBALT', 'GRAPHITE', 'MANGANESE', 'NICKEL_SULFATE', 'VANADIUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'SOLAR_EVAPORATION', 'CHEMICAL_PROCESSING', 'REFINING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'CHEMICAL_CONTROL_ACT', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH'
  },
  INDUSTRIAL_MINERALS: {
    name: 'Industrial Minerals',
    description: 'Bauxite, phosphate, potash, salt, silica – used in construction, agriculture, chemicals',
    subSectors: ['BAUXITE', 'PHOSPHATE', 'POTASH', 'SALT', 'SILICA', 'LIMESTONE', 'GYPSUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'PROCESSING', 'GRINDING', 'CLASSIFICATION'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'MEDIUM'
  },
  RARE_EARTH_ELEMENTS: {
    name: 'Rare Earth Elements (REEs)',
    description: 'Used in high-tech applications: magnets, wind turbines, electronics',
    subSectors: ['LIGHT_REES', 'HEAVY_REES', 'NEODYMIUM', 'PRASEODYMIUM', 'DYSPROSIUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'CHEMICAL_PROCESSING', 'SOLVENT_EXTRACTION', 'REFINING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'CHEMICAL_CONTROL_ACT', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH'
  },
  URANIUM: {
    name: 'Uranium',
    description: 'For nuclear energy production',
    subSectors: ['URANIUM_OXIDE', 'URANIUM_HEXAFLOURIDE', 'ENRICHED_URANIUM'],
    operationalStreams: ['OPEN_PIT_MINING', 'UNDERGROUND_MINING', 'RADIATION_SAFETY', 'NUCLEAR_COMPLIANCE'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'NUCLEAR_NON_PROLIFERATION_TREATY', 'ARPANSA_ACT'],
    riskProfile: 'CRITICAL'
  },
  GEMSTONES: {
    name: 'Gemstones',
    description: 'Diamonds, sapphires, emeralds, etc.',
    subSectors: ['DIAMONDS', 'SAPPHIRES', 'EMERALDS', 'RUBIES', 'OPALS'],
    operationalStreams: ['ALLUVIAL_MINING', 'UNDERGROUND_MINING', 'SORTING', 'CUTTING', 'POLISHING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'KIMBERLEY_PROCESS', 'EXPORT_CONTROLS'],
    riskProfile: 'HIGH'
  }
}
```

#### **2. Value Chain Sectors**
Classification by stage in mining lifecycle:

```typescript
const VALUE_CHAIN_SECTORS = {
  EXPLORATION: {
    name: 'Exploration',
    description: 'Geological surveys, drilling, and resource identification',
    operationalStreams: ['GEOLOGICAL_SURVEY', 'GEOPHYSICAL_SURVEY', 'DRILLING', 'SAMPLE_ANALYSIS', 'RESOURCE_MODELING'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT', 'NATIVE_TITLE_ACT'],
    riskProfile: 'MEDIUM'
  },
  DEVELOPMENT: {
    name: 'Development',
    description: 'Feasibility studies, environmental approvals, mine construction',
    operationalStreams: ['FEASIBILITY_STUDIES', 'ENVIRONMENTAL_APPROVALS', 'MINE_PLANNING', 'CONSTRUCTION', 'COMMISSIONING'],
    complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'PLANNING_ACT', 'NATIVE_TITLE_ACT'],
    riskProfile: 'HIGH'
  },
  PRODUCTION: {
    name: 'Production (Operations)',
    description: 'Active extraction and processing of minerals',
    operationalStreams: ['MINING_OPERATIONS', 'PROCESSING', 'MAINTENANCE', 'LOGISTICS', 'QUALITY_CONTROL'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'ENVIRONMENTAL_PROTECTION_ACT', 'WATER_MANAGEMENT_ACT'],
    riskProfile: 'HIGH'
  },
  PROCESSING: {
    name: 'Processing/Beneficiation',
    description: 'Crushing, milling, smelting, refining of raw ores',
    operationalStreams: ['CRUSHING', 'MILLING', 'FLOTATION', 'SMELTING', 'REFINING', 'TAILINGS_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'CHEMICAL_CONTROL_ACT', 'ENVIRONMENTAL_PROTECTION_ACT', 'WATER_MANAGEMENT_ACT'],
    riskProfile: 'HIGH'
  },
  CLOSURE: {
    name: 'Closure & Rehabilitation',
    description: 'Decommissioning mines, environmental restoration, post-closure monitoring',
    operationalStreams: ['DECOMMISSIONING', 'ENVIRONMENTAL_RESTORATION', 'MONITORING', 'POST_CLOSURE_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'MINING_ACT_1992', 'CLOSURE_LEGISLATION'],
    riskProfile: 'MEDIUM'
  }
}
```

#### **3. Business Model Sectors**
Classification by ownership and operational structure:

```typescript
const BUSINESS_MODEL_SECTORS = {
  MAJOR_MINERS: {
    name: 'Major Mining Companies',
    description: 'Vertically integrated, global operators (e.g. BHP, Rio Tinto)',
    operationalStreams: ['INTEGRATED_OPERATIONS', 'GLOBAL_LOGISTICS', 'TECHNOLOGY_INNOVATION', 'SUSTAINABILITY_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'CORPORATE_GOVERNANCE', 'INTERNATIONAL_STANDARDS', 'SUSTAINABILITY_REPORTING'],
    riskProfile: 'HIGH'
  },
  JUNIOR_MINERS: {
    name: 'Junior Miners',
    description: 'Smaller, often exploration-focused or early-stage producers',
    operationalStreams: ['EXPLORATION', 'FEASIBILITY_STUDIES', 'SMALL_SCALE_PRODUCTION', 'PARTNERSHIP_MANAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'FINANCIAL_REPORTING', 'CORPORATE_GOVERNANCE'],
    riskProfile: 'HIGH'
  },
  STATE_OWNED: {
    name: 'State-Owned Enterprises',
    description: 'Government-operated or majority-owned mining entities',
    operationalStreams: ['GOVERNMENT_RELATIONS', 'SOCIAL_LICENSE', 'INFRASTRUCTURE_DEVELOPMENT', 'COMMUNITY_ENGAGEMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'GOVERNMENT_PROCUREMENT', 'PUBLIC_ACCOUNTABILITY', 'SOCIAL_OBLIGATIONS'],
    riskProfile: 'HIGH'
  },
  ARTISANAL_SMALL_SCALE: {
    name: 'Artisanal & Small-Scale Mining (ASM)',
    description: 'Informal or small-scale operations, often in developing regions',
    operationalStreams: ['MANUAL_MINING', 'BASIC_PROCESSING', 'LOCAL_MARKETING', 'COMMUNITY_COOPERATION'],
    complianceRequirements: ['WHS_ACT_2011', 'MINING_ACT_1992', 'LABOR_STANDARDS', 'ENVIRONMENTAL_PROTECTION_ACT'],
    riskProfile: 'MEDIUM'
  }
}
```

#### **4. Support Services Sectors**
Essential services supporting mining operations:

```typescript
const SUPPORT_SERVICES_SECTORS = {
  METS: {
    name: 'Mining Equipment & Technology (METS)',
    description: 'OEMs, engineering firms, automation, and software providers',
    operationalStreams: ['EQUIPMENT_MANUFACTURING', 'ENGINEERING_SERVICES', 'AUTOMATION_SOLUTIONS', 'SOFTWARE_DEVELOPMENT'],
    complianceRequirements: ['WHS_ACT_2011', 'QUALITY_STANDARDS', 'INTELLECTUAL_PROPERTY', 'EXPORT_CONTROLS'],
    riskProfile: 'MEDIUM'
  },
  CONTRACT_MINING: {
    name: 'Contract Mining Services',
    description: 'Companies that provide drilling, blasting, hauling, or labour hire',
    operationalStreams: ['DRILLING_SERVICES', 'BLASTING_SERVICES', 'HAULAGE_SERVICES', 'LABOR_HIRE'],
    complianceRequirements: ['WHS_ACT_2011', 'CONTRACT_LAW', 'LABOR_STANDARDS', 'INSURANCE_REQUIREMENTS'],
    riskProfile: 'HIGH'
  },
  ENVIRONMENTAL_SERVICES: {
    name: 'Environmental & Geotechnical Services',
    description: 'Monitoring, rehabilitation, impact assessments',
    operationalStreams: ['ENVIRONMENTAL_MONITORING', 'IMPACT_ASSESSMENTS', 'REHABILITATION', 'GEOTECHNICAL_ANALYSIS'],
    complianceRequirements: ['ENVIRONMENTAL_PROTECTION_ACT', 'SCIENTIFIC_STANDARDS', 'QUALITY_ASSURANCE'],
    riskProfile: 'MEDIUM'
  },
  LOGISTICS_INFRASTRUCTURE: {
    name: 'Logistics & Export Infrastructure',
    description: 'Rail, ports, shipping, supply chain',
    operationalStreams: ['RAIL_TRANSPORT', 'PORT_OPERATIONS', 'SHIPPING', 'SUPPLY_CHAIN_MANAGEMENT'],
    complianceRequirements: ['TRANSPORT_SAFETY_ACT', 'CUSTOMS_REGULATIONS', 'INTERNATIONAL_TRADE_LAW'],
    riskProfile: 'MEDIUM'
  }
}
```

## 🏗️ **Technical Implementation Strategy**

### **Database Schema Enhancement**

#### **Option 1: Array-Based Storage**
```prisma
model BusinessCanvas {
  // ... existing fields ...
  
  // Multi-sector support
  sectors String[] // Array of sector codes
  sectorTypes String[] // Array of sector type classifications
  
  // ... existing relationships ...
}
```

#### **Option 2: Junction Table Approach**
```prisma
model BusinessCanvas {
  // ... existing fields ...
  
  // Relationships
  canvasSectors CanvasSector[]
  
  // ... existing relationships ...
}

model CanvasSector {
  id String @id @default(cuid())
  canvasId String
  sectorCode String
  sectorType String // 'COMMODITY', 'VALUE_CHAIN', 'BUSINESS_MODEL', 'SUPPORT_SERVICES'
  isPrimary Boolean @default(false)
  createdAt DateTime @default(now())
  
  canvas BusinessCanvas @relation(fields: [canvasId], references: [id], onDelete: Cascade)
  
  @@unique([canvasId, sectorCode, sectorType])
  @@map("canvas_sectors")
}
```

### **UI Component Enhancement**

#### **Multi-Select Sector Component**
```typescript
interface SectorSelection {
  sectorCode: string
  sectorType: 'COMMODITY' | 'VALUE_CHAIN' | 'BUSINESS_MODEL' | 'SUPPORT_SERVICES'
  isPrimary: boolean
}

const SectorMultiSelect = ({ 
  selectedSectors, 
  onSectorsChange 
}: {
  selectedSectors: SectorSelection[]
  onSectorsChange: (sectors: SectorSelection[]) => void
}) => {
  return (
    <div className="space-y-4">
      {/* Sector Type Tabs */}
      <Tabs defaultValue="commodity">
        <TabsList>
          <TabsTrigger value="commodity">Commodity-Based</TabsTrigger>
          <TabsTrigger value="value-chain">Value Chain</TabsTrigger>
          <TabsTrigger value="business-model">Business Model</TabsTrigger>
          <TabsTrigger value="support-services">Support Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="commodity">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(COMMODITY_SECTORS).map(([code, sector]) => (
              <div key={code} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedSectors.some(s => s.sectorCode === code)}
                  onCheckedChange={(checked) => handleSectorToggle(code, 'COMMODITY', checked)}
                />
                <Label>{sector.name}</Label>
                <Badge variant="outline">{sector.riskProfile}</Badge>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Similar content for other tabs */}
      </Tabs>
      
      {/* Selected Sectors Display */}
      <div className="space-y-2">
        <Label>Selected Sectors</Label>
        <div className="flex flex-wrap gap-2">
          {selectedSectors.map((sector) => (
            <Badge key={`${sector.sectorType}-${sector.sectorCode}`} variant="secondary">
              {getSectorName(sector.sectorCode, sector.sectorType)}
              {sector.isPrimary && <Star className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### **Validation Framework**

#### **Sector Combination Rules**
```typescript
const SECTOR_VALIDATION_RULES = {
  // Must have at least one commodity sector
  requireCommodity: (sectors: SectorSelection[]) => {
    return sectors.some(s => s.sectorType === 'COMMODITY')
  },
  
  // Cannot mix certain commodity types
  incompatibleCommodities: (sectors: SectorSelection[]) => {
    const commoditySectors = sectors.filter(s => s.sectorType === 'COMMODITY')
    const hasUranium = commoditySectors.some(s => s.sectorCode === 'URANIUM')
    const hasGemstones = commoditySectors.some(s => s.sectorCode === 'GEMSTONES')
    
    // Uranium and gemstones have very different operational requirements
    if (hasUranium && hasGemstones) {
      return 'Uranium and gemstone operations are incompatible due to different regulatory and operational requirements'
    }
    
    return null
  },
  
  // Value chain sectors must align with commodity sectors
  valueChainAlignment: (sectors: SectorSelection[]) => {
    const commoditySectors = sectors.filter(s => s.sectorType === 'COMMODITY')
    const valueChainSectors = sectors.filter(s => s.sectorType === 'VALUE_CHAIN')
    
    // If production is selected, must have at least one commodity
    if (valueChainSectors.some(s => s.sectorCode === 'PRODUCTION') && commoditySectors.length === 0) {
      return 'Production operations require at least one commodity sector'
    }
    
    return null
  },
  
  // Support services cannot be primary sectors
  supportServicesNotPrimary: (sectors: SectorSelection[]) => {
    const supportSectors = sectors.filter(s => s.sectorType === 'SUPPORT_SERVICES')
    const primarySupportSectors = supportSectors.filter(s => s.isPrimary)
    
    if (primarySupportSectors.length > 0) {
      return 'Support service sectors cannot be designated as primary sectors'
    }
    
    return null
  }
}
```

## 📊 **Operational Stream Mapping**

### **Dynamic Operational Stream Generation**
```typescript
const generateOperationalStreams = (sectors: SectorSelection[]): string[] => {
  const streams = new Set<string>()
  
  sectors.forEach(sector => {
    const sectorData = getSectorData(sector.sectorCode, sector.sectorType)
    if (sectorData?.operationalStreams) {
      sectorData.operationalStreams.forEach(stream => streams.add(stream))
    }
  })
  
  return Array.from(streams)
}

const generateComplianceRequirements = (sectors: SectorSelection[]): string[] => {
  const requirements = new Set<string>()
  
  sectors.forEach(sector => {
    const sectorData = getSectorData(sector.sectorCode, sector.sectorType)
    if (sectorData?.complianceRequirements) {
      sectorData.complianceRequirements.forEach(req => requirements.add(req))
    }
  })
  
  return Array.from(requirements)
}
```

## 🎯 **Implementation Phases**

### **Phase 1: Database Schema Update**
1. Add multi-sector support to BusinessCanvas model
2. Create sector framework data tables
3. Migrate existing single-sector data
4. Update API endpoints for multi-sector support

### **Phase 2: UI Component Development**
1. Create multi-select sector component
2. Implement sector type tabs and filtering
3. Add validation and error handling
4. Update form submission logic

### **Phase 3: Framework Data Population**
1. Populate commodity sectors with industry data
2. Add value chain sector definitions
3. Include business model sector classifications
4. Add support services sector data

### **Phase 4: Integration & Testing**
1. Update operational stream generation
2. Implement compliance requirement mapping
3. Test sector combination validation
4. Performance testing and optimization

## 📈 **Success Metrics**

### **Data Quality**
- 100% of new canvases have at least one commodity sector
- 95% accuracy in operational stream mapping
- Zero validation errors for sector combinations

### **User Experience**
- < 30 seconds to select multiple sectors
- < 5% user errors in sector selection
- 90% user satisfaction with sector options

### **System Performance**
- < 100ms response time for sector lookups
- < 1 second for operational stream generation
- 99.9% uptime for sector validation

## 🔄 **Maintenance & Updates**

### **Sector Framework Updates**
- Quarterly review of sector classifications
- Annual updates based on industry changes
- Real-time regulatory requirement updates
- User feedback integration

### **Data Governance**
- Version control for sector framework changes
- Audit trail for sector mapping modifications
- User access controls for framework management
- Regular data quality assessments

## 🚀 **Next Steps**

1. **Approval**: Get stakeholder approval for multi-sector framework design
2. **Implementation**: Begin Phase 1 database schema enhancement
3. **Data Population**: Populate framework with comprehensive sector data
4. **Testing**: Comprehensive testing of multi-sector functionality
5. **Deployment**: Gradual rollout with monitoring

---

*This business analysis provides the foundation for implementing a comprehensive multi-sector framework that supports the complex nature of modern mining operations while maintaining data quality and user experience standards.* 