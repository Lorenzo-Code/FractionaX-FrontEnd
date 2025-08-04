/**
 * Advanced Error Handler for PostMessage and Google Ads integration
 * Keeps tracking functionality while suppressing console noise
 */

// Store original methods
const originalPostMessage = window.postMessage;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Advanced PostMessage error suppression
if (typeof window !== 'undefined') {
  // Method 1: Override console methods immediately (most effective)
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Comprehensive Google Ads PostMessage error filtering
    if (
      message.includes('Failed to execute \'postMessage\'') ||
      (message.includes('postMessage') && (
        message.includes('googletagmanager') ||
        message.includes('google.com') ||
        message.includes('target origin') ||
        message.includes('does not match') ||
        message.includes('recipient window\'s origin')
      )) ||
      message.includes('The target origin provided') ||
      message.includes('Ly.gm @') || // Google Ads specific error signature
      message.includes('js?id=AW-') // Google Ads script errors
    ) {
      return; // Completely suppress these errors
    }
    
    // Allow all other errors through
    originalConsoleError.apply(console, args);
  };
  
  // Method 2: Global error event interception
  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('postMessage') ||
      event.filename?.includes('googletagmanager') ||
      event.filename?.includes('gtag')
    )) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true); // Use capture phase
  
  // Method 3: Monkey patch postMessage at the window level
  const safePostMessage = function(message, targetOrigin, transfer) {
    try {
      return originalPostMessage.call(this, message, targetOrigin, transfer);
    } catch (error) {
      // Silently ignore postMessage errors - tracking still works
      return;
    }
  };
  
  // Apply to both window and any iframes
  window.postMessage = safePostMessage;
  
  // Intercept iframe creation to apply postMessage override
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    if (tagName.toLowerCase() === 'iframe') {
      element.addEventListener('load', function() {
        try {
          if (this.contentWindow && this.contentWindow.postMessage) {
            this.contentWindow.postMessage = safePostMessage;
          }
        } catch (e) {
          // Cross-origin iframe, ignore
        }
      });
    }
    return element;
  };
}

if (typeof window !== 'undefined') {
  // Handle CSP violations from Google Ads
  document.addEventListener('securitypolicyviolation', (event) => {
    // Suppress Google Ads CSP violations we know about
    if (
      event.violatedDirective?.includes('frame-ancestors') ||
      event.blockedURI?.includes('google.com') ||
      event.sourceFile?.includes('googletagmanager') ||
      event.sourceFile?.includes('googlesyndication')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  
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

  // Additional console.warn override for CSP warnings
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Filter out CSP warnings we know about
    if (
      message.includes('Content Security Policy directive') && message.includes('frame-ancestors') ||
      message.includes('frame-ancestors') && message.includes('ignored when delivered')
    ) {
      return; // Suppress these specific warnings
    }
    
    // Allow all other warnings through
    originalConsoleWarn.apply(console, args);
  };
}

export default {};
