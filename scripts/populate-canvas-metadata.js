#!/usr/bin/env node

/**
 * Business Canvas Metadata Population Script
 * 
 * This script populates missing metadata fields for all business canvases
 * with synthetic data based on enterprise and facility information.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Synthetic data generators
const SYNTHETIC_DATA = {
  // Legal information for Cracked Mountain Pty Ltd
  legalName: 'Cracked Mountain Pty Ltd',
  abn: '12 345 678 901',
  acn: '123 456 789',
  
  // Business type and industry
  businessType: 'CORPORATION',
  industry: 'Mining & Metals',
  
  // Regional and location data
  regional: 'REMOTE',
  primaryLocation: 'Hercules Levee, Western Australia',
  coordinates: '-25.2744,133.7751', // Central Australia coordinates
  
  // Facility type
  facilityType: 'MINE',
  
  // Strategic information
  strategicObjective: 'To become a leading sustainable mining operation in Western Australia, delivering value to stakeholders while maintaining the highest safety and environmental standards.',
  valueProposition: 'High-quality mineral extraction with advanced safety protocols, environmental stewardship, and community engagement.',
  competitiveAdvantage: 'Advanced mining technology, experienced workforce, strategic location, and strong regulatory compliance.',
  
  // Financial information
  annualRevenue: 150000000, // $150M AUD
  employeeCount: 450,
  
  // Risk and compliance
  riskProfile: 'HIGH',
  digitalMaturity: 'ADVANCED',
  
  // Operational streams for different canvas types
  operationalStreams: {
    enterprise: ['Strategic Planning', 'Corporate Governance', 'Risk Management', 'Financial Management', 'Stakeholder Relations'],
    mining: ['Exploration', 'Drilling', 'Blasting', 'Loading', 'Hauling', 'Processing', 'Rehabilitation'],
    copper: ['Copper Mining', 'Copper Processing', 'Copper Refining', 'Copper Marketing', 'Copper Logistics'],
    uranium: ['Uranium Mining', 'Uranium Processing', 'Uranium Enrichment', 'Nuclear Safety', 'Regulatory Compliance'],
    precious: ['Gold Mining', 'Silver Mining', 'Precious Metal Processing', 'Bullion Management', 'Market Operations']
  },
  
  // Compliance and regulatory frameworks
  complianceRequirements: [
    'Work Health and Safety Act 2011',
    'Environment Protection and Biodiversity Conservation Act 1999',
    'Mining Act 1978 (WA)',
    'Radiation Safety Act 1975',
    'Dangerous Goods Safety Act 2004'
  ],
  
  regulatoryFramework: [
    'ISO 14001 Environmental Management',
    'ISO 45001 Occupational Health and Safety',
    'ICMM Sustainable Development Framework',
    'Australian Mining Industry Code of Practice',
    'Western Australia Mining Regulations'
  ]
}

// Sector mappings for different canvas types
const SECTOR_MAPPINGS = {
  enterprise: ['Mining & Metals', 'Corporate Services'],
  mining: ['Mining & Metals', 'Mineral Processing'],
  copper: ['Mining & Metals', 'Copper Mining', 'Mineral Processing'],
  uranium: ['Mining & Metals', 'Uranium Mining', 'Nuclear Materials'],
  precious: ['Mining & Metals', 'Precious Metals', 'Gold Mining', 'Silver Mining']
}

async function populateCanvasMetadata() {
  console.log('🔧 Starting Business Canvas Metadata Population...\n')
  
  try {
    // Get the enterprise
    const enterprise = await prisma.enterprise.findFirst({
      where: { name: 'Cracked Mountain Pty Ltd' }
    })
    
    if (!enterprise) {
      console.error('❌ Enterprise "Cracked Mountain Pty Ltd" not found')
      return
    }
    
    console.log(`✅ Found enterprise: ${enterprise.name} (ID: ${enterprise.id})`)
    
    // Get the facility
    const facility = await prisma.facility.findFirst({
      where: { name: 'Hercules Levee' }
    })
    
    if (!facility) {
      console.error('❌ Facility "Hercules Levee" not found')
      return
    }
    
    console.log(`✅ Found facility: ${facility.name} (ID: ${facility.id})`)
    
    // Get all business canvases
    const canvases = await prisma.businessCanvas.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    })
    
    console.log(`📊 Found ${canvases.length} business canvases to update\n`)
    
    let updatedCount = 0
    
    for (const canvas of canvases) {
      console.log(`\n🎯 Updating Canvas: "${canvas.name}" (ID: ${canvas.id})`)
      
      // Determine canvas type for sector mapping
      let canvasType = 'enterprise'
      if (canvas.name.includes('Mining Operations')) canvasType = 'mining'
      else if (canvas.name.includes('Copper Operations')) canvasType = 'copper'
      else if (canvas.name.includes('Uranium Operations')) canvasType = 'uranium'
      else if (canvas.name.includes('Precious Metals Operations')) canvasType = 'precious'
      
      // Prepare update data
      const updateData = {
        // Enterprise context
        enterpriseId: enterprise.id,
        facilityId: facility.id,
        
        // Legal & Registration
        legalName: SYNTHETIC_DATA.legalName,
        abn: SYNTHETIC_DATA.abn,
        acn: SYNTHETIC_DATA.acn,
        
        // Industry Classification
        industry: SYNTHETIC_DATA.industry,
        sector: SYNTHETIC_DATA.industry, // Legacy field
        sectors: SECTOR_MAPPINGS[canvasType],
        businessType: SYNTHETIC_DATA.businessType,
        
        // Geographic & Regional
        regional: SYNTHETIC_DATA.regional,
        primaryLocation: SYNTHETIC_DATA.primaryLocation,
        coordinates: SYNTHETIC_DATA.coordinates,
        
        // Facility & Operations
        facilityType: SYNTHETIC_DATA.facilityType,
        operationalStreams: SYNTHETIC_DATA.operationalStreams[canvasType],
        
        // Strategic & Financial
        strategicObjective: SYNTHETIC_DATA.strategicObjective,
        valueProposition: SYNTHETIC_DATA.valueProposition,
        competitiveAdvantage: SYNTHETIC_DATA.competitiveAdvantage,
        annualRevenue: SYNTHETIC_DATA.annualRevenue,
        employeeCount: SYNTHETIC_DATA.employeeCount,
        
        // Risk & Compliance
        riskProfile: SYNTHETIC_DATA.riskProfile,
        digitalMaturity: SYNTHETIC_DATA.digitalMaturity,
        complianceRequirements: SYNTHETIC_DATA.complianceRequirements,
        regulatoryFramework: SYNTHETIC_DATA.regulatoryFramework
      }
      
      // Update the canvas
      await prisma.businessCanvas.update({
        where: { id: canvas.id },
        data: updateData
      })
      
      console.log(`   ✅ Updated metadata for ${canvas.name}`)
      console.log(`      - Enterprise: ${enterprise.name}`)
      console.log(`      - Facility: ${facility.name}`)
      console.log(`      - Industry: ${updateData.industry}`)
      console.log(`      - Sectors: ${updateData.sectors.join(', ')}`)
      console.log(`      - Business Type: ${updateData.businessType}`)
      console.log(`      - Regional: ${updateData.regional}`)
      console.log(`      - Facility Type: ${updateData.facilityType}`)
      console.log(`      - Risk Profile: ${updateData.riskProfile}`)
      console.log(`      - Digital Maturity: ${updateData.digitalMaturity}`)
      
      updatedCount++
    }
    
    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📋 POPULATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total Canvases: ${canvases.length}`)
    console.log(`Updated Canvases: ${updatedCount}`)
    console.log(`Success Rate: ${(updatedCount / canvases.length * 100).toFixed(1)}%`)
    
    if (updatedCount === canvases.length) {
      console.log('\n✅ All business canvases have been updated with complete metadata!')
      console.log('\n🔍 Next Steps:')
      console.log('1. Run the audit script again to verify completion')
      console.log('2. Review the synthetic data for accuracy')
      console.log('3. Update any specific values as needed')
    } else {
      console.log('\n⚠️  Some canvases may not have been updated. Please check the logs.')
    }
    
  } catch (error) {
    console.error('❌ Error during metadata population:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the population
populateCanvasMetadata() 