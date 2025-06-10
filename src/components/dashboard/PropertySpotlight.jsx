import React from 'react';
export default function PropertySpotlight({ property }) {
  if (!property) {
    return <div className="text-sm text-gray-500">No property selected.</div>;
  }

  return (
      <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">
      <img
        src={property.image}
        alt={property.name}
        className="w-full md:w-48 h-32 object-cover rounded-lg"
      />
      <div className="flex-1 space-y-2 text-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">🏡 {property.name}</h3>
            <p className="text-gray-500">{property.location} • 3-Year Hold</p>
          </div>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Active</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <p><strong>Ownership %:</strong> {property.ownership}%</p>
          <p><strong>Invested:</strong> ${property.invested.toLocaleString()}</p>
          <p><strong>Last Payout:</strong> {property.payout} on {property.lastPayoutDate}</p>
          <p><strong>Est. ROI:</strong> {property.roi} / yr</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-2">
          <p className="text-sm text-gray-700">
            🗓️ <strong>Next Property Meeting:</strong> {property.nextMeetingDate}
          </p>
          <p className="text-sm text-gray-500">
            Participate in governance and platform decisions for this property.
          </p>
          <div className="flex gap-2 mt-2">
            <a href={`/property/${property.id}/meeting`} className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              🎥 Join Meeting
            </a>
            <a href={`/property/${property.id}/suggest`} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">
              ✍️ Submit Feedback
            </a>
          </div>
        </div>

        <a href={`/property/${property.id}`} className="inline-block mt-3 text-blue-600 hover:underline text-sm">
          🔍 View Property Details
        </a>
      </div>
    </div>
  );
}
