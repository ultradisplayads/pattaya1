const { buildApiUrl } = require('../lib/strapi-config.ts');

async function testSponsoredContent() {
  console.log('🔍 Testing Sponsored Content Integration...\n');
  
  // Test 1: Check Strapi connection
  console.log('1. Testing Strapi connection...');
  try {
    const response = await fetch('http://localhost:1337/api/articles?pagination[pageSize]=1');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Strapi connection successful');
      console.log(`📰 Found ${data.meta?.pagination?.total || 0} articles`);
    } else {
      console.log('❌ Strapi connection failed:', response.status);
      return;
    }
  } catch (error) {
    console.log('❌ Strapi connection error:', error.message);
    return;
  }
  
  // Test 2: Check sponsored-posts content type
  console.log('\n2. Testing sponsored-posts content type...');
  try {
    const response = await fetch('http://localhost:1337/api/sponsored-posts');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sponsored-posts content type exists');
      console.log(`📊 Found ${data.data?.length || 0} sponsored posts`);
      if (data.data?.length > 0) {
        console.log('📋 First sponsored post:', JSON.stringify(data.data[0], null, 2));
      }
    } else {
      console.log('❌ Sponsored-posts content type missing or inaccessible:', response.status);
      console.log('💡 You need to create the sponsored-posts content type in Strapi admin');
    }
  } catch (error) {
    console.log('❌ Sponsored-posts API error:', error.message);
  }
  
  // Test 3: Check mixed feed API
  console.log('\n3. Testing mixed feed API...');
  try {
    const response = await fetch('http://localhost:3000/api/news/mixed-feed?limit=3');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Mixed feed API working');
      console.log('📊 Feed data:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Mixed feed API failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Mixed feed API error:', error.message);
  }
  
  // Test 4: Check environment variables
  console.log('\n4. Checking environment variables...');
  console.log('NEXT_PUBLIC_STRAPI_URL:', process.env.NEXT_PUBLIC_STRAPI_URL || 'Not set (using default: http://localhost:1337)');
  console.log('STRAPI_API_TOKEN:', process.env.STRAPI_API_TOKEN ? 'Set' : 'Not set');
  
  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Ensure Strapi is running: npm run develop (in Strapi directory)');
  console.log('2. Create sponsored-posts content type using the schema in strapi-sponsored-posts-schema.json');
  console.log('3. Add some test sponsored posts in Strapi admin');
  console.log('4. Verify API permissions allow public read access');
  console.log('5. Check that showSponsored={true} is set on news components');
}

testSponsoredContent().catch(console.error);
