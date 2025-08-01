# Industry-Specific Facility Types Implementation

## Overview

This document outlines the implementation of industry-specific facility types in the CapOpt Platform, replacing the generic facility type enum with a dynamic, industry-aligned system.

## Problem Statement

Previously, the platform used a generic `FacilityType` enum that contained facility types applicable to all industries. This approach was problematic because:

- **Mining operations** have different facility types than **petrochemical plants**
- **Defence facilities** require specialized facility types not relevant to other industries
- **Risk profiles** vary significantly between facility types across industries
- **Compliance requirements** differ based on facility type and industry context

## Solution Architecture

### Database Schema Changes

#### New Model: `IndustryFacilityTypes`

```prisma
model IndustryFacilityTypes {
  id                String   @id @default(cuid())
  facilityTypeCode  String   // e.g., "OPEN_PIT_MINE", "UNDERGROUND_MINE"
  facilityTypeName  String   // e.g., "Open Pit Mine", "Underground Mine"
  description       String?
  category          String   // e.g., "EXTRACTION", "PROCESSING", "INFRASTRUCTURE", "SUPPORT"
  riskProfile       String   @default("MEDIUM") // LOW, MEDIUM, HIGH, CRITICAL
  industryId        String
  isActive          Boolean  @default(true)
  sortOrder         Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relationships
  industry          Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)

  @@unique([industryId, facilityTypeCode])
  @@map("industry_facility_types")
}
```

#### Updated Industry Model

```prisma
model Industry {
  // ... existing fields ...
  
  // Relationships
  sectors           Sector[]
  facilityTypes     IndustryFacilityTypes[]
  operationalStreams IndustryOperationalStreams[]
  complianceFrameworks IndustryComplianceFramework[]
}
```

### API Endpoint Updates

#### Enhanced `/api/enums` Endpoint

The existing enum endpoint was updated to support industry-specific facility types:

```typescript
case 'facility-types':
  const industryCodeForFacility = searchParams.get('industry')
  if (!industryCodeForFacility) { 
    return NextResponse.json({ error: 'Industry parameter required for facility types' }, { status: 400 }) 
  }
  const industryForFacility = await prisma.industry.findUnique({
    where: { code: industryCodeForFacility },
    include: { 
      facilityTypes: { 
        where: { isActive: true }, 
        orderBy: { sortOrder: 'asc' }, 
        select: { 
          facilityTypeCode: true, 
          facilityTypeName: true, 
          description: true, 
          category: true, 
          riskProfile: true 
        } 
      } 
    }
  })
  // ... return facility types
```

### Frontend Integration

#### Updated React Hook

```typescript
export function useFacilityTypes(industryCode?: string) {
  return useEnumValues('facility-types', industryCode)
}
```

#### Updated CanvasEditor Component

The facility type selector now dynamically fetches industry-specific options:

```typescript
<DynamicSelect
  label="Facility Type"
  value={formData.facilityType}
  onValueChange={(value) => handleInputChange('facilityType', value)}
  enumType="facility-types"
  industryCode={formData.industry ? industries.find(i => i.name === formData.industry)?.code : undefined}
  required
  error={validationErrors.facilityType}
  showError={!!validationErrors.facilityType}
/>
```

## Industry-Specific Facility Types

### Mining & Metals Industry (18 facility types)

#### Extraction Facilities
- **Open Pit Mine** (HIGH risk)
- **Underground Mine** (CRITICAL risk)
- **Placer Mine** (MEDIUM risk)
- **In-Situ Mine** (HIGH risk)

#### Processing Facilities
- **Crushing Plant** (HIGH risk)
- **Grinding Mill** (HIGH risk)
- **Flotation Plant** (HIGH risk)
- **Leaching Plant** (HIGH risk)
- **Smelter** (CRITICAL risk)
- **Refinery** (CRITICAL risk)

#### Infrastructure
- **Power Station** (HIGH risk)
- **Water Treatment Plant** (MEDIUM risk)
- **Waste Management Facility** (HIGH risk)
- **Warehouse** (LOW risk)

#### Support Facilities
- **Office Complex** (LOW risk)
- **Laboratory** (MEDIUM risk)
- **Workshop** (MEDIUM risk)
- **Training Center** (LOW risk)

### Oil & Gas Industry (15 facility types)

#### Extraction Facilities
- **Onshore Well** (HIGH risk)
- **Offshore Platform** (CRITICAL risk)
- **Fracking Site** (CRITICAL risk)
- **Gas Plant** (HIGH risk)

#### Processing Facilities
- **Oil Refinery** (CRITICAL risk)
- **Cracking Unit** (CRITICAL risk)
- **Distillation Tower** (HIGH risk)
- **Compressor Station** (HIGH risk)

#### Infrastructure
- **Pipeline Terminal** (HIGH risk)
- **Storage Tank Farm** (HIGH risk)
- **LNG Terminal** (CRITICAL risk)
- **Power Station** (HIGH risk)

#### Support Facilities
- **Control Room** (MEDIUM risk)
- **Laboratory** (MEDIUM risk)
- **Office Complex** (LOW risk)

### Defence Industry (10 facility types)

