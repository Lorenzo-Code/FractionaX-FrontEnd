import React from 'react';
import EnrichedPropertyCard from './EnrichedPropertyCard';

const EnrichedResultsGrid = ({ results, onFocus, compact = false }) => {
  console.log('EnrichedResultsGrid - Received results:', results);
  console.log('EnrichedResultsGrid - Results length:', results?.length || 0);
  console.log('EnrichedResultsGrid - Compact mode:', compact);
  
  if (!results || !Array.isArray(results)) {
    console.log('EnrichedResultsGrid - No valid results array received');
    return <div className="p-4 text-gray-500">No results to display</div>;
  }
  
  if (results.length === 0) {
    console.log('EnrichedResultsGrid - Results array is empty');
    return <div className="p-4 text-gray-500">No properties found</div>;
  }

  return (
    <div className={compact ? "space-y-3" : "grid grid-cols-1 gap-4 p-4"}>
      {results.map((property, idx) => {
        console.log(`EnrichedResultsGrid - Rendering property ${idx}:`, property);
        return (
          <div key={idx}>
            {/* Property Card */}
            <EnrichedPropertyCard
              property={property}
              compact={compact}
              onClick={() => onFocus(property)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EnrichedResultsGrid;
