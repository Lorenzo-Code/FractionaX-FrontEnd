// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";


const AdminLayout = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const navItems = [
        // 🏠 Core
        { name: "Dashboard", path: "/admin" },
        { name: "Users", path: "/admin/users" },
        { name: "Audit Logs", path: "/admin/audit" },

        // 💼 Investor Activity
        { name: "Investments", path: "/admin/investments" },
        { name: "Billing", path: "/admin/billing" },
        { name: "Subscription Plans", path: "/admin/subscriptions" },

        // 🪙 Tokens
        { name: "Token Analytics", path: "/admin/tokens" },
        { name: "FXCT Transfer Logs", path: "/admin/FXCT-transfers" },
        { name: "FST Dividends", path: "/admin/fst-dividends" },

        // 🧠 AI Tools
        { name: "AI Reports Usage", path: "/admin/ai-usage" },
        { name: "Smart Lead Scoring", path: "/admin/smart-leads" },
        { name: "AI Copilot", path: "/admin/ai-copilot" },

        // 📂 Document Management
        { name: "User Documents", path: "/admin/documents" },
        { name: "Contracts & Uploads", path: "/admin/contracts" },

        // 👥 KYC & Compliance
        { name: "KYC / AML Review", path: "/admin/kyc" },
        { name: "Regulatory Flags", path: "/admin/risk" },
        { name: "Transaction Monitoring", path: "/admin/transactions" },

        // 💬 Communication
        { name: "User Messages", path: "/admin/messages" },
        { name: "Email Campaigns", path: "/admin/email-campaigns" },

        // 🧑‍💼 Partner Tools
        { name: "Affiliate Tracking", path: "/admin/affiliates" },
        { name: "White-Label Panel", path: "/admin/partners" },

        // 🏘 Properties
        { name: "Property Listings", path: "/admin/properties" },
        { name: "Real Estate Vendors", path: "/admin/vendors" },

        // ⚙️ Developer & Env
        { name: "API Keys", path: "/admin/api-keys" },
        { name: "Webhook Logs", path: "/admin/webhooks" },
        { name: "Environment Settings", path: "/admin/env" },

        // 📈 Reporting
        { name: "Funnel Analytics", path: "/admin/funnel" },
        { name: "LTV & Churn", path: "/admin/lifetime-value" },
        { name: "Tax Reports", path: "/admin/tax-reports" },

        // 📅 Events
        { name: "Calls & Webinars", path: "/admin/events" },
    ];



    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-5 space-y-6">
                <h1 className="text-2xl font-bold mb-6">⚙️ FractionaX Admin</h1>
                <nav className="space-y-2">
                    {navItems.map(({ name, path }) => (
                        <Link
                            key={name}
                            to={path}
                            className={`block px-4 py-2 rounded hover:bg-gray-700 transition ${pathname === path ? "bg-gray-700" : ""
                                }`}
                        >
                            {name}
                        </Link>
                    ))}
                </nav>
                <hr className="border-gray-700 my-6" />
                <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white"
                >
                    🚪 Logout
                </button>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
