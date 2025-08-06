import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkBMCSections() {
  console.log('🔍 Checking BMC sections completion status...\n')

  try {
    // Get all business canvases
    const canvases = await prisma.businessCanvas.findMany({
      include: {
        valuePropositions: true,
        customerSegments: true,
        channels: true,
        revenueStreams: true,
        resources: true,
        activities: true,
        partnerships: true,
        costStructures: true,
      }
    })

    console.log(`📊 Found ${canvases.length} business canvases\n`)

    for (const canvas of canvases) {
      console.log(`🏢 Canvas: ${canvas.name}`)
      console.log(`   ID: ${canvas.id}`)
      console.log(`   Status: ${canvas.status}`)
      console.log(`   Active: ${canvas.isActive}`)
      
      // Check each BMC section
      const sections = [
        { name: 'Value Propositions', count: canvas.valuePropositions.length, data: canvas.valuePropositions },
        { name: 'Customer Segments', count: canvas.customerSegments.length, data: canvas.customerSegments },
        { name: 'Channels', count: canvas.channels.length, data: canvas.channels },
        { name: 'Revenue Streams', count: canvas.revenueStreams.length, data: canvas.revenueStreams },
        { name: 'Resources', count: canvas.resources.length, data: canvas.resources },
        { name: 'Activities', count: canvas.activities.length, data: canvas.activities },
        { name: 'Partnerships', count: canvas.partnerships.length, data: canvas.partnerships },
        { name: 'Cost Structures', count: canvas.costStructures.length, data: canvas.costStructures },
      ]

      let totalSections = 0
      let completedSections = 0

      for (const section of sections) {
        totalSections++
        const status = section.count > 0 ? '✅' : '❌'
        const completion = section.count > 0 ? 'COMPLETE' : 'MISSING'
        
        console.log(`   ${status} ${section.name}: ${section.count} items (${completion})`)
        
        if (section.count > 0) {
          completedSections++
          
          // Show first item details for verification
          if (section.data.length > 0) {
            const firstItem = section.data[0]
            console.log(`      📝 Sample: ${firstItem.description?.substring(0, 50)}...`)
          }
        }
      }

      const completionPercentage = Math.round((completedSections / totalSections) * 100)
      console.log(`   📈 Completion: ${completedSections}/${totalSections} sections (${completionPercentage}%)`)
      
      if (completionPercentage < 100) {
        console.log(`   ⚠️  Missing sections:`)
        sections.forEach(section => {
          if (section.count === 0) {
            console.log(`      - ${section.name}`)
          }
        })
      }
      
      console.log('')
    }

    // Summary across all canvases
    console.log('📊 SUMMARY ACROSS ALL CANVASES:')
    const sectionNames = ['Value Propositions', 'Customer Segments', 'Channels', 'Revenue Streams', 'Resources', 'Activities', 'Partnerships', 'Cost Structures']
    
    for (const sectionName of sectionNames) {
      const canvasesWithSection = canvases.filter(canvas => {
        switch (sectionName) {
          case 'Value Propositions': return canvas.valuePropositions.length > 0
          case 'Customer Segments': return canvas.customerSegments.length > 0
          case 'Channels': return canvas.channels.length > 0
          case 'Revenue Streams': return canvas.revenueStreams.length > 0
          case 'Resources': return canvas.resources.length > 0
          case 'Activities': return canvas.activities.length > 0
          case 'Partnerships': return canvas.partnerships.length > 0
          case 'Cost Structures': return canvas.costStructures.length > 0
          default: return false
        }
      })
      
      const percentage = Math.round((canvasesWithSection.length / canvases.length) * 100)
      const status = canvasesWithSection.length === canvases.length ? '✅' : '⚠️'
      console.log(`   ${status} ${sectionName}: ${canvasesWithSection.length}/${canvases.length} canvases (${percentage}%)`)
    }

  } catch (error) {
    console.error('❌ Error checking BMC sections:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBMCSections()
  .catch((e) => {
    console.error('❌ Script failed:', e)
    process.exit(1)
  }) 