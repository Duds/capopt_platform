import { PrismaClient } from '@prisma/client'
import { SeedOptions, SeedResult } from '../config/types'
import { seedProcesses } from './processes'
import { seedOperationalStreams } from './operational-streams'

export async function seedOperational(prisma: PrismaClient, options?: SeedOptions): Promise<SeedResult> {
  console.log('⚙️ Seeding operational layer...')
  
  try {
    let entitiesCreated = 0
    let entitiesUpdated = 0
    
    // Seed basic processes
    const processesResult = await seedProcesses(prisma, options)
    entitiesCreated += processesResult.entitiesCreated || 0
    entitiesUpdated += processesResult.entitiesUpdated || 0
    
    // Seed operational streams
    const streamsResult = await seedOperationalStreams(prisma, options)
    entitiesCreated += streamsResult.entitiesCreated || 0
    entitiesUpdated += streamsResult.entitiesUpdated || 0
    
    console.log('✅ Operational layer seeded successfully')
    
    return {
      success: true,
      message: 'Operational layer seeded successfully',
      entitiesCreated,
      entitiesUpdated,
    }
  } catch (error) {
    console.error('❌ Error seeding operational layer:', error)
    return {
      success: false,
      message: 'Failed to seed operational layer',
      entitiesCreated: 0,
      entitiesUpdated: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
} 