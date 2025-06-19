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

  const handleSearch = async () => {
    try {
      setLoading(true);
      const aiResponse = await axios.post("http://localhost:5000/api/ai-pipeline", {
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
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
      {showInput && (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties (e.g., 2BR in Atlanta under $300k)"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            onClick={handleSearch}
            disabled={!query || loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Search with AI"}
          </button>
        </>
      )}

      {showSuggestions && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
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
