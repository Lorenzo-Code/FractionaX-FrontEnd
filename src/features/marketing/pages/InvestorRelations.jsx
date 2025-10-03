import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fundraisingConfig, calculateProgress, calculateDaysLeft, formatCurrency, getNextMilestone } from '../../../data/fundraisingConfig.js';
import { 
  ArrowTrendingUpIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const InvestorRelations = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    platform: '',
    investmentRange: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Get fundraising data from centralized config
  const fundraisingData = {
    targetAmount: fundraisingConfig.targetAmount,
    currentAmount: fundraisingConfig.currentAmount,
    minimumInvestment: fundraisingConfig.minimumInvestment,
    maximumInvestment: fundraisingConfig.maximumInvestment,
    investorCount: fundraisingConfig.investorCount,
    daysLeft: calculateDaysLeft(),
    lastUpdated: fundraisingConfig.lastUpdated,
    safeTerms: fundraisingConfig.safeTerms
  };

  const progressPercentage = calculateProgress();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        platform: '',
        investmentRange: '',
        message: ''
      });
    }, 1000);
  };

  const platforms = [
    { name: 'Republic', logo: '/api/placeholder/120/60', url: 'https://republic.co' },
    { name: 'SeedInvest', logo: '/api/placeholder/120/60', url: 'https://seedinvest.com' },
    { name: 'StartEngine', logo: '/api/placeholder/120/60', url: 'https://startengine.com' },
    { name: 'Wefunder', logo: '/api/placeholder/120/60', url: 'https://wefunder.com' },
    { name: 'NetCapital', logo: '/api/placeholder/120/60', url: 'https://netcapital.com' },
    { name: 'EquityNet', logo: '/api/placeholder/120/60', url: 'https://equitynet.com' }
  ];

  const keyMetrics = [
    { label: 'Market Size', value: '$3.7T', description: 'Global Real Estate Market' },
    { label: 'Target Market', value: '$280B', description: 'US Commercial Real Estate Tokenization' },
    { label: 'Platform Users', value: '10K+', description: 'Registered Users' },
    { label: 'Properties Listed', value: '250+', description: 'Investment Opportunities' },
    { label: 'Total Volume', value: '$50M+', description: 'Platform Transaction Volume' },
    { label: 'Average ROI', value: '12-18%', description: 'Annual Property Returns' }
  ];

  const teamMembers = [
    {
      name: 'Lorenzo Holmes',
      role: 'Founder & CEO',
      description: 'Visionary leader with deep expertise in real estate and blockchain technology, driving the future of property tokenization.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Chief Technology Officer',
      role: 'CTO - Open Position',
      description: 'Seeking an experienced blockchain and fintech CTO to lead our technical vision and platform development.',
      image: '/api/placeholder/150/150',
      isOpen: true
    },
    {
      name: 'Chief Operating Officer',
      role: 'COO - Open Position',
      description: 'Looking for a strategic COO to scale operations and drive business growth in the tokenization space.',
      image: '/api/placeholder/150/150',
      isOpen: true
    }
  ];


  const competitiveAdvantages = [
    {
      icon: ShieldCheckIcon,
      title: 'Regulatory Compliance',
      description: 'SEC-compliant tokenization with built-in KYC/AML and investor accreditation verification.'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Real Estate Expertise',
      description: 'Deep industry knowledge with proprietary property analytics and due diligence processes.'
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Advanced Technology',
      description: 'Cutting-edge blockchain infrastructure with AI-powered property valuation and market insights.'
    },
    {
      icon: UserGroupIcon,
      title: 'Ecosystem Approach',
      description: 'Comprehensive platform combining investment, trading, staking, and property management tools.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Invest Early in FractionaX
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-4xl mx-auto">
              Become part of our cap table as we revolutionize real estate investing with AI and blockchain.
            </p>
            <p className="text-lg text-blue-200 mb-8">
              🔓 <strong>Open</strong> – Accepting Accredited Investors Now
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => document.getElementById('investor-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Express Investment Interest
              </button>
              <button className="flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all">
                <PlayIcon className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Fundraising Progress */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 border-y border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Seed Round Progress
            </h2>
            <p className="text-lg text-gray-600">
              Live updates from all fundraising platforms • Last updated: {fundraisingData.lastUpdated}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  {progressPercentage.toFixed(1)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${(fundraisingData.currentAmount / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${(fundraisingData.targetAmount / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {fundraisingData.investorCount}
                </div>
                <div className="text-sm text-gray-600">Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {fundraisingData.daysLeft}
                </div>
                <div className="text-sm text-gray-600">Days Left</div>
              </div>
            </div>
          </div>

          {/* Next Milestone */}
          {getNextMilestone() && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">Next Milestone</h3>
                  <p className="text-purple-700">{getNextMilestone().title} - {formatCurrency(getNextMilestone().amount)}</p>
                  <p className="text-purple-600 text-sm">{getNextMilestone().description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(getNextMilestone().amount - fundraisingData.currentAmount)}
                  </div>
                  <div className="text-sm text-purple-600">remaining</div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Platform Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <GlobeAltIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Multi-Platform Fundraising</h3>
                <p className="text-blue-700 text-sm">
                  This progress reflects combined investments across all authorized crowdfunding platforms. 
                  All platforms offer the same terms and conditions for consistency and transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFE Investment Terms */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Investment Terms (SAFE)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Y Combinator Post-Money SAFE - Consistent terms for accredited investors under Regulation D
            </p>
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-4xl mx-auto">
              <p className="text-sm text-yellow-800">
                <strong>New to SAFE agreements?</strong> A SAFE (Simple Agreement for Future Equity) lets you invest now and get shares later when the company raises a bigger round. 
                <a href="https://www.ycombinator.com/documents" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">Learn more about SAFEs →</a>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* SAFE Terms */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">SAFE Agreement Details</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Instrument Type</span>
                  <span className="font-bold text-gray-900">{fundraisingData.safeTerms.type}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <div>
                    <span className="font-medium text-gray-700">Valuation Cap</span>
                    <p className="text-xs text-gray-500 mt-1">Maximum company value for your conversion</p>
                  </div>
                  <span className="font-bold text-blue-600">{formatCurrency(fundraisingData.safeTerms.valuationCap)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <div>
                    <span className="font-medium text-gray-700">Discount Rate</span>
                    <p className="text-xs text-gray-500 mt-1">Additional discount off Series A price</p>
                  </div>
                  <span className="font-bold text-green-600">{fundraisingData.safeTerms.discountRate}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Minimum Investment</span>
                  <span className="font-bold text-gray-900">${fundraisingData.minimumInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Maximum (Non-Accredited)</span>
                  <span className="font-bold text-gray-900">${fundraisingData.maximumInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Pro-Rata Rights</span>
                  <span className="font-bold text-green-600">Included</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Regulation</span>
                  <span className="font-bold text-gray-900">{fundraisingData.safeTerms.regulation}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-700">Token Allocation</span>
                  <span className="font-bold text-purple-600">Optional FXCT via Side Letter</span>
                </div>
              </div>
              
              {/* SAFE Example */}
              <div className="mt-6 bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">💡 How Your SAFE Works (Example)</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <p className="text-blue-800"><strong>Step 1:</strong> You invest $50,000 today</p>
                    <p className="text-blue-600 text-xs">Your money goes to help grow the company</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-500">
                    <p className="text-green-800"><strong>Step 2:</strong> Company raises Series A at $50M valuation</p>
                    <p className="text-green-600 text-xs">New investors pay $50M valuation price</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                    <p className="text-purple-800"><strong>Your Advantage:</strong> You convert at $25M cap + 20% discount = $20M</p>
                    <p className="text-purple-600 text-xs">You get 2.5x more shares than Series A investors for the same dollar amount</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-800 text-sm"><strong>Bottom Line:</strong> Early risk = Better rewards when the company succeeds</p>
                </div>
              </div>
            </div>

            {/* Investment Benefits */}
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-3">✓ What You Get</h4>
                <ul className="space-y-2 text-green-700">
                  <li>• Preferred equity at next qualified financing</li>
                  <li>• 20% discount on conversion price</li>
                  <li>• $25M valuation cap protection</li>
                  <li>• Pro-rata participation rights</li>
                  <li>• Information and inspection rights</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">🛡️ Investor Protections</h4>
                <ul className="space-y-2 text-blue-700">
                  <li>• SEC Regulation D compliance</li>
                  <li>• Accredited investor verification</li>
                  <li>• Regular financial reporting</li>
                  <li>• Anti-dilution protection</li>
                  <li>• Most favored nation clause</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">📈 Conversion Triggers</h4>
                <ul className="space-y-2 text-purple-700">
                  <li>• Series A raise ($1M+ qualified financing)</li>
                  <li>• Change of control/acquisition</li>
                  <li>• IPO or public offering</li>
                  <li>• Liquidity event</li>
                  <li>• Automatic conversion after 18 months</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Educational Resources */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Want to Learn More About SAFEs?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="https://www.ycombinator.com/documents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                📄 Y Combinator SAFE Guide
              </a>
              <a 
                href="https://techcrunch.com/2015/01/08/what-is-a-safe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                📖 "What is a SAFE?" - TechCrunch
              </a>
              <a 
                href="https://carta.com/blog/safe-vs-convertible-note/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                ⚖️ SAFE vs Convertible Notes
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Still have questions? <a href="mailto:investors@fractionax.com" className="text-blue-600 hover:underline">Email our investor relations team</a> for a detailed explanation.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Platforms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Investment Partners
            </h2>
            <p className="text-xl text-gray-600">
              Invest in FractionaX through these leading crowdfunding platforms
            </p>
          </div>
          
          {/* FractionaX Direct - Coming Soon */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-lg text-white text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-3">🚀 Invest Directly with FractionaX</h3>
              <p className="text-blue-100 mb-4">Skip the platform fees - invest directly through our SAFE agreement</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-white font-semibold mb-2">🕒 Coming Soon</p>
                <p className="text-blue-100 text-sm">Direct investment portal launching Q4 2025</p>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => document.getElementById('investor-form').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Get Notified When Available
                </button>
              </div>
            </div>
          </div>
          
          {/* Partner Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <a 
                key={index} 
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                <div className="text-center">
                  <div className="h-12 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-gray-800">{platform.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Click to visit {platform.name}</p>
                  <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    External Platform
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {/* Platform Info */}
          <div className="mt-12 bg-gray-100 rounded-xl p-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">📄 Same Terms, Multiple Options</h4>
              <p className="text-gray-600 text-sm">
                All platforms offer identical SAFE terms and conditions. Choose the platform you're most comfortable with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Market Opportunity & Traction
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FractionaX is positioned at the intersection of two massive markets: 
              real estate and blockchain technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{metric.label}</div>
                  <div className="text-gray-600">{metric.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model & Revenue */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Proven Revenue Model
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Multiple revenue streams create a sustainable and scalable business model 
                with strong unit economics and path to profitability.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Management Fee (3%)
                    </h3>
                    <p className="text-gray-600">
                      Monthly management fee on all assets under management on our platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Transaction Fee (3%)
                    </h3>
                    <p className="text-gray-600">
                      3% of sale price charged on every successful fractionalized deal closing (businesses, apartment complexes, land deals, etc.).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Exit Sale Fee (3%)
                    </h3>
                    <p className="text-gray-600">
                      Fee charged when fractionalized properties are sold back to the market as part of the exit strategy (typically 5-10 years).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Token Ecosystem
                    </h3>
                    <p className="text-gray-600">
                      FXCT utility token drives engagement with staking rewards, governance, and fee discounts. We charge 1% of the transaction value up to $5.00 USD per transaction on the ecosystem (buy and sell transactions outside the platform).
                    </p>
                    <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700">
                        <strong>Example:</strong> $100 transaction = $1.00 fee | $500 transaction = $5.00 fee | $1000 transaction = $5.00 fee (capped)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Revenue Projections</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium text-gray-600">Year 1</span>
                  <span className="text-xl font-bold text-gray-900">$2.5M</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium text-gray-600">Year 2</span>
                  <span className="text-xl font-bold text-gray-900">$8.2M</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium text-gray-600">Year 3</span>
                  <span className="text-xl font-bold text-gray-900">$24.5M</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-600">Year 4</span>
                  <span className="text-xl font-bold text-blue-600">$52.8M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use of Funds */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              📈 Use of Funds
            </h2>
            <p className="text-xl text-gray-600">
              Strategic allocation of $500K seed round to build the foundation for growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Development</h3>
              <p className="text-sm text-gray-600 mb-3">AI search, token integration</p>
              <div className="text-2xl font-bold text-blue-600">35%</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">🏦</div>
              <h3 className="font-semibold text-gray-900 mb-2">Compliance & Legal</h3>
              <p className="text-sm text-gray-600 mb-3">KYC/AML, regulations</p>
              <div className="text-2xl font-bold text-green-600">25%</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Hires</h3>
              <p className="text-sm text-gray-600 mb-3">CTO, COO, operations</p>
              <div className="text-2xl font-bold text-purple-600">20%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="font-semibold text-gray-900 mb-2">Marketing</h3>
              <p className="text-sm text-gray-600 mb-3">User acquisition</p>
              <div className="text-2xl font-bold text-orange-600">15%</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-sm text-gray-600 mb-3">Audits, infrastructure</p>
              <div className="text-2xl font-bold text-red-600">5%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Competitive Advantages
            </h2>
            <p className="text-xl text-gray-600">
              What sets FractionaX apart in the real estate tokenization market
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <advantage.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{advantage.title}</h3>
                    <p className="text-gray-600">{advantage.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600">
              Experienced founders with proven track records in real estate and technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className={`p-8 rounded-xl text-center ${
                member.isOpen ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}>
                <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  member.isOpen ? 'bg-blue-100 border-2 border-dashed border-blue-300' : 'bg-gray-300'
                }`}>
                  {member.isOpen && (
                    <span className="text-blue-600 text-4xl font-light">+</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className={`font-medium mb-4 ${
                  member.isOpen ? 'text-blue-600' : 'text-blue-600'
                }`}>{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
                {member.isOpen && (
                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      We're Hiring
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            📩 Next Steps
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Ready to join the future of real estate investing? Here’s how to get started:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-4">Request Full Investor Deck</h3>
              <p className="text-blue-100 mb-6">Get detailed financials, market analysis, and growth projections</p>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Email Us
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-4">Submit Interest</h3>
              <p className="text-blue-100 mb-6">Complete our investor form to express your interest and get priority access</p>
              <button 
                onClick={() => document.getElementById('investor-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all"
              >
                Apply to Invest
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-4">Book a Call</h3>
              <p className="text-blue-100 mb-6">Schedule a 30-minute call with Lorenzo to discuss the opportunity</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Schedule Here
              </button>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-yellow-900/30 rounded-lg border border-yellow-500/50">
            <p className="text-yellow-100">
              <strong>Important:</strong> All investors will be required to complete KYC verification and sign the SAFE agreement. 
              This offer is for <strong>accredited investors</strong> under Regulation D.
            </p>
          </div>
        </div>
      </section>

      {/* Investor Form */}
      <section id="investor-form" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Express Your Investment Interest
            </h2>
            <p className="text-xl text-gray-600">
              Connect with our team to learn more about investment opportunities
            </p>
          </div>
          
          {submitStatus === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-600">
                We've received your interest and will be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Fund
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Platform
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Platform</option>
                    <option value="republic">Republic</option>
                    <option value="seedinvest">SeedInvest</option>
                    <option value="startengine">StartEngine</option>
                    <option value="wefunder">Wefunder</option>
                    <option value="netcapital">NetCapital</option>
                    <option value="equitynet">EquityNet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="investmentRange" className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Range
                  </label>
                  <select
                    id="investmentRange"
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Range</option>
                    <option value="under-100k">Under $100K</option>
                    <option value="100k-500k">$100K - $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m-5m">$1M - $5M</option>
                    <option value="over-5m">Over $5M</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your investment interests and any questions you have..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Interest
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-300">
              Ready to discuss investment opportunities? Contact our investor relations team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">investors@fractionax.com</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">832-205-8179</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Website</h3>
              <p className="text-gray-300">fractionax.io</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestorRelations;