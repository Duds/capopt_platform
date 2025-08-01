#!/usr/bin/env node

/**
 * Test script to debug canvas update API endpoint
 */

const testCanvasUpdate = async () => {
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
    
    // Test update with minimal data
    const updateData = {
      name: canvas.name + ' (Updated)',
      description: 'Test update from debug script',
      legalName: 'Test Legal Name',
      abn: '12 345 678 901',
      acn: '123 456 789',
      businessType: 'CORPORATION',
      industry: 'Mining & Metals',
      sector: 'Mining & Metals',
      sectors: ['Mining & Metals'],
      regional: 'REMOTE',
      primaryLocation: 'Test Location',
      coordinates: '-25.2744,133.7751',
      facilityType: 'MINE',
      operationalStreams: ['Test Stream'],
      strategicObjective: 'Test objective',
      valueProposition: 'Test value prop',
      competitiveAdvantage: 'Test advantage',
      annualRevenue: 1000000,
      employeeCount: 150,
      riskProfile: 'MEDIUM',
      complianceRequirements: ['ISO 14001', 'OHSAS 18001'],
      regulatoryFramework: ['WHS Act', 'Mining Act']
    }
    
    console.log('📤 Sending update data:', JSON.stringify(updateData, null, 2))
    
    const updateResponse = await fetch(`http://localhost:3000/api/business-canvas/${canvas.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    
    console.log('📥 Response status:', updateResponse.status)
    console.log('📥 Response headers:', Object.fromEntries(updateResponse.headers.entries()))
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('❌ Update failed:', errorText)
      return
    }
    
    const updatedCanvas = await updateResponse.json()
    console.log('✅ Update successful:', updatedCanvas.name)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testCanvasUpdate() 