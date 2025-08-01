# Framework Data Migration Plan

## Overview

This document outlines the step-by-step migration from the current industry-specific schema to the new normalized schema that eliminates duplication and enables independent management of common elements.

## Migration Terminology

- **Schema Migration**: Database structure changes
- **Data Migration**: Moving existing data to new structure
- **Application Plumbing**: Updating application code to use new entity names and relationships
- **Seeding**: Populating new tables with test/initial data
- **Entity Names**: The model/table names in the new schema (e.g., `FacilityType`, `OperationalStream`)

## Phase 1: Schema Migration

### 1.1 Create New Master Tables

```sql
-- Create master tables for common elements
CREATE TABLE facility_types (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  risk_profile TEXT DEFAULT 'MEDIUM',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE operational_streams (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_requirements (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE regulatory_frameworks (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2 Create Association Tables

```sql
-- Industry-Facility Type associations
CREATE TABLE industry_facility_type_associations (
  id TEXT PRIMARY KEY,
  industry_id TEXT NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  facility_type_id TEXT NOT NULL REFERENCES facility_types(id) ON DELETE CASCADE,
  is_applicable BOOLEAN DEFAULT true,
  risk_profile TEXT,
  custom_name TEXT,
  custom_description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(industry_id, facility_type_id)
);

-- Industry-Operational Stream associations
CREATE TABLE industry_operational_stream_associations (
  id TEXT PRIMARY KEY,
  industry_id TEXT NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  sector_id TEXT REFERENCES sectors(id) ON DELETE CASCADE,
  operational_stream_id TEXT NOT NULL REFERENCES operational_streams(id) ON DELETE CASCADE,
  is_applicable BOOLEAN DEFAULT true,
  custom_name TEXT,
  custom_description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(industry_id, sector_id, operational_stream_id)
);

-- Industry-Compliance Requirement associations
CREATE TABLE industry_compliance_requirement_associations (
  id TEXT PRIMARY KEY,
  industry_id TEXT NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  sector_id TEXT REFERENCES sectors(id) ON DELETE CASCADE,
  compliance_requirement_id TEXT NOT NULL REFERENCES compliance_requirements(id) ON DELETE CASCADE,
  is_applicable BOOLEAN DEFAULT true,
  priority TEXT,
  custom_description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(industry_id, sector_id, compliance_requirement_id)
);

-- Industry-Regulatory Framework associations
CREATE TABLE industry_regulatory_framework_associations (
  id TEXT PRIMARY KEY,
  industry_id TEXT NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  sector_id TEXT REFERENCES sectors(id) ON DELETE CASCADE,
  regulatory_framework_id TEXT NOT NULL REFERENCES regulatory_frameworks(id) ON DELETE CASCADE,
  is_applicable BOOLEAN DEFAULT true,
  priority TEXT,
  custom_description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(industry_id, sector_id, regulatory_framework_id)
);
```

### 1.3 Update Prisma Schema

```prisma
// Add to schema.prisma
model FacilityType {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  category    String
  riskProfile String   @default("MEDIUM")
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  industryAssociations IndustryFacilityTypeAssociation[]
  businessCanvasAssociations BusinessCanvasFacilityTypes[]

  @@map("facility_types")
}

model OperationalStream {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  category    String
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  industryAssociations IndustryOperationalStreamAssociation[]
  businessCanvasAssociations BusinessCanvasOperationalStreams[]

  @@map("operational_streams")
}

model ComplianceRequirement {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  category    String
  jurisdiction String
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  industryAssociations IndustryComplianceRequirementAssociation[]
  businessCanvasAssociations BusinessCanvasComplianceFrameworks[]

  @@map("compliance_requirements")
}

model RegulatoryFramework {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  description String?
  category    String
  jurisdiction String
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  industryAssociations IndustryRegulatoryFrameworkAssociation[]
  businessCanvasAssociations BusinessCanvasComplianceFrameworks[]

  @@map("regulatory_frameworks")
}

// Association models
model IndustryFacilityTypeAssociation {
  id            String   @id @default(cuid())
  industryId    String
  facilityTypeId String
  isApplicable  Boolean  @default(true)
  riskProfile   String?
  customName    String?
  customDescription String?
  sortOrder     Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  industry      Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  facilityType  FacilityType @relation(fields: [facilityTypeId], references: [id], onDelete: Cascade)

  @@unique([industryId, facilityTypeId])
  @@map("industry_facility_type_associations")
}

