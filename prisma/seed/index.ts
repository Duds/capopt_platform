import { PrismaClient } from '@prisma/client'
import { seedUsers } from './users'
import { seedEnterprise } from './enterprise'
import { seedControls } from './controls'
import { seedOperational } from './operational'
import { seedStrategic } from './strategic'
import { seedCanvasTemplates } from './templates/canvas-templates'
import { seedIndustries } from './industries'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed in dependency order
    await seedUsers(prisma)
    await seedIndustries()
    await seedEnterprise(prisma)
    await seedControls(prisma)
    await seedOperational(prisma)
    await seedStrategic(prisma)
    await seedCanvasTemplates(prisma)

    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 