# Canvas Metadata Framework - Business Analysis

## 📊 **Executive Summary**

This document provides a comprehensive business analysis for enhancing the CapOpt Platform's Business Canvas metadata framework. The analysis covers operational streams, compliance requirements, and regulatory frameworks in relation to business type, industry, and sector selections.

## 🎯 **Business Objectives**

1. **Enhanced Metadata Management**: Expand canvas metadata to include comprehensive business information
2. **Operational Stream Mapping**: Create direct relationships between business characteristics and operational streams
3. **Compliance Framework**: Establish industry-specific compliance and regulatory requirements
4. **Data Inheritance**: Implement parent-child metadata inheritance for hierarchical canvases
5. **Validation Framework**: Ensure data quality and completeness through mandatory field validation

## 📋 **Current State Analysis**

### **Existing Metadata Fields**
- `name` (String)
- `description` (String?)
- `version` (String)
- `status` (CanvasStatus)
- `enterpriseId` (String?)
- `facilityId` (String?)
- `businessUnitId` (String?)
- `parentCanvasId` (String?)

### **Existing Related Models**
- **Enterprise**: Contains industry, sector, legal name
- **Facility**: Contains type, location, status
- **BusinessUnit**: Contains type, manager, budget

## 🚀 **Proposed Enhancement**

### **New Metadata Fields for BusinessCanvas**

#### **Core Business Information**
```typescript
// Legal & Registration
legalName: String?           // Inherit from parent enterprise
abn: String?                 // Australian Business Number
acn: String?                 // Australian Company Number

// Industry Classification
industry: String?            // MANDATORY - Primary industry
sector: String?              // Industry sector
businessType: String?        // Type of business entity

// Geographic & Regional
regional: String?            // Regional classification
primaryLocation: String?     // Inherit from parent, validate with GEOApify
coordinates: String?         // GPS coordinates for validation

// Facility & Operations
facilityType: FacilityType?  // Type of facility
operationalStreams: String[] // Array of operational streams
```

#### **Strategic & Financial**
```typescript
// Strategic Information
strategicObjective: String?
valueProposition: String?
competitiveAdvantage: String?

// Financial Metrics
annualRevenue: Decimal?
employeeCount: Int?

// Risk & Compliance
riskProfile: RiskProfile?
complianceRequirements: String[]
regulatoryFramework: String[]
```

## 🔗 **Business Analysis: Operational Streams Framework**

### **Industry → Sector → Operational Streams Mapping**

#### **Mining Industry**
```typescript
Mining: {
  sectors: {
    "Coal Mining": {
      operationalStreams: [
        "Open Cut Mining",
        "Underground Mining", 
        "Coal Processing",
        "Transport & Logistics",
        "Environmental Management",
        "Safety & Health"
      ]
    },
    "Metals Mining": {
      operationalStreams: [
        "Open Pit Mining",
        "Underground Mining",
        "Ore Processing",
        "Metallurgical Operations",
        "Tailings Management",
        "Water Management"
      ]
    },
    "Precious Metals": {
      operationalStreams: [
        "Gold Mining",
        "Silver Mining",
        "Platinum Group Metals",
        "Refining Operations",
        "Security & Transport",
        "Environmental Compliance"
      ]
    },
    "Uranium Mining": {
      operationalStreams: [
        "Uranium Extraction",
        "Radiation Safety",
        "Nuclear Compliance",
        "Transport Security",
        "Environmental Monitoring",
        "Regulatory Reporting"
      ]
    }
  }
}
```

#### **Petrochemical Industry**
```typescript
Petrochemical: {
  sectors: {
    "Oil & Gas": {
      operationalStreams: [
        "Exploration",
        "Drilling Operations",
        "Production",
        "Refining",
        "Distribution",
        "Safety Management"
      ]
    },
    "Chemical Manufacturing": {
      operationalStreams: [
        "Chemical Processing",
        "Quality Control",
        "Hazardous Materials",
        "Environmental Control",
        "Safety Systems",
        "Waste Management"
      ]
    }
  }
}
```

