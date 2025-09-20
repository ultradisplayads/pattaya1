/**
 * Test script to generate sample search data for trending system
 * Run this in your browser console or as a Node.js script
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.pattaya1.com';

// Sample search queries with different categories and frequencies
const sampleSearches = [
  // High frequency searches (should be trending)
  { query: 'pattaya beach', category: 'Tourism', count: 25 },
  { query: 'thai street food', category: 'Food', count: 20 },
  { query: 'bangkok nightlife', category: 'Nightlife', count: 18 },
  { query: 'pattaya hotels', category: 'Tourism', count: 15 },
  { query: 'thai massage', category: 'Tourism', count: 12 },
  
  // Medium frequency searches
  { query: 'pattaya shopping', category: 'Shopping', count: 8 },
  { query: 'thai festivals', category: 'Events', count: 7 },
  { query: 'bangkok temples', category: 'Tourism', count: 6 },
  { query: 'pattaya restaurants', category: 'Food', count: 5 },
  { query: 'thai language', category: 'General', count: 4 },
  
  // Lower frequency searches
  { query: 'pattaya weather', category: 'General', count: 3 },
  { query: 'thai visa', category: 'General', count: 2 },
  { query: 'bangkok transport', category: 'General', count: 2 },
  { query: 'pattaya events', category: 'Events', count: 1 },
  { query: 'thai culture', category: 'General', count: 1 }
];

/**
 * Track a single search query
 */
async function trackSearch(query, category = 'General', source = 'test-script') {
  try {
    const response = await fetch(`${API_BASE}/api/search-analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        category,
        source,
        userAgent: 'Test-Script/1.0',
        sessionId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Tracked: "${query}" (${category}) - ${result.success ? 'Success' : 'Failed'}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to track "${query}":`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Generate sample search data
 */
async function generateSampleData() {
  console.log('🚀 Starting to generate sample search data...');
  console.log('📊 This will create realistic trending data for testing');
  
  let successCount = 0;
  let failCount = 0;

  for (const search of sampleSearches) {
    // Track the search multiple times based on the count
    for (let i = 0; i < search.count; i++) {
      const result = await trackSearch(search.query, search.category, 'test-script');
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay to simulate real user behavior
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`\n📈 Sample data generation complete!`);
  console.log(`✅ Successful tracks: ${successCount}`);
  console.log(`❌ Failed tracks: ${failCount}`);
  console.log(`\n🔄 Now triggering trending calculation...`);
  
  // Trigger trending calculation
  await calculateTrending();
}

/**
 * Trigger trending calculation
 */
async function calculateTrending() {
  try {
    const response = await fetch(`${API_BASE}/api/search-analytics/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('🎯 Trending calculation result:', result);
    
    if (result.success) {
      console.log(`✅ Trending calculation completed!`);
      console.log(`📊 Processed ${result.data.totalProcessed} topics`);
      console.log(`🔥 ${result.data.trendingCount} topics are now trending`);
    }
  } catch (error) {
    console.error('❌ Failed to calculate trending:', error.message);
  }
}

/**
 * Get current trending topics
 */
async function getTrendingTopics() {
  try {
    const response = await fetch(`${API_BASE}/api/search-analytics/trending?limit=10`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('🔥 Current trending topics:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to get trending topics:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get analytics stats
 */
async function getAnalyticsStats() {
  try {
    const response = await fetch(`${API_BASE}/api/search-analytics/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📊 Analytics stats:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to get analytics stats:', error.message);
    return { success: false, error: error.message };
  }
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.generateSampleData = generateSampleData;
  window.calculateTrending = calculateTrending;
  window.getTrendingTopics = getTrendingTopics;
  window.getAnalyticsStats = getAnalyticsStats;
  window.trackSearch = trackSearch;
  
  console.log('🎯 Trending test functions loaded!');
  console.log('📝 Available functions:');
  console.log('  - generateSampleData() - Generate sample search data');
  console.log('  - calculateTrending() - Trigger trending calculation');
  console.log('  - getTrendingTopics() - Get current trending topics');
  console.log('  - getAnalyticsStats() - Get analytics statistics');
  console.log('  - trackSearch(query, category) - Track a single search');
  console.log('\n🚀 Run generateSampleData() to start!');
}

// If running as Node.js script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateSampleData,
    calculateTrending,
    getTrendingTopics,
    getAnalyticsStats,
    trackSearch,
    sampleSearches
  };
}
