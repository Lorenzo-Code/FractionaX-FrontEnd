import React from 'react';

const stageColors = {
  "Raising Funds": "bg-yellow-200 text-yellow-800",
  "Fully Funded": "bg-green-200 text-green-800",
  "Sold": "bg-gray-300 text-gray-700"
};

export default function PropertyTimeline({ properties }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">📅 Liked Property Progress Tracker</h2>
      <div className="space-y-6 border-l-2 border-gray-200 pl-4">

        {properties.map((property, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[0.45rem] top-1 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white shadow" />

            <div className="ml-4">
              <h3 className="font-semibold text-lg text-gray-800">{property.name}</h3>
              <p className="text-sm text-gray-500">{property.location}</p>

              <div className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${stageColors[property.stage]}`}>
                {property.stage}
              </div>

              <div className="text-xs text-gray-400 mt-1">Last updated: {property.updated}</div>

              <div className="mt-2">
                <a href={`/property/${property.id}`} className="text-blue-600 text-sm hover:underline">
                  🔍 View Details
                </a>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
