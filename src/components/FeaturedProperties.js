// src/components/FeaturedProperties.js
const FeaturedProperties = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-8">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg shadow">
            <div className="h-40 bg-gray-300 mb-4" />
            <h3 className="text-xl font-medium">Property #{i + 1}</h3>
            <p className="text-gray-600 text-sm">Yield: 8% APR | Location: TX</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default FeaturedProperties;
