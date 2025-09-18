import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart,
  MapPin,
  Shield,
  AlertTriangle,
  Info,
  Award,
  Activity,
  Zap,
  ChevronRight,
  Filter,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';

const PortfolioAnalytics = ({ portfolioData, performanceData, marketData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1Y');

  // Mock portfolio data - replace with real data from props
  const mockPortfolioData = {
    totalValue: 125750.50,
    totalInvested: 95000.00,
    totalReturns: 30750.50,
    returnPercentage: 32.37,
    properties: [
      {
        id: 1,
        name: "Luxury Downtown Condo",
        location: { state: "TX", city: "Austin", coordinates: [30.2672, -97.7431] },
        propertyType: "Residential",
        investment: 15000,
        currentValue: 18500,
        returns: 3500,
        returnRate: 23.33,
        riskLevel: "Medium",
        marketSegment: "Luxury"
      },
      {
        id: 2,
        name: "Suburban Family Home",
        location: { state: "TX", city: "Dallas", coordinates: [32.7767, -96.7970] },
        propertyType: "Residential",
        investment: 25000,
        currentValue: 28200,
        returns: 3200,
        returnRate: 12.80,
        riskLevel: "Low",
        marketSegment: "Mid-Market"
      },
      {
        id: 3,
        name: "Modern Office Complex",
        location: { state: "TX", city: "Houston", coordinates: [29.7604, -95.3698] },
        propertyType: "Commercial",
        investment: 35000,
        currentValue: 42500,
        returns: 7500,
        returnRate: 21.43,
        riskLevel: "High",
        marketSegment: "Premium"
      },
      {
        id: 4,
        name: "Retail Shopping Center",
        location: { state: "FL", city: "Miami", coordinates: [25.7617, -80.1918] },
        propertyType: "Retail",
        investment: 20000,
        currentValue: 22550,
        returns: 2550,
        returnRate: 12.75,
        riskLevel: "Medium",
        marketSegment: "Mid-Market"
      }
    ]
  };

  const portfolio = portfolioData || mockPortfolioData;

  // Calculate diversification metrics
  const diversificationMetrics = useMemo(() => {
    const properties = portfolio.properties || [];
    
    // Geographic diversification
    const stateDistribution = properties.reduce((acc, prop) => {
      const state = prop.location?.state || 'Unknown';
      acc[state] = (acc[state] || 0) + prop.investment;
      return acc;
    }, {});
    
    const stateCount = Object.keys(stateDistribution).length;
    const maxStateConcentration = Math.max(...Object.values(stateDistribution)) / portfolio.totalInvested;
    const geographicScore = Math.max(0, 100 - (maxStateConcentration * 100 - 20));

    // Property type diversification
    const typeDistribution = properties.reduce((acc, prop) => {
      const type = prop.propertyType || 'Unknown';
      acc[type] = (acc[type] || 0) + prop.investment;
      return acc;
    }, {});
    
    const typeCount = Object.keys(typeDistribution).length;
    const maxTypeConcentration = Math.max(...Object.values(typeDistribution)) / portfolio.totalInvested;
    const propertyTypeScore = Math.max(0, 100 - (maxTypeConcentration * 100 - 30));

    // Investment size diversification
    const investments = properties.map(p => p.investment).sort((a, b) => b - a);
    const largestInvestment = investments[0] || 0;
    const sizeConcentration = largestInvestment / portfolio.totalInvested;
    const sizeScore = Math.max(0, 100 - (sizeConcentration * 100 - 40));

    // Overall diversification score (weighted average)
    const overallScore = Math.round(
      (geographicScore * 0.4 + propertyTypeScore * 0.35 + sizeScore * 0.25)
    );

    return {
      overall: overallScore,
      geographic: Math.round(geographicScore),
      propertyType: Math.round(propertyTypeScore),
      investmentSize: Math.round(sizeScore),
      stateDistribution,
      typeDistribution,
      stateCount,
      typeCount,
      maxStateConcentration: Math.round(maxStateConcentration * 100),
      maxTypeConcentration: Math.round(maxTypeConcentration * 100)
    };
  }, [portfolio]);

  // Calculate risk assessment
  const riskAssessment = useMemo(() => {
    const properties = portfolio.properties || [];
    
    const riskWeights = {
      'Low': 1,
      'Medium': 2,
      'High': 3
    };

    const weightedRisk = properties.reduce((acc, prop) => {
      const weight = riskWeights[prop.riskLevel] || 2;
      return acc + (weight * prop.investment);
    }, 0);

    const avgRisk = weightedRisk / portfolio.totalInvested;
    const riskScore = Math.round((4 - avgRisk) * 33.33); // Convert to 0-100 scale

    const riskDistribution = properties.reduce((acc, prop) => {
      const level = prop.riskLevel || 'Medium';
      acc[level] = (acc[level] || 0) + prop.investment;
      return acc;
    }, {});

    let riskCategory = 'Medium';
    if (riskScore >= 75) riskCategory = 'Conservative';
    else if (riskScore >= 50) riskCategory = 'Moderate';
    else if (riskScore >= 25) riskCategory = 'Aggressive';
    else riskCategory = 'Very Aggressive';

    return {
      score: riskScore,
      category: riskCategory,
      distribution: riskDistribution,
      averageRisk: avgRisk.toFixed(2)
    };
  }, [portfolio]);

  // Performance benchmarks
  const benchmarks = {
    userReturn: portfolio.returnPercentage || 0,
    marketAverage: 18.5,
    peerAverage: 22.1,
    reitIndex: 15.8,
    sp500: 12.4
  };

  const getDiversificationColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskColor = (category) => {
    switch(category) {
      case 'Conservative': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-blue-600 bg-blue-50';
      case 'Aggressive': return 'text-orange-600 bg-orange-50';
      case 'Very Aggressive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'diversification', name: 'Diversification', icon: Target },
    { id: 'risk', name: 'Risk Analysis', icon: Shield },
    { id: 'performance', name: 'Benchmarks', icon: TrendingUp },
    { id: 'insights', name: 'AI Insights', icon: Zap }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h2>
          <p className="text-gray-600">Advanced insights into your real estate investments</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="ALL">All Time</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diversification Score */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Diversification Score</h3>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getDiversificationColor(diversificationMetrics.overall)}`}>
                  {diversificationMetrics.overall}/100
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Geographic</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${diversificationMetrics.geographic}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{diversificationMetrics.geographic}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Property Type</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${diversificationMetrics.propertyType}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{diversificationMetrics.propertyType}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Investment Size</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${diversificationMetrics.investmentSize}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{diversificationMetrics.investmentSize}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Risk Profile</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskAssessment.category)}`}>
                  {riskAssessment.category}
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - riskAssessment.score / 100)}`}
                      className="text-blue-600 transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{riskAssessment.score}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Risk Score (0-100)</p>
              </div>
            </div>

            {/* Performance vs Benchmarks */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Benchmarks</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium text-blue-900">Your Portfolio</span>
                  <span className="text-sm font-bold text-blue-600">+{benchmarks.userReturn.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peer Average</span>
                  <span className={`text-sm font-medium ${benchmarks.userReturn > benchmarks.peerAverage ? 'text-green-600' : 'text-red-600'}`}>
                    +{benchmarks.peerAverage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Market Average</span>
                  <span className={`text-sm font-medium ${benchmarks.userReturn > benchmarks.marketAverage ? 'text-green-600' : 'text-red-600'}`}>
                    +{benchmarks.marketAverage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">REIT Index</span>
                  <span className={`text-sm font-medium ${benchmarks.userReturn > benchmarks.reitIndex ? 'text-green-600' : 'text-red-600'}`}>
                    +{benchmarks.reitIndex}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diversification' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
              <div className="space-y-3">
                {Object.entries(diversificationMetrics.stateDistribution).map(([state, amount]) => {
                  const percentage = (amount / portfolio.totalInvested * 100).toFixed(1);
                  return (
                    <div key={state} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium">{state}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Info size={16} className="text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    Diversified across {diversificationMetrics.stateCount} state{diversificationMetrics.stateCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Type Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Type Distribution</h3>
              <div className="space-y-3">
                {Object.entries(diversificationMetrics.typeDistribution).map(([type, amount]) => {
                  const percentage = (amount / portfolio.totalInvested * 100).toFixed(1);
                  const colors = {
                    'Residential': 'bg-green-500',
                    'Commercial': 'bg-blue-500',
                    'Retail': 'bg-purple-500',
                    'Industrial': 'bg-orange-500'
                  };
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-3 ${colors[type] || 'bg-gray-500'}`}></div>
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                          <div 
                            className={`h-full rounded-full ${colors[type] || 'bg-gray-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Award size={16} className="text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    Well diversified across {diversificationMetrics.typeCount} property type{diversificationMetrics.typeCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional tab content will be implemented in subsequent components */}
        {activeTab === 'risk' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Risk Analysis</h3>
            <p className="text-gray-600">Risk analysis details coming soon...</p>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Benchmarks</h3>
            <p className="text-gray-600">Detailed performance comparison coming soon...</p>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
            <p className="text-gray-600">AI insights and recommendations coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
