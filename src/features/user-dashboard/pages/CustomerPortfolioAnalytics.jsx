import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  Shield, 
  TrendingUp, 
  Zap, 
  Map, 
  Settings,
  Download,
  RefreshCw,
  Info,
  Trophy,
  Users,
  MessageCircle,
  Wallet
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import { generatePageSEO } from '../../../shared/utils';

// Import all analytics components
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import RiskAssessmentDashboard from '../components/RiskAssessmentDashboard';
import PerformanceBenchmarks from '../components/PerformanceBenchmarks';
import PredictiveAnalytics from '../components/PredictiveAnalytics';
import PropertyPerformanceHeatmap from '../components/PropertyPerformanceHeatmap';
import InvestmentLeaderboards from '../components/InvestmentLeaderboards';
import InvestorSocialFeed from '../components/InvestorSocialFeed';
import MyInvestments from '../components/MyInvestments';

export default function CustomerPortfolioAnalytics() {
  const [activeView, setActiveView] = useState('investments');
  const [refreshing, setRefreshing] = useState(false);

  const seoData = generatePageSEO({
    title: 'Portfolio Analytics & Community - FractionaX',
    description: 'Advanced portfolio analytics with diversification scoring, risk assessment, performance benchmarks, AI insights, property heatmap, and investor community features.',
    url: '/dashboard/analytics',
    keywords: ['portfolio analytics', 'diversification', 'risk assessment', 'performance', 'AI insights', 'real estate', 'community', 'leaderboards']
  });

  const analyticsViews = [
    {
      id: 'investments',
      name: 'My Investments',
      icon: Wallet,
      description: 'Track your individual investments and portfolio performance'
    },
    {
      id: 'overview',
      name: 'Portfolio Overview',
      icon: BarChart3,
      description: 'Comprehensive portfolio analysis with diversification scoring'
    },
    {
      id: 'risk',
      name: 'Risk Analysis',
      icon: Shield,
      description: 'Detailed risk assessment and stress testing'
    },
    {
      id: 'benchmarks',
      name: 'Performance',
      icon: TrendingUp,
      description: 'Compare against market averages and peer groups'
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      icon: Zap,
      description: 'AI-powered predictions and investment recommendations'
    },
    {
      id: 'heatmap',
      name: 'Property Map',
      icon: Map,
      description: 'Geographic visualization of property performance'
    },
    {
      id: 'leaderboards',
      name: 'Leaderboards',
      icon: Trophy,
      description: 'Top performing investors and ranking system'
    },
    {
      id: 'community',
      name: 'Community Feed',
      icon: Users,
      description: 'Latest investor activities and social interactions'
    }
  ];

  const handleRefreshAnalytics = async () => {
    setRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleExportReport = () => {
    // Export functionality would be implemented here
    console.log('Exporting analytics report...');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'investments':
        return <MyInvestments />;
      case 'overview':
        return <PortfolioAnalytics />;
      case 'risk':
        return <RiskAssessmentDashboard />;
      case 'benchmarks':
        return <PerformanceBenchmarks />;
      case 'ai-insights':
        return <PredictiveAnalytics />;
      case 'heatmap':
        return <PropertyPerformanceHeatmap />;
      case 'leaderboards':
        return <InvestmentLeaderboards />;
      case 'community':
        return <InvestorSocialFeed />;
      default:
        return <MyInvestments />;
    }
  };

  return (
    <div className="space-y-6">
      <SEO {...seoData} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Analytics & Community</h1>
          <p className="text-gray-600 mt-1">
            Advanced insights, performance analytics, and community features for your real estate investments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
          <button
            onClick={handleRefreshAnalytics}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {analyticsViews.map(({ id, name, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex-1 px-6 py-4 text-left transition-colors border-b-2 ${
                  activeView === id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Active View Content */}
        <div className="p-6">
          {renderActiveView()}
        </div>
      </div>

      {/* Analytics Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Portfolio Analytics & Community Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">📊 Diversification</h4>
                <p>Aim for diversification scores above 70. Spread investments across different regions and property types.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">🛡️ Risk Management</h4>
                <p>Monitor your overall risk score. Consider rebalancing if it exceeds your comfort level.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">📈 Performance</h4>
                <p>Compare your returns against benchmarks. Consistent outperformance indicates good investment choices.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">🤖 AI Recommendations</h4>
                <p>Review AI insights regularly. High-confidence recommendations often yield better results.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">🏆 Leaderboards</h4>
                <p>Track your ranking and compete with other investors. Focus on consistent performance for long-term success.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">👥 Community</h4>
                <p>Learn from other investors' activities and share insights. Engage with the community for better outcomes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
