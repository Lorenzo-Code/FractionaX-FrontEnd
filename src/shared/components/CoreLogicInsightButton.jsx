import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Lock, 
  Eye, 
  AlertCircle,
  DollarSign,
  Home,
  MapPin,
  Calendar,
  Users,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useCoreLogicInsights from '../hooks/useCoreLogicInsights';

const CoreLogicInsightButton = ({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  insightType = 'market-analysis',
  propertyAddress = '',
  customInsightData = null,
  showCounter = true
}) => {
  const {
    canViewInsight,
    viewInsight,
    getRemainingInsights,
    requiresLogin,
    isUnlimited
  } = useCoreLogicInsights();

  const [showInsight, setShowInsight] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration for different insight types
  const insightConfigs = {
    'market-analysis': {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Get detailed market trends and price analysis',
      color: 'blue',
      mockData: {
        medianPrice: '$485,000',
        priceChange: '+8.2%',
        daysOnMarket: '23 days',
        inventoryLevel: 'Low',
        demandScore: '8.5/10'
      }
    },
    'comparable-sales': {
      icon: BarChart3,
      title: 'Comparable Sales',
      description: 'View recent comparable property sales',
      color: 'green',
      mockData: {
        recentSales: 12,
        avgSalePrice: '$467,500',
        priceRange: '$420K - $515K',
        avgDaysOnMarket: '18 days',
        salesTrend: 'Increasing'
      }
    },
    'property-history': {
      icon: Calendar,
      title: 'Property History',
      description: 'Complete ownership and transaction history',
      color: 'purple',
      mockData: {
        lastSold: '2019 - $395,000',
        previousOwners: '3 previous owners',
        yearBuilt: '2015',
        renovations: 'Kitchen (2020), Roof (2021)',
        propertyTax: '$6,750/year'
      }
    },
    'neighborhood-insights': {
      icon: MapPin,
      title: 'Neighborhood Data',
      description: 'Demographics, schools, and local insights',
      color: 'orange',
      mockData: {
        avgIncome: '$78,500',
        crimeRate: 'Below Average',
        schoolRating: '8.5/10',
        walkScore: '72/100',
        demographics: 'Family-oriented'
      }
    },
    'investment-analysis': {
      icon: DollarSign,
      title: 'Investment Analysis',
      description: 'ROI projections and rental estimates',
      color: 'emerald',
      mockData: {
        estimatedRent: '$2,800/month',
        capRate: '6.8%',
        cashFlow: '+$450/month',
        appreciation: '5.2%/year',
        roiProjection: '12.5%'
      }
    }
  };

  const config = insightConfigs[insightType] || insightConfigs['market-analysis'];
  const IconComponent = config.icon;
  const remainingInsights = getRemainingInsights();

  // Handle insight button click
  const handleInsightClick = async () => {
    if (!canViewInsight()) {
      // This will trigger the login modal
      viewInsight();
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Record the insight view
    const canView = viewInsight();
    
    if (canView) {
      setShowInsight(true);
    }
    
    setIsLoading(false);
  };

  // Size configurations
  const sizeConfigs = {
    sm: {
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      button: 'px-4 py-2.5 text-sm',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'px-6 py-3 text-base',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const sizeConfig = sizeConfigs[size];

  // Color configurations
  const colorConfigs = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
  };

  const colorConfig = colorConfigs[config.color];

  if (requiresLogin()) {
    // Show locked state
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleInsightClick}
          className={`${sizeConfig.button} bg-gray-100 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium`}
        >
          <Lock className={sizeConfig.icon} />
          <span>{config.title} - Login Required</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleInsightClick}
        disabled={isLoading}
        className={`${sizeConfig.button} bg-gradient-to-r ${colorConfig} text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <div className={`${sizeConfig.icon} animate-spin rounded-full border-2 border-white/30 border-t-white`} />
        ) : (
          <IconComponent className={sizeConfig.icon} />
        )}
        <span>{config.title}</span>
        
        {/* Show remaining count for free users */}
        {!isUnlimited && showCounter && remainingInsights !== null && (
          <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {remainingInsights} left
          </span>
        )}
      </button>

      {/* Insight Modal/Popup */}
      <AnimatePresence>
        {showInsight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInsight(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${colorConfig} text-white p-6 rounded-t-xl`}>
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className="w-6 h-6" />
                  <h3 className="text-xl font-bold">{config.title}</h3>
                  <div className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
                    CoreLogic Data
                  </div>
                </div>
                <p className="text-white/90">{config.description}</p>
                {propertyAddress && (
                  <p className="text-sm text-white/80 mt-1">{propertyAddress}</p>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {customInsightData ? (
                  <div>{customInsightData}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(config.mockData).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Premium notice */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Premium CoreLogic Data
                          </h4>
                          <p className="text-blue-800 text-sm">
                            This data is powered by CoreLogic's comprehensive property database, 
                            providing you with accurate and up-to-date market intelligence.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Usage remaining notice */}
                    {!isUnlimited && remainingInsights !== null && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>
                            You have {remainingInsights} free insight{remainingInsights !== 1 ? 's' : ''} remaining today.
                            {remainingInsights === 0 && (
                              <Link to="/login" className="ml-1 text-yellow-900 underline font-medium">
                                Upgrade for unlimited access
                              </Link>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t bg-gray-50 px-6 py-4 rounded-b-xl flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Data updated: {new Date().toLocaleDateString()}
                </div>
                <button
                  onClick={() => setShowInsight(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoreLogicInsightButton;
