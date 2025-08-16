import React, { useState, useEffect, useRef } from 'react';
import supportTicketService from '../../features/admin/services/supportTicketService';

/**
 * UserEmailAutocomplete Component
 * 
 * A smart autocomplete input for user emails that searches through existing users
 * and provides suggestions based on email, firstName, or lastName matches.
 * 
 * Features:
 * - Real-time search with debouncing
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click outside to close
 * - Loading states
 * - Structured user data display
 * - Validation feedback
 */
const UserEmailAutocomplete = ({
  value,
  onChange,
  onUserSelect,
  placeholder = "Start typing customer email...",
  className = "",
  disabled = false,
  showAutocomplete = true,
  limit = 10
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Fetch user suggestions with debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value && value.trim().length >= 2 && showAutocomplete) {
      debounceTimer.current = setTimeout(async () => {
        setLoading(true);
        setError(null);
        
        try {
          const result = await supportTicketService.searchUsers(value.trim(), limit);
          setSuggestions(result.users || []);
          setShowDropdown(result.users && result.users.length > 0);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Failed to fetch user suggestions:', error);
          setError('Failed to search users');
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setError(null);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, showAutocomplete, limit]);

  // Handle user selection
  const handleUserSelect = (user) => {
    // Update input with selected user's email
    onChange(user.email);
    
    // Close dropdown
    setShowDropdown(false);
    setSuggestions([]);
    setError(null);
    
    // Notify parent component with full user data
    if (onUserSelect) {
      onUserSelect({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        displayText: user.displayText
      });
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
          handleUserSelect(suggestions[selectedIndex]);
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

  // Helper function to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return <span key={index} className="bg-yellow-200 font-medium">{part}</span>;
      }
      return part;
    });
  };

  // Get user status indicator
  const getUserStatusIndicator = (user) => {
    return (
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${
          user.isEmailVerified ? 'bg-green-400' : 'bg-orange-400'
        }`} />
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
          user.role === 'premium' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {user.role}
        </span>
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="email"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
          } ${className}`}
          disabled={disabled}
        />
        
        {loading && showAutocomplete && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && showAutocomplete && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((user, index) => (
            <div
              key={user.id}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {highlightMatch(user.email, value)}
                    </span>
                    {getUserStatusIndicator(user)}
                  </div>
                  
                  {user.fullName && (
                    <div className="text-sm text-gray-600 truncate">
                      {highlightMatch(user.fullName, value)}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {user.id}
                  </div>
                </div>
                
                <div className="ml-2 flex-shrink-0">
                  <svg 
                    className="w-4 h-4 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && suggestions.length === 0 && !loading && value.length >= 2 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="px-4 py-3 text-center text-gray-500">
            <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            No users found matching "{value}"
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEmailAutocomplete;