#### **Defence Industry**
```typescript
Defence: {
  sectors: {
    "Aerospace": {
      operationalStreams: [
        "Aircraft Manufacturing",
        "Component Production",
        "Quality Assurance",
        "Security Clearance",
        "Export Controls",
        "Testing & Certification"
      ]
    },
    "Electronics": {
      operationalStreams: [
        "Electronic Manufacturing",
        "Software Development",
        "Cybersecurity",
        "Quality Control",
        "Security Protocols",
        "Compliance Management"
      ]
    }
  }
}
```

## 🛡️ **Business Analysis: Compliance & Regulatory Framework**

### **Industry → Compliance Requirements → Regulatory Framework Mapping**

#### **Mining Industry Compliance**
```typescript
Mining: {
  complianceRequirements: [
    "WHS Act 2011",
    "Mining Act 1992",
    "Environmental Protection Act",
    "Water Management Act",
    "Native Title Act",
    "Minerals Resources Act"
  ],
  regulatoryFramework: {
    "Federal": [
      "Environment Protection and Biodiversity Conservation Act",
      "National Greenhouse and Energy Reporting Act",
      "Offshore Petroleum and Greenhouse Gas Storage Act"
    ],
    "State": [
      "Mining and Quarrying Safety and Health Act",
      "Environmental Protection Act",
      "Water Act"
    ],
    "Industry": [
      "ICMM Sustainable Development Framework",
      "ISO 14001 Environmental Management",
      "OHSAS 18001 Occupational Health and Safety"
    ]
  }
}
```

#### **Petrochemical Industry Compliance**
```typescript
Petrochemical: {
  complianceRequirements: [
    "WHS Act 2011",
    "Dangerous Goods Act",
    "Environmental Protection Act",
    "Petroleum Act",
    "Chemical Control Act",
    "Transport Safety Act"
  ],
  regulatoryFramework: {
    "Federal": [
      "Environment Protection and Biodiversity Conservation Act",
      "National Greenhouse and Energy Reporting Act",
      "Offshore Petroleum and Greenhouse Gas Storage Act"
    ],
    "State": [
      "Petroleum Act",
      "Dangerous Goods Safety Act",
      "Environmental Protection Act"
    ],
    "Industry": [
      "API Standards",
      "ISO 14001 Environmental Management",
      "OHSAS 18001 Occupational Health and Safety"
    ]
  }
}
```

#### **Defence Industry Compliance**
```typescript
Defence: {
  complianceRequirements: [
    "Defence Trade Controls Act",
    "Customs Act",
    "Security of Critical Infrastructure Act",
    "Australian Security Intelligence Organisation Act",
    "Defence Export Controls",
    "International Traffic in Arms Regulations"
  ],
  regulatoryFramework: {
    "Federal": [
      "Defence Trade Controls Act",
      "Customs Act",
      "Security of Critical Infrastructure Act"
    ],
    "International": [
      "International Traffic in Arms Regulations (ITAR)",
      "Wassenaar Arrangement",
      "Missile Technology Control Regime"
    ],
    "Industry": [
      "AS9100 Aerospace Quality Management",
      "ISO 27001 Information Security",
      "NIST Cybersecurity Framework"
    ]
  }
}
```

## 🏗️ **Technical Implementation Strategy**

### **Option 1: Database-Driven Framework**
**Pros:**
- Dynamic updates without code changes
- Version control and audit trail
- Complex relationships and constraints
- Real-time validation

**Cons:**
- More complex implementation
- Database migration complexity
- Performance considerations for large datasets

### **Option 2: File-Based Framework**
**Pros:**
- Simple implementation
- Easy version control
- Fast loading
- No database complexity

**Cons:**
- Requires code deployment for updates
- Limited dynamic relationships
- No audit trail for changes

### **Recommended Approach: Hybrid Solution**

