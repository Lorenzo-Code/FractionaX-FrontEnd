import React, { useState, useRef, useEffect, useCallback } from "react";
import { smartFetch } from '../../../../shared/utils/secureApiClient';
import AddressAutocomplete from './AddressAutocomplete';

const UnifiedSearch = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("fast-comp"); // fast-comp, comprehensive
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validAddress, setValidAddress] = useState(false);
  const [inputTouched, setInputTouched] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchType, setSearchType] = useState("address"); // address or natural
  const [showChat, setShowChat] = useState(false);
  const [selectedAddressData, setSelectedAddressData] = useState(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Handle address selection from autocomplete
  const handleAddressSelect = (addressInfo) => {
    const { address, addressData, validation, error } = addressInfo;
    
    if (error) {
      console.error('Address selection error:', error);
      setError('Failed to get address details. You can still search with the address.');
      setValidAddress(false);
      return;
    }
    
    if (validation.isValid) {
      setSelectedAddressData(addressData);
      setValidAddress(true);
      setError('');
      setSearchType('address');
      console.log('✅ Valid address selected:', addressData);
    } else {
      setValidAddress(false);
      setSelectedAddressData(null);
      setError(`Address is incomplete. Missing: ${validation.missing.join(', ')}`);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Detect if input is address or natural language
  const detectSearchType = (input) => {
    if (!input || !input.trim()) {
      return "address"; // Default to address for empty input
    }
    
    const trimmedInput = input.trim();
    const lowerInput = trimmedInput.toLowerCase();
    
    // Address patterns (more comprehensive)
    const addressPatterns = [
      /^\d+\s+[\w\s]+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ct|court|ln|lane|way|pl|place|pkwy|parkway|cir|circle|trl|trail)\b/i,
      /^\d+\s+[\w\s]+\s+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ct|court|ln|lane|way|pl|place|pkwy|parkway|cir|circle|trl|trail)/i,
      /^\d+\s+[a-zA-Z\s]+,/i, // Address with comma (123 Main St, Houston)
      /^\d{1,6}\s+[a-zA-Z]/i, // Any number followed by letter (catches most addresses)
    ];
    
    // Natural language keywords - strong indicators of natural language
    const strongNaturalKeywords = [
      'find', 'show', 'looking for', 'want', 'need', 'search for', 'get me',
      'under', 'over', 'above', 'below', 'between', 'around', 'near',
      'bedroom', 'bed', 'bath', 'bathroom', 'sqft', 'square feet',
      'house', 'home', 'condo', 'apartment', 'townhouse',
      'price', 'budget', 'cost', 'expensive', 'cheap', 'affordable',
      'pool', 'garage', 'parking', 'yard', 'garden',
      'with', 'without', 'has', 'have', 'include', 'exclude'
    ];
    
    // Check for strong natural language indicators first
    const hasStrongNaturalKeywords = strongNaturalKeywords.some(keyword => 
      lowerInput.includes(keyword)
    );
    
    // If it has strong natural language keywords, definitely natural
    if (hasStrongNaturalKeywords) {
      return "natural";
    }
    
    // Check if it matches any address pattern
    const matchesAddressPattern = addressPatterns.some(pattern => 
      pattern.test(trimmedInput)
    );
    
    if (matchesAddressPattern) {
      return "address";
    }
    
    // Additional heuristics:
    // - If it starts with a number, likely an address
    if (/^\d/.test(trimmedInput)) {
      return "address";
    }
    
    // - If it contains specific location indicators without natural language
    const locationWords = ['downtown', 'suburb', 'neighborhood', 'area', 'district'];
    const hasLocationWords = locationWords.some(word => lowerInput.includes(word));
    
    if (hasLocationWords && !hasStrongNaturalKeywords) {
      return "natural";
    }
    
    // For short inputs (1-2 words), default to address
    const wordCount = trimmedInput.split(/\s+/).length;
    if (wordCount <= 2) {
      return "address";
    }
    
    // Default to natural language for longer phrases
    return "natural";
  };

  // Clear chat history
  const clearChat = async () => {
    setChatHistory([]);
    setShowChat(false);
    try {
      await smartFetch("/api/ai/pipeline/reset", { method: "POST" });
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  // Handle input change for both address and natural language
  const handleInputChange = useCallback((value) => {
    setQuery(value);
    setInputTouched(true);
    
    // Detect search type
    const detectedType = detectSearchType(value);
    setSearchType(detectedType);
    
    if (detectedType === "address") {
      setValidAddress(false);
      // Clear previous debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Set new debounce timer for address validation
      const newTimer = setTimeout(() => {
        if (value.trim() && !validAddress) {
          setError("Please select a valid address from the suggestions.");
        } else {
          setError("");
        }
      }, 500);
      
      setDebounceTimer(newTimer);
    } else {
      // For natural language, we don't need address validation
      setValidAddress(true);
      setError("");
    }
  }, [debounceTimer, validAddress]);

  // Handle query change (for both AddressAutocomplete and regular input)
  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    setInputTouched(true);
    
    // Detect search type
    const detectedType = detectSearchType(value);
    setSearchType(detectedType);
    
    if (detectedType === "natural") {
      // For natural language, we don't need address validation
      setValidAddress(true);
      setError("");
    } else {
      // For address, reset validation until address is selected
      setValidAddress(false);
    }
  }, []);

  const handleSearch = async () => {
    console.log('🔍 UnifiedSearch: handleSearch called with query:', query);
    
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }
    
    console.log('🔍 Search type detected:', searchType, 'Valid address:', validAddress);
    
    // For address searches, require validation. For natural language, allow through
    if (searchType === "address" && !validAddress) {
      setError("Please select a valid address from the dropdown suggestions.");
      return;
    }

    console.log('🔍 Starting search...');
    setLoading(true);
    setError("");
    
    // Add user message to chat history
    const userMessage = { role: "user", content: query, timestamp: new Date() };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setShowChat(true);
    
    // Clear input immediately for better UX
    const currentQuery = query;
    setQuery("");
    setValidAddress(false);
    setInputTouched(false);
    
    try {
      let payload;
      let endpoint;
      
      if (searchType === "natural") {
        // Use V2 search endpoint for natural language queries with enhanced features
        endpoint = "/api/ai/search/v2";
        payload = { 
          query: currentQuery, // API expects 'query' not 'prompt'
          chat_history: updatedHistory.slice(-10)
        };
        
        const response = await smartFetch(endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.message || errorData?.error || response.statusText;
          throw new Error(`API Error (${response.status}): ${errorMessage}`);
        }
        
        const data = await response.json();
        console.log('📝 API Response received:', data);
        console.log('📝 Calling onResults with:', data.listings, data.ai_summary);
        onResults(data.listings, data.ai_summary);
        
      } else {
        // For now, route address searches through the V2 endpoint
        // Format the address as a natural search query
        const addressQuery = `Show me detailed information for the property at ${currentQuery}`;
        
        endpoint = "/api/ai/search/v2";
        payload = { 
          query: addressQuery,
          chat_history: updatedHistory.slice(-10)
        };
        
        const response = await smartFetch(endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.message || errorData?.error || response.statusText;
          throw new Error(`API Error (${response.status}): ${errorMessage}`);
        }
        
        const data = await response.json();
        console.log('📝 API Response received (address):', data);
        
        // If we have address data with coordinates, use them when API location is null
        if (selectedAddressData && data.listings && data.listings.length > 0) {
          data.listings.forEach(listing => {
            if (!listing.location || listing.location.latitude === null || listing.location.longitude === null) {
              console.log('📍 Fixing null coordinates with address data:', selectedAddressData);
              listing.location = {
                latitude: selectedAddressData.latitude,
                longitude: selectedAddressData.longitude
              };
            }
          });
        }
        
        console.log('📝 Calling onResults with:', data.listings, data.ai_summary);
        onResults(data.listings, data.ai_summary);
      }
      
      // Add AI response to chat history
      const aiMessage = { 
        role: "assistant", 
        content: searchType === "natural" 
          ? "Found properties matching your criteria."
          : `Analysis complete for ${currentQuery}. Found detailed property information.`,
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Search error:", err);
      
      let errorMessage = "Search failed. Please try again.";
      if (err.message?.includes("404")) {
        errorMessage = "Property not found. Please verify the address and try again.";
      } else if (err.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = err.message || "Search failed. Please try again.";
      }
      
      // Add error message to chat history
      const errorMessageObj = { 
        role: "assistant", 
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
        isError: true
      };
      setChatHistory(prev => [...prev, errorMessageObj]);
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchMode === "fast-comp"
                ? "bg-white text-blue-700 shadow-sm border border-blue-200"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
            onClick={() => setSearchMode("fast-comp")}
          >
            ⚡ Fast Comp
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchMode === "comprehensive"
                ? "bg-white text-blue-700 shadow-sm border border-blue-200"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
            onClick={() => setSearchMode("comprehensive")}
          >
            🔍 Full Comp
          </button>
        </div>
      </div>

      {/* Search Input Section */}
      <div className="relative">
        {/* Search Type Indicator */}
        {query.trim() && (
          <div className="absolute -top-6 left-0 flex items-center space-x-2 text-xs">
            <div className={`inline-flex items-center px-2 py-1 rounded-full ${
              searchType === "natural" 
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}>
              <span className="mr-1">
                {searchType === "natural" ? "🧠" : "📍"}
              </span>
              {searchType === "natural" ? "AI Search" : "Address Lookup"}
            </div>
          </div>
        )}
        
        <div className="relative">
          <AddressAutocomplete
            value={query}
            onChange={handleQueryChange}
            onAddressSelect={handleAddressSelect}
            placeholder={searchType === "address" ? 
              "Start typing an address (e.g., 1180 Main St)..." : 
              "Ask me anything about properties (e.g., 'Show me 3BR homes under $300K')..."
            }
            showAutocomplete={searchType === "address"}
            className={`w-full pl-12 pr-24 py-4 text-base border-2 rounded-xl shadow-sm transition-all duration-200 ${
              searchType === "address" && inputTouched && !validAddress && query.trim()
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : searchType === "address" && validAddress
                ? "border-blue-300 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                : searchType === "natural" && query.trim()
                ? "border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-400 bg-white hover:border-gray-400"
            }`}
            disabled={loading}
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className={`w-5 h-5 ${
              query.trim() ? 'text-gray-600' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading || (searchType === "address" && !validAddress)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 z-10 ${
              loading || (searchType === "address" && !validAddress)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {searchType === "address" && validAddress ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Search</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Search Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearch;