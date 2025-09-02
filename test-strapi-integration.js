require('dotenv').config();

const axios = require('axios');

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function testStrapiIntegration() {
  console.log('🧪 Testing Strapi Integration...\n');

  try {
    // Test 1: Check server status
    console.log('1. Testingb server status...');
    const statusResponse = await axios.get(`${STRAPI_URL}/api/test/status`);
    console.log('✅ Server status:', statusResponse.data.message);
    console.log('Firebase config:', statusResponse.data.firebase);
    console.log('');

    // Test 2: Register a new user
    console.log('2. Testing user registration...');
    const testUser = {
      username: 'frontend-test-user',
      email: 'frontend-test@example.com',
      firebaseUid: 'frontend-test-firebase-uid-' + Date.now()
    };

    try {
      const registerResponse = await axios.post(`${STRAPI_URL}/api/firebase-auth/register`, testUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ User registered successfully!');
      console.log('User ID:', registerResponse.data.user.id);
      console.log('Username:', registerResponse.data.user.username);
      console.log('Firebase UID:', registerResponse.data.user.firebaseUid);
      console.log('');

      // Test 3: Login with the same user
      console.log('3. Testing user login...');
      const loginResponse = await axios.post(`${STRAPI_URL}/api/firebase-auth/login`, {
        firebaseUid: testUser.firebaseUid
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ User login successful!');
      console.log('User data:', loginResponse.data.user);
      console.log('');

    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already exists')) {
        console.log('⚠️ User already exists, testing login instead...');
        
        const loginResponse = await axios.post(`${STRAPI_URL}/api/firebase-auth/login`, {
          firebaseUid: testUser.firebaseUid
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ User login successful!');
        console.log('User data:', loginResponse.data.user);
        console.log('');
      } else {
        throw error;
      }
    }

    console.log('🎉 All tests passed! Strapi integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testStrapiIntegration(); 