model IndustryOperationalStreamAssociation {
  id              String   @id @default(cuid())
  industryId      String
  sectorId        String?
  operationalStreamId String
  isApplicable    Boolean  @default(true)
  customName      String?
  customDescription String?
  sortOrder       Int      @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  industry        Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  sector          Sector? @relation(fields: [sectorId], references: [id], onDelete: Cascade)
  operationalStream OperationalStream @relation(fields: [operationalStreamId], references: [id], onDelete: Cascade)

  @@unique([industryId, sectorId, operationalStreamId])
  @@map("industry_operational_stream_associations")
}

model IndustryComplianceRequirementAssociation {
  id                    String   @id @default(cuid())
  industryId            String
  sectorId              String?
  complianceRequirementId String
  isApplicable          Boolean  @default(true)
  priority              String?
  customDescription     String?
  sortOrder             Int      @default(0)
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  industry              Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  sector                Sector? @relation(fields: [sectorId], references: [id], onDelete: Cascade)
  complianceRequirement ComplianceRequirement @relation(fields: [complianceRequirementId], references: [id], onDelete: Cascade)

  @@unique([industryId, sectorId, complianceRequirementId])
  @@map("industry_compliance_requirement_associations")
}

model IndustryRegulatoryFrameworkAssociation {
  id                    String   @id @default(cuid())
  industryId            String
  sectorId              String?
  regulatoryFrameworkId String
  isApplicable          Boolean  @default(true)
  priority              String?
  customDescription     String?
  sortOrder             Int      @default(0)
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  industry              Industry @relation(fields: [industryId], references: [id], onDelete: Cascade)
  sector                Sector? @relation(fields: [sectorId], references: [id], onDelete: Cascade)
  regulatoryFramework   RegulatoryFramework @relation(fields: [regulatoryFrameworkId], references: [id], onDelete: Cascade)

  @@unique([industryId, sectorId, regulatoryFrameworkId])
  @@map("industry_regulatory_framework_associations")
}

// Update existing models
model Industry {
  // ... existing fields ...

  // New relationships
  facilityTypeAssociations IndustryFacilityTypeAssociation[]
  operationalStreamAssociations IndustryOperationalStreamAssociation[]
  complianceRequirementAssociations IndustryComplianceRequirementAssociation[]
  regulatoryFrameworkAssociations IndustryRegulatoryFrameworkAssociation[]
}

model Sector {
  // ... existing fields ...

  // New relationships
  operationalStreamAssociations IndustryOperationalStreamAssociation[]
  complianceRequirementAssociations IndustryComplianceRequirementAssociation[]
  regulatoryFrameworkAssociations IndustryRegulatoryFrameworkAssociation[]
}
```

## Phase 2: Data Migration

### 2.1 Extract and Deduplicate Common Elements

```typescript
// scripts/migrate-common-elements.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateCommonElements() {
  console.log('🔄 Starting common elements migration...')

  // Extract unique facility types
  const facilityTypes = await prisma.industryFacilityTypes.findMany({
    select: {
      facilityTypeCode: true,
      facilityTypeName: true,
      description: true,
      category: true,
      riskProfile: true
    }
  })

  const uniqueFacilityTypes = facilityTypes.reduce((acc, ft) => {
    const key = ft.facilityTypeCode
    if (!acc[key]) {
      acc[key] = ft
    }
    return acc
  }, {})

  // Create master facility types
  for (const [code, facilityType] of Object.entries(uniqueFacilityTypes)) {
    await prisma.facilityType.upsert({
      where: { code },
      update: facilityType,
      create: {
        code,
        name: facilityType.facilityTypeName,
        description: facilityType.description,
        category: facilityType.category,
        riskProfile: facilityType.riskProfile
      }
    })
  }

  console.log(`✅ Created ${Object.keys(uniqueFacilityTypes).length} unique facility types`)

  // Similar process for operational streams, compliance requirements, and regulatory frameworks
  // ... (implement similar logic for other master tables)
}

migrateCommonElements()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 2.2 Create Industry Associations

