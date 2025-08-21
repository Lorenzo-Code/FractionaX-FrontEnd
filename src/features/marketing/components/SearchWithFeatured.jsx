import SmartPropertySearch from "../../admin/ai-search/components/SmartPropertySearch";
import TrendingAssetCard from "./TrendingAssetCard";
import { FiTrendingUp, FiRefreshCw, FiFilter, FiSliders } from "react-icons/fi";
import { BsCoin, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000';

// Asset categories for filtering
const ASSET_CATEGORIES = [
  { id: 'mixed', name: 'All Categories', icon: '🎯', color: 'gray' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', color: 'blue' },
  { id: 'luxury-cars', name: 'Luxury Cars', icon: '🏎️', color: 'purple' },
  { id: 'art-nfts', name: 'Art & NFTs', icon: '🎨', color: 'pink' },
  { id: 'collectibles', name: 'Collectibles', icon: '🃏', color: 'green' },
  { id: 'defi-yield', name: 'DeFi Yield', icon: '💰', color: 'orange' }
];

export default function SearchWithFeatured({ 
  onSearch, 
  showListings = true, 
  title = "Smart Investment Discovery. Multi-Asset Returns.",
  description = "Discover trending investment opportunities across real estate, luxury assets, NFTs, collectibles, and DeFi — all tokenized for fractional ownership.",
  showSearch = true 
}) {
  const [trendingAssets, setTrendingAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('mixed');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch trending assets from new multi-category API
  const fetchTrendingAssets = async (category = 'mixed', showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      console.log(`🔥 Fetching trending ${category} assets...`);
      
      const response = await axios.get(`${API_BASE_URL}/api/assets/trending`, {
        params: { category, limit: 4 },
        timeout: 10000,
      });
      
      // Handle API response
      let assets = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        assets = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        assets = response.data;
      } else {
        console.warn('⚠️ Unexpected API response format:', response.data);
        throw new Error('Invalid response format - no assets array found');
      }
      
      console.log(`✅ Successfully fetched ${assets.length} trending ${category} assets`);
      setTrendingAssets(assets.slice(0, 4));
      
    } catch (err) {
      console.error(`❌ Error fetching trending ${category} assets:`, err);
      setError(err.message);
      
      // Fallback to realistic mixed assets if API fails
      const fallbackAssets = [
        {
          id: 'fallback-1',
          category: 'real-estate',
          title: 'Investment Duplex - Heights',
          address: '1847 Heights Blvd, Houston, TX 77008',
          price: 425000,
          beds: 4,
          baths: 3,
          sqft: 2100,
          expectedROI: 9.8,
          monthlyRent: 3200,
          images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format'],
          tokenized: true,
          tokenPrice: 212,
          availableTokens: 1200,
          totalTokens: 2000,
          stats: { views: 2847, saves: 156, daysOnMarket: 3 }
        },
        {
          id: 'fallback-2', 
          category: 'luxury-cars',
          title: '1967 Shelby GT500 Fastback',
          location: 'Barrett-Jackson Scottsdale, AZ',
          price: 285000,
          year: 1967,
          make: 'Shelby',
          model: 'GT500 Fastback',
          mileage: 42000,
          condition: 'Excellent',
          expectedROI: 12.5,
          monthlyAppreciation: 1.2,
          images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format'],
          tokenized: true,
          tokenPrice: 570,
          availableTokens: 142,
          totalTokens: 500,
          stats: { views: 1234, saves: 89, daysOnMarket: 5 },
          certification: 'Barrett-Jackson Authenticated'
        },
        {
          id: 'fallback-3',
          category: 'art-nfts',
          title: 'CryptoPunks #7804 (Alien)',
          artist: 'Larva Labs',
          price: 185000,
          blockchain: 'Ethereum',
          edition: '1 of 9 Aliens',
          expectedROI: 8.2,
          monthlyAppreciation: 0.8,
          images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&auto=format'],
          tokenized: true,
          tokenPrice: 370,
          availableTokens: 125,
          totalTokens: 500,
          stats: { views: 1892, saves: 156, daysOnMarket: 2 },
          provenance: 'Original minter, verified on OpenSea'
        },
        {
          id: 'fallback-4',
          category: 'collectibles',
          title: '1998 Pokémon Base Set Charizard PSA 10',
          category_name: 'Pokémon Cards',
          price: 28000,
          grade: 'PSA 10',
          edition: '1st Edition Shadowless',
          expectedROI: 8.5,
          monthlyAppreciation: 0.9,
          images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop&auto=format'],
          tokenized: true,
          tokenPrice: 140,
          availableTokens: 65,
          totalTokens: 200,
          stats: { views: 1567, saves: 178, daysOnMarket: 4 },
          authentication: 'PSA Population: 7,200'
        }
      ];
      
      setTrendingAssets(fallbackAssets);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (showListings) {
      fetchTrendingAssets(selectedCategory);
    }
  }, [showListings]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchTrendingAssets(categoryId, false);
  };

  // Handle asset click
  const handleAssetClick = (asset) => {
    // For now, just log the click. In production, navigate to asset detail page
    console.log('Asset clicked:', asset);
    
    // Navigate based on asset category
    if (asset.category === 'real-estate') {
      window.location.href = `/property/${asset.id}`;
    } else {
      // Navigate to marketplace with category filter
      window.location.href = `/marketplace?category=${asset.category}&id=${asset.id}`;
    }
  };
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30 sm:opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              {title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
              {description}
            </p>
          </div>
        </div>

        {/* Search Section */}
        {showSearch && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-20">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
              <SmartPropertySearch showInput={true} showSuggestions={false} onSearch={onSearch} />
            </div>
          </div>
        )}

        {/* Trending Assets Section */}
        {showListings && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg">
                  <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2" />
                  <span className="text-white font-bold text-xs sm:text-sm tracking-wide">TRENDING NOW</span>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                🔥 Assets Getting Snapped Up
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                <strong>Multi-asset opportunities</strong> across real estate, luxury cars, NFTs, collectibles, and DeFi pools. Tokenized for fractional ownership.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
              {ASSET_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                const colorClasses = {
                  gray: isActive ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
                  blue: isActive ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
                  purple: isActive ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
                  pink: isActive ? 'bg-pink-100 text-pink-800 border-pink-300' : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
                  green: isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
                  orange: isActive ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
                };
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    disabled={refreshing}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      colorClasses[category.color]
                    } ${refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  >
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                );
              })}
              
              {/* Refresh Button */}
              <button
                onClick={() => fetchTrendingAssets(selectedCategory, false)}
                disabled={refreshing}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Assets Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
              >
                {loading ? (
                  // Loading skeleton cards
                  Array.from({ length: 4 }, (_, index) => (
                    <div key={`loading-${index}`} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="relative h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : trendingAssets.length > 0 ? (
                  trendingAssets.map((asset, index) => (
                    <TrendingAssetCard
                      key={asset.id}
                      asset={asset}
                      index={index}
                      onClick={handleAssetClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500 text-lg mb-2">🎯 No trending assets available</div>
                    <div className="text-gray-400 text-sm">Check back soon for new opportunities!</div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Enhanced Call to Action */}
            <div className="text-center px-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="text-blue-600 font-semibold text-sm mb-1">🚀 Multi-Asset Marketplace</div>
                <div className="text-gray-700 text-sm">Discover, invest, and own fractions of premium assets across multiple categories.</div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/marketplace">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px] min-w-[200px]">
                    Explore Marketplace
                    <BsArrowRight className="w-4 h-4 inline ml-2" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full sm:w-auto bg-white border-2 border-green-600 text-green-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 min-h-[48px] min-w-[180px]">
                    Start Investing
                  </button>
                </Link>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-gray-600 text-sm mb-2">
                  ✅ Blockchain Security • ✅ Fractional Ownership • ✅ Multi-Asset Portfolio
                </div>
                <div className="text-xs text-gray-500">
                  Built on Base • Powered by FXCT Token
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
