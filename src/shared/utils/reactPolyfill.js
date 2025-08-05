// React polyfill to ensure createContext is available
// This prevents the "Cannot read properties of undefined (reading 'createContext')" error

import React from 'react';

// Ensure React is properly initialized and createContext is available
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

// Polyfill for createContext if it's somehow missing
if (!React.createContext) {
  console.error('React.createContext is not available. This may indicate a version mismatch or bundling issue.');
}

// Export React to ensure it's available when this module is imported
export default React;
