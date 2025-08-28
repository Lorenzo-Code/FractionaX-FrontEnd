import React, { useEffect, useRef, useMemo, useState } from "react";
import CoreLogicPropertyCard from "./CoreLogicPropertyCard";
import PropertyResearchModal from "./PropertyResearchModal";
import { PropertySkeletonGrid } from "./PropertySkeleton";

const PropertyResearchGrid = ({
  results = [],
  onFocus,
  onHover,
  focusedProperty,
  compact = false,
  loading = false,
  onPropertyClick
}) => {
  const propertyRefs = useRef({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sort and process property research results
  const sortedResults = useMemo(() => {
    return results
      .map((r, index) => ({
        ...r,
        // Create a consistent ID for research results
        id: r.clipId || r.sessionId || `research-${index}`,
        // Add sorting criteria for research results
        sortQuality: r.clipId ? 3 : 2, // CoreLogic research gets priority
      }))
      .sort((a, b) => b.sortQuality - a.sortQuality);
  }, [results]);

  useEffect(() => {
    if (focusedProperty?.id && propertyRefs.current[focusedProperty.id]) {
      const element = propertyRefs.current[focusedProperty.id];
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.style.transform = "scale(1.02)";
      element.style.boxShadow = "0 8px 25px rgba(59, 130, 246, 0.15)";
      element.style.transition = "all 0.3s ease";

      setTimeout(() => {
        element.style.transform = "scale(1)";
        element.style.boxShadow = "";
      }, 600);
    }
  }, [focusedProperty]);

  const handlePropertyClick = (property) => {
    console.log('🔍 Property Research Click:', property);
    
    // For property research results, open a detailed modal/view
    if (property.clipId || property.propertyIntelligence) {
      if (onPropertyClick) {
        onPropertyClick(property);
      } else {
        // Default action: show property research details modal
        console.log('📊 Showing property research details for:', property.clipId);
        setSelectedProperty(property);
        setShowModal(true);
      }
    } else {
      // For regular properties, use the standard onFocus
      if (onFocus) {
        onFocus(property);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  if (loading) return <PropertySkeletonGrid count={6} compact={compact} />;

  if (!Array.isArray(sortedResults) || sortedResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center p-8 text-sm text-gray-500">
        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p className="font-medium">No property research results found</p>
        <p className="text-xs text-gray-400 mt-1">Try searching for a specific property address</p>
      </div>
    );
  }

  return (
    <>
      <div className={compact ? "space-y-3" : "grid grid-cols-1 gap-4 p-4"}>
        {sortedResults.map((property, idx) => {
          const isSelected = focusedProperty?.id === property.id;
          return (
            <div
              key={property.id || idx}
              ref={(el) => {
                if (el) propertyRefs.current[property.id || idx] = el;
              }}
              className="animate-fadeIn transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
              onMouseEnter={() => onHover?.(property)}
              onMouseLeave={() => onHover?.(null)}
            >
              <CoreLogicPropertyCard
                property={property}
                compact={compact}
                onClick={() => handlePropertyClick(property)}
                isSelected={isSelected}
              />
            </div>
          );
        })}
      </div>

      {/* Property Research Details Modal */}
      <PropertyResearchModal
        property={selectedProperty}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PropertyResearchGrid;
