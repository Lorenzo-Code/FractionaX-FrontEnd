import React from 'react';
import EnrichedPropertyCard from './EnrichedPropertyCard';

const EnrichedResultsGrid = ({ results, onFocus }) => {
  return (
    <div className="space-y-4">
      {results.map((property, idx) => (
        <div key={idx}>
          {/* 🆔 Numbered Label */}
          <div className="text-xs text-gray-500 font-semibold mb-1 px-1">
            #{idx + 1}
          </div>

          {/* 📦 Property Card */}
          <EnrichedPropertyCard
            property={property}
            compact
            onClick={() => onFocus(property)}
          />

          {/* 🔽 Divider (not after last) */}
          {idx !== results.length - 1 && (
            <hr className="my-2 border-t border-gray-300/50" />
          )}
        </div>
      ))}
    </div>
  );
};

export default EnrichedResultsGrid;
