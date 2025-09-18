import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target,
  ArrowRight,
  PlayCircle,
  Star,
  Coins,
  Shield,
  Award
} from 'lucide-react';
import InvestmentMarketplaceHero from '../components/InvestmentMarketplaceHero';
import InvestmentOnboarding from '../components/InvestmentOnboarding';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

const InvestmentHomepage = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userType, setUserType] = useState('guest');

  // Mock data for homepage stats
  const [liveStats] = useState({
    activeInvestors: 25847,
    totalFunding: 12500000,
    propertiesFunded: 156,
    avgMonthlyYield: 8.2,
    recentActivity: [
      { type: 'funding', property: 'Austin Tech Hub Condo', amount: 485000, time: '2 min ago' },
      { type: 'bid', user: 'InvestorTX_2024', amount: 750, time: '5 min ago' },
      { type: 'milestone', property: 'Houston Commercial Plaza', milestone: '90% funded', time: '12 min ago' }
    ]
  });

  const [featuredOpportunities] = useState([
    {
      id: 1,
      title: 'Downtown Austin Tech Hub',
      location: 'Austin, TX',
      price: 485000,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
      fxctCommitted: 18500,
      targetFunding: 20000,
      progressPercent: 92,
      investorsCount: 67,
      expectedYield: 9.2,
      status: 'Hot Deal',
      daysLeft: 3,
      highlights: ['Prime tech district', 'High rental demand', '5min to campus']
    },
    {
      id: 2,
      title: 'Dallas Suburban Family Home',
      location: 'Dallas, TX',
      price: 325000,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
      fxctCommitted: 12800,
      targetFunding: 15000,
      progressPercent: 85,
      investorsCount: 45,
      expectedYield: 7.8,
      status: 'Funding',
      daysLeft: 8,
      highlights: ['Great school district', 'Family neighborhood', 'Strong appreciation']
    },
    {
      id: 3,
      title: 'Houston Commercial Plaza',
      location: 'Houston, TX',
      price: 750000,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      fxctCommitted: 28200,
      targetFunding: 30000,
      progressPercent: 94,
      investorsCount: 89,
      expectedYield: 11.5,
      status: 'Almost Funded',
      daysLeft: 2,
      highlights: ['Multi-tenant', 'Prime location', 'Long-term leases']
    }
  ]);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (onboardingData) => {
    console.log('Onboarding completed:', onboardingData);
    setShowOnboarding(false);
    // Navigate to marketplace or dashboard based on user choice
    navigate('/marketplace');
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleStartBidding = () => {
    navigate('/marketplace?tab=bidding');
  };

  const handleExploreProperties = () => {
    navigate('/marketplace');
  };

  // SEO Configuration
  const seoData = generatePageSEO({
    title: 'Fractional Real Estate Investing | Start with $100 | FractionaX',
    description: 'Invest in real estate starting at $100. Join 25K+ investors earning 8%+ yields through fractional property ownership. Community-driven, SEC-compliant.',
    keywords: [
      'fractional real estate investment',
      'real estate crowdfunding',
      '$100 minimum investment',
      'property investment marketplace',
      'FXCT token investing',
      'passive real estate income'
    ],
    url: '/',
  });

  return (
    <>
      <SEO {...seoData}>
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/images/fractionax-social-share.jpg" />
      </SEO>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Live Marketplace Data */}
        <InvestmentMarketplaceHero 
          onStartBidding={handleStartBidding}
          onExploreProperties={handleExploreProperties}
        />

        {/* Quick Value Proposition */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why 25,000+ Investors Choose FractionaX
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The only platform combining community wisdom with fractional real estate ownership
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start with $100</h3>
                <p className="text-gray-600">No $50K minimums. Own real estate with pocket change.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Validated</h3>
                <p className="text-gray-600">Properties backed by thousands of smart investors.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal Ownership</h3>
                <p className="text-gray-600">SEC-compliant security tokens = real property shares.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-gray-600">Get paid 5-10% FXCT bonuses for community participation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Investment Opportunities */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Hot Investment Opportunities</h2>
                <p className="text-gray-600">Properties with active community backing</p>
              </div>
              <button 
                onClick={handleExploreProperties}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredOpportunities.map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => handleViewProperty(property.id)}
                >
                  {/* Property Image */}
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
                      property.status === 'Hot Deal' ? 'bg-red-500 text-white' :
                      property.status === 'Almost Funded' ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {property.status}
                    </div>
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-sm font-semibold text-gray-700">
                      {property.daysLeft} days left
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        ${property.price.toLocaleString()}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">{property.expectedYield}%</div>
                        <div className="text-sm text-gray-500">Expected Yield</div>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{property.fxctCommitted.toLocaleString()} FXCT raised</span>
                        <span className="font-semibold">{property.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${property.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Property Highlights */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {property.highlights.map((highlight, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Investor Count */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{property.investorsCount} investors</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>Target: {property.targetFunding.toLocaleString()} FXCT</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (Simplified) */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Investing in 3 Steps</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Join our community of smart investors building wealth through fractional real estate
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Research</h3>
                <p className="text-gray-600">
                  Explore community-vetted properties with transparent funding progress and investor activity
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Bid with FXCT</h3>
                <p className="text-gray-600">
                  Use FXCT tokens to signal interest, validate demand, and earn 5-10% rewards for participation
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Own & Earn</h3>
                <p className="text-gray-600">
                  Get legal property shares (FXST tokens) and earn monthly dividends from rental income
                </p>
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Live Activity Feed */}
        <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Live Investment Activity</h2>
              <p className="text-xl text-blue-100">See what's happening in our community right now</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
              <div>
                <div className="text-3xl font-bold">{liveStats.activeInvestors.toLocaleString()}</div>
                <div className="text-blue-200">Active Investors</div>
              </div>
              <div>
                <div className="text-3xl font-bold">${(liveStats.totalFunding / 1000000).toFixed(1)}M</div>
                <div className="text-blue-200">Total Funding</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{liveStats.propertiesFunded}</div>
                <div className="text-blue-200">Properties Funded</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{liveStats.avgMonthlyYield}%</div>
                <div className="text-blue-200">Avg Monthly Yield</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {liveStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'funding' ? 'bg-green-500' :
                        activity.type === 'bid' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}>
                        {activity.type === 'funding' && <Target className="w-4 h-4" />}
                        {activity.type === 'bid' && <Coins className="w-4 h-4" />}
                        {activity.type === 'milestone' && <Star className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium">
                          {activity.type === 'funding' && `Property funded: ${activity.property}`}
                          {activity.type === 'bid' && `${activity.user} placed bid`}
                          {activity.type === 'milestone' && `${activity.property}: ${activity.milestone}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <div className="font-semibold">
                          {activity.type === 'funding' ? `$${activity.amount.toLocaleString()}` : `${activity.amount} FXCT`}
                        </div>
                      )}
                      <div className="text-sm text-blue-200">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Building Wealth?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 25,000+ investors already earning passive income through fractional real estate
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Start Investing Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/how-it-works')}
                className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Learn More</span>
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              No credit card required • Free FXCT tokens included • Start with just $100
            </div>
          </div>
        </section>
      </div>

      {/* Investment Onboarding Modal */}
      {showOnboarding && (
        <InvestmentOnboarding
          onComplete={handleOnboardingComplete}
          userType={userType}
        />
      )}
    </>
  );
};

export default InvestmentHomepage;
