# Framework Hierarchy in CapOpt Platform

## Overview

The CapOpt Platform uses a multi-level framework hierarchy to provide industry-specific guidance, compliance structures, and operational standards. This hierarchy ensures that businesses can access relevant frameworks based on their industry, sectors, and specific operational needs.

## Framework Hierarchy Levels

### 🏭 **Level 1: Industry**
**Purpose**: Top-level classification that determines the overall framework context

**Examples**:
- Mining & Metals
- Oil & Gas
- Chemicals
- Manufacturing
- Construction
- Transportation
- Healthcare
- Financial Services
- Technology
- Defence
- Aerospace
- Maritime

**Function**:
- Defines the broad industry context
- Determines which sectors, operational streams, and compliance frameworks are available
- Sets the foundation for all lower-level framework selections

---

### 🎯 **Level 2: Sectors**
**Purpose**: Industry-specific business areas that determine operational requirements

**Categories**:
1. **COMMODITY** - What you extract/produce (e.g., COPPER, GOLD, SILVER, URANIUM)
2. **VALUE_CHAIN** - Where you are in the lifecycle (e.g., EXPLORATION, PRODUCTION, PROCESSING)
3. **BUSINESS_MODEL** - How you operate (e.g., MAJOR_MINER, JUNIOR_MINER, CONTRACT_MINING)
4. **SUPPORT_SERVICES** - Supporting functions (e.g., METS, ENVIRONMENTAL, LOGISTICS)

**Function**:
- Determines which operational streams are relevant
- Influences compliance requirements
- Affects facility type recommendations
- Drives regulatory framework selection

---

### ⚙️ **Level 3: Operational Streams**
**Purpose**: Specific operational processes and activities

**Categories**:
- **EXTRACTION** - Mining, drilling, extraction processes
- **PROCESSING** - Material processing, refining, manufacturing
- **SAFETY** - Safety systems, procedures, monitoring
- **ENVIRONMENTAL** - Environmental management, monitoring, compliance
- **LOGISTICS** - Transportation, storage, distribution
- **QUALITY** - Quality control, testing, assurance
- **SECURITY** - Security systems, access control, monitoring
- **MAINTENANCE** - Equipment maintenance, facility upkeep

**Function**:
- Defines specific operational processes
- Determines skill requirements
- Influences risk assessments
- Guides compliance monitoring

---

### 🏗️ **Level 4: Facility Types**
**Purpose**: Physical infrastructure and facility requirements

**Categories**:
- **EXTRACTION** - Mines, wells, extraction sites
- **PROCESSING** - Plants, refineries, processing facilities
- **INFRASTRUCTURE** - Power stations, water treatment, waste management
- **SUPPORT** - Offices, laboratories, workshops, warehouses

**Function**:
- Defines physical infrastructure needs
- Determines facility-specific requirements
- Influences safety and compliance needs
- Guides operational planning

---

### 📋 **Level 5: Compliance Requirements**
**Purpose**: Regulatory and industry compliance obligations

**Categories**:
- **FEDERAL** - National laws and regulations
- **STATE** - State/territory specific requirements
- **INDUSTRY** - Industry-specific standards
- **INTERNATIONAL** - International treaties and agreements

**Examples**:
- WHS Act (Work Health and Safety)
- Environmental Protection Act
- Nuclear Safety Regulations
- Mining Safety Standards
- ISO Standards
- Industry Codes of Practice

**Function**:
- Defines legal and regulatory obligations
- Determines compliance monitoring requirements
- Influences risk management strategies
- Guides audit and inspection programs

---

### 📜 **Level 6: Regulatory Framework**
**Purpose**: Specific regulatory frameworks and standards

**Categories**:
- **FEDERAL** - Federal regulatory frameworks
- **STATE** - State regulatory frameworks
- **INDUSTRY** - Industry-specific frameworks
- **INTERNATIONAL** - International frameworks

**Examples**:
- ICMM (International Council on Mining and Metals)
- ISO 9001 (Quality Management)
- ISO 14001 (Environmental Management)
- OHSAS 18001 (Occupational Health and Safety)
- LBMA (London Bullion Market Association)

**Function**:
- Provides specific compliance frameworks
- Defines certification requirements
- Guides implementation strategies
- Supports audit and certification processes

---

## Framework Relationships

### 🔗 **Hierarchical Dependencies**

```
Industry
├── Sectors (COMMODITY, VALUE_CHAIN, BUSINESS_MODEL, SUPPORT_SERVICES)
│   ├── Operational Streams (EXTRACTION, PROCESSING, SAFETY, etc.)
│   ├── Facility Types (MINE, PROCESSING_PLANT, REFINERY, etc.)
│   ├── Compliance Requirements (WHS_ACT, ENVIRONMENTAL_PROTECTION, etc.)
│   └── Regulatory Framework (ICMM, ISO_9001, ISO_14001, etc.)
```

### 🔄 **Auto-Population Logic**

1. **Industry Selection** → Filters available sectors
2. **Sector Selection** → Auto-populates relevant operational streams
3. **Sector Selection** → Auto-populates applicable facility types
4. **Sector Selection** → Auto-populates compliance requirements
5. **Sector Selection** → Auto-populates regulatory frameworks

