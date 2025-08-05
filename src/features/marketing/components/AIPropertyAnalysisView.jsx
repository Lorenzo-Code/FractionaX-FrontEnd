import React from 'react';

const AIPropertyAnalysisView = (property) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold">{property.address}</h2>
      <p>{property.cityState}</p>
      <p>Price: {property.price}</p>
      <p>ROI: {property.roi}</p>
    </div>
  );
};

export default AIPropertyAnalysisView;
