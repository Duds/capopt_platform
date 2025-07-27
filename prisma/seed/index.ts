import { PrismaClient } from '@prisma/client'
import { getSeedConfig } from './config/environment'
import { SeedOptions } from './config/types'
import { cleanupDatabase } from './utils/cleanup'
import { seedEnterprise } from './enterprise'
import { seedUsers } from './users'
import { seedControls } from './controls'
import { seedOperational } from './operational'
import { seedStrategic } from './strategic'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting modular database seeding...')
  
  const config = getSeedConfig()
  console.log(`📋 Seed configuration:`, config)
  
  try {
    // Cleanup if required
    if (config.cleanupBeforeSeed) {
      await cleanupDatabase(prisma)
    }
    
    // Seed specific modules if specified
    if (config.seedSpecificModules && config.seedSpecificModules.length > 0) {
      console.log(`🎯 Seeding specific modules: ${config.seedSpecificModules.join(', ')}`)
      
      const seedModules: Record<string, (prisma: PrismaClient, options?: SeedOptions) => Promise<any>> = {
        enterprise: seedEnterprise,
        users: seedUsers,
        controls: seedControls,
        operational: seedOperational,
        strategic: seedStrategic,
      }
      
      for (const module of config.seedSpecificModules) {
        if (seedModules[module]) {
          const result = await seedModules[module](prisma, config)
          if (!result.success) {
            throw new Error(`Failed to seed module ${module}: ${result.message}`)
          }
        } else {
          console.warn(`⚠️ Unknown seed module: ${module}`)
        }
      }
    } else {
      // Seed all modules in dependency order
      console.log('🚀 Seeding all modules...')
      
      const enterpriseResult = await seedEnterprise(prisma, config)
      if (!enterpriseResult.success) {
        throw new Error(`Failed to seed enterprise: ${enterpriseResult.message}`)
      }
      
      const userResult = await seedUsers(prisma, config)
      if (!userResult.success) {
        throw new Error(`Failed to seed users: ${userResult.message}`)
      }
      
      const controlResult = await seedControls(prisma, config)
      if (!controlResult.success) {
        throw new Error(`Failed to seed controls: ${controlResult.message}`)
      }
      
      const operationalResult = await seedOperational(prisma, config)
      if (!operationalResult.success) {
        throw new Error(`Failed to seed operational layer: ${operationalResult.message}`)
      }
      
      const strategicResult = await seedStrategic(prisma, config)
      if (!strategicResult.success) {
        throw new Error(`Failed to seed strategic layer: ${strategicResult.message}`)
      }
      
      console.log('✅ All modules seeded successfully')
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Handle command line arguments
const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🌱 CapOpt Platform Seed Script

Usage:
  npm run seed                    # Seed all modules
  npm run seed:dev               # Development seeding
  npm run seed:test              # Testing seeding with cleanup
  npm run seed:enterprise        # Seed only enterprise
  npm run seed:users             # Seed only users
  npm run seed:controls          # Seed only controls
  npm run seed:operational       # Seed only operational layer

Environment Variables:
  NODE_ENV                       # Environment (development/testing/staging)
  SEED_MODULES                   # Comma-separated list of modules to seed
  SEED_DEFAULT_PASSWORD          # Default password for users
  `)
  process.exit(0)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 