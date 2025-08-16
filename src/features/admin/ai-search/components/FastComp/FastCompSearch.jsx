import React, { useEffect, useRef, useState } from "react";
import { smartFetch } from "../../../../../shared/utils/secureApiClient";
import { useAuth } from "../../../../../shared/hooks";

const FastCompSearch = ({ onResults }) => {
  const [address, setAddress] = useState("");
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" }, // ✅ Restrict to US
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.address_components || !place.geometry) return;

      const components = place.address_components.reduce((acc, comp) => {
        comp.types.forEach(type => acc[type] = comp.short_name);
        return acc;
      }, {});

      const address1 = place.name; // e.g., "1230 Wirt Rd"
      const city = components.locality || components.sublocality || components.administrative_area_level_2;
      const state = components.administrative_area_level_1;
      const postalcode = components.postal_code;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const place_id = place.place_id;

      if (address1 && city && state && postalcode && lat && lng && place_id) {
        const payload = {
          address1,
          city,
          state,
          postalcode,
          lat,
          lng,
          place_id,
        };

        setAddress(`${address1}, ${city}, ${state} ${postalcode}`);
        fetchFastComp(payload);
      }
    });
  }, []);

  const fetchFastComp = async (payload) => {
    try {
      const res = await smartFetch(`/api/ai/fast-comp`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      onResults(data);
    } catch (err) {
      console.error("FastComp fetch error:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a property address"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {address && (
        <p className="text-sm text-gray-600 mt-2">✅ Address selected: {address}</p>
      )}
    </div>
  );
};

export default FastCompSearch;
