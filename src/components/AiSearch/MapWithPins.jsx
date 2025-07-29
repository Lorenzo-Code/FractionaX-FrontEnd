import React, { useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 29.7604, // Houston, TX default
  lng: -95.3698,
};

const MapWithPins = ({ properties = [] }) => {
  const [selected, setSelected] = React.useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // make sure it's in your .env
  });

  const onLoad = useCallback((map) => {
    map.setZoom(10);
  }, []);

  if (!isLoaded) return <p className="text-center text-gray-500">Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10} onLoad={onLoad}>
      {properties.map((property, i) => (
        property.lat && property.lon && (
          <Marker
            key={i}
            position={{ lat: parseFloat(property.lat), lng: parseFloat(property.lon) }}
            onClick={() => setSelected(property)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )
      ))}

      {selected && (
        <InfoWindow
          position={{ lat: parseFloat(selected.lat), lng: parseFloat(selected.lon) }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-sm">
            <strong>{selected.fullAddress}</strong><br />
            ${selected.price?.toLocaleString()}<br />
            {selected.bedrooms} Beds / {selected.bathrooms} Baths
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapWithPins;
