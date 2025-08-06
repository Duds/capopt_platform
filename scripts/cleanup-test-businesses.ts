#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupTestBusinesses() {
  console.log('🧹 Starting test business cleanup...')
  
  try {
    // Step 1: Identify Hercules Levee business canvas
    const herculesLeveeCanvas = await prisma.businessCanvas.findFirst({
      where: {
        name: {
          contains: 'Hercules Levee'
        }
      }
    })
    
    if (!herculesLeveeCanvas) {
      console.log('⚠️ Hercules Levee business canvas not found. Creating it...')
      // Create Hercules Levee business canvas if it doesn't exist
      const enterprise = await prisma.enterprise.findFirst({
        where: { abn: '12345678901' }
      })
      
      if (!enterprise) {
        throw new Error('Enterprise not found. Please seed enterprise first.')
      }
      
      const facility = await prisma.facility.findFirst({
        where: { code: 'HL001' }
      })
      
      if (!facility) {
        throw new Error('Hercules Levee facility not found. Please seed facility first.')
      }
      
      await prisma.businessCanvas.create({
        data: {
          name: 'Hercules Levee - Integrated Mining Operations',
          description: 'Comprehensive Business Model Canvas for Hercules Levee integrated mining and minerals processing facility',
          legalName: 'Cracked Mountain Resources Pty Ltd',
          abn: '12345678901',
          acn: '123456789',
          businessType: 'CORPORATION',
          industry: 'Mining & Metals',
          sector: 'COPPER',
          sectors: ['COPPER', 'URANIUM', 'GOLD_SILVER'],
          regional: 'REMOTE',
          primaryLocation: 'Roxby Downs, South Australia',
          strategicObjective: 'To be a world-leading integrated mining and processing operation, delivering sustainable value through excellence in safety, environmental stewardship, and operational performance',
          valueProposition: 'Integrated mining and processing excellence with world-class safety standards and environmental stewardship',
          competitiveAdvantage: 'Large-scale, low-cost operations with significant resource base, advanced technology, and diversified commodity portfolio',
          annualRevenue: 8500000000, // $8.5 billion AUD
          employeeCount: 2500,
          riskProfile: 'HIGH',
          operationalStreams: ['UNDERGROUND_MINING', 'OPEN_PIT_MINING', 'MINERAL_PROCESSING', 'METAL_REFINING'],
          complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'RADIATION_PROTECTION_ACT'],
          regulatoryFramework: ['ISO_14001', 'ISO_45001', 'ICMM_FRAMEWORK'],
          status: 'PUBLISHED',
          isActive: true,
          enterpriseId: enterprise.id,
          facilityId: facility.id
        }
      })
      
      console.log('✅ Hercules Levee business canvas created')
    } else {
      console.log('✅ Hercules Levee business canvas found:', herculesLeveeCanvas.name)
    }
    
    // Step 2: Remove test business canvases (excluding Hercules Levee)
    const testCanvasesToDelete = await prisma.businessCanvas.findMany({
      where: {
        name: {
          not: {
            contains: 'Hercules Levee'
          }
        }
      }
    })
    
    console.log(`📊 Found ${testCanvasesToDelete.length} test business canvases to remove`)
    
    for (const canvas of testCanvasesToDelete) {
      console.log(`🗑️ Removing test canvas: ${canvas.name}`)
      
      // Remove associated BMC items
      await prisma.valueProposition.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.customerSegment.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.channel.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.revenueStream.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.resource.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.activity.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.partnership.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.costStructure.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      // Remove BMC integration tables
      await prisma.bMCOMCIntegration.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.bMCGraphRelationship.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.bMCCriticalControl.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      // Remove business canvas associations
      await prisma.businessCanvasOperationalStreams.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.businessCanvasComplianceFrameworks.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      await prisma.businessCanvasFacilityTypes.deleteMany({
        where: { businessCanvasId: canvas.id }
      })
      
      // Remove the business canvas itself
      await prisma.businessCanvas.delete({
        where: { id: canvas.id }
      })
    }
    
    // Step 3: Verify cleanup results
    const remainingCanvases = await prisma.businessCanvas.findMany()
    console.log(`✅ Cleanup complete. ${remainingCanvases.length} business canvases remaining:`)
    
    for (const canvas of remainingCanvases) {
      console.log(`  - ${canvas.name}`)
    }
    
    // Step 4: Count remaining BMC items
    const remainingVP = await prisma.valueProposition.count()
    const remainingCS = await prisma.customerSegment.count()
    const remainingCH = await prisma.channel.count()
    const remainingRS = await prisma.revenueStream.count()
    const remainingR = await prisma.resource.count()
    const remainingA = await prisma.activity.count()
    const remainingP = await prisma.partnership.count()
    const remainingC = await prisma.costStructure.count()
    
    console.log('\n📊 Remaining BMC items:')
    console.log(`  - Value Propositions: ${remainingVP}`)
    console.log(`  - Customer Segments: ${remainingCS}`)
    console.log(`  - Channels: ${remainingCH}`)
    console.log(`  - Revenue Streams: ${remainingRS}`)
    console.log(`  - Resources: ${remainingR}`)
    console.log(`  - Activities: ${remainingA}`)
    console.log(`  - Partnerships: ${remainingP}`)
    console.log(`  - Cost Structures: ${remainingC}`)
    
    // Step 5: Verify Hercules Levee data is preserved
    const herculesLeveeData = await prisma.businessCanvas.findFirst({
      where: {
        name: {
          contains: 'Hercules Levee'
        }
      },
      include: {
        facility: true,
        enterprise: true
      }
    })
    
    if (herculesLeveeData) {
      console.log('\n✅ Hercules Levee data preserved:')
      console.log(`  - Business Canvas: ${herculesLeveeData.name}`)
      console.log(`  - Facility: ${herculesLeveeData.facility?.name}`)
      console.log(`  - Enterprise: ${herculesLeveeData.enterprise?.name}`)
    }
    
    console.log('\n🎉 Test business cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupTestBusinesses()
  .then(() => {
    console.log('✅ Cleanup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Cleanup script failed:', error)
    process.exit(1)
  }) 