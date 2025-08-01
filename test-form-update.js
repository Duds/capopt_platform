#!/usr/bin/env node

/**
 * Test script to verify form update functionality
 */

const testFormUpdate = async () => {
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
    
    // Test data that would come from the form
    const formData = {
      name: canvas.name + ' (Form Test)',
      legalName: 'Test Legal Name Updated',
      abn: '98 765 432 109',
      acn: '987 654 321',
      businessType: 'CORPORATION',
      industry: 'Mining & Metals',
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
        }
      ],
      regional: 'REMOTE',
      primaryLocation: 'Test Location Updated',
      coordinates: '-25.2744,133.7751',
      facilityType: 'MINE',
      operationalStreams: ['Test Stream 1', 'Test Stream 2'],
      strategicObjective: 'Test strategic objective updated',
      valueProposition: 'Test value proposition updated',
      competitiveAdvantage: 'Test competitive advantage updated',
      annualRevenue: 999999999,
      employeeCount: 150,
      riskProfile: 'MEDIUM',
      complianceRequirements: ['ISO 14001', 'OHSAS 18001'],
      regulatoryFramework: ['WHS Act', 'Mining Act']
    }
    
    console.log('📤 Sending form data:', JSON.stringify(formData, null, 2))
    
    const updateResponse = await fetch(`http://localhost:3000/api/business-canvas/${canvas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    
    console.log('📥 Response status:', updateResponse.status)
    console.log('📥 Response headers:', Object.fromEntries(updateResponse.headers.entries()))
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('❌ Update failed:', errorText)
      return
    }
    
    const updatedCanvas = await updateResponse.json()
    console.log('✅ Update successful!')
    console.log('📊 Updated fields:')
    console.log('  - Name:', updatedCanvas.name)
    console.log('  - Legal Name:', updatedCanvas.legalName)
    console.log('  - ABN:', updatedCanvas.abn)
    console.log('  - Industry:', updatedCanvas.industry)
    console.log('  - Sectors:', updatedCanvas.sectors)
    console.log('  - Location:', updatedCanvas.primaryLocation)
    console.log('  - Value Proposition:', updatedCanvas.valueProposition)
    console.log('  - Annual Revenue:', updatedCanvas.annualRevenue)
    console.log('  - Employee Count:', updatedCanvas.employeeCount)
    console.log('  - Competitive Advantage:', updatedCanvas.competitiveAdvantage)
    
    // Verify the sectors were converted correctly
    console.log('🔍 Sector conversion check:')
    console.log('  - Input sectors (objects):', formData.sectors)
    console.log('  - Output sectors (strings):', updatedCanvas.sectors)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testFormUpdate() 