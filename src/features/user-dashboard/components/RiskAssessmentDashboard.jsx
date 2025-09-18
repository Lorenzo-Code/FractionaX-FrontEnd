import React, { useState, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  Info,
  CheckCircle,
  XCircle,
  Zap,
  DollarSign,
  Percent,
  MapPin,
  Building,
  Clock
} from 'lucide-react';

const RiskAssessmentDashboard = ({ portfolioData, marketData }) => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState('overall');
  const [showStressTesting, setShowStressTesting] = useState(false);

  // Mock market volatility data
  const mockMarketData = {
    volatilityIndex: {
      residential: 12.5,
      commercial: 18.3,
      retail: 22.1,
      industrial: 15.7
    },
    economicIndicators: {
      interestRates: 5.25,
      inflationRate: 3.2,
      unemploymentRate: 3.7,
      gdpGrowth: 2.1
    },
    regionalRisk: {
      'TX': { score: 25, trend: 'stable' },
      'FL': { score: 45, trend: 'increasing' },
      'CA': { score: 35, trend: 'decreasing' },
      'NY': { score: 40, trend: 'stable' }
    }
  };

  const market = marketData || mockMarketData;

  // Mock portfolio data if not provided
  const mockPortfolioData = {
    totalValue: 125750.50,
    totalInvested: 95000.00,
    properties: [
      {
        id: 1,
        name: "Luxury Downtown Condo",
        location: { state: "TX", city: "Austin" },
        propertyType: "Residential",
        investment: 15000,
        currentValue: 18500,
        riskLevel: "Medium",
        marketSegment: "Luxury",
        tenancyRate: 95,
        cashFlow: 185.50,
        leverage: 0.8,
        propertyAge: 5,
        marketTrend: "up"
      },
      {
        id: 2,
        name: "Suburban Family Home",
        location: { state: "TX", city: "Dallas" },
        propertyType: "Residential",
        investment: 25000,
        currentValue: 28200,
        riskLevel: "Low",
        marketSegment: "Mid-Market",
        tenancyRate: 100,
        cashFlow: 295.00,
        leverage: 0.6,
        propertyAge: 8,
        marketTrend: "stable"
      },
      {
        id: 3,
        name: "Modern Office Complex",
        location: { state: "TX", city: "Houston" },
        propertyType: "Commercial",
        investment: 35000,
        currentValue: 42500,
        riskLevel: "High",
        marketSegment: "Premium",
        tenancyRate: 85,
        cashFlow: 445.75,
        leverage: 0.75,
        propertyAge: 3,
        marketTrend: "up"
      },
      {
        id: 4,
        name: "Retail Shopping Center",
        location: { state: "FL", city: "Miami" },
        propertyType: "Retail",
        investment: 20000,
        currentValue: 22550,
        riskLevel: "Medium",
        marketSegment: "Mid-Market",
        tenancyRate: 78,
        cashFlow: 156.25,
        leverage: 0.85,
        propertyAge: 12,
        marketTrend: "down"
      }
    ]
  };

  const portfolio = portfolioData || mockPortfolioData;

  // Calculate comprehensive risk metrics
  const riskMetrics = useMemo(() => {
    const properties = portfolio.properties || [];

    // Geographic concentration risk
    const stateConcentration = properties.reduce((acc, prop) => {
      const state = prop.location?.state || 'Unknown';
      acc[state] = (acc[state] || 0) + prop.investment;
      return acc;
    }, {});

    const maxGeoConcentration = Math.max(...Object.values(stateConcentration)) / portfolio.totalInvested;
    const geoRiskScore = Math.min(100, maxGeoConcentration * 100);

    // Property type concentration risk
    const typeConcentration = properties.reduce((acc, prop) => {
      const type = prop.propertyType || 'Unknown';
      acc[type] = (acc[type] || 0) + prop.investment;
      return acc;
    }, {});

    const maxTypeConcentration = Math.max(...Object.values(typeConcentration)) / portfolio.totalInvested;
    const typeRiskScore = Math.min(100, maxTypeConcentration * 100);

    // Market volatility risk
    const volatilityRisk = properties.reduce((acc, prop) => {
      const volatility = market.volatilityIndex[prop.propertyType?.toLowerCase()] || 15;
      return acc + (volatility * prop.investment);
    }, 0) / portfolio.totalInvested;

    // Liquidity risk (based on property type and market segment)
    const liquidityWeights = {
      'Residential': 0.3,
      'Commercial': 0.6,
      'Retail': 0.8,
      'Industrial': 0.7
    };

    const liquidityRisk = properties.reduce((acc, prop) => {
      const weight = liquidityWeights[prop.propertyType] || 0.5;
      return acc + (weight * prop.investment);
    }, 0) / portfolio.totalInvested;

    // Leverage risk
    const avgLeverage = properties.reduce((acc, prop) => {
      return acc + (prop.leverage || 0) * prop.investment;
    }, 0) / portfolio.totalInvested;

    const leverageRiskScore = Math.min(100, avgLeverage * 100);

    // Cash flow risk (based on tenancy rates)
    const avgTenancy = properties.reduce((acc, prop) => {
      return acc + (prop.tenancyRate || 90) * prop.investment;
    }, 0) / portfolio.totalInvested;

    const cashFlowRiskScore = Math.max(0, 100 - avgTenancy);

    // Age risk (older properties = higher risk)
    const avgAge = properties.reduce((acc, prop) => {
      return acc + (prop.propertyAge || 10) * prop.investment;
    }, 0) / portfolio.totalInvested;

    const ageRiskScore = Math.min(100, avgAge * 2);

    // Overall risk score (weighted combination)
    const overallRisk = Math.round(
      geoRiskScore * 0.15 +
      typeRiskScore * 0.15 +
      volatilityRisk * 0.25 +
      liquidityRisk * 0.15 +
      leverageRiskScore * 0.15 +
      cashFlowRiskScore * 0.10 +
      ageRiskScore * 0.05
    );

    return {
      overall: overallRisk,
      geographic: Math.round(geoRiskScore),
      propertyType: Math.round(typeRiskScore),
      marketVolatility: Math.round(volatilityRisk),
      liquidity: Math.round(liquidityRisk * 100),
      leverage: Math.round(leverageRiskScore),
      cashFlow: Math.round(cashFlowRiskScore),
      propertyAge: Math.round(ageRiskScore),
      stateConcentration,
      typeConcentration,
      avgLeverage: Math.round(avgLeverage * 100),
      avgTenancy: Math.round(avgTenancy)
    };
  }, [portfolio, market]);

  // Risk category and recommendations
  const getRiskCategory = (score) => {
    if (score <= 20) return { category: 'Low Risk', color: 'green', description: 'Conservative portfolio with stable returns' };
    if (score <= 40) return { category: 'Low-Medium Risk', color: 'blue', description: 'Well-balanced risk profile' };
    if (score <= 60) return { category: 'Medium Risk', color: 'yellow', description: 'Moderate risk with growth potential' };
    if (score <= 80) return { category: 'Medium-High Risk', color: 'orange', description: 'Higher risk requiring attention' };
    return { category: 'High Risk', color: 'red', description: 'Aggressive portfolio needing diversification' };
  };

  const overallRiskProfile = getRiskCategory(riskMetrics.overall);

  // Stress testing scenarios
  const stressTestScenarios = [
    {
      name: 'Market Correction',
      description: '20% market decline across all properties',
      impact: -19050.10,
      probability: '15%',
      severity: 'Medium'
    },
    {
      name: 'Interest Rate Rise',
      description: '2% interest rate increase',
      impact: -12575.05,
      probability: '35%',
      severity: 'Low'
    },
    {
      name: 'Regional Economic Downturn',
      description: 'Economic decline in major markets',
      impact: -31437.63,
      probability: '10%',
      severity: 'High'
    },
    {
      name: 'Sector-Specific Crisis',
      description: 'Commercial real estate downturn',
      impact: -8500.00,
      probability: '20%',
      severity: 'Medium'
    }
  ];

  // Risk recommendations
  const riskRecommendations = [
    {
      priority: 'High',
      category: 'Geographic Diversification',
      recommendation: 'Consider investing in properties outside of Texas to reduce geographic concentration.',
      impact: 'Could reduce portfolio risk by 15-25%',
      icon: MapPin,
      color: 'red'
    },
    {
      priority: 'Medium',
      category: 'Property Type Mix',
      recommendation: 'Balance commercial exposure with more residential properties.',
      impact: 'Could improve risk-adjusted returns',
      icon: Building,
      color: 'yellow'
    },
    {
      priority: 'Low',
      category: 'Leverage Management',
      recommendation: 'Current leverage levels are within acceptable ranges.',
      impact: 'Monitor for future investments',
      icon: DollarSign,
      color: 'green'
    }
  ];

  const getRiskColor = (category) => {
    switch(category) {
      case 'Low Risk': return 'text-green-600 bg-green-50 border-green-200';
      case 'Low-Medium Risk': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Medium Risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Medium-High Risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'High Risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score <= 20) return 'text-green-600';
    if (score <= 40) return 'text-blue-600';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Risk Score */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Risk</h3>
            <Shield className={`w-6 h-6 ${getScoreColor(riskMetrics.overall)}`} />
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(riskMetrics.overall)}`}>
              {riskMetrics.overall}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getRiskColor(overallRiskProfile.category)}`}>
              {overallRiskProfile.category}
            </div>
            <p className="text-xs text-gray-600 mt-2">{overallRiskProfile.description}</p>
          </div>
        </div>

        {/* Geographic Risk */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Geographic Risk</h3>
            <MapPin className={`w-5 h-5 ${getScoreColor(riskMetrics.geographic)}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{riskMetrics.geographic}</div>
          <div className="flex items-center mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-full rounded-full ${riskMetrics.geographic <= 20 ? 'bg-green-500' : riskMetrics.geographic <= 40 ? 'bg-blue-500' : riskMetrics.geographic <= 60 ? 'bg-yellow-500' : riskMetrics.geographic <= 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${riskMetrics.geographic}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Max state: {riskMetrics.geographic}%</p>
        </div>

        {/* Market Volatility */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Market Volatility</h3>
            <Activity className={`w-5 h-5 ${getScoreColor(riskMetrics.marketVolatility)}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{riskMetrics.marketVolatility}</div>
          <div className="flex items-center mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-full rounded-full ${riskMetrics.marketVolatility <= 20 ? 'bg-green-500' : riskMetrics.marketVolatility <= 40 ? 'bg-blue-500' : riskMetrics.marketVolatility <= 60 ? 'bg-yellow-500' : riskMetrics.marketVolatility <= 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${riskMetrics.marketVolatility}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Portfolio volatility index</p>
        </div>

        {/* Liquidity Risk */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Liquidity Risk</h3>
            <Clock className={`w-5 h-5 ${getScoreColor(riskMetrics.liquidity)}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{riskMetrics.liquidity}</div>
          <div className="flex items-center mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-full rounded-full ${riskMetrics.liquidity <= 20 ? 'bg-green-500' : riskMetrics.liquidity <= 40 ? 'bg-blue-500' : riskMetrics.liquidity <= 60 ? 'bg-yellow-500' : riskMetrics.liquidity <= 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${riskMetrics.liquidity}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Time to sell assets</p>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Risk Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Geographic Concentration</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${riskMetrics.geographic}%` }}></div>
                </div>
                <span className="text-sm font-medium">{riskMetrics.geographic}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Building size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Property Type Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${riskMetrics.propertyType}%` }}></div>
                </div>
                <span className="text-sm font-medium">{riskMetrics.propertyType}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Leverage Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${riskMetrics.leverage}%` }}></div>
                </div>
                <span className="text-sm font-medium">{riskMetrics.leverage}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Activity size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Cash Flow Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${riskMetrics.cashFlow}%` }}></div>
                </div>
                <span className="text-sm font-medium">{riskMetrics.cashFlow}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Property Age Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${riskMetrics.propertyAge}%` }}></div>
                </div>
                <span className="text-sm font-medium">{riskMetrics.propertyAge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Recommendations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Recommendations</h3>
          <div className="space-y-4">
            {riskRecommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              const priorityColors = {
                'High': 'text-red-600 bg-red-50 border-red-200',
                'Medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
                'Low': 'text-green-600 bg-green-50 border-green-200'
              };
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${priorityColors[rec.priority]}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{rec.category}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[rec.priority]}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.recommendation}</p>
                      <p className="text-xs text-green-600 font-medium">{rec.impact}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stress Testing */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Stress Testing Scenarios</h3>
          <button
            onClick={() => setShowStressTesting(!showStressTesting)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            {showStressTesting ? 'Hide' : 'Show'} Details
          </button>
        </div>
        
        {showStressTesting && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stressTestScenarios.map((scenario, index) => {
              const severityColors = {
                'Low': 'text-green-600 bg-green-50',
                'Medium': 'text-yellow-600 bg-yellow-50',
                'High': 'text-red-600 bg-red-50'
              };
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{scenario.name}</h4>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${severityColors[scenario.severity]}`}>
                      {scenario.severity}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-red-600">
                        ${Math.abs(scenario.impact).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Potential Loss</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{scenario.probability}</div>
                      <div className="text-xs text-gray-500">Probability</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentDashboard;
