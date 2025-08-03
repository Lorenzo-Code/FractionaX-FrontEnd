import React, { useEffect, useRef, useState, useMemo } from 'react';
import EnrichedPropertyCard from './EnrichedPropertyCard';
import { PropertySkeletonGrid } from './PropertySkeleton';

const EnrichedResultsGrid = ({ results, onFocus, onHover, focusedProperty, compact = false, loading = false }) => {
  const [sortedResults, setSortedResults] = useState(results);

  useMemo(() => {
    const withQuality = results.map(r => ({ ...r, sortQuality: r.dataQuality === 'excellent' ? 3 : r.dataQuality === 'good' ? 2 : 1 }));
    const sorted = withQuality.sort((a, b) => b.sortQuality - a.sortQuality || b.price - a.price);
    setSortedResults(sorted);
  }, [results]);
  
  // Show skeleton loading state
  if (loading) {
    return <PropertySkeletonGrid count={6} compact={compact} />;
  }
  
  if (!sortedResults || !Array.isArray(sortedResults)) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center p-8">
        <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-sm">No results to display</p>
      </div>
    );
  }
  
  if (sortedResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center p-8">
        <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className="text-gray-500 text-sm">No properties found</p>
        <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
      </div>
    );
  }

  const highlightText = (text, keywords) => {
    if (!keywords?.length) return text;
    const pattern = new RegExp(`(${keywords.join("|")})`, "gi");
    return text.replace(pattern, '<mark class="bg-yellow-200">$1</mark>');
  };

  const propertyRefs = useRef({});

  // Smooth scroll to focused property when it changes
  useEffect(() => {
    if (focusedProperty && propertyRefs.current[focusedProperty.id]) {
      const element = propertyRefs.current[focusedProperty.id];
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      
      // Add a subtle highlight animation
      element.style.transform = 'scale(1.02)';
      element.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
      element.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '';
      }, 600);
    }
  }, [focusedProperty]);

  return (
    <div className={compact ? "space-y-3" : "grid grid-cols-1 gap-4 p-4"}>
      {sortedResults.map((property, idx) => {
        const isSelected = focusedProperty?.id === property.id;
        return (
          <div 
            key={property.id || idx}
            ref={el => {
              if (el) propertyRefs.current[property.id || idx] = el;
            }}
            className={`animate-fadeIn transition-all duration-300 ${
              isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
            }`}
            style={{ animationDelay: `${idx * 100}ms` }}
            onMouseEnter={() => onHover?.(property)}
            onMouseLeave={() => onHover?.(null)}
          >
            <EnrichedPropertyCard
              property={property}
              compact={compact}
              onClick={() => onFocus(property)}
              isSelected={isSelected}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EnrichedResultsGrid;
