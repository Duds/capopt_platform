// Test script to verify cascade delete and archive operations
const testCascadeOperations = async () => {
  console.log('🧪 Testing cascade delete and archive operations...')
  
  try {
    // First, get all existing canvases
    console.log('📋 Fetching existing canvases...')
    const response = await fetch('/api/business-canvas')
    const canvases = await response.json()
    
    if (canvases.length === 0) {
      console.log('❌ No canvases found to test cascade operations')
      return
    }
    
    console.log('✅ Found', canvases.length, 'canvases for testing')
    
    // Find a parent canvas with children for testing
    const parentCanvas = canvases.find(canvas => {
      const hasChildren = canvases.some(child => child.parentCanvasId === canvas.id)
      return hasChildren
    })
    
    if (!parentCanvas) {
      console.log('ℹ️  No parent canvas with children found for cascade testing')
      console.log('📝 Testing single canvas operations instead...')
      
      // Test single canvas delete
      const testCanvas = canvases[0]
      console.log('🎯 Testing single canvas delete:', testCanvas.name)
      
      const deleteResponse = await fetch(`/api/business-canvas/${testCanvas.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (deleteResponse.ok) {
        const result = await deleteResponse.json()
        console.log('✅ Single canvas delete result:', result)
      } else {
        console.log('❌ Single canvas delete failed:', deleteResponse.status)
      }
      
      return
    }
    
    // Count children and grandchildren
    const children = canvases.filter(c => c.parentCanvasId === parentCanvas.id)
    const grandchildren = children.flatMap(child => 
      canvases.filter(c => c.parentCanvasId === child.id)
    )
    
    console.log('🎯 Testing cascade operations with parent canvas:', parentCanvas.name)
    console.log('📊 Hierarchy:', {
      parent: parentCanvas.name,
      children: children.length,
      grandchildren: grandchildren.length,
      totalDescendants: children.length + grandchildren.length
    })
    
    // Test 1: Cascade Archive
    console.log('📦 Testing cascade archive...')
    const archiveResponse = await fetch(`/api/business-canvas/${parentCanvas.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ARCHIVED' }),
    })
    
    if (archiveResponse.ok) {
      const result = await archiveResponse.json()
      console.log('✅ Cascade archive result:', result)
      
      if (result.cascadeInfo) {
        console.log('✅ Cascade archive successful:', {
          archivedCount: result.cascadeInfo.archivedCount,
          descendantCount: result.cascadeInfo.descendantCount
        })
      }
    } else {
      console.log('❌ Cascade archive failed:', archiveResponse.status)
      const errorData = await archiveResponse.json()
      console.log('Error details:', errorData)
    }
    
    // Test 2: Verify archived canvases
    console.log('🔍 Verifying archived canvases...')
    const verifyResponse = await fetch('/api/business-canvas')
    const updatedCanvases = await verifyResponse.json()
    
    const archivedCanvases = updatedCanvases.filter(c => c.status === 'ARCHIVED')
    const parentArchived = archivedCanvases.find(c => c.id === parentCanvas.id)
    const childrenArchived = children.filter(child => 
      archivedCanvases.some(c => c.id === child.id)
    )
    
    console.log('📊 Archive verification:', {
      totalArchived: archivedCanvases.length,
      parentArchived: !!parentArchived,
      childrenArchived: childrenArchived.length,
      expectedChildrenArchived: children.length
    })
    
    // Test 3: Cascade Delete (if we have test data to spare)
    console.log('🗑️  Testing cascade delete...')
    const deleteResponse = await fetch(`/api/business-canvas/${parentCanvas.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (deleteResponse.ok) {
      const result = await deleteResponse.json()
      console.log('✅ Cascade delete result:', result)
      
      console.log('✅ Cascade delete successful:', {
        deletedCount: result.deletedCount,
        descendantCount: result.descendantCount
      })
    } else {
      console.log('❌ Cascade delete failed:', deleteResponse.status)
      const errorData = await deleteResponse.json()
      console.log('Error details:', errorData)
    }
    
    // Test 4: Verify deleted canvases
    console.log('🔍 Verifying deleted canvases...')
    const finalResponse = await fetch('/api/business-canvas')
    const finalCanvases = await finalResponse.json()
    
    const parentStillExists = finalCanvases.some(c => c.id === parentCanvas.id)
    const childrenStillExist = children.some(child => 
      finalCanvases.some(c => c.id === child.id)
    )
    
    console.log('📊 Delete verification:', {
      remainingCanvases: finalCanvases.length,
      parentStillExists,
      childrenStillExist,
      expectedDeletion: !parentStillExists && !childrenStillExist
    })
    
    console.log('🎉 Cascade operations tests completed!')
    
  } catch (error) {
    console.error('❌ ERROR: Test failed:', error)
  }
}

// Run the test
testCascadeOperations() 