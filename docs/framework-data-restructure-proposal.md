# Framework Data Restructure Proposal

## Executive Summary

The current framework data structure has significant duplication and tight coupling between industries and their specific elements. This proposal outlines a normalized approach that separates common elements from industry-specific relationships, enabling:

- **Elimination of duplication** across industries
- **Independent management** of common elements
- **Flexible industry-specific customization**
- **Improved data consistency** and maintenance
- **Better performance** through normalized relationships

## Current Issues

### 1. Duplication Problems
- **Facility Types**: "Open Pit Mine", "Refinery", "Laboratory" repeated across multiple industries
- **Operational Streams**: "Safety Systems", "Environmental Monitoring" duplicated
- **Compliance Requirements**: "WHS Act 2011", "Environmental Protection Act" repeated
- **Regulatory Frameworks**: ISO standards, federal laws duplicated

### 2. Maintenance Challenges
- Changes to common elements require updates across multiple industry tables
- Risk of data inconsistency when common elements diverge
- Difficult to add new industries without duplicating existing data

### 3. Performance Issues
- Large tables with repeated data
- Complex queries across multiple industry-specific tables
- Inefficient storage and retrieval

## Proposed Restructured Schema

### Core Master Tables (Common Elements)

```prisma
// Master table for all facility types
model FacilityType {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "OPEN_PIT_MINE", "REFINERY"
  name        String   // e.g., "Open Pit Mine", "Refinery"
  description String?
  category    String   // e.g., "EXTRACTION", "PROCESSING", "INFRASTRUCTURE", "SUPPORT"
  riskProfile String   @default("MEDIUM") // LOW, MEDIUM, HIGH, CRITICAL
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  industryAssociations IndustryFacilityTypeAssociation[]
  businessCanvasAssociations BusinessCanvasFacilityTypes[]

  @@map("facility_types")
}

// Master table for all operational streams
model OperationalStream {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "OPEN_PIT_MINING", "SAFETY_SYSTEMS"
  name        String   // e.g., "Open Pit Mining", "Safety Systems"
  description String?
  category    String   // e.g., "EXTRACTION", "PROCESSING", "SAFETY", "ENVIRONMENTAL"
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  industryAssociations IndustryOperationalStreamAssociation[]
  businessCanvasAssociations BusinessCanvasOperationalStreams[]

  @@map("operational_streams")
}

// Master table for all compliance requirements
model ComplianceRequirement {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "WHS_ACT_2011", "ENVIRONMENTAL_PROTECTION_ACT"
  name        String   // e.g., "WHS Act 2011", "Environmental Protection Act"
  description String?
  category    String   // e.g., "FEDERAL", "STATE", "INDUSTRY", "INTERNATIONAL"
  jurisdiction String  // e.g., "AUSTRALIA", "INTERNATIONAL"
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  frameworkAssociations ComplianceFrameworkRequirement[]
  industryAssociations IndustryComplianceRequirementAssociation[]

  @@map("compliance_requirements")
}

// Master table for all regulatory frameworks
model RegulatoryFramework {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "ISO_14001", "ICMM_FRAMEWORK"
  name        String   // e.g., "ISO 14001 Environmental Management", "ICMM Framework"
  description String?
  category    String   // e.g., "ISO", "INDUSTRY", "INTERNATIONAL"
  jurisdiction String  // e.g., "INTERNATIONAL", "AUSTRALIA"
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  frameworkAssociations ComplianceFrameworkRequirement[]
  industryAssociations IndustryRegulatoryFrameworkAssociation[]

  @@map("regulatory_frameworks")
}
```

### Association Tables (Industry-Specific Relationships)

```prisma
// Industry-Facility Type associations with customization
model IndustryFacilityTypeAssociation {
  id            String   @id @default(cuid())
  industryId    String
  facilityTypeId String
  isApplicable  Boolean  @default(true)
  riskProfile   String?  // Override default risk profile
  customName    String?  // Industry-specific name override
  customDescription String? // Industry-specific description
  sortOrder     Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relationships
  industry      Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  facilityType  FacilityType @relation(fields: [facilityTypeId], references: [id], onDelete: Cascade)

  @@unique([industryId, facilityTypeId])
  @@map("industry_facility_type_associations")
}

// Industry-Operational Stream associations with customization
model IndustryOperationalStreamAssociation {
  id              String   @id @default(cuid())
  industryId      String
  sectorId        String?  // Optional sector-specific association
  operationalStreamId String
  isApplicable    Boolean  @default(true)
  customName      String?  // Industry-specific name override
  customDescription String? // Industry-specific description
  sortOrder       Int      @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  industry        Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  sector          Sector? @relation(fields: [sectorId], references: [id], onDelete: Cascade)
  operationalStream OperationalStream @relation(fields: [operationalStreamId], references: [id], onDelete: Cascade)

  @@unique([industryId, sectorId, operationalStreamId])
  @@map("industry_operational_stream_associations")
}

// Industry-Compliance Requirement associations
model IndustryComplianceRequirementAssociation {
  id                    String   @id @default(cuid())
  industryId            String
  sectorId              String?  // Optional sector-specific association
  complianceRequirementId String
  isApplicable          Boolean  @default(true)
  priority              String?  // HIGH, MEDIUM, LOW
  customDescription     String?  // Industry-specific description
  sortOrder             Int      @default(0)
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relationships
  industry              Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  sector                Sector? @relation(fields: [sectorId], references: [id], onDelete: Cascade)
  complianceRequirement ComplianceRequirement @relation(fields: [complianceRequirementId], references: [id], onDelete: Cascade)

  @@unique([industryId, sectorId, complianceRequirementId])
  @@map("industry_compliance_requirement_associations")
}

// Industry-Regulatory Framework associations
model IndustryRegulatoryFrameworkAssociation {
  id                    String   @id @default(cuid())
  industryId            String
  sectorId              String?  // Optional sector-specific association
  regulatoryFrameworkId String
  isApplicable          Boolean  @default(true)
  priority              String?  // HIGH, MEDIUM, LOW
  customDescription     String?  // Industry-specific description
  sortOrder             Int      @default(0)
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relationships
  industry              Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  sector                Sector? @relation(fields: [sectorId], references: [id], onDelete: Cascade)
  regulatoryFramework   RegulatoryFramework @relation(fields: [regulatoryFrameworkId], references: [id], onDelete: Cascade)

  @@unique([industryId, sectorId, regulatoryFrameworkId])
  @@map("industry_regulatory_framework_associations")
}
```

