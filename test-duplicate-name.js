// Test script to verify duplicate name validation
const testDuplicateNameValidation = async () => {
  console.log('🧪 Testing duplicate name validation...')
  
  const testCanvasData = {
    name: "Test Duplicate Canvas",
    description: "This is a test canvas for duplicate name validation",
    version: "1.0",
    isActive: true,
    status: "DRAFT",
    editMode: "SINGLE_USER",
    autoSave: true
  }
  
  try {
    // First request - should succeed
    console.log('📝 Creating first canvas...')
    const response1 = await fetch('/api/business-canvas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCanvasData),
    })
    
    if (response1.ok) {
      const canvas1 = await response1.json()
      console.log('✅ First canvas created successfully:', canvas1.id)
      
      // Second request with same name - should fail
      console.log('📝 Attempting to create second canvas with same name...')
      const response2 = await fetch('/api/business-canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCanvasData),
      })
      
      if (!response2.ok) {
        const errorData = await response2.json()
        console.log('✅ Duplicate name validation working correctly!')
        console.log('📋 Error response:', {
          status: response2.status,
          error: errorData.error,
          details: errorData.details,
          code: errorData.code
        })
        
        if (response2.status === 409 && errorData.code === 'DUPLICATE_NAME') {
          console.log('🎉 SUCCESS: Duplicate name validation is working as expected!')
        } else {
          console.log('⚠️  WARNING: Unexpected error response format')
        }
      } else {
        console.log('❌ ERROR: Second canvas was created when it should have failed')
      }
    } else {
      console.log('❌ ERROR: First canvas creation failed:', response1.status, response1.statusText)
    }
    
  } catch (error) {
    console.error('❌ ERROR: Test failed:', error)
  }
}

// Run the test
testDuplicateNameValidation() 