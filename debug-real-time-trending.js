/**
 * Real-Time Trending Debug Script
 * Run this in your browser console to test the trending system
 */

// Configuration
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://api.pattaya1.com';

// Debug functions
window.debugTrending = {
    
    // Test search tracking
    async trackSearch(query, category = 'General', source = 'debug-console') {
        console.log(`🔍 Tracking search: "${query}"`);
        
        try {
            const response = await fetch(`${API_BASE}/api/search-analytics/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    category: category,
                    source: source,
                    userAgent: navigator.userAgent,
                    sessionId: `debug_${Date.now()}`
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Search tracked successfully:', result);
                return result;
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to track search:', response.status, errorText);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('❌ Error tracking search:', error);
            return { success: false, error: error.message };
        }
    },

    // Trigger trending calculation
    async calculateTrending() {
        console.log('🎯 Triggering trending calculation...');
        
        try {
            const response = await fetch(`${API_BASE}/api/search-analytics/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Trending calculation completed:', result);
                return result;
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to calculate trending:', response.status, errorText);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('❌ Error calculating trending:', error);
            return { success: false, error: error.message };
        }
    },

    // Get trending topics
    async getTrending(limit = 10, timeWindow = '24h') {
        console.log('📊 Fetching trending topics...');
        
        try {
            const response = await fetch(`${API_BASE}/api/search-analytics/trending?limit=${limit}&timeWindow=${timeWindow}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    console.log(`✅ Found ${result.data.length} trending topics:`, result.data);
                    return result.data;
                } else {
                    console.log('📊 No trending topics found yet');
                    return [];
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to fetch trending:', response.status, errorText);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('❌ Error fetching trending:', error);
            return { success: false, error: error.message };
        }
    },

    // Get analytics stats
    async getStats() {
        console.log('📈 Fetching analytics stats...');
        
        try {
            const response = await fetch(`${API_BASE}/api/search-analytics/stats`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('📈 Analytics stats:', result);
                return result;
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to fetch stats:', response.status, errorText);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            return { success: false, error: error.message };
        }
    },

    // Full test workflow
    async runFullTest() {
        console.log('🚀 Running full trending test...');
        
        // Step 1: Track some test searches
        const testSearches = [
            'Pattaya Beach',
            'Thai Street Food',
            'Nightlife Pattaya',
            'Shopping Mall',
            'Pattaya Beach', // Duplicate to test trending
            'Thai Street Food', // Duplicate to test trending
            'Beach Resort',
            'Thai Massage',
            'Pattaya Beach', // Another duplicate
            'Nightlife Pattaya' // Another duplicate
        ];

        console.log('📝 Step 1: Tracking test searches...');
        for (const search of testSearches) {
            await this.trackSearch(search, 'General', 'test-workflow');
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        }

        // Step 2: Trigger trending calculation
        console.log('🎯 Step 2: Triggering trending calculation...');
        await this.calculateTrending();

        // Step 3: Wait a moment for processing
        console.log('⏳ Step 3: Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 4: Get trending topics
        console.log('📊 Step 4: Fetching trending topics...');
        const trending = await this.getTrending();

        // Step 5: Get stats
        console.log('📈 Step 5: Fetching analytics stats...');
        const stats = await this.getStats();

        console.log('🎉 Full test completed!');
        return { trending, stats };
    },

    // Quick test with popular searches
    async quickTest() {
        console.log('⚡ Running quick trending test...');
        
        const searches = ['Pattaya Beach', 'Thai Food', 'Nightlife', 'Shopping', 'Beach Resort'];
        
        for (const search of searches) {
            await this.trackSearch(search);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        await this.calculateTrending();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const trending = await this.getTrending();
        console.log('⚡ Quick test completed!', trending);
        return trending;
    }
};

// Auto-run quick test on load
console.log('🔥 Real-Time Trending Debug Tools Loaded!');
console.log('Available commands:');
console.log('- debugTrending.trackSearch("your search query")');
console.log('- debugTrending.calculateTrending()');
console.log('- debugTrending.getTrending()');
console.log('- debugTrending.getStats()');
console.log('- debugTrending.runFullTest()');
console.log('- debugTrending.quickTest()');
console.log('');
console.log('Running quick test...');

// Run quick test automatically
debugTrending.quickTest().then(() => {
    console.log('✅ Quick test completed! Check your trending widget now.');
});
