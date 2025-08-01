import { PrismaClient } from '@prisma/client'

export async function seedOperationalStreams(prisma: PrismaClient) {
  console.log('⚙️ Seeding operational streams...')

  const operationalStreams = [
    // Mining & Metals - Mining Operations
    {
      code: 'open_pit_mining',
      name: 'Open Pit Mining',
      category: 'Mining Operations',
      description: 'Surface mining operations using open pit techniques',
      isActive: true,
      sortOrder: 1
    },
    {
      code: 'underground_mining',
      name: 'Underground Mining',
      category: 'Mining Operations',
      description: 'Subsurface mining operations using underground techniques',
      isActive: true,
      sortOrder: 2
    },
    {
      code: 'drilling_and_blasting',
      name: 'Drilling and Blasting',
      category: 'Mining Operations',
      description: 'Rock fragmentation using drilling and explosive techniques',
      isActive: true,
      sortOrder: 3
    },
    {
      code: 'loading_and_hauling',
      name: 'Loading and Hauling',
      category: 'Mining Operations',
      description: 'Material handling and transportation operations',
      isActive: true,
      sortOrder: 4
    },

    // Mining & Metals - Mineral Processing
    {
      code: 'crushing_and_grinding',
      name: 'Crushing and Grinding',
      category: 'Mineral Processing',
      description: 'Size reduction operations for ore processing',
      isActive: true,
      sortOrder: 5
    },
    {
      code: 'screening_and_classification',
      name: 'Screening and Classification',
      category: 'Mineral Processing',
      description: 'Particle size separation and classification',
      isActive: true,
      sortOrder: 6
    },
    {
      code: 'flotation',
      name: 'Flotation',
      category: 'Mineral Processing',
      description: 'Mineral separation using flotation techniques',
      isActive: true,
      sortOrder: 7
    },
    {
      code: 'leaching',
      name: 'Leaching',
      category: 'Mineral Processing',
      description: 'Chemical extraction of metals from ore',
      isActive: true,
      sortOrder: 8
    },
    {
      code: 'thickening_and_filtration',
      name: 'Thickening and Filtration',
      category: 'Mineral Processing',
      description: 'Solid-liquid separation processes',
      isActive: true,
      sortOrder: 9
    },

    // Mining & Metals - Metallurgical Processing
    {
      code: 'smelting',
      name: 'Smelting',
      category: 'Metallurgical Processing',
      description: 'High-temperature metal extraction process',
      isActive: true,
      sortOrder: 10
    },
    {
      code: 'refining',
      name: 'Refining',
      category: 'Metallurgical Processing',
      description: 'Purification of extracted metals',
      isActive: true,
      sortOrder: 11
    },
    {
      code: 'casting',
      name: 'Casting',
      category: 'Metallurgical Processing',
      description: 'Metal forming and casting operations',
      isActive: true,
      sortOrder: 12
    },

    // Oil & Gas - Upstream Operations
    {
      code: 'exploration',
      name: 'Exploration',
      category: 'Upstream Operations',
      description: 'Hydrocarbon exploration activities',
      isActive: true,
      sortOrder: 13
    },
    {
      code: 'drilling',
      name: 'Drilling',
      category: 'Upstream Operations',
      description: 'Well drilling operations',
      isActive: true,
      sortOrder: 14
    },
    {
      code: 'completion',
      name: 'Completion',
      category: 'Upstream Operations',
      description: 'Well completion and stimulation',
      isActive: true,
      sortOrder: 15
    },
    {
      code: 'production',
      name: 'Production',
      category: 'Upstream Operations',
      description: 'Hydrocarbon production operations',
      isActive: true,
      sortOrder: 16
    },
    {
      code: 'workover',
      name: 'Workover',
      category: 'Upstream Operations',
      description: 'Well maintenance and intervention',
      isActive: true,
      sortOrder: 17
    },

    // Oil & Gas - Midstream Operations
    {
      code: 'processing',
      name: 'Processing',
      category: 'Midstream Operations',
      description: 'Hydrocarbon processing and treatment',
      isActive: true,
      sortOrder: 18
    },
    {
      code: 'transportation',
      name: 'Transportation',
      category: 'Midstream Operations',
      description: 'Pipeline and transportation operations',
      isActive: true,
      sortOrder: 19
    },
    {
      code: 'storage',
      name: 'Storage',
      category: 'Midstream Operations',
      description: 'Hydrocarbon storage operations',
      isActive: true,
      sortOrder: 20
    },

    // Oil & Gas - Downstream Operations
    {
      code: 'refining_operations',
      name: 'Refining Operations',
      category: 'Downstream Operations',
      description: 'Crude oil refining processes',
      isActive: true,
      sortOrder: 21
    },
    {
      code: 'petrochemical_manufacturing',
      name: 'Petrochemical Manufacturing',
      category: 'Downstream Operations',
      description: 'Petrochemical production processes',
      isActive: true,
      sortOrder: 22
    },
    {
      code: 'distribution',
      name: 'Distribution',
      category: 'Downstream Operations',
      description: 'Product distribution and marketing',
      isActive: true,
      sortOrder: 23
    },

    // Chemicals - Chemical Manufacturing
    {
      code: 'synthesis',
      name: 'Synthesis',
      category: 'Chemical Manufacturing',
      description: 'Chemical synthesis operations',
      isActive: true,
      sortOrder: 24
    },
    {
      code: 'separation',
      name: 'Separation',
      category: 'Chemical Manufacturing',
      description: 'Chemical separation processes',
      isActive: true,
      sortOrder: 25
    },
    {
      code: 'purification',
      name: 'Purification',
      category: 'Chemical Manufacturing',
      description: 'Chemical purification processes',
      isActive: true,
      sortOrder: 26
    },
    {
      code: 'formulation',
      name: 'Formulation',
      category: 'Chemical Manufacturing',
      description: 'Chemical formulation and blending',
      isActive: true,
      sortOrder: 27
    },
    {
      code: 'packaging',
      name: 'Packaging',
      category: 'Chemical Manufacturing',
      description: 'Chemical packaging operations',
      isActive: true,
      sortOrder: 28
    },
    {
      code: 'quality_control',
      name: 'Quality Control',
      category: 'Chemical Manufacturing',
      description: 'Quality assurance and control processes',
      isActive: true,
      sortOrder: 29
    },

    // Support Operations (Common across industries)
    {
      code: 'maintenance',
      name: 'Maintenance',
      category: 'Support Operations',
      description: 'Equipment and facility maintenance',
      isActive: true,
      sortOrder: 30
    },
    {
      code: 'utilities',
      name: 'Utilities',
      category: 'Support Operations',
      description: 'Utility generation and distribution',
      isActive: true,
      sortOrder: 31
    },
    {
      code: 'waste_management',
      name: 'Waste Management',
      category: 'Support Operations',
      description: 'Waste handling and disposal operations',
      isActive: true,
      sortOrder: 32
    },
    {
      code: 'environmental_control',
      name: 'Environmental Control',
      category: 'Support Operations',
      description: 'Environmental monitoring and control',
      isActive: true,
      sortOrder: 33
    },
    {
      code: 'safety_systems',
      name: 'Safety Systems',
      category: 'Support Operations',
      description: 'Safety system operations and monitoring',
      isActive: true,
      sortOrder: 34
    },
    {
      code: 'laboratory_services',
      name: 'Laboratory Services',
      category: 'Support Operations',
      description: 'Analytical and testing services',
      isActive: true,
      sortOrder: 35
    },
    {
      code: 'logistics',
      name: 'Logistics',
      category: 'Support Operations',
      description: 'Supply chain and logistics operations',
      isActive: true,
      sortOrder: 36
    }
  ]

  let createdCount = 0
  let updatedCount = 0

  for (const stream of operationalStreams) {
    try {
      const existingStream = await prisma.operationalStream.findFirst({
        where: {
          OR: [
            { code: stream.code },
            { name: stream.name }
          ]
        }
      })

      if (existingStream) {
        await prisma.operationalStream.update({
          where: { id: existingStream.id },
          data: {
            code: stream.code,
            name: stream.name,
            category: stream.category,
            description: stream.description,
            isActive: stream.isActive,
            sortOrder: stream.sortOrder,
            updatedAt: new Date()
          }
        })
        updatedCount++
      } else {
        await prisma.operationalStream.create({
          data: {
            code: stream.code,
            name: stream.name,
            category: stream.category,
            description: stream.description,
            isActive: stream.isActive,
            sortOrder: stream.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        createdCount++
      }
    } catch (error) {
      console.error(`❌ Error seeding operational stream ${stream.name}:`, error)
    }
  }

  console.log(`✅ Created ${createdCount} new operational streams`)
  console.log(`✅ Updated ${updatedCount} existing operational streams`)

  // Create industry-sector-stream associations
  await createIndustryStreamAssociations(prisma)
}

async function createIndustryStreamAssociations(prisma: PrismaClient) {
  console.log('🔗 Creating industry-stream associations...')

  // Get industries
  const miningIndustry = await prisma.industry.findUnique({ where: { code: 'MINING_METALS' } })
  const oilGasIndustry = await prisma.industry.findUnique({ where: { code: 'OIL_GAS' } })
  const chemicalsIndustry = await prisma.industry.findUnique({ where: { code: 'CHEMICALS' } })

  if (!miningIndustry || !oilGasIndustry || !chemicalsIndustry) {
    console.warn('⚠️ Required industries not found for stream associations')
    return
  }

  // Define industry-stream mappings
  const industryStreamMappings = {
    'MINING_METALS': {
      'COAL_MINING': [
        'open_pit_mining', 'underground_mining', 'drilling_and_blasting', 'loading_and_hauling',
        'crushing_and_grinding', 'screening_and_classification', 'thickening_and_filtration',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ],
      'METAL_MINING': [
        'open_pit_mining', 'underground_mining', 'drilling_and_blasting', 'loading_and_hauling',
        'crushing_and_grinding', 'screening_and_classification', 'flotation', 'leaching',
        'thickening_and_filtration', 'smelting', 'refining', 'casting',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ],
      'MINERAL_MINING': [
        'open_pit_mining', 'underground_mining', 'drilling_and_blasting', 'loading_and_hauling',
        'crushing_and_grinding', 'screening_and_classification', 'flotation', 'leaching',
        'thickening_and_filtration',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ]
    },
    'OIL_GAS': {
      'UPSTREAM': [
        'exploration', 'drilling', 'completion', 'production', 'workover',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ],
      'MIDSTREAM': [
        'processing', 'transportation', 'storage',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ],
      'DOWNSTREAM': [
        'refining_operations', 'petrochemical_manufacturing', 'distribution',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ]
    },
    'CHEMICALS': {
      'BASIC_CHEMICALS': [
        'synthesis', 'separation', 'purification', 'quality_control',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ],
      'SPECIALTY_CHEMICALS': [
        'synthesis', 'formulation', 'packaging', 'quality_control',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ],
      'PETROCHEMICALS': [
        'synthesis', 'separation', 'purification', 'formulation', 'quality_control',
        'maintenance', 'utilities', 'waste_management', 'environmental_control', 'safety_systems'
      ]
    }
  }

  let associationCount = 0

  for (const [industryCode, sectorMappings] of Object.entries(industryStreamMappings)) {
    const industry = await prisma.industry.findUnique({ where: { code: industryCode } })
    if (!industry) continue

    for (const [sectorCode, streamCodes] of Object.entries(sectorMappings)) {
      const sector = await prisma.sector.findFirst({
        where: { code: sectorCode, industryId: industry.id }
      })
      if (!sector) continue

      for (const streamCode of streamCodes) {
        const stream = await prisma.operationalStream.findUnique({
          where: { code: streamCode }
        })
        if (!stream) continue

        try {
          await prisma.industryOperationalStreams.upsert({
            where: {
              industryId_sectorId_operationalStreamId: {
                industryId: industry.id,
                sectorId: sector.id,
                operationalStreamId: stream.id
              }
            },
            update: {
              isActive: true,
              updatedAt: new Date()
            },
            create: {
              industryId: industry.id,
              sectorId: sector.id,
              operationalStreamId: stream.id,
              streamName: stream.name,
              isActive: true,
              sortOrder: stream.sortOrder,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          associationCount++
        } catch (error) {
          console.error(`❌ Error creating association for ${industryCode}-${sectorCode}-${streamCode}:`, error)
        }
      }
    }
  }

  console.log(`✅ Created ${associationCount} industry-stream associations`)
} 