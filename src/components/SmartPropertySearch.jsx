import React, { useState } from "react";
import { smartPropertySearch } from "../utils/api"; // backend API call

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
  const [attomData, setAttomData] = useState(null);
  const [page, setPage] = useState(1);
  const [aiFilters, setAiFilters] = useState({});
  const [aiSummary, setAiSummary] = useState("");
  const [schools, setSchools] = useState([]); // 👈 Add this line


  const RESULTS_PER_PAGE = 12;
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginated = results.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  const fetchSchoolData = async (lat, lon) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/schools?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setSchools(data.schools || []);
    } catch (err) {
      console.error("❌ School API failed:", err);
    }
  };



  const handleSearch = async (customQuery) => {
  const searchQuery = customQuery || query;
  if (!searchQuery) return;

  setLoading(true);
  setPage(1);
  setResults([]);
  setAttomData(null);

  try {
    const data = await smartPropertySearch(searchQuery);

    const listings =
      data?.listings?.props ||
      data?.listings?.results ||
      data?.listings?.items ||
      [];

    const priceCap = Number(data?.filters?.max_price) || 99999999;
    const validatedListings = listings.filter(
      (item) => Number(item.price) > 0 && Number(item.price) <= priceCap
    );

    setResults(validatedListings);
    setAiFilters(data?.filters || {});
    setAiSummary(data?.ai_summary || "");

    const attomRaw = data?.attom_data?.property?.[0];
    if (attomRaw) {
      setAttomData({
        yearBuilt: attomRaw.yearbuilt,
        lotSize: attomRaw.lotsize?.size,
        roofType: attomRaw.roofcover,
        stories: attomRaw.stories,
        cooling: attomRaw.coolingtype,
        heating: attomRaw.heatingtype,
      });
    }

    if (onSearch) onSearch(data);
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
        {aiSummary && (
          <div className="bg-blue-50 p-4 rounded mb-4">
            <h4 className="text-blue-800 font-semibold mb-2">💡 AI Insight</h4>
            <p className="text-blue-800 text-sm">{aiSummary}</p>
          </div>
        )}

        {schools.length > 0 && (
          <div className="mt-4">
            <h3 className="text-blue-800 font-semibold">Nearby Schools</h3>
            <ul className="text-sm text-gray-700 space-y-1 mt-2">
              {schools.map((s, i) => (
                <li key={i}>
                  🏫 <strong>{s.name}</strong> — {s.gradeRange}, Rating: {s.gsRating || "N/A"}
                </li>
              ))}
            </ul>
          </div>
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
                    {property.fullAddress|| "Address Not Available"}
                  </h3>

                  <p className="text-sm text-gray-600">
                    ${property.price?.toLocaleString() || "N/A"} • {property.bedrooms || "?"} beds •{" "}
                    {property.bathrooms || "?"} baths
                  </p>

                  {/* Enriched Data (only once for now) */}
                  {i === 0 && attomData && (
                    <div className="mt-3 pt-2 text-sm text-gray-700 border-t">
                      <h4 className="font-semibold text-sm mb-1">🧠 Enriched Property Info</h4>
                      <p><strong>Year Built:</strong> {attomData.yearBuilt || "N/A"}</p>
                      <p><strong>Lot Size:</strong> {attomData.lotSize || "N/A"} sq ft</p>
                      <p><strong>Roof Type:</strong> {attomData.roofType || "N/A"}</p>
                      <p><strong>Stories:</strong> {attomData.stories || "N/A"}</p>
                      <p><strong>Cooling:</strong> {attomData.cooling || "N/A"}</p>
                      <p><strong>Heating:</strong> {attomData.heating || "N/A"}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
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
                setAttomData(null);
                if (onClear) onClear();
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
