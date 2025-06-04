import React from "react";
import properties from "./mockProperties"; // adjust the path if needed

const LocalListingsSection = () => {
  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Local Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            <div className="h-48 w-full bg-gray-100 overflow-hidden">
              <img
                src={property.image}
                alt={property.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {property.name}
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    property.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : property.status === "Fully Funded"
                      ? "bg-gray-200 text-gray-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {property.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{property.location}</p>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Yield:</strong>{" "}
                  <span className="text-green-600 font-medium">
                    {property.yield}
                  </span>
                </p>
                <p>
                  <strong>Total Cost:</strong> {property.cost}
                </p>
                <p>
                  <strong>Funding Phase:</strong> {property.funding_phase}
                </p>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold">
                View Investment Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LocalListingsSection;
