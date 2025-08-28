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
  const [includeZillowEnrichment, setIncludeZillowEnrichment] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
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
        // For specific address searches, use the property research endpoint
        endpoint = "/api/ai/property-research";
        payload = { 
          prompt: currentQuery,
          tier: searchMode === "fast-comp" ? "basic" : "comprehensive",
          includeComparables: searchMode === "comprehensive",
          includeHistory: searchMode === "comprehensive",
          includeZillowEnrichment: includeZillowEnrichment,
          confirmed: pendingConfirmation ? 'true' : 'false'
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
        console.log('📝 Property Research Response received:', data);
        
        // Handle cost confirmation requirement
        if (data.requiresConfirmation && data.feature === 'zillowEnrichment') {
          setPendingConfirmation({
            payload: { ...payload, confirmed: 'true' },
            query: currentQuery,
            confirmationData: data
          });
          setShowConfirmationModal(true);
          setLoading(false);
          return;
        }
        
        // Transform property research data to match expected format
        let transformedListings = [];
        
        // Always create a listing if we have parsed address data, even if CoreLogic fails
        if (data.parsedAddress) {
          const property = data.essentialData?.propertyDetail || {};
          const ownership = data.essentialData?.ownership;
          const validation = data.validation;
          const zillowEnrichment = data.zillowEnrichment;
          
          // Create a property listing object that matches expected format
          const listing = {
            id: `research_${data.sessionId}_${Date.now()}`,
            zpid: zillowEnrichment?.zpid || property.zpid || null,
            address: {
              oneLine: `${data.parsedAddress.streetAddress}, ${data.parsedAddress.city}, ${data.parsedAddress.state} ${data.parsedAddress.zipCode || ''}`.trim(),
              street: data.parsedAddress.streetAddress,
              city: data.parsedAddress.city,
              state: data.parsedAddress.state,
              zip: data.parsedAddress.zipCode
            },
            price: property.marketValue || property.assessedValue || null,
            beds: property.bedrooms || null,
            baths: property.bathrooms || null,
            sqft: property.livingArea || property.totalArea || null,
            yearBuilt: property.yearBuilt || null,
            propertyType: property.propertyType || 'Unknown',
            location: {
              latitude: validation?.geocode?.latitude || selectedAddressData?.latitude,
              longitude: validation?.geocode?.longitude || selectedAddressData?.longitude
            },
            // Enhanced with Zillow data
            zillowImage: zillowEnrichment?.primaryImage,
            carouselPhotos: zillowEnrichment?.images?.map(img => img.imgSrc) || [],
            zillowEnrichment: zillowEnrichment,
            dataSource: data.essentialData?.propertyDetail ? 'corelogic-research' : 'address-research',
            researchData: {
              ownership: ownership,
              siteLocation: data.essentialData?.siteLocation,
              marketAnalysis: data.marketAnalysis,
              totalCost: data.totalCost,
              apiCalls: data.apiCalls,
              zillowEnrichment: zillowEnrichment,
              coreLogicStatus: data.essentialData?.error ? 'failed' : 'success'
            },
            hasDetailData: !!data.essentialData?.propertyDetail,
            coreLogicLookupRequired: false
          };
          
          transformedListings = [listing];
        }
        
        const summary = `Found detailed property research for ${data.parsedAddress.streetAddress}. API cost: $${data.totalCost?.toFixed(2) || '0.00'} (${data.apiCalls?.length || 0} calls made).`;
        
        console.log('📝 Calling onResults with transformed data:', transformedListings, summary);
        onResults(transformedListings, summary);
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

  // Handle confirmation modal actions
  const handleConfirmEnrichment = async () => {
    if (!pendingConfirmation) return;
    
    setShowConfirmationModal(false);
    setLoading(true);
    
    try {
      const response = await smartFetch("/api/ai/property-research", {
        method: "POST",
        body: JSON.stringify(pendingConfirmation.payload),
      });
      
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📝 Confirmed Property Research Response:', data);
      
      // Transform and process the enriched data - show results even if CoreLogic data fails
      if (data.parsedAddress) {
        const property = data.essentialData?.propertyDetail || {};
        const ownership = data.essentialData?.ownership;
        const validation = data.validation;
        const zillowEnrichment = data.zillowEnrichment;
        
        // Create enhanced listing with available data
        const listing = {
          id: `research_${data.sessionId}_${Date.now()}`,
          zpid: zillowEnrichment?.zpid || property.zpid || null,
          address: {
            oneLine: `${data.parsedAddress.streetAddress}, ${data.parsedAddress.city}, ${data.parsedAddress.state} ${data.parsedAddress.zipCode || ''}`.trim(),
            street: data.parsedAddress.streetAddress,
            city: data.parsedAddress.city,
            state: data.parsedAddress.state,
            zip: data.parsedAddress.zipCode
          },
          price: property.marketValue || property.assessedValue || null,
          beds: property.bedrooms || null,
          baths: property.bathrooms || null,
          sqft: property.livingArea || property.totalArea || null,
          yearBuilt: property.yearBuilt || null,
          propertyType: property.propertyType || 'Unknown',
          location: {
            latitude: validation?.geocode?.latitude || selectedAddressData?.latitude,
            longitude: validation?.geocode?.longitude || selectedAddressData?.longitude
          },
          // Enhanced with Zillow data
          zillowImage: zillowEnrichment?.primaryImage,
          carouselPhotos: zillowEnrichment?.images?.map(img => img.imgSrc) || [],
          zillowEnrichment: zillowEnrichment,
          dataSource: data.essentialData?.propertyDetail ? 'corelogic-research-enriched' : 'address-research-enriched',
          researchData: {
            ownership: ownership,
            siteLocation: data.essentialData?.siteLocation,
            marketAnalysis: data.marketAnalysis,
            totalCost: data.totalCost,
            apiCalls: data.apiCalls,
            zillowEnrichment: zillowEnrichment,
            coreLogicStatus: data.essentialData?.error ? 'failed' : 'success'
          },
          hasDetailData: !!data.essentialData?.propertyDetail,
          coreLogicLookupRequired: false
        };
        
        const enrichmentSummary = zillowEnrichment?.enabled 
          ? ` Enhanced with ${zillowEnrichment.imageCount || 0} Zillow images.`
          : '';
        
        const coreLogicStatus = data.essentialData?.propertyDetail 
          ? 'Found detailed property data.'
          : 'Property data limited (address verified).';
        
        const summary = `${coreLogicStatus} API cost: $${data.totalCost?.toFixed(2) || '0.00'} (${data.apiCalls?.length || 0} calls made).${enrichmentSummary}`;
        
        onResults([listing], summary);
        
        // Add success message to chat
        const successMessage = {
          role: "assistant",
          content: `✅ Enhanced analysis complete! ${enrichmentSummary}`,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      setError(`Failed to fetch enhanced data: ${error.message}`);
    } finally {
      setLoading(false);
      setPendingConfirmation(null);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setPendingConfirmation(null);
    
    // Add cancellation message to chat
    const cancelMessage = {
      role: "assistant",
      content: "Zillow enrichment cancelled. You can still search for basic property data.",
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, cancelMessage]);
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

      {/* Zillow Enrichment Toggle */}
      {searchType === "address" && (
        <div className="flex justify-center">
          <label className="flex items-center space-x-3 cursor-pointer bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
            <input
              type="checkbox"
              checked={includeZillowEnrichment}
              onChange={(e) => setIncludeZillowEnrichment(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">🖼️ Include Zillow Images</span>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                FREE
              </span>
            </div>
          </label>
        </div>
      )}

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
            className={`w-full pl-12 pr-4 sm:pr-24 py-3 sm:py-4 text-sm sm:text-base border-2 rounded-xl shadow-sm transition-all duration-200 ${
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
          {/* Search Button - Responsive sizing */}
          <button
            onClick={handleSearch}
            disabled={loading || (searchType === "address" && !validAddress)}
            className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 z-10 ${
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
      
      {/* Zillow Enrichment Confirmation Modal */}
      {showConfirmationModal && pendingConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🖼️ Enhance with Zillow Images
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-4">
                {pendingConfirmation.confirmationData.message}
              </p>
              
              {/* Benefits */}
              <div className="text-left mb-6 space-y-2">
                {pendingConfirmation.confirmationData.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* Cost Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm font-semibold text-green-800">
                    FREE Enhancement - No Additional Cost
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelConfirmation}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Skip Images
                </button>
                <button
                  onClick={handleConfirmEnrichment}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Add Images</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearch;