#### **Database Tables for Dynamic Data**
```sql
-- Industry-Sector-Streams mapping
CREATE TABLE industry_operational_streams (
  id UUID PRIMARY KEY,
  industry VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  operational_streams JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Compliance requirements mapping
CREATE TABLE industry_compliance_framework (
  id UUID PRIMARY KEY,
  industry VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  compliance_requirements JSONB NOT NULL,
  regulatory_framework JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Configuration Files for Static Data**
```typescript
// config/industry-frameworks.ts
export const INDUSTRY_FRAMEWORKS = {
  mining: {
    sectors: { /* ... */ },
    compliance: { /* ... */ }
  },
  petrochemical: {
    sectors: { /* ... */ },
    compliance: { /* ... */ }
  }
  // ...
};
```

## 📊 **Data Validation Framework**

### **Mandatory Field Validation**
```typescript
const MANDATORY_FIELDS = {
  create: ['industry', 'name'],
  edit: ['industry'], // Industry cannot be changed after creation
  inherit: ['legalName', 'primaryLocation'] // Inherit from parent
};

const VALIDATION_RULES = {
  industry: {
    required: true,
    enum: ['Mining', 'Petrochemical', 'Defence', 'Manufacturing', 'Construction']
  },
  sector: {
    required: true,
    dependsOn: 'industry',
    validate: (sector, industry) => validateSectorForIndustry(sector, industry)
  },
  operationalStreams: {
    required: true,
    dependsOn: ['industry', 'sector'],
    validate: (streams, industry, sector) => validateStreamsForIndustrySector(streams, industry, sector)
  }
};
```

### **Inheritance Rules**
```typescript
const INHERITANCE_RULES = {
  legalName: {
    source: 'parent.enterprise.legalName',
    override: true,
    validation: 'required'
  },
  primaryLocation: {
    source: 'parent.enterprise.addresses.primary',
    override: true,
    validation: 'geolocation'
  },
  industry: {
    source: 'parent.industry',
    override: false, // Cannot override industry
    validation: 'required'
  }
};
```

## 🎯 **Implementation Phases**

### **Phase 1: Database Schema Enhancement**
1. Add new fields to BusinessCanvas model
2. Create industry framework tables
3. Implement data migration for existing canvases
4. Add validation constraints

### **Phase 2: Framework Data Population**
1. Populate industry-sector-streams mapping
2. Populate compliance-regulatory framework
3. Create seed data for existing industries
4. Validate data integrity

### **Phase 3: UI Enhancement**
1. Update Create Canvas modal with new fields
2. Update Edit Canvas modal with validation
3. Implement inheritance display
4. Add field validation and error handling

### **Phase 4: Integration & Testing**
1. Integrate with existing canvas functionality
2. Test inheritance and validation
3. Performance testing
4. User acceptance testing

## 📈 **Success Metrics**

### **Data Quality**
- 100% of canvases have mandatory fields completed
- 95% accuracy in industry-sector-streams mapping
- Zero validation errors in production

### **User Experience**
- < 30 seconds to create new canvas
- < 15 seconds to edit existing canvas
- 90% user satisfaction with validation feedback

### **System Performance**
- < 100ms response time for framework lookups
- < 1 second for canvas creation/editing
- 99.9% uptime for validation services

## 🔄 **Maintenance & Updates**

### **Framework Updates**
- Quarterly review of industry mappings
- Annual compliance framework updates
- Real-time regulatory change monitoring
- Automated validation rule updates

### **Data Governance**
- Version control for all framework changes
- Audit trail for mapping modifications
- User access controls for framework management
- Regular data quality assessments

## 🚀 **Next Steps**

1. **Approval**: Get stakeholder approval for framework design
2. **Implementation**: Begin Phase 1 database schema enhancement
3. **Data Population**: Populate framework with industry data
4. **Testing**: Comprehensive testing of validation and inheritance
5. **Deployment**: Gradual rollout with monitoring

---

*This business analysis provides the foundation for implementing a comprehensive canvas metadata framework that ensures data quality, supports operational excellence, and maintains regulatory compliance across all industry sectors.* 