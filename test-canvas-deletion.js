// Test script to verify canvas deletion and cleanup
const testCanvasDeletion = async () => {
  console.log('🧪 Testing canvas deletion and cleanup...')
  
  try {
    // First, get all existing canvases
    console.log('📋 Fetching existing canvases...')
    const response = await fetch('/api/business-canvas')
    const canvases = await response.json()
    
    if (canvases.length === 0) {
      console.log('❌ No canvases found to test deletion')
      return
    }
    
    // Select the first canvas for testing
    const testCanvas = canvases[0]
    console.log('🎯 Testing with canvas:', testCanvas.name, '(ID:', testCanvas.id, ')')
    
    // Test 1: Delete the canvas
    console.log('🗑️  Testing canvas deletion...')
    const deleteResponse = await fetch(`/api/business-canvas/${testCanvas.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (deleteResponse.ok) {
      console.log('✅ Canvas deleted successfully')
      
      // Test 2: Verify canvas is no longer in the list
      console.log('🔍 Verifying canvas is removed from list...')
      const verifyResponse = await fetch('/api/business-canvas')
      const updatedCanvases = await verifyResponse.json()
      
      const canvasStillExists = updatedCanvases.some(c => c.id === testCanvas.id)
      if (!canvasStillExists) {
        console.log('✅ Canvas successfully removed from database')
      } else {
        console.log('❌ ERROR: Canvas still exists in database after deletion')
      }
      
      // Test 3: Try to access the deleted canvas (should return 404)
      console.log('🔍 Testing access to deleted canvas...')
      const accessResponse = await fetch(`/api/business-canvas/${testCanvas.id}`)
      if (accessResponse.status === 404) {
        console.log('✅ Deleted canvas correctly returns 404')
      } else {
        console.log('❌ ERROR: Deleted canvas should return 404, got:', accessResponse.status)
      }
      
    } else {
      console.log('❌ ERROR: Failed to delete canvas:', deleteResponse.status, deleteResponse.statusText)
      const errorData = await deleteResponse.json()
      console.log('Error details:', errorData)
    }
    
  } catch (error) {
    console.error('❌ ERROR: Test failed:', error)
  }
}

// Run the test
testCanvasDeletion() 