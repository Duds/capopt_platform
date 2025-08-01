import { PrismaClient } from '@prisma/client'

export async function seedFacilityTypes(prisma: PrismaClient) {
  console.log('🏭 Seeding master facility types...')

  const facilityTypes = [
    // Extraction Facilities
    { code: 'OPEN_PIT_MINE', name: 'Open Pit Mine', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'UNDERGROUND_MINE', name: 'Underground Mine', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
    { code: 'PLACER_MINE', name: 'Placer Mine', category: 'EXTRACTION', riskProfile: 'MEDIUM' },
    { code: 'IN_SITU_MINE', name: 'In-Situ Mine', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'ONSHORE_WELL', name: 'Onshore Well', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'OFFSHORE_PLATFORM', name: 'Offshore Platform', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
    { code: 'FRACKING_SITE', name: 'Fracking Site', category: 'EXTRACTION', riskProfile: 'CRITICAL' },
    { code: 'GAS_PLANT', name: 'Gas Plant', category: 'EXTRACTION', riskProfile: 'HIGH' },
    { code: 'DRILLING_RIG', name: 'Drilling Rig', category: 'EXTRACTION', riskProfile: 'HIGH' },
    
    // Processing Facilities
    { code: 'CRUSHING_PLANT', name: 'Crushing Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'GRINDING_MILL', name: 'Grinding Mill', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'FLOTATION_PLANT', name: 'Flotation Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'LEACHING_PLANT', name: 'Leaching Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'SMELTER', name: 'Smelter', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'REFINERY', name: 'Refinery', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'CHEMICAL_PLANT', name: 'Chemical Plant', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'REACTOR_UNIT', name: 'Reactor Unit', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'DISTILLATION_PLANT', name: 'Distillation Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'POLYMERIZATION_PLANT', name: 'Polymerization Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'ASSEMBLY_PLANT', name: 'Assembly Plant', category: 'PROCESSING', riskProfile: 'MEDIUM' },
    { code: 'FABRICATION_PLANT', name: 'Fabrication Plant', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'PRODUCTION_LINE', name: 'Production Line', category: 'PROCESSING', riskProfile: 'MEDIUM' },
    { code: 'QUALITY_CONTROL', name: 'Quality Control Facility', category: 'PROCESSING', riskProfile: 'LOW' },
    { code: 'WEAPONS_FACTORY', name: 'Weapons Factory', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'MUNITIONS_PLANT', name: 'Munitions Plant', category: 'PROCESSING', riskProfile: 'CRITICAL' },
    { code: 'ELECTRONICS_FACTORY', name: 'Electronics Factory', category: 'PROCESSING', riskProfile: 'HIGH' },
    { code: 'TESTING_FACILITY', name: 'Testing Facility', category: 'PROCESSING', riskProfile: 'HIGH' },
    
    // Infrastructure
    { code: 'POWER_STATION', name: 'Power Station', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'WATER_TREATMENT', name: 'Water Treatment Plant', category: 'INFRASTRUCTURE', riskProfile: 'MEDIUM' },
    { code: 'WASTE_MANAGEMENT', name: 'Waste Management Facility', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'STORAGE_TANK_FARM', name: 'Storage Tank Farm', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'PIPELINE_TERMINAL', name: 'Pipeline Terminal', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'LNG_TERMINAL', name: 'LNG Terminal', category: 'INFRASTRUCTURE', riskProfile: 'CRITICAL' },
    { code: 'PIPELINE_NETWORK', name: 'Pipeline Network', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'WASTE_TREATMENT', name: 'Waste Treatment Plant', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    { code: 'WAREHOUSE', name: 'Warehouse', category: 'INFRASTRUCTURE', riskProfile: 'LOW' },
    { code: 'DISTRIBUTION_CENTER', name: 'Distribution Center', category: 'INFRASTRUCTURE', riskProfile: 'LOW' },
    { code: 'MAINTENANCE_SHOP', name: 'Maintenance Shop', category: 'INFRASTRUCTURE', riskProfile: 'MEDIUM' },
    { code: 'SECURE_STORAGE', name: 'Secure Storage Facility', category: 'INFRASTRUCTURE', riskProfile: 'CRITICAL' },
    { code: 'COMMUNICATIONS_CENTER', name: 'Communications Center', category: 'INFRASTRUCTURE', riskProfile: 'HIGH' },
    
    // Support Facilities
    { code: 'OFFICE', name: 'Office Complex', category: 'SUPPORT', riskProfile: 'LOW' },
    { code: 'LABORATORY', name: 'Laboratory', category: 'SUPPORT', riskProfile: 'MEDIUM' },
    { code: 'WORKSHOP', name: 'Workshop', category: 'SUPPORT', riskProfile: 'MEDIUM' },
    { code: 'TRAINING_CENTER', name: 'Training Center', category: 'SUPPORT', riskProfile: 'LOW' },
    { code: 'CONTROL_ROOM', name: 'Control Room', category: 'SUPPORT', riskProfile: 'MEDIUM' },
    { code: 'SECURITY_OFFICE', name: 'Security Office', category: 'SUPPORT', riskProfile: 'MEDIUM' },
    { code: 'TRAINING_FACILITY', name: 'Training Facility', category: 'SUPPORT', riskProfile: 'MEDIUM' }
  ]

  for (const facilityType of facilityTypes) {
    await prisma.facilityTypeMaster.upsert({
      where: { code: facilityType.code },
      update: facilityType,
      create: facilityType
    })
  }

  console.log(`✅ Created ${facilityTypes.length} facility types`)
} 