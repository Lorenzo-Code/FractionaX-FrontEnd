import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';
import useUserFeatures from '../../../shared/hooks/useUserFeatures';
import {
  Bell,
  Search,
  Settings,
  User,
  MessageSquare,
  LogOut,
  Home,
  TrendingUp,
  Wallet,
  FileText,
  HelpCircle,
  BarChart3,
  CreditCard,
  Shield,
  Gem,
  ArrowUpDown,
  Users,
  Store,
  Building2,
  Menu,
  X,
  ChevronDown,
  Crown
} from 'lucide-react';

const CustomerLayout = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const { hasFeature, loading: featuresLoading, userFeatures } = useUserFeatures();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Token price state for FXCT pricing indicator
  const [tokenPrices, setTokenPrices] = useState({
    FXCT: {
      price: 1.247,
      change: 2.4,
      trend: 'up'
    },
    FXST: {
      price: 0.892,
      change: 1.8,
      trend: 'up'
    }
  });

  // Simulate real-time price updates for FXCT pricing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenPrices(prev => ({
        FXCT: {
          price: +(prev.FXCT.price + (Math.random() - 0.5) * 0.01).toFixed(3),
          change: +(prev.FXCT.change + (Math.random() - 0.5) * 0.1).toFixed(1),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        FXST: {
          price: +(prev.FXST.price + (Math.random() - 0.5) * 0.01).toFixed(3),
          change: +(prev.FXST.change + (Math.random() - 0.5) * 0.1).toFixed(1),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // All available navigation items with feature requirements
  const allNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home, feature: "dashboard" },
    { name: "Marketplace", path: "/dashboard/marketplace", icon: Store, feature: "marketplace" },
    { name: "Portfolio Analytics", path: "/dashboard/analytics", icon: BarChart3, badge: "Premium", feature: "analytics" },
    { name: "Wallet", path: "/dashboard/wallet", icon: Wallet, feature: "wallet" },
    { name: "Staking", path: "/dashboard/staking", icon: Gem, feature: "staking", badge: "New" },
    { name: "Trading", path: "/dashboard/trading", icon: ArrowUpDown, feature: "trading", badge: "Pro" },
    { name: "Membership", path: "/dashboard/membership", icon: Crown, feature: "membership" },
    // Broker-only features
    ...(user && ['broker', 'admin'].includes(user.role) ? [
      { name: "My Listings", path: "/dashboard/my-listings", icon: Building2, feature: "marketplace", badge: "Broker" }
    ] : []),
    { name: "Documents", path: "/dashboard/documents", icon: FileText, feature: "documents" },
    { name: "Security", path: "/dashboard/security", icon: Shield, feature: "security" },
    { name: "Support", path: "/dashboard/support", icon: HelpCircle, feature: "support" },
  ];

  // Filter navigation items based on user features
  const customerNavItems = allNavItems.filter(item => {
    // If features are still loading, show basic items only
    if (featuresLoading) {
      return ['dashboard', 'marketplace', 'wallet', 'support', 'membership'].includes(item.feature);
    }
    
    // Always show membership (it's a basic feature)
    if (item.feature === 'membership') {
      return true;
    }
    
    // Show item if user has the required feature
    return hasFeature(item.feature);
  });

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
      if (showUserMenu && !event.target.closest('.user-menu') && !event.target.closest('.user-menu-button')) {
        setShowUserMenu(false);
      }
      if (showNotifications && !event.target.closest('.notifications') && !event.target.closest('.notifications-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu, showUserMenu, showNotifications]);

  // Debug logging to troubleshoot membership link
  console.log('🧭 CustomerLayout navigation:', {
    featuresLoading,
    userFeatures,
    totalNavItems: allNavItems.length,
    visibleNavItems: customerNavItems.length,
    visibleItems: customerNavItems.map(item => item.name),
    membershipFound: allNavItems.find(item => item.feature === 'membership'),
    membershipFeature: userFeatures?.membership
  });

  const [notifications] = useState([
    { id: 1, type: "success", title: "Investment Complete", message: "Your property investment has been processed", time: "5m ago" },
    { id: 2, type: "info", title: "Token Reward", message: "You've earned 50 FXST tokens", time: "1h ago" },
    { id: 3, type: "warning", title: "KYC Update", message: "Please update your verification documents", time: "2h ago" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Mobile menu button + Logo */}
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="mobile-menu-button md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Logo */}
              <Link to="/home" className="flex-shrink-0" title="Return to Homepage">
                <h1 className="text-lg sm:text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  FractionaX
                </h1>
              </Link>
            </div>

            {/* Center: Search (hidden on small screens) */}
            <div className="hidden sm:flex flex-1 max-w-lg mx-4">
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Token prices (hidden on mobile) */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>FXCT ${tokenPrices.FXCT.price.toFixed(3)}</span>
                  <span className={`ml-1 text-xs ${
                    tokenPrices.FXCT.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tokenPrices.FXCT.change >= 0 ? '+' : ''}{tokenPrices.FXCT.change.toFixed(1)}%
                  </span>
                </div>
                <div className="inline-flex items-center px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                  <span>FXST ${tokenPrices.FXST.price.toFixed(3)}</span>
                  <span className={`ml-1 text-xs ${
                    tokenPrices.FXST.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tokenPrices.FXST.change >= 0 ? '+' : ''}{tokenPrices.FXST.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="notifications-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="notifications absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-400' :
                              notification.type === 'warning' ? 'bg-yellow-400' :
                              notification.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-500">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-menu-button flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <div className="user-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      {hasFeature('settings') && (
                        <Link
                          to="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="flex items-center">
                            <Settings size={16} className="mr-2" />
                            Settings
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout('/home');
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar (visible on small screens) */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search properties, transactions..."
            className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Mobile Token Prices (visible on small screens) */}
      <div className="sm:hidden lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
            <span>FXCT ${tokenPrices.FXCT.price.toFixed(3)}</span>
            <span className={`ml-1 text-xs ${
              tokenPrices.FXCT.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {tokenPrices.FXCT.change >= 0 ? '+' : ''}{tokenPrices.FXCT.change.toFixed(1)}%
            </span>
          </div>
          <div className="inline-flex items-center px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
            <span>FXST ${tokenPrices.FXST.price.toFixed(3)}</span>
            <span className={`ml-1 text-xs ${
              tokenPrices.FXST.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {tokenPrices.FXST.change >= 0 ? '+' : ''}{tokenPrices.FXST.change.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:block w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            {/* Features loading indicator */}
            {featuresLoading && (
              <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-xs text-blue-600">
                  <div className="animate-spin w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full mr-2"></div>
                  Loading navigation...
                </div>
              </div>
            )}
            
            <nav className="space-y-1">
              {customerNavItems.map(({ name, path, icon: Icon, badge }) => (
                <Link
                  key={name}
                  to={path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === path
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon size={18} className="mr-3" />
                    {name}
                  </div>
                  {badge && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
            <div className="mobile-menu fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Features loading indicator */}
                {featuresLoading && (
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-xs text-blue-600">
                      <div className="animate-spin w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full mr-2"></div>
                      Loading navigation...
                    </div>
                  </div>
                )}
                
                <nav className="space-y-1">
                  {customerNavItems.map(({ name, path, icon: Icon, badge }) => (
                    <Link
                      key={name}
                      to={path}
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        pathname === path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="mr-3" />
                        {name}
                      </div>
                      {badge && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                          {badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
