/**
 * Debug script to capture and analyze what the UI is actually sending
 * This will help us identify the exact issue with the UI request
 */

const debugUIRequest = async () => {
  const baseUrl = 'http://localhost:3000'
  
  // Test all possible problematic values that the UI might send
  const testCases = [
    {
      name: 'Test Case 1: undefined parentCanvasId',
      data: {
        name: 'Debug Test 1',
        description: 'Testing undefined parentCanvasId',
        parentCanvasId: undefined
      }
    },
    {
      name: 'Test Case 2: null parentCanvasId',
      data: {
        name: 'Debug Test 2',
        description: 'Testing null parentCanvasId',
        parentCanvasId: null
      }
    },
    {
      name: 'Test Case 3: empty string parentCanvasId',
      data: {
        name: 'Debug Test 3',
        description: 'Testing empty string parentCanvasId',
        parentCanvasId: ''
      }
    },
    {
      name: 'Test Case 4: whitespace string parentCanvasId',
      data: {
        name: 'Debug Test 4',
        description: 'Testing whitespace string parentCanvasId',
        parentCanvasId: '   '
      }
    },
    {
      name: 'Test Case 5: invalid UUID parentCanvasId',
      data: {
        name: 'Debug Test 5',
        description: 'Testing invalid UUID parentCanvasId',
        parentCanvasId: 'invalid-uuid-123'
      }
    },
    {
      name: 'Test Case 6: missing parentCanvasId field',
      data: {
        name: 'Debug Test 6',
        description: 'Testing missing parentCanvasId field'
        // No parentCanvasId field at all
      }
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n🧪 ${testCase.name}`)
    console.log('📤 Sending data:', JSON.stringify(testCase.data, null, 2))
    
    try {
      const response = await fetch(`${baseUrl}/api/business-canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        
        // Try to parse the error details
        try {
          const errorJson = JSON.parse(errorText)
          console.error('❌ Parsed error:', errorJson)
        } catch (e) {
          console.error('❌ Could not parse error as JSON')
        }
      } else {
        const result = await response.json()
        console.log('✅ Success! Canvas created:', result.name, 'ID:', result.id)
        console.log('✅ parentCanvasId in result:', result.parentCanvasId)
      }
      
    } catch (error) {
      console.error('❌ Network error:', error.message)
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

// Also test what happens when we send the exact same data structure as the UI might send
const testUILikeData = async () => {
  const baseUrl = 'http://localhost:3000'
  
  // This mimics the exact structure the UI might be sending
  const uiLikeData = {
    name: 'UI-Like Test Canvas',
    description: 'Test canvas with UI-like data structure',
    version: '1.0.0',
    isActive: true,
    status: 'DRAFT',
    editMode: 'SINGLE_USER',
    autoSave: true,
    enterpriseId: undefined,
    facilityId: undefined,
    businessUnitId: undefined,
    parentCanvasId: undefined,
    // Include all the nested arrays that might be causing issues
    valuePropositions: [],
    customerSegments: [],
    revenueStreams: [],
    partnerships: [],
    resources: [],
    activities: [],
    costStructures: [],
    channels: []
  }
  
  console.log('\n🧪 Testing UI-like data structure')
  console.log('📤 Sending data:', JSON.stringify(uiLikeData, null, 2))
  
  try {
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uiLikeData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
    } else {
      const result = await response.json()
      console.log('✅ Success! Canvas created:', result.name, 'ID:', result.id)
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

const runDebugTests = async () => {
  console.log('🔍 Starting comprehensive UI request debugging...\n')
  
  await debugUIRequest()
  await testUILikeData()
  
  console.log('\n🏁 Debug tests completed!')
}

runDebugTests().catch(console.error) 