import React from "react";

const MapTypeToggle = ({ viewMode, onViewModeChange }) => {
  const handleViewToggle = () => {
    const newMode = viewMode === "map" ? "list" : "map";
    onViewModeChange(newMode);
  };

  return (
    <button
      onClick={handleViewToggle}
      className="text-[10px] px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition whitespace-nowrap"
    >
      {viewMode === "map" ? "List View" : "Map View"}
    </button>
  );
};

export default MapTypeToggle;
