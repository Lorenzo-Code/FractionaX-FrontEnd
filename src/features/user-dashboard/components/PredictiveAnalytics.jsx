import React, { useState, useMemo } from 'react';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  BarChart3,
  Activity,
  AlertCircle,
  Info,
  CheckCircle,
  Star,
  Award,
  DollarSign,
  Percent,
  Calendar,
  MapPin,
  Building,
  Lightbulb,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const PredictiveAnalytics = ({ portfolioData, marketData, userPreferences }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [showDetailed, setShowDetailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock AI model predictions and insights
  const mockAIPredictions = {
    portfolioProjections: {
      '6M': {
        expectedValue: 145320.75,
        confidence: 78,
        upside: 152000,
        downside: 138500,
        expectedReturn: 15.5,
        volatility: 11.2,
        scenarios: {
          optimistic: { return: 22.1, probability: 25 },
          realistic: { return: 15.5, probability: 50 },
          pessimistic: { return: 8.3, probability: 25 }
        }
      },
      '1Y': {
        expectedValue: 163850.25,
        confidence: 72,
        upside: 175200,
        downside: 151800,
        expectedReturn: 30.2,
        volatility: 14.8,
        scenarios: {
          optimistic: { return: 39.4, probability: 30 },
          realistic: { return: 30.2, probability: 40 },
          pessimistic: { return: 20.7, probability: 30 }
        }
      },
      '3Y': {
        expectedValue: 248750.50,
        confidence: 65,
        upside: 285000,
        downside: 220500,
        expectedReturn: 97.8,
        volatility: 18.5,
        scenarios: {
          optimistic: { return: 126.5, probability: 25 },
          realistic: { return: 97.8, probability: 50 },
          pessimistic: { return: 75.2, probability: 25 }
        }
      }
    },
    marketInsights: {
      trends: [
        {
          category: 'Residential',
          trend: 'positive',
          strength: 85,
          driver: 'Low inventory and high demand',
          timeframe: '12-18 months',
          impact: 'high'
        },
        {
          category: 'Commercial',
          trend: 'neutral',
          strength: 60,
          driver: 'Remote work normalization',
          timeframe: '6-12 months',
          impact: 'medium'
        },
        {
          category: 'Interest Rates',
          trend: 'negative',
          strength: 70,
          driver: 'Federal Reserve policy',
          timeframe: '3-6 months',
          impact: 'medium'
        }
      ],
      marketScores: {
        momentum: 73,
        volatility: 42,
        opportunity: 81,
        risk: 35
      }
    },
    recommendations: [
      {
        id: 1,
        type: 'investment',
        priority: 'high',
        category: 'Geographic Expansion',
        title: 'Consider Southeast Markets',
        description: 'AI models show strong growth potential in Atlanta, Nashville, and Raleigh markets.',
        reasoning: 'Population growth, job market expansion, and favorable regulatory environment.',
        expectedImpact: '+12-18% portfolio returns',
        confidence: 82,
        timeframe: '3-6 months',
        investmentRange: '$15,000 - $35,000',
        riskLevel: 'Medium',
        icon: MapPin,
        actionRequired: 'Research specific properties in these markets'
      },
      {
        id: 2,
        type: 'optimization',
        priority: 'medium',
        category: 'Portfolio Rebalancing',
        title: 'Reduce Commercial Exposure',
        description: 'Models predict potential headwinds for commercial real estate in your current markets.',
        reasoning: 'Work-from-home trends and urban office space oversupply.',
        expectedImpact: '+3-5% risk-adjusted returns',
        confidence: 74,
        timeframe: '1-3 months',
        investmentRange: 'Reallocate existing',
        riskLevel: 'Low',
        icon: BarChart3,
        actionRequired: 'Consider selling 1-2 commercial properties'
      },
      {
        id: 3,
        type: 'timing',
        priority: 'high',
        category: 'Market Timing',
        title: 'Accelerate Q4 Investments',
        description: 'ML models indicate optimal buying opportunity in Q4 2024 before rate changes.',
        reasoning: 'Seasonal market patterns and anticipated policy changes.',
        expectedImpact: '+8-12% timing alpha',
        confidence: 89,
        timeframe: '1-2 months',
        investmentRange: '$25,000 - $50,000',
        riskLevel: 'Medium',
        icon: Calendar,
        actionRequired: 'Prepare capital and identify target properties'
      }
    ],
    riskFactors: [
      {
        factor: 'Geographic Concentration',
        currentLevel: 'High',
        projectedTrend: 'Increasing',
        impact: 'High',
        mitigation: 'Diversify into 2-3 new markets',
        timeline: '6 months'
      },
      {
        factor: 'Interest Rate Sensitivity',
        currentLevel: 'Medium',
        projectedTrend: 'Stable',
        impact: 'Medium',
        mitigation: 'Consider fixed-rate financing',
        timeline: '3 months'
      }
    ]
  };

  const predictions = mockAIPredictions;
  const currentProjection = predictions.portfolioProjections[selectedTimeframe];

  // Calculate AI insights summary
  const aiInsights = useMemo(() => {
    const highPriorityRecs = predictions.recommendations.filter(r => r.priority === 'high').length;
    const avgConfidence = predictions.recommendations.reduce((sum, r) => sum + r.confidence, 0) / predictions.recommendations.length;
    const positiveOutlook = predictions.marketInsights.marketScores.opportunity > 70;
    
    return {
      highPriorityActions: highPriorityRecs,
      averageConfidence: Math.round(avgConfidence),
      marketOutlook: positiveOutlook ? 'Positive' : 'Cautious',
      expectedGrowth: currentProjection.expectedReturn
    };
  }, [predictions, currentProjection]);

  const handleRefreshPredictions = async () => {
    setRefreshing(true);
    // Simulate API call to refresh AI predictions
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Status */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI Portfolio Intelligence</h2>
            <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
              Beta
            </div>
          </div>
          <p className="text-gray-600">AI-powered insights and predictions for your portfolio</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshPredictions}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh AI</span>
          </button>
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="3Y">3 Years</option>
          </select>
        </div>
      </div>

      {/* AI Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className={`text-2xl font-bold ${getConfidenceColor(aiInsights.averageConfidence)}`}>
              {aiInsights.averageConfidence}%
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">AI Confidence</h3>
          <p className="text-xs text-gray-600 mt-1">Average prediction reliability</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              +{currentProjection.expectedReturn.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Projected Growth</h3>
          <p className="text-xs text-gray-600 mt-1">Expected {selectedTimeframe} return</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {predictions.marketInsights.marketScores.opportunity}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Market Opportunity</h3>
          <p className="text-xs text-gray-600 mt-1">Investment attractiveness score</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">
              {aiInsights.highPriorityActions}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Priority Actions</h3>
          <p className="text-xs text-gray-600 mt-1">High-impact recommendations</p>
        </div>
      </div>

      {/* Portfolio Projections */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Growth Projections</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(currentProjection.confidence)} bg-opacity-10`}>
            {currentProjection.confidence}% Confidence
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              ${currentProjection.upside.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Optimistic Scenario</div>
            <div className="text-xs text-green-600">
              +{currentProjection.scenarios.optimistic.return}% ({currentProjection.scenarios.optimistic.probability}% chance)
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              ${currentProjection.expectedValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Expected Value</div>
            <div className="text-xs text-blue-600">
              +{currentProjection.scenarios.realistic.return}% ({currentProjection.scenarios.realistic.probability}% chance)
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              ${currentProjection.downside.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Conservative Scenario</div>
            <div className="text-xs text-yellow-600">
              +{currentProjection.scenarios.pessimistic.return}% ({currentProjection.scenarios.pessimistic.probability}% chance)
            </div>
          </div>
        </div>

        {/* Risk-Return Visualization */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Risk-Return Profile</h4>
            <div className="text-xs text-gray-600">Volatility: {currentProjection.volatility}%</div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
              style={{ width: `${Math.min(100, currentProjection.volatility * 3)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <div className="text-sm text-gray-600">
            {predictions.recommendations.length} insights available
          </div>
        </div>

        <div className="space-y-4">
          {predictions.recommendations.map((rec) => {
            const IconComponent = rec.icon;
            return (
              <div key={rec.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getPriorityColor(rec.priority)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-semibold text-gray-900">{rec.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                        </span>
                        <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                          {rec.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{rec.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500">Expected Impact</div>
                        <div className="text-sm font-medium text-green-600">{rec.expectedImpact}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Timeline</div>
                        <div className="text-sm font-medium text-gray-900">{rec.timeframe}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Investment Range</div>
                        <div className="text-sm font-medium text-gray-900">{rec.investmentRange}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Risk Level</div>
                        <div className="text-sm font-medium text-gray-900">{rec.riskLevel}</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <div className="text-xs text-blue-800 font-medium mb-1">AI Reasoning:</div>
                      <div className="text-sm text-blue-700">{rec.reasoning}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <strong>Next Step:</strong> {rec.actionRequired}
                      </div>
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trend Analysis</h3>
          <div className="space-y-4">
            {predictions.marketInsights.trends.map((trend, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(trend.trend)}
                    <span className="font-medium text-gray-900">{trend.category}</span>
                  </div>
                  <div className="text-sm text-gray-600">{trend.strength}% strength</div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{trend.driver}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Timeline: {trend.timeframe}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    trend.impact === 'high' ? 'bg-red-100 text-red-600' :
                    trend.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {trend.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Scores */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Health Scores</h3>
          <div className="space-y-4">
            {Object.entries(predictions.marketInsights.marketScores).map(([key, score]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        score >= 70 ? 'bg-green-500' :
                        score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">AI Predictions Disclaimer</h4>
            <p className="text-sm text-yellow-700 mt-1">
              These AI-generated insights are based on historical data and market trends. Past performance does not guarantee future results. 
              Always conduct your own research and consult with financial advisors before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
