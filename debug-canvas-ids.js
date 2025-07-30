/**
 * Debug script to check existing canvas IDs and tree structure
 * This will help identify if the UI is passing valid parent IDs
 */

const debugCanvasIds = async () => {
  console.log('🧪 Debugging Canvas IDs and Tree Structure...\n')

  const baseUrl = 'http://localhost:3000'

  try {
    // Get all existing canvases
    console.log('📋 Fetching all existing canvases...')
    const response = await fetch(`${baseUrl}/api/business-canvas`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const canvases = await response.json()
    console.log(`✅ Found ${canvases.length} canvases in database\n`)

    // Display all canvas IDs and their hierarchy
    console.log('📊 Canvas Hierarchy:')
    canvases.forEach((canvas, index) => {
      console.log(`${index + 1}. ID: ${canvas.id}`)
      console.log(`   Name: ${canvas.name}`)
      console.log(`   Parent ID: ${canvas.parentCanvasId || 'ROOT'}`)
      console.log(`   Status: ${canvas.status}`)
      console.log('')
    })

    // Check for any canvases with invalid parent IDs
    console.log('🔍 Checking for invalid parent references...')
    const validIds = canvases.map(c => c.id)
    const invalidParents = canvases.filter(c => 
      c.parentCanvasId && !validIds.includes(c.parentCanvasId)
    )

    if (invalidParents.length > 0) {
      console.log('❌ Found canvases with invalid parent IDs:')
      invalidParents.forEach(canvas => {
        console.log(`   - Canvas "${canvas.name}" (${canvas.id}) has invalid parent: ${canvas.parentCanvasId}`)
      })
    } else {
      console.log('✅ All parent references are valid')
    }

    // Test creating a child canvas with a real parent ID
    if (canvases.length > 0) {
      const realParentId = canvases[0].id
      console.log(`\n🧪 Testing child canvas creation with real parent ID: ${realParentId}`)
      
      const testCanvasData = {
        name: 'Test Child Canvas',
        description: 'Testing with real parent ID',
        version: '1.0.0',
        isActive: true,
        status: 'DRAFT',
        editMode: 'SINGLE_USER',
        autoSave: true,
        enterpriseId: undefined,
        facilityId: undefined,
        businessUnitId: undefined,
        parentCanvasId: realParentId
      }

      console.log('🌐 Making API call with real parent ID...')
      const createResponse = await fetch(`${baseUrl}/api/business-canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCanvasData),
      })

      if (!createResponse.ok) {
        const errorText = await createResponse.text()
        console.error('❌ API Error:', errorText)
      } else {
        const result = await createResponse.json()
        console.log('✅ Success! Child canvas created:', result.name, 'ID:', result.id)
        console.log('✅ Parent ID in result:', result.parentCanvasId)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  console.log('\n🏁 Canvas ID debugging completed!')
}

debugCanvasIds().catch(console.error) 