import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Target,
  Award,
  Users,
  Building,
  DollarSign,
  Percent,
  Calendar,
  Activity,
  Info,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

const PerformanceBenchmarks = ({ portfolioData, performanceData, timeRange = '1Y' }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  // Mock performance data
  const mockPerformanceData = {
    userPerformance: {
      totalReturn: 32.37,
      annualizedReturn: 28.45,
      monthlyReturns: [2.1, 1.8, 3.2, 2.7, 1.9, 2.8, 3.1, 2.4, 2.6, 3.0, 2.2, 2.9],
      sharpeRatio: 1.42,
      maxDrawdown: -8.2,
      volatility: 12.5,
      alpha: 4.2,
      beta: 0.85,
      informationRatio: 1.18
    },
    benchmarks: {
      marketAverage: {
        name: 'Real Estate Market Average',
        return: 18.5,
        annualized: 16.2,
        volatility: 15.8,
        sharpeRatio: 1.02,
        description: 'Overall U.S. real estate investment average'
      },
      peerGroup: {
        name: 'Similar Investors',
        return: 22.1,
        annualized: 20.8,
        volatility: 13.2,
        sharpeRatio: 1.24,
        description: 'Investors with similar risk profile and investment size'
      },
      reitIndex: {
        name: 'REIT Index (VNQ)',
        return: 15.8,
        annualized: 14.2,
        volatility: 18.3,
        sharpeRatio: 0.87,
        description: 'Vanguard Real Estate ETF performance'
      },
      sp500: {
        name: 'S&P 500',
        return: 12.4,
        annualized: 11.8,
        volatility: 16.1,
        sharpeRatio: 0.79,
        description: 'Broad stock market index performance'
      },
      bondIndex: {
        name: 'Bond Index',
        return: 4.2,
        annualized: 3.8,
        volatility: 4.5,
        sharpeRatio: 0.84,
        description: 'Investment grade bond market'
      }
    },
    timeSeriesData: {
      '1Y': {
        dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        userPortfolio: [100, 102.1, 103.9, 107.2, 110.1, 112.2, 115.3, 118.9, 121.9, 125.6, 128.4, 132.1],
        marketAverage: [100, 101.2, 102.8, 104.1, 105.9, 107.2, 108.8, 110.5, 111.8, 113.4, 115.1, 118.5],
        peerGroup: [100, 101.8, 103.5, 105.8, 107.2, 109.1, 111.6, 113.8, 116.2, 118.7, 120.3, 122.1],
        reitIndex: [100, 100.8, 101.9, 102.5, 103.8, 105.2, 106.1, 107.8, 108.9, 111.2, 112.8, 115.8]
      }
    },
    rankings: {
      overall: { percentile: 78, rank: 22, outOf: 100 },
      riskAdjusted: { percentile: 82, rank: 18, outOf: 100 },
      consistency: { percentile: 71, rank: 29, outOf: 100 }
    }
  };

  const performance = performanceData || mockPerformanceData;
  const userPerf = performance.userPerformance;
  const benchmarks = performance.benchmarks;

  // Calculate relative performance
  const relativePerformance = useMemo(() => {
    return Object.entries(benchmarks).map(([key, benchmark]) => ({
      key,
      name: benchmark.name,
      benchmark,
      outperformance: userPerf.totalReturn - benchmark.return,
      outperformanceAnnualized: userPerf.annualizedReturn - benchmark.annualized,
      riskAdjustedOutperformance: userPerf.sharpeRatio - benchmark.sharpeRatio,
      category: key
    }));
  }, [userPerf, benchmarks]);

  // Performance metrics calculation
  const performanceMetrics = useMemo(() => {
    const totalBenchmarks = relativePerformance.length;
    const outperforming = relativePerformance.filter(p => p.outperformance > 0).length;
    const outperformanceRate = (outperforming / totalBenchmarks) * 100;

    const avgOutperformance = relativePerformance.reduce((sum, p) => sum + p.outperformance, 0) / totalBenchmarks;
    const bestOutperformance = Math.max(...relativePerformance.map(p => p.outperformance));
    const worstOutperformance = Math.min(...relativePerformance.map(p => p.outperformance));

    return {
      outperformanceRate,
      avgOutperformance,
      bestOutperformance,
      worstOutperformance,
      consistency: userPerf.sharpeRatio > 1.2 ? 'High' : userPerf.sharpeRatio > 0.8 ? 'Medium' : 'Low'
    };
  }, [relativePerformance, userPerf]);

  const getPerformanceColor = (value) => {
    if (value > 5) return 'text-green-600 bg-green-50';
    if (value > 0) return 'text-green-500 bg-green-25';
    if (value > -5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceIcon = (value) => {
    return value > 0 ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />;
  };

  const getRankingBadge = (percentile) => {
    if (percentile >= 90) return { text: 'Top 10%', color: 'bg-green-600 text-white' };
    if (percentile >= 75) return { text: 'Top 25%', color: 'bg-blue-600 text-white' };
    if (percentile >= 50) return { text: 'Top 50%', color: 'bg-yellow-600 text-white' };
    return { text: 'Bottom 50%', color: 'bg-gray-600 text-white' };
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Performance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Performance</h3>
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              +{userPerf.totalReturn.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Return ({timeRange})</div>
            <div className="mt-3">
              <div className="text-lg font-semibold text-gray-900">
                {userPerf.annualizedReturn.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Annualized</div>
            </div>
          </div>
        </div>

        {/* Ranking Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Ranking</h3>
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall</span>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRankingBadge(performance.rankings.overall.percentile).color}`}>
                  {getRankingBadge(performance.rankings.overall.percentile).text}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Risk-Adjusted</span>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRankingBadge(performance.rankings.riskAdjusted.percentile).color}`}>
                  {getRankingBadge(performance.rankings.riskAdjusted.percentile).text}
                </span>
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="text-sm text-gray-600">
                Rank #{performance.rankings.overall.rank} of {performance.rankings.overall.outOf}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Metrics Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Metrics</h3>
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sharpe Ratio</span>
              <span className="text-sm font-semibold text-gray-900">{userPerf.sharpeRatio}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Volatility</span>
              <span className="text-sm font-semibold text-gray-900">{userPerf.volatility}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Drawdown</span>
              <span className="text-sm font-semibold text-red-600">{userPerf.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alpha</span>
              <span className="text-sm font-semibold text-green-600">+{userPerf.alpha}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Benchmark Comparison</h3>
          <div className="text-sm text-gray-600">
            Outperforming {Math.round(performanceMetrics.outperformanceRate)}% of benchmarks
          </div>
        </div>

        <div className="space-y-4">
          {relativePerformance.map((item) => (
            <div key={item.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.benchmark.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getPerformanceIcon(item.outperformance)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(item.outperformance)}`}>
                    {item.outperformance > 0 ? '+' : ''}{item.outperformance.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600">
                    {userPerf.totalReturn.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Your Return</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600">
                    {item.benchmark.return.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Benchmark</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600">
                    {item.benchmark.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Sharpe Ratio</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Comparison Chart</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {/* Simple chart visualization */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Performance Chart</p>
            <p className="text-sm text-gray-500">Interactive chart showing performance vs benchmarks over time</p>
          </div>
        </div>

        {showDetails && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(performance.timeSeriesData['1Y']).slice(1).map(([key, data]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Start:</span>
                    <span className="text-xs font-medium">100.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">End:</span>
                    <span className="text-xs font-medium">{data[data.length - 1].toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Return:</span>
                    <span className={`text-xs font-medium ${(data[data.length - 1] - 100) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {((data[data.length - 1] - 100)).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              +{performanceMetrics.avgOutperformance.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Average Outperformance</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              +{performanceMetrics.bestOutperformance.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Best vs Benchmark</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {performanceMetrics.consistency}
            </div>
            <div className="text-sm text-gray-600 mt-1">Consistency Rating</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(performanceMetrics.outperformanceRate)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Benchmarks Beaten</div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Insights</h3>
        <div className="space-y-4">
          {userPerf.totalReturn > benchmarks.marketAverage.return && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-900">Strong Market Outperformance</h4>
                <p className="text-sm text-green-700">
                  Your portfolio outperformed the real estate market average by {(userPerf.totalReturn - benchmarks.marketAverage.return).toFixed(1)}%.
                </p>
              </div>
            </div>
          )}
          
          {userPerf.sharpeRatio > 1.0 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Award className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Excellent Risk-Adjusted Returns</h4>
                <p className="text-sm text-blue-700">
                  Your Sharpe ratio of {userPerf.sharpeRatio} indicates strong risk-adjusted performance.
                </p>
              </div>
            </div>
          )}

          {performance.rankings.overall.percentile >= 75 && (
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-900">Top Quartile Performance</h4>
                <p className="text-sm text-purple-700">
                  You're in the top {100 - performance.rankings.overall.percentile}% of similar investors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceBenchmarks;
