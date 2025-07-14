import React, { useState } from "react";
import axios from "axios";

const aiSuggestions = [
  "Downtown condos under $150K",
  "High-yield rentals in Houston",
  "Low-risk REITs for first-time investors",
  "Properties near universities",
  "Vacation homes with 8%+ return",
];

const SmartPropertySearch = ({
  showInput = true,
  showSuggestions = false,
  onSearch,
  onClear,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "https://api.fractionax.io";

const handleSearch = async () => {
  try {
    setLoading(true);
    const aiResponse = await axios.post(`${API_BASE_URL}/api/ai-pipeline`, {
      prompt: query,
    });

    const listings = aiResponse.data.property_data || [];
    const summary = aiResponse.data.summary || "";

    setAiSummary(summary);
    if (onSearch) onSearch(listings, summary);
  } catch (error) {
    console.error("❌ AI Search Error:", error);
  } finally {
    setLoading(false);
  }
};


  const handleSuggestionClick = (text) => {
    setQuery(text);
    handleSearch();
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
  {showInput && (
  <div className="w-full max-w-3xl relative">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="e.g., 2BR duplex in Atlanta under $300K"
      className="w-full px-6 py-4 pr-36 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-base"
    />
    <button
      onClick={handleSearch}
      disabled={!query || loading}
      className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium"
    >
      {loading ? "Searching..." : "Search with AI"}
    </button>
  </div>
)}

  {showSuggestions && (
    <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-3xl">
      {aiSuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-full transition"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )}
</div>

  );
};

export default SmartPropertySearch;
