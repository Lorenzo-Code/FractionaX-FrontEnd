import React, { useState, useCallback } from 'react';
import { FiMap, FiGlobe, FiLayers, FiCamera } from 'react-icons/fi';

const MAP_STYLES = {
  roadmap: {
    id: 'roadmap',
    name: 'Roadmap',
    icon: <FiMap className="w-4 h-4" />,
    description: 'Default road map view',
    mapTypeId: 'roadmap'
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    icon: <FiCamera className="w-4 h-4" />,
    description: 'Satellite imagery view',
    mapTypeId: 'satellite'
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid',
    icon: <FiLayers className="w-4 h-4" />,
    description: 'Satellite with roads and labels',
    mapTypeId: 'hybrid'
  },
  terrain: {
    id: 'terrain',
    name: 'Terrain',
    icon: <FiGlobe className="w-4 h-4" />,
    description: 'Physical features and elevation',
    mapTypeId: 'terrain'
  }
};

const MapStyleControls = ({ 
  selectedStyle = 'roadmap',
  onStyleChange,
  position = 'top-left',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle style selection
  const handleStyleSelect = useCallback((styleId) => {
    const style = MAP_STYLES[styleId];
    if (!style) return;

    console.log('🎨 Changing map style to:', style.name);
    
    setIsExpanded(false);
    
    if (onStyleChange) {
      onStyleChange(styleId);
    }
  }, [onStyleChange]);

  // Toggle expanded view
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Get position classes
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-10';
    switch (position) {
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      default:
        return `${baseClasses} bottom-4 left-4`;
    }
  };

  const currentStyleInfo = MAP_STYLES[selectedStyle];

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      {isExpanded ? (
        // Expanded style selector
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-48">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100 mb-2">
            <h3 className="text-sm font-medium text-gray-900">Map Style</h3>
            <button
              onClick={toggleExpanded}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiLayers className="w-4 h-4" />
            </button>
          </div>
          
          {/* Style Options */}
          <div className="space-y-1">
            {Object.values(MAP_STYLES).map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  selectedStyle === style.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`${
                  selectedStyle === style.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{style.name}</p>
                  <p className="text-xs text-gray-500">{style.description}</p>
                </div>
                {selectedStyle === style.id && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Close button */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button
              onClick={toggleExpanded}
              className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        // Collapsed style button
        <button
          onClick={toggleExpanded}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:shadow-xl transition-shadow"
          title={`Current style: ${currentStyleInfo?.name || 'Unknown'}`}
        >
          <div className="flex items-center space-x-2">
            <div className="text-gray-700">
              {currentStyleInfo?.icon || <FiMap className="w-4 h-4" />}
            </div>
            <div className="text-xs text-gray-600 font-medium hidden sm:block">
              {currentStyleInfo?.name || 'Style'}
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default MapStyleControls;
