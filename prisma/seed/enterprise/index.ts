import { PrismaClient } from '@prisma/client'
import { SeedOptions, SeedResult } from '../config/types'
import { seedCrackedMountainPtyLtd } from './cracked-mountain'
import { seedHerculesLevee } from './hercules-levee'

export async function seedEnterprise(prisma: PrismaClient, options?: SeedOptions): Promise<SeedResult> {
  console.log('🏢 Seeding enterprise information...')
  
  try {
    let entitiesCreated = 0
    let entitiesUpdated = 0
    
    // Seed enterprise first
    const enterpriseResult = await seedCrackedMountainPtyLtd(prisma, options)
    entitiesCreated += enterpriseResult.entitiesCreated
    entitiesUpdated += enterpriseResult.entitiesUpdated
    
    // Seed facility
    const facilityResult = await seedHerculesLevee(prisma, options)
    entitiesCreated += facilityResult.entitiesCreated
    entitiesUpdated += facilityResult.entitiesUpdated
    
    console.log('✅ Enterprise information seeded successfully')
    
    return {
      success: true,
      message: 'Enterprise information seeded successfully',
      entitiesCreated,
      entitiesUpdated,
    }
  } catch (error) {
    console.error('❌ Error seeding enterprise information:', error)
    return {
      success: false,
      message: 'Failed to seed enterprise information',
      entitiesCreated: 0,
      entitiesUpdated: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
} 