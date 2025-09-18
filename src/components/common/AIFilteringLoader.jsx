import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🤖 AI Filtering Loading Component
 * 
 * Shows progress and status during OpenAI property analysis
 */
const AIFilteringLoader = ({ 
  isLoading = false, 
  loadingStage = 'idle', 
  loadingMessage = '', 
  progress = 0,
  showCancel = false,
  onCancel = null
}) => {
  if (!isLoading) return null;

  const getStageIcon = () => {
    switch (loadingStage) {
      case 'starting':
        return '🚀';
      case 'discovering':
        return '🔍';
      case 'analyzing':
        return '🤖';
      case 'complete':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStageColor = () => {
    switch (loadingStage) {
      case 'analyzing':
        return 'bg-blue-600';
      case 'complete':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{getStageIcon()}</div>
          <h3 className="text-xl font-bold text-gray-900">
            {loadingStage === 'analyzing' ? 'AI Analyzing Properties' : 'Loading Properties'}
          </h3>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${getStageColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <p className="text-gray-700 text-sm">
            {loadingMessage || 'Processing...'}
          </p>
        </div>

        {/* Time Estimates */}
        {loadingStage === 'analyzing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">🧠</div>
              <div>
                <p className="text-blue-800 font-medium text-sm">AI Analysis in Progress</p>
                <p className="text-blue-600 text-xs mt-1">
                  OpenAI is evaluating properties for investment potential. 
                  This may take 30-120 seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stage Indicators */}
        <div className="flex justify-between text-xs text-gray-500 mb-6">
          <div className={`flex items-center ${loadingStage === 'discovering' || progress > 20 ? 'text-blue-600' : ''}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${progress > 20 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            Discovering
          </div>
          <div className={`flex items-center ${loadingStage === 'analyzing' || progress > 40 ? 'text-blue-600' : ''}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${progress > 40 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            AI Analysis
          </div>
          <div className={`flex items-center ${loadingStage === 'complete' ? 'text-green-600' : ''}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${progress === 100 ? 'bg-green-600' : 'bg-gray-300'}`} />
            Complete
          </div>
        </div>

        {/* Cancel Button */}
        {showCancel && onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Cancel and show all properties
            </button>
          </div>
        )}

        {/* Timeout Warning */}
        {loadingStage === 'analyzing' && progress >= 40 && (
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Taking longer than expected? We'll automatically fall back to showing all properties after 2 minutes.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AIFilteringLoader;