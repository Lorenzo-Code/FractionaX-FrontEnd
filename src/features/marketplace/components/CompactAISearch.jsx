import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, 
  FiMic, 
  FiMicOff, 
  FiSearch,
  FiX,
  FiMessageCircle,
  FiRefreshCw,
  FiTrash2
} from 'react-icons/fi';
import { BsRobot, BsStars } from 'react-icons/bs';
import { HiOutlineSparkles } from 'react-icons/hi';
import { smartFetch } from '../../../shared/utils';
import { toast } from 'react-toastify';

const CompactAISearch = ({
  onResults,
  onConversationUpdate,
  className = "",
  placeholder = "Search properties or chat with our AI assistant..."
}) => {
  // State management
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showConversation, setShowConversation] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  // Refs
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Quick suggestions for first-time users
  const quickSuggestions = [
    "Find properties under $500K with good ROI",
    "Show me tokenized investment opportunities",
    "What are the best investment areas in Houston?",
    "Properties with high rental yield potential"
  ];

  // Conversation cache key
  const CONVERSATION_CACHE_KEY = 'fractionax_ai_conversation';
  
  // Cache management functions
  const saveConversationToCache = async (conversation) => {
    try {
      // Save to localStorage for immediate persistence
      localStorage.setItem(CONVERSATION_CACHE_KEY, JSON.stringify({
        conversation: conversation,
        timestamp: Date.now(),
        version: '1.0'
      }));
      
      // Optionally save to backend Redis cache if API exists
      try {
        await smartFetch('/api/ai/conversation/save', {
          method: 'POST',
          body: JSON.stringify({ 
            conversation: conversation,
            timestamp: Date.now()
          })
        });
        console.log('💾 Conversation saved to backend cache');
      } catch (backendError) {
        // Backend cache is optional - don't throw if it fails
        console.log('ℹ️ Backend cache unavailable, using localStorage only');
      }
      
    } catch (error) {
      console.error('❌ Failed to save conversation:', error);
    }
  };
  
  const loadConversationFromCache = async () => {
    setIsLoadingConversation(true);
    try {
      // First try to load from backend Redis if available
      try {
        const response = await smartFetch('/api/ai/conversation/load', {
          method: 'GET'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.conversation && Array.isArray(data.conversation) && data.conversation.length > 0) {
            console.log('📥 Loaded conversation from backend cache:', data.conversation.length, 'messages');
            return data.conversation.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp) // Ensure timestamp is a Date object
            }));
          }
        }
      } catch (backendError) {
        console.log('ℹ️ Backend cache unavailable, trying localStorage');
      }
      
      // Fallback to localStorage
      const cached = localStorage.getItem(CONVERSATION_CACHE_KEY);
      if (cached) {
        const { conversation, timestamp, version } = JSON.parse(cached);
        
        // Check if cache is not too old (7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        if (Date.now() - timestamp < maxAge && Array.isArray(conversation) && conversation.length > 0) {
          console.log('📥 Loaded conversation from localStorage:', conversation.length, 'messages');
          return conversation.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp) // Ensure timestamp is a Date object
          }));
        } else {
          console.log('🗑️ Conversation cache expired or invalid, clearing');
          localStorage.removeItem(CONVERSATION_CACHE_KEY);
        }
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to load conversation:', error);
      return [];
    } finally {
      setIsLoadingConversation(false);
    }
  };
  
  const clearConversationCache = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem(CONVERSATION_CACHE_KEY);
      
      // Clear backend cache if available
      try {
        await smartFetch('/api/ai/conversation/clear', {
          method: 'DELETE'
        });
        console.log('🗑️ Conversation cleared from backend cache');
      } catch (backendError) {
        console.log('ℹ️ Backend cache unavailable for clearing');
      }
      
      console.log('🗑️ Conversation cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear conversation cache:', error);
    }
  };
  
  // Handle conversation reset
  const handleResetConversation = async () => {
    try {
      await clearConversationCache();
      setConversationHistory([]);
      setShowConversation(false);
      toast.success('🔄 Conversation reset successfully!', {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('❌ Failed to reset conversation:', error);
      toast.error('Failed to reset conversation. Please try again.');
    }
  };

  // Load conversation from cache on component mount
  useEffect(() => {
    const initializeConversation = async () => {
      const cachedConversation = await loadConversationFromCache();
      if (cachedConversation.length > 0) {
        setConversationHistory(cachedConversation);
        console.log('✅ Conversation restored from cache');
        toast.success('💬 Previous conversation restored!', {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    };
    
    initializeConversation();
  }, []);
  
  // Auto-save conversation whenever it updates
  useEffect(() => {
    if (conversationHistory.length > 0) {
      saveConversationToCache(conversationHistory);
    }
  }, [conversationHistory]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        // Auto-submit voice queries
        setTimeout(() => handleSearch(transcript), 100);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Handle search submission
  const handleSearch = async (query = inputValue) => {
    if (!query.trim()) return;
    
    const searchQuery = query.trim();
    setIsLoading(true);
    
    // Add to recent queries
    setRecentQueries(prev => {
      const updated = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
      return updated;
    });
    
    // Show immediate loading feedback based on query type
    const isInformationalQuery = searchQuery.toLowerCase().match(
      /\b(what|how|why|where|when|which|best|top|recommend|advice|explain|tell me|analyze|compare|versus|vs)\b/
    );
    
    if (isInformationalQuery) {
      toast.info('🧠 Analyzing your question... This may take a few seconds.', {
        position: "bottom-right",
        autoClose: 8000,
        toastId: 'ai-loading' // Prevent duplicate toasts
      });
    } else {
      toast.info('🔍 Searching for properties... Please wait.', {
        position: "bottom-right",
        autoClose: 5000,
        toastId: 'ai-loading'
      });
    }
    
    try {
      console.log('🔍 Compact AI Search:', searchQuery);
      
      // Determine if this is an informational question or property search request
      
      let response;
      
      if (isInformationalQuery) {
        // Use the smart-search endpoint for informational queries
        console.log('🤔 Detected informational query, using smart-search endpoint');
        response = await smartFetch('/api/ai/smart-search', {
          method: 'POST',
          body: JSON.stringify({
            query: searchQuery
          })
        });
      } else {
        // Use marketplace endpoint for property search requests
        console.log('🏠 Detected property search request, using marketplace endpoint');
        response = await smartFetch('/api/ai/marketplace', {
          method: 'POST',
          body: JSON.stringify({
            query: searchQuery,
            location: "Houston, TX", // Default location - could be extracted from query later
            maxPrice: 800000,
            minPrice: 100000,
            limit: 8,
            analysis_type: "investment_focus",
            skip_ai_analysis: true // Use fast path for quick results
          })
        });
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🤖 AI Search Results:', data);
      
      // Add to conversation history
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: searchQuery,
        timestamp: new Date()
      };
      
      let properties = [];
      let aiResponse = "";
      
      if (isInformationalQuery) {
        // Handle smart-search API response format
        aiResponse = data.response || data.answer || "I can help you with investment insights!";
        properties = data.properties || data.listings || [];
        
        // For informational queries, show the AI's analytical response prominently
        console.log('💡 Informational response:', aiResponse);
      } else {
        // Handle marketplace API response format
        properties = data.listings || [];
        aiResponse = data.ai_summary || "I found some great tokenized investment opportunities for you!";
        
        console.log('🏘️ Property search response:', properties.length, 'properties found');
      }
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        properties: properties,
        isInformational: isInformationalQuery
      };
      
      setConversationHistory(prev => [...prev, userMessage, aiMessage]);
      
      // For informational queries, immediately show conversation to display the analysis
      if (isInformationalQuery) {
        setShowConversation(true);
        // Scroll to the conversation after a brief delay
        setTimeout(() => {
          const conversationElement = document.querySelector('[data-conversation-history]');
          if (conversationElement) {
            conversationElement.scrollTop = conversationElement.scrollHeight;
          }
        }, 100);
      } else {
        setShowConversation(true);
      }
      
      // Handle results based on query type
      if (isInformationalQuery) {
        // For informational queries, show a brief success message, not the full response
        const summaryText = aiResponse.length > 100 
          ? `${aiResponse.substring(0, 100)}...` 
          : aiResponse;
          
        toast.success('🎯 Investment analysis completed! Check the conversation below.', {
          position: "bottom-right",
          autoClose: 4000,
        });
        
        // If there are also properties, show them as supplementary results
        if (properties && properties.length > 0 && onResults) {
          onResults(properties, 'ai-informational', aiResponse);
        }
      } else {
        // For property searches, prioritize showing the properties
        if (properties && properties.length > 0) {
          // Notify parent component with results
          if (onResults) {
            onResults(properties, 'ai-search', aiResponse);
          }
          
          toast.success(`Found ${properties.length} tokenized properties matching your search!`, {
            position: "bottom-right",
            autoClose: 3000,
          });
        } else {
          toast.info(aiResponse || "No tokenized properties found matching your criteria. Try refining your search.", {
            position: "bottom-right",
            autoClose: 4000,
          });
        }
      }
      
      // Update conversation if callback provided
      if (onConversationUpdate) {
        onConversationUpdate([userMessage, aiMessage]);
      }
      
    } catch (error) {
      console.error('❌ AI Search Error:', error);
      
      // Fallback to basic search
      if (onResults) {
        onResults(searchQuery, 'internal', null);
      }
      
      toast.error('AI search temporarily unavailable. Switched to basic search.', {
        position: "bottom-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  // Handle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.warn('Voice input not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (conversationHistory.length > 0) {
      setShowConversation(true);
    } else {
      setShowSuggestions(true);
    }
  };

  // Handle input blur (with delay to allow clicking suggestions)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShowConversation(false);
    }, 200);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setTimeout(() => handleSearch(suggestion), 100);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <div className="relative">
            <BsRobot className="w-4 h-4 text-blue-600" />
            <HiOutlineSparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-500" />
          </div>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm placeholder-gray-500"
        />
        
        {/* Right Side Controls */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Voice Input Button */}
          {recognitionRef.current && (
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-1.5 rounded-full transition-colors ${
                isListening 
                  ? 'text-red-500 hover:text-red-600 bg-red-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? (
                <div className="flex items-center">
                  <FiMicOff className="w-4 h-4" />
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse ml-1"></div>
                </div>
              ) : (
                <FiMic className="w-4 h-4" />
              )}
            </button>
          )}
          
          {/* Search/Send Button */}
          <button
            onClick={() => handleSearch()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white p-1.5 rounded-full transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {/* Recent Queries */}
            {recentQueries.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <FiMessageCircle className="w-3 h-3 mr-1" />
                  Recent Searches
                </h4>
                {recentQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(query)}
                    className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}
            
            {/* Quick Suggestions */}
            <div className="p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                <BsStars className="w-3 h-3 mr-1" />
                Try asking me:
              </h4>
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left px-2 py-1.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            {/* AI Powered Notice */}
            <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
              <p className="text-xs text-center text-gray-600 flex items-center justify-center">
                <BsRobot className="w-3 h-3 mr-1 text-blue-600" />
                Powered by ChatGPT • Natural language search
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation History Dropdown */}
      <AnimatePresence>
        {showConversation && conversationHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center">
                  <FiMessageCircle className="w-3 h-3 mr-1" />
                  Conversation History
                  {conversationHistory.length > 0 && (
                    <span className="ml-1 text-gray-500">({conversationHistory.length})</span>
                  )}
                </h4>
                <div className="flex items-center space-x-1">
                  {/* Reset Conversation Button */}
                  <button
                    onClick={handleResetConversation}
                    className="text-red-400 hover:text-red-600 p-1 rounded transition-colors hover:bg-red-50"
                    title="Reset conversation and clear cache"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={() => setShowConversation(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors hover:bg-gray-100"
                    title="Close conversation"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Conversation Messages */}
            <div className="p-3 space-y-3 max-h-64 overflow-y-auto" data-conversation-history>
              {conversationHistory.map((message) => (
                <ConversationMessage 
                  key={message.id} 
                  message={message} 
                  onPropertySelect={onResults}
                />
              ))}
            </div>
            
            {/* Continue Conversation Notice */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500">
                Type another message to continue the conversation
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Conversation Message Component
const ConversationMessage = ({ message, onPropertySelect }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div className={`px-3 py-2 rounded-lg text-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : message.isInformational
              ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-900 rounded-tl-sm border border-purple-200'
              : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {/* AI Response Type Indicator */}
          {!isUser && message.isInformational && (
            <div className="flex items-center mb-2 text-xs text-purple-600 font-medium">
              <HiOutlineSparkles className="w-3 h-3 mr-1" />
              Investment Analysis
            </div>
          )}
          
          <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
          
          {/* Property Results Preview */}
          {message.properties && message.properties.length > 0 && (
            <div className={`mt-2 pt-2 ${
              message.isInformational 
                ? 'border-t border-purple-200' 
                : 'border-t border-gray-200'
            }`}>
              <p className="text-xs opacity-75 mb-1">
                {message.isInformational 
                  ? `Related properties (${message.properties.length})` 
                  : `Found ${message.properties.length} properties`
                }
              </p>
              <button
                onClick={() => onPropertySelect && onPropertySelect(
                  message.properties, 
                  message.isInformational ? 'ai-informational' : 'ai-search', 
                  message.content
                )}
                className="text-xs underline opacity-90 hover:opacity-100 transition-opacity"
              >
                View properties →
              </button>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Avatar */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
        isUser 
          ? 'bg-blue-600 text-white order-1 mr-2' 
          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white order-2 ml-2'
      }`}>
        {isUser ? '👤' : '🤖'}
      </div>
    </div>
  );
};

export default CompactAISearch;
