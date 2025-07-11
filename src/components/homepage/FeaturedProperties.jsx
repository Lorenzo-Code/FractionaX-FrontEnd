// src/components/FeaturedProperties.js
import React from "react";
import { FaFire, FaChartLine } from "react-icons/fa";

const mockProperties = [
  {
    id: "HOU123",
    name: "Bayou Villas",
    location: "Houston, TX",
    yield: "8.25%",
    viewsToday: 138,
    pricePerToken: "$1.00",
    totalCost: 175000,
    status: "Open",
    image: "/images/prop-hou123.jpg",
    aiInsight: "High rental demand + 12% YoY appreciation",
    fundingPercent: 63,
  },
  {
    id: "DAL456",
    name: "Maple Townhomes",
    location: "Dallas, TX",
    yield: "7.85%",
    viewsToday: 112,
    pricePerToken: "$1.00",
    totalCost: 240000,
    status: "Open",
    image: "/images/prop-dal456.jpg",
    aiInsight: "New highway project boosting area value",
    fundingPercent: 92,
  },
  {
    id: "ATX789",
    name: "Barton Ridge",
    location: "Austin, TX",
    yield: "8.90%",
    viewsToday: 95,
    pricePerToken: "$1.00",
    totalCost: 305000,
    status: "Coming Soon",
    image: "/images/prop-atx789.jpg",
    aiInsight: "Strong tech renter growth in 78704",
    fundingPercent: 0,
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-center mb-8"> Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockProperties.map((prop) => (
          <div key={prop.id} className="p-4 bg-gray-100 rounded-xl shadow hover:shadow-lg transition">
            <div
              className="h-40 bg-cover bg-center rounded mb-4"
              style={{ backgroundImage: `url(${prop.image})` }}
            />
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">{prop.name}</h3>
              <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded-full">{prop.status}</span>
            </div>
            <p className="text-sm text-gray-500">{prop.location}</p>
            
            <div className="text-sm text-gray-700 mt-3 mb-1">
              <span className="font-medium">Yield:</span> {prop.yield} APR<br />
              <span className="font-medium">Token:</span> {prop.pricePerToken}<br />
              <span className="font-medium">Total Cost:</span> ${prop.totalCost.toLocaleString()}<br />
              <span className="font-medium">Views Today:</span> {prop.viewsToday}
            </div>

            <div className="text-xs text-blue-600 mt-2 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              <span>{prop.aiInsight}</span>
            </div>

            {/* Funding Progress Bar */}
            {prop.status === "Open" && (
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-1">Funding Progress</p>
                <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${prop.fundingPercent}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-right text-gray-700 font-semibold">
                  {prop.fundingPercent}% Funded
                </p>
              </div>
            )}

            <button className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              View Property
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProperties;
