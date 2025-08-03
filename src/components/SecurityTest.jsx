import React, { useState, useEffect } from 'react';
import { useSecurity } from '../hooks/useSecurity';
import { secureGet, securePost, clearAuth, healthCheck } from '../utils/secureApiClient';
import { checkSecurityThreats, validateEmail, sanitizeText } from '../utils/security';

const SecurityTest = () => {
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [apiHealthy, setApiHealthy] = useState(null);
  
  const security = useSecurity({
    requireAuth: false,
    enableSessionMonitoring: true,
    enableIdleTimeout: false, // Disabled for testing
    enableSecurityLogging: true
  });

  useEffect(() => {
    // Test API health on component mount
    testApiHealth();
  }, []);

  const addResult = (test, result, success = true) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      result,
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testApiHealth = async () => {
    try {
      const health = await healthCheck();
      setApiHealthy(health.ok);
      addResult('API Health Check', `Status: ${health.ok ? 'Healthy' : 'Unhealthy'}`, health.ok);
    } catch (error) {
      setApiHealthy(false);
      addResult('API Health Check', `Error: ${error.message}`, false);
    }
  };

  const testInputValidation = () => {
    const threats = checkSecurityThreats(testInput);
    addResult(
      'Input Validation', 
      `Input: "${testInput}" - Safe: ${threats.safe} - Threats: ${threats.threats.join(', ') || 'None'}`,
      threats.safe
    );
  };

  const testEmailValidation = () => {
    const isValid = validateEmail(testInput);
    addResult(
      'Email Validation', 
      `Email: "${testInput}" - Valid: ${isValid}`,
      isValid
    );
  };

  const testTextSanitization = () => {
    const sanitized = sanitizeText(testInput);
    addResult(
      'Text Sanitization', 
      `Original: "${testInput}" - Sanitized: "${sanitized}"`,
      true
    );
  };

  const testRateLimit = async () => {
    const allowed = security.checkRateLimit('test-action');
    addResult(
      'Rate Limiting', 
      `Request allowed: ${allowed}`,
      allowed
    );
  };

  const testSecureApiCall = async () => {
    try {
      const response = await secureGet('/api/test');
      const data = await response.text();
      addResult('Secure API Call', `Response: ${data}`, response.ok);
    } catch (error) {
      addResult('Secure API Call', `Error: ${error.message}`, false);
    }
  };

  const testCSRFProtection = async () => {
    try {
      const response = await securePost('/api/auth/csrf-token');
      const data = await response.json();
      addResult('CSRF Protection', `CSRF Token received: ${!!data.csrfToken}`, !!data.csrfToken);
    } catch (error) {
      addResult('CSRF Protection', `Error: ${error.message}`, false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testXSSAttempt = () => {
    const xssInput = '<script>alert("XSS")</script>';
    setTestInput(xssInput);
    const threats = checkSecurityThreats(xssInput);
    addResult(
      'XSS Detection', 
      `XSS attempt detected: ${!threats.safe} - Threats: ${threats.threats.join(', ')}`,
      !threats.safe
    );
  };

  const testSQLInjection = () => {
    const sqlInput = "'; DROP TABLE users; --";
    setTestInput(sqlInput);
    const threats = checkSecurityThreats(sqlInput);
    addResult(
      'SQL Injection Detection', 
      `SQL injection detected: ${!threats.safe} - Threats: ${threats.threats.join(', ')}`,
      !threats.safe
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔐 Security Testing Dashboard</h2>
      
      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${security.isSecure ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="font-semibold">Security Status</h3>
          <p className={security.isSecure ? 'text-green-600' : 'text-red-600'}>
            {security.isSecure ? '✅ Secure' : '❌ Threats Detected'}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${apiHealthy ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="font-semibold">API Status</h3>
          <p className={apiHealthy ? 'text-green-600' : 'text-red-600'}>
            {apiHealthy === null ? '⏳ Checking...' : apiHealthy ? '✅ Healthy' : '❌ Unhealthy'}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-100">
          <h3 className="font-semibold">Session Time</h3>
          <p className="text-blue-600">
            {security.sessionTimeRemaining ? 
              `${Math.round(security.sessionTimeRemaining / 1000 / 60)} min` : 
              'Unknown'
            }
          </p>
        </div>
      </div>

      {/* Test Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Input
        </label>
        <input
          type="text"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="Enter text to test security features..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <button
          onClick={testInputValidation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Input
        </button>
        
        <button
          onClick={testEmailValidation}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Email
        </button>
        
        <button
          onClick={testTextSanitization}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Sanitize Text
        </button>
        
        <button
          onClick={testRateLimit}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Rate Limit
        </button>
        
        <button
          onClick={testSecureApiCall}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          API Call
        </button>
        
        <button
          onClick={testCSRFProtection}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          CSRF Test
        </button>
        
        <button
          onClick={testXSSAttempt}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          XSS Test
        </button>
        
        <button
          onClick={testSQLInjection}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          SQL Test
        </button>
      </div>

      {/* Clear Button */}
      <div className="mb-6">
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
        
        <button
          onClick={testApiHealth}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Health
        </button>
      </div>

      {/* Test Results */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Test Results</h3>
        
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click a test button above to start.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 rounded border-l-4 ${
                  result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-gray-700">{result.test}:</span>
                    <p className="text-sm text-gray-600 mt-1">{result.result}</p>
                  </div>
                  <span className="text-xs text-gray-400">{result.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Threats */}
      {security.hasThreats && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">🚨 Security Threats Detected</h3>
          <ul className="text-sm text-red-600">
            {security.securityState.threats.map((threat, index) => (
              <li key={index}>
                {threat.context}: {threat.threats.join(', ')} 
                <span className="text-xs text-gray-500 ml-2">
                  ({new Date(threat.timestamp).toLocaleTimeString()})
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={security.clearThreats}
            className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Clear Threats
          </button>
        </div>
      )}
    </div>
  );
};

export default SecurityTest;
