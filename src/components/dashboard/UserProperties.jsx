// UserProperties.jsx
import React, { useState } from 'react';
import PropertySpotlight from './PropertySpotlight';
import InvestmentTimeline from './InvestmentTimeline';

export default function UserProperties({ properties }) {
  const [selectedId, setSelectedId] = useState(properties[0]?.id);
  const selected = properties.find((p) => p.id === selectedId);

  if (!properties || properties.length === 0) {
    return <div>No properties available.</div>;
  }

  return (
      <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4">
        <InvestmentTimeline currentStage={selected.stage} />
        {properties.map((p) => (
          <button
            key={p.id}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedId === p.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setSelectedId(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <PropertySpotlight property={selected} />
    </div>
  );
}
