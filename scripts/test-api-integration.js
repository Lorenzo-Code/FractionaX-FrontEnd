/**
 * Simple test script to verify our marketplace API integration
 */

// Test the suggested listings endpoint
async function testSuggestedListings() {
  try {
    console.log('🧪 Testing /api/suggested endpoint...');
    
    const response = await fetch('http://localhost:3000/api/suggested', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Suggested listings response:', data);
    console.log(`   Found ${data.deals?.length || 0} suggested deals`);
    
  } catch (error) {
    console.error('❌ Error testing suggested listings:', error.message);
  }
}

// Test the Zillow listings endpoint
async function testZillowListings() {
  try {
    console.log('🧪 Testing /api/marketplace/listings endpoint...');
    
    const response = await fetch('http://localhost:3000/api/marketplace/listings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Zillow listings response:', data);
    console.log(`   Found ${data.listings?.length || 0} Zillow listings`);
    
  } catch (error) {
    console.error('❌ Error testing Zillow listings:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API integration tests...\n');
  
  await testSuggestedListings();
  console.log(''); // Empty line for spacing
  await testZillowListings();
  
  console.log('\n✨ Test completed!');
}

// Check if running in Node.js environment
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  console.log('This script is designed to run in Node.js. Open the browser console and run the tests manually.');
}
