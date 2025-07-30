/**
 * Test script to create a business canvas with minimal data
 * Run with: node test-create-canvas.js
 */

const testCreateCanvas = async () => {
  const baseUrl = 'http://localhost:3000'
  
  // Test data for creating a canvas
  const testCanvasData = {
    name: 'Test Canvas ' + new Date().toISOString().slice(0, 19).replace(/:/g, '-'),
    description: 'Test canvas created by script',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    parentCanvasId: null // Root canvas
  }
  
  console.log('🧪 Testing canvas creation with data:', testCanvasData)
  
  try {
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCanvasData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Canvas created successfully:', result)
    console.log('Canvas ID:', result.id)
    console.log('Canvas Name:', result.name)
    
  } catch (error) {
    console.error('❌ Failed to create canvas:', error.message)
  }
}

// Test creating a child canvas
const testCreateChildCanvas = async () => {
  const baseUrl = 'http://localhost:3000'
  
  // First, get existing canvases to find a parent
  try {
    const getResponse = await fetch(`${baseUrl}/api/business-canvas`)
    if (!getResponse.ok) {
      throw new Error(`Failed to fetch canvases: ${getResponse.statusText}`)
    }
    
    const canvases = await getResponse.json()
    console.log('📋 Existing canvases:', canvases.map(c => ({ id: c.id, name: c.name })))
    
    if (canvases.length === 0) {
      console.log('⚠️ No existing canvases found. Creating root canvas first...')
      await testCreateCanvas()
      return
    }
    
    // Use the first canvas as parent
    const parentCanvas = canvases[0]
    
    const childCanvasData = {
      name: 'Test Child Canvas ' + new Date().toISOString().slice(0, 19).replace(/:/g, '-'),
      description: 'Test child canvas created by script',
      version: '1.0.0',
      isActive: true,
      status: 'DRAFT',
      editMode: 'SINGLE_USER',
      autoSave: true,
      parentCanvasId: parentCanvas.id
    }
    
    console.log('🧪 Testing child canvas creation with data:', childCanvasData)
    
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(childCanvasData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Child canvas created successfully:', result)
    console.log('Canvas ID:', result.id)
    console.log('Canvas Name:', result.name)
    console.log('Parent ID:', result.parentCanvasId)
    
  } catch (error) {
    console.error('❌ Failed to create child canvas:', error.message)
  }
}

// Test creating a canvas with invalid parent ID
const testCreateCanvasWithInvalidParent = async () => {
  const baseUrl = 'http://localhost:3000'
  
  const invalidParentData = {
    name: 'Test Invalid Parent Canvas ' + new Date().toISOString().slice(0, 19).replace(/:/g, '-'),
    description: 'Test canvas with invalid parent ID',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    parentCanvasId: 'invalid-parent-id-12345'
  }
  
  console.log('🧪 Testing canvas creation with invalid parent ID:', invalidParentData)
  
  try {
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidParentData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Expected error response:', errorText)
      console.log('✅ Foreign key constraint error caught correctly')
    } else {
      console.log('⚠️ Unexpected success - should have failed with invalid parent ID')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Main test function
const runTests = async () => {
  console.log('🚀 Starting canvas creation tests...\n')
  
  console.log('=== Test 1: Create Root Canvas ===')
  await testCreateCanvas()
  console.log('\n')
  
  console.log('=== Test 2: Create Child Canvas ===')
  await testCreateChildCanvas()
  console.log('\n')
  
  console.log('=== Test 3: Create Canvas with Invalid Parent ===')
  await testCreateCanvasWithInvalidParent()
  console.log('\n')
  
  console.log('🏁 Tests completed!')
}

// Run the tests
runTests().catch(console.error) 