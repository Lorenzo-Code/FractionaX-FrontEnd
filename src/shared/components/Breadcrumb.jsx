import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ customPaths = {}, showHome = true }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Default path mappings
  const defaultPathMap = {
    'home': 'Home',
    'marketplace': 'Invest Now',
    'how-it-works': 'How It Works',
    'ecosystem': 'Token Ecosystem',
    'pricing': 'Membership',
    'pre-sale': 'FXCT Pre-Sale',
    'dashboard': 'Dashboard',
    'admin': 'Admin Panel',
    'investments': 'My Investments',
    'wallet': 'Wallet',
    'staking': 'Staking',
    'trading': 'Trading',
    'properties': 'Properties',
    'users': 'User Management',
    'analytics': 'Analytics',
    'security': 'Security',
    'communications': 'Communications',
    'support': 'Support',
    'documents': 'Documents',
    'kyc': 'KYC/AML Review',
    'tokens': 'Token Analytics',
    'billing': 'Billing',
    'audit': 'Audit Logs',
    'settings': 'Settings',
    'blogs': 'Blog Management',
    'protocols': 'Protocols',
    'network-analytics': 'Network Analytics',
    'ai-search': 'AI Property Search',
    'internal-wallet': 'Internal Wallet',
    'fst-dividends': 'FST Dividends',
    'FXCT-transfers': 'FXCT Transfers',
    'support-tickets': 'Support Tickets',
    'messages': 'Messages',
    'email-campaigns': 'Email Campaigns',
    'events': 'Events & Webinars',
    'ai-usage': 'AI Reports Usage',
    'smart-leads': 'Smart Lead Scoring',
    'ai-copilot': 'AI Copilot',
    'funnel': 'Funnel Analytics',
    'lifetime-value': 'LTV & Churn',
    'vendors': 'Real Estate Vendors',
    'contracts': 'Contracts & Uploads',
    'affiliates': 'Affiliate Tracking',
    'partners': 'White-Label Panel',
    'risk': 'Regulatory Flags',
    'transactions': 'Transaction Monitoring',
    'api-keys': 'API Keys',
    'webhooks': 'Webhook Logs',
    'env': 'Environment Settings',
    'subscriptions': 'Subscriptions',
    'tax-reports': 'Tax Reports'
  };

  // Merge custom paths with defaults
  const pathMap = { ...defaultPathMap, ...customPaths };

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      {showHome && (
        <>
          <Link 
            to="/home" 
            className="flex items-center hover:text-blue-600 transition-colors"
            aria-label="Home"
          >
            <Home size={16} />
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
        </>
      )}
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = pathMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            {isLast ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-blue-600 transition-colors"
              >
                {displayName}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className="text-gray-400" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
