import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsRobot, BsCoin } from 'react-icons/bs';
import { FiChevronDown, FiCheck, FiTrendingUp, FiZap, FiStar, FiCrown } from 'react-icons/fi';

const IntelligenceLevelSelector = ({ 
  selectedLevel = 'premium',
  onLevelChange,
  disabled = false,
  showCost = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const intelligenceLevels = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <FiTrendingUp className="w-4 h-4" />,
      coverage: '45%',
      description: 'Core property data + Walk Score + Schools',
      features: ['Property listings', 'Walk Score analysis', 'School information', 'Basic market data'],
      cost: 'Free',
      costPerProperty: 0,
      color: 'gray',
      processingTime: '~2 seconds',
      recommended: false
    },
    {
      id: 'standard',
      name: 'Standard',
      icon: <FiZap className="w-4 h-4" />,
      coverage: '75%',
      description: 'Enhanced data with Google Places + Maps',
      features: ['Everything in Basic', 'Google Places amenities', 'Google Maps intelligence', 'Location insights'],
      cost: '$1.12',
      costPerProperty: 1.12,
      color: 'blue',
      processingTime: '~5 seconds',
      recommended: false
    },
    {
      id: 'full',
      name: 'Full',
      icon: <FiStar className="w-4 h-4" />,
      coverage: '95%',
      description: 'Comprehensive analysis with visual + demographics',
      features: ['Everything in Standard', 'Google Street View analysis', 'US Census demographics', 'Investment scoring'],
      cost: '$1.90',
      costPerProperty: 1.90,
      color: 'purple',
      processingTime: '~8 seconds',
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <BsRobot className="w-4 h-4" />,
      coverage: '98%',
      description: 'AI-powered analysis with GPT-4 insights',
      features: ['Everything in Full', '🤖 AI Market Analysis', '🤖 Investment Insights', '🤖 Risk Assessment', '🤖 Strategic Recommendations'],
      cost: '$1.90',
      costPerProperty: 1.90,
      color: 'gradient',
      processingTime: '~15 seconds',
      recommended: false,
      premium: true
    }
  ];

  const selectedLevelData = intelligenceLevels.find(level => level.id === selectedLevel);

  const getColorClasses = (color, selected = false) => {
    if (color === 'gradient') {
      return selected 
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
        : 'border-gray-200 text-gray-700 hover:border-blue-300';
    }
    
    const colorMap = {
      gray: selected ? 'bg-gray-500 text-white border-gray-500' : 'border-gray-200 text-gray-700 hover:border-gray-300',
      blue: selected ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-700 hover:border-blue-300',
      purple: selected ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-200 text-gray-700 hover:border-purple-300'
    };
    
    return colorMap[color] || colorMap.gray;
  };

  const handleLevelSelect = (level) => {
    if (!disabled) {
      onLevelChange(level);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
          disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : getColorClasses(selectedLevelData?.color, true)
        } ${isOpen ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {selectedLevelData?.icon}
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{selectedLevelData?.name}</span>
              {selectedLevelData?.premium && (
                <FiCrown className="w-4 h-4 text-yellow-300" />
              )}
              {selectedLevelData?.recommended && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <div className="text-sm opacity-90">
              {selectedLevelData?.coverage} Intelligence Coverage
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showCost && (
            <div className="text-right text-sm">
              <div className="font-medium">{selectedLevelData?.cost}</div>
              <div className="opacity-75">per property</div>
            </div>
          )}
          <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            {intelligenceLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                  level.id === selectedLevel 
                    ? 'border-l-blue-500 bg-blue-50' 
                    : 'border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getColorClasses(level.color)}`}>
                        {level.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{level.name}</span>
                          {level.premium && (
                            <FiCrown className="w-4 h-4 text-yellow-500" />
                          )}
                          {level.recommended && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                          {level.id === selectedLevel && (
                            <FiCheck className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</div>
                        <div className="text-sm font-semibold text-gray-900">{level.coverage}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Processing</div>
                        <div className="text-sm font-semibold text-gray-900">{level.processingTime}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Features</div>
                      <div className="space-y-1">
                        {level.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                        {level.features.length > 3 && (
                          <div className="text-xs text-gray-500 italic">
                            +{level.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {showCost && (
                    <div className="text-right ml-4">
                      <div className={`text-lg font-bold ${level.cost === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
                        {level.cost}
                      </div>
                      <div className="text-xs text-gray-500">per property</div>
                    </div>
                  )}
                </div>
              </button>
            ))}
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <BsRobot className="w-3 h-3" />
                  <span>AI analysis available in Premium level</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BsCoin className="w-3 h-3" />
                  <span>Pay with FXCT tokens</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligenceLevelSelector;
