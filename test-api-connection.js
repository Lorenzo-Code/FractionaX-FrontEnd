// Test script to verify API connection and check for CORS issues
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

async function testApiConnection() {
  console.log('🔄 Testing API connection...');
  
  try {
    // Test the trending assets endpoint
    const response = await axios.get(`${API_BASE_URL}/api/assets/trending`, {
      params: { category: 'mixed', limit: 4 },
      timeout: 10000,
    });
    
    console.log('✅ API connection successful!');
    console.log('📊 Response status:', response.status);
    console.log('📋 Data received:', response.data);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      console.log(`✅ Found ${response.data.data.length} assets`);
      response.data.data.forEach((asset, index) => {
        console.log(`  ${index + 1}. ${asset.title} - $${asset.price.toLocaleString()}`);
      });
    } else {
      console.log('⚠️ Unexpected data format:', response.data);
    }
    
  } catch (error) {
    console.log('❌ API connection failed');
    console.log('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      } : 'No response data'
    });
    
    // Check if it's a CORS error
    if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
      console.log('🚫 This appears to be a CORS issue. The backend needs to allow requests from http://localhost:5174');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔌 Connection refused. Make sure the backend server is running on port 3000.');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🌐 Host not found. Check if localhost is accessible.');
    }
  }
}

// Test other endpoints
async function testOtherEndpoints() {
  const endpoints = [
    '/api/health',
    '/api/assets',
    '/api/assets/trending?category=real-estate'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔄 Testing ${endpoint}...`);
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { timeout: 5000 });
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Run tests
console.log('🚀 Starting API connection tests...\n');
testApiConnection().then(() => {
  console.log('\n📡 Testing additional endpoints...');
  return testOtherEndpoints();
}).catch(console.error);
