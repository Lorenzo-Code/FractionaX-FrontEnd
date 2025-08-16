import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  DollarSign,
  Calendar,
  Star,
  ArrowRight,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useCoreLogicInsights from '../hooks/useCoreLogicInsights';

const CoreLogicLoginModal = () => {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    freeUserLimit,
    insightCount 
  } = useCoreLogicInsights();

  if (!showLoginModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={() => setShowLoginModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                CoreLogic Insights Limit Reached
              </h3>
              
              <p className="text-blue-100">
                You've used all {freeUserLimit} free insights today. 
                Unlock unlimited access to premium property data.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Usage indicator */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Free Insights Used</span>
                <span className="text-sm font-bold text-gray-900">{insightCount}/{freeUserLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(insightCount / freeUserLimit) * 100}%` }}
                />
              </div>
            </div>

            {/* Premium features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Upgrade to unlock unlimited access to:
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Market Analysis</div>
                    <div className="text-sm text-gray-600">Real-time market trends and pricing data</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Comparable Sales</div>
                    <div className="text-sm text-gray-600">Recent sales data and price comparisons</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Neighborhood Insights</div>
                    <div className="text-sm text-gray-600">Demographics, schools, and local data</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Investment Analysis</div>
                    <div className="text-sm text-gray-600">ROI calculations and rental estimates</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Property History</div>
                    <div className="text-sm text-gray-600">Complete ownership and transaction history</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium badge */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">
                    Powered by CoreLogic
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    Get access to the same premium data that real estate professionals use, 
                    including comprehensive market analysis and property intelligence.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                onClick={() => setShowLoginModal(false)}
              >
                <ArrowRight className="w-5 h-5" />
                Upgrade Now - Unlimited Access
              </Link>

              <Link
                to="/pricing"
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
                onClick={() => setShowLoginModal(false)}
              >
                View Pricing Plans
              </Link>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CoreLogicLoginModal;
