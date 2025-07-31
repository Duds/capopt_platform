#!/usr/bin/env node

/**
 * Test script to debug canvas update API endpoint with SectorSelection objects
 */

const testCanvasUpdateWithSectors = async () => {
  try {
    // First, get a canvas to update
    console.log('🔍 Getting canvas list...')
    const listResponse = await fetch('http://localhost:3000/api/business-canvas')
    const canvases = await listResponse.json()
    
    if (!canvases || canvases.length === 0) {
      console.error('❌ No canvases found')
      return
    }
    
    const canvas = canvases[0]
    console.log('✅ Found canvas:', canvas.name, 'ID:', canvas.id)
    
    // Test update with SectorSelection objects (like the form would send)
    const updateData = {
      name: canvas.name + ' (Sector Test)',
      description: 'Test update with SectorSelection objects',
      legalName: 'Test Legal Name',
      abn: '12 345 678 901',
      acn: '123 456 789',
      businessType: 'CORPORATION',
      industry: 'Mining & Metals',
      sector: 'Mining & Metals',
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
          sectorType: 'VALUE_CHAIN',
          isPrimary: false
        }
      ],
      regional: 'REMOTE',
      primaryLocation: 'Test Location',
      coordinates: '-25.2744,133.7751',
      facilityType: 'MINE',
      operationalStreams: ['Test Stream 1', 'Test Stream 2'],
      strategicObjective: 'Test objective with sectors',
      valueProposition: 'Test value prop with sectors',
      competitiveAdvantage: 'Test advantage with sectors',
      annualRevenue: 2000000,
      employeeCount: 200,
      riskProfile: 'HIGH',
      digitalMaturity: 'ADVANCED',
      complianceRequirements: ['Test Requirement 1', 'Test Requirement 2'],
      regulatoryFramework: ['Test Framework 1', 'Test Framework 2']
    }
    
    console.log('📤 Sending update data with SectorSelection objects:')
    console.log('📤 Sectors:', JSON.stringify(updateData.sectors, null, 2))
    
    const updateResponse = await fetch(`http://localhost:3000/api/business-canvas/${canvas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    
    console.log('📥 Response status:', updateResponse.status)
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('❌ Update failed:', errorText)
      return
    }
    
    const updatedCanvas = await updateResponse.json()
    console.log('✅ Update successful:', updatedCanvas.name)
    console.log('✅ Updated sectors (should be string array):', updatedCanvas.sectors)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testCanvasUpdateWithSectors() 