```typescript
// scripts/create-industry-associations.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createIndustryAssociations() {
  console.log('🔄 Creating industry associations...')

  // Get all industries
  const industries = await prisma.industry.findMany()

  for (const industry of industries) {
    console.log(`Processing industry: ${industry.name}`)

    // Create facility type associations
    const industryFacilityTypes = await prisma.industryFacilityTypes.findMany({
      where: { industryId: industry.id }
    })

    for (const ift of industryFacilityTypes) {
      const facilityType = await prisma.facilityType.findUnique({
        where: { code: ift.facilityTypeCode }
      })

      if (facilityType) {
        await prisma.industryFacilityTypeAssociation.upsert({
          where: {
            industryId_facilityTypeId: {
              industryId: industry.id,
              facilityTypeId: facilityType.id
            }
          },
          update: {
            riskProfile: ift.riskProfile,
            customName: ift.facilityTypeName !== facilityType.name ? ift.facilityTypeName : null,
            customDescription: ift.description,
            sortOrder: ift.sortOrder
          },
          create: {
            industryId: industry.id,
            facilityTypeId: facilityType.id,
            riskProfile: ift.riskProfile,
            customName: ift.facilityTypeName !== facilityType.name ? ift.facilityTypeName : null,
            customDescription: ift.description,
            sortOrder: ift.sortOrder
          }
        })
      }
    }

    // Similar process for operational streams, compliance requirements, and regulatory frameworks
    // ... (implement similar logic for other associations)
  }

  console.log('✅ Industry associations created successfully')
}

createIndustryAssociations()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## Phase 3: Seeding Test Data

### 3.1 Create New Seed Files

```typescript
// prisma/seed/master-data/facility-types.ts
import { PrismaClient } from '@prisma/client'

