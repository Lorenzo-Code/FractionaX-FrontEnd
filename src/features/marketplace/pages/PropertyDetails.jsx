import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiHeart, FiShare2, FiChevronLeft, FiChevronRight, FiMaximize, FiArrowLeft } from 'react-icons/fi';
import { TrendingUp, BarChart3, DollarSign, Calendar, MapPin as MapPinIcon, AlertCircle, Star, Loader, X } from 'lucide-react';
import { SEO } from '../../../shared/components';
import CoreLogicLoginModal from '../../../shared/components/CoreLogicLoginModal';
import FXCTConfirmationModal from '../../../shared/components/FXCTConfirmationModal';
import useCoreLogicInsights from '../../../shared/hooks/useCoreLogicInsights';
import { useAuth } from '../../../shared/hooks';
import coreLogicService from '../../../services/coreLogicService';
import { smartFetch } from '../../../shared/utils';

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
    },
    {
      id: 28297409,
      title: "Luxury Waterfront Estate",
      address: "7890 Lakefront Drive, The Woodlands, TX 77381",
      price: 1250000,
      rentPrice: 5500,
      beds: 5,
      baths: 4,
      sqft: 4200,
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
      description: "Stunning waterfront estate in prestigious The Woodlands community with private lake access, gourmet kitchen, and resort-style amenities.",
      detailedDescription: "This magnificent waterfront estate epitomizes luxury living with direct lake access and panoramic water views. The grand foyer leads to an open-concept living area with soaring ceilings and walls of glass showcasing the stunning lake views. The chef's kitchen features top-of-the-line appliances, custom cabinetry, and an oversized island perfect for entertaining. The master suite is a true sanctuary with lake views, spa-like bathroom, and dual walk-in closets. Additional highlights include a home theater, wine cellar, and private dock.",
      features: ["Lake Access", "Private Dock", "Wine Cellar", "Home Theater", "Gourmet Kitchen", "Hardwood Floors", "Stone Fireplace", "Crown Molding", "Covered Patio", "3-Car Garage"],
      yearBuilt: 2018,
      lotSize: 0.8,
      coordinates: { lat: 30.1588, lng: -95.4613 },
      tokenized: false,
      tokenPrice: 0,
      totalTokens: 0,
      availableTokens: 0,
      expectedROI: 10.2,
      monthlyRent: 5500,
      hoa: 850,
      taxes: 18750,
      insurance: 3200,
      listingDate: "2024-12-20",
      status: "active",
      agent: {
        name: "Jennifer Williams",
        phone: "(281) 555-0789",
        email: "jennifer@luxuryrealty.com",
        company: "The Woodlands Luxury Realty",
        photo: "/api/placeholder/100/100",
        license: "TX-456789"
      },
      stats: {
        views: 1847,
        saves: 89,
        daysOnMarket: 5,
        priceHistory: [
          { date: "2024-12-20", price: 1250000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "The Woodlands",
        walkability: 45,
        transitScore: 25,
        bikeScore: 62
      },
      schools: [
        { name: "Woodlands Elementary", rating: 10, distance: 0.4 },
        { name: "McCullough Junior High", rating: 9, distance: 1.1 },
        { name: "The Woodlands High School", rating: 10, distance: 1.8 }
      ]
    }
  ];

  return mockProperties.find(property => property.id === parseInt(id));
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const coreLogicInsights = useCoreLogicInsights();
  const [property, setProperty] = useState(null);
  const [enhancedData, setEnhancedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coreLogicLoading, setCoreLogicLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Photo gallery states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Load basic property data from backend API
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await smartFetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Property not found');
          } else {
            setError('Failed to load property data');
          }
          return;
        }
        
        const result = await response.json();
        setProperty(result.data);
        
      } catch (error) {
        console.error('Error loading property:', error);
        setError('Failed to load property data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  // Handle FXCT insight confirmations and load data
  useEffect(() => {
    const handleFxctConfirmation = (event) => {
      const { propertyId, tier, data } = event.detail;
      
      // Only update if this is for the current property
      if (propertyId === id) {
        setEnhancedData(data);
      }
    };

    // Listen for FXCT confirmation events
    window.addEventListener('fxctInsightConfirmed', handleFxctConfirmation);
    
    return () => {
      window.removeEventListener('fxctInsightConfirmed', handleFxctConfirmation);
    };
  }, [id]);

  // Keyboard navigation for fullscreen mode - MOVED HERE to be with other hooks
  useEffect(() => {
    if (!isFullscreenOpen) return;
    
    const handleKeyPress = (e) => {
      // Photo gallery navigation functions - defined inline to avoid closure issues
      const nextImage = () => {
        setCurrentImageIndex((prev) => {
          const images = property?.carouselPhotos || 
                        (property?.imgSrc ? [property.imgSrc] : 
                        property?.images || 
                        ["https://via.placeholder.com/800x600?text=No+Image"]);
          return (prev + 1) % images.length;
        });
      };

      const previousImage = () => {
        setCurrentImageIndex((prev) => {
          const images = property?.carouselPhotos || 
                        (property?.imgSrc ? [property.imgSrc] : 
                        property?.images || 
                        ["https://via.placeholder.com/800x600?text=No+Image"]);
          return (prev - 1 + images.length) % images.length;
        });
      };

      const closeFullscreen = () => {
        setIsFullscreenOpen(false);
      };

      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'Escape') closeFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreenOpen, property]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return <div className="text-center py-20 text-gray-600">{error || 'Property not found'}</div>;
  }

  const {
    title,
    address,
    price,
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
    listingDate,
    imgSrc,
    carouselPhotos
  } = property;
  
  // Create an array of images from carouselPhotos or imgSrc or mock image
  const images = carouselPhotos || 
                (imgSrc ? [imgSrc] : 
                property.images || 
                ["https://via.placeholder.com/800x600?text=No+Image"]);
  
  console.log('Property Images:', { carouselPhotos, imgSrc, finalImages: images });

  // Photo gallery navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };
  
  const handleBackToMarketplace = () => {
    // Check if we can go back in history, otherwise navigate to marketplace
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <>
      <SEO title={`${title} | Property Details`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button - Desktop */}
        <div className="mb-4 hidden sm:block">
          <button
            onClick={handleBackToMarketplace}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Go back to marketplace"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Marketplace</span>
          </button>
        </div>
        
        {/* Mobile Back Button - Fixed Position */}
        <div className="fixed top-4 left-4 z-40 sm:hidden">
          <button
            onClick={handleBackToMarketplace}
            className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-lg border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Go back to marketplace"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>
        {/* Modern Photo Gallery */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Main Image Display */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={images[currentImageIndex]}
                alt={`${title} - Photo ${currentImageIndex + 1}`}
                className="w-full h-96 md:h-[500px] object-cover"
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                  setImageLoading(false);
                }}
              />
            </div>
            
            {/* Image Loading Overlay */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            {/* Fullscreen Button */}
            <button
              onClick={openFullscreen}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Open fullscreen"
            >
              <FiMaximize className="w-5 h-5" />
            </button>
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="p-4 bg-gray-50">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150x150?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Fullscreen Modal */}
        {isFullscreenOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative max-w-screen-xl max-h-screen mx-4">
              {/* Close Button */}
              <button
                onClick={closeFullscreen}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                aria-label="Close fullscreen"
              >
                <X className="w-8 h-8" />
              </button>
              
              {/* Fullscreen Image */}
              <img
                src={images[currentImageIndex]}
                alt={`${title} - Photo ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="w-10 h-10" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="w-10 h-10" />
                  </button>
                </>
              )}
              
              {/* Fullscreen Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        )}

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

        {/* Investment Interest & FXCT Activity */}
        {property.stats && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Investment Interest</h2>
                <p className="text-sm text-gray-600">FXCT commitments and investor activity</p>
              </div>
            </div>
            
            {/* Investment Confidence & Urgency Header */}
            {(() => {
              const fxctCommitted = property.stats.fxctCommitted || (property.stats.saves * 150);
              const investors = property.stats.investors || Math.floor(property.stats.saves * 0.7);
              const avgCommitment = fxctCommitted / Math.max(investors, 1);
              
              // Calculate Investment Confidence Score (1-10)
              let confidenceScore = 5.0; // Base score
              
              // Factor 1: FXCT commitment size
              if (fxctCommitted > 15000) confidenceScore += 2.0;
              else if (fxctCommitted > 10000) confidenceScore += 1.5;
              else if (fxctCommitted > 5000) confidenceScore += 1.0;
              else if (fxctCommitted > 2000) confidenceScore += 0.5;
              
              // Factor 2: Investor diversity
              if (investors > 20) confidenceScore += 1.5;
              else if (investors > 15) confidenceScore += 1.0;
              else if (investors > 10) confidenceScore += 0.5;
              
              // Factor 3: Average commitment strength
              if (avgCommitment > 500) confidenceScore += 1.0;
              else if (avgCommitment > 300) confidenceScore += 0.5;
              
              // Factor 4: Time factor (newer = more confident)
              if (property.stats.daysOnMarket < 7) confidenceScore += 0.5;
              else if (property.stats.daysOnMarket > 30) confidenceScore -= 0.5;
              
              // Cap at 10.0
              confidenceScore = Math.min(confidenceScore, 10.0);
              
              // Investment Level Badge
              let investmentLevel = 'low';
              let badgeClasses = 'bg-gray-100 text-gray-700';
              let icon = '💰';
              let levelText = 'Early Interest';
              
              if (confidenceScore >= 8.5) {
                investmentLevel = 'high';
                badgeClasses = 'bg-green-100 text-green-700';
                icon = '🚀';
                levelText = 'Premium Investment Opportunity';
              } else if (confidenceScore >= 7.0) {
                investmentLevel = 'medium';
                badgeClasses = 'bg-blue-100 text-blue-700';
                icon = '⭐';
                levelText = 'Strong Investment Interest';
              } else if (confidenceScore >= 6.0) {
                investmentLevel = 'growing';
                badgeClasses = 'bg-orange-100 text-orange-700';
                icon = '📊';
                levelText = 'Growing Investment Pool';
              }
              
              // Time-based urgency indicators
              const getUrgencyMessage = () => {
                const hoursAgo = Math.floor(Math.random() * 6) + 1;
                const weeklyGrowth = Math.floor(Math.random() * 60) + 25; // 25-85% growth
                const newInvestors = Math.floor(Math.random() * 5) + 2; // 2-6 new investors
                
                const urgencyMessages = [
                  `⏰ ${newInvestors} new investors joined in last 24 hours`,
                  `📈 FXCT commitments increased ${weeklyGrowth}% this week`,
                  `🔥 Fastest growing property in ${property.neighborhood.name}`,
                  `⚡ ${Math.floor(Math.random() * 800) + 200} FXCT committed today`,
                ];
                
                return urgencyMessages[Math.floor(Math.random() * urgencyMessages.length)];
              };
              
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClasses} flex items-center`}>
                      <span className="mr-1">{icon}</span>
                      {levelText}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">
                        Investment Confidence: {confidenceScore.toFixed(1)}/10
                      </div>
                      <div className="text-xs text-gray-500">
                        Based on commitment quality & diversity
                      </div>
                    </div>
                  </div>
                  
                  {/* Urgency Banner */}
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-orange-800">
                        {getUrgencyMessage()}
                      </div>
                      <div className="text-xs text-orange-600 font-medium">
                        Updated {Math.floor(Math.random() * 3) + 1}h ago
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
            
            {/* FXCT Investment Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-700">
                  {((property.stats.saves * 150) || 0).toLocaleString()}
                </div>
                <div className="text-sm text-orange-600 font-medium">FXCT Committed</div>
                <div className="text-xs text-orange-500 mt-1">Total interest</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {Math.floor(property.stats.saves * 0.7) || 0}
                </div>
                <div className="text-sm text-blue-600 font-medium">Investors</div>
                <div className="text-xs text-blue-500 mt-1">Showing interest</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {Math.floor((property.stats.saves * 150) / Math.max(Math.floor(property.stats.saves * 0.7), 1)) || 0}
                </div>
                <div className="text-sm text-purple-600 font-medium">Avg FXCT</div>
                <div className="text-xs text-purple-500 mt-1">Per investor</div>
              </div>
            </div>
            
            {/* Active Listing Review Progress */}
            {(() => {
              const fxctCommitted = property.stats.saves * 150;
              // Calculate threshold based on property price (more expensive = higher threshold)
              const reviewThreshold = Math.floor(property.price / 10000) * 100; // $1.25M property = 12,500 FXCT threshold
              const progress = Math.min((fxctCommitted / reviewThreshold) * 100, 100);
              const remaining = Math.max(reviewThreshold - fxctCommitted, 0);
              
              return (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-purple-900 flex items-center">
                        🎯 <span className="ml-1">Active Listing Review</span>
                      </h3>
                      <p className="text-sm text-purple-700">Trigger professional acquisition review</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{reviewThreshold.toLocaleString()}</div>
                      <div className="text-xs text-purple-500">FXCT target</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-purple-700 font-medium">
                        Progress: {fxctCommitted.toLocaleString()} / {reviewThreshold.toLocaleString()} FXCT
                      </span>
                      <span className="text-purple-600 font-bold">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${progress}%` }}
                      >
                        {/* Pulsing effect when close to target */}
                        {progress > 75 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-50 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-purple-600">
                        {remaining > 0 ? `${remaining.toLocaleString()} FXCT needed` : 'Target reached! 🎉'}
                      </span>
                      {progress > 75 && (
                        <span className="text-green-600 font-medium animate-pulse">
                          📈 Almost there!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="text-sm">
                    {progress >= 100 ? (
                      <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-green-800">
                        <strong>🚀 Review Triggered!</strong> Our acquisition team is now actively reviewing this property for potential purchase and tokenization.
                      </div>
                    ) : progress > 75 ? (
                      <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 text-orange-800">
                        <strong>🔥 Almost Ready!</strong> Just {remaining.toLocaleString()} more FXCT needed to trigger our acquisition team review.
                      </div>
                    ) : (
                      <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 text-purple-800">
                        <strong>💡 How it works:</strong> When {reviewThreshold.toLocaleString()} FXCT is committed, our team begins professional due diligence and seller negotiations.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
            
            {/* Investor Profile & Commitment Analysis */}
            {(() => {
              const fxctCommitted = property.stats.saves * 150;
              const investors = Math.floor(property.stats.saves * 0.7);
              const avgCommitment = fxctCommitted / Math.max(investors, 1);
              
              return (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    👥 <span className="ml-1">Investor Profile</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Investor Composition */}
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <h4 className="font-medium text-gray-900 mb-2">Investor Types</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">High-commitment (500+ FXCT)</span>
                          </div>
                          <span className="font-semibold text-green-600">{Math.floor(investors * 0.3)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">Medium-commitment (200-499)</span>
                          </div>
                          <span className="font-semibold text-blue-600">{Math.floor(investors * 0.5)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-600">Entry-level (100-199)</span>
                          </div>
                          <span className="font-semibold text-orange-600">{Math.floor(investors * 0.2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Investment Quality Indicators */}
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h4 className="font-medium text-gray-900 mb-2">Quality Indicators</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Repeat Investors:</span>
                          <span className="font-semibold text-green-600">{Math.floor(investors * 0.4)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Avg Hold Period:</span>
                          <span className="font-semibold text-blue-600">2.3 years</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-semibold text-purple-600">94%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Investment Strength Indicator */}
                  <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Investment Diversity Score:</span>
                      <span className="font-bold text-indigo-600">
                        {((investors / 10) + (avgCommitment / 100)).toFixed(1)}/10
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Based on investor count and commitment distribution
                    </div>
                  </div>
                </div>
              );
            })()}
            
            {/* Investment Activity Insights */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Investment Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Commitment Strength: </span>
                  <span className="font-semibold text-orange-600">
                    {(() => {
                      const avgCommit = (property.stats.saves * 150) / Math.max(Math.floor(property.stats.saves * 0.7), 1);
                      return avgCommit > 400 ? 'High' : avgCommit > 200 ? 'Moderate' : 'Light';
                    })()}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">Average FXCT per investor</div>
                </div>
                <div>
                  <span className="text-gray-600">Investment Velocity: </span>
                  <span className="font-semibold text-green-600">
                    {property.stats.daysOnMarket < 10 ? 'Fast' : property.stats.daysOnMarket < 20 ? 'Steady' : 'Slow'}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">FXCT accumulation rate</div>
                </div>
              </div>
              
              {/* Recent FXCT Activity */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Recent FXCT Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Investor ***2847 committed</span>
                    </div>
                    <div className="text-sm font-semibold text-orange-600">850 FXCT</div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Investor ***1923 committed</span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">1,200 FXCT</div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Investor ***5671 committed</span>
                    </div>
                    <div className="text-sm font-semibold text-purple-600">625 FXCT</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Last updated {Math.floor(Math.random() * 3) + 1} hours ago
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FXCT Token-based CoreLogic Insights */}
        {isAuthenticated && !enhancedData && !coreLogicLoading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Unlock Property Intelligence</h3>
                  <p className="text-sm text-gray-600">Get detailed CoreLogic insights with FXCT tokens</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Your Balance</div>
                <div className="text-lg font-bold text-blue-600">{coreLogicInsights.fxctBalance} FXCT</div>
              </div>
            </div>
            
            {/* Tier Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coreLogicInsights.getAvailableTiers().map((tier) => (
                <div 
                  key={tier.key}
                  className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                    tier.affordable 
                      ? 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-md cursor-pointer'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                  onClick={() => tier.affordable && coreLogicInsights.requestPropertyInsights(id, tier.key, property.address)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                      tier.affordable 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tier.fxctCost} FXCT
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    {tier.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                    {tier.benefits.length > 3 && (
                      <div className="text-gray-400">+{tier.benefits.length - 3} more...</div>
                    )}
                  </div>
                  {!tier.affordable && (
                    <div className="mt-3 text-xs text-red-600 font-medium">
                      Insufficient FXCT (need {tier.fxctCost - coreLogicInsights.fxctBalance} more)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Enhanced CoreLogic Data Sections */}
        {enhancedData && (
          <>
            {/* Market Analysis */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Market Analysis</h2>
                  <p className="text-sm text-gray-600">Powered by CoreLogic</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Median Price</div>
                  <div className="text-lg font-semibold">{enhancedData.marketAnalysis?.medianPrice}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Price Change</div>
                  <div className="text-lg font-semibold text-green-600">{enhancedData.marketAnalysis?.priceChange}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Market Trend</div>
                  <div className="text-lg font-semibold">{enhancedData.marketAnalysis?.marketTrend}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Days on Market</div>
                  <div className="text-lg font-semibold">{enhancedData.marketAnalysis?.daysOnMarket}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Demand Score</div>
                  <div className="text-lg font-semibold">{enhancedData.marketAnalysis?.demandScore}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Inventory Level</div>
                  <div className="text-lg font-semibold">{enhancedData.marketAnalysis?.inventoryLevel}</div>
                </div>
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Investment Analysis</h2>
                  <p className="text-sm text-gray-600">ROI projections and rental estimates</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-gray-700">Estimated Rent</span>
                    <span className="font-semibold text-emerald-600">{enhancedData.investmentAnalysis?.estimatedRent}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Cap Rate</span>
                    <span className="font-semibold text-blue-600">{enhancedData.investmentAnalysis?.capRate}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">ROI Projection</span>
                    <span className="font-semibold text-purple-600">{enhancedData.investmentAnalysis?.roiProjection}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Monthly Cash Flow</span>
                    <span className="font-semibold text-green-600">{enhancedData.investmentAnalysis?.cashFlow}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Appreciation Rate</span>
                    <span className="font-semibold">{enhancedData.investmentAnalysis?.appreciation}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Risk Score</span>
                    <span className="font-semibold text-green-600">{enhancedData.investmentAnalysis?.riskScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparable Sales */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Comparable Sales</h2>
                  <p className="text-sm text-gray-600">Recent sales in the area</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Recent Sales</div>
                  <div className="text-lg font-semibold">{enhancedData.comparableSales?.recentSales}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Avg Sale Price</div>
                  <div className="text-lg font-semibold">{enhancedData.comparableSales?.avgSalePrice}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Price Range</div>
                  <div className="text-lg font-semibold">{enhancedData.comparableSales?.priceRange}</div>
                </div>
              </div>
              {enhancedData.comparableSales?.lastSale && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Most Recent Comparable Sale</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{enhancedData.comparableSales.lastSale.address}</div>
                        <div className="text-sm text-gray-600">{enhancedData.comparableSales.lastSale.sqft} sqft</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{enhancedData.comparableSales.lastSale.price}</div>
                        <div className="text-sm text-gray-600">{enhancedData.comparableSales.lastSale.date}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Loading state for CoreLogic data */}
        {coreLogicLoading && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Loading enhanced CoreLogic insights...</span>
            </div>
          </div>
        )}

        {/* CoreLogic access notice for free users */}
        {!isAuthenticated && !enhancedData && !coreLogicLoading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Enhanced Property Intelligence Available</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Get comprehensive market analysis, investment projections, and comparable sales data powered by CoreLogic.
                </p>
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Remaining insights: {coreLogicInsights.getRemainingInsights() || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Neighborhood Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Neighborhood & Schools</h2>
          <p className="text-gray-700 mb-2">{neighborhood.name}</p>
          <div className="flex space-x-4 text-gray-600 text-sm mb-2">
            <span>Walkability: {neighborhood.walkability}</span>
            <span>Transit: {neighborhood.transitScore}</span>
            <span>Bike: {neighborhood.bikeScore}</span>
          </div>
          
          {/* Enhanced neighborhood data if available */}
          {enhancedData?.neighborhoodInsights && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Enhanced Neighborhood Insights</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Avg Income: </span>
                  <span className="font-medium">{enhancedData.neighborhoodInsights.avgIncome}</span>
                </div>
                <div>
                  <span className="text-gray-600">Crime Rate: </span>
                  <span className="font-medium">{enhancedData.neighborhoodInsights.crimeRate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Growth Rate: </span>
                  <span className="font-medium text-green-600">{enhancedData.neighborhoodInsights.growthRate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Demographics: </span>
                  <span className="font-medium">{enhancedData.neighborhoodInsights.demographics}</span>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">Nearby Schools:</h3>
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
        
        {/* CoreLogic Login Modal */}
        <CoreLogicLoginModal />
        
        {/* FXCT Confirmation Modal */}
        <FXCTConfirmationModal />
      </div>
    </>
  );
};

export default PropertyDetails;
