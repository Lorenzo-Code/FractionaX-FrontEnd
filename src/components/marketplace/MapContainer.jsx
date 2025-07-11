import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const MapContainer = ({ properties = [], selected, setSelected, preload }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 29.7604, lng: -95.3698 });
  const mapRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // Dynamically offset center to accommodate UI
  const calculateMapCenter = () => {
    const width = window.innerWidth;
    const offset = width <= 768 ? 0 : width > 1200 ? 0.15 : 0.1;
    setMapCenter({
      lat: 29.7604,
      lng: -95.3698 - offset,
    });
  };

  const getIconByScore = (score) => {
    if (score >= 90) return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    if (score >= 75) return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  };

  useEffect(() => {
    calculateMapCenter();
    window.addEventListener("resize", calculateMapCenter);
    return () => window.removeEventListener("resize", calculateMapCenter);
  }, []);

  useEffect(() => {
    console.log("📍 Loaded Properties:", properties);
    if (preload && properties.length > 0) {
      setSelected(properties[0]);
    }
  }, [properties, preload, setSelected]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        selected?.location
          ? {
              lat: parseFloat(selected.location.latitude),
              lng: parseFloat(selected.location.longitude),
            }
          : mapCenter
      }
      zoom={13}
      onLoad={(map) => (mapRef.current = map)}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        clickableIcons: false,
        disableDefaultUI: true, // full control to UI
      }}
    >
      {properties
        .filter((p) => {
          const lat = parseFloat(p?.location?.latitude);
          const lng = parseFloat(p?.location?.longitude);
          return !isNaN(lat) && !isNaN(lng);
        })
        .map((property, idx) => {
          const lat = parseFloat(property.location.latitude);
          const lng = parseFloat(property.location.longitude);
          const score = property.aiScore;

          return (
            <MarkerF
              key={idx}
              position={{ lat, lng }}
              onClick={() => {
                setSelected(property);
                if (mapRef.current) {
                  mapRef.current.panTo({ lat, lng });
                  mapRef.current.setZoom(19); // Close view
                }
              }}
              label={
                score
                  ? {
                      text: score.toString(),
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }
                  : undefined
              }
              icon={{
                url: getIconByScore(score),
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          );
        })}
    </GoogleMap>
  );
};

export default MapContainer;
