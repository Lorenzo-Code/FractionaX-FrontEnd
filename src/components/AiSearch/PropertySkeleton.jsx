import React from 'react';

const PropertySkeleton = ({ compact = false }) => {
  return (
    <div className={`animate-pulse bg-white rounded-lg border ${compact ? 'p-3' : 'p-4'} shadow-sm`}>
      <div className="flex space-x-4">
        {/* Image placeholder */}
        <div className={`bg-gray-300 rounded-lg flex-shrink-0 ${compact ? 'w-20 h-16' : 'w-32 h-24'}`}></div>
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          
          {/* Price */}
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          
          {/* Details */}
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-300 rounded w-12"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          
          {!compact && (
            <>
              {/* AI Score */}
              <div className="flex items-center space-x-2">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-2 bg-gray-300 rounded w-16"></div>
              </div>
              
              {/* Tags */}
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PropertySkeletonGrid = ({ count = 6, compact = false }) => {
  return (
    <div className={compact ? "space-y-3" : "grid grid-cols-1 gap-4 p-4"}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertySkeleton key={index} compact={compact} />
      ))}
    </div>
  );
};

export { PropertySkeleton, PropertySkeletonGrid };
