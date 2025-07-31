#!/usr/bin/env node

/**
 * Comprehensive script to populate all missing metadata fields for business canvases
 * Includes proper sector mapping, operational streams, and compliance requirements
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Synthetic data for different canvas types
const SYNTHETIC_DATA = {
  // Enterprise level (Hercules Levee)
  enterprise: {
    legalName: 'Cracked Mountain Pty Ltd',
    abn: '12 345 678 901',
    acn: '123 456 789',
    businessType: 'CORPORATION',
    industry: 'Mining & Metals',
    sectors: ['Mining & Metals', 'Corporate Services'],
    regional: 'REMOTE',
    primaryLocation: 'Hercules Levee, Western Australia',
    coordinates: '-25.2744,133.7751',
    facilityType: 'MINE',
    operationalStreams: ['Strategic Planning', 'Corporate Governance', 'Risk Management', 'Financial Management', 'Stakeholder Relations'],
    strategicObjective: 'To become a leading sustainable mining operation in Western Australia, delivering value to stakeholders while maintaining the highest safety and environmental standards.',
    valueProposition: 'High-quality mineral extraction with advanced safety protocols, environmental stewardship, and community engagement.',
    competitiveAdvantage: 'Advanced mining technology, experienced workforce, strategic location, and strong regulatory compliance.',
    annualRevenue: 150000000,
    employeeCount: 450,
    riskProfile: 'HIGH',
    digitalMaturity: 'ADVANCED',
    complianceRequirements: ['Work Health and Safety Act 2011', 'Environment Protection and Biodiversity Conservation Act 1999', 'Mining Act 1978 (WA)', 'Radiation Safety Act 1975', 'Dangerous Goods Safety Act 2004'],
    regulatoryFramework: ['ISO 14001 Environmental Management', 'ISO 45001 Occupational Health and Safety', 'ICMM Sustainable Development Framework', 'Australian Mining Industry Code of Practice', 'Western Australia Mining Regulations']
  },
  
  // Mining Operations
  mining: {
    legalName: 'Cracked Mountain Mining Pty Ltd',
    abn: '12 345 678 902',
    acn: '123 456 790',
    businessType: 'CORPORATION',
    industry: 'Mining & Metals',
    sectors: ['Mining & Metals', 'Mineral Processing'],
    regional: 'REMOTE',
    primaryLocation: 'Hercules Levee Mine Site, Western Australia',
    coordinates: '-25.2744,133.7751',
    facilityType: 'MINE',
    operationalStreams: ['Exploration', 'Drilling', 'Blasting', 'Loading', 'Hauling', 'Processing', 'Rehabilitation'],
    strategicObjective: 'To operate a world-class mining operation with industry-leading safety standards and environmental management.',
    valueProposition: 'Large-scale underground and open pit mining operations (50,000 tpd) with advanced mining equipment and real-time grade control.',
    competitiveAdvantage: 'Advanced mining technology (Caterpillar, Komatsu, Sandvik), experienced workforce, and integrated ore handling systems.',
    annualRevenue: 800000000,
    employeeCount: 280,
    riskProfile: 'HIGH',
    digitalMaturity: 'ADVANCED',
    complianceRequirements: ['Work Health and Safety Act 2011', 'Mining Act 1978 (WA)', 'Environment Protection and Biodiversity Conservation Act 1999', 'Water Management Act 2000'],
    regulatoryFramework: ['ISO 14001 Environmental Management', 'ISO 45001 Occupational Health and Safety', 'Mining Industry Code of Practice', 'Western Australia Mining Regulations']
  },
  
  // Copper Operations
  copper: {
    legalName: 'Cracked Mountain Copper Pty Ltd',
    abn: '12 345 678 903',
    acn: '123 456 791',
    businessType: 'CORPORATION',
    industry: 'Mining & Metals',
    sectors: ['Mining & Metals', 'Copper Mining', 'Mineral Processing'],
    regional: 'REMOTE',
    primaryLocation: 'Hercules Levee Copper Plant, Western Australia',
    coordinates: '-25.2744,133.7751',
    facilityType: 'PROCESSING_PLANT',
    operationalStreams: ['Copper Mining', 'Copper Processing', 'Copper Refining', 'Copper Marketing', 'Copper Logistics'],
    strategicObjective: 'To be a leading producer of LME Grade A copper cathodes with sustainable operations and market leadership.',
    valueProposition: 'LME Grade A electrolytic copper cathodes (99.9999% Cu) with advanced Outotec processing technology and sustainable production.',
    competitiveAdvantage: 'Advanced processing technology, high recovery rates, sustainable operations, and global market access.',
    annualRevenue: 2500000000,
    employeeCount: 320,
    riskProfile: 'HIGH',
    digitalMaturity: 'ADVANCED',
    complianceRequirements: ['Work Health and Safety Act 2011', 'Environment Protection and Biodiversity Conservation Act 1999', 'Mining Act 1978 (WA)', 'Chemical Control Act 1984'],
    regulatoryFramework: ['ISO 14001 Environmental Management', 'ISO 45001 Occupational Health and Safety', 'LME Good Delivery Standards', 'Australian Mining Industry Code of Practice']
  },
  
  // Precious Metals Operations (child of Copper)
  precious: {
    legalName: 'Cracked Mountain Precious Metals Pty Ltd',
    abn: '12 345 678 904',
    acn: '123 456 792',
    businessType: 'CORPORATION',
    industry: 'Mining & Metals',
    sectors: ['Mining & Metals', 'Precious Metals', 'Gold Mining', 'Silver Mining'],
    regional: 'REMOTE',
    primaryLocation: 'Hercules Levee Precious Metals Refinery, Western Australia',
    coordinates: '-25.2744,133.7751',
    facilityType: 'REFINERY',
    operationalStreams: ['Gold Mining', 'Silver Mining', 'Precious Metal Processing', 'Bullion Management', 'Market Operations'],
    strategicObjective: 'To be a leading producer of LBMA Good Delivery gold and silver with premium quality standards.',
    valueProposition: 'LBMA Good Delivery gold ingots (99.9999% Au, 400 oz) and silver ingots (99.9999% Ag, 1000 oz) with advanced electrorefining technology.',
    competitiveAdvantage: 'Premium quality standards, advanced refining technology, LBMA certification, and global distribution network.',
    annualRevenue: 2300000000,
    employeeCount: 180,
    riskProfile: 'HIGH',
    digitalMaturity: 'ADVANCED',
    complianceRequirements: ['Work Health and Safety Act 2011', 'Environment Protection and Biodiversity Conservation Act 1999', 'Mining Act 1978 (WA)', 'Security Legislation Amendment Act 2007'],
    regulatoryFramework: ['ISO 14001 Environmental Management', 'ISO 45001 Occupational Health and Safety', 'LBMA Good Delivery Standards', 'Australian Mining Industry Code of Practice']
  },
  
  // Uranium Operations
  uranium: {
    legalName: 'Cracked Mountain Uranium Pty Ltd',
    abn: '12 345 678 905',
    acn: '123 456 793',
    businessType: 'CORPORATION',
    industry: 'Mining & Metals',
    sectors: ['Mining & Metals', 'Uranium Mining', 'Nuclear Materials'],
    regional: 'REMOTE',
    primaryLocation: 'Hercules Levee Uranium Plant, Western Australia',
    coordinates: '-25.2744,133.7751',
    facilityType: 'PROCESSING_PLANT',
    operationalStreams: ['Uranium Mining', 'Uranium Processing', 'Uranium Enrichment', 'Nuclear Safety', 'Regulatory Compliance'],
    strategicObjective: 'To be a leading supplier of high-purity uranium concentrate for nuclear power generation with the highest safety standards.',
    valueProposition: 'High-purity uranium concentrate (85-90% U3O8) with IAEA standards compliance and nuclear fuel supply for utilities.',
    competitiveAdvantage: 'Nuclear regulatory excellence, advanced processing technology, long-term contracts, and global nuclear fuel supply chain.',
    annualRevenue: 800000000,
    employeeCount: 150,
    riskProfile: 'CRITICAL',
    digitalMaturity: 'ADVANCED',
    complianceRequirements: ['Work Health and Safety Act 2011', 'Environment Protection and Biodiversity Conservation Act 1999', 'Mining Act 1978 (WA)', 'Nuclear Non-Proliferation Treaty', 'ARPANSA Act 1998'],
    regulatoryFramework: ['ISO 14001 Environmental Management', 'ISO 45001 Occupational Health and Safety', 'IAEA Nuclear Safety Standards', 'Australian Nuclear Safety Regulations']
  }
}

// Canvas type mapping based on names
const getCanvasType = (name) => {
  if (name.includes('Hercules Levee') && !name.includes('Operations')) return 'enterprise'
  if (name.includes('Mining Operations')) return 'mining'
  if (name.includes('Copper Operations')) return 'copper'
  if (name.includes('Precious Metals Operations')) return 'precious'
  if (name.includes('Uranium Operations')) return 'uranium'
  return 'enterprise' // fallback
}

const populateCanvasMetadata = async () => {
  try {
    console.log('🔧 Starting comprehensive canvas metadata population...')
    
    // Get all business canvases
    const canvases = await prisma.businessCanvas.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📋 Found ${canvases.length} canvases to update`)
    
    let updatedCount = 0
    
    for (const canvas of canvases) {
      const canvasType = getCanvasType(canvas.name)
      const data = SYNTHETIC_DATA[canvasType]
      
      if (!data) {
        console.log(`⚠️  No data template found for canvas: ${canvas.name}`)
        continue
      }
      
      console.log(`🔄 Updating ${canvas.name} (${canvasType})...`)
      
      // Update the canvas with comprehensive metadata
      const updatedCanvas = await prisma.businessCanvas.update({
        where: { id: canvas.id },
        data: {
          legalName: data.legalName,
          abn: data.abn,
          acn: data.acn,
          businessType: data.businessType,
          industry: data.industry,
          sectors: data.sectors,
          regional: data.regional,
          primaryLocation: data.primaryLocation,
          coordinates: data.coordinates,
          facilityType: data.facilityType,
          operationalStreams: data.operationalStreams,
          strategicObjective: data.strategicObjective,
          valueProposition: data.valueProposition,
          competitiveAdvantage: data.competitiveAdvantage,
          annualRevenue: data.annualRevenue,
          employeeCount: data.employeeCount,
          riskProfile: data.riskProfile,
          digitalMaturity: data.digitalMaturity,
          complianceRequirements: data.complianceRequirements,
          regulatoryFramework: data.regulatoryFramework,
          lastSaved: new Date()
        }
      })
      
      console.log(`✅ Updated ${canvas.name}:`)
      console.log(`   - Legal Name: ${updatedCanvas.legalName}`)
      console.log(`   - ABN: ${updatedCanvas.abn}`)
      console.log(`   - Industry: ${updatedCanvas.industry}`)
      console.log(`   - Sectors: ${updatedCanvas.sectors.join(', ')}`)
      console.log(`   - Revenue: $${updatedCanvas.annualRevenue?.toLocaleString()}`)
      console.log(`   - Employees: ${updatedCanvas.employeeCount}`)
      
      updatedCount++
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} canvases with comprehensive metadata`)
    
    // Verify the updates
    console.log('\n📊 Final verification:')
    const finalCanvases = await prisma.businessCanvas.findMany({
      orderBy: { name: 'asc' }
    })
    
    for (const canvas of finalCanvases) {
      console.log(`\n${canvas.name}:`)
      console.log(`  Legal Name: ${canvas.legalName || 'MISSING'}`)
      console.log(`  ABN: ${canvas.abn || 'MISSING'}`)
      console.log(`  Business Type: ${canvas.businessType || 'MISSING'}`)
      console.log(`  Industry: ${canvas.industry || 'MISSING'}`)
      console.log(`  Sectors: ${canvas.sectors?.length > 0 ? canvas.sectors.join(', ') : 'MISSING'}`)
      console.log(`  Location: ${canvas.primaryLocation || 'MISSING'}`)
      console.log(`  Value Proposition: ${canvas.valueProposition ? 'SET' : 'MISSING'}`)
      console.log(`  Annual Revenue: ${canvas.annualRevenue ? '$' + canvas.annualRevenue.toLocaleString() : 'MISSING'}`)
      console.log(`  Employee Count: ${canvas.employeeCount || 'MISSING'}`)
      console.log(`  Competitive Advantage: ${canvas.competitiveAdvantage ? 'SET' : 'MISSING'}`)
    }
    
  } catch (error) {
    console.error('❌ Error populating canvas metadata:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the population
populateCanvasMetadata()
  .then(() => {
    console.log('\n✅ Canvas metadata population completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Canvas metadata population failed:', error)
    process.exit(1)
  }) 