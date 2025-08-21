import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiMapPin, 
  FiCpu, 
  FiHome,
  FiTrendingUp,
  FiFilter,
  FiTarget,
  FiMap,
  FiZap,
  FiUser
} from "react-icons/fi";
import { BsRobot, BsBuilding } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";

// Import the existing AI search component
import SmartPropertySearch from "../../admin/ai-search/components/SmartPropertySearch";

// Search modes configuration
const SEARCH_MODES = [
  {
    id: 'internal',
    name: 'Internal Search',
    shortName: 'Internal',
    icon: <FiSearch className="w-5 h-5" />,
    color: 'blue',
    description: 'Search marketplace assets',
    subtitle: 'Real estate, cars, NFTs, collectibles, DeFi',
    placeholder: 'Search by location, asset type, price range...',
    features: ['Real-time filtering', 'Multi-asset support', 'Advanced filters'],
    audience: 'General Users'
  },
  {
    id: 'ai-search',
    name: 'AI Property Research',
    shortName: 'AI Research', 
    icon: <BsRobot className="w-5 h-5" />,
    color: 'purple',
    description: 'Intelligent property discovery',
    subtitle: 'Natural language search with AI insights',
    placeholder: 'Describe your ideal investment property...',
    features: ['Natural language', 'Market analysis', 'Investment insights'],
    audience: 'Investors'
  },
  {
    id: 'address-search',
    name: 'Professional Address Lookup',
    shortName: 'Address Lookup',
    icon: <FiMapPin className="w-5 h-5" />,
    color: 'green',
    description: 'Detailed property data lookup',
    subtitle: 'Professional tools for real estate pros',
    placeholder: 'Enter specific address for detailed analysis...',
    features: ['Address verification', 'Property analytics', 'Market comparables'],
    audience: 'Professionals'
  }
];

