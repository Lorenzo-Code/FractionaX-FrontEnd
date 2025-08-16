import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, Filter, ShieldCheck, Search, Grid3X3, Star, TrendingUp, Heart, Eye, DollarSign } from "lucide-react";

export default function StepTwoMapPreview() {
  const [currentView, setCurrentView] = useState(0); // 0 for AI Search, 1 for Marketplace
  const [activePin, setActivePin] = useState(0);

  const pinData = [
    { top: "18%", left: "22%", price: "$325K", insight: "6.9% projected yield" },
    { top: "12%", left: "58%", price: "$479K", insight: "Low-risk area" },
    { top: "38%", left: "28%", price: "$310K", insight: "Duplex near university" },
    { top: "52%", left: "62%", price: "$445K", insight: "8.1% projected ROI" },
    { top: "63%", left: "37%", price: "$395K", insight: "New construction zone" },
    { top: "71%", left: "68%", price: "$459K", insight: "Rental demand trending up" },
  ];

  const marketplaceAssets = [
    {
      id: 1,
      type: "Real Estate",
      title: "Miami Luxury Condo",
      price: "$850K",
      image: "/assets/properties/miami-condo.jpg",
      yield: "7.2%",
      location: "Brickell, Miami",
      fractionalPrice: "$1,250",
      totalShares: 680,
      soldShares: 425,
      category: "🏠",
      risk: "Medium"
    },
    {
      id: 2,
      type: "Luxury Car",
      title: "1967 Porsche 911S",
      price: "$275K",
      image: "/assets/cars/porsche-911.jpg",
      yield: "12.5%",
      location: "Classic Car Vault",
      fractionalPrice: "$550",
      totalShares: 500,
      soldShares: 312,
      category: "🏎️",
      risk: "High"
    },
    {
      id: 3,
      type: "Art",
      title: "Digital Art Collection",
      price: "$125K",
      image: "/assets/art/digital-collection.jpg",
      yield: "15.8%",
      location: "Virtual Gallery",
      fractionalPrice: "$95",
      totalShares: 1316,
      soldShares: 987,
      category: "🎨",
      risk: "High"
    }
  ];

  const [activeAsset, setActiveAsset] = useState(0);

  const [isAutoPlay, setIsAutoPlay] = useState(true);
  
  // Switch between AI Search and Marketplace views every 6 seconds (only when auto-playing)
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const viewInterval = setInterval(() => {
      setCurrentView((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(viewInterval);
  }, [isAutoPlay]);
  
  // Handle manual view switching
  const handleViewClick = (viewIndex) => {
    setCurrentView(viewIndex);
    setIsAutoPlay(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };

  // Animate pins in AI Search view
  useEffect(() => {
    if (currentView === 0) {
      const pinInterval = setInterval(() => {
        setActivePin((prev) => (prev + 1) % pinData.length);
      }, 2000);
      return () => clearInterval(pinInterval);
    }
  }, [currentView, pinData.length]);

  // Animate assets in Marketplace view
  useEffect(() => {
    if (currentView === 1) {
      const assetInterval = setInterval(() => {
        setActiveAsset((prev) => (prev + 1) % marketplaceAssets.length);
      }, 3000);
      return () => clearInterval(assetInterval);
    }
  }, [currentView, marketplaceAssets.length]);

  const AISearchView = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-6xl mx-auto border border-gray-200">
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <img src="/assets/images/TopLogo.webp" alt="FractionaX Logo" className="h-8 w-auto" />
            </div>
            <div className="flex-1 relative">
              <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value="High-yield rentals in Houston, TX"
                readOnly
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm text-gray-800"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100">
              <ShieldCheck className="w-4 h-4" />
              Low Risk
            </button>
            <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100">
              📍 Popular
            </button>
            <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100">
              📈 9%+ Yield
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden">
        <img
          src="/assets/images/GoogleMapCover.webp"
          alt="Map Preview"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
        />

        {pinData.map((pin, idx) => (
          <div
            key={idx}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-white text-xs bg-blue-600 px-2 py-1 rounded-full shadow cursor-pointer group transition-all duration-500 ${
              activePin === idx ? 'opacity-100 z-10 scale-110' : 'opacity-70 scale-100'
            }`}
            style={{ top: pin.top, left: pin.left }}
          >
            {pin.price}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition">
              {pin.insight}
            </div>
          </div>
        ))}

        {/* Animated Floating Property Card */}
        {pinData[activePin] && (
          <motion.div
            key={activePin}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg border p-4 w-[260px]"
          >
            <img
              src="/assets/properties/duplex-houston.jpg"
              alt="Selected Property"
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h4 className="font-semibold text-gray-900 mb-1 text-sm">{pinData[activePin].insight}</h4>
            <p className="text-blue-600 font-bold text-sm">{pinData[activePin].price}</p>
            <button className="text-xs text-blue-500 mt-2 hover:underline">View Details</button>
          </motion.div>
        )}

        <div className="absolute top-4 right-4 space-y-2">
          <button className="p-2 bg-white rounded-full shadow border hover:bg-gray-100">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow border hover:bg-gray-100">
            <MapPin className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const MarketplaceView = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-6xl mx-auto border border-gray-200">
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/images/TopLogo.webp" alt="FractionaX Logo" className="h-8 w-auto" />
            <span className="text-gray-600 text-sm">Multi-Asset Marketplace</span>
          </div>
          <button className="p-2 bg-white rounded-lg shadow border hover:bg-gray-100">
            <Grid3X3 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🏠 Real Estate</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">🏎️ Luxury Cars</span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">🎨 Art & NFTs</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">🃏 Collectibles</span>
        </div>
      </div>

      <div className="p-4 h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden">
        <div className="grid gap-4 h-full">
          {marketplaceAssets.map((asset, idx) => {
            const isActive = activeAsset === idx;
            const progress = (asset.soldShares / asset.totalShares) * 100;
            
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.6, 
                  scale: isActive ? 1 : 0.95,
                  y: isActive ? 0 : 10
                }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={asset.image}
                      alt={asset.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                      <Heart className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{asset.category}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            asset.risk === 'High' ? 'bg-red-100 text-red-700' : 
                            asset.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {asset.risk} Risk
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{asset.title}</h3>
                        <p className="text-xs text-gray-500">{asset.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{asset.price}</div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          {asset.yield} yield
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Fractional from {asset.fractionalPrice}</span>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Eye className="w-3 h-3" />
                          {asset.soldShares}/{asset.totalShares} shares
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, delay: isActive ? 0.2 : 0 }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{Math.round(progress)}% funded</span>
                        {isActive && (
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Invest Now
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-4 text-white">
      <div className="relative">
        {/* View indicator */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div 
            className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow border cursor-pointer group hover:shadow-lg transition-all duration-200"
            onClick={() => handleViewClick(currentView === 0 ? 1 : 0)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                currentView === 0 ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick(0);
              }}
              whileHover={{ scale: currentView === 0 ? 1.25 : 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="AI Search"
            />
            <motion.span 
              className="text-xs text-gray-600 font-medium group-hover:text-blue-600 transition-colors"
              animate={{ 
                color: currentView === 0 ? '#2563eb' : currentView === 1 ? '#7c3aed' : '#6b7280'
              }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 0 ? '🔍 AI Search' : '🏪 Marketplace'}
            </motion.span>
            <motion.div 
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                currentView === 1 ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick(1);
              }}
              whileHover={{ scale: currentView === 1 ? 1.25 : 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Marketplace"
            />
          </motion.div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: currentView === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentView === 0 ? 20 : -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {currentView === 0 ? <AISearchView /> : <MarketplaceView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
