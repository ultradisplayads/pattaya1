// Using built-in fetch instead of axios for Node.js compatibility

// Test script to verify frontend can connect to Strapi backend
async function testNewsConnection() {
  const API_BASE = 'http://localhost:1337/api';
  
  console.log('🔗 Testing Breaking News API Connection...\n');

  // Test basic connectivity
  console.log('1️⃣ Testing basic API connectivity...');
  try {
    const response = await fetch(`${API_BASE}/breaking-news`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('✅ API accessible');
    console.log(`   Status: ${response.status}`);
    console.log(`   Articles found: ${data?.data?.length || 0}`);
  } catch (error) {
    console.log(`❌ API connection failed: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log('   Make sure Strapi backend is running on http://localhost:1337');
    }
    return;
  }

  // Test live news endpoint
  console.log('\n2️⃣ Testing live news endpoint...');
  try {
    const response = await fetch(`${API_BASE}/breaking-news/live`);
    const data = await response.json();
    console.log('✅ Live news endpoint working');
    console.log(`   Live articles: ${data?.data?.length || 0}`);
  } catch (error) {
    console.log(`❌ Live news failed: ${error.message}`);
  }

  // Test dashboard endpoint
  console.log('\n3️⃣ Testing dashboard endpoint...');
  try {
    const response = await fetch(`${API_BASE}/breaking-news/dashboard`);
    const data = await response.json();
    console.log('✅ Dashboard endpoint working');
    console.log(`   Dashboard data:`, data);
  } catch (error) {
    console.log(`❌ Dashboard failed: ${error.message}`);
  }

  // Test manual fetch
  console.log('\n4️⃣ Testing manual news fetch...');
  try {
    const response = await fetch(`${API_BASE}/breaking-news/fetch-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('✅ Manual fetch working');
    console.log(`   Fetch result:`, data);
  } catch (error) {
    console.log(`❌ Manual fetch failed: ${error.message}`);
  }

  console.log('\n🎯 Connection test completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Add NEXT_PUBLIC_API_URL=http://localhost:1337/api to your .env.local file');
  console.log('2. Start your Next.js dev server: npm run dev');
  console.log('3. Visit http://localhost:3000/breaking-news to see the news feed');
  console.log('4. Visit http://localhost:3000/admin/news for admin dashboard');
}

testNewsConnection().catch(console.error);
