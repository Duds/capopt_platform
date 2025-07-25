import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seed/users'
import { seedControls } from './seed/controls'
import { seedOperational } from './seed/operational'

const prisma = new PrismaClient()

async function main() {
  console.warn('⚠️  Using legacy seed.ts - consider migrating to modular seeding')
  console.warn('📚 New modular seed available at: prisma/seed/index.ts')
  console.warn('🔧 Run: npm run db:seed:test for testing environment')
  console.warn('🚀 Run: npm run db:seed:dev for development environment')
  
  console.log('🌱 Starting legacy database seeding...')

  try {
    // Use the new modular seeding functions
    await seedUsers(prisma)
    await seedControls(prisma)
    await seedOperational(prisma)
    
    console.log('✅ Legacy seeding completed successfully')
  } catch (error) {
    console.error('❌ Legacy seeding failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 