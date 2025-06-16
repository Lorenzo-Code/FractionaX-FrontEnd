import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import LocalListingsSection from "../components/LocalListingsSection";
import properties from "../components/mockProperties";
import SmartPropertySearch from "../components/SmartPropertySearch";
import MapWithPins from "../components/MapWithPins";


const MIN = 50000;
const MAX = 500000;

const Marketplace = () => {
  const [filters, setFilters] = useState({
    status: "",
    location: "",
    yield: "",
    sortBy: "",
    minCost: MIN,
    maxCost: MAX,
  });

  const [costRange, setCostRange] = useState([MIN, MAX]);
  const [aiListings, setAiListings] = useState([]);



  const uniqueLocations = [...new Set(properties.map((p) => p.location))];
  const uniqueStatuses = ["Available", "Limited Availability", "Fully Funded"];
  const yieldThresholds = ["6", "7", "8"];

  const parseCost = (costStr) => parseFloat(costStr.replace(/[$,]/g, ""));
  const parseYield = (yieldStr) => parseFloat(yieldStr.replace("%", ""));
  const parseDate = (phase) => {
    const match = phase.match(/Est\. Completion: (\w+ \d{4}|Q\d \d{4})/);
    if (!match) return null;
    const val = match[1];
    if (val.includes("Q")) {
      const [q, y] = val.split(" ");
      const month = { Q1: 2, Q2: 5, Q3: 8, Q4: 11 }[q];
      return new Date(`${y}-${month + 1}-01`);
    }
    return new Date(val);
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minCost: costRange[0],
      maxCost: costRange[1],
    }));
  }, [costRange]);

  const filteredProperties = properties
    .filter((p) => {
      const matchStatus = filters.status ? p.status === filters.status : true;
      const matchLocation = filters.location ? p.location === filters.location : true;
      const matchYield = filters.yield ? parseYield(p.yield) >= parseFloat(filters.yield) : true;
      const cost = parseCost(p.cost);
      const withinMin = filters.minCost ? cost >= parseFloat(filters.minCost) : true;
      const withinMax = filters.maxCost ? cost <= parseFloat(filters.maxCost) : true;
      return matchStatus && matchLocation && matchYield && withinMin && withinMax;
    })
    .sort((a, b) => {
      if (filters.sortBy === "cost") return parseCost(a.cost) - parseCost(b.cost);
      if (filters.sortBy === "yield") return parseYield(b.yield) - parseYield(a.yield);
      if (filters.sortBy === "completion") return parseDate(a.funding_phase) - parseDate(b.funding_phase);
      return 0;
    });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Explore the Marketplace
      </h1>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 text-center"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 text-center"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={filters.yield}
            onChange={(e) => setFilters({ ...filters, yield: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 text-center"
          >
            <option value="">All Yields</option>
            {yieldThresholds.map((y, i) => (
              <option key={i} value={y}>≥ {y}%</option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 text-center"
          >
            <option value="">Sort By</option>
            <option value="cost">Cost</option>
            <option value="yield">Yield</option>
            <option value="completion">Completion Date</option>
          </select>
        </div>

        {/* Cost Range Slider */}
        <div className="flex flex-col items-center w-full mb-4">
          <label className="text-sm font-medium mb-2 text-gray-700">
            Cost Range (${costRange[0].toLocaleString()} - ${costRange[1].toLocaleString()})
          </label>
          <Range
            step={5000}
            min={MIN}
            max={MAX}
            values={costRange}
            onChange={setCostRange}
            renderTrack={({ props, children }) => {
              const { key, ...rest } = props;
              return (
                <div key={key} {...rest} className="w-full h-2 bg-gray-200 rounded">
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => {
              const { key, ...rest } = props;
              return (
                <div key={key} {...rest} className="h-5 w-5 bg-blue-600 rounded-full shadow cursor-pointer" />
              );
            }}
          />
        </div>

        {/* Smart Search */}
        <SmartPropertySearch onSearch={(results) => setAiListings(results)} showSuggestions={true} />
        <div className="flex justify-center mt-2">
          <button
            onClick={() => {
              setFilters({ status: "", location: "", yield: "", sortBy: "", minCost: MIN, maxCost: MAX });
              setAiListings([]);
            }}
            className="w-full max-w-xs px-4 py-2 rounded-xl border border-gray-300 text-sm bg-gray-100 hover:bg-gray-200 transition text-center"
          >
            Clear Filters
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          {aiListings.length > 0
            ? `${aiListings.length} AI-generated result${aiListings.length !== 1 ? "s" : ""} found`
            : `${filteredProperties.length} result${filteredProperties.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      // Inside the JSX, under filters/search:
      {aiListings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Map Results</h2>
          <MapWithPins properties={aiListings} />
        </div>
      )}
      {/* Listings */}
      <LocalListingsSection listings={aiListings.length > 0 ? aiListings : filteredProperties} />
    </section>
  );
};

export default Marketplace;
