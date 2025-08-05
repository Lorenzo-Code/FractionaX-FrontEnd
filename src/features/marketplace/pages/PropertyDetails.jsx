import React from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiHeart, FiShare2 } from 'react-icons/fi';
import { SEO } from '../../../shared/components';

// Sample or mock function to fetch property details based on ID;
// replace with real API call or context hook in production
const fetchPropertyById = (id) => {
  const mockProperties = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      address: "123 Main St, Houston, TX 77002",
      price: 450000,
      rentPrice: 2500,
      beds: 2,
      baths: 2,
      sqft: 1200,
      propertyType: "condo",
      listingType: "sale",
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600", 
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      description: "Experience luxury living in this stunning modern condo located in the heart of downtown Houston. This 2-bedroom, 2-bathroom unit offers breathtaking city views from floor-to-ceiling windows and features high-end finishes throughout. The open-concept living space is perfect for entertaining, with a gourmet kitchen featuring quartz countertops and stainless steel appliances.",
      detailedDescription: "This exceptional downtown condo represents the pinnacle of urban living. The thoughtfully designed space maximizes natural light and city views while providing all the amenities of modern life. The master suite includes a walk-in closet and spa-like bathroom. Building amenities include 24/7 concierge, fitness center, rooftop pool, and valet parking.",
      features: ["Parking", "Gym", "Pool", "Doorman", "City Views", "Hardwood Floors", "Granite Counters", "Stainless Appliances", "Walk-in Closet", "Balcony"],
      yearBuilt: 2020,
      lotSize: 0,
      coordinates: { lat: 29.7604, lng: -95.3698 },
      tokenized: false,
      tokenPrice: 0,
      totalTokens: 0,
      availableTokens: 0,
      expectedROI: 8.5,
      monthlyRent: 2500,
      hoa: 420,
      taxes: 5400,
      insurance: 1200,
      listingDate: "2024-01-15",
      status: "active",
      agent: {
        name: "Sarah Johnson",
        phone: "(713) 555-0123",
        email: "sarah@realty.com",
        company: "Downtown Realty Group",
        photo: "/api/placeholder/100/100",
        license: "TX-123456"
      },
      stats: {
        views: 245,
        saves: 12,
        daysOnMarket: 15,
        priceHistory: [
          { date: "2024-01-15", price: 450000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Downtown Houston",
        walkability: 92,
        transitScore: 85,
        bikeScore: 78
      },
      schools: [
        { name: "Downtown Elementary", rating: 8, distance: 0.3 },
        { name: "Houston Middle School", rating: 7, distance: 0.8 },
        { name: "Central High School", rating: 9, distance: 1.2 }
      ]
    },
    {
      id: 2,
      title: "Family Home with Pool",
      address: "456 Oak Avenue, Sugar Land, TX 77479",
      price: 650000,
      rentPrice: 3200,
      beds: 4,
      baths: 3,
      sqft: 2800,
      propertyType: "house",
      listingType: "sale",
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600", 
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      description: "Beautiful family home with pool and large backyard in desirable Sugar Land neighborhood. This spacious 4-bedroom, 3-bathroom home features an open floor plan, updated kitchen, and resort-style backyard with swimming pool.",
      detailedDescription: "This immaculate family home offers the perfect blend of comfort and luxury. The open-concept design creates seamless flow between living spaces, while large windows flood the home with natural light. The gourmet kitchen features granite countertops, custom cabinetry, and a large island perfect for family gatherings. The master suite is a true retreat with a spa-like bathroom and walk-in closet. The backyard oasis includes a sparkling pool, covered patio, and beautifully landscaped gardens.",
      features: ["Pool", "Garage", "Garden", "Fireplace", "Granite Counters", "Hardwood Floors", "Crown Molding", "Ceiling Fans", "Covered Patio", "Sprinkler System"],
      yearBuilt: 2015,
      lotSize: 0.3,
      coordinates: { lat: 29.6196, lng: -95.6349 },
      tokenized: true,
      tokenPrice: 100,
      totalTokens: 6500,
      availableTokens: 2100,
      expectedROI: 12.3,
      monthlyRent: 3200,
      hoa: 150,
      taxes: 9750,
      insurance: 1800,
      listingDate: "2024-01-08",
      status: "active",
      agent: {
        name: "Mike Davis",
        phone: "(281) 555-0456",
        email: "mike@realty.com",
        company: "Sugar Land Properties",
        photo: "/api/placeholder/100/100",
        license: "TX-789012"
      },
      stats: {
        views: 412,
        saves: 28,
        daysOnMarket: 8,
        priceHistory: [
          { date: "2024-01-08", price: 650000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Sugar Land",
        walkability: 65,
        transitScore: 42,
        bikeScore: 58
      },
      schools: [
        { name: "Oak Elementary", rating: 9, distance: 0.5 },
        { name: "Sugar Land Middle", rating: 9, distance: 1.2 },
        { name: "Clements High School", rating: 10, distance: 2.1 }
      ]
    }
  ];

  return mockProperties.find(property => property.id === parseInt(id));
};

const PropertyDetails = () => {
  const { id } = useParams();
  const property = fetchPropertyById(id);

  if (!property) {
    return <div>Property not found</div>;
  }

  const {
    title,
    address,
    price,
    images,
    beds,
    baths,
    sqft,
    description,
    detailedDescription,
    features,
    yearBuilt,
    neighborhood,
    schools,
    agent,
    stats,
    taxes,
    hoa,
    insurance,
    listingDate
  } = property;

  return (
    <>
      <SEO title={`${title} | Property Details`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Image gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`${title} image ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" />
          ))}
        </div>

        {/* Property Main Info */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600 text-base mb-2 flex items-center">
                <FiMapPin className="w-5 h-5 mr-1" aria-hidden="true" />
                {address}
              </p>
              <p className="text-gray-700 text-lg mb-4">${price.toLocaleString()}</p>
              <div className="flex space-x-4 text-gray-600 text-sm">
                <span>{beds} beds</span>
                <span>{baths} baths</span>
                <span>{sqft.toLocaleString()} sqft</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-colors">
                <FiHeart className="w-5 h-5" aria-hidden="true" />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none transition-colors">
                <FiShare2 className="w-5 h-5" aria-hidden="true" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-700">{detailedDescription}</p>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Features */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <ul className="list-disc list-inside">
              {features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Financial Details */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Details</h2>
            <ul className="list-inside">
              <li className="text-gray-700">HOA: ${hoa}</li>
              <li className="text-gray-700">Taxes: ${taxes}</li>
              <li className="text-gray-700">Insurance: ${insurance}</li>
              <li className="text-gray-700">Listed on: {new Date(listingDate).toLocaleDateString()}</li>
            </ul>
          </div>
        </div>

        {/* Neighborhood Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Neighborhood & Schools</h2>
          <p className="text-gray-700 mb-2">{neighborhood.name}</p>
          <div className="flex space-x-4 text-gray-600 text-sm mb-2">
            <span>Walkability: {neighborhood.walkability}</span>
            <span>Transit: {neighborhood.transitScore}</span>
            <span>Bike: {neighborhood.bikeScore}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nearby Schools:</h3>
          <ul className="list-inside">
            {schools.map((school, index) => (
              <li key={index} className="text-gray-700">{school.name} (Rating: {school.rating}) - {school.distance} miles</li>
            ))}
          </ul>
        </div>

        {/* Agent */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Information</h2>
          <div className="flex items-center">
            <img src={agent.photo} alt={agent.name} className="w-16 h-16 rounded-full shadow-md mr-4" />
            <div>
              <p className="text-gray-700 font-medium">Name: {agent.name}</p>
              <p className="text-gray-600">Company: {agent.company}</p>
              <p className="text-gray-600">License: {agent.license}</p>
              <p className="text-gray-600">Contact: {agent.phone} | {agent.email}</p>
            </div>
          </div>
        </div>

        {/* Price History */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Price History</h2>
          <ul className="list-none">
            {stats.priceHistory.map((event, index) => (
              <li key={index} className="text-gray-700">{new Date(event.date).toLocaleDateString()}: ${event.price.toLocaleString()} - {event.event}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
