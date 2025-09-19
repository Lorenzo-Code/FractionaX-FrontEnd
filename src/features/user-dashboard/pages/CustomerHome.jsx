import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  FaCoins,
  FaMoneyBillWave,
  FaHandHoldingUsd
} from 'react-icons/fa';
import { 
  TrendingUp, 
  DollarSign, 
  Home, 
  PieChart, 
  ArrowRight, 
  Bell,
  Gem,
  Wallet,
  BarChart3,
  Store,
  Shield,
  HelpCircle,
  Calendar,
  Activity,
  Users,
  Award,
  Zap,
  Target,
  Settings,
  Edit
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import { generatePageSEO } from '../../../shared/utils';
import userApiService from '../services/userApiService';

// Import customizable dashboard components
import DashboardCustomizer from '../components/DashboardCustomizer';
import WidgetWrapper from '../components/WidgetWrapper';
import { 
  WIDGET_TYPES, 
  GRID_BREAKPOINTS, 
  GRID_COLS, 
  ROW_HEIGHT,
  GRID_MARGIN,
  CONTAINER_PADDING
} from '../config/widgetConfig';
import {
  loadEnabledWidgets,
  saveEnabledWidgets,
  loadLayout,
  saveLayout,
  resetToDefaults
} from '../utils/widgetPersistence';

const ResponsiveGridLayout = WidthProvider(Responsive);

import {
  DashboardHeader,
  StatCard,
  PassiveIncomeGraph,
  UserProperties,
  PropertyTimeline,
  ComplianceStatus,
  StakingSummary,
  Notifications,
  ReferralBox,
  DocumentsVault,
  PortfolioBreakdownChart,
  StakingBreakdownChart
} from '../components';

const userProperties = [/* ... your properties ... */];
const propertyStages = [/* ... your stages ... */];

const CustomerHome = () => {
  // ===== STATE MANAGEMENT =====
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [tokenPrices, setTokenPrices] = useState(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Welcome page data state
  const [userData, setUserData] = useState({
    name: 'Lorenzo',
    totalPortfolioValue: 45720.50,
    monthlyIncome: 158.74,
    totalProperties: 7,
    fxctBalance: 12000,
    fxstBalance: 15500,
    stakingRewards: 120.00,
    membershipTier: 'Professional'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // ===== CUSTOMIZABLE DASHBOARD STATE =====
  const [enabledWidgets, setEnabledWidgets] = useState(() => loadEnabledWidgets());
  const [layouts, setLayouts] = useState(() => loadLayout());
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const seoData = generatePageSEO({
    title: "Dashboard | FractionaX",
    description: "Your FractionaX dashboard - manage investments, track portfolio performance, and access fractional real estate opportunities.",
    url: "/dashboard",
    keywords: ["dashboard", "portfolio", "real estate investment", "fractional ownership", "FXCT tokens", "staking"]
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAllDashboardData();
    fetchTokenPrices();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ENABLE_BACKEND_CALLS = false;
      
      if (ENABLE_BACKEND_CALLS) {
        const data = await userApiService.getDashboardOverview();
        setUserData(data.overview);
        setRecentActivity(data.recentActivity);
        setNotifications(data.notifications);
      } else {
        // Mock data for development
        setRecentActivity([
          {
            id: 1,
            type: 'investment',
            title: 'Property Investment Completed',
            description: 'Successfully invested $2,500 in Miami Beach Condo',
            timestamp: '2 hours ago',
            icon: Home,
            color: 'text-green-600'
          },
          {
            id: 2,
            type: 'reward',
            title: 'Staking Rewards Earned',
            description: 'Earned 25 FXCT tokens from staking',
            timestamp: '1 day ago',
            icon: Gem,
            color: 'text-purple-600'
          },
          {
            id: 3,
            type: 'income',
            title: 'Monthly Income Received',
            description: '$158.74 rental income deposited',
            timestamp: '3 days ago',
            icon: DollarSign,
            color: 'text-blue-600'
          }
        ]);

        setNotifications([
          {
            id: 1,
            type: 'info',
            title: 'New Property Available',
            message: 'Check out the new luxury property in downtown Miami',
            unread: true
          },
          {
            id: 2,
            type: 'success',
            title: 'Investment Milestone',
            message: 'Congratulations! You\'ve reached $50K portfolio value',
            unread: true
          },
          {
            id: 3,
            type: 'warning',
            title: 'Document Update Required',
            message: 'Please update your KYC documents by next month',
            unread: false
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  // ===== API INTEGRATION =====
  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Enable when backend user endpoints are ready
      const ENABLE_BACKEND_CALLS = false;
      
      if (ENABLE_BACKEND_CALLS) {
        const data = await userApiService.getAllDashboardData();
        setDashboardData(data);
        console.log('✅ Fetched all dashboard data:', data);
        
        if (data.errors.length > 0) {
          console.warn('⚠️ Some data failed to load:', data.errors);
        }
      } else {
        console.log('🔧 Backend API calls disabled - using fallback data');
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set fallback data
        setDashboardData({
          profile: { name: 'Lorenzo', email: 'lorenzo@fractionax.io' },
          overview: { totalValue: 45720.50, totalIncome: 158.74 },
          balances: { FXCT: 12000, FST: 15500 },
          staking: { totalStaked: 5000, claimableRewards: 120 },
          properties: [],
          income: { monthly: 158.74, change24h: 2.5 },
          portfolio: null,
          notifications: [],
          compliance: null,
          referrals: null,
          errors: []
        });
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenPrices = async () => {
    try {
      const ENABLE_PRICE_CALLS = false;
      
      if (ENABLE_PRICE_CALLS) {
        const prices = await userApiService.getTokenPrices();
        setTokenPrices(prices);
        console.log('🔄 Refreshed token prices:', prices);
      } else {
        // Fallback token prices
        setTokenPrices({
          FXCT: { price: 0.27, bid: 0.2680, ask: 0.2720, change24h: 3.2 },
          fst: { price: 1.45, bid: 1.4480, ask: 1.4520, change24h: -1.8 }
        });
      }
    } catch (error) {
      console.warn('❌ Failed to fetch token prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTokenPrices();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh dashboard data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllDashboardData();
      setLastUpdated(new Date());
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // ===== CUSTOMIZABLE DASHBOARD HANDLERS =====
  const handleLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
    // Auto-save layout changes
    saveLayout(layouts, currentBreakpoint);
    console.log('💾 Layout changed and saved', { layout, layouts, currentBreakpoint });
  };

  const handleBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    console.log('📱 Breakpoint changed to:', breakpoint);
  };

  const handleToggleWidget = (widgetId) => {
    const newEnabledWidgets = {
      ...enabledWidgets,
      [widgetId]: !enabledWidgets[widgetId]
    };
    setEnabledWidgets(newEnabledWidgets);
    saveEnabledWidgets(newEnabledWidgets);
    console.log('🔄 Widget toggled:', widgetId, newEnabledWidgets[widgetId]);
  };

  const handleRemoveWidget = (widgetId) => {
    const newEnabledWidgets = {
      ...enabledWidgets,
      [widgetId]: false
    };
    setEnabledWidgets(newEnabledWidgets);
    saveEnabledWidgets(newEnabledWidgets);
    console.log('🗑️ Widget removed:', widgetId);
  };

  const handleSaveLayout = () => {
    saveLayout(layouts, currentBreakpoint);
    console.log('💾 Layout saved manually');
  };

  const handleResetLayout = () => {
    resetToDefaults();
    setLayouts(loadLayout());
    setEnabledWidgets(loadEnabledWidgets());
    console.log('🔄 Dashboard reset to defaults');
  };

  const toggleCustomization = () => {
    setIsCustomizing(!isCustomizing);
    console.log('🎨 Customization mode:', !isCustomizing);
  };

  // ===== WIDGET RENDERING =====
  const renderWidget = (widgetId) => {
    if (!enabledWidgets[widgetId]) return null;

    const widgetProps = {
      widgetId,
      onRemove: handleRemoveWidget,
      isCustomizing
    };

    switch (widgetId) {
      case WIDGET_TYPES.FXCT_BALANCE:
        return (
          <WidgetWrapper {...widgetProps}>
            <StatCard
              title="FXCT Balance"
              symbol="FXCT"
              balance={dashboardData?.balances?.FXCT || 0}
              price={tokenPrices?.FXCT?.price}
              bid={tokenPrices?.FXCT?.bid}
              ask={tokenPrices?.FXCT?.ask}
              change24h={tokenPrices?.FXCT?.change24h}
              icon={<FaCoins className="text-yellow-500" />}
              loading={isLoadingPrices}
            />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.FST_BALANCE:
        return (
          <WidgetWrapper {...widgetProps}>
            <StatCard
              title="FST Balance"
              symbol="FST"
              balance={dashboardData?.balances?.FST || 0}
              price={tokenPrices?.fst?.price}
              bid={tokenPrices?.fst?.bid}
              ask={tokenPrices?.fst?.ask}
              change24h={tokenPrices?.fst?.change24h}
              icon={<FaMoneyBillWave className="text-green-500" />}
              loading={isLoadingPrices}
            />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.PASSIVE_INCOME:
        return (
          <WidgetWrapper {...widgetProps}>
            <StatCard
              title="Passive Income"
              amount={`$${dashboardData?.income?.monthly?.toFixed(2) || '158.74'}`}
              change24h={dashboardData?.income?.change24h?.toString() || "2.5"}
              icon={<FaHandHoldingUsd className="text-purple-500" />}
            />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.INCOME_CHART:
        return (
          <WidgetWrapper {...widgetProps}>
            <PassiveIncomeGraph incomeData={dashboardData?.income} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.USER_PROPERTIES:
        return (
          <WidgetWrapper {...widgetProps}>
            <UserProperties properties={dashboardData?.properties || userProperties} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.PROPERTY_TIMELINE:
        return (
          <WidgetWrapper {...widgetProps}>
            <PropertyTimeline properties={propertyStages} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.COMPLIANCE_STATUS:
        return (
          <WidgetWrapper {...widgetProps}>
            <ComplianceStatus complianceData={dashboardData?.compliance} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.STAKING_SUMMARY:
        return (
          <WidgetWrapper {...widgetProps}>
            <StakingSummary stakingData={dashboardData?.staking} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.NOTIFICATIONS:
        return (
          <WidgetWrapper {...widgetProps}>
            <Notifications notifications={dashboardData?.notifications} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.REFERRAL_BOX:
        return (
          <WidgetWrapper {...widgetProps}>
            <ReferralBox referralData={dashboardData?.referrals} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.DOCUMENTS_VAULT:
        return (
          <WidgetWrapper {...widgetProps}>
            <DocumentsVault documents={dashboardData?.documents} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.PORTFOLIO_BREAKDOWN:
        return (
          <WidgetWrapper {...widgetProps}>
            <PortfolioBreakdownChart portfolioData={dashboardData?.portfolio} />
          </WidgetWrapper>
        );

      case WIDGET_TYPES.STAKING_BREAKDOWN:
        return (
          <WidgetWrapper {...widgetProps}>
            <StakingBreakdownChart stakingData={dashboardData?.staking} />
          </WidgetWrapper>
        );

      default:
        return (
          <WidgetWrapper {...widgetProps}>
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Settings className="w-8 h-8 mx-auto mb-2" />
                <p>Widget: {widgetId}</p>
              </div>
            </div>
          </WidgetWrapper>
        );
    }
  };

  // Filter layout to only include enabled widgets
  const filteredLayouts = useMemo(() => {
    const filtered = {};
    Object.keys(layouts).forEach(breakpoint => {
      const layoutForBreakpoint = layouts[breakpoint];
      // Ensure we have an array before calling filter
      if (Array.isArray(layoutForBreakpoint)) {
        filtered[breakpoint] = layoutForBreakpoint.filter(item => enabledWidgets[item.i]);
      } else {
        filtered[breakpoint] = [];
      }
    });
    return filtered;
  }, [layouts, enabledWidgets]);

  const quickActions = [
    {
      title: 'Browse Properties',
      description: 'Explore new investment opportunities',
      icon: Store,
      link: '/dashboard/marketplace',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Portfolio Analytics',
      description: 'View detailed performance metrics',
      icon: BarChart3,
      link: '/dashboard/analytics',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Stake Tokens',
      description: 'Earn rewards on your FXCT tokens',
      icon: Gem,
      link: '/dashboard/staking',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Manage Wallet',
      description: 'View balances and transactions',
      icon: Wallet,
      link: '/dashboard/wallet',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    }
  ];

  const KeyMetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SEO {...seoData} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO {...seoData} />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section - Welcome & Key Stats */}
        <section className="py-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                  Welcome back, {userData.name}! 👋
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Here's your fractional real estate portfolio overview
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-xl lg:text-2xl font-bold">
                    ${userData.totalPortfolioValue.toLocaleString()}
                  </div>
                  <div className="text-blue-200 text-sm mt-1">Total Portfolio</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-xl lg:text-2xl font-bold">{userData.membershipTier}</div>
                  <div className="text-blue-200 text-sm mt-1">Membership Tier</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Section */}
        <section className="pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <KeyMetricCard
              title="Monthly Income"
              value={`$${userData.monthlyIncome.toFixed(2)}`}
              change="+2.5%"
              icon={DollarSign}
              color="bg-green-500"
            />
            <KeyMetricCard
              title="Properties Owned"
              value={userData.totalProperties}
              change="+1 this month"
              icon={Home}
              color="bg-blue-500"
            />
            <KeyMetricCard
              title="FXCT Balance"
              value={`${userData.fxctBalance.toLocaleString()}`}
              change="+3.2%"
              icon={Gem}
              color="bg-purple-500"
            />
            <KeyMetricCard
              title="Staking Rewards"
              value={`$${userData.stakingRewards.toFixed(2)}`}
              change="+12.1%"
              icon={Award}
              color="bg-orange-500"
            />
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <Link 
                  to="/dashboard/marketplace" 
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm transition-colors"
                >
                  View All <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`block p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${action.color}`}
                  >
                    <div className="flex items-center mb-3">
                      <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                      <h3 className="font-semibold text-gray-900 ml-3">{action.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center text-xs font-medium text-gray-700">
                      Go to {action.title.toLowerCase()} <ArrowRight className="ml-1 w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Widget Dashboard Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Dashboard Widgets</h2>
                <DashboardHeader 
                  user={dashboardData?.profile?.name || userData.name} 
                  lastUpdated={lastUpdated}
                  compact={true}
                />
              </div>

              {/* Status Alerts */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Warning: {error}. Using cached data.</span>
                </div>
              )}

              {dashboardData && dashboardData.errors?.length === 0 && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>✅ Connected to backend - showing live dashboard data</span>
                </div>
              )}

              {/* Widget Customization Toolbar */}
              <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="text-sm text-gray-600">
                  Drag and resize widgets to personalize your dashboard.
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCustomizer(true)}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                    title="Open customizer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={toggleCustomization}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm border transition-all ${
                      isCustomizing 
                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                        : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                    }`}
                    title="Toggle drag mode"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{isCustomizing ? 'Dragging Enabled' : 'Enable Dragging'}</span>
                  </button>
                </div>
              </div>

              {/* Widgets Grid */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <ResponsiveGridLayout
                  className="layout"
                  layouts={filteredLayouts}
                  breakpoints={GRID_BREAKPOINTS}
                  cols={GRID_COLS}
                  rowHeight={ROW_HEIGHT}
                  margin={GRID_MARGIN}
                  containerPadding={CONTAINER_PADDING}
                  isDraggable={isCustomizing}
                  isResizable={isCustomizing}
                  onLayoutChange={handleLayoutChange}
                  onBreakpointChange={handleBreakpointChange}
                  compactType="vertical"
                >
                  {(filteredLayouts[currentBreakpoint] || []).map(item => (
                    <div key={item.i}>
                      {renderWidget(item.i)}
                    </div>
                  ))}
                </ResponsiveGridLayout>
              </div>

              {/* Customizer Panel */}
              <DashboardCustomizer
                isOpen={showCustomizer}
                onClose={() => setShowCustomizer(false)}
                enabledWidgets={enabledWidgets}
                onToggleWidget={handleToggleWidget}
                onSaveLayout={handleSaveLayout}
                onResetLayout={handleResetLayout}
                layout={filteredLayouts[currentBreakpoint]}
                currentBreakpoint={currentBreakpoint}
              />
            </section>
            
          </div>

          {/* Right Sidebar - Activity & Info */}
          <div className="space-y-6">
            
            {/* Recent Activity */}
            <section>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link 
                    to="/dashboard/analytics" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center transition-colors"
                  >
                    View all activity <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-400" />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg border transition-colors ${
                      notification.unread 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link 
                    to="/dashboard/support" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center transition-colors"
                  >
                    View all notifications <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Platform Status */}
            <section>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Status</h3>
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Platform Uptime</span>
                    <span className="text-sm font-bold text-green-600">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Support Available</span>
                    <span className="text-sm font-bold text-blue-600">24/7</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">Assets Secured</span>
                    <span className="text-sm font-bold text-purple-600">$50M+</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center space-x-4">
                  <Link 
                    to="/dashboard/support" 
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Support
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link 
                    to="/faq" 
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    FAQ
                  </Link>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
