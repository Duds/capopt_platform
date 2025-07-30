/**
 * Test script to debug form submission and API calls
 * Simulates the exact data flow from form to API
 */

const testFormSubmission = async () => {
  console.log('🧪 Testing Form Submission Debug...\n')

  const baseUrl = 'http://localhost:3000'

  // Simulate different scenarios
  const testScenarios = [
    {
      name: 'Root Canvas Creation',
      isCreatingRootCanvas: true,
      selectedCanvas: 'some-existing-id',
      expectedParentCanvasId: null
    },
    {
      name: 'Child Canvas Creation - Valid Parent',
      isCreatingRootCanvas: false,
      selectedCanvas: 'valid-parent-id-123',
      expectedParentCanvasId: 'valid-parent-id-123'
    },
    {
      name: 'Child Canvas Creation - Empty String',
      isCreatingRootCanvas: false,
      selectedCanvas: '',
      expectedParentCanvasId: null
    },
    {
      name: 'Child Canvas Creation - Whitespace',
      isCreatingRootCanvas: false,
      selectedCanvas: '   ',
      expectedParentCanvasId: null
    },
    {
      name: 'Child Canvas Creation - Undefined',
      isCreatingRootCanvas: false,
      selectedCanvas: undefined,
      expectedParentCanvasId: null
    }
  ]

  for (const scenario of testScenarios) {
    console.log(`📋 ${scenario.name}`)
    console.log(`🔍 isCreatingRootCanvas: ${scenario.isCreatingRootCanvas}`)
    console.log(`🔍 selectedCanvas: "${scenario.selectedCanvas}" (type: ${typeof scenario.selectedCanvas})`)
    
    // Simulate the exact logic from the component
    const parentCanvasId = scenario.isCreatingRootCanvas 
      ? undefined 
      : (scenario.selectedCanvas && scenario.selectedCanvas.trim() !== '' ? scenario.selectedCanvas : undefined)
    
    console.log(`✅ Calculated parentCanvasId: ${parentCanvasId} (type: ${typeof parentCanvasId})`)
    console.log(`📝 Expected: ${scenario.expectedParentCanvasId}`)

    // Simulate form data
    const formData = {
      name: 'Test Canvas',
      legalName: 'Test Legal Name',
      businessType: 'BUSINESS_UNIT',
      industry: 'MINING_METALS',
      sector: 'COPPER',
      subSector: '',
      operationalScope: 'REGIONAL',
      facilityType: 'PRODUCTION',
      operationalStreams: [],
      strategicObjective: 'Test objective',
      valueProposition: 'Test value',
      targetMarkets: [],
      competitiveAdvantage: 'Test advantage',
      riskProfile: 'MEDIUM',
      complianceRequirements: [],
      regulatoryFramework: [],
      annualRevenue: 1000000,
      employeeCount: 100,
      budget: 500000,
      currency: 'AUD',
      primaryLocation: 'Sydney, NSW, Australia',
      primaryLocationValidation: {
        isValid: true,
        city: 'Sydney',
        state: 'New South Wales',
        country: 'Australia',
        formatted: 'Sydney, NSW, Australia'
      },
      operatingRegions: [],
      timeZone: 'Australia/Sydney',
      technologyStack: [],
      digitalMaturity: 'INTERMEDIATE',
      automationLevel: 'SEMI_AUTOMATED',
      parentCanvasId: parentCanvasId,
      enterpriseId: undefined,
      facilityId: undefined,
      businessUnitId: undefined
    }

    console.log('🔍 Form data parentCanvasId:', formData.parentCanvasId)

    // Simulate the canvas data preparation
    const canvasData = {
      name: formData.name,
      description: formData.strategicObjective || formData.valueProposition || '',
      version: '1.0.0',
      isActive: true,
      status: 'DRAFT',
      editMode: 'SINGLE_USER',
      autoSave: true,
      enterpriseId: formData.enterpriseId,
      facilityId: formData.facilityId,
      businessUnitId: formData.businessUnitId,
      parentCanvasId: formData.parentCanvasId && formData.parentCanvasId.trim() !== '' ? formData.parentCanvasId : null
    }

    console.log('🔍 Canvas data parentCanvasId:', canvasData.parentCanvasId)
    console.log('🔍 Canvas data type:', typeof canvasData.parentCanvasId)

    // Additional validation (from the component)
    if (canvasData.parentCanvasId === '' || (typeof canvasData.parentCanvasId === 'string' && canvasData.parentCanvasId.trim() === '')) {
      console.warn('⚠️ WARNING: parentCanvasId is empty/whitespace string, converting to null')
      canvasData.parentCanvasId = null
    }

    console.log('🔍 Final canvas data parentCanvasId:', canvasData.parentCanvasId)
    console.log('🔍 Final canvas data type:', typeof canvasData.parentCanvasId)

    // Test API call
    try {
      console.log('🌐 Making API call...')
      const response = await fetch(`${baseUrl}/api/business-canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canvasData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        
        try {
          const errorJson = JSON.parse(errorText)
          console.error('❌ Parsed error:', errorJson)
        } catch (e) {
          console.error('❌ Could not parse error as JSON')
        }
      } else {
        const result = await response.json()
        console.log('✅ API Success! Canvas created:', result.name, 'ID:', result.id)
        console.log('✅ parentCanvasId in result:', result.parentCanvasId)
      }

    } catch (error) {
      console.error('❌ Network error:', error.message)
    }

    console.log('') // Empty line between tests
  }

  console.log('🏁 Form submission testing completed!')
}

testFormSubmission().catch(console.error) 