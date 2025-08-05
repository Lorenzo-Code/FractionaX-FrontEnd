import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
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

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "User Analytics", path: "/admin/analytics" }, // Phase 1
    { name: "Security Controls", path: "/admin/security" }, // Phase 2
    { name: "Communications", path: "/admin/communications" }, // Phase 2
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

  const isCollapsed = sidebarMode === "collapsed";
  const isHidden = sidebarMode === "hidden";

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <aside
  className={`transition-all duration-300 ease-in-out relative z-10 ${
    isHidden ? "hidden" : isCollapsed ? "w-16 bg-gray-900 text-white p-4" : "w-64 bg-gray-900 text-white p-4"
  }`}
>
  {!isHidden && (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-bold transition-all ${isCollapsed ? "hidden" : "block"}`}>
          ⚙️ FractionaX Admin
        </h1>
        <button
          onClick={cycleSidebarMode}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="space-y-2">
        {navItems.map(({ name, path }) => (
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

      <hr className="border-gray-700 my-4" />
      <button
        onClick={() => logout('/')}
        className={`w-full px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition text-sm ${
          isCollapsed ? "text-center" : "text-left"
        }`}
        title="Logout"
      >
        🚪 {isCollapsed ? "" : "Logout"}
      </button>

      {/* Edge Arrow Button */}
      <button
        onClick={cycleSidebarMode}
        className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-1 shadow z-50 hover:bg-gray-700"
        title="Toggle Sidebar"
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
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
