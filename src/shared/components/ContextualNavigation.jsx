import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, TrendingUp, Wallet, Building, Settings, Users, BarChart3, Shield, Search, Star, Zap } from 'lucide-react';

const ContextualNavigation = ({ customSuggestions = [], maxSuggestions = 3 }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define navigation suggestions based on current page context
  const navigationRules = {
    '/home': [
      { path: '/marketplace', title: 'Start Investing', description: 'Browse available properties with as little as $100', icon: Building, priority: 10 },
      { path: '/ecosystem', title: 'Learn About Tokens', description: 'Understand FXCT and FXST tokens', icon: Star, priority: 8 },
      { path: '/how-it-works', title: 'How It Works', description: 'Learn the investment process', icon: Search, priority: 6 }
    ],
    '/marketplace': [
      { path: '/signup?plan=investor', title: 'Create Account', description: 'Start your investment journey', icon: Users, priority: 10 },
      { path: '/how-it-works', title: 'How It Works', description: 'Learn the investment process', icon: Search, priority: 8 },
      { path: '/pricing', title: 'View Membership Plans', description: 'Unlock premium features', icon: Star, priority: 6 }
    ],
    '/ecosystem': [
      { path: '/marketplace', title: 'Start Investing', description: 'Put token knowledge into practice', icon: Building, priority: 10 },
      { path: '/pre-sale', title: 'Join FXCT Pre-Sale', description: 'Get early access to utility tokens', icon: Zap, priority: 9 },
      { path: '/pricing', title: 'Premium Features', description: 'Unlock advanced token benefits', icon: Star, priority: 7 }
    ],
    '/how-it-works': [
      { path: '/marketplace', title: 'Browse Properties', description: 'See the process in action', icon: Building, priority: 10 },
      { path: '/signup?plan=investor', title: 'Get Started', description: 'Create your investor account', icon: Users, priority: 9 },
      { path: '/ecosystem', title: 'Token Benefits', description: 'Understand the token ecosystem', icon: Star, priority: 6 }
    ],
    '/pricing': [
      { path: '/signup?plan=investor', title: 'Start Free Trial', description: 'Begin with investor membership', icon: Users, priority: 10 },
      { path: '/marketplace', title: 'See Premium Properties', description: 'Access exclusive investments', icon: Building, priority: 8 },
      { path: '/pre-sale', title: 'FXCT Pre-Sale', description: 'Additional fee reductions', icon: Zap, priority: 7 }
    ],
    '/pre-sale': [
      { path: '/ecosystem', title: 'Token Ecosystem', description: 'Learn how FXCT powers the platform', icon: Star, priority: 10 },
      { path: '/marketplace', title: 'Use Your Tokens', description: 'Start investing with benefits', icon: Building, priority: 8 },
      { path: '/pricing', title: 'Member Benefits', description: 'See all membership perks', icon: Users, priority: 6 }
    ],
    // Dashboard context - post-login suggestions
    '/dashboard': [
      { path: '/dashboard/investments', title: 'View Investments', description: 'Track your portfolio performance', icon: TrendingUp, priority: 10 },
      { path: '/dashboard/wallet', title: 'Manage Wallet', description: 'Handle your digital assets', icon: Wallet, priority: 9 },
      { path: '/marketplace', title: 'Discover More Properties', description: 'Expand your portfolio', icon: Building, priority: 8 }
    ],
    '/dashboard/investments': [
      { path: '/marketplace', title: 'Find More Properties', description: 'Diversify your portfolio', icon: Building, priority: 10 },
      { path: '/dashboard/staking', title: 'Stake Your Tokens', description: 'Earn additional rewards', icon: Star, priority: 8 },
      { path: '/dashboard/properties', title: 'Property Analytics', description: 'Deep dive into performance', icon: BarChart3, priority: 7 }
    ],
    '/dashboard/wallet': [
      { path: '/dashboard/trading', title: 'Trade Tokens', description: 'Buy/sell your property shares', icon: TrendingUp, priority: 10 },
      { path: '/dashboard/staking', title: 'Stake FXCT', description: 'Earn staking rewards', icon: Star, priority: 9 },
      { path: '/marketplace', title: 'Invest More', description: 'Use your balance to invest', icon: Building, priority: 8 }
    ],
    '/dashboard/staking': [
      { path: '/dashboard/wallet', title: 'Check Earnings', description: 'View your staking rewards', icon: Wallet, priority: 10 },
      { path: '/dashboard/trading', title: 'Trade Rewards', description: 'Convert rewards to other assets', icon: TrendingUp, priority: 8 },
      { path: '/marketplace', title: 'Reinvest Rewards', description: 'Compound your earnings', icon: Building, priority: 7 }
    ],
    // Admin context - management flow
    '/admin': [
      { path: '/admin/users', title: 'User Management', description: 'Monitor platform users', icon: Users, priority: 10 },
      { path: '/admin/analytics', title: 'Platform Analytics', description: 'View business metrics', icon: BarChart3, priority: 9 },
      { path: '/admin/properties', title: 'Property Listings', description: 'Manage investment properties', icon: Building, priority: 8 }
    ],
    '/admin/users': [
      { path: '/admin/kyc', title: 'KYC Review', description: 'Process user verifications', icon: Shield, priority: 10 },
      { path: '/admin/analytics', title: 'User Analytics', description: 'Analyze user behavior', icon: BarChart3, priority: 8 },
      { path: '/admin/communications', title: 'Contact Users', description: 'Send messages or updates', icon: Users, priority: 7 }
    ],
    '/admin/properties': [
      { path: '/admin/marketplace', title: 'Browse Marketplace', description: 'See properties as users do', icon: Building, priority: 10 },
      { path: '/admin/ai-search', title: 'AI Property Search', description: 'Find new investment opportunities', icon: Search, priority: 9 },
      { path: '/admin/analytics', title: 'Property Analytics', description: 'Track property performance', icon: BarChart3, priority: 8 }
    ]
  };

  // Get suggestions for current path
  const baseSuggestions = navigationRules[currentPath] || [];
  
  // Merge with custom suggestions and sort by priority
  const allSuggestions = [...baseSuggestions, ...customSuggestions]
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, maxSuggestions);

  if (allSuggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span>Next Steps</span>
        <ArrowRight size={18} className="ml-2 text-blue-600" />
      </h3>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {allSuggestions.map((suggestion, index) => (
          <Link
            key={`${suggestion.path}-${index}`}
            to={suggestion.path}
            className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 block"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <suggestion.icon size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-800 transition-colors">
                  {suggestion.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContextualNavigation;
