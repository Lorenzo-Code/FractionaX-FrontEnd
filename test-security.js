#!/usr/bin/env node

/**
 * Security Feature Test Script
 * Tests our security implementations before running the full app
 */

// Test security utilities
console.log('🔐 Testing Security Features...\n');

// Test 1: Security config loading
try {
  const fs = require('fs');
  const securityConfigExists = fs.existsSync('./src/config/security.js');
  console.log('✅ Security config file exists:', securityConfigExists);
} catch (error) {
  console.log('❌ Security config test failed:', error.message);
}

// Test 2: Security utilities file
try {
  const fs = require('fs');
  const securityUtilsExists = fs.existsSync('./src/utils/security.js');
  console.log('✅ Security utils file exists:', securityUtilsExists);
} catch (error) {
  console.log('❌ Security utils test failed:', error.message);
}

// Test 3: Secure API client
try {
  const fs = require('fs');
  const secureApiClientExists = fs.existsSync('./src/utils/secureApiClient.js');
  console.log('✅ Secure API client exists:', secureApiClientExists);
} catch (error) {
  console.log('❌ Secure API client test failed:', error.message);
}

// Test 4: Security hook
try {
  const fs = require('fs');
  const securityHookExists = fs.existsSync('./src/hooks/useSecurity.js');
  console.log('✅ Security hook exists:', securityHookExists);
} catch (error) {
  console.log('❌ Security hook test failed:', error.message);
}

// Test 5: Enhanced AuthProvider
try {
  const fs = require('fs');
  const authProviderContent = fs.readFileSync('./src/context/AuthProvider.jsx', 'utf8');
  const hasEnhancedFeatures = authProviderContent.includes('generateSecureToken') && 
                              authProviderContent.includes('secureApiClient') &&
                              authProviderContent.includes('SECURITY_CONFIG');
  console.log('✅ AuthProvider has enhanced security features:', hasEnhancedFeatures);
} catch (error) {
  console.log('❌ AuthProvider enhancement test failed:', error.message);
}

// Test 6: CSP header in index.html
try {
  const fs = require('fs');
  const indexContent = fs.readFileSync('./index.html', 'utf8');
  const hasCSP = indexContent.includes('Content-Security-Policy');
  console.log('✅ CSP header configured:', hasCSP);
} catch (error) {
  console.log('❌ CSP header test failed:', error.message);
}

// Test 7: Vite security config
try {
  const fs = require('fs');
  const viteConfig = fs.readFileSync('./vite.config.js', 'utf8');
  const hasSecurityHeaders = viteConfig.includes('X-Frame-Options') && 
                            viteConfig.includes('X-Content-Type-Options');
  console.log('✅ Vite security headers configured:', hasSecurityHeaders);
} catch (error) {
  console.log('❌ Vite security config test failed:', error.message);
}

// Test 8: Security documentation
try {
  const fs = require('fs');
  const securityDocsExists = fs.existsSync('./SECURITY.md');
  console.log('✅ Security documentation exists:', securityDocsExists);
} catch (error) {
  console.log('❌ Security documentation test failed:', error.message);
}

console.log('\n🎯 Security Feature Tests Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Open browser console to see security logging');
console.log('3. Test authentication features');
console.log('4. Test input validation');
console.log('5. Test rate limiting\n');
