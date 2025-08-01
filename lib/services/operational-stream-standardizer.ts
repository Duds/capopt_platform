import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface StreamMapping {
  oldCode: string
  newCode: string
  oldName: string
  newName: string
  category: string
  description?: string
}

export class OperationalStreamStandardizer {
  /**
   * Standardize operational stream names and codes
   */
  async standardizeStreamNames(): Promise<void> {
    console.log('🔄 Starting operational stream standardization...')

    // Define the mapping for case variations and standardizations
    const streamMappings: StreamMapping[] = [
      // Mining & Metals
      {
        oldCode: 'OPEN_PIT_MINING',
        newCode: 'open_pit_mining',
        oldName: 'OPEN PIT MINING',
        newName: 'Open Pit Mining',
        category: 'Mining Operations',
        description: 'Surface mining operations using open pit techniques'
      },
      {
        oldCode: 'UNDERGROUND_MINING',
        newCode: 'underground_mining',
        oldName: 'UNDERGROUND MINING',
        newName: 'Underground Mining',
        category: 'Mining Operations',
        description: 'Subsurface mining operations using underground techniques'
      },
      {
        oldCode: 'CRUSHING_AND_GRINDING',
        newCode: 'crushing_and_grinding',
        oldName: 'CRUSHING AND GRINDING',
        newName: 'Crushing and Grinding',
        category: 'Mineral Processing',
        description: 'Size reduction operations for ore processing'
      },
      {
        oldCode: 'FLOTATION',
        newCode: 'flotation',
        oldName: 'FLOTATION',
        newName: 'Flotation',
        category: 'Mineral Processing',
        description: 'Mineral separation using flotation techniques'
      },
      {
        oldCode: 'LEACHING',
        newCode: 'leaching',
        oldName: 'LEACHING',
        newName: 'Leaching',
        category: 'Mineral Processing',
        description: 'Chemical extraction of metals from ore'
      },
      {
        oldCode: 'SMELTING',
        newCode: 'smelting',
        oldName: 'SMELTING',
        newName: 'Smelting',
        category: 'Metallurgical Processing',
        description: 'High-temperature metal extraction process'
      },
      {
        oldCode: 'REFINING',
        newCode: 'refining',
        oldName: 'REFINING',
        newName: 'Refining',
        category: 'Metallurgical Processing',
        description: 'Purification of extracted metals'
      },

      // Oil & Gas
      {
        oldCode: 'EXPLORATION',
        newCode: 'exploration',
        oldName: 'EXPLORATION',
        newName: 'Exploration',
        category: 'Upstream Operations',
        description: 'Hydrocarbon exploration activities'
      },
      {
        oldCode: 'DRILLING',
        newCode: 'drilling',
        oldName: 'DRILLING',
        newName: 'Drilling',
        category: 'Upstream Operations',
        description: 'Well drilling operations'
      },
      {
        oldCode: 'PRODUCTION',
        newCode: 'production',
        oldName: 'PRODUCTION',
        newName: 'Production',
        category: 'Upstream Operations',
        description: 'Hydrocarbon production operations'
      },
      {
        oldCode: 'PROCESSING',
        newCode: 'processing',
        oldName: 'PROCESSING',
        newName: 'Processing',
        category: 'Midstream Operations',
        description: 'Hydrocarbon processing and treatment'
      },
      {
        oldCode: 'TRANSPORTATION',
        newCode: 'transportation',
        oldName: 'TRANSPORTATION',
        newName: 'Transportation',
        category: 'Midstream Operations',
        description: 'Pipeline and transportation operations'
      },
      {
        oldCode: 'REFINING_OPS',
        newCode: 'refining_operations',
        oldName: 'REFINING OPERATIONS',
        newName: 'Refining Operations',
        category: 'Downstream Operations',
        description: 'Crude oil refining processes'
      },

      // Chemicals
      {
        oldCode: 'SYNTHESIS',
        newCode: 'synthesis',
        oldName: 'SYNTHESIS',
        newName: 'Synthesis',
        category: 'Chemical Manufacturing',
        description: 'Chemical synthesis operations'
      },
      {
        oldCode: 'SEPARATION',
        newCode: 'separation',
        oldName: 'SEPARATION',
        newName: 'Separation',
        category: 'Chemical Manufacturing',
        description: 'Chemical separation processes'
      },
      {
        oldCode: 'PURIFICATION',
        newCode: 'purification',
        oldName: 'PURIFICATION',
        newName: 'Purification',
        category: 'Chemical Manufacturing',
        description: 'Chemical purification processes'
      },
      {
        oldCode: 'FORMULATION',
        newCode: 'formulation',
        oldName: 'FORMULATION',
        newName: 'Formulation',
        category: 'Chemical Manufacturing',
        description: 'Chemical formulation and blending'
      },
      {
        oldCode: 'PACKAGING',
        newCode: 'packaging',
        oldName: 'PACKAGING',
        newName: 'Packaging',
        category: 'Chemical Manufacturing',
        description: 'Chemical packaging operations'
      },

      // Common Operations
      {
        oldCode: 'MAINTENANCE',
        newCode: 'maintenance',
        oldName: 'MAINTENANCE',
        newName: 'Maintenance',
        category: 'Support Operations',
        description: 'Equipment and facility maintenance'
      },
      {
        oldCode: 'UTILITIES',
        newCode: 'utilities',
        oldName: 'UTILITIES',
        newName: 'Utilities',
        category: 'Support Operations',
        description: 'Utility generation and distribution'
      },
      {
        oldCode: 'WASTE_MANAGEMENT',
        newCode: 'waste_management',
        oldName: 'WASTE MANAGEMENT',
        newName: 'Waste Management',
        category: 'Support Operations',
        description: 'Waste handling and disposal operations'
      },
      {
        oldCode: 'ENVIRONMENTAL_CONTROL',
        newCode: 'environmental_control',
        oldName: 'ENVIRONMENTAL CONTROL',
        newName: 'Environmental Control',
        category: 'Support Operations',
        description: 'Environmental monitoring and control'
      },
      {
        oldCode: 'SAFETY_SYSTEMS',
        newCode: 'safety_systems',
        oldName: 'SAFETY SYSTEMS',
        newName: 'Safety Systems',
        category: 'Support Operations',
        description: 'Safety system operations and monitoring'
      }
    ]

    let updatedCount = 0
    let createdCount = 0

    for (const mapping of streamMappings) {
      try {
        // Check if the old version exists
        const existingStream = await prisma.operationalStream.findFirst({
          where: {
            OR: [
              { code: mapping.oldCode },
              { code: mapping.newCode },
              { name: mapping.oldName },
              { name: mapping.newName }
            ]
          }
        })

        if (existingStream) {
          // Update existing stream
          await prisma.operationalStream.update({
            where: { id: existingStream.id },
            data: {
              code: mapping.newCode,
              name: mapping.newName,
              category: mapping.category,
              description: mapping.description || existingStream.description,
              updatedAt: new Date()
            }
          })
          updatedCount++
          console.log(`✅ Updated: ${mapping.oldName} → ${mapping.newName}`)
        } else {
          // Create new stream
          await prisma.operationalStream.create({
            data: {
              code: mapping.newCode,
              name: mapping.newName,
              category: mapping.category,
              description: mapping.description,
              isActive: true,
              sortOrder: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          createdCount++
          console.log(`✅ Created: ${mapping.newName}`)
        }
      } catch (error) {
        console.error(`❌ Error processing ${mapping.oldName}:`, error)
      }
    }

    console.log(`✅ Standardization complete: ${updatedCount} updated, ${createdCount} created`)
  }

  /**
   * Validate operational streams for industry and sector relevance
   */
  async validateStreamRelevance(): Promise<void> {
    console.log('🔍 Validating operational stream relevance...')

    // Define industry-sector-stream mappings
    const industryStreamMappings: Record<string, {
      sectors: Record<string, string[]>
      common: string[]
    }> = {
      'MINING_METALS': {
        sectors: {
          'COAL_MINING': ['open_pit_mining', 'underground_mining', 'crushing_and_grinding', 'flotation', 'leaching', 'smelting', 'refining'],
          'METAL_MINING': ['open_pit_mining', 'underground_mining', 'crushing_and_grinding', 'flotation', 'leaching', 'smelting', 'refining'],
          'MINERAL_MINING': ['open_pit_mining', 'underground_mining', 'crushing_and_grinding', 'flotation', 'leaching']
        },
        common: ['maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems']
      },
      'OIL_GAS': {
        sectors: {
          'UPSTREAM': ['exploration', 'drilling', 'production'],
          'MIDSTREAM': ['processing', 'transportation'],
          'DOWNSTREAM': ['refining_operations']
        },
        common: ['maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems']
      },
      'CHEMICALS': {
        sectors: {
          'BASIC_CHEMICALS': ['synthesis', 'separation', 'purification'],
          'SPECIALTY_CHEMICALS': ['synthesis', 'formulation', 'packaging'],
          'PETROCHEMICALS': ['synthesis', 'separation', 'purification', 'formulation']
        },
        common: ['maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems']
      }
    }

    // Get all industries
    const industries = await prisma.industry.findMany({
      include: {
        sectors: true
      }
    })

    for (const industry of industries) {
      const industryMapping = industryStreamMappings[industry.code]
      
      if (!industryMapping) {
        console.warn(`⚠️ No stream mapping defined for industry: ${industry.code}`)
        continue
      }

      // Get all streams for this industry
      const allStreams = new Set<string>()
      
      // Add sector-specific streams
      for (const sector of industry.sectors) {
        const sectorStreams = industryMapping.sectors[sector.code]
        if (sectorStreams) {
          sectorStreams.forEach((stream: string) => allStreams.add(stream))
        }
      }
      
      // Add common streams
      industryMapping.common.forEach((stream: string) => allStreams.add(stream))

      // Validate that all required streams exist
      const existingStreams = await prisma.operationalStream.findMany({
        where: {
          code: {
            in: Array.from(allStreams)
          }
        }
      })

      const existingCodes = existingStreams.map(s => s.code)
      const missingStreams = Array.from(allStreams).filter(code => !existingCodes.includes(code))

      if (missingStreams.length > 0) {
        console.warn(`⚠️ Missing streams for ${industry.code}: ${missingStreams.join(', ')}`)
      } else {
        console.log(`✅ All streams validated for ${industry.code}`)
      }
    }
  }

  /**
   * Get standardized operational streams for an industry and sectors
   */
  async getIndustryStreams(industryCode: string, sectorCodes: string[]): Promise<string[]> {
    const industryStreamMappings: Record<string, {
      sectors: Record<string, string[]>
      common: string[]
    }> = {
      'MINING_METALS': {
        sectors: {
          'COAL_MINING': ['open_pit_mining', 'underground_mining', 'crushing_and_grinding', 'flotation', 'leaching', 'smelting', 'refining'],
          'METAL_MINING': ['open_pit_mining', 'underground_mining', 'crushing_and_grinding', 'flotation', 'leaching', 'smelting', 'refining'],
          'MINERAL_MINING': ['open_pit_mining', 'underground_mining', 'crushing_and_grinding', 'flotation', 'leaching']
        },
        common: ['maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems']
      },
      'OIL_GAS': {
        sectors: {
          'UPSTREAM': ['exploration', 'drilling', 'production'],
          'MIDSTREAM': ['processing', 'transportation'],
          'DOWNSTREAM': ['refining_operations']
        },
        common: ['maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems']
      },
      'CHEMICALS': {
        sectors: {
          'BASIC_CHEMICALS': ['synthesis', 'separation', 'purification'],
          'SPECIALTY_CHEMICALS': ['synthesis', 'formulation', 'packaging'],
          'PETROCHEMICALS': ['synthesis', 'separation', 'purification', 'formulation']
        },
        common: ['maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems']
      }
    }

    const industryMapping = industryStreamMappings[industryCode]
    
    if (!industryMapping) {
      console.warn(`⚠️ No stream mapping defined for industry: ${industryCode}`)
      return []
    }

    const allStreams = new Set<string>()
    
    // Add sector-specific streams
    for (const sectorCode of sectorCodes) {
      const sectorStreams = industryMapping.sectors[sectorCode]
      if (sectorStreams) {
        sectorStreams.forEach((stream: string) => allStreams.add(stream))
      }
    }
    
    // Add common streams
    industryMapping.common.forEach((stream: string) => allStreams.add(stream))

    return Array.from(allStreams)
  }

  /**
   * Clean up duplicate or obsolete streams
   */
  async cleanupStreams(): Promise<void> {
    console.log('🧹 Cleaning up operational streams...')

    // Find and merge duplicate streams
    const duplicates = await prisma.operationalStream.groupBy({
      by: ['name'],
      having: {
        name: {
          _count: {
            gt: 1
          }
        }
      }
    })

    for (const duplicate of duplicates) {
      const streams = await prisma.operationalStream.findMany({
        where: { name: duplicate.name },
        orderBy: { createdAt: 'asc' }
      })

      if (streams.length > 1) {
        const primaryStream = streams[0]
        const duplicateStreams = streams.slice(1)

        console.log(`🔄 Merging duplicates for: ${duplicate.name}`)

        // Update references to point to primary stream
        for (const duplicateStream of duplicateStreams) {
          // Update business canvas associations
          await prisma.businessCanvasOperationalStreams.updateMany({
            where: { operationalStreamId: duplicateStream.id },
            data: { operationalStreamId: primaryStream.id }
          })

          // Update industry associations - IndustryOperationalStreams uses streamName, not operationalStreamId
          await prisma.industryOperationalStreams.updateMany({
            where: { 
              streamName: duplicateStream.name 
            },
            data: { 
              streamName: primaryStream.name,
              updatedAt: new Date()
            }
          })

          // Delete duplicate stream
          await prisma.operationalStream.delete({
            where: { id: duplicateStream.id }
          })
        }
      }
    }

    console.log('✅ Stream cleanup complete')
  }
} 