#!/usr/bin/env node

/**
 * Simple analysis of sector issues in the business canvas data
 */

const analyzeSectorIssues = async () => {
  try {
    console.log('🔍 Analyzing sector issues...')
    
    // Get all business canvases via API
    const response = await fetch('http://localhost:3000/api/business-canvas')
    const canvases = await response.json()
    
    console.log(`📋 Found ${canvases.length} canvases to analyze`)
    
    // Define valid sector codes based on sector-framework.ts
    const validSectorCodes = [
      // Commodity sectors
      'COAL', 'IRON_ORE', 'PRECIOUS_METALS', 'BASE_METALS', 'BATTERY_MINERALS', 
      'INDUSTRIAL_MINERALS', 'RARE_EARTH_ELEMENTS', 'URANIUM', 'GEMSTONES',
      // Value chain sectors
      'EXPLORATION', 'DEVELOPMENT', 'PRODUCTION', 'PROCESSING', 'CLOSURE',
      // Business model sectors
      'MAJOR_MINERS', 'JUNIOR_MINERS', 'STATE_OWNED', 'ARTISANAL_SMALL_SCALE',
      // Support services sectors
      'METS', 'CONTRACT_MINING', 'ENVIRONMENTAL_SERVICES', 'LOGISTICS_INFRASTRUCTURE'
    ]
    
    console.log('✅ Valid sector codes:', validSectorCodes)
    
    // Analyze each canvas
    for (const canvas of canvases) {
      console.log(`\n🔍 Analyzing ${canvas.name}:`)
      console.log(`  Current sectors:`, canvas.sectors)
      
      if (!canvas.sectors || canvas.sectors.length === 0) {
        console.log(`  ❌ No sectors found`)
        continue
      }
      
      // Check each sector
      const validSectors = []
      const invalidSectors = []
      
      for (const sector of canvas.sectors) {
        if (validSectorCodes.includes(sector)) {
          validSectors.push(sector)
        } else {
          invalidSectors.push(sector)
        }
      }
      
      console.log(`  ✅ Valid sectors (${validSectors.length}):`, validSectors)
      console.log(`  ❌ Invalid sectors (${invalidSectors.length}):`, invalidSectors)
      
      // Suggest fixes
      if (invalidSectors.length > 0) {
        console.log(`  🔧 Suggested fixes:`)
        invalidSectors.forEach(invalidSector => {
          console.log(`    - "${invalidSector}" needs to be mapped to a valid sector code`)
        })
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY:')
    console.log('1. Valid sector codes are defined in sector-framework.ts')
    console.log('2. Seeded data contains mixed valid/invalid sector codes')
    console.log('3. Form conversion logic needs to handle sector type mapping')
    console.log('4. Need to create mapping for descriptive sector names to valid codes')
    
    // Specific issues found
    console.log('\n🚨 SPECIFIC ISSUES:')
    console.log('- "Mining & Metals" is not a valid sector code')
    console.log('- "Corporate Services" is not a valid sector code')
    console.log('- "Gold Mining" and "Silver Mining" should be "PRECIOUS_METALS"')
    console.log('- "Mineral Processing" should be "PROCESSING"')
    console.log('- "Copper Mining" should be "BASE_METALS"')
    
  } catch (error) {
    console.error('❌ Error analyzing sector issues:', error)
    throw error
  }
}

// Run the analysis
analyzeSectorIssues()
  .then(() => {
    console.log('\n✅ Sector analysis completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Sector analysis failed:', error)
    process.exit(1)
  }) 