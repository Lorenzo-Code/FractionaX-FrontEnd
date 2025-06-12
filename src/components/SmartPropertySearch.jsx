import React, { useState } from "react";

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
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const RESULTS_PER_PAGE = 12;
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginated = results.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  const handleSearch = async (customQuery) => {
  const searchQuery = customQuery || query;
  if (!searchQuery) return;

  setLoading(true);
  setPage(1); // reset to first page
  setResults([]);

  try {
    const API_URL = process.env.REACT_APP_API_URL;

    const response = await fetch(`${API_URL}/api/ai-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery }),
    });

    const data = await response.json();
    const listings =
      data?.listings?.props ||
      data?.listings?.results ||
      data?.listings?.items ||
      [];

    setResults(listings);
  } catch (err) {
    console.error("❌ AI search failed:", err);
  }

  setLoading(false);
};


  const handleSuggestionClick = (text) => {
    setQuery(text);
    handleSearch(text);
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {showInput && (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties (e.g., 2BR in Atlanta under $300k)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              onClick={() => handleSearch()}
              disabled={!query || loading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              {loading ? "Searching..." : "Search with AI"}
            </button>
          </div>
        )}

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

        {paginated.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {paginated.map((property, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50"
                >
                  <img
                    src={property.imgSrc || property.carouselPhotos?.[0]}
                    alt="Property"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-lg">
                    {property.address?.streetAddress || "No Address"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ${property.price || "N/A"} • {property.bedrooms || "?"} beds •{" "}
                    {property.bathrooms || "?"} baths
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
        {results.length > 0 && (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => {
        setResults([]);
        setQuery("");
        if (onClear) onClear(); // Notify parent
      }}
      className="px-4 py-2 text-sm text-red-500 border border-red-300 rounded hover:bg-red-50"
    >
      Clear AI Search
    </button>
  </div>
)}

      </div>
    </section>
  );
};

export default SmartPropertySearch;
