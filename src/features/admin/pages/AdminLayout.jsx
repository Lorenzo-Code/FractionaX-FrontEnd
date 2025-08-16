import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";
import { ChevronLeft, ChevronRight, Menu, X, ArrowRightCircle } from "lucide-react";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const [sidebarMode, setSidebarMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "collapsed" : "expanded";
    }
    return "expanded";
  });

  // Main site navigation links
  const mainNavItems = [
    { name: "🏠 Home", path: "/home" },
    { name: "🏢 Marketplace", path: "/marketplace" },
    { name: "🪙 Pre-Sale", path: "/pre-sale" },
    { name: "📞 Contact", path: "/contact" },
    { name: "📝 Blog", path: "/blog" },
  ];

  // Admin panel navigation links
  const adminNavItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "AI Property Search", path: "/admin/ai-search" },
    { name: "Users", path: "/admin/users" },
    { name: "User Analytics", path: "/admin/analytics" }, // Phase 1
    { name: "Network Analytics", path: "/admin/network-analytics" },
    { name: "Security Controls", path: "/admin/security" }, // Phase 2
    { name: "Communications", path: "/admin/communications" }, // Phase 2
    { name: "Support Tickets", path: "/admin/support-tickets" }, // Support Management
    { name: "Audit Logs", path: "/admin/audit" },
    { name: "Investments", path: "/admin/investments" },
    { name: "Billing", path: "/admin/billing" },
    { name: "Subscription Plans", path: "/admin/subscriptions" },
    { name: "Token Analytics", path: "/admin/tokens" },
    { name: "FXCT Transfer Logs", path: "/admin/FXCT-transfers" },
    { name: "FST Dividends", path: "/admin/fst-dividends" },
    { name: "AI Reports Usage", path: "/admin/ai-usage" },
    { name: "Smart Lead Scoring", path: "/admin/smart-leads" },
    { name: "AI Copilot", path: "/admin/ai-copilot" },
    { name: "User Documents", path: "/admin/documents" },
    { name: "Contracts & Uploads", path: "/admin/contracts" },
    { name: "KYC / AML Review", path: "/admin/kyc" }, // Phase 1 - Updated component
    { name: "Regulatory Flags", path: "/admin/risk" },
    { name: "Transaction Monitoring", path: "/admin/transactions" },
    { name: "User Messages", path: "/admin/messages" },
    { name: "Email Campaigns", path: "/admin/email-campaigns" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Affiliate Tracking", path: "/admin/affiliates" },
    { name: "White-Label Panel", path: "/admin/partners" },
    { name: "Property Listings", path: "/admin/properties" },
    { name: "Real Estate Vendors", path: "/admin/vendors" },
    { name: "API Keys", path: "/admin/api-keys" },
    { name: "Webhook Logs", path: "/admin/webhooks" },
    { name: "Environment Settings", path: "/admin/env" },
    { name: "Protocol Management", path: "/admin/protocols" },
    { name: "Funnel Analytics", path: "/admin/funnel" },
    { name: "LTV & Churn", path: "/admin/lifetime-value" },
    { name: "Tax Reports", path: "/admin/tax-reports" },
    { name: "Calls & Webinars", path: "/admin/events" },
  ];

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

  const isCollapsed = sidebarMode === "collapsed";
  const isHidden = sidebarMode === "hidden";

  return (
    <div className="flex h-full relative">
      {/* Sidebar */}
      <aside
  className={`transition-all duration-300 ease-in-out relative z-10 flex flex-col h-full sticky top-0 ${
    isHidden ? "hidden" : isCollapsed ? "w-16 bg-gray-900 text-white" : "w-64 bg-gray-900 text-white"
  }`}
>
  {!isHidden && (
    <>
      {/* Fixed Header */}
      <div className="flex justify-between items-center mb-6 p-4 flex-shrink-0">
        <h1 className={`text-xl font-bold transition-all ${isCollapsed ? "hidden" : "block"}`}>
          ⚙️ FractionaX Admin
        </h1>
        <button
          onClick={handleTopButtonClick}
          className="text-gray-400 hover:text-white focus:outline-none"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Main Navigation Section - Fixed */}
      <div className="px-4 flex-shrink-0">
        {!isCollapsed && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              Main Navigation
            </h3>
          </div>
        )}
        <nav className="space-y-1 mb-6">
          {mainNavItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`block px-3 py-2 rounded hover:bg-gray-700 text-sm transition ${
                pathname === path ? "bg-gray-700" : ""
              }`}
              title={isCollapsed ? name : ""}
            >
              {isCollapsed ? name.charAt(0) : name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Admin Navigation Section - Smart Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide" style={{
        maxHeight: 'calc(100vh - 200px)' // Leave space for header and footer
      }}>
        {!isCollapsed && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              Admin Panel
            </h3>
          </div>
        )}
        <nav className="space-y-1">
          {adminNavItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`block px-3 py-2 rounded hover:bg-gray-700 text-sm transition ${
                pathname === path ? "bg-gray-700" : ""
              }`}
              title={isCollapsed ? name : ""}
            >
              {isCollapsed ? name.charAt(0) : name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <button
          onClick={() => logout('/')}
          className={`w-full px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition text-sm ${
            isCollapsed ? "text-center" : "text-left"
          }`}
          title="Logout"
        >
          🚪 {isCollapsed ? "" : "Logout"}
        </button>
      </div>

      {/* Edge Arrow Button - Fixed to viewport */}
      <button
        onClick={handleMiddleButtonClick}
        className="fixed top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-1 shadow z-50 hover:bg-gray-700"
        style={{
          left: isCollapsed ? '52px' : '244px', // 16*3.25 = 52px for collapsed, 16*15.25 = 244px for expanded
          transition: 'left 0.3s ease-in-out'
        }}
        title={isCollapsed ? "Hide sidebar" : "Toggle Sidebar"}
      >
        {sidebarMode === "collapsed" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </>
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
      <main className="flex-1 p-6 bg-gray-100 z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
