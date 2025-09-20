/**
 * Debug script for search tracking
 * Run this in your browser console to test real search tracking
 */

// Debug search tracking
async function debugSearchTracking() {
  console.log('🔍 Starting search tracking debug...');
  
  // Test 1: Check if search tracker is available
  console.log('1️⃣ Testing search tracker availability...');
  try {
    const searchTracker = await import('./lib/search-tracking');
    console.log('✅ Search tracker loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load search tracker:', error);
    return;
  }
  
  // Test 2: Test a single search tracking
  console.log('2️⃣ Testing single search tracking...');
  try {
    const response = await fetch('/api/search-analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: 'debug test search',
        category: 'General',
        source: 'debug-script',
        userAgent: navigator.userAgent,
        sessionId: 'debug_' + Date.now()
      })
    });
    
    console.log('📡 Search tracking response status:', response.status);
    const result = await response.json();
    console.log('📊 Search tracking result:', result);
    
    if (result.success) {
      console.log('✅ Search tracking is working!');
    } else {
      console.error('❌ Search tracking failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Search tracking error:', error);
  }
  
  // Test 3: Check analytics stats
  console.log('3️⃣ Checking analytics stats...');
  try {
    const response = await fetch('/api/search-analytics/stats');
    const result = await response.json();
    console.log('📊 Analytics stats:', result);
  } catch (error) {
    console.error('❌ Analytics stats error:', error);
  }
  
  // Test 4: Check trending topics
  console.log('4️⃣ Checking trending topics...');
  try {
    const response = await fetch('/api/search-analytics/trending?limit=10');
    const result = await response.json();
    console.log('🔥 Trending topics:', result);
  } catch (error) {
    console.error('❌ Trending topics error:', error);
  }
  
  // Test 5: Trigger trending calculation
  console.log('5️⃣ Triggering trending calculation...');
  try {
    const response = await fetch('/api/search-analytics/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const result = await response.json();
    console.log('🎯 Trending calculation result:', result);
  } catch (error) {
    console.error('❌ Trending calculation error:', error);
  }
  
  console.log('🏁 Debug complete! Check the results above.');
}

// Test real search tracking
async function testRealSearch(query = 'pattaya beach') {
  console.log(`🔍 Testing real search tracking for: "${query}"`);
  
  try {
    // Import search tracker
    const searchTracker = await import('./lib/search-tracking');
    const tracker = searchTracker.default;
    
    // Track the search
    const result = await tracker.trackSearchQuery(query, {
      category: 'Tourism',
      source: 'debug-test',
      component: 'manual-test'
    });
    
    console.log('📊 Search tracking result:', result);
    
    if (result.success) {
      console.log('✅ Search tracked successfully!');
      
      // Wait a moment then check trending
      setTimeout(async () => {
        console.log('🔄 Checking trending topics after search...');
        const trending = await tracker.getTrendingTopics({ limit: 10 });
        console.log('🔥 Trending topics:', trending);
      }, 2000);
    } else {
      console.error('❌ Search tracking failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing real search:', error);
  }
}

// Check current trending widget state
function checkTrendingWidget() {
  console.log('🔍 Checking trending widget state...');
  
  // Look for trending widget in DOM
  const trendingWidget = document.querySelector('[data-testid="trending-widget"]') || 
                        document.querySelector('.trending-widget') ||
                        document.querySelector('h4:contains("Trending Now")')?.closest('.card');
  
  if (trendingWidget) {
    console.log('✅ Found trending widget in DOM');
    console.log('📊 Widget element:', trendingWidget);
  } else {
    console.log('⚠️ Trending widget not found in DOM');
  }
  
  // Check for any trending-related elements
  const trendingElements = document.querySelectorAll('*');
  const trendingRelated = Array.from(trendingElements).filter(el => 
    el.textContent?.toLowerCase().includes('trending') ||
    el.className?.toLowerCase().includes('trending')
  );
  
  console.log('🔍 Found trending-related elements:', trendingRelated.length);
  trendingRelated.forEach((el, index) => {
    console.log(`${index + 1}.`, el.tagName, el.className, el.textContent?.substring(0, 50));
  });
}

// Export functions for console use
if (typeof window !== 'undefined') {
  window.debugSearchTracking = debugSearchTracking;
  window.testRealSearch = testRealSearch;
  window.checkTrendingWidget = checkTrendingWidget;
  
  console.log('🎯 Debug functions loaded!');
  console.log('📝 Available functions:');
  console.log('  - debugSearchTracking() - Full debug of search tracking system');
  console.log('  - testRealSearch("your query") - Test tracking a specific search');
  console.log('  - checkTrendingWidget() - Check trending widget state');
  console.log('\n🚀 Run debugSearchTracking() to start debugging!');
}
