import { PrismaClient } from '@prisma/client'
import { SeedOptions, SeedResult } from '../config/types'
import { seedRiskCategories } from './risk-categories'
import { seedCriticalControls } from './critical-controls'

export async function seedControls(prisma: PrismaClient, options?: SeedOptions): Promise<SeedResult> {
  console.log('🛡️ Seeding controls...')
  
  try {
    let entitiesCreated = 0
    let entitiesUpdated = 0
    
    // Seed risk categories first (dependency)
    await seedRiskCategories(prisma, options)
    entitiesCreated += 6 // 6 risk categories
    
    // Seed critical controls
    await seedCriticalControls(prisma, options)
    entitiesCreated += 4 // 4 critical controls
    
    console.log('✅ Controls seeded successfully')
    
    return {
      success: true,
      message: 'Controls seeded successfully',
      entitiesCreated,
      entitiesUpdated,
    }
  } catch (error) {
    console.error('❌ Error seeding controls:', error)
    return {
      success: false,
      message: 'Failed to seed controls',
      entitiesCreated: 0,
      entitiesUpdated: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
} 