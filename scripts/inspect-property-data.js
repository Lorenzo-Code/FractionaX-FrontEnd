/**
 * Simple property data inspector - run this in browser console
 * to see what data your APIs are actually returning
 */

console.log('🔍 FractionaX Property Data Inspector');
console.log('=====================================');

// Test Enhanced Discovery API
async function testEnhancedDiscovery() {
  console.log('\n🚀 Testing Enhanced Discovery API...');
  
  try {
    const response = await fetch('/api/marketplace/enhanced/property/28297409?intelligenceLevel=premium');
    const data = await response.json();
    
    console.log('✅ Enhanced Discovery Response:', data);
    
    if (data.success && data.property) {
      console.log('\n📊 Property Data Structure:');
      console.log('- ID:', data.property.id);
      console.log('- Zillow ID:', data.property.zillowId);
      console.log('- CoreLogic CLIP ID:', data.property.coreLogicClipId || data.property.clipId);
      console.log('- APN:', data.property.apn);
      console.log('- Address:', data.property.address);
      console.log('- Price:', data.property.price);
      console.log('- Specs:', `${data.property.specs?.beds}BR/${data.property.specs?.baths}BA, ${data.property.specs?.sqft}sqft`);
      console.log('- Images:', data.property.images?.length || 0);
      console.log('- AI Analysis:', !!data.property.aiIntelligence);
      console.log('- Market Data:', !!data.property.marketData);
      console.log('- Intelligence Scores:', data.property.intelligenceScores);
    }
  } catch (error) {
    console.error('❌ Enhanced Discovery failed:', error.message);
  }
}

// Test Properties API
async function testPropertiesAPI() {
  console.log('\n🏠 Testing Properties API...');
  
  try {
    const response = await fetch('/api/properties/28297409');
    const data = await response.json();
    
    console.log('✅ Properties API Response:', data);
    
    if (data.data) {
      console.log('\n📊 Property Data Fields:');
      console.log('Available fields:', Object.keys(data.data));
      
      if (data.data.coreLogicClipId || data.data.clipId) {
        console.log('🎯 CoreLogic CLIP ID found:', data.data.coreLogicClipId || data.data.clipId);
      } else {
        console.log('⚠️ No CoreLogic CLIP ID in response');
      }
    }
  } catch (error) {
    console.error('❌ Properties API failed:', error.message);
  }
}

// Test AI Marketplace API
async function testAIMarketplace() {
  console.log('\n🤖 Testing AI Marketplace API...');
  
  try {
    const requestBody = {
      query: 'Find high-potential investment properties in Houston, TX area',
      location: 'Houston, TX',
      maxPrice: 800000,
      minPrice: 100000,
      limit: 5,
      analysis_type: 'investment_focus'
    };
    
    const response = await fetch('/api/ai/marketplace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    console.log('✅ AI Marketplace Response:', data);
    
    if (data.success && data.listings) {
      console.log(`\n📊 Found ${data.listings.length} AI-generated properties`);
      data.listings.slice(0, 2).forEach((property, index) => {
        console.log(`\nProperty ${index + 1}:`, {
          id: property.id,
          title: property.title,
          address: property.address,
          price: property.price,
          clipId: property.clipId || property.coreLogicClipId,
          hasImages: property.images?.length > 0,
          hasAI: !!property.aiIntelligence
        });
      });
    }
  } catch (error) {
    console.error('❌ AI Marketplace failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testEnhancedDiscovery();
  await testPropertiesAPI();
  await testAIMarketplace();
  
  console.log('\n✨ Property data inspection complete!');
  console.log('💡 Tip: Open Network tab in DevTools to see raw API responses');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  runAllTests();
} else {
  console.log('📝 Copy this script and run it in your browser console while on the FractionaX site');
}
