import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";
import "../../../assets/styles/appstack-sidebar.css";
import "../../../assets/styles/mobile-admin.css";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowRightCircle,
  Bell,
  Search,
  Settings,
  User,
  MessageSquare,
  LogOut,
  Home,
  BarChart3,
  Users,
  Shield,
  Mail,
  FileText,
  Sliders,
  Database,
  CreditCard,
  TrendingUp,
  Building,
  Globe,
  Key,
  Activity,
  Calendar,
  UserCheck,
  AlertTriangle,
  PieChart,
  DollarSign,
  Briefcase,
  Phone,
  Zap,
  BookOpen,
  ChevronDown,
  Star,
  StarOff,
  Wallet,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Ticket
} from "lucide-react";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const [sidebarMode, setSidebarMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "collapsed" : "expanded";
    }
    return "expanded";
  });

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Mobile backdrop state
  const [showMobileBackdrop, setShowMobileBackdrop] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile && sidebarMode === "expanded") {
        setShowMobileBackdrop(true);
      } else {
        setShowMobileBackdrop(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarMode]);

  // Mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    if (isMobile) {
      if (sidebarMode === "expanded") {
        setSidebarMode("collapsed");
        setShowMobileBackdrop(false);
      } else {
        setSidebarMode("expanded");
        setShowMobileBackdrop(true);
      }
    }
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (isMobile && sidebarMode === "expanded") {
      setSidebarMode("collapsed");
      setShowMobileBackdrop(false);
    }
  };

  // Handle navigation link click on mobile
  const handleNavLinkClick = () => {
    if (isMobile && sidebarMode === "expanded") {
      setSidebarMode("collapsed");
      setShowMobileBackdrop(false);
    }
  };

  // Favorites state - stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem('admin-favorites');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('admin-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Add/remove from favorites
  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.path === item.path);
      if (exists) {
        return prev.filter(fav => fav.path !== item.path);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFavorite = (path) => {
    return favorites.some(fav => fav.path === path);
  };

  // AppStack-style organized navigation sections
  const navigationSections = [
    {
      title: "Dashboard",
      items: [
        { name: "Homepage", path: "/home", icon: Home },
        { name: "Dashboard", path: "/admin", icon: Sliders },
        { name: "Customer Dashboard", path: "/dashboard", icon: User, badge: "Customer" },
        { name: "AI Property Search", path: "/admin/ai-search", icon: Search, badge: "AI" },
        { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { name: "Network Analytics", path: "/admin/network-analytics", icon: Activity },
      ]
    },
    {
      title: "User Management",
      items: [
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "KYC / AML Review", path: "/admin/kyc", icon: UserCheck },
        { name: "User Documents", path: "/admin/documents", icon: FileText },
        { name: "Security Controls", path: "/admin/security", icon: Shield },
        { name: "Audit Logs", path: "/admin/audit", icon: Database },
      ]
    },
    {
      title: "Financial Management",
      items: [
        { name: "Internal Wallet", path: "/admin/internal-wallet", icon: Wallet, badge: "New" },
        { name: "Investments", path: "/admin/investments", icon: TrendingUp },
        { name: "Token Analytics", path: "/admin/tokens", icon: CreditCard },
        { name: "FXCT Transfers", path: "/admin/FXCT-transfers", icon: DollarSign },
        { name: "FST Dividends", path: "/admin/fst-dividends", icon: PieChart },
        { name: "Billing", path: "/admin/billing", icon: Briefcase },
        { name: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
        { name: "Tax Reports", path: "/admin/tax-reports", icon: FileText },
      ]
    },
    {
      title: "Communications",
      items: [
        { name: "Support Tickets", path: "/admin/support-tickets", icon: MessageSquare },
        { name: "User Messages", path: "/admin/messages", icon: Mail },
        { name: "Email Campaigns", path: "/admin/email-campaigns", icon: Mail },
        { name: "Communications", path: "/admin/communications", icon: Phone },
        { name: "Calls & Webinars", path: "/admin/events", icon: Calendar },
      ]
    },
    {
      title: "Business Intelligence",
      items: [
        { name: "AI Reports Usage", path: "/admin/ai-usage", icon: Zap, badge: "AI" },
        { name: "Smart Lead Scoring", path: "/admin/smart-leads", icon: TrendingUp },
        { name: "AI Copilot", path: "/admin/ai-copilot", icon: Zap, badge: "New" },
        { name: "Funnel Analytics", path: "/admin/funnel", icon: BarChart3 },
        { name: "LTV & Churn", path: "/admin/lifetime-value", icon: PieChart },
      ]
    },
    {
      title: "Platform Management",
      items: [
        { name: "Property Listings", path: "/admin/properties", icon: Building },
        { name: "Admin Marketplace", path: "/admin/marketplace", icon: Building, badge: "Browse" },
        { name: "Real Estate Vendors", path: "/admin/vendors", icon: Users },
        { name: "Protocol Management", path: "/admin/protocols", icon: Settings },
        { name: "Homepage Management", path: "/admin/homepage", icon: Globe, badge: "Content" },
        { name: "Promo Codes", path: "/admin/promo-codes", icon: Ticket, badge: "Access" },
        { name: "Contracts & Uploads", path: "/admin/contracts", icon: FileText },
        { name: "Blogs", path: "/admin/blogs", icon: BookOpen },
        { name: "Affiliate Tracking", path: "/admin/affiliates", icon: Users },
        { name: "White-Label Panel", path: "/admin/partners", icon: Globe },
      ]
    },
    {
      title: "System & Security",
      items: [
        { name: "User Settings", path: "/admin/settings", icon: User },
        { name: "Regulatory Flags", path: "/admin/risk", icon: AlertTriangle },
        { name: "Transaction Monitoring", path: "/admin/transactions", icon: Activity },
        { name: "API Keys", path: "/admin/api-keys", icon: Key },
        { name: "Webhook Logs", path: "/admin/webhooks", icon: Database },
        { name: "Environment Settings", path: "/admin/env", icon: Settings },
      ]
    }
  ];

  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const cycleSidebarMode = () => {
    setSidebarMode((prev) => {
      if (prev === "expanded") return "collapsed";
      if (prev === "collapsed") return "hidden";
      return "expanded";
    });
  };

  // Top button behavior: when collapsed, expand to full view
  const handleTopButtonClick = () => {
    if (sidebarMode === "collapsed") {
      setSidebarMode("expanded");
    } else {
      cycleSidebarMode();
    }
  };

  // Middle button behavior: when collapsed, hide completely
  const handleMiddleButtonClick = () => {
    if (sidebarMode === "collapsed") {
      setSidebarMode("hidden");
    } else {
      cycleSidebarMode();
    }
  };

  // Initialize expanded sections
  useEffect(() => {
    const defaultExpanded = {};
    navigationSections.forEach(section => {
      defaultExpanded[section.title] = true; // Keep sections expanded by default
    });
    defaultExpanded['Favorites'] = true; // Keep favorites expanded by default
    setExpandedSections(defaultExpanded);
  }, []);

  const isCollapsed = sidebarMode === "collapsed";
  const isHidden = sidebarMode === "hidden";
  const [notifications] = useState([
    { id: 1, type: "info", title: "System Update", message: "Server maintenance completed", time: "2m ago" },
    { id: 2, type: "warning", title: "High API Usage", message: "API costs increased by 12%", time: "1h ago" },
    { id: 3, type: "success", title: "New User", message: "22 new users registered today", time: "2h ago" }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Token price state
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
    },
    BTC: {
      price: 43567.89,
      change: -1.2,
      trend: 'down'
    },
    ETH: {
      price: 2634.52,
      change: 3.1,
      trend: 'up'
    },
    XRP: {
      price: 0.5847,
      change: 0.7,
      trend: 'up'
    }
  });

  // Token holdings (quantities). Replace with real data source when available.
  const [tokenHoldings, setTokenHoldings] = useState({
    FXCT: 12345.678, // example quantity
    FXST: 9876.54   // example quantity
  });

  // Simulate real-time price updates (replace with actual API calls)
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
        },
        BTC: {
          price: +(prev.BTC.price + (Math.random() - 0.5) * 50).toFixed(2),
          change: +(prev.BTC.change + (Math.random() - 0.5) * 0.2).toFixed(1),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        ETH: {
          price: +(prev.ETH.price + (Math.random() - 0.5) * 10).toFixed(2),
          change: +(prev.ETH.change + (Math.random() - 0.5) * 0.2).toFixed(1),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        XRP: {
          price: +(prev.XRP.price + (Math.random() - 0.5) * 0.01).toFixed(4),
          change: +(prev.XRP.change + (Math.random() - 0.5) * 0.2).toFixed(1),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex relative ${isMobile ? 'admin-mobile-compact admin-layout-mobile' : ''}`}>
      {/* Mobile Backdrop */}
      {isMobile && showMobileBackdrop && (
        <div 
          className="mobile-sidebar-backdrop"
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            opacity: 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* AppStack-Style Sidebar */}
      <aside className={`sidebar transition-all duration-300 ease-in-out relative text-white ${
        isHidden ? "hidden" : 
        isCollapsed ? "w-16" : "w-64"
      } ${isMobile && sidebarMode === "expanded" ? "mobile-expanded" : ""}`} 
      style={{
        minWidth: isCollapsed ? '64px' : isMobile && sidebarMode === "expanded" ? '200px' : '260px',
        maxWidth: isCollapsed ? '64px' : isMobile && sidebarMode === "expanded" ? '200px' : '260px',
        backgroundColor: '#191d2a',
        height: '100vh',
        position: isMobile && sidebarMode === "expanded" ? 'fixed' : 'sticky',
        top: 0,
        left: isMobile && sidebarMode === "expanded" ? 0 : 'auto',
        zIndex: isMobile && sidebarMode === "expanded" ? 9999 : 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isMobile && sidebarMode === "expanded" ? '2px 0 10px rgba(0, 0, 0, 0.3)' : 'none'
      }}>
        {!isHidden && (
          <>
            {/* Sidebar Brand - Seamless Logo */}
            <div className="sidebar-brand" style={{
              padding: '1rem 0.5rem 0 0.5rem',
              textAlign: 'center',
              flexShrink: 0
            }}>
              {!isCollapsed ? (
                <Link to="/admin" className="flex items-center justify-center text-white hover:text-white text-decoration-none">
                  <img
                    src="/assets/images/Main_Admin_Logo.png"
                    alt="FractionaX Logo"
                    className="h-35 w-auto max-w-full transition-transform duration-200 hover:scale-105"
                  />
                </Link>
              ) : (
                <button
                  onClick={handleTopButtonClick}
                  className="text-white hover:text-blue-400 focus:outline-none"
                >
                  <img
                    src="/assets/images/TopLogo.png"
                    alt="FractionaX Logo"
                    className="h-10 w-auto"
                  />
                </button>
              )}
            </div>

            {/* Sidebar Navigation - Scrollable container */}
            <div className="admin-sidebar-nav flex-1 overflow-y-auto" style={{ 
              paddingBottom: '1rem',
              maxHeight: 'calc(100vh - 140px)' // Account for header (~80px) and footer (~60px)
            }}>
              <nav className="sidebar-nav">
                <ul className="list-none m-0 p-0">
                  {/* Favorites Section - Always at top */}
                  {favorites.length > 0 && (
                    <React.Fragment>
                      {/* Favorites Header */}
                      {!isCollapsed ? (
                        <li className="sidebar-item">
                          <button
                            onClick={() => toggleSection('Favorites')}
                            className="sidebar-link w-full flex items-center justify-between text-left"
                            style={{
                              color: '#fbbf24', // Yellow color for favorites header
                              fontWeight: '600'
                            }}
                          >
                            <span>⭐ Favorites</span>
                            <ChevronDown
                              size={12}
                              className={`transition-transform duration-200 ${expandedSections['Favorites'] ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </li>
                      ) : (
                        <li className="sidebar-header" style={{
                          padding: '0.5rem 0',
                          borderTop: '1px solid rgba(251, 191, 36, 0.3)',
                          marginTop: '0.5rem'
                        }}></li>
                      )}

                      {/* Favorites Items */}
                      <div className={`section-dropdown ${!isCollapsed && !expandedSections['Favorites'] ? 'hidden' : ''}`}>
                        {favorites.map((item) => (
                          <li key={`fav-${item.path}`} className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}>
                            <div className="flex items-center group">
                              <Link
                                to={item.path}
                                className={`sidebar-link flex items-center flex-1 ${pathname === item.path ? 'active' : ''}`}
                                title={isCollapsed ? item.name : ''}
                                onClick={handleNavLinkClick}
                                style={{
                                  paddingLeft: isCollapsed ? '1.625rem' : '2.5rem',
                                  paddingRight: isCollapsed ? '0.75rem' : '0.5rem'
                                }}
                              >
                                {item.icon && (
                                  <item.icon size={16} className="lucide align-middle mr-3" />
                                )}
                                {!isCollapsed && (
                                  <>
                                    <span className="align-middle">{item.name}</span>
                                    {item.badge && (
                                      <span className="badge-sidebar-primary">
                                        {item.badge}
                                      </span>
                                    )}
                                  </>
                                )}
                              </Link>
                              {!isCollapsed && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(item);
                                  }}
                                  className="p-1 text-yellow-400 hover:text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  title="Remove from favorites"
                                >
                                  <Star size={12} fill="currentColor" />
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </div>

                      {/* Separator after favorites */}
                      <li className="sidebar-header" style={{
                        padding: '0.5rem 0',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginTop: '0.5rem'
                      }}></li>
                    </React.Fragment>
                  )}

                  {navigationSections.map((section) => (
                    <React.Fragment key={section.title}>
                      {/* Section Header - Clickable for dropdown */}
                      {!isCollapsed ? (
                        <li className="sidebar-item">
                          <button
                            onClick={() => toggleSection(section.title)}
                            className="sidebar-link w-full flex items-center justify-between text-left"
                          >
                            <span>{section.title}</span>
                            <ChevronDown
                              size={12}
                              className={`transition-transform duration-200 ${expandedSections[section.title] ? 'rotate-180' : ''
                                }`}
                            />
                          </button>
                        </li>
                      ) : (
                        // Show section separator when collapsed
                        <li className="sidebar-header" style={{
                          padding: '0.5rem 0',
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          marginTop: '0.5rem'
                        }}></li>
                      )}

                      {/* Section Items - Collapsible */}
                      <div className={`section-dropdown ${!isCollapsed && !expandedSections[section.title] ? 'hidden' : ''
                        }`}>
                        {section.items.map((item) => (
                          <li key={item.name} className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}>
                            <div className="flex items-center group">
                              <Link
                                to={item.path}
                                className={`sidebar-link flex items-center flex-1 ${pathname === item.path ? 'active' : ''}`}
                                title={isCollapsed ? item.name : ''}
                                onClick={handleNavLinkClick}
                                style={{
                                  paddingLeft: isCollapsed ? '1.625rem' : '2.5rem',
                                  paddingRight: isCollapsed ? '0.75rem' : '0.5rem'
                                }}
                              >
                                {item.icon && (
                                  <item.icon size={16} className="lucide align-middle mr-3" />
                                )}
                                {!isCollapsed && (
                                  <>
                                    <span className="align-middle">{item.name}</span>
                                    {item.badge && (
                                      <span className="badge-sidebar-primary">
                                        {item.badge}
                                      </span>
                                    )}
                                  </>
                                )}
                              </Link>
                              {!isCollapsed && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(item);
                                  }}
                                  className={`p-1 transition-all duration-200 opacity-0 group-hover:opacity-100 ${isFavorite(item.path)
                                      ? 'text-yellow-400 hover:text-yellow-300'
                                      : 'text-gray-400 hover:text-yellow-400'
                                    }`}
                                  title={isFavorite(item.path) ? "Remove from favorites" : "Add to favorites"}
                                >
                                  {isFavorite(item.path) ? (
                                    <Star size={12} fill="currentColor" />
                                  ) : (
                                    <StarOff size={12} />
                                  )}
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Sidebar Footer - Fixed at bottom */}
            <div className="sidebar-footer p-4" style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: '#191d2a',
              flexShrink: 0
            }}>
              <button
                onClick={() => logout('/')}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200"
                title="Logout"
              >
                <LogOut size={16} className={isCollapsed ? '' : 'mr-2'} />
                {!isCollapsed && 'Logout'}
              </button>
            </div>
          </>
        )}

        {/* Sidebar Toggle Button - AppStack Style */}
        {!isHidden && (
          <button
            onClick={cycleSidebarMode}
            className="sidebar-toggle-btn"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </aside>


      {/* Restore Sidebar Button */}
      {isHidden && (
        <button
          onClick={() => setSidebarMode("expanded")}
          className="fixed top-1/2 left-2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow z-50"
          title="Show Sidebar"
        >
          <ArrowRightCircle size={12} />
        </button>
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col bg-gray-50 z-0 w-full">
        {/* Top Navbar - Mobile-Optimized */}
        <div className="bg-white border-b border-gray-200 shadow-sm w-full">
          {/* Mobile Layout */}
          {isMobile ? (
            <div className="px-2 py-1.5">
              {/* Top row - Menu button and essential info */}
              <div className="flex items-center justify-between mb-1.5">
                <button
                  onClick={handleMobileSidebarToggle}
                  className="p-1.5 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50 touch-manipulation"
                  title="Toggle menu"
                >
                  {sidebarMode === "expanded" ? <X size={20} /> : <Menu size={20} />}
                </button>
                
                {/* Mobile wallet info - compact */}
                <Link
                  to="/admin/internal-wallet"
                  className="flex items-center space-x-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md touch-manipulation"
                >
                  <Wallet size={12} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">
                    ${((tokenHoldings.FXCT * tokenPrices.FXCT.price) + (tokenHoldings.FXST * tokenPrices.FXST.price)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </Link>
                
                {/* Mobile user avatar - simplified */}
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="relative p-1 rounded-md hover:bg-gray-50 touch-manipulation"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative">
                    <User size={14} className="text-white" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-3.5 w-3.5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                </button>
              </div>
              
              {/* Bottom row - Search bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search admin..."
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 touch-manipulation text-sm"
                />
              </div>
              
              {/* Mobile token pills - Smaller and more compact */}
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <button className="inline-flex items-center px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 touch-manipulation">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                  <span>FXCT ${tokenPrices.FXCT.price.toFixed(3)}</span>
                </button>
                <button className="inline-flex items-center px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700 touch-manipulation">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></div>
                  <span>FXST ${tokenPrices.FXST.price.toFixed(3)}</span>
                </button>
                <button className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-600 touch-manipulation">
                  <span>+3</span>
                </button>
              </div>
            </div>
          ) : (
            /* Desktop Layout */
            <div className="px-4 lg:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between w-full">
                {/* Center - Search Bar with Token Filter Pills */}
                <div className="flex-1 max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
                  <div className="space-y-2">
                    {/* Main Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search properties, users, transactions, analytics..."
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow focus:shadow-md"
                      />
                    </div>

                    {/* Token Filter Pills - Desktop */}
                    <div className="-mt-1">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition-all duration-200 hover:shadow-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                          <span>FXCT ${tokenPrices.FXCT.price.toFixed(3)}</span>
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition-all duration-200 hover:shadow-sm">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                          <span>FXST ${tokenPrices.FXST.price.toFixed(3)}</span>
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition-all duration-200 hover:shadow-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></div>
                          <span>BTC ${tokenPrices.BTC.price.toLocaleString()}</span>
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition-all duration-200 hover:shadow-sm">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></div>
                          <span>ETH ${tokenPrices.ETH.price.toLocaleString()}</span>
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition-all duration-200 hover:shadow-sm">
                          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></div>
                          <span>XRP ${tokenPrices.XRP.price.toFixed(4)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Right side - Actions & Profile */}
                <div className="flex items-center space-x-4 ml-8">
                {/* Internal Wallet Widget - Shows USD total with token breakdown on hover */}
                <div className="relative group">
                  <Link
                    to="/admin/internal-wallet"
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <Wallet size={16} className="text-blue-600" />
                    <div className="text-right">
                      <div className="text-xs text-blue-600 font-medium">Internal Wallet</div>
                      <div className="text-sm font-bold text-blue-700">
                        ${((tokenHoldings.FXCT * tokenPrices.FXCT.price) + (tokenHoldings.FXST * tokenPrices.FXST.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Wallet Hover Tooltip - Shows Token Breakdown */}
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">Token Holdings Breakdown</h4>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Live</span>
                      </div>
                      <div className="space-y-3">
                        {/* FXCT Holdings */}
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">FXCT</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-700">
                              {tokenHoldings.FXCT.toLocaleString(undefined, { maximumFractionDigits: 2 })} tokens
                            </div>
                            <div className="text-xs text-gray-500">
                              ${(tokenHoldings.FXCT * tokenPrices.FXCT.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                        
                        {/* FXST Holdings */}
                        <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">FXST</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-700">
                              {tokenHoldings.FXST.toLocaleString(undefined, { maximumFractionDigits: 2 })} tokens
                            </div>
                            <div className="text-xs text-gray-500">
                              ${(tokenHoldings.FXST * tokenPrices.FXST.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Total Summary */}
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-900">Total Portfolio Value:</span>
                            <span className="text-sm font-bold text-green-600">
                              ${((tokenHoldings.FXCT * tokenPrices.FXCT.price) + (tokenHoldings.FXST * tokenPrices.FXST.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Last updated: 2 min ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 ml-2 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm relative">
                      <User size={16} className="text-white" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Admin</div>
                      <div className="text-xs text-gray-500">Administrator</div>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className={`absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${
                      isMobile 
                        ? 'right-0 left-0 w-screen transform -translate-x-3 max-h-96 overflow-y-auto'
                        : 'right-0 w-80'
                    }`}>
                      {/* User Info Header */}
                      <div className={`border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 ${
                        isMobile ? 'px-4 py-4' : 'px-4 py-3'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm ${
                            isMobile ? 'w-14 h-14' : 'w-12 h-12'
                          }`}>
                            <User size={isMobile ? 24 : 20} className="text-white" />
                          </div>
                          <div>
                            <div className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-sm'}`}>Admin User</div>
                            <div className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>admin@fractionax.com</div>
                            <div className={`text-blue-600 font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>Administrator</div>
                          </div>
                          {isMobile && (
                            <button
                              onClick={() => setShowUserDropdown(false)}
                              className="ml-auto p-2 rounded-lg hover:bg-gray-100 touch-manipulation"
                            >
                              <X size={20} className="text-gray-500" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className={isMobile ? 'p-3' : 'p-2'}>
                        {/* Notifications Section */}
                        <div className="px-2 py-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Notifications</span>
                            {notifications.length > 0 && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                {notifications.length} new
                              </span>
                            )}
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {notifications.length > 0 ? (
                              notifications.slice(0, 3).map((notification) => (
                                <div key={notification.id} className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                                  <div className="flex items-start space-x-2">
                                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                                      notification.type === 'success' ? 'bg-green-400' :
                                      notification.type === 'warning' ? 'bg-yellow-400' :
                                      notification.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 truncate">{notification.title}</p>
                                      <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                                      <p className="text-xs text-gray-400">{notification.time}</p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-500 text-center py-2">No new notifications</p>
                            )}
                          </div>
                          {notifications.length > 3 && (
                            <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 text-center">
                              View all {notifications.length} notifications
                            </button>
                          )}
                        </div>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <button className={`w-full flex items-center space-x-3 rounded-md transition-colors ${
                            isMobile 
                              ? 'px-4 py-3 text-base hover:bg-gray-50 active:bg-gray-100 touch-manipulation'
                              : 'px-3 py-2 text-sm hover:bg-gray-50'
                          } text-gray-700`}>
                            <MessageSquare size={isMobile ? 20 : 16} className="text-gray-500" />
                            <span>Messages</span>
                            <span className={`ml-auto rounded-full bg-blue-100 text-blue-800 font-medium ${
                              isMobile ? 'px-2.5 py-1 text-sm' : 'px-2 py-1 text-xs'
                            }`}>2</span>
                          </button>

                          <Link
                            to="/admin/settings"
                            className={`w-full flex items-center space-x-3 rounded-md transition-colors ${
                              isMobile 
                                ? 'px-4 py-3 text-base hover:bg-gray-50 active:bg-gray-100 touch-manipulation'
                                : 'px-3 py-2 text-sm hover:bg-gray-50'
                            } text-gray-700`}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Settings size={isMobile ? 20 : 16} className="text-gray-500" />
                            <span>Settings</span>
                          </Link>

                          <Link
                            to="/admin/internal-wallet"
                            className={`w-full flex items-center space-x-3 rounded-md transition-colors ${
                              isMobile 
                                ? 'px-4 py-3 text-base hover:bg-gray-50 active:bg-gray-100 touch-manipulation'
                                : 'px-3 py-2 text-sm hover:bg-gray-50'
                            } text-gray-700`}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Wallet size={isMobile ? 20 : 16} className="text-gray-500" />
                            <div className="flex-1 flex items-center justify-between">
                              <span>Internal Wallet</span>
                              <span className={`font-medium text-blue-600 ${
                                isMobile ? 'text-sm' : 'text-xs'
                              }`}>$12,450.75</span>
                            </div>
                          </Link>

                          <button className={`w-full flex items-center space-x-3 rounded-md transition-colors ${
                            isMobile 
                              ? 'px-4 py-3 text-base hover:bg-gray-50 active:bg-gray-100 touch-manipulation'
                              : 'px-3 py-2 text-sm hover:bg-gray-50'
                          } text-gray-700`}>
                            <User size={isMobile ? 20 : 16} className="text-gray-500" />
                            <span>Profile</span>
                          </button>

                          <button className={`w-full flex items-center space-x-3 rounded-md transition-colors ${
                            isMobile 
                              ? 'px-4 py-3 text-base hover:bg-gray-50 active:bg-gray-100 touch-manipulation'
                              : 'px-3 py-2 text-sm hover:bg-gray-50'
                          } text-gray-700`}>
                            <Activity size={isMobile ? 20 : 16} className="text-gray-500" />
                            <span>Activity Log</span>
                          </button>
                        </div>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Logout */}
                        <button
                          onClick={() => logout('/')}
                          className={`w-full flex items-center space-x-3 rounded-md transition-colors text-red-600 hover:bg-red-50 ${
                            isMobile 
                              ? 'px-4 py-3 text-base active:bg-red-100 touch-manipulation'
                              : 'px-3 py-2 text-sm'
                          }`}
                        >
                          <LogOut size={isMobile ? 20 : 16} className="text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content area - Natural responsive behavior like other pages */}
        <div className="flex-1 w-full overflow-x-auto">
          {/* Content wrapper - Let it behave naturally */}
          <div className="w-full max-w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