const MultiModeSearch = ({ 
  onSearch,
  onModeChange,
  defaultMode = 'internal',
  showModeSelector = true,
  className = "",
  // AI search props
  chatMessages = [],
  setChatMessages,
  // Internal search props
  onInternalSearch,
  searchQuery = "",
  setSearchQuery,
  // Address search props
  onAddressSearch
}) => {
  const [activeMode, setActiveMode] = useState(defaultMode);
  const [query, setQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const inputRef = useRef(null);

  const currentMode = SEARCH_MODES.find(mode => mode.id === activeMode);

  // Update query when external searchQuery changes
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  // Notify parent component when mode changes
  useEffect(() => {
    if (onModeChange) {
      onModeChange(activeMode);
    }
  }, [activeMode, onModeChange]);

  const handleModeChange = (modeId) => {
    setActiveMode(modeId);
    setQuery('');
    if (setSearchQuery) {
      setSearchQuery('');
    }
    // Focus input after mode change
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);

    try {
      switch (activeMode) {
        case 'internal':
          if (onInternalSearch) {
            await onInternalSearch(searchQuery);
          }
          if (setSearchQuery) {
            setSearchQuery(searchQuery);
          }
          break;
        
        case 'ai-search':
          // Use the existing SmartPropertySearch logic
          if (onSearch) {
            await onSearch(searchQuery, 'ai-search');
          }
          break;
        
        case 'address-search':
          if (onAddressSearch) {
            await onAddressSearch(searchQuery);
          }
          break;
          
        default:
          if (onSearch) {
            await onSearch(searchQuery, activeMode);
          }
      }
    } catch (error) {
      console.error(`Search error (${activeMode}):`, error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color, variant = 'default') => {
    const colorMap = {
      blue: {
        default: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
        active: 'border-blue-500 bg-blue-500 text-white shadow-lg',
        accent: 'text-blue-600 bg-blue-50 border-blue-200'
      },
      purple: {
        default: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
        active: 'border-purple-500 bg-purple-500 text-white shadow-lg',
        accent: 'text-purple-600 bg-purple-50 border-purple-200'
      },
      green: {
        default: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
        active: 'border-green-500 bg-green-500 text-white shadow-lg',
        accent: 'text-green-600 bg-green-50 border-green-200'
      }
    };
    
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  // For AI search mode, use the existing SmartPropertySearch component
  if (activeMode === 'ai-search') {
    return (
      <div className={`w-full ${className}`}>
        {showModeSelector && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {SEARCH_MODES.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isActive 
                        ? getColorClasses(mode.color, 'active')
                        : getColorClasses(mode.color, 'default')
                    }`}
                  >
                    {mode.icon}
                    <span className="font-medium">{mode.shortName}</span>
                  </button>
                );
              })}
            </div>
            <div className="text-center mb-4">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center justify-center gap-2">
                {currentMode.icon}
                {currentMode.name}
              </h3>
              <p className="text-gray-600 text-sm">{currentMode.description}</p>
            </div>
          </div>
        )}
        
        <SmartPropertySearch
          showInput={true}
          showSuggestions={true}
          onSearch={onSearch}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          placeholder={currentMode.placeholder}
        />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mode Selector */}
      {showModeSelector && (
        <div className="mb-6">
          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {SEARCH_MODES.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isActive 
                      ? getColorClasses(mode.color, 'active')
                      : getColorClasses(mode.color, 'default')
                  }`}
                >
                  {mode.icon}
                  <span className="font-medium">{mode.shortName}</span>
                </button>
              );
            })}
          </div>
          
          {/* Active Mode Info */}
          <div className="text-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center justify-center gap-2">
              {currentMode.icon}
              {currentMode.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{currentMode.description}</p>
            <p className="text-xs text-gray-500">{currentMode.subtitle}</p>
          </div>

          {/* Mode Features */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {currentMode.features.map((feature, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full border ${getColorClasses(currentMode.color, 'accent')}`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search Interface */}
      <div className="relative">
        <div className="relative group">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {currentMode.icon}
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder={currentMode.placeholder}
            className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-500"
            disabled={loading}
          />

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2.5 rounded-lg font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
              getColorClasses(currentMode.color, 'active')
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Searching
              </div>
            ) : (
              <div className="flex items-center">
                <FiSearch className="w-4 h-4 mr-2" />
                Search
              </div>
            )}
          </button>
        </div>

        {/* Search Tips */}
        <div className="mt-4 text-center">
          {activeMode === 'internal' && (
            <p className="text-sm text-gray-500">
              Try: <span className="text-gray-700 font-medium">"downtown condo under $500k"</span> or 
              <span className="text-gray-700 font-medium"> "luxury cars 1960s"</span>
            </p>
          )}
          {activeMode === 'address-search' && (
            <p className="text-sm text-gray-500">
              Try: <span className="text-gray-700 font-medium">"1234 Main St, Houston, TX"</span> or 
              <span className="text-gray-700 font-medium"> "77002 zip code analysis"</span>
            </p>
          )}
        </div>

        {/* Advanced Options Toggle (for internal and address search) */}
        {(activeMode === 'internal' || activeMode === 'address-search') && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center mx-auto"
            >
              <FiFilter className="w-4 h-4 mr-1" />
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>
        )}

        {/* Advanced Options Panel */}
        <AnimatePresence>
          {showAdvancedOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {activeMode === 'internal' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Filter by Asset Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { id: 'real-estate', name: 'Real Estate', icon: <FiHome className="w-4 h-4" /> },
                      { id: 'luxury-cars', name: 'Luxury Cars', icon: <FiTrendingUp className="w-4 h-4" /> },
                      { id: 'art-nfts', name: 'Art & NFTs', icon: <HiOutlineSparkles className="w-4 h-4" /> },
                      { id: 'collectibles', name: 'Collectibles', icon: <FiTarget className="w-4 h-4" /> },
                      { id: 'defi-yield', name: 'DeFi Yield', icon: <FiZap className="w-4 h-4" /> }
                    ].map((type) => (
                      <button
                        key={type.id}
                        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                      >
                        {type.icon}
                        <span>{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {activeMode === 'address-search' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Analysis Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      'Property Details',
                      'Market Comparables',
                      'Investment Analysis',
                      'Neighborhood Data'
                    ].map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Benefits */}
      <div className="mt-6 text-center">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${getColorClasses(currentMode.color, 'accent')}`}>
          <FiUser className="w-3 h-3" />
          <span>Perfect for {currentMode.audience}</span>
        </div>
      </div>
    </div>
  );
};

export default MultiModeSearch;
