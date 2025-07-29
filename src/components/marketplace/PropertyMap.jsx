import React from "react";

const PropertyMap = ({ properties, selectedProperty, onPropertySelect, mapRef }) => {
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Map View</h3>
        <p className="text-gray-600">
          Map integration with Google Maps API would be implemented here
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Showing {properties.length} properties
        </p>
      </div>
    </div>
  );
};

export default PropertyMap;
