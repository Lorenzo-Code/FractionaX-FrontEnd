import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiAward,
  FiInfo,
  FiStar,
  FiGift,
  FiTarget,
  FiDollarSign,
  FiPercent,
  FiUsers,
  FiShield
} from 'react-icons/fi';
import { BsCoin } from 'react-icons/bs';

const FXCTCalculator = ({ userActivity = {}, userStatus = 'non-accredited' }) => {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [selectedTier, setSelectedTier] = useState('basic');
  const [showDetails, setShowDetails] = useState(false);

  // Calculate bonus percentage based on user activity
  const calculateActivityBonus = () => {
    const { totalCommitments = 0, totalLikes = 0, totalShares = 0 } = userActivity;
    
    let bonusPercentage = 0;
    
    // Base participation bonus (2%)
    if (totalCommitments > 0 || totalLikes > 0) {
      bonusPercentage += 2;
    }
    
    // Commitment activity bonus (up to 4%)
    if (totalCommitments >= 1) bonusPercentage += 1;
    if (totalCommitments >= 3) bonusPercentage += 1;
    if (totalCommitments >= 5) bonusPercentage += 1;
    if (totalCommitments >= 10) bonusPercentage += 1;
    
    // Social engagement bonus (up to 2%)
    if (totalLikes >= 5) bonusPercentage += 1;
    if (totalShares >= 2) bonusPercentage += 1;
    
    // Diversity bonus (up to 2%)
    if (totalCommitments >= 2 && totalLikes >= 3 && totalShares >= 1) {
      bonusPercentage += 2;
    }
    
    return Math.min(bonusPercentage, 10); // Cap at 10%
  };

  const activityBonus = calculateActivityBonus();

  // Token tiers and calculations
  const tokenTiers = {
    basic: {
      name: 'Basic FXCT',
      baseRate: 1, // $1 = 1 FXCT
      minInvestment: 100,
      description: 'Standard utility tokens for marketplace participation',
      benefits: ['Property interest commitments', 'Basic marketplace access', 'Community voting rights']
    },
    premium: {
      name: 'Premium FXST',
      baseRate: 10, // $1 = 0.1 FXST  
      minInvestment: 1000,
      description: 'Security tokens with ownership rights and revenue sharing',
      benefits: ['Fractional property ownership', 'Revenue distributions', 'Priority access to deals', 'Governance rights']
    },
    institutional: {
      name: 'Institutional FXST',
      baseRate: 100, // $1 = 0.01 FXST
      minInvestment: 10000,
      description: 'High-value security tokens for institutional investors',
      benefits: ['Large property positions', 'Institutional-grade reporting', 'Direct property management input', 'Custom deal structures']
    }
  };

  const currentTier = tokenTiers[selectedTier];
  const baseTokens = investmentAmount * currentTier.baseRate;
  const bonusTokens = (baseTokens * activityBonus) / 100;
  const totalTokens = baseTokens + bonusTokens;

  // Activity requirements for maximum bonus
  const getNextBonusTier = () => {
    const { totalCommitments = 0, totalLikes = 0, totalShares = 0 } = userActivity;
    
    if (activityBonus < 10) {
      const missing = [];
      
      if (totalCommitments < 10) missing.push(`${10 - totalCommitments} more property interests`);
      if (totalLikes < 5) missing.push(`${5 - totalLikes} more likes`);
      if (totalShares < 2) missing.push(`${2 - totalShares} more shares`);
      
      return missing.slice(0, 2); // Show top 2 recommendations
    }
    
    return [];
  };

  const nextBonusActions = getNextBonusTier();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <BsCoin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">FXCT/FXST Token Calculator</h2>
            <p className="text-sm text-gray-600">Calculate your tokens with marketplace participation bonuses</p>
          </div>
        </div>
        
        {userStatus === 'non-accredited' && (
          <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <FiGift className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Up to 10% Bonus!</span>
            </div>
          </div>
        )}
      </div>

      {/* Current Activity Status */}
      {userStatus === 'non-accredited' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FiAward className="w-5 h-5 mr-2 text-orange-500" />
              Your Marketplace Bonus: {activityBonus}%
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              <FiInfo className="w-4 h-4 mr-1" />
              {showDetails ? 'Less' : 'Details'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">{userActivity.totalCommitments || 0}</div>
              <div className="text-xs text-gray-600">Properties Interested</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-lg font-bold text-red-600">{userActivity.totalLikes || 0}</div>
              <div className="text-xs text-gray-600">Properties Liked</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-600">{userActivity.totalShares || 0}</div>
              <div className="text-xs text-gray-600">Properties Shared</div>
            </div>
          </div>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-200 pt-3"
            >
              <h4 className="font-medium text-gray-900 mb-2">Bonus Breakdown:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base participation:</span>
                  <span className="font-medium">{(userActivity.totalCommitments || 0) > 0 ? '+2%' : '0%'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commitment activity:</span>
                  <span className="font-medium">+{Math.min(Math.floor((userActivity.totalCommitments || 0) / 2.5), 4)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social engagement:</span>
                  <span className="font-medium">+{Math.min(Math.floor((userActivity.totalLikes || 0) / 5) + Math.floor((userActivity.totalShares || 0) / 2), 2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diversity bonus:</span>
                  <span className="font-medium">{(userActivity.totalCommitments >= 2 && userActivity.totalLikes >= 3 && userActivity.totalShares >= 1) ? '+2%' : '0%'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {nextBonusActions.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
              <div className="flex items-center mb-2">
                <FiTarget className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">Increase your bonus:</span>
              </div>
              <ul className="text-sm text-orange-700 space-y-1">
                {nextBonusActions.map((action, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mr-2"></div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Input */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Investment Calculator</h3>
          
          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (USD)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(100, Number(e.target.value)))}
                min="100"
                step="100"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Token Tier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Token Tier
            </label>
            <div className="space-y-2">
              {Object.entries(tokenTiers).map(([key, tier]) => (
                <div
                  key={key}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedTier === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${investmentAmount < tier.minInvestment ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => investmentAmount >= tier.minInvestment && setSelectedTier(key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BsCoin className={`w-5 h-5 ${selectedTier === key ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium text-gray-900">{tier.name}</div>
                        <div className="text-sm text-gray-600">Min: ${tier.minInvestment.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$1 = {tier.baseRate} {tier.name.includes('FXCT') ? 'FXCT' : 'FXST'}</div>
                      {investmentAmount < tier.minInvestment && (
                        <div className="text-xs text-red-500">Insufficient amount</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculator Results */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Token Calculation Results
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Base Tokens</span>
                <span className="font-medium">{baseTokens.toLocaleString()} {currentTier.name.includes('FXCT') ? 'FXCT' : 'FXST'}</span>
              </div>
              
              {userStatus === 'non-accredited' && activityBonus > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-green-600">Marketplace Bonus ({activityBonus}%)</span>
                  <span className="font-medium text-green-600">+{bonusTokens.toFixed(2)} {currentTier.name.includes('FXCT') ? 'FXCT' : 'FXST'}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Tokens</span>
                  <span className="font-bold text-lg text-blue-600">{totalTokens.toFixed(2)} {currentTier.name.includes('FXCT') ? 'FXCT' : 'FXST'}</span>
                </div>
              </div>
            </div>

            {/* Token Benefits */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{currentTier.name} Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {currentTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <FiStar className="w-3 h-3 text-yellow-500 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Investment Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-medium">${investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Effective Rate:</span>
                  <span className="font-medium">
                    $1 = {(totalTokens / investmentAmount).toFixed(3)} {currentTier.name.includes('FXCT') ? 'FXCT' : 'FXST'}
                  </span>
                </div>
                {userStatus === 'non-accredited' && activityBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Bonus Value:</span>
                    <span className="font-medium text-green-600">${(bonusTokens / currentTier.baseRate).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center">
              <BsCoin className="w-5 h-5 mr-2" />
              Purchase {totalTokens.toFixed(2)} {currentTier.name.includes('FXCT') ? 'FXCT' : 'FXST'}
            </button>
          </div>
        </div>
      </div>

      {/* Non-Accredited Investor Notice */}
      {userStatus === 'non-accredited' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FiShield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Non-Accredited Investor Bonus Program</h4>
              <p className="text-sm text-green-700 mt-1">
                As a non-accredited investor, you can earn up to 10% bonus tokens by actively participating in the marketplace. 
                Show interest in properties, engage with listings, and share opportunities to maximize your bonus!
              </p>
              <div className="mt-2 text-xs text-green-600">
                <strong>Current bonus:</strong> {activityBonus}% • <strong>Maximum possible:</strong> 10%
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FXCTCalculator;
