import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';
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
  Shield
} from 'lucide-react';

const CustomerLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Customer navigation items based on admin rules for wallet management and features
  const customerNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Investments", path: "/dashboard/investments", icon: TrendingUp },
    { name: "Wallet", path: "/dashboard/wallet", icon: Wallet },
    { name: "Property Portfolio", path: "/dashboard/properties", icon: BarChart3 },
    { name: "Fractionax Tokens", path: "/dashboard/tokens", icon: CreditCard },
    { name: "Documents", path: "/dashboard/documents", icon: FileText },
    { name: "Security", path: "/dashboard/security", icon: Shield },
    { name: "Support", path: "/dashboard/support", icon: HelpCircle },
  ];

  const [notifications] = useState([
    { id: 1, type: "success", title: "Investment Complete", message: "Your property investment has been processed", time: "5m ago" },
    { id: 2, type: "info", title: "Token Reward", message: "You've earned 50 FXST tokens", time: "1h ago" },
    { id: 3, type: "warning", title: "KYC Update", message: "Please update your verification documents", time: "2h ago" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">FractionaX</h1>
              </Link>
            </div>

            {/* Search bar */}
            <div className="flex items-center flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search properties, transactions..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right side - notifications and user menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
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
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
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

              {/* Messages */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MessageSquare size={20} />
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings size={20} />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Investor</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {customerNavItems.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === path
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {name}
                </Link>
              ))}
            </nav>

            {/* Logout button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => logout('/home')}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
