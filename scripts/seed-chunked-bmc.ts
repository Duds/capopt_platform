import { PrismaClient } from '@prisma/client'
import { ChunkedBMCSeedingStrategy } from '../prisma/seed/strategies/chunked-bmc-seeding'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Starting chunked BMC seeding...')

  try {
    const strategy = new ChunkedBMCSeedingStrategy()
    
    // Execute all chunks in dependency order
    const results = await strategy.executeChunked(prisma, {
      environment: 'development',
      includeTestData: true,
      includeSampleData: true,
      defaultPassword: 'password123',
      cleanupBeforeSeed: false
    })

    // Print summary
    console.log('\n📊 Chunked BMC Seeding Summary:')
    console.log('================================')
    
    let totalCreated = 0
    let totalUpdated = 0
    let successCount = 0
    let failureCount = 0

    for (const result of results) {
      if (result.success) {
        successCount++
        totalCreated += result.entitiesCreated
        totalUpdated += result.entitiesUpdated
        console.log(`✅ ${result.message} - Created: ${result.entitiesCreated}, Updated: ${result.entitiesUpdated}`)
      } else {
        failureCount++
        console.log(`❌ ${result.message}`)
        if (result.errors) {
          result.errors.forEach(error => console.log(`   - ${error}`))
        }
      }
    }

    console.log('\n📈 Final Summary:')
    console.log(`   - Successful chunks: ${successCount}`)
    console.log(`   - Failed chunks: ${failureCount}`)
    console.log(`   - Total entities created: ${totalCreated}`)
    console.log(`   - Total entities updated: ${totalUpdated}`)

    // Print database counts
    console.log('\n🗄️ Database Counts:')
    console.log(`   - Business Canvases: ${await prisma.businessCanvas.count()}`)
    console.log(`   - Value Propositions: ${await prisma.valueProposition.count()}`)
    console.log(`   - Customer Segments: ${await prisma.customerSegment.count()}`)
    console.log(`   - Channels: ${await prisma.channel.count()}`)
    console.log(`   - Revenue Streams: ${await prisma.revenueStream.count()}`)
    console.log(`   - Resources: ${await prisma.resource.count()}`)
    console.log(`   - Activities: ${await prisma.activity.count()}`)
    console.log(`   - Partnerships: ${await prisma.partnership.count()}`)
    console.log(`   - Cost Structures: ${await prisma.costStructure.count()}`)

  } catch (error) {
    console.error('❌ Error during chunked BMC seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Chunked BMC seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 