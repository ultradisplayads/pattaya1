#!/usr/bin/env node

const contentTypes = [
  'breaking-news', 'news-article', 'sponsored-post', 'social-media-post',
  'business', 'business-spotlight', 'deal', 'advertisement', 'review', 'google-review',
  'event', 'event-calendar', 'live-event', 'radio-station', 'youtube-video',
  'booking', 'traffic-incident', 'traffic-route', 'weather', 'weather-activity-suggestion',
  'author', 'category', 'photo-gallery', 'trending-topic',
  'about', 'global', 'global-sponsorship', 'quick-link', 'widget-control',
  'forum-activity'
];

const baseUrl = 'http://localhost:3001';

async function testContentType(contentType) {
  try {
    const response = await fetch(`${baseUrl}/api/search/unified?query=test&contentType=${contentType}&hitsPerPage=5`);
    const data = await response.json();
    
    return {
      contentType,
      status: response.ok ? 'OK' : 'ERROR',
      resultCount: data.data ? data.data.length : 0,
      totalResults: data.meta?.pagination?.total || 0,
      error: data.error || null
    };
  } catch (error) {
    return {
      contentType,
      status: 'FAILED',
      resultCount: 0,
      totalResults: 0,
      error: error.message
    };
  }
}

async function testAllContentTypes() {
  console.log('🔍 Testing Search Functionality for All Content Types\n');
  console.log('=' .repeat(70));
  
  const results = [];
  
  for (const contentType of contentTypes) {
    process.stdout.write(`Testing ${contentType}...`);
    const result = await testContentType(contentType);
    results.push(result);
    
    const statusIcon = result.status === 'OK' ? '✅' : result.status === 'ERROR' ? '❌' : '⚠️';
    console.log(` ${statusIcon} ${result.totalResults} results`);
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log('📊 SUMMARY REPORT\n');
  
  const working = results.filter(r => r.status === 'OK' && r.totalResults > 0);
  const empty = results.filter(r => r.status === 'OK' && r.totalResults === 0);
  const failed = results.filter(r => r.status !== 'OK');
  
  console.log(`✅ Working with data: ${working.length}`);
  working.forEach(r => console.log(`   - ${r.contentType}: ${r.totalResults} items`));
  
  console.log(`\n📭 Empty collections: ${empty.length}`);
  empty.forEach(r => console.log(`   - ${r.contentType}`));
  
  console.log(`\n❌ Failed/Error: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.contentType}: ${r.error}`));
  
  console.log(`\n🎯 Total content types tested: ${contentTypes.length}`);
  console.log(`📈 Success rate: ${Math.round((working.length + empty.length) / contentTypes.length * 100)}%`);
}

// Test facets endpoint
async function testFacets() {
  console.log('\n🎛️ Testing Facets Endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/search/facets`);
    const data = await response.json();
    
    console.log(`✅ Facets endpoint working`);
    console.log(`   - Categories: ${data.data?.categories?.length || 0}`);
    console.log(`   - Sources: ${data.data?.sources?.length || 0}`);
    console.log(`   - Content Types: ${data.data?.contentTypes?.length || 0}`);
    console.log(`   - Severities: ${data.data?.severities?.length || 0}`);
  } catch (error) {
    console.log(`❌ Facets endpoint failed: ${error.message}`);
  }
}

// Test unified search
async function testUnifiedSearch() {
  console.log('\n🔍 Testing Unified Search...');
  try {
    const response = await fetch(`${baseUrl}/api/search/unified?query=pattaya&hitsPerPage=5`);
    const data = await response.json();
    
    console.log(`✅ Unified search working`);
    console.log(`   - Results: ${data.data?.length || 0}`);
    console.log(`   - Total: ${data.meta?.pagination?.total || 0}`);
    
    if (data.data && data.data.length > 0) {
      console.log(`   - Content types found: ${[...new Set(data.data.map(item => item.contentType))].join(', ')}`);
    }
  } catch (error) {
    console.log(`❌ Unified search failed: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  await testAllContentTypes();
  await testFacets();
  await testUnifiedSearch();
  
  console.log('\n🏁 Testing Complete!');
}

runAllTests().catch(console.error);
