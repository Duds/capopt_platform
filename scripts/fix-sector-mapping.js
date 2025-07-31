#!/usr/bin/env node

/**
 * Fix sector mapping issues in business canvas data
 * Converts invalid sector names to valid sector codes
 * Ensures proper sector type mapping
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Sector mapping from invalid names to valid codes
const SECTOR_MAPPING = {
  // Industry/General terms
  'Mining & Metals': 'PRODUCTION', // Value chain sector
  'Corporate Services': 'MAJOR_MINERS', // Business model sector
  
  // Commodity-specific terms
  'Precious Metals': 'PRECIOUS_METALS',
  'Gold Mining': 'PRECIOUS_METALS',
  'Silver Mining': 'PRECIOUS_METALS',
  'Copper Mining': 'BASE_METALS',
  'Mineral Processing': 'PROCESSING',
  
  // Value chain terms
  'Mining Operations': 'PRODUCTION',
  'Processing Operations': 'PROCESSING',
  'Exploration Activities': 'EXPLORATION',
  
  // Business model terms
  'Enterprise Operations': 'MAJOR_MINERS',
  'Corporate Operations': 'MAJOR_MINERS'
}

// Sector type mapping for valid codes
const SECTOR_TYPE_MAPPING = {
  // Commodity sectors
  'COAL': 'COMMODITY',
  'IRON_ORE': 'COMMODITY',
  'PRECIOUS_METALS': 'COMMODITY',
  'BASE_METALS': 'COMMODITY',
  'BATTERY_MINERALS': 'COMMODITY',
  'INDUSTRIAL_MINERALS': 'COMMODITY',
  'RARE_EARTH_ELEMENTS': 'COMMODITY',
  'URANIUM': 'COMMODITY',
  'GEMSTONES': 'COMMODITY',
  
  // Value chain sectors
  'EXPLORATION': 'VALUE_CHAIN',
  'DEVELOPMENT': 'VALUE_CHAIN',
  'PRODUCTION': 'VALUE_CHAIN',
  'PROCESSING': 'VALUE_CHAIN',
  'CLOSURE': 'VALUE_CHAIN',
  
  // Business model sectors
  'MAJOR_MINERS': 'BUSINESS_MODEL',
  'JUNIOR_MINERS': 'BUSINESS_MODEL',
  'STATE_OWNED': 'BUSINESS_MODEL',
  'ARTISANAL_SMALL_SCALE': 'BUSINESS_MODEL',
  
  // Support services sectors
  'METS': 'SUPPORT_SERVICES',
  'CONTRACT_MINING': 'SUPPORT_SERVICES',
  'ENVIRONMENTAL_SERVICES': 'SUPPORT_SERVICES',
  'LOGISTICS_INFRASTRUCTURE': 'SUPPORT_SERVICES'
}

const fixSectorMapping = async () => {
  try {
    console.log('🔧 Starting sector mapping fix...')
    
    // Get all business canvases
    const canvases = await prisma.businessCanvas.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📋 Found ${canvases.length} canvases to fix`)
    
    for (const canvas of canvases) {
      console.log(`\n🔄 Fixing ${canvas.name}:`)
      console.log(`  Original sectors:`, canvas.sectors)
      
      if (!canvas.sectors || canvas.sectors.length === 0) {
        console.log(`  ⚠️  No sectors to fix`)
        continue
      }
      
      // Fix sectors
      const fixedSectors = []
      const sectorTypeMap = []
      
      for (const sector of canvas.sectors) {
        // Check if it's a valid sector code
        if (SECTOR_TYPE_MAPPING[sector]) {
          fixedSectors.push(sector)
          sectorTypeMap.push({
            sectorCode: sector,
            sectorType: SECTOR_TYPE_MAPPING[sector],
            isPrimary: false
          })
        } else if (SECTOR_MAPPING[sector]) {
          // Map invalid name to valid code
          const validCode = SECTOR_MAPPING[sector]
          fixedSectors.push(validCode)
          sectorTypeMap.push({
            sectorCode: validCode,
            sectorType: SECTOR_TYPE_MAPPING[validCode],
            isPrimary: false
          })
          console.log(`    🔄 Mapped "${sector}" → "${validCode}"`)
        } else {
          console.log(`    ⚠️  Unknown sector: "${sector}" - skipping`)
        }
      }
      
      // Remove duplicates
      const uniqueSectors = [...new Set(fixedSectors)]
      console.log(`  Fixed sectors:`, uniqueSectors)
      
      // Set first sector as primary
      if (sectorTypeMap.length > 0) {
        sectorTypeMap[0].isPrimary = true
      }
      
      // Update the canvas
      const updatedCanvas = await prisma.businessCanvas.update({
        where: { id: canvas.id },
        data: {
          sectors: uniqueSectors,
          lastSaved: new Date()
        }
      })
      
      console.log(`  ✅ Updated canvas with ${uniqueSectors.length} sectors`)
      console.log(`  📊 Sector type mapping:`, sectorTypeMap)
    }
    
    console.log('\n🎉 Sector mapping fix completed!')
    
    // Verify the fixes
    console.log('\n📊 Verification:')
    const finalCanvases = await prisma.businessCanvas.findMany({
      orderBy: { name: 'asc' }
    })
    
    for (const canvas of finalCanvases) {
      console.log(`\n${canvas.name}:`)
      console.log(`  Sectors:`, canvas.sectors)
      
      if (canvas.sectors && canvas.sectors.length > 0) {
        const validSectors = canvas.sectors.filter(s => SECTOR_TYPE_MAPPING[s])
        const invalidSectors = canvas.sectors.filter(s => !SECTOR_TYPE_MAPPING[s])
        
        console.log(`  ✅ Valid: ${validSectors.length}, ❌ Invalid: ${invalidSectors.length}`)
        if (invalidSectors.length > 0) {
          console.log(`  ❌ Still invalid:`, invalidSectors)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing sector mapping:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixSectorMapping()
  .then(() => {
    console.log('\n✅ Sector mapping fix completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Sector mapping fix failed:', error)
    process.exit(1)
  }) 