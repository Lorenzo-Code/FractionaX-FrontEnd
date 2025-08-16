import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, AlertCircle, Target, DollarSign, Lightbulb, Zap } from 'lucide-react';
import stakingApiService from '../../services/stakingApi';

const AIRecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [customParams, setCustomParams] = useState({
    riskTolerance: 'moderate',
    investmentAmount: '5000',
    duration: '60_days'
  });

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await stakingApiService.getAIRecommendations(params);
      setRecommendations(data.aiRecommendations);
    } catch (err) {
      console.error('Failed to load AI recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = () => {
    const params = {
      ...customParams,
      userId: selectedUser || undefined
    };
    loadRecommendations(params);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendationColor = (rank) => {
    switch (rank) {
      case 1: return 'border-green-200 bg-green-50';
      case 2: return 'border-blue-200 bg-blue-50';
      case 3: return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-600" size={20} />
          <h3 className="text-lg font-semibold text-red-900">Error Loading AI Recommendations</h3>
        </div>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => loadRecommendations()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="text-blue-600" size={24} />
            AI-Powered Staking Recommendations
          </h2>
          <p className="text-gray-600 mt-1">
            Intelligent portfolio optimization with market analysis and risk assessment
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(recommendations?.confidence || 0)}`}>
          {recommendations?.confidence || 0}% Confidence
        </div>
      </div>

      {/* AI Parameters Control */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Custom Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User ID (Optional)</label>
            <input
              type="text"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="Enter user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
            <select
              value={customParams.riskTolerance}
              onChange={(e) => setCustomParams({...customParams, riskTolerance: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
            <input
              type="number"
              value={customParams.investmentAmount}
              onChange={(e) => setCustomParams({...customParams, investmentAmount: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select
              value={customParams.duration}
              onChange={(e) => setCustomParams({...customParams, duration: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="30_days">30 Days</option>
              <option value="60_days">60 Days</option>
              <option value="90_days">90 Days</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleGenerateRecommendations}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Zap size={16} />
          Generate AI Recommendations
        </button>
      </div>

      {recommendations && (
        <>
          {/* Market Conditions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Market Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Sentiment</p>
                <p className={`text-lg font-semibold ${
                  recommendations.marketConditions.overallSentiment === 'bullish' ? 'text-green-600' : 
                  recommendations.marketConditions.overallSentiment === 'bearish' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {recommendations.marketConditions.overallSentiment?.toUpperCase()}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Volatility Index</p>
                <p className="text-lg font-semibold text-gray-900">
                  {recommendations.marketConditions.volatilityIndex}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Liquidity Score</p>
                <p className="text-lg font-semibold text-blue-600">
                  {recommendations.marketConditions.liquidityScore}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Risk Adjustment</p>
                <p className="text-lg font-semibold text-green-600">
                  {recommendations.marketConditions.riskAdjustment}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Recommendation Bias</p>
                <p className="text-lg font-semibold text-purple-600">
                  {recommendations.marketConditions.recommendationBias?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Target className="text-blue-600" size={20} />
              Top AI Recommendations
            </h3>
            
            {recommendations.topRecommendations?.map((rec) => (
              <div
                key={rec.rank}
                className={`border-2 rounded-lg p-6 ${getRecommendationColor(rec.rank)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                        #{rec.rank}
                      </span>
                      <h4 className="text-xl font-semibold text-gray-900">{rec.protocol}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Match Score: {rec.matchScore}%</span>
                      <span>Risk: {rec.recommendation.riskLevel}</span>
                      <span>Duration: {rec.recommendation.timeHorizon}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {rec.recommendation.expectedAPY}% APY
                    </p>
                    <p className="text-sm text-gray-600">
                      ${rec.recommendation.allocatedAmount?.toLocaleString()} allocation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Reasoning */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb size={16} className="text-yellow-600" />
                      AI Reasoning
                    </h5>
                    <ul className="space-y-1">
                      {rec.reasoning?.map((reason, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Brain size={16} className="text-blue-600" />
                      AI Insights
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sentiment Score:</span>
                        <span className="ml-1 font-medium text-blue-600">
                          {(rec.aiInsights?.sentimentScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Technical:</span>
                        <span className="ml-1 font-medium text-green-600">
                          {rec.aiInsights?.technicalStrength}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Market Timing:</span>
                        <span className="ml-1 font-medium text-purple-600">
                          {rec.aiInsights?.marketTiming}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">vs Market:</span>
                        <span className="ml-1 font-medium text-green-600">
                          {rec.aiInsights?.competitorComparison}
                        </span>
                      </div>
                    </div>
                    
                    {rec.warnings && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <h6 className="text-xs font-medium text-yellow-800 mb-1">Warnings:</h6>
                        <ul className="text-xs text-yellow-700">
                          {rec.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded border">
                  <div className="text-sm text-gray-600">
                    <strong>Projected Return:</strong> ${rec.recommendation.projectedReturn?.toLocaleString()} 
                    over {rec.recommendation.timeHorizon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimized Strategy */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Target className="text-green-600" size={20} />
              Optimized Portfolio Strategy
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommended Allocation</h4>
                <div className="space-y-2">
                  {Object.entries(recommendations.optimizedStrategy?.portfolioAllocation || {}).map(([protocol, percentage]) => (
                    <div key={protocol} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">
                        {protocol.replace('fxct_', '').replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Expected Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-600 font-medium">Blended APY</p>
                    <p className="text-xl font-bold text-blue-700">
                      {recommendations.optimizedStrategy?.expectedMetrics?.blendedAPY}%
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600 font-medium">Total Return</p>
                    <p className="text-xl font-bold text-green-700">
                      ${recommendations.optimizedStrategy?.expectedMetrics?.totalProjectedReturn?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm text-yellow-600 font-medium">Risk Score</p>
                    <p className="text-xl font-bold text-yellow-700">
                      {recommendations.optimizedStrategy?.expectedMetrics?.riskScore}/100
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-sm text-purple-600 font-medium">Diversity Score</p>
                    <p className="text-xl font-bold text-purple-700">
                      {recommendations.optimizedStrategy?.expectedMetrics?.diversificationScore}/100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing Recommendations */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Timing Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(recommendations.optimizedStrategy?.timingRecommendations || {}).map(([timeframe, recommendation]) => (
                  <div key={timeframe} className="text-center">
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {timeframe.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-900 mt-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Confidence Metrics */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Confidence Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Recommendation Strength</p>
                <p className="text-lg font-semibold text-green-600">
                  {recommendations.aiConfidence?.recommendationStrength?.toUpperCase()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Data Quality</p>
                <p className="text-lg font-semibold text-blue-600">
                  {recommendations.aiConfidence?.dataQuality}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Model Accuracy</p>
                <p className="text-lg font-semibold text-purple-600">
                  {recommendations.aiConfidence?.modelAccuracy}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Historical Performance</p>
                <p className="text-lg font-semibold text-green-600">
                  {recommendations.aiConfidence?.historicalPerformance}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIRecommendationsPanel;
