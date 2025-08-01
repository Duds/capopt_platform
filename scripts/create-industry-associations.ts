import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createIndustryAssociations() {
  console.log('🔄 Creating industry associations...')

  try {
    // Get all industries
    const industries = await prisma.industry.findMany()
    console.log(`Processing ${industries.length} industries`)

    for (const industry of industries) {
      console.log(`Processing industry: ${industry.name}`)

      // Create facility type associations
      const industryFacilityTypes = await prisma.industryFacilityTypes.findMany({
        where: { industryId: industry.id }
      })

      console.log(`Found ${industryFacilityTypes.length} facility types for ${industry.name}`)

      for (const ift of industryFacilityTypes) {
        const facilityType = await prisma.facilityTypeMaster.findUnique({
          where: { code: ift.facilityTypeCode }
        })

        if (facilityType) {
          await prisma.industryFacilityTypeAssociation.upsert({
            where: {
              industryId_facilityTypeId: {
                industryId: industry.id,
                facilityTypeId: facilityType.id
              }
            },
            update: {
              riskProfile: ift.riskProfile,
              customName: ift.facilityTypeName !== facilityType.name ? ift.facilityTypeName : null,
              customDescription: ift.description,
              sortOrder: ift.sortOrder
            },
            create: {
              industryId: industry.id,
              facilityTypeId: facilityType.id,
              riskProfile: ift.riskProfile,
              customName: ift.facilityTypeName !== facilityType.name ? ift.facilityTypeName : null,
              customDescription: ift.description,
              sortOrder: ift.sortOrder
            }
          })
        } else {
          console.warn(`⚠️ Facility type ${ift.facilityTypeCode} not found in master table`)
        }
      }

      // Create operational stream associations
      const industryOperationalStreams = await prisma.industryOperationalStreams.findMany({
        where: { industryId: industry.id }
      })

      console.log(`Found ${industryOperationalStreams.length} operational streams for ${industry.name}`)

      for (const ios of industryOperationalStreams) {
        const streamCode = ios.streamName.toUpperCase().replace(/\s+/g, '_')
        const operationalStream = await prisma.operationalStream.findUnique({
          where: { code: streamCode }
        })

        if (operationalStream) {
          // Find sector if specified
          let sectorId = null
          if (ios.sector) {
            const sector = await prisma.sector.findFirst({
              where: { 
                industryId: industry.id,
                code: ios.sector
              }
            })
            sectorId = sector?.id || null
          }

          // Check if association already exists
          const existingAssociation = await prisma.industryOperationalStreamAssociation.findFirst({
            where: {
              industryId: industry.id,
              sectorId: sectorId,
              operationalStreamId: operationalStream.id
            }
          })

          if (existingAssociation) {
            await prisma.industryOperationalStreamAssociation.update({
              where: { id: existingAssociation.id },
              data: {
                customName: ios.streamName !== operationalStream.name ? ios.streamName : null,
                customDescription: ios.description,
                sortOrder: ios.sortOrder
              }
            })
          } else {
            await prisma.industryOperationalStreamAssociation.create({
              data: {
                industryId: industry.id,
                sectorId: sectorId,
                operationalStreamId: operationalStream.id,
                customName: ios.streamName !== operationalStream.name ? ios.streamName : null,
                customDescription: ios.description,
                sortOrder: ios.sortOrder
              }
            })
          }
        } else {
          console.warn(`⚠️ Operational stream ${streamCode} not found in master table`)
        }
      }

      // Create compliance requirement associations
      const industryComplianceFrameworks = await prisma.industryComplianceFramework.findMany({
        where: { industryId: industry.id }
      })

      console.log(`Found ${industryComplianceFrameworks.length} compliance frameworks for ${industry.name}`)

      for (const icf of industryComplianceFrameworks) {
        const requirements = icf.complianceRequirements as string[]
        
        for (const requirement of requirements) {
          const requirementCode = requirement.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
          const complianceRequirement = await prisma.complianceRequirement.findUnique({
            where: { code: requirementCode }
          })

                     if (complianceRequirement) {
             // Check if association already exists
             const existingAssociation = await prisma.industryComplianceRequirementAssociation.findFirst({
               where: {
                 industryId: industry.id,
                 sectorId: null,
                 complianceRequirementId: complianceRequirement.id
               }
             })

             if (existingAssociation) {
               await prisma.industryComplianceRequirementAssociation.update({
                 where: { id: existingAssociation.id },
                 data: {
                   priority: 'MEDIUM',
                   sortOrder: 0
                 }
               })
             } else {
               await prisma.industryComplianceRequirementAssociation.create({
                 data: {
                   industryId: industry.id,
                   sectorId: null,
                   complianceRequirementId: complianceRequirement.id,
                   priority: 'MEDIUM',
                   sortOrder: 0
                 }
               })
             }
           } else {
            console.warn(`⚠️ Compliance requirement ${requirementCode} not found in master table`)
          }
        }

        // Create regulatory framework associations
        const regulatory = icf.regulatoryFramework as any
        const allFrameworks = [
          ...(regulatory.Federal || []),
          ...(regulatory.State || []),
          ...(regulatory.Industry || []),
          ...(regulatory.International || [])
        ]

        for (const framework of allFrameworks) {
          const frameworkCode = framework.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')
          const regulatoryFramework = await prisma.regulatoryFramework.findUnique({
            where: { code: frameworkCode }
          })

                     if (regulatoryFramework) {
             // Check if association already exists
             const existingAssociation = await prisma.industryRegulatoryFrameworkAssociation.findFirst({
               where: {
                 industryId: industry.id,
                 sectorId: null,
                 regulatoryFrameworkId: regulatoryFramework.id
               }
             })

             if (existingAssociation) {
               await prisma.industryRegulatoryFrameworkAssociation.update({
                 where: { id: existingAssociation.id },
                 data: {
                   priority: 'MEDIUM',
                   sortOrder: 0
                 }
               })
             } else {
               await prisma.industryRegulatoryFrameworkAssociation.create({
                 data: {
                   industryId: industry.id,
                   sectorId: null,
                   regulatoryFrameworkId: regulatoryFramework.id,
                   priority: 'MEDIUM',
                   sortOrder: 0
                 }
               })
             }
           } else {
            console.warn(`⚠️ Regulatory framework ${frameworkCode} not found in master table`)
          }
        }
      }
    }

    console.log('✅ Industry associations created successfully')

  } catch (error) {
    console.error('❌ Error creating industry associations:', error)
    throw error
  }
}

createIndustryAssociations()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 