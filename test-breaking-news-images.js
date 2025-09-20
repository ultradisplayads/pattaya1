#!/usr/bin/env node

/**
 * Test script to verify breaking news image handling
 * This script tests the breaking news API and image URL construction
 */

const https = require('https');

async function testBreakingNewsImages() {
  console.log('📰 Testing Breaking News Image Handling...\n');
  
  try {
    // Test 1: Fetch breaking news data from API
    console.log('📡 Fetching breaking news data from API...');
    const apiResponse = await fetch('https://api.pattaya1.com/api/breaking-news/live');
    const apiData = await apiResponse.json();
    
    console.log(`✅ API Response: ${apiData.data.length} articles found`);
    
    // Test 2: Check articles with images
    const articlesWithImages = apiData.data.filter(article => article.image);
    console.log(`📸 Articles with images: ${articlesWithImages.length}/${apiData.data.length}`);
    
    if (articlesWithImages.length > 0) {
      console.log('\n🔍 Sample articles with images:');
      articlesWithImages.slice(0, 3).forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   Image URL: ${article.image}`);
        console.log(`   Image Alt: ${article.imageAlt || 'Not set'}`);
        console.log(`   Image Caption: ${article.imageCaption || 'Not set'}`);
      });
    }
    
    // Test 3: Verify image URLs are accessible
    console.log('\n🌐 Testing image URL accessibility...');
    for (const article of articlesWithImages.slice(0, 3)) {
      try {
        const imageResponse = await fetch(article.image, { method: 'HEAD' });
        if (imageResponse.ok) {
          console.log(`✅ Image accessible: ${article.image}`);
        } else {
          console.log(`❌ Image not accessible (${imageResponse.status}): ${article.image}`);
        }
      } catch (error) {
        console.log(`❌ Image fetch error: ${article.image} - ${error.message}`);
      }
    }
    
    // Test 4: Check frontend API route transformation
    console.log('\n🔄 Testing frontend API transformation...');
    console.log('Frontend API route should transform:');
    console.log('  API field: "image" → Frontend field: "image"');
    console.log('  API field: "imageAlt" → Frontend field: "imageAlt"');
    console.log('  API field: "imageCaption" → Frontend field: "imageCaption"');
    
    // Test 5: Verify component compatibility
    console.log('\n🧩 Testing component compatibility...');
    const sampleArticle = articlesWithImages[0];
    if (sampleArticle) {
      console.log('Sample article structure for components:');
      console.log(`  article.image: ${sampleArticle.image || 'undefined'}`);
      console.log(`  article.ImageURL: ${sampleArticle.ImageURL || 'undefined'}`);
      console.log(`  article.imageAlt: ${sampleArticle.imageAlt || 'undefined'}`);
      console.log(`  article.imageCaption: ${sampleArticle.imageCaption || 'undefined'}`);
      
      // Test the condition used in components
      const hasImage = sampleArticle.image || sampleArticle.ImageURL;
      console.log(`\n  Component condition (article.image || article.ImageURL): ${hasImage ? '✅ TRUE' : '❌ FALSE'}`);
    }
    
    console.log('\n🎯 Summary:');
    console.log(`- API returns ${apiData.data.length} articles`);
    console.log(`- ${articlesWithImages.length} articles have images`);
    console.log(`- Images are stored in the 'image' field`);
    console.log(`- Frontend components should display images correctly`);
    
    if (articlesWithImages.length === 0) {
      console.log('\n⚠️  WARNING: No articles with images found!');
      console.log('This could indicate:');
      console.log('1. RSS feeds are not providing images');
      console.log('2. Image extraction logic is not working');
      console.log('3. Backend cron job is not running');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Helper function to make fetch requests
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BreakingNewsTest/1.0)',
        ...options.headers
      }
    };
    
    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(jsonData)
          });
        } catch (e) {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(data)
          });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Run the test
testBreakingNewsImages();