### Updated Industry and Sector Models

```prisma
model Industry {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  category    String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  sectors     Sector[]
  facilityTypeAssociations IndustryFacilityTypeAssociation[]
  operationalStreamAssociations IndustryOperationalStreamAssociation[]
  complianceRequirementAssociations IndustryComplianceRequirementAssociation[]
  regulatoryFrameworkAssociations IndustryRegulatoryFrameworkAssociation[]

  @@map("industries")
}

model Sector {
  id          String   @id @default(cuid())
  code        String
  name        String
  description String?
  category    String
  riskProfile String   @default("MEDIUM")
  industryId  String
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  industry    Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  operationalStreamAssociations IndustryOperationalStreamAssociation[]
  complianceRequirementAssociations IndustryComplianceRequirementAssociation[]
  regulatoryFrameworkAssociations IndustryRegulatoryFrameworkAssociation[]

  @@unique([industryId, code])
  @@map("sectors")
}
```

## Benefits of Restructured Approach

### 1. **Elimination of Duplication**
- Common elements stored once in master tables
- Industry-specific customizations through association tables
- Reduced storage requirements and maintenance overhead

### 2. **Independent Management**
- Common elements can be managed centrally
- Industry-specific overrides when needed
- Changes to common elements propagate automatically

### 3. **Flexible Relationships**
- Many-to-many relationships between industries and common elements
- Optional sector-specific associations
- Easy to add new industries without duplicating data

### 4. **Improved Performance**
- Normalized data structure
- Efficient queries through proper indexing
- Reduced data redundancy

### 5. **Better Data Consistency**
- Single source of truth for common elements
- Consistent naming and categorization
- Reduced risk of data divergence

## Migration Strategy

### Phase 1: Create Master Tables
1. Extract unique values from existing industry-specific tables
2. Create master tables with common elements
3. Populate master tables with deduplicated data

### Phase 2: Create Association Tables
1. Create association tables for industry-specific relationships
2. Migrate existing relationships to association tables
3. Add industry-specific customizations where needed

### Phase 3: Update Application Logic
1. Update queries to use new normalized structure
2. Implement association-based filtering and selection
3. Update business logic for industry-specific customizations

### Phase 4: Cleanup
1. Remove old industry-specific tables
2. Update indexes and constraints
3. Performance testing and optimization

## Example Usage

### Querying Industry-Specific Data
```typescript
// Get all facility types for Mining & Metals industry
const miningFacilityTypes = await prisma.industryFacilityTypeAssociation.findMany({
  where: {
    industry: { code: 'MINING_METALS' },
    isApplicable: true
  },
  include: {
    facilityType: true
  }
});

// Get operational streams for Copper sector
const copperStreams = await prisma.industryOperationalStreamAssociation.findMany({
  where: {
    industry: { code: 'MINING_METALS' },
    sector: { code: 'COPPER' },
    isApplicable: true
  },
  include: {
    operationalStream: true
  }
});
```

### Adding New Industry
```typescript
// Add new industry with existing common elements
const newIndustry = await prisma.industry.create({
  data: {
    code: 'NEW_INDUSTRY',
    name: 'New Industry',
    category: 'MANUFACTURING'
  }
});

// Associate with existing facility types
await prisma.industryFacilityTypeAssociation.createMany({
  data: [
    { industryId: newIndustry.id, facilityTypeId: 'refinery-id' },
    { industryId: newIndustry.id, facilityTypeId: 'laboratory-id' }
  ]
});
```

## Conclusion

This restructured approach provides a scalable, maintainable, and efficient framework for managing industry-specific data while eliminating duplication and enabling independent management of common elements. The association-based model allows for maximum flexibility while maintaining data consistency and performance. 