/**
 * Quick test script to create a single canvas
 * Run with: node quick-test.js
 */

const quickTest = async () => {
  const baseUrl = 'http://localhost:3000'
  
  const canvasData = {
    name: 'Quick Test Canvas',
    description: 'Quick test canvas',
    parentCanvasId: null // Root canvas
  }
  
  console.log('🧪 Creating canvas with data:', canvasData)
  
  try {
    const response = await fetch(`${baseUrl}/api/business-canvas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(canvasData),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error:', errorText)
    } else {
      const result = await response.json()
      console.log('✅ Success! Canvas created:', result.name, 'ID:', result.id)
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

quickTest() 