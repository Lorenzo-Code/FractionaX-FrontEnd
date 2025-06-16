import React, { useState } from "react";
import { smartPropertySearch } from "../utils/api"; // backend API call
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
  const [results, setResults] = useState([]);
  const [attomData, setAttomData] = useState([]);
  const [page, setPage] = useState(1);
  const [aiFilters, setAiFilters] = useState({});
  const [aiSummary, setAiSummary] = useState("");
  const [schools, setSchools] = useState([]);

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

  const handleSearch = async () => {
    try {
      setLoading(true);

      const aiResponse = await axios.post("http://localhost:5000/api/ai-pipeline", {
        prompt: query,
      });

      console.log("✅ Response Status:", aiResponse.status);
      console.log("✅ Response Headers:", aiResponse.headers);
      console.log("🧪 Response Keys:", Object.keys(aiResponse.data));

      // Fix the keys below based on actual response structure
      const aiData = aiResponse.data.parsed_intent || {};
      const listings = aiResponse.data.property_data || [];

      console.log("🧠 Parsed AI Intent:", aiData);
      console.log("🏘️ Raw Listings Array:", listings);
      console.log("🔢 Total Listings Returned:", listings.length);

      if (!listings.length) {
        console.warn(" ⚠️ No listings found — using fallback.");
        setAttomData([
          {
            address: {
              line1: "1234 Fallback St",
              city: "Houston",
              state: "TX",
              postal1: "77002",
            },
            summary: {
              propertyType: "Fallback Condo",
              yearbuilt: 1990,
            },
            building: {
              size: { universalsize: 1234 },
              rooms: { beds: 2, bathstotal: 2 },
            },
          },
        ]);
      } else {
        setAttomData(listings); // ✅ Fix: Set actual results
      }

      setAiFilters(aiData);
      setAiSummary(aiResponse.data.summary || "");
      setPage(1);
    } catch (error) {
      console.error("❌ AI Search Error:", error);
    } finally {
      setLoading(false);
      console.log("✅ Search Complete. Loading state:", false);
    }
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
        {/* 💠 Render Listings */}
        {attomData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {attomData.map((listing, index) => (
              <div key={index} className="border p-4 rounded-xl shadow-sm bg-white">
                <h2 className="text-lg font-semibold">
                  {listing.address?.oneLine || "Unnamed Property"}
                </h2>
                <p className="text-sm text-gray-600">{listing.summary?.propertyType}</p>
                <p className="text-sm">
                  🛏 {listing.building?.rooms?.beds || 0} beds / 🛁 {listing.building?.rooms?.bathstotal || 0} baths
                </p>
                <p className="text-sm">📐 {listing.building?.size?.universalsize || 0} sq ft</p>
                <p className="text-xs text-gray-400">🗓 Built: {listing.summary?.yearbuilt || "N/A"}</p>
              </div>
            ))}
          </div>

        ) : (
          <p className="text-sm text-red-500 mt-4">No listings found.</p>
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
                    src={property.image || property.imgSrc || property.carouselPhotos?.[0]}
                    alt="Property"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  {property.image && (
                    <p className="text-xs text-right text-gray-400 italic">Image via Zillow</p>
                  )}

                  <h3 className="font-semibold text-lg">
                    {property.fullAddress || "Address Not Available"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ${property.price?.toLocaleString() || "N/A"} • {property.bedrooms || "?"} beds •{" "}
                    {property.bathrooms || "?"} baths
                  </p>
                  {property.enriched && (
                    <div className="mt-3 pt-2 text-sm text-gray-700 border-t">
                      <h4 className="font-semibold text-sm mb-1">🧠 Enriched Property Info</h4>
                      <p><strong>Year Built:</strong> {property.enriched.yearBuilt || "N/A"}</p>
                      <p><strong>Lot Size:</strong> {property.enriched.lotSize || "N/A"} sq ft</p>
                      <p><strong>Roof Type:</strong> {property.enriched.roofType || "N/A"}</p>
                      <p><strong>Stories:</strong> {property.enriched.stories || "N/A"}</p>
                      <p><strong>Cooling:</strong> {property.enriched.cooling || "N/A"}</p>
                      <p><strong>Heating:</strong> {property.enriched.heating || "N/A"}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

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
