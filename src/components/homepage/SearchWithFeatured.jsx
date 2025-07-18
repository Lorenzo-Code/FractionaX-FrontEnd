import SmartPropertySearch from "../marketplace/SmartPropertySearch";
import PropertyCard from "../marketplace/PropertyCard";

// Temporary mock data until backend tracking is added
const topViewedProperties = [
  {
    id: 1,
    title: "Modern Duplex in Houston",
    location: "Houston, TX",
    yield: "9.2%",
    price: "$285,000",
    image: "/assets/properties/duplex-houston.jpg",
  },
  {
    id: 2,
    title: "Downtown Condo",
    location: "Atlanta, GA",
    yield: "7.8%",
    price: "$195,000",
    image: "/assets/properties/condo-atl.jpg",
  },
  {
    id: 3,
    title: "College Town Rental",
    location: "Austin, TX",
    yield: "8.5%",
    price: "$312,000",
    image: "/assets/properties/austin-rental.jpg",
  },
];

export default function SearchWithFeatured({ onSearch, showListings = true }) {
  return (
    <section className="bg-white py-18 px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Smart Real Estate Search. AI-Powered Returns.
        </h2>
        <p className="text-gray-600 text-lg">
          Describe your ideal deal — or start with a suggestion below. These are examples of what’s possible.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center mb-12">
        <SmartPropertySearch showInput={true} showSuggestions={true} onSearch={onSearch} />
      </div>

      {showListings && (
        <>
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            🔥 Most Viewed in the Last 24 Hours
          </h3>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topViewedProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
