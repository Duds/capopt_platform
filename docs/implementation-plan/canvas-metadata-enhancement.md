# Canvas Metadata Enhancement - Implementation Plan

## 🎯 **Implementation Overview**

This document outlines the step-by-step implementation plan for enhancing the CapOpt Platform's Business Canvas metadata framework based on the business analysis.

## 📋 **Phase 1: Database Schema Enhancement**

### **Step 1.1: Add New Enums to Prisma Schema**

#### **New Enums Required**
```prisma
enum RiskProfile {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum DigitalMaturityLevel {
  BASIC
  INTERMEDIATE
  ADVANCED
  LEADING
}

enum BusinessType {
  CORPORATION
  PARTNERSHIP
  SOLE_TRADER
  TRUST
  JOINT_VENTURE
  SUBSIDIARY
}

enum RegionalClassification {
  METROPOLITAN
  REGIONAL
  REMOTE
  RURAL
  COASTAL
  INLAND
}
```

### **Step 1.2: Enhance BusinessCanvas Model**

#### **New Fields to Add**
```prisma
model BusinessCanvas {
  // ... existing fields ...

  // Legal & Registration
  legalName        String?
  abn              String?
  acn              String?

  // Industry Classification
  industry         String?  // MANDATORY
  sector           String?
  businessType     BusinessType?

  // Geographic & Regional
  regional         RegionalClassification?
  primaryLocation  String?
  coordinates      String?

  // Facility & Operations
  facilityType     FacilityType?
  operationalStreams String[] // Array of operational streams

  // Strategic & Financial
  strategicObjective    String?
  valueProposition      String?
  competitiveAdvantage  String?
  annualRevenue         Decimal?
  employeeCount         Int?

  // Risk & Compliance
  riskProfile           RiskProfile?
  digitalMaturity       DigitalMaturityLevel?
  complianceRequirements String[]
  regulatoryFramework   String[]

  // ... existing relationships ...
}
```

### **Step 1.3: Create Framework Tables**

#### **Industry Operational Streams Table**
```prisma
model IndustryOperationalStreams {
  id                String   @id @default(cuid())
  industry          String
  sector            String
  operationalStreams Json     // Array of operational streams
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([industry, sector])
  @@map("industry_operational_streams")
}
```

#### **Industry Compliance Framework Table**
```prisma
model IndustryComplianceFramework {
  id                    String   @id @default(cuid())
  industry              String
  sector                String
  complianceRequirements Json     // Array of compliance requirements
  regulatoryFramework   Json     // Object with Federal, State, Industry arrays
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@unique([industry, sector])
  @@map("industry_compliance_frameworks")
}
```

## 📊 **Phase 2: Framework Data Population**

### **Step 2.1: Create Seed Data Scripts**

#### **Operational Streams Seed Data**
```typescript
// prisma/seed/frameworks/operational-streams.ts
export const operationalStreamsData = [
  {
    industry: "Mining",
    sector: "Coal Mining",
    operationalStreams: [
      "Open Cut Mining",
      "Underground Mining",
      "Coal Processing",
      "Transport & Logistics",
      "Environmental Management",
      "Safety & Health"
    ]
  },
  // ... more data
];
```

#### **Compliance Framework Seed Data**
```typescript
// prisma/seed/frameworks/compliance-framework.ts
export const complianceFrameworkData = [
  {
    industry: "Mining",
    sector: "Coal Mining",
    complianceRequirements: [
      "WHS Act 2011",
      "Mining Act 1992",
      "Environmental Protection Act",
      "Water Management Act",
      "Native Title Act",
      "Minerals Resources Act"
    ],
    regulatoryFramework: {
      Federal: [
        "Environment Protection and Biodiversity Conservation Act",
        "National Greenhouse and Energy Reporting Act"
      ],
      State: [
        "Mining and Quarrying Safety and Health Act",
        "Environmental Protection Act"
      ],
      Industry: [
        "ICMM Sustainable Development Framework",
        "ISO 14001 Environmental Management"
      ]
    }
  },
  // ... more data
];
```

