/**
 * 🧪 Frontend Marketplace Integration Test
 * 
 * Tests the updated marketplace service to ensure it correctly
 * communicates with our new AI marketplace backend endpoint.
 */

import marketplaceService from './features/marketplace/services/marketplaceService.js';

async function testMarketplaceService() {
  console.log('🧪 Testing Frontend Marketplace Service...\n');

  const testCases = [
    {
      name: 'Basic AI Marketplace Listings',
      criteria: {
        location: 'Houston, TX',
        maxPrice: 800000,
        minPrice: 200000,
        limit: 5
      }
    },
    {
      name: 'Higher Budget Properties',
      criteria: {
        location: 'Houston, TX',
        maxPrice: 1200000,
        minPrice: 600000,
        limit: 3,
        targetROI: 10
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`🔍 Testing: ${testCase.name}`);
    console.log(`📋 Criteria:`, testCase.criteria);
    
    try {
      const startTime = Date.now();
      
      // Test AI marketplace listings
      const result = await marketplaceService.fetchAIMarketplaceListings(testCase.criteria);
      
      const responseTime = Date.now() - startTime;
      
      console.log(`\n📦 Results Analysis:`);
      console.log(`✓ Response Time: ${responseTime}ms`);
      console.log(`✓ Listings Count: ${result.listings?.length || 0}`);
      console.log(`✓ Has Summary: ${!!result.summary}`);
      console.log(`✓ Data Source: ${result.metadata?.source || 'unknown'}`);
      console.log(`✓ Backend Processing: ${result.metadata?.processing_time}ms`);
      
      if (result.listings && result.listings.length > 0) {
        const sample = result.listings[0];
        console.log(`\n🏠 Sample Property:`);
        console.log(`  • ID: ${sample.id}`);
        console.log(`  • Title: ${sample.title}`);
        console.log(`  • Address: ${sample.address}`);
        console.log(`  • Price: $${sample.price?.toLocaleString()}`);
        console.log(`  • Type: ${sample.propertyType}`);
        console.log(`  • ROI: ${sample.expectedROI}%`);
        console.log(`  • Tokenized: ${sample.tokenized}`);
        console.log(`  • AI Generated: ${sample.aiGenerated}`);
        
        if (sample.aiAnalysis) {
          console.log(`  • Investment Score: ${sample.aiAnalysis.investment_score}`);
          console.log(`  • Fractionalization Score: ${sample.aiAnalysis.fractionalization_score}`);
        }
      }
      
      if (result.summary) {
        console.log(`\n🤖 AI Summary: "${result.summary}"`);
      }

      console.log(`\n✅ Test PASSED!`);
      
    } catch (error) {
      console.error(`\n❌ Test FAILED:`);
      console.error(`📝 Error: ${error.message}`);
      
      // Try fallback to suggested listings
      console.log(`\n🔄 Testing fallback to suggested listings...`);
      try {
        const fallbackResult = await marketplaceService.fetchSuggestedListings();
        console.log(`✓ Fallback successful: ${fallbackResult.length} suggested listings`);
      } catch (fallbackError) {
        console.error(`❌ Fallback failed: ${fallbackError.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
  }
}

// Test query building
function testQueryBuilding() {
  console.log('🔧 Testing Investment Query Building...\n');
  
  const testCriteria = [
    {
      location: 'Houston, TX',
      maxPrice: 500000,
      minPrice: 200000,
      targetROI: 12
    },
    {
      location: 'Dallas, TX',
      maxPrice: 800000,
      propertyTypes: ['condo', 'townhouse'],
      includeRentals: false
    }
  ];

  testCriteria.forEach((criteria, index) => {
    console.log(`📋 Test Case ${index + 1}:`);
    console.log(`Input:`, criteria);
    
    const query = marketplaceService.buildInvestmentQuery(criteria);
    console.log(`Generated Query: "${query}"`);
    console.log(`✓ Query length: ${query.length} characters\n`);
  });
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Frontend Marketplace Integration Tests\n');
  console.log('='.repeat(80));
  
  // Test query building first (doesn't require server)
  testQueryBuilding();
  
  // Test marketplace service
  await testMarketplaceService();
  
  console.log('🏁 All Tests Complete!');
}

// Execute tests
runAllTests().catch(console.error);
