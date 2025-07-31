#!/usr/bin/env node

/**
 * Test script to verify sectors saving functionality
 */

const testSectorsSaving = async () => {
  try {
    // Get a canvas to test with
    console.log('🔍 Getting canvas for testing...')
    const listResponse = await fetch('http://localhost:3000/api/business-canvas')
    const canvases = await listResponse.json()
    
    if (!canvases || canvases.length === 0) {
      console.error('❌ No canvases found')
      return
    }
    
    const canvas = canvases[0]
    console.log('✅ Testing with canvas:', canvas.name, 'ID:', canvas.id)
    console.log('📊 Current sectors:', canvas.sectors)
    
    // Test data with manually applied sectors
    const formData = {
      name: canvas.name,
      legalName: canvas.legalName,
      abn: canvas.abn,
      acn: canvas.acn,
      businessType: canvas.businessType,
      industry: canvas.industry,
      sectors: [
        {
          sectorCode: 'COAL',
          sectorType: 'COMMODITY',
          isPrimary: true
        },
        {
          sectorCode: 'IRON_ORE',
          sectorType: 'COMMODITY',
          isPrimary: false
        },
        {
          sectorCode: 'EXPLORATION',
          sectorType: 'value-chain',
          isPrimary: false
        }
      ],
      regional: canvas.regional,
      primaryLocation: canvas.primaryLocation,
      facilityType: canvas.facilityType,
      operationalStreams: canvas.operationalStreams,
      strategicObjective: canvas.strategicObjective,
      valueProposition: canvas.valueProposition,
      competitiveAdvantage: canvas.competitiveAdvantage,
      annualRevenue: canvas.annualRevenue,
      employeeCount: canvas.employeeCount,
      riskProfile: canvas.riskProfile,
      digitalMaturity: canvas.digitalMaturity,
      complianceRequirements: canvas.complianceRequirements,
      regulatoryFramework: canvas.regulatoryFramework
    }
    
    console.log('📤 Sending form data with sectors:', JSON.stringify(formData.sectors, null, 2))
    
    const updateResponse = await fetch(`http://localhost:3000/api/business-canvas/${canvas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    
    console.log('📥 Response status:', updateResponse.status)
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('❌ Update failed:', errorText)
      return
    }
    
    const updatedCanvas = await updateResponse.json()
    console.log('✅ Update successful!')
    console.log('📊 Updated sectors:', updatedCanvas.sectors)
    
    // Verify the sectors were converted correctly
    console.log('🔍 Sector conversion check:')
    console.log('  - Input sectors (objects):', formData.sectors)
    console.log('  - Output sectors (strings):', updatedCanvas.sectors)
    
    // Test that the sectors are properly stored as strings
    const expectedSectors = ['COAL', 'IRON_ORE', 'EXPLORATION']
    const sectorsMatch = JSON.stringify(updatedCanvas.sectors.sort()) === JSON.stringify(expectedSectors.sort())
    
    console.log('✅ Sectors match expected:', sectorsMatch)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testSectorsSaving() 