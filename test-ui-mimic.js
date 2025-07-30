/**
 * Test script that mimics what the UI form sends
 * This will help us debug the difference between UI and direct API calls
 */

const testUIMimic = async () => {
  const baseUrl = 'http://localhost:3000'
  
  // Mimic what the UI form sends when creating a root canvas
  const uiFormData = {
    name: 'UI Test Canvas',
    description: 'Test from UI form',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    enterpriseId: undefined,
    facilityId: undefined,
    businessUnitId: undefined,
    parentCanvasId: undefined // This is what the UI sends for root canvas
  }
  
  console.log('🧪 Testing UI form data:', JSON.stringify(uiFormData, null, 2))
  
  try {
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uiFormData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
    } else {
      const result = await response.json()
      console.log('✅ Success! Canvas created:', result.name, 'ID:', result.id)
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

// Test with empty string parentCanvasId (what might be happening in UI)
const testEmptyStringParent = async () => {
  const baseUrl = 'http://localhost:3000'
  
  const emptyStringData = {
    name: 'Empty String Test Canvas - FIXED',
    description: 'Test with empty string parentCanvasId (should now work)',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    parentCanvasId: '' // Empty string - should now be converted to null
  }
  
  console.log('\n🧪 Testing with empty string parentCanvasId (FIXED):', JSON.stringify(emptyStringData, null, 2))
  
  try {
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emptyStringData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
    } else {
      const result = await response.json()
      console.log('✅ Success! Canvas created:', result.name, 'ID:', result.id)
      console.log('✅ parentCanvasId:', result.parentCanvasId)
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

// Test with invalid parent ID (what might be happening when UI sends wrong ID)
const testInvalidParentId = async () => {
  const baseUrl = 'http://localhost:3000'
  
  const invalidParentData = {
    name: 'Invalid Parent Test Canvas',
    description: 'Test with invalid parent ID',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    parentCanvasId: 'some-invalid-id' // Invalid ID
  }
  
  console.log('\n🧪 Testing with invalid parent ID:', JSON.stringify(invalidParentData, null, 2))
  
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
      console.error('❌ Error response:', errorText)
    } else {
      const result = await response.json()
      console.log('✅ Success! Canvas created:', result.name, 'ID:', result.id)
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

const runTests = async () => {
  console.log('🚀 Testing UI form data scenarios...\n')
  
  await testUIMimic()
  await testEmptyStringParent()
  await testInvalidParentId()
  
  console.log('\n🏁 UI mimic tests completed!')
}

runTests().catch(console.error) 