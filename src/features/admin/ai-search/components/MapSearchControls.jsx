import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiCircle, 
  FiSquare, 
  FiMapPin, 
  FiTarget, 
  FiRefreshCw,
  FiTrash2,
  FiSave,
  FiSettings
} from 'react-icons/fi';
// DrawingManager will be loaded dynamically

const MapSearchControls = ({ 
  map, 
  onAreaSearch, 
  onRadiusSearch, 
  onLocationClick,
  isDrawingMode = false,
  setIsDrawingMode 
}) => {
  const [drawingManager, setDrawingManager] = useState(null);
  const [activeDrawingTool, setActiveDrawingTool] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5); // miles
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [showRadiusInput, setShowRadiusInput] = useState(false);
  const radiusInputRef = useRef(null);
  const controlsPanelRef = useRef(null);

  // Drawing options
  const drawingOptions = {
    fillColor: '#2563eb',
    fillOpacity: 0.1,
    strokeColor: '#2563eb',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    clickable: false,
    editable: true,
    zIndex: 1
  };

  // Handle drawing manager load
  const onDrawingManagerLoad = useCallback((drawingManagerInstance) => {
    console.log('🎨 Drawing Manager Loaded');
    setDrawingManager(drawingManagerInstance);
  }, []);

  // Handle shape completion
  const onShapeComplete = useCallback((shape, shapeType) => {
    console.log('✏️ Shape Complete:', shapeType);
    
    // Add to drawn shapes
    const shapeId = Date.now().toString();
    const newShape = { id: shapeId, shape, type: shapeType };
    setDrawnShapes(prev => [...prev, newShape]);
    
    // Extract coordinates based on shape type
    let coordinates = [];
    let bounds = null;

    if (shapeType === 'circle') {
      const center = shape.getCenter();
      const radius = shape.getRadius();
      coordinates = {
        center: { lat: center.lat(), lng: center.lng() },
        radius: radius // meters
      };
      
      // Trigger radius search
      onRadiusSearch?.({
        center: coordinates.center,
        radius: radius / 1609.34, // Convert to miles
        bounds: shape.getBounds()
      });
    } else if (shapeType === 'rectangle') {
      bounds = shape.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      coordinates = {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng()
      };
      
      // Trigger area search
      onAreaSearch?.({
        bounds: coordinates,
        type: 'rectangle'
      });
    } else if (shapeType === 'polygon') {
      const path = shape.getPath();
      coordinates = [];
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push({ lat: point.lat(), lng: point.lng() });
      }
      
      // Trigger area search
      onAreaSearch?.({
        bounds: shape.getBounds(),
        coordinates,
        type: 'polygon'
      });
    }

    // Exit drawing mode
    setActiveDrawingTool(null);
    setIsDrawingMode(false);
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
  }, [drawingManager, onAreaSearch, onRadiusSearch, setIsDrawingMode]);

  // Activate drawing tool
  const activateDrawingTool = (tool) => {
    if (!drawingManager || !map) return;

    setActiveDrawingTool(tool);
    setIsDrawingMode(true);

    // Set drawing mode
    if (tool === 'circle') {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.CIRCLE);
    } else if (tool === 'rectangle') {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.RECTANGLE);
    } else if (tool === 'polygon') {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  };

  // Cancel drawing
  const cancelDrawing = () => {
    setActiveDrawingTool(null);
    setIsDrawingMode(false);
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
  };

  // Clear all shapes
  const clearAllShapes = () => {
    drawnShapes.forEach(({ shape }) => {
      shape.setMap(null);
    });
    setDrawnShapes([]);
  };

  // Handle map click for location search
  const handleMapClick = useCallback((event) => {
    if (!isDrawingMode && onLocationClick) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      onLocationClick({ lat, lng });
    }
  }, [isDrawingMode, onLocationClick]);

  // Setup map click listener
  useEffect(() => {
    if (map) {
      const clickListener = map.addListener('click', handleMapClick);
      return () => {
        if (clickListener) {
          window.google.maps.event.removeListener(clickListener);
        }
      };
    }
  }, [map, handleMapClick]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRadiusInput && controlsPanelRef.current) {
        // Check if the click is outside the entire controls panel area
        if (!controlsPanelRef.current.contains(event.target)) {
          setShowRadiusInput(false);
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showRadiusInput) {
        setShowRadiusInput(false);
      }
    };

    // Always add listeners when showRadiusInput is true
    if (showRadiusInput) {
      // Use timeout to prevent immediate closing when button is clicked
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showRadiusInput]);

  // Quick radius search
  const performRadiusSearch = () => {
    if (!map) return;

    const center = map.getCenter();
    const radiusInMeters = searchRadius * 1609.34; // Convert miles to meters

    // Create temporary circle for visualization
    const circle = new window.google.maps.Circle({
      center: { lat: center.lat(), lng: center.lng() },
      radius: radiusInMeters,
      ...drawingOptions,
      map: map
    });

    // Add to shapes
    const shapeId = Date.now().toString();
    const newShape = { id: shapeId, shape: circle, type: 'circle' };
    setDrawnShapes(prev => [...prev, newShape]);

    // Trigger search
    onRadiusSearch?.({
      center: { lat: center.lat(), lng: center.lng() },
      radius: searchRadius,
      bounds: circle.getBounds()
    });

    setShowRadiusInput(false);
  };

  // Close radius input dropdown
  const closeRadiusInput = () => {
    setShowRadiusInput(false);
  };

  return (
    <>
      {/* Drawing Manager - Coming Soon */}

      {/* Map Search Controls Panel */}
      <div className="absolute top-20 left-4 z-10" ref={controlsPanelRef}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          {/* Drawing Tools - Coming Soon */}
          <div className="space-y-1 mb-2">
            <div className="text-xs text-gray-600 px-2 py-1">Search Area (Coming Soon)</div>
            
            <button
              disabled
              className="w-full p-2 rounded text-left flex items-center space-x-2 transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
              title="Coming Soon - Draw Circle Search Area"
            >
              <FiCircle className="w-4 h-4" />
              <span className="text-sm">Circle</span>
            </button>

            <button
              disabled
              className="w-full p-2 rounded text-left flex items-center space-x-2 transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
              title="Coming Soon - Draw Rectangle Search Area"
            >
              <FiSquare className="w-4 h-4" />
              <span className="text-sm">Rectangle</span>
            </button>

            <button
              disabled
              className="w-full p-2 rounded text-left flex items-center space-x-2 transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
              title="Coming Soon - Draw Custom Search Area"
            >
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm">Custom</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-2 space-y-1">
            <button
              onClick={() => setShowRadiusInput(!showRadiusInput)}
              className="w-full p-2 rounded text-left flex items-center space-x-2 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Quick Radius Search"
            >
              <FiTarget className="w-4 h-4" />
              <span className="text-sm">Radius Search</span>
            </button>

            {drawnShapes.length > 0 && (
              <button
                onClick={clearAllShapes}
                className="w-full p-2 rounded text-left flex items-center space-x-2 hover:bg-red-100 text-red-600 transition-colors"
                title="Clear All Search Areas"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="text-sm">Clear Areas</span>
              </button>
            )}
          </div>

          {/* Cancel Drawing */}
          {isDrawingMode && (
            <div className="border-t border-gray-200 pt-2">
              <button
                onClick={cancelDrawing}
                className="w-full p-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
              >
                Cancel Drawing
              </button>
            </div>
          )}
        </div>

        {/* Radius Input Panel */}
        {showRadiusInput && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-700">Search within radius of current view:</div>
              <button
                onClick={closeRadiusInput}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseFloat(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                min="0.5"
                max="50"
                step="0.5"
              />
              <span className="text-sm text-gray-600">miles</span>
              <button
                onClick={performRadiusSearch}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Active Shapes Info */}
        {drawnShapes.length > 0 && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="text-xs text-gray-600 mb-1">Active Search Areas: {drawnShapes.length}</div>
            <div className="text-xs text-blue-600">Click map to search by location</div>
          </div>
        )}
      </div>

      {/* Drawing Instructions */}
      {isDrawingMode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 max-w-md">
            <div className="text-center">
              <div className="text-blue-600 mb-2">
                <FiMapPin className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-sm text-gray-700 mb-1">
                {activeDrawingTool === 'circle' && 'Click and drag to draw a circular search area'}
                {activeDrawingTool === 'rectangle' && 'Click and drag to draw a rectangular search area'}
                {activeDrawingTool === 'polygon' && 'Click to add points, double-click to complete the area'}
              </div>
              <div className="text-xs text-gray-500">
                Properties within this area will be highlighted
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapSearchControls;
