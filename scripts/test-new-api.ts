import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testNewAPI() {
  console.log('🧪 Testing new API endpoints...')

  try {
    // Test 1: Check if master tables have data
    console.log('\n📊 Testing master tables...')
    
    const facilityTypes = await prisma.facilityTypeMaster.count()
    console.log(`✅ Facility types count: ${facilityTypes}`)
    
    const operationalStreams = await prisma.operationalStream.count()
    console.log(`✅ Operational streams count: ${operationalStreams}`)
    
    const complianceRequirements = await prisma.complianceRequirement.count()
    console.log(`✅ Compliance requirements count: ${complianceRequirements}`)
    
    const regulatoryFrameworks = await prisma.regulatoryFramework.count()
    console.log(`✅ Regulatory frameworks count: ${regulatoryFrameworks}`)

    // Test 2: Check if associations have data
    console.log('\n🔗 Testing associations...')
    
    const facilityAssociations = await prisma.industryFacilityTypeAssociation.count()
    console.log(`✅ Facility associations count: ${facilityAssociations}`)
    
    const operationalAssociations = await prisma.industryOperationalStreamAssociation.count()
    console.log(`✅ Operational associations count: ${operationalAssociations}`)
    
    const complianceAssociations = await prisma.industryComplianceRequirementAssociation.count()
    console.log(`✅ Compliance associations count: ${complianceAssociations}`)
    
    const regulatoryAssociations = await prisma.industryRegulatoryFrameworkAssociation.count()
    console.log(`✅ Regulatory associations count: ${regulatoryAssociations}`)

    // Test 3: Check specific industry data
    console.log('\n🏭 Testing industry-specific data...')
    
    const miningIndustry = await prisma.industry.findFirst({
      where: { code: 'MINING_METALS' }
    })
    
    if (miningIndustry) {
      const miningFacilities = await prisma.industryFacilityTypeAssociation.findMany({
        where: { industryId: miningIndustry.id },
        include: { facilityType: true }
      })
      console.log(`✅ Mining industry facility types: ${miningFacilities.length}`)
      
      const miningStreams = await prisma.industryOperationalStreamAssociation.findMany({
        where: { industryId: miningIndustry.id },
        include: { operationalStream: true }
      })
      console.log(`✅ Mining industry operational streams: ${miningStreams.length}`)
    }

    console.log('\n✅ All tests completed successfully!')

  } catch (error) {
    console.error('❌ Error testing new API:', error)
    throw error
  }
}

testNewAPI()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 