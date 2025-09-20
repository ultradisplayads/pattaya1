/**
 * Debug Trending Flow - Run this in browser console
 * This will test the complete flow from search to trending
 */

console.log('🔍 Starting Trending Flow Debug...');

// Step 1: Test if search tracking works
async function testSearchTracking() {
    console.log('📝 Step 1: Testing search tracking...');
    
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://api.pattaya1.com';
    
    try {
        const response = await fetch(`${API_BASE}/api/search-analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: 'Pattaya Beach Test',
                category: 'General',
                source: 'debug-test',
                userAgent: navigator.userAgent,
                sessionId: `debug_${Date.now()}`
            })
        });

        console.log('📡 Search tracking response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Search tracking successful:', result);
            return true;
        } else {
            const errorText = await response.text();
            console.error('❌ Search tracking failed:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.error('❌ Search tracking error:', error);
        return false;
    }
}

// Step 2: Test trending calculation
async function testTrendingCalculation() {
    console.log('🎯 Step 2: Testing trending calculation...');
    
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://api.pattaya1.com';
    
    try {
        const response = await fetch(`${API_BASE}/api/search-analytics/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('📡 Trending calculation response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Trending calculation successful:', result);
            return true;
        } else {
            const errorText = await response.text();
            console.error('❌ Trending calculation failed:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.error('❌ Trending calculation error:', error);
        return false;
    }
}

// Step 3: Test trending fetch
async function testTrendingFetch() {
    console.log('📊 Step 3: Testing trending fetch...');
    
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://api.pattaya1.com';
    
    try {
        const response = await fetch(`${API_BASE}/api/search-analytics/trending?limit=10&timeWindow=24h`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📡 Trending fetch response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('📊 Trending fetch result:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                console.log('✅ Found trending topics:', result.data);
                return result.data;
            } else {
                console.log('📊 No trending topics found yet');
                return [];
            }
        } else {
            const errorText = await response.text();
            console.error('❌ Trending fetch failed:', response.status, errorText);
            return null;
        }
    } catch (error) {
        console.error('❌ Trending fetch error:', error);
        return null;
    }
}

// Step 4: Test analytics stats
async function testAnalyticsStats() {
    console.log('📈 Step 4: Testing analytics stats...');
    
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://api.pattaya1.com';
    
    try {
        const response = await fetch(`${API_BASE}/api/search-analytics/stats`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📡 Analytics stats response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('📈 Analytics stats:', result);
            return result;
        } else {
            const errorText = await response.text();
            console.error('❌ Analytics stats failed:', response.status, errorText);
            return null;
        }
    } catch (error) {
        console.error('❌ Analytics stats error:', error);
        return null;
    }
}

// Run complete test
async function runCompleteTest() {
    console.log('🚀 Running complete trending flow test...');
    
    // Test search tracking
    const trackingSuccess = await testSearchTracking();
    if (!trackingSuccess) {
        console.error('❌ Search tracking failed - check backend connection');
        return;
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test trending calculation
    const calculationSuccess = await testTrendingCalculation();
    if (!calculationSuccess) {
        console.error('❌ Trending calculation failed - check backend service');
        return;
    }
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test trending fetch
    const trendingData = await testTrendingFetch();
    if (trendingData === null) {
        console.error('❌ Trending fetch failed - check API endpoint');
        return;
    }
    
    // Test analytics stats
    const stats = await testAnalyticsStats();
    
    console.log('🎉 Complete test finished!');
    console.log('📊 Results:', { trendingData, stats });
    
    return { trendingData, stats };
}

// Quick test with multiple searches
async function quickMultiSearchTest() {
    console.log('⚡ Running quick multi-search test...');
    
    const searches = [
        'Pattaya Beach',
        'Thai Street Food', 
        'Nightlife Pattaya',
        'Pattaya Beach', // Duplicate
        'Shopping Mall',
        'Thai Street Food', // Duplicate
        'Beach Resort',
        'Pattaya Beach' // Another duplicate
    ];
    
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://api.pattaya1.com';
    
    for (let i = 0; i < searches.length; i++) {
        const search = searches[i];
        console.log(`🔍 Tracking search ${i + 1}/${searches.length}: "${search}"`);
        
        try {
            await fetch(`${API_BASE}/api/search-analytics/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: search,
                    category: 'General',
                    source: 'multi-test',
                    userAgent: navigator.userAgent,
                    sessionId: `multi_test_${Date.now()}_${i}`
                })
            });
            
            console.log(`✅ Tracked: "${search}"`);
        } catch (error) {
            console.error(`❌ Failed to track: "${search}"`, error);
        }
        
        // Small delay between searches
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('🎯 Triggering trending calculation...');
    await testTrendingCalculation();
    
    console.log('⏳ Waiting for processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📊 Fetching trending results...');
    const trending = await testTrendingFetch();
    
    console.log('⚡ Multi-search test completed!', trending);
    return trending;
}

// Make functions available globally
window.debugTrendingFlow = {
    testSearchTracking,
    testTrendingCalculation,
    testTrendingFetch,
    testAnalyticsStats,
    runCompleteTest,
    quickMultiSearchTest
};

console.log('🔥 Trending Flow Debug Tools Loaded!');
console.log('Available commands:');
console.log('- debugTrendingFlow.runCompleteTest()');
console.log('- debugTrendingFlow.quickMultiSearchTest()');
console.log('- debugTrendingFlow.testSearchTracking()');
console.log('- debugTrendingFlow.testTrendingCalculation()');
console.log('- debugTrendingFlow.testTrendingFetch()');
console.log('- debugTrendingFlow.testAnalyticsStats()');
console.log('');
console.log('Running quick multi-search test...');

// Auto-run the test
quickMultiSearchTest();