### 🎛️ **Manual Override Capability**

- Users can manually add/remove framework items
- Auto-applied items can be converted to manual
- Manual items can be converted to auto-applied
- Framework associations track the source (auto vs manual)

---

## Database Structure

### 📊 **Framework Association Models**

```sql
-- Business Canvas Framework Associations
BusinessCanvasOperationalStreams {
  id: String
  businessCanvasId: String
  operationalStreamId: String
  isAutoApplied: Boolean  // Tracks if auto-applied or manually added
  createdAt: DateTime
  updatedAt: DateTime
}

BusinessCanvasComplianceFrameworks {
  id: String
  businessCanvasId: String
  complianceFrameworkId: String
  isAutoApplied: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

BusinessCanvasFacilityTypes {
  id: String
  businessCanvasId: String
  facilityTypeId: String
  isAutoApplied: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 🔗 **Framework Source Models**

```sql
-- Industry Operational Streams
IndustryOperationalStreams {
  id: String
  industryId: String
  sector: String
  streamName: String
  category: String
  description: String
  isActive: Boolean
}

-- Industry Compliance Frameworks
IndustryComplianceFramework {
  id: String
  industryId: String
  sector: String
  frameworkName: String
  category: String
  complianceRequirements: Json
  regulatoryFramework: Json
  isActive: Boolean
}

-- Industry Facility Types
IndustryFacilityTypes {
  id: String
  industryId: String
  facilityTypeCode: String
  facilityTypeName: String
  category: String
  riskProfile: String
  isActive: Boolean
}
```

---

## Business Canvas Integration

### 🎯 **Framework Selection Process**

1. **User selects Industry** (e.g., "Mining & Metals")
2. **User selects Sectors** (e.g., "COPPER", "GOLD", "PRODUCTION")
3. **System auto-populates**:
   - Operational Streams relevant to selected sectors
   - Facility Types appropriate for industry/sectors
   - Compliance Requirements based on sectors
   - Regulatory Frameworks applicable to sectors
4. **User can manually**:
   - Add additional framework items
   - Remove auto-applied items
   - Modify framework selections

### 📈 **Framework Benefits**

1. **Industry-Specific Guidance**: Frameworks are tailored to specific industries
2. **Sector-Based Relevance**: Only relevant frameworks are suggested
3. **Compliance Assurance**: Ensures all necessary compliance requirements are covered
4. **Operational Efficiency**: Streamlines framework selection process
5. **Risk Management**: Comprehensive coverage of operational risks
6. **Audit Readiness**: Clear framework associations for audit purposes

---

## Example: Mining & Metals Industry

### 🏭 **Industry**: Mining & Metals

### 🎯 **Sectors**:
- **COMMODITY**: COPPER, GOLD, SILVER, URANIUM, IRON_ORE
- **VALUE_CHAIN**: EXPLORATION, DEVELOPMENT, PRODUCTION, PROCESSING, REFINING
- **BUSINESS_MODEL**: MAJOR_MINER, JUNIOR_MINER, CONTRACT_MINING
- **SUPPORT_SERVICES**: METS, ENVIRONMENTAL, LOGISTICS

### ⚙️ **Operational Streams** (Auto-populated based on sectors):
- Open Pit Mining, Underground Mining
- Ore Processing, Concentrate Production
- Smelting Operations, Refining Operations
- Safety Systems, Environmental Monitoring
- Tailings Management, Water Management

### 🏗️ **Facility Types** (Auto-populated based on sectors):
- Open Pit Mine, Underground Mine
- Processing Plant, Refinery, Smelter
- Power Station, Water Treatment Plant
- Warehouse, Office Complex, Laboratory

### 📋 **Compliance Requirements** (Auto-populated based on sectors):
- WHS Act, Environmental Protection
- Nuclear Safety (for uranium), Mining Safety
- Radiation Safety, Transport Security

### 📜 **Regulatory Framework** (Auto-populated based on sectors):
- ICMM, ISO 9001, ISO 14001
- OHSAS 18001, LBMA (for precious metals)

---

## Implementation Status

### ✅ **Completed**
- Industry and sector framework structure
- Database schema for framework associations
- Sector filtering by industry
- Basic framework auto-population logic

### 🔄 **In Progress**
- Enhanced auto-population based on sector selection
- Facility type multi-select implementation
- Framework management interface

### ⏳ **Planned**
- Advanced framework recommendation engine
- Framework compliance monitoring
- Framework audit and reporting tools

---

## Conclusion

The Framework hierarchy in CapOpt Platform provides a structured approach to industry-specific guidance and compliance. By organizing frameworks across six levels (Industry → Sectors → Operational Streams → Facility Types → Compliance Requirements → Regulatory Framework), the system ensures that businesses receive relevant, comprehensive, and up-to-date framework guidance tailored to their specific operational context.

This hierarchical approach supports:
- **Efficient Framework Selection**: Auto-population reduces manual effort
- **Comprehensive Coverage**: Ensures all relevant frameworks are considered
- **Compliance Assurance**: Systematic approach to regulatory compliance
- **Risk Management**: Integrated framework for operational risk management
- **Audit Readiness**: Clear framework associations and documentation 