#### Processing Facilities
- **Weapons Factory** (CRITICAL risk)
- **Munitions Plant** (CRITICAL risk)
- **Electronics Factory** (HIGH risk)
- **Testing Facility** (HIGH risk)

#### Infrastructure
- **Secure Storage Facility** (CRITICAL risk)
- **Communications Center** (HIGH risk)
- **Power Station** (HIGH risk)

#### Support Facilities
- **Security Office** (MEDIUM risk)
- **Laboratory** (MEDIUM risk)
- **Training Facility** (MEDIUM risk)

### Chemicals Industry (11 facility types)

#### Processing Facilities
- **Chemical Plant** (CRITICAL risk)
- **Reactor Unit** (CRITICAL risk)
- **Distillation Plant** (HIGH risk)
- **Polymerization Plant** (HIGH risk)

#### Infrastructure
- **Storage Tank Farm** (HIGH risk)
- **Pipeline Network** (HIGH risk)
- **Waste Treatment Plant** (HIGH risk)
- **Warehouse** (MEDIUM risk)

#### Support Facilities
- **Laboratory** (MEDIUM risk)
- **Control Room** (MEDIUM risk)
- **Office Complex** (LOW risk)

### Manufacturing Industry (10 facility types)

#### Processing Facilities
- **Assembly Plant** (MEDIUM risk)
- **Fabrication Plant** (HIGH risk)
- **Production Line** (MEDIUM risk)
- **Quality Control Facility** (LOW risk)

#### Infrastructure
- **Warehouse** (LOW risk)
- **Distribution Center** (LOW risk)
- **Maintenance Shop** (MEDIUM risk)

#### Support Facilities
- **Office Complex** (LOW risk)
- **Laboratory** (MEDIUM risk)
- **Training Center** (LOW risk)

## Implementation Benefits

### 1. **Industry Alignment**
- Facility types are now specific to each industry's operational context
- Risk profiles are appropriately categorized based on industry standards
- Compliance requirements can be tailored to facility type and industry

### 2. **Risk Management**
- Critical facilities (e.g., Underground Mine, Offshore Platform) are properly identified
- Risk-based prioritization for safety and compliance monitoring
- Industry-specific risk mitigation strategies

### 3. **Operational Efficiency**
- Users see only relevant facility types for their industry
- Reduced cognitive load in facility selection
- Improved data quality and consistency

### 4. **Scalability**
- Easy to add new industries and facility types
- Flexible categorization system (EXTRACTION, PROCESSING, INFRASTRUCTURE, SUPPORT)
- Maintainable through database seeding

### 5. **Compliance Integration**
- Facility types can be linked to specific compliance frameworks
- Industry-specific regulatory requirements
- Audit trail for facility type changes

## Technical Implementation Details

### Database Migration
- Created new `IndustryFacilityTypes` table with proper relationships
- Updated existing `Industry` model to include facility types relationship
- Migrated existing data with proper industry mapping

### Seeding Strategy
- Comprehensive facility types for 5 key industries (Mining & Metals, Oil & Gas, Chemicals, Manufacturing, Defence)
- Risk profile categorization based on industry standards
- Category-based organization for better UX

### API Design
- Backward compatible with existing enum system
- Industry parameter required for facility types
- Proper error handling for missing industry codes

### Frontend Integration
- Dynamic facility type loading based on selected industry
- Seamless integration with existing form components
- Real-time updates when industry selection changes

## Testing Results

### API Endpoint Testing

```bash
# Mining & Metals Industry
curl "http://localhost:3000/api/enums?type=facility-types&industry=MINING_METALS"
# Returns 18 facility types including Open Pit Mine, Underground Mine, etc.

# Oil & Gas Industry  
curl "http://localhost:3000/api/enums?type=facility-types&industry=OIL_GAS"
# Returns 15 facility types including Offshore Platform, Fracking Site, etc.

# Defence Industry
curl "http://localhost:3000/api/enums?type=facility-types&industry=DEFENCE"
# Returns 10 facility types including Weapons Factory, Munitions Plant, etc.
```

### Frontend Testing
- Facility type dropdown populates correctly based on industry selection
- Risk profiles are properly categorized
- Form validation works with industry-specific facility types

## Future Enhancements

### 1. **Additional Industries**
- Expand to cover all 16 industries in the platform
- Industry-specific facility type templates
- Custom facility type creation for enterprise users

### 2. **Advanced Categorization**
- Sub-categories within main categories
- Facility type hierarchies
- Cross-industry facility type relationships

### 3. **Risk Integration**
- Automatic risk assessment based on facility type
- Risk-based facility type recommendations
- Integration with critical controls framework

### 4. **Compliance Mapping**
- Direct links between facility types and compliance requirements
- Automated compliance checklist generation
- Regulatory change impact assessment

## Conclusion

The implementation of industry-specific facility types successfully addresses the limitations of the generic facility type system. The new approach provides:

- **Industry-aligned facility types** with appropriate risk profiles
- **Scalable architecture** for adding new industries and facility types
- **Enhanced user experience** with contextually relevant options
- **Better risk management** through industry-specific categorization
- **Foundation for compliance integration** and advanced features

This implementation establishes a robust foundation for industry-specific operational management in the CapOpt Platform. 