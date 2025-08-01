import { PrismaClient } from '@prisma/client'

export async function seedFacilityTypes(prisma: PrismaClient) {
  console.log('🏭 Seeding facility types...')

  const facilityTypesData = [
    // Mining & Metals Industry
    {
      industryCode: 'MINING_METALS',
      facilityTypes: [
        // Extraction Facilities
        { code: 'OPEN_PIT_MINE', name: 'Open Pit Mine', category: 'EXTRACTION', riskProfile: 'HIGH' },
        { code: 'UNDERGROUND_MINE', name: 'Underground Mine', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
        { code: 'PLACER_MINE', name: 'Placer Mine', category: 'EXTRACTION', riskProfile: 'MEDIUM' },
        { code: 'IN_SITU_MINE', name: 'In-Situ Mine', category: 'EXTRACTION', riskProfile: 'HIGH' },
        
        // Processing Facilities
        { code: 'CRUSHING_PLANT', name: 'Crushing Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'GRINDING_MILL', name: 'Grinding Mill', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'FLOTATION_PLANT', name: 'Flotation Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'LEACHING_PLANT', name: 'Leaching Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'SMELTER', name: 'Smelter', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'REFINERY', name: 'Refinery', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        
        // Infrastructure
        { code: 'POWER_STATION', name: 'Power Station', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'WATER_TREATMENT', name: 'Water Treatment Plant', category: 'INFRASTRUCTURE', riskProfile: 'MEDIUM' },
        { code: 'WASTE_MANAGEMENT', name: 'Waste Management Facility', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'WAREHOUSE', name: 'Warehouse', category: 'INFRASTRUCTURE', riskProfile: 'LOW' },
        
        // Support Facilities
        { code: 'OFFICE', name: 'Office Complex', category: 'SUPPORT', riskProfile: 'LOW' },
        { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'WORKSHOP', name: 'Workshop', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'TRAINING_CENTER', name: 'Training Center', category: 'SUPPORT', riskProfile: 'LOW' }
      ]
    },

    // Oil & Gas Industry
    {
      industryCode: 'OIL_GAS',
      facilityTypes: [
        // Extraction Facilities
        { code: 'ONSHORE_WELL', name: 'Onshore Well', category: 'EXTRACTION', riskProfile: 'HIGH' },
        { code: 'OFFSHORE_PLATFORM', name: 'Offshore Platform', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
        { code: 'FRACKING_SITE', name: 'Fracking Site', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
        { code: 'GAS_PLANT', name: 'Gas Plant', category: 'EXTRACTION', riskProfile: 'HIGH' },
        
        // Processing Facilities
        { code: 'REFINERY', name: 'Oil Refinery', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'CRACKING_UNIT', name: 'Cracking Unit', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'DISTILLATION_TOWER', name: 'Distillation Tower', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'COMPRESSOR_STATION', name: 'Compressor Station', category: 'PROCESSING', riskProfile: 'HIGH' },
        
        // Infrastructure
        { code: 'PIPELINE_TERMINAL', name: 'Pipeline Terminal', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'STORAGE_TANK_FARM', name: 'Storage Tank Farm', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'LNG_TERMINAL', name: 'LNG Terminal', category: 'INFRASTRUCTURE', riskProfile: 'CRITICAL' },
        { code: 'POWER_STATION', name: 'Power Station', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        
        // Support Facilities
        { code: 'CONTROL_ROOM', name: 'Control Room', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'OFFICE', name: 'Office Complex', category: 'SUPPORT', riskProfile: 'LOW' }
      ]
    },

    // Chemicals Industry
    {
      industryCode: 'CHEMICALS',
      facilityTypes: [
        // Processing Facilities
        { code: 'CHEMICAL_PLANT', name: 'Chemical Plant', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'REACTOR_UNIT', name: 'Reactor Unit', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'DISTILLATION_PLANT', name: 'Distillation Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'POLYMERIZATION_PLANT', name: 'Polymerization Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
        
        // Infrastructure
        { code: 'STORAGE_TANK_FARM', name: 'Storage Tank Farm', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'PIPELINE_NETWORK', name: 'Pipeline Network', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'WASTE_TREATMENT', name: 'Waste Treatment Plant', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'WAREHOUSE', name: 'Warehouse', category: 'INFRASTRUCTURE', riskProfile: 'MEDIUM' },
        
        // Support Facilities
        { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'CONTROL_ROOM', name: 'Control Room', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'OFFICE', name: 'Office Complex', category: 'SUPPORT', riskProfile: 'LOW' }
      ]
    },

    // Manufacturing Industry
    {
      industryCode: 'MANUFACTURING',
      facilityTypes: [
        // Processing Facilities
        { code: 'ASSEMBLY_PLANT', name: 'Assembly Plant', category: 'PROCESSING', riskProfile: 'MEDIUM' },
        { code: 'FABRICATION_PLANT', name: 'Fabrication Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'PRODUCTION_LINE', name: 'Production Line', category: 'PROCESSING', riskProfile: 'MEDIUM' },
        { code: 'QUALITY_CONTROL', name: 'Quality Control Facility', category: 'PROCESSING', riskProfile: 'LOW' },
        
        // Infrastructure
        { code: 'WAREHOUSE', name: 'Warehouse', category: 'INFRASTRUCTURE', riskProfile: 'LOW' },
        { code: 'DISTRIBUTION_CENTER', name: 'Distribution Center', category: 'INFRASTRUCTURE', riskProfile: 'LOW' },
        { code: 'MAINTENANCE_SHOP', name: 'Maintenance Shop', category: 'INFRASTRUCTURE', riskProfile: 'MEDIUM' },
        
        // Support Facilities
        { code: 'OFFICE', name: 'Office Complex', category: 'SUPPORT', riskProfile: 'LOW' },
        { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'TRAINING_CENTER', name: 'Training Center', category: 'SUPPORT', riskProfile: 'LOW' }
      ]
    },

    // Defence Industry
    {
      industryCode: 'DEFENCE',
      facilityTypes: [
        // Processing Facilities
        { code: 'WEAPONS_FACTORY', name: 'Weapons Factory', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'MUNITIONS_PLANT', name: 'Munitions Plant', category: 'PROCESSING', riskProfile: 'CRITICAL' },
        { code: 'ELECTRONICS_FACTORY', name: 'Electronics Factory', category: 'PROCESSING', riskProfile: 'HIGH' },
        { code: 'TESTING_FACILITY', name: 'Testing Facility', category: 'PROCESSING', riskProfile: 'HIGH' },
        
        // Infrastructure
        { code: 'SECURE_STORAGE', name: 'Secure Storage Facility', category: 'INFRASTRUCTURE', riskProfile: 'CRITICAL' },
        { code: 'COMMUNICATIONS_CENTER', name: 'Communications Center', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        { code: 'POWER_STATION', name: 'Power Station', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
        
        // Support Facilities
        { code: 'SECURITY_OFFICE', name: 'Security Office', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
        { code: 'TRAINING_FACILITY', name: 'Training Facility', category: 'SUPPORT', riskProfile: 'MEDIUM' }
      ]
    }
  ]

  try {
    for (const industryData of facilityTypesData) {
      const industry = await prisma.industry.findUnique({
        where: { code: industryData.industryCode }
      })

      if (!industry) {
        console.warn(`⚠️ Industry ${industryData.industryCode} not found, skipping facility types`)
        continue
      }

      console.log(`🏭 Seeding facility types for ${industry.name}...`)

      for (const facilityType of industryData.facilityTypes) {
        await prisma.industryFacilityTypes.upsert({
          where: {
            industryId_facilityTypeCode: {
              industryId: industry.id,
              facilityTypeCode: facilityType.code
            }
          },
          update: {
            facilityTypeName: facilityType.name,
            category: facilityType.category,
            riskProfile: facilityType.riskProfile,
            updatedAt: new Date()
          },
          create: {
            industryId: industry.id,
            facilityTypeCode: facilityType.code,
            facilityTypeName: facilityType.name,
            category: facilityType.category,
            riskProfile: facilityType.riskProfile,
            description: `${facilityType.name} for ${industry.name} industry`,
            sortOrder: 0
          }
        })
      }

      console.log(`✅ Created/updated ${industryData.facilityTypes.length} facility types for ${industry.name}`)
    }

    console.log('✅ Facility types seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding facility types:', error)
    throw error
  }
} 