import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateCommonElements() {
  console.log('🔄 Starting common elements migration...')

  try {
    // Extract unique facility types
    console.log('📊 Extracting facility types...')
    const facilityTypes = await prisma.industryFacilityTypes.findMany({
      select: {
        facilityTypeCode: true,
        facilityTypeName: true,
        description: true,
        category: true,
        riskProfile: true
      }
    })

    const uniqueFacilityTypes = facilityTypes.reduce((acc, ft) => {
      const key = ft.facilityTypeCode
      if (!acc[key]) {
        acc[key] = ft
      }
      return acc
    }, {})

    console.log(`Found ${Object.keys(uniqueFacilityTypes).length} unique facility types`)

    // Create master facility types
    for (const [code, facilityType] of Object.entries(uniqueFacilityTypes)) {
      await prisma.facilityTypeMaster.upsert({
        where: { code },
        update: {
          name: facilityType.facilityTypeName,
          description: facilityType.description,
          category: facilityType.category,
          riskProfile: facilityType.riskProfile
        },
        create: {
          code,
          name: facilityType.facilityTypeName,
          description: facilityType.description,
          category: facilityType.category,
          riskProfile: facilityType.riskProfile
        }
      })
    }

    console.log(`✅ Created ${Object.keys(uniqueFacilityTypes).length} facility types`)

    // Extract unique operational streams
    console.log('📊 Extracting operational streams...')
    const operationalStreams = await prisma.industryOperationalStreams.findMany({
      select: {
        streamName: true,
        description: true,
        category: true
      }
    })

    const uniqueOperationalStreams = operationalStreams.reduce((acc, os) => {
      const key = os.streamName
      if (!acc[key]) {
        acc[key] = os
      }
      return acc
    }, {})

    console.log(`Found ${Object.keys(uniqueOperationalStreams).length} unique operational streams`)

    // Create master operational streams
    for (const [name, stream] of Object.entries(uniqueOperationalStreams)) {
      const code = name.toUpperCase().replace(/\s+/g, '_')
      await prisma.operationalStream.upsert({
        where: { code },
        update: {
          name: stream.streamName,
          description: stream.description,
          category: stream.category
        },
        create: {
          code,
          name: stream.streamName,
          description: stream.description,
          category: stream.category
        }
      })
    }

    console.log(`✅ Created ${Object.keys(uniqueOperationalStreams).length} operational streams`)

    // Extract unique compliance requirements
    console.log('📊 Extracting compliance requirements...')
    const complianceFrameworks = await prisma.industryComplianceFramework.findMany({
      select: {
        complianceRequirements: true
      }
    })

    const allComplianceRequirements = new Set<string>()
    for (const framework of complianceFrameworks) {
      const requirements = framework.complianceRequirements as string[]
      requirements.forEach(req => allComplianceRequirements.add(req))
    }

    console.log(`Found ${allComplianceRequirements.size} unique compliance requirements`)

    // Create master compliance requirements
    for (const requirement of allComplianceRequirements) {
      const code = requirement.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
      const category = requirement.includes('Act') ? 'FEDERAL' : 
                      requirement.includes('ISO') ? 'INDUSTRY' : 
                      requirement.includes('ICMM') ? 'INDUSTRY' : 'STATE'
      const jurisdiction = category === 'FEDERAL' || category === 'STATE' ? 'AUSTRALIA' : 'INTERNATIONAL'

      await prisma.complianceRequirement.upsert({
        where: { code },
        update: {
          name: requirement,
          category,
          jurisdiction
        },
        create: {
          code,
          name: requirement,
          category,
          jurisdiction
        }
      })
    }

    console.log(`✅ Created ${allComplianceRequirements.size} compliance requirements`)

    // Extract unique regulatory frameworks
    console.log('📊 Extracting regulatory frameworks...')
    const allRegulatoryFrameworks = new Set<string>()
    for (const framework of complianceFrameworks) {
      const regulatory = framework.regulatoryFramework as any
      if (regulatory && typeof regulatory === 'object') {
        if (regulatory.Federal && Array.isArray(regulatory.Federal)) {
          regulatory.Federal.forEach((f: string) => allRegulatoryFrameworks.add(f))
        }
        if (regulatory.State && Array.isArray(regulatory.State)) {
          regulatory.State.forEach((s: string) => allRegulatoryFrameworks.add(s))
        }
        if (regulatory.Industry && Array.isArray(regulatory.Industry)) {
          regulatory.Industry.forEach((i: string) => allRegulatoryFrameworks.add(i))
        }
        if (regulatory.International && Array.isArray(regulatory.International)) {
          regulatory.International.forEach((int: string) => allRegulatoryFrameworks.add(int))
        }
      }
    }

    console.log(`Found ${allRegulatoryFrameworks.size} unique regulatory frameworks`)

    // Create master regulatory frameworks
    for (const framework of allRegulatoryFrameworks) {
      const code = framework.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
      const category = framework.includes('ISO') ? 'ISO' : 
                      framework.includes('ICMM') ? 'INDUSTRY' : 
                      framework.includes('Act') ? 'FEDERAL' : 'INTERNATIONAL'
      const jurisdiction = category === 'FEDERAL' ? 'AUSTRALIA' : 'INTERNATIONAL'

      await prisma.regulatoryFramework.upsert({
        where: { code },
        update: {
          name: framework,
          category,
          jurisdiction
        },
        create: {
          code,
          name: framework,
          category,
          jurisdiction
        }
      })
    }

    console.log(`✅ Created ${allRegulatoryFrameworks.size} regulatory frameworks`)

    console.log('✅ Common elements migration completed successfully!')

  } catch (error) {
    console.error('❌ Error during common elements migration:', error)
    throw error
  }
}

migrateCommonElements()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 