import { PrismaClient } from '@prisma/client'

export async function seedBusinessCanvases(prisma: PrismaClient) {
  console.log('🏢 Seeding business canvases...')

  // Get industry and facility type IDs for associations
  const miningIndustry = await prisma.industry.findUnique({
    where: { code: 'MINING_METALS' }
  })

  const oilGasIndustry = await prisma.industry.findUnique({
    where: { code: 'OIL_GAS' }
  })

  if (!miningIndustry || !oilGasIndustry) {
    console.log('⚠️ Industries not found, skipping business canvas seeding')
    return
  }

  // Get facility types for associations
  const facilityTypes = await prisma.facilityTypeMaster.findMany({
    where: { isActive: true }
  })

  const miningFacilityTypes = facilityTypes.filter(ft => 
    ['OPEN_PIT_MINE', 'CRUSHING_PLANT', 'SMELTER', 'REFINERY', 'POWER_STATION'].includes(ft.code)
  )

  const oilGasFacilityTypes = facilityTypes.filter(ft => 
    ['ONSHORE_WELL', 'REFINERY', 'STORAGE_TANK_FARM', 'PIPELINE_TERMINAL'].includes(ft.code)
  )

  // Business Canvas 1: Major Mining Corporation
  const majorMiningCanvas = await prisma.businessCanvas.create({
    data: {
      name: 'BHP Billiton - Olympic Dam Operations',
      description: 'Major copper, uranium, gold, and silver mining operation in South Australia',
      legalName: 'BHP Billiton Limited',
      abn: '49000000000',
      acn: '004028099',
      businessType: 'CORPORATION',
      industry: 'Mining & Metals',
      sector: 'COPPER',
      sectors: ['COPPER', 'URANIUM', 'GOLD_SILVER'],
      regional: 'REMOTE',
      primaryLocation: 'Olympic Dam, South Australia',
      strategicObjective: 'To be the world\'s leading resources company, creating long-term value through the discovery, development and conversion of natural resources',
      valueProposition: 'Sustainable mining practices with world-class safety standards and environmental stewardship',
      competitiveAdvantage: 'Large-scale, low-cost operations with significant resource base and advanced technology',
      annualRevenue: 50000000000, // $50 billion AUD
      employeeCount: 80000,
      riskProfile: 'HIGH',
      operationalStreams: ['OPEN_PIT_MINING', 'UNDERGROUND_MINING', 'MINERAL_PROCESSING', 'METAL_REFINING'],
      complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'RADIATION_PROTECTION_ACT'],
      regulatoryFramework: ['ISO_14001', 'ICMM_FRAMEWORK', 'GLOBAL_REPORTING_INITIATIVE'],
      status: 'PUBLISHED',
      isActive: true
    }
  })

  // Create facility type associations for major mining
  for (const facilityType of miningFacilityTypes) {
    await prisma.businessCanvasFacilityTypes.create({
      data: {
        businessCanvasId: majorMiningCanvas.id,
        facilityTypeId: facilityType.id,
        isAutoApplied: false
      }
    })
  }

  // Business Canvas 2: Oil & Gas Producer
  const oilGasCanvas = await prisma.businessCanvas.create({
    data: {
      name: 'Woodside Energy - North West Shelf Project',
      description: 'Australia\'s largest oil and gas producer operating the North West Shelf LNG project',
      legalName: 'Woodside Energy Group Ltd',
      abn: '51000000000',
      acn: '004028099',
      businessType: 'CORPORATION',
      industry: 'Oil & Gas',
      sector: 'LNG',
      sectors: ['LNG', 'NATURAL_GAS', 'CRUDE_OIL'],
      regional: 'COASTAL',
      primaryLocation: 'Karratha, Western Australia',
      strategicObjective: 'To be a global leader in the energy transition, delivering sustainable value for shareholders and stakeholders',
      valueProposition: 'Reliable, sustainable energy supply with world-class safety and environmental performance',
      competitiveAdvantage: 'Strategic location, established infrastructure, and strong technical capabilities',
      annualRevenue: 25000000000, // $25 billion AUD
      employeeCount: 3500,
      riskProfile: 'HIGH',
      operationalStreams: ['UPSTREAM_OPERATIONS', 'LNG_PRODUCTION', 'GAS_PROCESSING', 'EXPORT_OPERATIONS'],
      complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'PETROLEUM_ACT'],
      regulatoryFramework: ['ISO_14001', 'ISO_45001', 'ICMM_FRAMEWORK'],
      status: 'PUBLISHED',
      isActive: true
    }
  })

  // Create facility type associations for oil & gas
  for (const facilityType of oilGasFacilityTypes) {
    await prisma.businessCanvasFacilityTypes.create({
      data: {
        businessCanvasId: oilGasCanvas.id,
        facilityTypeId: facilityType.id,
        isAutoApplied: false
      }
    })
  }

  // Business Canvas 3: Junior Mining Company
  const juniorMiningCanvas = await prisma.businessCanvas.create({
    data: {
      name: 'Lynas Rare Earths - Mount Weld Operations',
      description: 'World\'s second largest producer of rare earth elements outside China',
      legalName: 'Lynas Rare Earths Limited',
      abn: '52000000000',
      acn: '009066099',
      businessType: 'CORPORATION',
      industry: 'Mining & Metals',
      sector: 'RARE_EARTHS',
      sectors: ['RARE_EARTHS', 'EXPLORATION'],
      regional: 'REMOTE',
      primaryLocation: 'Mount Weld, Western Australia',
      strategicObjective: 'To be the leading global supplier of rare earth materials for clean energy technologies',
      valueProposition: 'Sustainable rare earth supply chain supporting the global energy transition',
      competitiveAdvantage: 'Strategic mineral resources, advanced processing technology, and established customer base',
      annualRevenue: 800000000, // $800 million AUD
      employeeCount: 1200,
      riskProfile: 'HIGH',
      operationalStreams: ['OPEN_PIT_MINING', 'MINERAL_PROCESSING', 'RARE_EARTH_SEPARATION'],
      complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'RADIATION_PROTECTION_ACT'],
      regulatoryFramework: ['ISO_14001', 'ICMM_FRAMEWORK'],
      status: 'REVIEW',
      isActive: true
    }
  })

  // Create facility type associations for junior mining (fewer facilities)
  const juniorFacilityTypes = miningFacilityTypes.slice(0, 3) // Only first 3 facility types
  for (const facilityType of juniorFacilityTypes) {
    await prisma.businessCanvasFacilityTypes.create({
      data: {
        businessCanvasId: juniorMiningCanvas.id,
        facilityTypeId: facilityType.id,
        isAutoApplied: false
      }
    })
  }

  // Business Canvas 4: Chemical Manufacturing
  const chemicalCanvas = await prisma.businessCanvas.create({
    data: {
      name: 'Incitec Pivot - Gibson Island Plant',
      description: 'Leading manufacturer of industrial chemicals and fertilizers',
      legalName: 'Incitec Pivot Limited',
      abn: '53000000000',
      acn: '004028099',
      businessType: 'CORPORATION',
      industry: 'Chemicals',
      sector: 'BASIC_CHEMICALS',
      sectors: ['BASIC_CHEMICALS', 'PETROCHEMICALS'],
      regional: 'COASTAL',
      primaryLocation: 'Brisbane, Queensland',
      strategicObjective: 'To be a leading global supplier of industrial chemicals and fertilizers',
      valueProposition: 'High-quality, reliable chemical products supporting Australian agriculture and industry',
      competitiveAdvantage: 'Strategic location, established infrastructure, and strong technical capabilities',
      annualRevenue: 5000000000, // $5 billion AUD
      employeeCount: 5000,
      riskProfile: 'HIGH',
      operationalStreams: ['CHEMICAL_MANUFACTURING', 'QUALITY_CONTROL', 'DISTRIBUTION'],
      complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'CHEMICAL_ACT'],
      regulatoryFramework: ['ISO_14001', 'ISO_9001', 'RESPONSIBLE_CARE'],
      status: 'DRAFT',
      isActive: true
    }
  })

  // Get chemical facility types
  const chemicalFacilityTypes = facilityTypes.filter(ft => 
    ['CHEMICAL_PLANT', 'REACTOR_UNIT', 'STORAGE_TANK_FARM', 'LABORATORY'].includes(ft.code)
  )

  // Create facility type associations for chemical manufacturing
  for (const facilityType of chemicalFacilityTypes) {
    await prisma.businessCanvasFacilityTypes.create({
      data: {
        businessCanvasId: chemicalCanvas.id,
        facilityTypeId: facilityType.id,
        isAutoApplied: false
      }
    })
  }

  console.log(`✅ Created ${4} business canvases with facility type associations`)
  console.log(`  - Major Mining: ${miningFacilityTypes.length} facility types`)
  console.log(`  - Oil & Gas: ${oilGasFacilityTypes.length} facility types`)
  console.log(`  - Junior Mining: ${juniorFacilityTypes.length} facility types`)
  console.log(`  - Chemical: ${chemicalFacilityTypes.length} facility types`)
} 