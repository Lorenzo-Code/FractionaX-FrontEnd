import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiDollarSign, FiHome } from "react-icons/fi";
import { BsCoin } from "react-icons/bs";

const SearchBar = ({ value, onChange, placeholder = "Search properties..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const suggestions = [
    {
      type: "location",
      icon: <FiMapPin className="w-4 h-4" />,
      text: "Houston, TX",
      subtext: "12,847 properties"
    },
    {
      type: "location",
      icon: <FiMapPin className="w-4 h-4" />,
      text: "Austin, TX",
      subtext: "8,921 properties"
    },
    {
      type: "location",
      icon: <FiMapPin className="w-4 h-4" />,
      text: "Dallas, TX",
      subtext: "15,234 properties"
    },
    {
      type: "price",
      icon: <FiDollarSign className="w-4 h-4" />,
      text: "Under $300,000",
      subtext: "Budget-friendly options"
    },
    {
      type: "price",
      icon: <FiDollarSign className="w-4 h-4" />,
      text: "$500,000 - $750,000",
      subtext: "Mid-range properties"
    },
    {
      type: "type",
      icon: <FiHome className="w-4 h-4" />,
      text: "Single Family Homes",
      subtext: "Houses with yards"
    },
    {
      type: "type",
      icon: <FiHome className="w-4 h-4" />,
      text: "Condominiums",
      subtext: "Low maintenance living"
    },
    {
      type: "tokenized",
      icon: <BsCoin className="w-4 h-4" />,
      text: "Tokenized Properties",
      subtext: "Fractional ownership available"
    }
  ];

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(value.toLowerCase()) ||
    suggestion.subtext.toLowerCase().includes(value.toLowerCase())
  );

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className={`w-5 h-5 transition-colors ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${isFocused ? 'shadow-lg border-blue-300' : 'border-gray-300 shadow-sm hover:border-gray-400'}
          `}
        />

        {/* Quick filters */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="flex items-center space-x-2">
            <button
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
              title="Filter by location"
            >
              <FiMapPin className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
              title="Filter by price"
            >
              <FiDollarSign className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded transition-colors"
              title="Tokenized properties"
            >
              <BsCoin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (value.length > 0 || isFocused) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {value.length === 0 ? (
            // Show popular searches when no input
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Popular Searches</h4>
              <div className="space-y-2">
                {suggestions.slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      suggestion.type === 'location' ? 'bg-blue-100 text-blue-600' :
                      suggestion.type === 'price' ? 'bg-green-100 text-green-600' :
                      suggestion.type === 'tokenized' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{suggestion.text}</p>
                      <p className="text-xs text-gray-500">{suggestion.subtext}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : filteredSuggestions.length > 0 ? (
            // Show filtered suggestions
            <div className="py-2">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    suggestion.type === 'location' ? 'bg-blue-100 text-blue-600' :
                    suggestion.type === 'price' ? 'bg-green-100 text-green-600' :
                    suggestion.type === 'tokenized' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{suggestion.text}</p>
                    <p className="text-xs text-gray-500">{suggestion.subtext}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // No results
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No suggestions found for "{value}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for a city, price range, or property type</p>
            </div>
          )}

          {/* Search Tips */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h5 className="text-xs font-medium text-gray-700 mb-2">Search Tips:</h5>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white px-2 py-1 rounded border text-gray-600">Try "Houston condos"</span>
              <span className="bg-white px-2 py-1 rounded border text-gray-600">Or "Under $500k"</span>
              <span className="bg-white px-2 py-1 rounded border text-gray-600">Or "Tokenized"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