### **Step 2.2: Update Existing Canvas Data**

#### **Migration Script for Existing Canvases**
```typescript
// scripts/migrate-existing-canvases.ts
export async function migrateExistingCanvases() {
  const canvases = await prisma.businessCanvas.findMany({
    include: {
      enterprise: true,
      facility: true,
      businessUnit: true
    }
  });

  for (const canvas of canvases) {
    await prisma.businessCanvas.update({
      where: { id: canvas.id },
      data: {
        // Inherit from enterprise
        legalName: canvas.enterprise?.legalName,
        industry: canvas.enterprise?.industry,
        sector: canvas.enterprise?.sector,
        
        // Inherit from facility
        facilityType: canvas.facility?.type,
        primaryLocation: canvas.facility?.location,
        
        // Set defaults
        businessType: 'CORPORATION',
        regional: 'METROPOLITAN',
        riskProfile: 'MEDIUM',
        digitalMaturity: 'BASIC',
        
        // Initialize arrays
        operationalStreams: [],
        complianceRequirements: [],
        regulatoryFramework: []
      }
    });
  }
}
```

## 🎨 **Phase 3: UI Enhancement**

### **Step 3.1: Update Create Canvas Modal**

#### **New Form Fields**
```typescript
// components/business-canvas/new-canvas-form.tsx
const formSchema = z.object({
  // Existing fields
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  
  // New mandatory fields
  industry: z.string().min(1, "Industry is required"),
  
  // New optional fields
  sector: z.string().optional(),
  businessType: z.enum(['CORPORATION', 'PARTNERSHIP', 'SOLE_TRADER', 'TRUST', 'JOINT_VENTURE', 'SUBSIDIARY']).optional(),
  regional: z.enum(['METROPOLITAN', 'REGIONAL', 'REMOTE', 'RURAL', 'COASTAL', 'INLAND']).optional(),
  facilityType: z.enum(['MINE', 'PROCESSING_PLANT', 'REFINERY', 'SMELTER', 'WAREHOUSE', 'OFFICE', 'LABORATORY', 'WORKSHOP', 'POWER_STATION', 'WATER_TREATMENT', 'WASTE_MANAGEMENT']).optional(),
  
  // Strategic fields
  strategicObjective: z.string().optional(),
  valueProposition: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  annualRevenue: z.number().optional(),
  employeeCount: z.number().optional(),
  
  // Risk & Compliance fields
  riskProfile: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  digitalMaturity: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'LEADING']).optional(),
});
```

#### **Dynamic Field Dependencies**
```typescript
// hooks/use-industry-framework.ts
export const useIndustryFramework = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  
  const sectors = useMemo(() => {
    return getSectorsForIndustry(selectedIndustry);
  }, [selectedIndustry]);
  
  const operationalStreams = useMemo(() => {
    return getOperationalStreamsForIndustrySector(selectedIndustry, selectedSector);
  }, [selectedIndustry, selectedSector]);
  
  const complianceRequirements = useMemo(() => {
    return getComplianceRequirementsForIndustrySector(selectedIndustry, selectedSector);
  }, [selectedIndustry, selectedSector]);
  
  return {
    selectedIndustry,
    setSelectedIndustry,
    selectedSector,
    setSelectedSector,
    sectors,
    operationalStreams,
    complianceRequirements
  };
};
```

### **Step 3.2: Update Edit Canvas Modal**

