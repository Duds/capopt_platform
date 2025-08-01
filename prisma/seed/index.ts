import { PrismaClient } from '@prisma/client'
import { seedIndustries } from './industries'
import { seedBusinessCanvases } from './business-canvases'
import { PatternAnalysisService } from '@/lib/services/pattern-analysis'
import { OperationalStreamStandardizer } from '@/lib/services/operational-stream-standardizer'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed core data using existing structure
    await seedIndustries()
    await seedBusinessCanvases(prisma)

    // Initialize pattern analysis
    console.log('🔍 Initializing pattern analysis...')
    const patternAnalysisService = new PatternAnalysisService()
    
    // Analyze existing canvases and generate patterns
    const analysisResult = await patternAnalysisService.analyzeExistingCanvases()
    console.log(`📊 Pattern analysis completed: ${analysisResult.statistics.patternsGenerated} patterns generated`)
    
    // Save patterns to database
    await patternAnalysisService.savePatterns(analysisResult.patterns)
    
    // Generate facility patterns from industry associations
    const facilityPatterns = await patternAnalysisService.generateFacilityPatterns()
    await patternAnalysisService.savePatterns(facilityPatterns)

    // Standardize operational streams
    console.log('🔄 Standardizing operational streams...')
    const streamStandardizer = new OperationalStreamStandardizer()
    await streamStandardizer.standardizeStreamNames()
    await streamStandardizer.validateStreamRelevance()
    await streamStandardizer.cleanupStreams()

    console.log('✅ Database seeding completed successfully!')
    console.log('📈 Summary:')
    console.log(`  - Industries: ${await prisma.industry.count()}`)
    console.log(`  - Sectors: ${await prisma.sector.count()}`)
    console.log(`  - Facility Types: ${await prisma.facilityTypeMaster.count()}`)
    console.log(`  - Operational Streams: ${await prisma.operationalStream.count()}`)
    console.log(`  - Compliance Frameworks: ${await prisma.complianceRequirement.count()}`)
    console.log(`  - Business Canvases: ${await prisma.businessCanvas.count()}`)
    console.log(`  - Assignment Patterns: ${await prisma.assignmentPattern.count()}`)

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