import React, { useState, useEffect } from 'react';
import { smartFetch } from 'shared/utils';

const BackendConnectionHandler = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const checkBackendConnection = async () => {
    try {
      // Try to ping a simple endpoint to check if backend is responding
      const response = await smartFetch('/api/health', {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        setRetryCount(0);
      } else {
        throw new Error('Backend not responding');
      }
    } catch (error) {
      console.warn('Backend connection check failed:', error.message);
      setConnectionStatus('disconnected');
    }
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setConnectionStatus('checking');
      setTimeout(checkBackendConnection, 1000); // Retry after 1 second
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  if (connectionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">Retry attempt {retryCount}/{maxRetries}</p>
          )}
        </div>
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Issue</h2>
          <p className="text-gray-600 mb-6">
            We're having trouble connecting to our servers. This might be a temporary issue.
          </p>
          {retryCount < maxRetries ? (
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again ({maxRetries - retryCount} attempts left)
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                If this issue persists, please try refreshing the page or contact support.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default BackendConnectionHandler;
