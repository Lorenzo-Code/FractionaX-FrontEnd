// src/components/PropertySearch.js
import React, { useState } from "react";

const aiSuggestions = [
  "Downtown condos under $150K",
  "High-yield rentals in Houston",
  "Low-risk REITs for first-time investors",
  "Properties near universities",
  "Vacation homes with 8%+ return",
];

const PropertySearch = () => {
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
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
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
      setAiResult(data.choices?.[0]?.message?.content || "No response received.");
    } catch (err) {
      setAiResult("An error occurred. Please try again later.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    handleSearch();
  };

  return (
    <section className="bg-white py-12 px-6 border-t">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#1B2A41]">
          Find Your Next Investment
        </h2>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., beachfront, Texas, under $500k"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={!query || loading}
            className="px-6 py-3 bg-[#3E92CC] text-white rounded-xl hover:bg-[#2C699A] transition"
          >
            {loading ? "Searching..." : "Search with AI"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 mb-2">Try these:</p>
          <div className="flex flex-wrap justify-center gap-2">
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
        </div>

        {aiResult && (
          <div className="mt-8 max-w-2xl mx-auto bg-blue-50 text-left text-gray-800 p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2 text-blue-700">AI Suggestion:</h3>
            <p className="whitespace-pre-line">{aiResult}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertySearch;
