import React from "react";

const FastCompDisplay = ({ data }) => {
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">📊 Fast Comp Results</h3>

      {data?.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {data.images.map((src, i) => (
            <img key={i} src={src} alt={`comp-${i}`} className="w-full h-32 object-cover rounded" />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-800 space-y-2">
        {Object.entries(data)
          .filter(([key]) => key !== "images")
          .map(([key, val]) => (
            <div key={key}>
              <strong className="capitalize">{key.replace(/_/g, " ")}:</strong> {String(val)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FastCompDisplay;
