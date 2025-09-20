/**
 * Test script for the dynamic trending system
 * Run this in the browser console to test the integration
 */

async function testTrendingSystem() {
  console.log('🧪 Testing Dynamic Trending System...')
  
  try {
    // Test 1: Track a search query
    console.log('\n1️⃣ Testing search tracking...')
    const testQuery = 'pattaya restaurants'
    
    // Simulate search tracking
    const trackingResponse = await fetch('/api/search-analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: testQuery,
        category: 'Food',
        source: 'test-script',
        userAgent: navigator.userAgent,
        sessionId: `test_${Date.now()}`
      })
    })
    
    if (trackingResponse.ok) {
      const trackingResult = await trackingResponse.json()
      console.log('✅ Search tracking successful:', trackingResult)
    } else {
      console.log('❌ Search tracking failed:', trackingResponse.status)
    }
    
    // Test 2: Get trending topics
    console.log('\n2️⃣ Testing trending topics retrieval...')
    const trendingResponse = await fetch('/api/search-analytics/trending?limit=5')
    
    if (trendingResponse.ok) {
      const trendingResult = await trendingResponse.json()
      console.log('✅ Trending topics retrieved:', trendingResult)
    } else {
      console.log('❌ Trending topics retrieval failed:', trendingResponse.status)
    }
    
    // Test 3: Get analytics stats
    console.log('\n3️⃣ Testing analytics stats...')
    const statsResponse = await fetch('/api/search-analytics/stats')
    
    if (statsResponse.ok) {
      const statsResult = await statsResponse.json()
      console.log('✅ Analytics stats retrieved:', statsResult)
    } else {
      console.log('❌ Analytics stats retrieval failed:', statsResponse.status)
    }
    
    // Test 4: Calculate trending scores
    console.log('\n4️⃣ Testing trending calculation...')
    const calculateResponse = await fetch('/api/search-analytics/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (calculateResponse.ok) {
      const calculateResult = await calculateResponse.json()
      console.log('✅ Trending calculation successful:', calculateResult)
    } else {
      console.log('❌ Trending calculation failed:', calculateResponse.status)
    }
    
    console.log('\n🎉 All tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Test multiple search queries to generate trending data
async function generateTestData() {
  console.log('📊 Generating test search data...')
  
  const testQueries = [
    { query: 'pattaya beach', category: 'Tourism' },
    { query: 'pattaya nightlife', category: 'Nightlife' },
    { query: 'pattaya hotels', category: 'Business' },
    { query: 'pattaya events', category: 'Events' },
    { query: 'pattaya food', category: 'Food' },
    { query: 'pattaya shopping', category: 'Shopping' },
    { query: 'pattaya weather', category: 'General' },
    { query: 'pattaya attractions', category: 'Tourism' },
    { query: 'pattaya bars', category: 'Nightlife' },
    { query: 'pattaya restaurants', category: 'Food' }
  ]
  
  for (let i = 0; i < testQueries.length; i++) {
    const { query, category } = testQueries[i]
    
    // Simulate multiple searches for some queries to make them trending
    const searchCount = Math.floor(Math.random() * 10) + 1
    
    for (let j = 0; j < searchCount; j++) {
      try {
        await fetch('/api/search-analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query,
            category,
            source: 'test-data-generation',
            userAgent: navigator.userAgent,
            sessionId: `test_${Date.now()}_${i}_${j}`
          })
        })
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.warn(`Failed to track query "${query}":`, error)
      }
    }
    
    console.log(`✅ Generated ${searchCount} searches for "${query}"`)
  }
  
  console.log('🎯 Test data generation completed!')
  console.log('💡 Now run testTrendingSystem() to test the full integration')
}

// Export functions for use in browser console
window.testTrendingSystem = testTrendingSystem
window.generateTestData = generateTestData

console.log('🚀 Trending System Test Script Loaded!')
console.log('📝 Available commands:')
console.log('  - testTrendingSystem() - Run all integration tests')
console.log('  - generateTestData() - Generate test search data')
console.log('')
console.log('💡 Start with: generateTestData()')
