import React, { useState } from "react";

const MapTypeToggle = ({ mapRef }) => {
  const [mapType, setMapType] = useState("roadmap");

  const toggleMapType = () => {
    if (mapRef?.current) {
      const newType = mapType === "roadmap" ? "satellite" : "roadmap";
      mapRef.current.setMapTypeId(newType);
      setMapType(newType);
    }
  };

  return (
    <button
      onClick={toggleMapType}
      className="text-[10px] px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition whitespace-nowrap"
    >
      {mapType === "roadmap" ? "Satellite View" : "Map View"}
    </button>
  );
};

export default MapTypeToggle;
