// Simple cache test to debug the issue
import cacheService from './src/shared/services/cacheService.js';

console.log('🧪 Testing cache service...');

// Test the new signature
async function testNewSignature() {
  console.log('\n=== Testing New Signature ===');
  
  const testKey = 'admin_network_analytics_24h';
  let callCount = 0;
  
  const mockFetcher = async () => {
    callCount++;
    console.log(`📡 Mock API call #${callCount}`);
    return { data: 'test data', timestamp: Date.now() };
  };
  
  // First call - should be a MISS and call the fetcher
  console.log('First call (should MISS):');
  const result1 = await cacheService.getOrFetch(testKey, mockFetcher, { ttl: 600000, forceRefresh: false });
  console.log('Result 1:', result1.timestamp);
  
  // Second call - should be a HIT and NOT call the fetcher
  console.log('\nSecond call (should HIT):');
  const result2 = await cacheService.getOrFetch(testKey, mockFetcher, { ttl: 600000, forceRefresh: false });
  console.log('Result 2:', result2.timestamp);
  
  console.log(`\nTotal API calls made: ${callCount} (should be 1)`);
  console.log(`Cache keys: [${cacheService.getKeys().join(', ')}]`);
  
  if (callCount === 1 && result1.timestamp === result2.timestamp) {
    console.log('✅ Cache is working correctly!');
  } else {
    console.log('❌ Cache is NOT working - each call is making an API request');
  }
}

testNewSignature().catch(console.error);
