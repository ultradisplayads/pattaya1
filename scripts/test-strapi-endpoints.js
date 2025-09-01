// Test script to verify Strapi standard endpoints
async function testStrapiEndpoints() {
  const API_BASE = 'http://localhost:1337/api';
  
  console.log('🔗 Testing Strapi Standard API Endpoints...\n');

  const endpoints = [
    { name: 'Articles', url: '/articles?populate=*&sort=publishedAt:desc' },
    { name: 'Authors', url: '/authors' },
    { name: 'Categories', url: '/categories' },
    { name: 'Single Article', url: '/articles/1?populate=*' }
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.name}...`);
    try {
      const response = await fetch(`${API_BASE}${endpoint.url}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name} - Status: ${response.status}`);
        if (data.data) {
          console.log(`   Found: ${Array.isArray(data.data) ? data.data.length : 1} item(s)`);
        }
      } else {
        console.log(`❌ ${endpoint.name} - Status: ${response.status}`);
        console.log(`   Error: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} - Connection Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Endpoint test completed!');
  console.log('\n📋 If endpoints are missing:');
  console.log('1. Go to Strapi Admin: http://localhost:1337/admin');
  console.log('2. Create content types: Articles, Authors, Categories');
  console.log('3. Set proper permissions in Settings > Users & Permissions');
}

testStrapiEndpoints().catch(console.error);
