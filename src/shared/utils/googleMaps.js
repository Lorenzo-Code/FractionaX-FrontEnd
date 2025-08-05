/**
 * Google Maps Backend API Utility
 * 
 * Uses backend Google Maps API endpoints instead of client-side API
 * This provides better security and rate limiting
 */

import { smartFetch } from './index';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000';

/**
 * Test if backend Google Maps API is available
 * @returns {Promise<boolean>} Promise that resolves when API is available
 */
export const testGoogleMapsAPI = async () => {
  try {
    const response = await smartFetch('/api/google-maps/test');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend Google Maps API is available');
      return true;
    } else {
      console.error('❌ Backend Google Maps API test failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to test backend Google Maps API:', error);
    return false;
  }
};

/**
 * Get address autocomplete suggestions from backend
 * @param {string} input - Search input
 * @returns {Promise<Array>} Promise that resolves to suggestions array
 */
export const getAutocompleteSuggestions = async (input) => {
  if (!input || input.trim().length < 3) {
    return [];
  }

  try {
    const response = await smartFetch(`/api/google-maps/autocomplete?input=${encodeURIComponent(input)}`);
    const data = await response.json();
    
    if (data.success && data.predictions) {
      return data.predictions.map(prediction => ({
        description: prediction.description,
        place_id: prediction.place_id,
        matched_substrings: prediction.matched_substrings,
        reference: prediction.reference,
        terms: prediction.terms,
        types: prediction.types
      }));
    } else {
      console.error('Backend autocomplete failed:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Failed to get autocomplete suggestions:', error);
    return [];
  }
};

/**
 * Get place details from backend
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Promise that resolves to place details
 */
export const getPlaceDetails = async (placeId) => {
  if (!placeId) {
    throw new Error('Place ID is required');
  }

  try {
    const response = await smartFetch(`/api/google-maps/place-details?place_id=${encodeURIComponent(placeId)}`);
    const data = await response.json();
    
    if (data.success && data.result) {
      return data.result;
    } else {
      throw new Error(data.error || 'Failed to get place details');
    }
  } catch (error) {
    console.error('Failed to get place details:', error);
    throw error;
  }
};

/**
 * Extract structured address data from backend place details
 * @param {Object} placeDetails - Place details from backend API
 * @returns {Object} Structured address data
 */
export const extractAddressComponents = (placeDetails) => {
  if (!placeDetails || !placeDetails.address_components) {
    return null;
  }

  const addressData = {
    formattedAddress: placeDetails.formatted_address || '',
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
  placeDetails.address_components.forEach(component => {
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

  // Extract coordinates from geometry
  if (placeDetails.geometry && placeDetails.geometry.location) {
    addressData.latitude = placeDetails.geometry.location.lat;
    addressData.longitude = placeDetails.geometry.location.lng;
  }

  return addressData;
};

/**
 * Validate if an address has all required components for property search
 * @param {Object} addressData - Address data from extractAddressComponents
 * @returns {Object} Validation result with isValid boolean and missing fields array
 */
export const validateAddress = (addressData) => {
  if (!addressData) {
    return {
      isValid: false,
      missing: ['all'],
      hasCoordinates: false
    };
  }

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
  testGoogleMapsAPI,
  getAutocompleteSuggestions,
  getPlaceDetails,
  extractAddressComponents,
  validateAddress
};
