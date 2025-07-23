import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Menu, X } from "lucide-react"; // optional icons

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
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
    { name: "KYC / AML Review", path: "/admin/kyc" },
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
    { name: "Funnel Analytics", path: "/admin/funnel" },
    { name: "LTV & Churn", path: "/admin/lifetime-value" },
    { name: "Tax Reports", path: "/admin/tax-reports" },
    { name: "Calls & Webinars", path: "/admin/events" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white p-4 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-xl font-bold transition-all ${collapsed ? "hidden" : "block"}`}>
            ⚙️ FractionaX Admin
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
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
              title={collapsed ? name : ""}
            >
              {collapsed ? name[0] : name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <hr className="border-gray-700 my-4" />
        <button
          onClick={logout}
          className={`w-full px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition text-sm ${
            collapsed ? "text-center" : "text-left"
          }`}
          title="Logout"
        >
          🚪 {collapsed ? "" : "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
