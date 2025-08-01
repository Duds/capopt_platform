import { PrismaClient } from '@prisma/client'
import { seedFacilityTypes } from '../prisma/seed/master-data/facility-types'
import { seedOperationalStreams } from '../prisma/seed/master-data/operational-streams'
import { seedRegulatoryFrameworks } from '../prisma/seed/master-data/regulatory-frameworks'
import { seedBusinessTestData } from '../prisma/seed/test-data/business-records'
import { seedBusinessCanvasTestData } from '../prisma/seed/test-data/business-canvases'

const prisma = new PrismaClient()

async function seedMasterData() {
  console.log('🌱 Starting comprehensive data seeding...')

  try {
    // Phase 1: Master Data
    console.log('\n📋 Phase 1: Seeding master data...')
    await seedFacilityTypes(prisma)
    await seedOperationalStreams(prisma)
    await seedRegulatoryFrameworks(prisma)
    
    // Phase 2: Business Test Data
    console.log('\n🏢 Phase 2: Seeding business test data...')
    await seedBusinessTestData(prisma)
    
    // Phase 3: Business Canvas Test Data
    console.log('\n📊 Phase 3: Seeding business canvas test data...')
    await seedBusinessCanvasTestData(prisma)
    
    console.log('\n✅ Comprehensive data seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}

seedMasterData()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 