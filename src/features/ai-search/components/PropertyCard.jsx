const PropertyCard = ({ title, location, yield: yld, price, image }) => (
  <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">{location}</p>
      <div className="mt-2 text-sm flex justify-between text-gray-700">
        <span>Yield: {yld}</span>
        <span>Price: {price}</span>
      </div>
    </div>
  </div>
);

export default PropertyCard;