#### **Validation Rules**
```typescript
// components/business-canvas/edit-canvas-form.tsx
const editFormSchema = z.object({
  // Industry cannot be changed after creation
  industry: z.string().min(1, "Industry is required"),
  
  // Other fields can be edited
  sector: z.string().optional(),
  businessType: z.enum(['CORPORATION', 'PARTNERSHIP', 'SOLE_TRADER', 'TRUST', 'JOINT_VENTURE', 'SUBSIDIARY']).optional(),
  // ... other fields
});

// Validation function
const validateForm = (data: any) => {
  const errors: string[] = [];
  
  // Mandatory field validation
  if (!data.industry) {
    errors.push("Industry is mandatory and cannot be empty");
  }
  
  // Dependency validation
  if (data.sector && !isValidSectorForIndustry(data.sector, data.industry)) {
    errors.push(`Sector "${data.sector}" is not valid for industry "${data.industry}"`);
  }
  
  if (data.operationalStreams && !isValidOperationalStreamsForIndustrySector(data.operationalStreams, data.industry, data.sector)) {
    errors.push("Selected operational streams are not valid for the chosen industry and sector");
  }
  
  return errors;
};
```

### **Step 3.3: Implement Inheritance Display**

#### **Inheritance Component**
```typescript
// components/business-canvas/inheritance-display.tsx
export const InheritanceDisplay = ({ canvas }: { canvas: BusinessCanvas }) => {
  const inheritedFields = useMemo(() => {
    return {
      legalName: canvas.enterprise?.legalName,
      industry: canvas.enterprise?.industry,
      primaryLocation: canvas.facility?.location,
      // ... other inherited fields
    };
  }, [canvas]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inherited Information</h3>
      {Object.entries(inheritedFields).map(([field, value]) => (
        <div key={field} className="flex items-center space-x-2">
          <Badge variant="secondary">Inherited</Badge>
          <span className="font-medium">{field}:</span>
          <span>{value || 'Not available'}</span>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 **Phase 4: API Enhancement**

### **Step 4.1: Update Canvas API Endpoints**

#### **Enhanced GET Endpoint**
```typescript
// app/api/business-canvas/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const businessCanvas = await prisma.businessCanvas.findUnique({
      where: { id },
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true,
        // ... existing includes
      }
    });
    
    if (!businessCanvas) {
      return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
    }
    
    // Enrich with framework data
    const enrichedCanvas = await enrichCanvasWithFrameworkData(businessCanvas);
    
    return NextResponse.json(enrichedCanvas);
  } catch (error) {
    console.error('Error fetching canvas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### **Enhanced PUT Endpoint**
```typescript
// app/api/business-canvas/[id]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the update data
    const validationErrors = validateCanvasUpdate(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    // Update the canvas
    const updatedCanvas = await prisma.businessCanvas.update({
      where: { id },
      data: {
        // ... update fields
        industry: body.industry,
        sector: body.sector,
        businessType: body.businessType,
        regional: body.regional,
        facilityType: body.facilityType,
        operationalStreams: body.operationalStreams,
        strategicObjective: body.strategicObjective,
        valueProposition: body.valueProposition,
        competitiveAdvantage: body.competitiveAdvantage,
        annualRevenue: body.annualRevenue ? new Decimal(body.annualRevenue) : null,
        employeeCount: body.employeeCount,
        riskProfile: body.riskProfile,
        digitalMaturity: body.digitalMaturity,
        complianceRequirements: body.complianceRequirements,
        regulatoryFramework: body.regulatoryFramework,
        updatedAt: new Date()
      },
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    });
    
    // Enrich with framework data
    const enrichedCanvas = await enrichCanvasWithFrameworkData(updatedCanvas);
    
    return NextResponse.json(enrichedCanvas);
  } catch (error) {
    console.error('Error updating canvas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### **Step 4.2: Create Framework API Endpoints**

#### **Industry Framework Endpoint**
```typescript
// app/api/frameworks/industry/[industry]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ industry: string }> }
) {
  try {
    const { industry } = await params;
    
    const [operationalStreams, complianceFramework] = await Promise.all([
      prisma.industryOperationalStreams.findMany({
        where: { industry, isActive: true }
      }),
      prisma.industryComplianceFramework.findMany({
        where: { industry, isActive: true }
      })
    ]);
    
    return NextResponse.json({
      industry,
      operationalStreams,
      complianceFramework
    });
  } catch (error) {
    console.error('Error fetching industry framework:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 🧪 **Phase 5: Testing & Validation**

### **Step 5.1: Unit Tests**

#### **Validation Tests**
```typescript
// __tests__/validation/canvas-metadata.test.ts
describe('Canvas Metadata Validation', () => {
  test('should validate mandatory industry field', () => {
    const data = { name: 'Test Canvas' };
    const errors = validateCanvasData(data);
    expect(errors).toContain('Industry is mandatory');
  });
  
  test('should validate sector for industry', () => {
    const data = { 
      name: 'Test Canvas', 
      industry: 'Mining', 
      sector: 'Invalid Sector' 
    };
    const errors = validateCanvasData(data);
    expect(errors).toContain('Sector "Invalid Sector" is not valid for industry "Mining"');
  });
  
  test('should validate operational streams', () => {
    const data = {
      name: 'Test Canvas',
      industry: 'Mining',
      sector: 'Coal Mining',
      operationalStreams: ['Invalid Stream']
    };
    const errors = validateCanvasData(data);
    expect(errors).toContain('Selected operational streams are not valid');
  });
});
```

### **Step 5.2: Integration Tests**

#### **API Endpoint Tests**
```typescript
// __tests__/api/canvas-metadata.test.ts
describe('Canvas Metadata API', () => {
  test('should create canvas with valid metadata', async () => {
    const response = await request(app)
      .post('/api/business-canvas')
      .send({
        name: 'Test Canvas',
        industry: 'Mining',
        sector: 'Coal Mining',
        operationalStreams: ['Open Cut Mining', 'Coal Processing']
      });
    
    expect(response.status).toBe(201);
    expect(response.body.industry).toBe('Mining');
    expect(response.body.operationalStreams).toContain('Open Cut Mining');
  });
  
  test('should reject canvas with invalid sector', async () => {
    const response = await request(app)
      .post('/api/business-canvas')
      .send({
        name: 'Test Canvas',
        industry: 'Mining',
        sector: 'Invalid Sector'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });
});
```

## 🚀 **Phase 6: Deployment & Monitoring**

### **Step 6.1: Database Migration**

#### **Migration Script**
```bash
# Generate migration
npx prisma migrate dev --name enhance_canvas_metadata

# Apply migration
npx prisma migrate deploy

# Seed framework data
npm run seed:frameworks

# Migrate existing canvases
npm run migrate:existing-canvases
```

### **Step 6.2: Monitoring & Alerts**

#### **Key Metrics to Monitor**
- Canvas creation success rate
- Validation error rates
- Framework lookup performance
- User satisfaction with new fields
- Data completeness rates

#### **Alert Conditions**
- Validation error rate > 5%
- Framework lookup response time > 200ms
- Canvas creation failure rate > 2%
- Data migration completion status

## 📈 **Success Criteria**

### **Technical Success**
- [ ] All new database fields added and migrated
- [ ] Framework data populated and validated
- [ ] API endpoints updated and tested
- [ ] UI components enhanced and functional
- [ ] Validation rules implemented and working

### **Business Success**
- [ ] 100% of existing canvases have mandatory fields populated
- [ ] 95% accuracy in industry-sector-streams mapping
- [ ] < 30 seconds average canvas creation time
- [ ] < 5% validation error rate
- [ ] 90% user satisfaction with new metadata fields

### **Quality Assurance**
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Accessibility compliance verified

## 🔄 **Rollback Plan**

### **Database Rollback**
```bash
# Revert migration
npx prisma migrate reset

# Restore from backup
pg_restore -d capopt_platform backup_$(date -d '1 day ago' +%Y%m%d).sql
```

### **Code Rollback**
```bash
# Revert to previous commit
git revert HEAD

# Deploy previous version
npm run deploy:previous
```

---

*This implementation plan provides a comprehensive roadmap for enhancing the canvas metadata framework while ensuring data quality, user experience, and system reliability.* 