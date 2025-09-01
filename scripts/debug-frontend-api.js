// Debug script to test frontend API calls from browser context
async function debugFrontendAPI() {
  console.log('🔍 Debugging Frontend API Calls...\n');
  
  // Test environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  console.log(`API URL: ${apiUrl}`);
  
  // Test direct fetch to articles
  console.log('\n1️⃣ Testing articles endpoint...');
  try {
    const response = await fetch(`${apiUrl}/articles?populate=*&sort=publishedAt:desc`);
    const data = await response.json();
    console.log('✅ Articles response:', data);
    console.log(`Found ${data.data?.length || 0} articles`);
    
    if (data.data?.length > 0) {
      console.log('Sample article:', data.data[0]);
    }
  } catch (error) {
    console.error('❌ Articles fetch failed:', error);
  }
  
  // Test breaking news
  console.log('\n2️⃣ Testing breaking news endpoint...');
  try {
    const response = await fetch(`${apiUrl}/breaking-news/live`);
    const data = await response.json();
    console.log('Breaking news response:', data);
  } catch (error) {
    console.error('❌ Breaking news fetch failed:', error);
  }
}

// Run in browser console
if (typeof window !== 'undefined') {
  debugFrontendAPI();
} else {
  console.log('This script should be run in the browser console');
}
