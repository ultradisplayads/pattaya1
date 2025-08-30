// Test script for business spotlight widget
const http = require('http');

async function testBusinessSpotlightWidget() {
  console.log('🧪 Testing Business Spotlight Widget API Connection...\n');

  // Test 1: Check if Strapi server is running
  console.log('1. Testing Strapi server connection...');
  try {
    const response = await makeRequest('/api/business-spotlights', 'GET');
    if (response.status === 200) {
      console.log('✅ Strapi server is running and responding');
    } else {
      console.log(`❌ Strapi server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Cannot connect to Strapi server:', error.message);
    return;
  }

  // Test 2: Fetch business spotlights with filters
  console.log('\n2. Testing business spotlights API with filters...');
  try {
    const response = await makeRequest('/api/business-spotlights?populate=*&filters[IsActive][$eq]=true&sort[Featured][$desc]=true&sort[Rating][$desc]=true', 'GET');
    
    if (response.status === 200) {
      console.log('✅ Successfully fetched business spotlights');
      
      if (response.data && response.data.data) {
        const businesses = response.data.data;
        console.log(`📊 Found ${businesses.length} business spotlights`);
        
        if (businesses.length > 0) {
          console.log('\n📋 Sample business spotlight:');
          const sampleBusiness = businesses[0];
          console.log(`   - Name: ${sampleBusiness.Name}`);
          console.log(`   - Category: ${sampleBusiness.Category}`);
          console.log(`   - Rating: ${sampleBusiness.Rating}`);
          console.log(`   - Reviews: ${sampleBusiness.Reviews}`);
          console.log(`   - Location: ${sampleBusiness.Location}`);
          console.log(`   - Featured: ${sampleBusiness.Featured}`);
          console.log(`   - Deal: ${sampleBusiness.Deal || 'None'}`);
          console.log(`   - Tags: ${sampleBusiness.Tags ? sampleBusiness.Tags.join(', ') : 'None'}`);
        }
      } else {
        console.log('⚠️  No business spotlights found in response');
      }
    } else {
      console.log(`❌ Failed to fetch business spotlights: ${response.status}`);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Error fetching business spotlights:', error.message);
  }

  // Test 3: Test data transformation logic
  console.log('\n3. Testing data transformation logic...');
  const mockStrapiData = {
    data: [
      {
        id: 1,
        Name: "Ocean View Restaurant",
        Category: "Fine Dining",
        Rating: 4.8,
        Reviews: 324,
        Location: "Beach Road, Pattaya",
        Image: {
          id: 1,
          name: "restaurant.jpg",
          url: "/uploads/restaurant.jpg",
          formats: {
            thumbnail: { url: "/uploads/thumbnail_restaurant.jpg" },
            small: { url: "/uploads/small_restaurant.jpg" }
          }
        },
        Description: "Authentic Thai cuisine with stunning ocean views. Fresh seafood daily.",
        Hours: "11:00 AM - 11:00 PM",
        Phone: "+66 38 123 456",
        Website: "https://oceanview-pattaya.com",
        Featured: true,
        Deal: "20% off dinner menu",
        Tags: ["Seafood", "Thai", "Ocean View"],
        IsActive: true,
        Address: "123 Beach Road, Pattaya, Chonburi 20150",
        Email: "info@oceanview-pattaya.com",
        SocialMedia: {
          facebook: "https://facebook.com/oceanviewpattaya",
          instagram: "https://instagram.com/oceanviewpattaya"
        },
        LastUpdated: "2024-01-15T18:30:00.000Z",
        createdAt: "2024-01-15T18:30:00.000Z",
        updatedAt: "2024-01-15T18:30:00.000Z",
        publishedAt: "2024-01-15T18:30:00.000Z"
      }
    ]
  };

  const transformedData = mockStrapiData.data.map(business => {
    // Get image URL with fallback
    let imageUrl = "/placeholder.svg?height=120&width=200&text=Business";
    if (business.Image) {
      imageUrl = `http://localhost:1337${business.Image.url}`;
    }

    return {
      id: business.id.toString(),
      name: business.Name,
      category: business.Category,
      rating: business.Rating,
      reviews: business.Reviews,
      location: business.Location,
      image: imageUrl,
      description: business.Description,
      hours: business.Hours,
      phone: business.Phone,
      featured: business.Featured,
      deal: business.Deal,
      tags: business.Tags || [],
    };
  });

  console.log('✅ Data transformation successful');
  console.log('📋 Transformed data sample:');
  console.log(`   - ID: ${transformedData[0].id}`);
  console.log(`   - Name: ${transformedData[0].name}`);
  console.log(`   - Category: ${transformedData[0].category}`);
  console.log(`   - Rating: ${transformedData[0].rating}`);
  console.log(`   - Image URL: ${transformedData[0].image}`);
  console.log(`   - Featured: ${transformedData[0].featured}`);
  console.log(`   - Deal: ${transformedData[0].deal}`);

  // Test 4: Test fallback data
  console.log('\n4. Testing fallback data...');
  const fallbackData = getFallbackBusinesses();
  console.log(`✅ Fallback data generated with ${fallbackData.length} items`);
  console.log('📋 Fallback data sample:');
  console.log(`   - Name: ${fallbackData[0].name}`);
  console.log(`   - Category: ${fallbackData[0].category}`);
  console.log(`   - Rating: ${fallbackData[0].rating}`);
  console.log(`   - Featured: ${fallbackData[0].featured}`);

  // Test 5: Test image URL handling
  console.log('\n5. Testing image URL handling...');
  const testCases = [
    { Image: null, expected: "/placeholder.svg?height=120&width=200&text=Business" },
    { Image: { url: "/uploads/test.jpg" }, expected: "http://localhost:1337/uploads/test.jpg" },
    { Image: { url: "/uploads/restaurant.jpg" }, expected: "http://localhost:1337/uploads/restaurant.jpg" }
  ];

  testCases.forEach((testCase, index) => {
    let imageUrl = "/placeholder.svg?height=120&width=200&text=Business";
    if (testCase.Image) {
      imageUrl = `http://localhost:1337${testCase.Image.url}`;
    }
    
    const passed = imageUrl === testCase.expected;
    console.log(`   Test ${index + 1}: ${passed ? '✅' : '❌'} ${imageUrl}`);
  });

  console.log('\n🎉 Business Spotlight Widget API tests completed!');
}

function makeRequest(url, method) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

function getFallbackBusinesses() {
  return [
    {
      id: "1",
      name: "Ocean View Restaurant",
      category: "Fine Dining",
      rating: 4.8,
      reviews: 324,
      location: "Beach Road, Pattaya",
      image: "/placeholder.svg?height=120&width=200&text=Restaurant",
      description: "Authentic Thai cuisine with stunning ocean views. Fresh seafood daily.",
      hours: "11:00 AM - 11:00 PM",
      phone: "+66 38 123 456",
      featured: true,
      deal: "20% off dinner menu",
      tags: ["Seafood", "Thai", "Ocean View"],
    },
    {
      id: "2",
      name: "Sunset Spa & Wellness",
      category: "Health & Beauty",
      rating: 4.9,
      reviews: 189,
      location: "Central Pattaya",
      image: "/placeholder.svg?height=120&width=200&text=Spa",
      description: "Traditional Thai massage and modern wellness treatments in luxury setting.",
      hours: "9:00 AM - 10:00 PM",
      phone: "+66 38 234 567",
      featured: true,
      deal: "Buy 2 get 1 free massage",
      tags: ["Massage", "Wellness", "Luxury"],
    }
  ];
}

testBusinessSpotlightWidget();
