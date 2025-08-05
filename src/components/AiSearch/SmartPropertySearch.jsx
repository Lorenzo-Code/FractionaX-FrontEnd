import React, { useState, useRef, useEffect } from "react";
import { smartFetch } from '../shared/utils';

const getQuickExamples = () => [
  "I want a fixer-upper with renovation potential under $150K",
  "Find me a waterfront property with boat access and great views",
  "I need a downtown condo within walking distance of restaurants and nightlife",
  "Show me eco-friendly homes with solar panels and sustainable features"
];

const SmartPropertySearch = ({
  showInput = true,
  showSuggestions = false,
  onSearch,
  onClear,
  chatMessages = [],
  setChatMessages = () => { },
  userCity = null,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setHasSearched(true);

      const newUserMessage = { role: "user", content: searchQuery, timestamp: new Date() };
      const updatedChat = [...chatMessages, newUserMessage];
      setChatMessages(updatedChat);

      // Clear input immediately
      setQuery("");

      const payload = {
        prompt: searchQuery,
        chat_history: updatedChat,
        limit: 30,
      };

      const aiEndpoint = "/api/ai/search"; // Switch to "/api/ai/pipeline" if needed
      const res = await smartFetch(aiEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res || !res.ok) {
        throw new Error(`API Error ${res?.status || "Unknown"}: ${res?.statusText || "Unknown error"}`);
      }

      const data = await res.json();
      console.log('AI Search Response:', data);
      
      // Handle different response structures
      let listings = [];
      let summary = "Here are your results.";
      
      if (aiEndpoint === "/api/ai/search") {
        // AI Search endpoint response structure
        listings = data.listings || [];
        summary = data.ai_summary || "Here are your results.";
      } else if (aiEndpoint === "/api/ai/pipeline") {
        // Pipeline endpoint response structure
        listings = data.property_data || [];
        summary = data.summary || "Here are your results.";
      }

      const aiMessage = { role: "ai", content: summary, timestamp: new Date() };
      setChatMessages([...updatedChat, aiMessage]);

      if (onSearch) onSearch(listings, summary);
    } catch (error) {
      console.error("❌ AI Search Error:", error);
      const errorMessage = {
        role: "ai",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (text) => {
    handleSearch(text);
  };

  const handleClearChat = async () => {
    setChatMessages([]);
    setQuery("");
    setHasSearched(false);
    // Call API to reset chat history
    try {
      await smartFetch("/api/ai/pipeline/reset", {
        method: "POST",
      });
    } catch (error) {
      console.error("❌ Error resetting chat:", error);
    }
  };

  const generateFollowUps = (aiContent) => {
    const followUps = [];
    if (aiContent.toLowerCase().includes('property') || aiContent.toLowerCase().includes('home')) {
      followUps.push("Show me similar properties nearby");
    }
    if (aiContent.toLowerCase().includes('price') || aiContent.toLowerCase().includes('$')) {
      followUps.push("What about cheaper options?");
    }
    if (aiContent.toLowerCase().includes('yield') || aiContent.toLowerCase().includes('%')) {
      followUps.push("Tell me about rental estimates");
    }

    // Default follow-ups if none match
    if (followUps.length === 0) {
      followUps.push("Show luxury options", "Find investment properties", "What about condos?");
    }

    return followUps.slice(0, 3); // Limit to 3
  };

  const highlightKeywords = (text) => {
  const keywords = ["property", "home", "price", "yield", "investment"];
  let highlighted = text;

  keywords.forEach((word) => {
    const regex = new RegExp(`\\b(${word})\\b`, "gi");
    highlighted = highlighted.replace(
      regex,
      `<mark class="bg-yellow-200 font-semibold">${word}</mark>`
    );
  });

  return highlighted;
};


  return (
    <div className="flex flex-col w-full relative max-w-4xl mx-auto">
      {/* Chat Messages Area */}
      {chatMessages.length > 0 && (
        <div className="bg-white border-2 border-blue-200 rounded-lg mb-4 max-h-96 overflow-y-auto">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-blue-100 bg-blue-50/50">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">🤖 AI Assistant</span>
            </div>
            <button
              onClick={handleClearChat}
              className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition"
              title="Clear conversation"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-100 text-gray-800 mr-auto"
                  }`}>
                  {msg.role === "user" ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: highlightKeywords(msg.content) }}
                    />
                  )}
                  {msg.timestamp && (
                    <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg mr-auto max-w-xs">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up Suggestions */}
            {!loading && chatMessages.length > 0 && chatMessages[chatMessages.length - 1]?.role === "ai" && (
              <div className="flex flex-wrap gap-2 mt-3">
                {generateFollowUps(chatMessages[chatMessages.length - 1].content).map((followUp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(followUp)}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition border border-blue-200"
                  >
                    {followUp}
                  </button>
                ))}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Search Input - Maintains Original Styling */}
      {showInput && (
        <div className="w-full relative">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder={chatMessages.length > 0 ? "Continue the conversation..." : "Describe your ideal property..."}
              className="w-full pl-10 pr-32 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-blue-50/50"
              disabled={loading}
            />
            <button
              onClick={() => handleSearch()}
              disabled={!query || loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  Sending
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Initial Suggestions - Only show when no chat history */}
      {showSuggestions && chatMessages.length === 0 && (
        <div className="mt-6">
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 text-center">More examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {getQuickExamples().slice(0, 2).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(example)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-xs transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SmartPropertySearch;
