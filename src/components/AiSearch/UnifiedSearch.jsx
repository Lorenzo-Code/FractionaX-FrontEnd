import React, { useState, useRef, useEffect, useCallback } from "react";
import { smartFetch } from "@/utils/apiClient";

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
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    // Initialize Google Places Autocomplete - keep it always active
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.address_components || !place.geometry) {
        setValidAddress(false);
        setError("Please select a valid address from the suggestions.");
        return;
      }
      
      // When a place is selected, update the query and force address mode
      const formattedAddress = place.formatted_address || place.name;
      setQuery(formattedAddress);
      setValidAddress(true);
      setError("");
      setSearchType("address");
    });
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Detect if input is address or natural language
  const detectSearchType = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Natural language keywords - if any of these are present, it's likely natural language
    const naturalKeywords = [
      'find', 'show', 'looking for', 'want', 'need', 'search for', 'get me',
      'under', 'over', 'above', 'below', 'between', 'around', 'near',
      'bedroom', 'bed', 'bath', 'bathroom', 'sqft', 'square feet',
      'house', 'home', 'condo', 'apartment', 'townhouse',
      'price', 'budget', 'cost', 'expensive', 'cheap', 'affordable',
      'pool', 'garage', 'parking', 'yard', 'garden',
      'downtown', 'suburb', 'neighborhood', 'area', 'district'
    ];
    
    // Check if input contains natural language keywords
    const hasNaturalKeywords = naturalKeywords.some(keyword => lowerInput.includes(keyword));
    
    // Address pattern: number + street name + street type (more specific)
    const addressPattern = /^\d+\s+[\w\s]+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ct|court|ln|lane|way|pl|place|pkwy|parkway)\b/i;
    
    // If it has natural keywords, treat as natural language
    if (hasNaturalKeywords) {
      return "natural";
    }
    
    // If it matches strict address pattern and no natural keywords, treat as address
    if (addressPattern.test(input.trim())) {
      return "address";
    }
    
    // Default to natural language for ambiguous cases
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

  // Debounced input change handler
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
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

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }
    
    // For address searches, require validation. For natural language, allow through
    if (searchType === "address" && !validAddress) {
      setError("Please select a valid address from the dropdown suggestions.");
      return;
    }

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
        // Use search endpoint for natural language queries with 'query' parameter
        endpoint = "/api/ai";
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
        onResults(data);
        
      } else {
        // For now, route address searches through the natural language endpoint
        // Format the address as a natural search query
        const addressQuery = `Show me detailed information for the property at ${currentQuery}`;
        
        endpoint = "/api/ai";
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
        onResults(data);
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
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
  <button
    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200
      ${searchMode === "fast-comp"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
    onClick={() => setSearchMode("fast-comp")}
  >
    Fast Comp
  </button>

  <button
    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200
      ${searchMode === "comprehensive"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
    onClick={() => setSearchMode("comprehensive")}
  >
    Full Comp
  </button>
</div>

      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={searchType === "address" ? "Start typing an address (e.g., 1180 Main St)..." : "Ask me anything about properties (e.g., 'Show me 3BR homes under $300K')..."}
          className={`w-full px-4 py-3 pr-32 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
            inputTouched && !validAddress && query.trim()
              ? "border-red-400 focus:ring-red-500 focus:border-red-500"
              : validAddress
              ? "border-green-400 focus:ring-green-500 focus:border-green-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
          disabled={loading}
        />
        
        {/* Search button inside input box */}
        <button
          onClick={handleSearch}
          disabled={loading || !validAddress}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            loading || !validAddress
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            </div>
          ) : (
            validAddress && searchType === "address" ? (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-white mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Search
              </div>
            ) : (
              "Search"
            )
          )}
        </button>
        
        {/* Debug indicator for search type */}
        {query.trim() && (
          <div className="absolute top-[-20px] left-0 text-xs text-blue-600 font-medium">
            🔍 {searchType === "natural" ? "Natural Language Search" : "Address Search"}
          </div>
        )}
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearch;