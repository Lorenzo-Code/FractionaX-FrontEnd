import React, { useState, useEffect, useRef } from 'react';
import { getAutocompleteSuggestions, getPlaceDetails, extractAddressComponents, validateAddress } from '../../../../shared/utils';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onAddressSelect,
  placeholder = "Start typing an address...",
  className = "",
  disabled = false,
  showAutocomplete = true
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Fetch suggestions with debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value && value.trim().length >= 3 && showAutocomplete) {
      debounceTimer.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await getAutocompleteSuggestions(value);
          setSuggestions(results);
          setShowDropdown(results.length > 0);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, showAutocomplete]);

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion) => {
    setLoading(true);
    try {
      // Get detailed place information
      const placeDetails = await getPlaceDetails(suggestion.place_id);
      const addressData = extractAddressComponents(placeDetails);
      const validation = validateAddress(addressData);

      // Update input with formatted address
      onChange(suggestion.description);
      
      // Close dropdown
      setShowDropdown(false);
      setSuggestions([]);
      
      // Notify parent component
      if (onAddressSelect) {
        onAddressSelect({
          address: suggestion.description,
          addressData,
          validation,
          placeDetails
        });
      }
    } catch (error) {
      console.error('Failed to get place details:', error);
      // Still update the input even if place details fail
      onChange(suggestion.description);
      setShowDropdown(false);
      
      if (onAddressSelect) {
        onAddressSelect({
          address: suggestion.description,
          addressData: null,
          validation: { isValid: false, missing: ['details'], hasCoordinates: false },
          error: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0 && showAutocomplete) {
      setShowDropdown(true);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
          disabled={disabled}
        />
        
        {loading && showAutocomplete && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && showAutocomplete && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-center">
                <svg 
                  className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <div>
                  <div className="text-sm text-gray-900">
                    {suggestion.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {value && value.trim().length >= 3 && suggestions.length === 0 && !loading && showAutocomplete && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No address suggestions found. Try typing more of the address.
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
