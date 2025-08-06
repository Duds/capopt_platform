import { PrismaClient } from '@prisma/client'
import { seedHerculesLeveeBMC } from '../prisma/seed/hercules-levee-bmc'

const prisma = new PrismaClient()

async function main() {
  console.log('🏭 Seeding Hercules Levee BMC with Resources...')
  
  try {
    await seedHerculesLeveeBMC(prisma)
    console.log('✅ Hercules Levee BMC Resources seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding Hercules Levee BMC:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e)
    process.exit(1)
  }) 