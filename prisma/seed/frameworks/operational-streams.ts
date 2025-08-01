import { PrismaClient } from '@prisma/client'

export async function seedOperationalStreams(prisma: PrismaClient) {
  console.log('🔄 Seeding operational streams...')

  const operationalStreamsData = [
    // Mining & Metals Industry
    {
      industryCode: 'MINING_METALS',
      streams: [
        { sector: 'COPPER', streamName: 'Open Pit Mining', category: 'EXTRACTION' },
        { sector: 'COPPER', streamName: 'Underground Mining', category: 'EXTRACTION' },
        { sector: 'COPPER', streamName: 'Ore Processing', category: 'PROCESSING' },
        { sector: 'COPPER', streamName: 'Concentrate Production', category: 'PROCESSING' },
        { sector: 'COPPER', streamName: 'Smelting Operations', category: 'PROCESSING' },
        { sector: 'COPPER', streamName: 'Refining Operations', category: 'PROCESSING' },
        { sector: 'COPPER', streamName: 'Tailings Management', category: 'ENVIRONMENTAL' },
        { sector: 'COPPER', streamName: 'Water Management', category: 'ENVIRONMENTAL' },
        { sector: 'COPPER', streamName: 'Dust Control', category: 'ENVIRONMENTAL' },
        { sector: 'COPPER', streamName: 'Safety Systems', category: 'SAFETY' },
        
        { sector: 'GOLD', streamName: 'Open Pit Mining', category: 'EXTRACTION' },
        { sector: 'GOLD', streamName: 'Underground Mining', category: 'EXTRACTION' },
        { sector: 'GOLD', streamName: 'Heap Leaching', category: 'PROCESSING' },
        { sector: 'GOLD', streamName: 'Cyanidation', category: 'PROCESSING' },
        { sector: 'GOLD', streamName: 'Gravity Concentration', category: 'PROCESSING' },
        { sector: 'GOLD', streamName: 'Refining Operations', category: 'PROCESSING' },
        { sector: 'GOLD', streamName: 'Security & Transport', category: 'SECURITY' },
        { sector: 'GOLD', streamName: 'Assay Laboratory', category: 'QUALITY' },
        { sector: 'GOLD', streamName: 'Chain of Custody', category: 'SECURITY' },
        { sector: 'GOLD', streamName: 'Environmental Monitoring', category: 'ENVIRONMENTAL' },
        
        { sector: 'URANIUM', streamName: 'In-Situ Leaching', category: 'EXTRACTION' },
        { sector: 'URANIUM', streamName: 'Open Pit Mining', category: 'EXTRACTION' },
        { sector: 'URANIUM', streamName: 'Radiation Safety', category: 'SAFETY' },
        { sector: 'URANIUM', streamName: 'Nuclear Compliance', category: 'COMPLIANCE' },
        { sector: 'URANIUM', streamName: 'Transport Security', category: 'SECURITY' },
        { sector: 'URANIUM', streamName: 'Radiation Monitoring', category: 'SAFETY' },
        { sector: 'URANIUM', streamName: 'Waste Management', category: 'ENVIRONMENTAL' },
        { sector: 'URANIUM', streamName: 'Security Clearances', category: 'SECURITY' },
        { sector: 'URANIUM', streamName: 'International Safeguards', category: 'COMPLIANCE' },
        
        { sector: 'COAL', streamName: 'Open Cut Mining', category: 'EXTRACTION' },
        { sector: 'COAL', streamName: 'Underground Mining', category: 'EXTRACTION' },
        { sector: 'COAL', streamName: 'Coal Processing', category: 'PROCESSING' },
        { sector: 'COAL', streamName: 'Transport & Logistics', category: 'LOGISTICS' },
        { sector: 'COAL', streamName: 'Environmental Management', category: 'ENVIRONMENTAL' },
        { sector: 'COAL', streamName: 'Rehabilitation', category: 'ENVIRONMENTAL' },
        { sector: 'COAL', streamName: 'Dust Control', category: 'ENVIRONMENTAL' },
        { sector: 'COAL', streamName: 'Noise Management', category: 'ENVIRONMENTAL' },
        
        { sector: 'IRON_ORE', streamName: 'Open Pit Mining', category: 'EXTRACTION' },
        { sector: 'IRON_ORE', streamName: 'Ore Processing', category: 'PROCESSING' },
        { sector: 'IRON_ORE', streamName: 'Beneficiation', category: 'PROCESSING' },
        { sector: 'IRON_ORE', streamName: 'Pelletizing', category: 'PROCESSING' },
        { sector: 'IRON_ORE', streamName: 'Transport & Logistics', category: 'LOGISTICS' },
        { sector: 'IRON_ORE', streamName: 'Port Operations', category: 'LOGISTICS' },
        { sector: 'IRON_ORE', streamName: 'Environmental Management', category: 'ENVIRONMENTAL' },
        { sector: 'IRON_ORE', streamName: 'Rehabilitation', category: 'ENVIRONMENTAL' }
      ]
    },

    // Oil & Gas Industry
    {
      industryCode: 'OIL_GAS',
      streams: [
        { sector: 'EXPLORATION', streamName: 'Seismic Surveying', category: 'EXPLORATION' },
        { sector: 'EXPLORATION', streamName: 'Drilling Operations', category: 'EXPLORATION' },
        { sector: 'EXPLORATION', streamName: 'Well Testing', category: 'EXPLORATION' },
        { sector: 'EXPLORATION', streamName: 'Reservoir Analysis', category: 'EXPLORATION' },
        { sector: 'EXPLORATION', streamName: 'Environmental Assessment', category: 'ENVIRONMENTAL' },
        
        { sector: 'PRODUCTION', streamName: 'Well Operations', category: 'PRODUCTION' },
        { sector: 'PRODUCTION', streamName: 'Production Optimization', category: 'PRODUCTION' },
        { sector: 'PRODUCTION', streamName: 'Artificial Lift', category: 'PRODUCTION' },
        { sector: 'PRODUCTION', streamName: 'Well Maintenance', category: 'MAINTENANCE' },
        { sector: 'PRODUCTION', streamName: 'Production Monitoring', category: 'PRODUCTION' },
        
        { sector: 'REFINING', streamName: 'Crude Oil Processing', category: 'PROCESSING' },
        { sector: 'REFINING', streamName: 'Distillation', category: 'PROCESSING' },
        { sector: 'REFINING', streamName: 'Cracking Operations', category: 'PROCESSING' },
        { sector: 'REFINING', streamName: 'Product Blending', category: 'PROCESSING' },
        { sector: 'REFINING', streamName: 'Quality Control', category: 'QUALITY' },
        { sector: 'REFINING', streamName: 'Safety Systems', category: 'SAFETY' },
        
        { sector: 'DISTRIBUTION', streamName: 'Pipeline Operations', category: 'DISTRIBUTION' },
        { sector: 'DISTRIBUTION', streamName: 'Storage Management', category: 'DISTRIBUTION' },
        { sector: 'DISTRIBUTION', streamName: 'Terminal Operations', category: 'DISTRIBUTION' },
        { sector: 'DISTRIBUTION', streamName: 'Transport Logistics', category: 'LOGISTICS' },
        { sector: 'DISTRIBUTION', streamName: 'Emergency Response', category: 'SAFETY' }
      ]
    }
  ]

  try {
    for (const industryData of operationalStreamsData) {
      const industry = await prisma.industry.findUnique({
        where: { code: industryData.industryCode }
      })

      if (!industry) {
        console.warn(`⚠️ Industry ${industryData.industryCode} not found, skipping operational streams`)
        continue
      }

      console.log(`🔄 Seeding operational streams for ${industry.name}...`)

      for (const stream of industryData.streams) {
        await prisma.industryOperationalStreams.upsert({
          where: {
            industryId_sector_streamName: {
              industryId: industry.id,
              sector: stream.sector,
              streamName: stream.streamName
            }
          },
          update: {
            category: stream.category,
            description: `${stream.streamName} for ${stream.sector} sector`,
            updatedAt: new Date()
          },
          create: {
            industryId: industry.id,
            sector: stream.sector,
            streamName: stream.streamName,
            category: stream.category,
            description: `${stream.streamName} for ${stream.sector} sector`,
            sortOrder: 0
          }
        })
      }

      console.log(`✅ Created/updated ${industryData.streams.length} operational streams for ${industry.name}`)
    }

    console.log('✅ Operational streams seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding operational streams:', error)
    throw error
  }
} 