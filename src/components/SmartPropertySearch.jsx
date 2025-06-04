// src/components/SmartPropertySearch.jsx
import React, { useState } from "react";

const aiSuggestions = [
  "Downtown condos under $150K",
  "High-yield rentals in Houston",
  "Low-risk REITs for first-time investors",
  "Properties near universities",
  "Vacation homes with 8%+ return",
];

const SmartPropertySearch = ({ showSuggestions = false, onSearch }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setAiResult("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert real estate investment assistant. Help users identify promising property searches.",
            },
            {
              role: "user",
              content: `Find investment properties based on: ${query}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "No results.";
      setAiResult(result);
      if (onSearch) onSearch(result);
    } catch (err) {
      console.error(err);
      setAiResult("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    handleSearch();
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
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
        </div>

        {showSuggestions && (
          <>
            <p className="text-gray-500 text-center mb-2">Try these:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
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
          </>
        )}

        {aiResult && (
          <div className="mt-4 bg-blue-50 text-gray-800 p-4 rounded-xl shadow max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-700 mb-2">AI Suggestion:</h3>
            <p className="whitespace-pre-line">{aiResult}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SmartPropertySearch;