export async function seedFacilityTypes(prisma: PrismaClient) {
  console.log('🏭 Seeding master facility types...')

  const facilityTypes = [
    // Extraction
    { code: 'OPEN_PIT_MINE', name: 'Open Pit Mine', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'UNDERGROUND_MINE', name: 'Underground Mine', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
    { code: 'PLACER_MINE', name: 'Placer Mine', category: 'EXTRACTION', riskProfile: 'MEDIUM' },
    { code: 'IN_SITU_MINE', name: 'In-Situ Mine', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'ONSHORE_WELL', name: 'Onshore Well', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'OFFSHORE_PLATFORM', name: 'Offshore Platform', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
    
    // Processing
    { code: 'CRUSHING_PLANT', name: 'Crushing Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'GRINDING_MILL', name: 'Grinding Mill', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'FLOTATION_PLANT', name: 'Flotation Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'SMELTER', name: 'Smelter', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'REFINERY', name: 'Refinery', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'CHEMICAL_PLANT', name: 'Chemical Plant', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    
    // Infrastructure
    { code: 'POWER_STATION', name: 'Power Station', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'WATER_TREATMENT', name: 'Water Treatment Plant', category: 'INFRASTRUCTURE', riskProfile: 'MEDIUM' },
    { code: 'WASTE_MANAGEMENT', name: 'Waste Management Facility', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'STORAGE_TANK_FARM', name: 'Storage Tank Farm', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    
    // Support
    { code: 'OFFICE', name: 'Office Complex', category: 'SUPPORT', riskProfile: 'LOW' },
    { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
    { code: 'WORKSHOP', name: 'Workshop', category: 'SUPPORT', riskProfile: 'MEDIUM' },
    { code: 'TRAINING_CENTER', name: 'Training Center', category: 'SUPPORT', riskProfile: 'LOW' }
  ]

  for (const facilityType of facilityTypes) {
    await prisma.facilityType.upsert({
      where: { code: facilityType.code },
      update: facilityType,
      create: facilityType
    })
  }

  console.log(`✅ Created ${facilityTypes.length} facility types`)
}

// prisma/seed/master-data/operational-streams.ts
export async function seedOperationalStreams(prisma: PrismaClient) {
  console.log('🔄 Seeding master operational streams...')

  const operationalStreams = [
    // Extraction
    { code: 'OPEN_PIT_MINING', name: 'Open Pit Mining', category: 'EXTRACTION' },
    { code: 'UNDERGROUND_MINING', name: 'Underground Mining', category: 'EXTRACTION' },
    { code: 'IN_SITU_LEACHING', name: 'In-Situ Leaching', category: 'EXTRACTION' },
    { code: 'DRILLING_OPERATIONS', name: 'Drilling Operations', category: 'EXTRACTION' },
    { code: 'WELL_OPERATIONS', name: 'Well Operations', category: 'EXTRACTION' },
    
    // Processing
    { code: 'ORE_PROCESSING', name: 'Ore Processing', category: 'PROCESSING' },
    { code: 'CONCENTRATE_PRODUCTION', name: 'Concentrate Production', category: 'PROCESSING' },
    { code: 'SMELTING_OPERATIONS', name: 'Smelting Operations', category: 'PROCESSING' },
    { code: 'REFINING_OPERATIONS', name: 'Refining Operations', category: 'PROCESSING' },
    { code: 'HEAP_LEACHING', name: 'Heap Leaching', category: 'PROCESSING' },
    { code: 'CYANIDATION', name: 'Cyanidation', category: 'PROCESSING' },
    
    // Safety
    { code: 'SAFETY_SYSTEMS', name: 'Safety Systems', category: 'SAFETY' },
    { code: 'RADIATION_SAFETY', name: 'Radiation Safety', category: 'SAFETY' },
    { code: 'NUCLEAR_COMPLIANCE', name: 'Nuclear Compliance', category: 'SAFETY' },
    { code: 'EMERGENCY_RESPONSE', name: 'Emergency Response', category: 'SAFETY' },
    
    // Environmental
    { code: 'ENVIRONMENTAL_MONITORING', name: 'Environmental Monitoring', category: 'ENVIRONMENTAL' },
    { code: 'TAILINGS_MANAGEMENT', name: 'Tailings Management', category: 'ENVIRONMENTAL' },
    { code: 'WATER_MANAGEMENT', name: 'Water Management', category: 'ENVIRONMENTAL' },
    { code: 'DUST_CONTROL', name: 'Dust Control', category: 'ENVIRONMENTAL' },
    { code: 'WASTE_MANAGEMENT', name: 'Waste Management', category: 'ENVIRONMENTAL' },
    { code: 'REHABILITATION', name: 'Rehabilitation', category: 'ENVIRONMENTAL' }
  ]

  for (const stream of operationalStreams) {
    await prisma.operationalStream.upsert({
      where: { code: stream.code },
      update: stream,
      create: stream
    })
  }

  console.log(`✅ Created ${operationalStreams.length} operational streams`)
}

// prisma/seed/master-data/compliance-requirements.ts
export async function seedComplianceRequirements(prisma: PrismaClient) {
  console.log('🛡️ Seeding master compliance requirements...')

  const complianceRequirements = [
    // Federal
    { code: 'WHS_ACT_2011', name: 'WHS Act 2011', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'ENVIRONMENTAL_PROTECTION_ACT', name: 'Environmental Protection Act', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'MINING_ACT_1992', name: 'Mining Act 1992', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'NATIVE_TITLE_ACT', name: 'Native Title Act', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'DEFENCE_TRADE_CONTROLS_ACT', name: 'Defence Trade Controls Act', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    
    // State
    { code: 'MINING_SAFETY_HEALTH_ACT', name: 'Mining and Quarrying Safety and Health Act', category: 'STATE', jurisdiction: 'AUSTRALIA' },
    { code: 'COAL_MINING_SAFETY_ACT', name: 'Coal Mining Safety and Health Act', category: 'STATE', jurisdiction: 'AUSTRALIA' },
    { code: 'WATER_ACT', name: 'Water Act', category: 'STATE', jurisdiction: 'AUSTRALIA' },
    
    // Industry
    { code: 'ICMM_FRAMEWORK', name: 'ICMM Sustainable Development Framework', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    { code: 'ISO_14001', name: 'ISO 14001 Environmental Management', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    { code: 'ISO_45001', name: 'ISO 45001 Occupational Health and Safety', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    
    // International
    { code: 'ITAR', name: 'International Traffic in Arms Regulations', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'IAEA_SAFEGUARDS', name: 'IAEA Safeguards', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' }
  ]

  for (const requirement of complianceRequirements) {
    await prisma.complianceRequirement.upsert({
      where: { code: requirement.code },
      update: requirement,
      create: requirement
    })
  }

  console.log(`✅ Created ${complianceRequirements.length} compliance requirements`)
}
```

### 3.2 Create Industry Association Seeds

```typescript
// prisma/seed/associations/industry-associations.ts
import { PrismaClient } from '@prisma/client'

export async function seedIndustryAssociations(prisma: PrismaClient) {
  console.log('🔗 Seeding industry associations...')

  // Get master data
  const miningIndustry = await prisma.industry.findUnique({ where: { code: 'MINING_METALS' } })
  const oilGasIndustry = await prisma.industry.findUnique({ where: { code: 'OIL_GAS' } })
  
  const copperSector = await prisma.sector.findFirst({ 
    where: { industryId: miningIndustry.id, code: 'COPPER' } 
  })

  // Facility Type Associations
  const openPitMine = await prisma.facilityType.findUnique({ where: { code: 'OPEN_PIT_MINE' } })
  const refinery = await prisma.facilityType.findUnique({ where: { code: 'REFINERY' } })
  const laboratory = await prisma.facilityType.findUnique({ where: { code: 'LABORATORY' } })

  // Mining associations
  await prisma.industryFacilityTypeAssociation.createMany({
    data: [
      {
        industryId: miningIndustry.id,
        facilityTypeId: openPitMine.id,
        riskProfile: 'HIGH',
        sortOrder: 1
      },
      {
        industryId: miningIndustry.id,
        facilityTypeId: refinery.id,
        riskProfile: 'CRITICAL',
        sortOrder: 2
      },
      {
        industryId: miningIndustry.id,
        facilityTypeId: laboratory.id,
        riskProfile: 'MEDIUM',
        sortOrder: 3
      }
    ],
    skipDuplicates: true
  })

  // Oil & Gas associations
  await prisma.industryFacilityTypeAssociation.createMany({
    data: [
      {
        industryId: oilGasIndustry.id,
        facilityTypeId: refinery.id,
        riskProfile: 'CRITICAL',
        customName: 'Oil Refinery',
        sortOrder: 1
      },
      {
        industryId: oilGasIndustry.id,
        facilityTypeId: laboratory.id,
        riskProfile: 'MEDIUM',
        sortOrder: 2
      }
    ],
    skipDuplicates: true
  })

  // Operational Stream Associations
  const openPitMining = await prisma.operationalStream.findUnique({ where: { code: 'OPEN_PIT_MINING' } })
  const safetySystems = await prisma.operationalStream.findUnique({ where: { code: 'SAFETY_SYSTEMS' } })

  // Mining-Copper associations
  await prisma.industryOperationalStreamAssociation.createMany({
    data: [
      {
        industryId: miningIndustry.id,
        sectorId: copperSector.id,
        operationalStreamId: openPitMining.id,
        sortOrder: 1
      },
      {
        industryId: miningIndustry.id,
        sectorId: copperSector.id,
        operationalStreamId: safetySystems.id,
        sortOrder: 2
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Industry associations seeded successfully')
}
```

## Phase 4: Application Plumbing Updates

### 4.1 Update API Routes

```typescript
// app/api/frameworks/facility-types/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const facilityTypes = await prisma.facilityType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(facilityTypes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch facility types' }, { status: 500 })
  }
}

// app/api/frameworks/industries/[id]/facility-types/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facilityTypes = await prisma.industryFacilityTypeAssociation.findMany({
      where: {
        industryId: params.id,
        isApplicable: true,
        isActive: true
      },
      include: {
        facilityType: true
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(facilityTypes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch industry facility types' }, { status: 500 })
  }
}
```

### 4.2 Update Hooks

```typescript
// hooks/use-facility-types.ts
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export interface FacilityType {
  id: string
  code: string
  name: string
  description?: string
  category: string
  riskProfile: string
}

export interface IndustryFacilityTypeAssociation {
  id: string
  facilityType: FacilityType
  isApplicable: boolean
  riskProfile?: string
  customName?: string
  customDescription?: string
  sortOrder: number
}

export function useFacilityTypes() {
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFacilityTypes = async () => {
      try {
        const response = await api.get('/api/frameworks/facility-types')
        setFacilityTypes(response.data)
      } catch (err) {
        setError('Failed to fetch facility types')
      } finally {
        setLoading(false)
      }
    }

    fetchFacilityTypes()
  }, [])

  return { facilityTypes, loading, error }
}

export function useIndustryFacilityTypes(industryId: string) {
  const [associations, setAssociations] = useState<IndustryFacilityTypeAssociation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIndustryFacilityTypes = async () => {
      try {
        const response = await api.get(`/api/frameworks/industries/${industryId}/facility-types`)
        setAssociations(response.data)
      } catch (err) {
        setError('Failed to fetch industry facility types')
      } finally {
        setLoading(false)
      }
    }

    if (industryId) {
      fetchIndustryFacilityTypes()
    }
  }, [industryId])

  return { associations, loading, error }
}
```

### 4.3 Update Components

```typescript
// components/framework/FacilityTypeSelector.tsx
import { useFacilityTypes } from '@/hooks/use-facility-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FacilityTypeSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  industryId?: string
}

export function FacilityTypeSelector({ value, onValueChange, industryId }: FacilityTypeSelectorProps) {
  const { facilityTypes, loading, error } = useFacilityTypes()

  if (loading) return <div>Loading facility types...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select facility type" />
      </SelectTrigger>
      <SelectContent>
        {facilityTypes.map((facilityType) => (
          <SelectItem key={facilityType.id} value={facilityType.id}>
            {facilityType.name} ({facilityType.category})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Phase 5: Testing and Validation

### 5.1 Create Migration Tests

```typescript
// tests/migration/framework-migration.test.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Framework Migration', () => {
  test('should have deduplicated facility types', async () => {
    const facilityTypes = await prisma.facilityType.findMany()
    const codes = facilityTypes.map(ft => ft.code)
    const uniqueCodes = new Set(codes)
    
    expect(codes.length).toBe(uniqueCodes.size)
  })

  test('should have industry associations', async () => {
    const miningIndustry = await prisma.industry.findUnique({ where: { code: 'MINING_METALS' } })
    const associations = await prisma.industryFacilityTypeAssociation.findMany({
      where: { industryId: miningIndustry.id }
    })
    
    expect(associations.length).toBeGreaterThan(0)
  })

  test('should maintain data integrity', async () => {
    // Test that all associations reference valid entities
    const associations = await prisma.industryFacilityTypeAssociation.findMany({
      include: {
        industry: true,
        facilityType: true
      }
    })
    
    for (const association of associations) {
      expect(association.industry).toBeDefined()
      expect(association.facilityType).toBeDefined()
    }
  })
})
```

### 5.2 Performance Testing

```typescript
// scripts/performance-test.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function performanceTest() {
  console.log('🚀 Starting performance tests...')

  // Test query performance
  const startTime = Date.now()
  
  const miningIndustry = await prisma.industry.findUnique({ where: { code: 'MINING_METALS' } })
  const facilityTypes = await prisma.industryFacilityTypeAssociation.findMany({
    where: { industryId: miningIndustry.id },
    include: { facilityType: true }
  })
  
  const endTime = Date.now()
  console.log(`Query took ${endTime - startTime}ms`)
  console.log(`Found ${facilityTypes.length} facility types for Mining & Metals`)

  // Test data volume
  const totalFacilityTypes = await prisma.facilityType.count()
  const totalAssociations = await prisma.industryFacilityTypeAssociation.count()
  
  console.log(`Total facility types: ${totalFacilityTypes}`)
  console.log(`Total associations: ${totalAssociations}`)
}

performanceTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## Phase 6: Cleanup

### 6.1 Remove Old Tables

```sql
-- After successful migration and testing
DROP TABLE industry_facility_types;
DROP TABLE industry_operational_streams;
DROP TABLE industry_compliance_frameworks;
```

### 6.2 Update Prisma Schema

```prisma
// Remove old models from schema.prisma
// model IndustryFacilityTypes { ... } // REMOVE
// model IndustryOperationalStreams { ... } // REMOVE
// model IndustryComplianceFramework { ... } // REMOVE
```

## Migration Checklist

- [ ] Create new master tables
- [ ] Create association tables
- [ ] Update Prisma schema
- [ ] Run database migrations
- [ ] Extract and deduplicate common elements
- [ ] Create industry associations
- [ ] Seed master data
- [ ] Seed industry associations
- [ ] Update API routes
- [ ] Update hooks and components
- [ ] Run migration tests
- [ ] Performance testing
- [ ] Remove old tables
- [ ] Update documentation

## Rollback Plan

If issues arise during migration:

1. **Database Rollback**: Restore from backup
2. **Code Rollback**: Revert to previous git commit
3. **Data Recovery**: Use migration scripts to restore data to old structure
4. **Application Rollback**: Deploy previous version

## Conclusion

This migration plan provides a comprehensive approach to transitioning from the current industry-specific schema to the new normalized schema. The phased approach ensures data integrity, minimal downtime, and proper testing at each stage. 