/**
 * Test script for Geoapify API integration
 * Tests real API calls to verify location validation works correctly
 */

const testGeoapifyAPI = async () => {
  console.log('🧪 Testing Geoapify API Integration...\n')

  // Get API key from environment (you'll need to set this)
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || 'your_actual_api_key_here'
  
  if (apiKey === 'your_actual_api_key_here') {
    console.log('❌ No valid API key found!')
    console.log('📝 Please:')
    console.log('1. Sign up at https://www.geoapify.com/')
    console.log('2. Get your free API key')
    console.log('3. Update .env.local with: NEXT_PUBLIC_GEOAPIFY_API_KEY=your_real_key')
    console.log('4. Restart your development server')
    return
  }

  console.log('✅ API key found, testing real API calls...\n')

  const testCases = [
    {
      name: 'Valid Location - Sydney',
      query: 'Sydney, NSW, Australia',
      expected: 'Should return valid location with city, state, country'
    },
    {
      name: 'Valid Location - Melbourne',
      query: 'Melbourne, Victoria, Australia',
      expected: 'Should return valid location with city, state, country'
    },
    {
      name: 'Invalid Location - Lorem Ipsum',
      query: 'Lorem, Ipsum, Dolor',
      expected: 'Should return error or no results'
    },
    {
      name: 'Partial Location - Just City',
      query: 'Brisbane',
      expected: 'Should return suggestions or valid location'
    },
    {
      name: 'International Location - New York',
      query: 'New York, NY, USA',
      expected: 'Should return valid international location'
    }
  ]

  for (const testCase of testCases) {
    console.log(`📋 ${testCase.name}`)
    console.log(`🔍 Query: "${testCase.query}"`)
    console.log(`📝 Expected: ${testCase.expected}`)

    try {
      // Test autocomplete API
      const autocompleteResponse = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(testCase.query)}&format=json&limit=5&apiKey=${apiKey}`
      )

      if (!autocompleteResponse.ok) {
        throw new Error(`Autocomplete API error: ${autocompleteResponse.status}`)
      }

      const autocompleteData = await autocompleteResponse.json()
      
      if (autocompleteData.results && autocompleteData.results.length > 0) {
        const result = autocompleteData.results[0]
        console.log('✅ Autocomplete Results:')
        console.log(`   - Formatted: ${result.formatted}`)
        console.log(`   - City: ${result.city || result.town || result.village || 'N/A'}`)
        console.log(`   - State: ${result.state || result.county || 'N/A'}`)
        console.log(`   - Country: ${result.country || 'N/A'}`)
        console.log(`   - Coordinates: ${result.lat}, ${result.lon}`)
      } else {
        console.log('❌ No autocomplete results found')
      }

      // Test search API (for validation)
      const searchResponse = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(testCase.query)}&format=json&limit=1&apiKey=${apiKey}`
      )

      if (!searchResponse.ok) {
        throw new Error(`Search API error: ${searchResponse.status}`)
      }

      const searchData = await searchResponse.json()
      
      if (searchData.results && searchData.results.length > 0) {
        const result = searchData.results[0]
        console.log('✅ Search Validation:')
        console.log(`   - Valid: Yes`)
        console.log(`   - Formatted: ${result.formatted}`)
        console.log(`   - City: ${result.city || result.town || result.village || 'N/A'}`)
        console.log(`   - State: ${result.state || result.county || 'N/A'}`)
        console.log(`   - Country: ${result.country || 'N/A'}`)
      } else {
        console.log('❌ Search Validation: Location not found')
      }

    } catch (error) {
      console.error('❌ API Error:', error.message)
    }

    console.log('') // Empty line between tests
  }

  console.log('🏁 API testing completed!')
  console.log('\n📝 Next steps:')
  console.log('1. If tests pass, restart your Next.js dev server')
  console.log('2. Try the location input in the canvas form')
  console.log('3. You should now see real validation and autocomplete')
}

testGeoapifyAPI().catch(console.error) 