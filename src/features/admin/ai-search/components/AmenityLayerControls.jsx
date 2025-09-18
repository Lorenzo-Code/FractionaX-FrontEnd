import React from 'react';
import { FiEye, FiEyeOff, FiMapPin } from 'react-icons/fi';

const AMENITY_TYPES = {
  schools: {
    icon: '🏫',
    color: '#2563eb',
    name: 'Schools & Education',
    impact: 'high'
  },
  parks: {
    icon: '🌳',
    color: '#059669',
    name: 'Parks & Recreation',
    impact: 'high'
  },
  healthcare: {
    icon: '🏥',
    color: '#dc2626',
    name: 'Healthcare',
    impact: 'medium'
  },
  transit: {
    icon: '🚇',
    color: '#7c3aed',
    name: 'Public Transit',
    impact: 'high'
  },
  shopping: {
    icon: '🛒',
    color: '#ea580c',
    name: 'Shopping',
    impact: 'medium'
  },
  dining: {
    icon: '🍴',
    color: '#be123c',
    name: 'Dining',
    impact: 'low'
  },
  safety: {
    icon: '🚓',
    color: '#1f2937',
    name: 'Safety Services',
    impact: 'high'
  },
  fitness: {
    icon: '💪',
    color: '#0891b2',
    name: 'Fitness & Wellness',
    impact: 'low'
  }
};

const AmenityLayerControls = ({ 
  activeTypes = {}, 
  onToggleType, 
  amenityCounts = {},
  loading = false,
  selectedProperty,
  onToggleAll
}) => {
  const allEnabled = Object.values(activeTypes).every(Boolean);
  const noneEnabled = Object.values(activeTypes).every(enabled => !enabled);

  const getImpactBadge = (impact) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-600'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[impact]}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  if (!selectedProperty) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <FiMapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Select a property to view nearby amenities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Nearby Amenities</h3>
            <p className="text-xs text-gray-600 mt-1">
              Within 1 mile of selected property
            </p>
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </div>
        
        {/* Toggle All Controls */}
        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={() => onToggleAll?.(true)}
            disabled={allEnabled}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              allEnabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => onToggleAll?.(false)}
            disabled={noneEnabled}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              noneEnabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Amenity Types List */}
      <div className="p-2 max-h-80 overflow-y-auto">
        <div className="space-y-1">
          {Object.entries(AMENITY_TYPES).map(([type, config]) => {
            const isActive = activeTypes[type];
            const count = amenityCounts[type] || 0;
            
            return (
              <button
                key={type}
                onClick={() => onToggleType?.(type)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{config.icon}</span>
                    <div
                      className="w-3 h-3 rounded-full border border-white"
                      style={{ backgroundColor: config.color }}
                    ></div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {config.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getImpactBadge(config.impact)}
                      {count > 0 && (
                        <span className="text-xs text-gray-500">
                          {count} found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {count > 0 && (
                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                  {isActive ? (
                    <FiEye className="w-4 h-4 text-blue-600" />
                  ) : (
                    <FiEyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with Impact Legend */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2">Property Value Impact:</p>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenityLayerControls;
