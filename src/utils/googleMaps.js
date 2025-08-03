/**
 * Google Maps API Loader Utility
 * 
 * Dynamically loads Google Maps JavaScript API with Places library
 * Ensures the API is only loaded once and provides proper error handling
 */

let isLoading = false;
let isLoaded = false;
let loadPromise = null;

/**
 * Load Google Maps JavaScript API with Places library
 * @returns {Promise<boolean>} Promise that resolves when API is loaded
 */
export const loadGoogleMapsAPI = () => {
  // Return existing promise if already loading
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Return resolved promise if already loaded
  if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(true);
  }

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
    return Promise.reject(new Error('Google Maps API key not configured'));
  }

  isLoading = true;

  loadPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, wait for it to load
      if (window.google && window.google.maps && window.google.maps.places) {
        isLoaded = true;
        isLoading = false;
        resolve(true);
        return;
      }

      // Wait for existing script to load
      existingScript.addEventListener('load', () => {
        isLoaded = true;
        isLoading = false;
        resolve(true);
      });

      existingScript.addEventListener('error', () => {
        isLoading = false;
        reject(new Error('Failed to load Google Maps API'));
      });

      return;
    }

    // Create and inject script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      // Verify that the API loaded correctly
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('✅ Google Maps API loaded successfully');
        isLoaded = true;
        isLoading = false;
        resolve(true);
      } else {
        isLoading = false;
        reject(new Error('Google Maps API did not load correctly'));
      }
    });

    script.addEventListener('error', (error) => {
      console.error('❌ Failed to load Google Maps API:', error);
      isLoading = false;
      reject(new Error('Failed to load Google Maps API script'));
    });

    // Add script to document
    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Check if Google Maps API is already loaded
 * @returns {boolean} True if API is loaded and ready
 */
export const isGoogleMapsLoaded = () => {
  return isLoaded && window.google && window.google.maps && window.google.maps.places;
};

/**
 * Initialize Google Places Autocomplete for an input element
 * @param {HTMLInputElement} inputElement - The input element to attach autocomplete to
 * @param {Object} options - Autocomplete configuration options
 * @returns {Promise<google.maps.places.Autocomplete>} Promise that resolves to Autocomplete instance
 */
export const initializeAutocomplete = async (inputElement, options = {}) => {
  if (!inputElement) {
    throw new Error('Input element is required for autocomplete initialization');
  }

  // Ensure Google Maps API is loaded
  await loadGoogleMapsAPI();

  // Default options for address autocomplete
  const defaultOptions = {
    types: ['address'],
    componentRestrictions: { country: 'us' },
    fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    ...options
  };

  // Create and return autocomplete instance
  const autocomplete = new window.google.maps.places.Autocomplete(inputElement, defaultOptions);
  
  console.log('✅ Google Places Autocomplete initialized');
  return autocomplete;
};

/**
 * Extract structured address data from Google Places result
 * @param {google.maps.places.PlaceResult} place - Place result from autocomplete
 * @returns {Object} Structured address data
 */
export const extractAddressComponents = (place) => {
  if (!place || !place.address_components) {
    return null;
  }

  const addressData = {
    formattedAddress: place.formatted_address || '',
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: null,
    longitude: null
  };

  // Extract address components
  place.address_components.forEach(component => {
    const types = component.types;
    const value = component.long_name;
    const shortValue = component.short_name;

    if (types.includes('street_number')) {
      addressData.streetNumber = value;
    } else if (types.includes('route')) {
      addressData.streetName = value;
    } else if (types.includes('locality')) {
      addressData.city = value;
    } else if (types.includes('administrative_area_level_1')) {
      addressData.state = shortValue; // Use short name for state (e.g., "TX" instead of "Texas")
    } else if (types.includes('postal_code')) {
      addressData.zipCode = value;
    } else if (types.includes('country')) {
      addressData.country = shortValue;
    }
  });

  // Extract coordinates
  if (place.geometry && place.geometry.location) {
    addressData.latitude = place.geometry.location.lat();
    addressData.longitude = place.geometry.location.lng();
  }

  return addressData;
};

/**
 * Validate if an address has all required components for property search
 * @param {Object} addressData - Address data from extractAddressComponents
 * @returns {Object} Validation result with isValid boolean and missing fields array
 */
export const validateAddress = (addressData) => {
  const requiredFields = ['streetNumber', 'streetName', 'city', 'state'];
  const missing = [];

  requiredFields.forEach(field => {
    if (!addressData[field] || addressData[field].trim() === '') {
      missing.push(field);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    hasCoordinates: addressData.latitude !== null && addressData.longitude !== null
  };
};

export default {
  loadGoogleMapsAPI,
  isGoogleMapsLoaded,
  initializeAutocomplete,
  extractAddressComponents,
  validateAddress
};
