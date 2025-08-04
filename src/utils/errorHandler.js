/**
 * Global Error Handler for PostMessage and other browser issues
 * Prevents console spam from third-party integrations
 */

// Suppress PostMessage origin errors from Web3Modal/WalletConnect
const originalPostMessage = window.postMessage;

if (typeof window !== 'undefined') {
  // Handle PostMessage errors gracefully
  window.addEventListener('error', (event) => {
    // Suppress PostMessage origin mismatch errors
    if (event.message && event.message.includes('postMessage')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // Suppress WalletConnect/Reown config errors  
    if (event.message && (
      event.message.includes('Failed to fetch remote project configuration') ||
      event.message.includes('Reown') ||
      event.message.includes('WalletConnect')
    )) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress WalletConnect/Web3Modal config errors
    if (event.reason && event.reason.message && (
      event.reason.message.includes('Failed to fetch remote project configuration') ||
      event.reason.message.includes('HTTP status code: 403')
    )) {
      event.preventDefault();
      return false;
    }
  });

  // Override console.error for specific third-party warnings
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Filter out known non-critical warnings
    if (
      message.includes('postMessage') && message.includes('origin') ||
      message.includes('Reown Config') ||
      message.includes('Failed to fetch remote project configuration')
    ) {
      return; // Suppress these specific errors
    }
    
    // Allow all other errors through
    originalConsoleError.apply(console, args);
  };
}

export default {};
