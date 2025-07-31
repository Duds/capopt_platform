#!/usr/bin/env node

/**
 * Analyze sector issues in the business canvas data
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Import sector definitions
const {
  COMMODITY_SECTORS,
  VALUE_CHAIN_SECTORS,
  BUSINESS_MODEL_SECTORS,
  SUPPORT_SERVICES_SECTORS,
  ALL_SECTORS
} = require('../lib/sector-framework.ts')

const analyzeSectorIssues = async () => {
  try {
    console.log('🔍 Analyzing sector issues...')
    
    // Get all business canvases
    const canvases = await prisma.businessCanvas.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📋 Found ${canvases.length} canvases to analyze`)
    
    // Get all valid sector codes
    const validSectorCodes = Object.keys(ALL_SECTORS)
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
      const sectorTypeMapping = []
      
      for (const sector of canvas.sectors) {
        if (validSectorCodes.includes(sector)) {
          validSectors.push(sector)
          const sectorData = ALL_SECTORS[sector]
          sectorTypeMapping.push({
            sectorCode: sector,
            sectorType: sectorData.category,
            name: sectorData.name
          })
        } else {
          invalidSectors.push(sector)
        }
      }
      
      console.log(`  ✅ Valid sectors (${validSectors.length}):`, validSectors)
      console.log(`  ❌ Invalid sectors (${invalidSectors.length}):`, invalidSectors)
      
      if (sectorTypeMapping.length > 0) {
        console.log(`  📊 Sector type mapping:`)
        sectorTypeMapping.forEach(mapping => {
          console.log(`    - ${mapping.sectorCode} (${mapping.sectorType}): ${mapping.name}`)
        })
      }
      
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
    
  } catch (error) {
    console.error('❌ Error analyzing sector issues:', error)
    throw error
  } finally {
    await prisma.$disconnect()
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