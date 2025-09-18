import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Search, 
  BarChart3, 
  Coins, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Target,
  Wallet,
  Gift,
  PieChart,
  Lock,
  Globe,
  Star
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';
import { usePageContent } from '../../../hooks/useFrontendPagesData';

// Custom styles for scrollbar hiding
const scrollbarStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Visual components for each section
const AIDiscoveryVisual = () => (
  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 rounded-xl">
    <div className="flex items-center justify-center mb-3 sm:mb-4">
      <div className="relative">
        <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-2 text-xs sm:text-sm">
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
        <Search className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
        <span className="truncate">Scanning MLS databases...</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
        <span className="truncate">Found 47 matching properties</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
        <span className="truncate">AI analysis complete</span>
      </div>
    </div>
  </div>
);

const BiddingVisual = () => (
  <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 rounded-xl">
    <div className="text-center mb-3 sm:mb-4">
      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
        <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">FXCT Bidding</span>
        <span className="xs:hidden">FXCT</span>
      </div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      <div className="bg-white p-2 sm:p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-xs sm:text-sm truncate">Miami Condo #001</span>
          <span className="text-green-600 text-xs sm:text-sm">$250K</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">65% funded • 450 FXCT bids</div>
      </div>
      <div className="flex justify-center">
        <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
          <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
          Place Bid
        </button>
      </div>
    </div>
  </div>
);

const SecurityTokenVisual = () => (
  <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-4 sm:p-6 rounded-xl">
    <div className="text-center mb-3 sm:mb-4">
      <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2" />
      <div className="text-xs sm:text-sm font-semibold text-green-600">FXST Security Token</div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      <div className="bg-white p-2 sm:p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm">FXST-001</span>
          <span className="text-green-600 text-xs sm:text-sm">0.01% ownership</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-600">Monthly dividends: $47.50</div>
      </div>
      <div className="bg-white p-2 sm:p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Portfolio Value</span>
          <span className="font-semibold text-sm sm:text-base">$12,450</span>
        </div>
      </div>
    </div>
  </div>
);

const MasterTokenVisual = () => (
  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl">
    <div className="text-center mb-3 sm:mb-4">
      <div className="relative">
        <PieChart className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600 mx-auto" />
        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 absolute -top-1 -right-1" />
      </div>
      <div className="text-xs sm:text-sm font-semibold text-yellow-600 mt-2">Master FXST Dual System</div>
    </div>
    <div className="space-y-1 sm:space-y-2">
      <div className="bg-white p-2 rounded-lg">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="truncate">Direct Distribution</span>
          <span className="text-green-600 ml-2">1%</span>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="truncate">Audited Wallet Fund</span>
          <span className="text-blue-600 ml-2">1%</span>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="truncate">Blue-Chip Growth</span>
          <span className="text-purple-600 ml-2">+15.2%</span>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="truncate">Lending Yield</span>
          <span className="text-orange-600 ml-2">+6.8%</span>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg border-2 border-yellow-200">
        <div className="flex justify-between text-xs sm:text-sm font-semibold">
          <span className="truncate">Total Monthly Value</span>
          <span className="text-yellow-600 ml-2">$127.80</span>
        </div>
      </div>
    </div>
  </div>
);

const UtilityTokenVisual = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl">
    <div className="text-center mb-3 sm:mb-4">
      <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mx-auto mb-2" />
      <div className="text-xs sm:text-sm font-semibold text-indigo-600">FXCT Utility</div>
    </div>
    <div className="space-y-2">
      <div className="bg-white p-2 rounded-lg flex items-center gap-2">
        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 flex-shrink-0" />
        <span className="text-xs sm:text-sm truncate">Property Bidding</span>
      </div>
      <div className="bg-white p-2 rounded-lg flex items-center gap-2">
        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
        <span className="text-xs sm:text-sm truncate">Premium Features</span>
      </div>
      <div className="bg-white p-2 rounded-lg flex items-center gap-2">
        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
        <span className="text-xs sm:text-sm truncate">DeFi Staking</span>
      </div>
      <div className="bg-white p-2 rounded-lg flex items-center gap-2">
        <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 flex-shrink-0" />
        <span className="text-xs sm:text-sm truncate">Rewards Program</span>
      </div>
    </div>
  </div>
);

const sections = [
  {
    id: 'ai-discovery',
    title: 'Discover and Curate with AI',
    shortTitle: 'AI Discovery',
    description: 'Our AI engine scans thousands of listings from trusted sources to suggest properties matching your investment criteria.',
    detailedContent: `Our AI-powered discovery system saves you countless hours of manual research by automatically scanning real estate databases, trusted APIs like eBay, and ethical external sources. The system respects all site terms while providing comprehensive insights for both common and rare investment opportunities.

    Key features include:
    • Intelligent property matching based on your criteria
    • Multi-source data integration for comprehensive coverage
    • Automated market analysis and trend identification
    • Real-time alerts for new opportunities
    • Professional AI-Research Tool for instant address-based insights
    • Comprehensive property analysis for confident decision-making`,
    icon: <Bot className="w-6 h-6" />,
    visual: <AIDiscoveryVisual />,
    color: 'purple',
    stats: [
      { label: 'Data Sources Scanned', value: '50+' },
      { label: 'Properties Analyzed Daily', value: '10K+' },
      { label: 'Time Saved Per Search', value: '3+ Hours' }
    ]
  },
  {
    id: 'community-bidding',
    title: 'Bid to Build Demand',
    shortTitle: 'Community Bidding',
    description: 'Signal interest with FXCT tokens to help identify high-demand assets and earn rewards for participation.',
    detailedContent: `Our community-driven bidding mechanism democratizes the investment discovery process. Anyone can bid with FXCT utility tokens to signal interest in properties, creating a transparent demand validation system.

    How it works:
    • Bid with FXCT tokens on promising properties
    • When bids reach 50% of property value, we negotiate with sellers
    • Non-accredited investors earn 5-10% bonus FXCT refunds
    • Share bids on social media for additional staking rewards
    • All participants help validate market demand`,
    icon: <Users className="w-6 h-6" />,
    visual: <BiddingVisual />,
    color: 'blue',
    stats: [
      { label: 'Active Bidding Properties', value: '150+' },
      { label: 'Community Members', value: '25K+' },
      { label: 'Average Reward Rate', value: '7.5%' }
    ]
  },
  {
    id: 'security-tokens',
    title: 'Invest with FXST Security Tokens',
    shortTitle: 'Security Tokens',
    description: 'Accredited investors can purchase FXST tokens representing fractional ownership in real assets.',
    detailedContent: `For qualified accredited investors, successful deals unlock FXST security tokens that represent legal fractional ownership. Each deal receives a unique identifier, and tokens are minted proportionally to the asset's value.

    Benefits include:
    • Legal fractional ownership of premium assets
    • Monthly dividends from rental income
    • Participation in asset appreciation
    • SEC-compliant security token structure
    • Secondary marketplace liquidity
    • Low entry points starting at just $100`,
    icon: <Shield className="w-6 h-6" />,
    visual: <SecurityTokenVisual />,
    color: 'green',
    stats: [
      { label: 'Minimum Investment', value: '$100' },
      { label: 'Average Monthly Yield', value: '8.2%' },
      { label: 'Active Properties', value: '45+' }
    ]
  },
  {
    id: 'master-rewards',
    title: 'Unlock Platform-Wide Rewards',
    shortTitle: 'Master Rewards',
    description: 'Master FXST tokens provide exposure to the entire platform ecosystem and blue-chip crypto growth.',
    detailedContent: `Every FXST holder automatically receives a master FXST token, creating platform-wide diversification and rewards. This innovative structure provides multiple income streams and risk mitigation through a dual-wallet system.

    Master FXST benefits:
    • 1% of monthly net income distributed directly to holders
    • Additional 1% allocated to audited blue-chip crypto wallet
    • Automatic distribution via smart contracts
    • Audited wallet invested in blue-chip tokens (BTC, ETH, XRP, etc.)
    • Crypto growth exposure plus lending yield generation
    • All proceeds reinvested to increase wallet value
    • Compounded returns over time benefiting all Master FXST holders
    • Complete transparency with audited wallet management
    • Passive income diversification across multiple asset classes`,
    icon: <PieChart className="w-6 h-6" />,
    visual: <MasterTokenVisual />,
    color: 'yellow',
    stats: [
      { label: 'Platform Revenue Share', value: '1%' },
      { label: 'Master Wallet Value', value: '$2.1M+' },
      { label: 'Average Monthly Growth', value: '12.5%' }
    ]
  },
  {
    id: 'utility-ecosystem',
    title: 'Power the Ecosystem with FXCT',
    shortTitle: 'Utility Tokens',
    description: 'FXCT utility tokens fuel platform activities, premium features, and DeFi opportunities.',
    detailedContent: `FXCT is our versatile utility token designed to power all platform activities without being classified as a security. Multiple acquisition and usage methods create a robust token economy.

    FXCT use cases:
    • Property bidding and demand signaling
    • Premium feature access and enhanced AI searches
    • Flexible staking options with marketplace or DeFi yields
    • User-controlled staking dashboard
    • Integration with protocols like Aave and Compound
    • Transaction fee discounts up to 70%
    • Rewards program participation`,
    icon: <Zap className="w-6 h-6" />,
    visual: <UtilityTokenVisual />,
    color: 'indigo',
    stats: [
      { label: 'Fee Savings', value: 'Up to 70%' },
      { label: 'DeFi APY Range', value: '5-10%' },
      { label: 'Premium Features', value: '15+' }
    ]
  }
];

const faqs = [
  {
    question: "How does the AI property discovery actually work?",
    answer: "Our AI scans multiple real estate databases, MLS systems, and trusted APIs to find properties matching your investment criteria. It analyzes market trends, rental yields, and appreciation potential to surface only high-quality opportunities, saving you hours of manual research."
  },
  {
    question: "What happens when I bid with FXCT tokens?",
    answer: "When you bid with FXCT tokens, you're signaling interest in a property and helping validate market demand. If bids reach 50% of the property value, our team negotiates with sellers. Non-accredited investors earn 5-10% bonus FXCT refunds, while accredited investors can purchase FXST security tokens."
  },
  {
    question: "How do Master FXST rewards work?",
    answer: "Every FXST holder automatically receives a Master FXST token. This gives you 1% of monthly net income from ALL platform assets directly, plus exposure to our audited blue-chip crypto wallet (BTC, ETH, XRP) that generates additional lending yields—all reinvested for compounded growth."
  },
  {
    question: "Can non-accredited investors participate?",
    answer: "Yes! Non-accredited investors can bid with FXCT tokens, earn rewards, access premium features, and participate in DeFi staking. However, FXST security tokens (actual ownership) are limited to accredited investors due to SEC regulations."
  },
  {
    question: "What's the difference between FXCT and FXST tokens?",
    answer: "FXCT is a utility token for bidding, premium features, and DeFi staking—available to everyone. FXST is a security token representing actual fractional ownership of real assets, providing dividends and appreciation—only for accredited investors."
  },
  {
    question: "How transparent is the audited wallet system?",
    answer: "Completely transparent. The audited wallet that receives 1% of platform income is publicly viewable, managed by licensed custodians, and regularly audited. All transactions, holdings, and lending activities are documented and accessible to Master FXST holders."
  },
  {
    question: "What makes the AI-Research Tool different from basic property search?",
    answer: "Our AI-Research Tool is a professional-grade feature that allows users to search by specific property addresses and instantly receive comprehensive, detailed insights. Unlike basic discovery tools, this tool provides in-depth market analysis, comparable property data, investment potential scoring, and risk assessment—all delivered in real-time for confident decision-making. It's designed for serious investors who need immediate, actionable intelligence on specific properties."
  }
];

export default function HowItWorksPage() {
  const [activeSection, setActiveSection] = useState('ai-discovery');
  const [isMainVisible, setIsMainVisible] = useState(false);
  const [isBenefitsVisible, setIsBenefitsVisible] = useState(false);
  const [isCtaVisible, setIsCtaVisible] = useState(false);
  const mainSectionRef = useRef(null);
  const benefitsSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);
  
  // Fetch how-it-works data from API
  const { data: howItWorksData, loading: dataLoading, error: dataError } = usePageContent('how-it-works');
  
  // Use API data if available, fall back to hardcoded data
  const pageTitle = howItWorksData?.title || "How Our Fractional Marketplace Works";
  const pageDescription = howItWorksData?.description || "Welcome to our innovative fractional marketplace, where everyday investors can own shares in high-value assets like real estate. We prioritize quality over volume, curating only vetted listings with strong potential for yields through asset appreciation or monthly dividends.";
  const apiSections = howItWorksData?.sections || [];
  const apiFaqs = howItWorksData?.faq || [];
  const ctaTitle = howItWorksData?.ctaTitle || "Ready to Start Your Investment Journey?";
  const ctaDescription = howItWorksData?.ctaDescription || "Join thousands of investors who have discovered the future of fractional investing with AI-powered insights.";
  
  // Use API sections if available, otherwise use hardcoded ones
  const displaySections = apiSections.length > 0 ? apiSections : sections;
  // Use API FAQs if available, otherwise use hardcoded ones
  const displayFaqs = apiFaqs.length > 0 ? apiFaqs : faqs;

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const mainObserver = new IntersectionObserver(
      ([entry]) => {
        setIsMainVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const benefitsObserver = new IntersectionObserver(
      ([entry]) => {
        setIsBenefitsVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        setIsCtaVisible(entry.isIntersecting);
      },
      observerOptions
    );

    if (mainSectionRef.current) {
      mainObserver.observe(mainSectionRef.current);
    }
    if (benefitsSectionRef.current) {
      benefitsObserver.observe(benefitsSectionRef.current);
    }
    if (ctaSectionRef.current) {
      ctaObserver.observe(ctaSectionRef.current);
    }

    return () => {
      if (mainSectionRef.current) {
        mainObserver.unobserve(mainSectionRef.current);
      }
      if (benefitsSectionRef.current) {
        benefitsObserver.unobserve(benefitsSectionRef.current);
      }
      if (ctaSectionRef.current) {
        ctaObserver.unobserve(ctaSectionRef.current);
      }
    };
  }, []);

  const currentSection = displaySections.find(s => s.id === activeSection);
  
  // SEO configuration
  const seoData = generatePageSEO({
    title: 'How Our Fractional Marketplace Works | FractionaX Platform Guide',
    description: 'Discover how FractionaX revolutionizes investing with AI-powered property discovery, community bidding, security tokens, and utility rewards. Learn our complete ecosystem.',
    keywords: [
      'how fractionax works',
      'fractional investing platform',
      'AI property discovery',
      'FXCT utility tokens',
      'FXST security tokens',
      'community bidding',
      'master rewards',
      'defi staking',
      'tokenized real estate'
    ],
    url: '/how-it-works',
  });

  const structuredData = [
    generateStructuredData.breadcrumb([
      { name: "Home", url: "/" },
      { name: "How It Works", url: "/how-it-works" }
    ]),
    generateStructuredData.webPage({
      title: seoData.title,
      description: seoData.description,
      url: '/how-it-works',
      type: 'WebPage',
    }),
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{scrollbarStyles}</style>
      <SEO {...seoData} structuredData={structuredData}>
        <meta name="robots" content="index, follow" />
      </SEO>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {pageTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-gray-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              {pageDescription}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="font-semibold text-sm sm:text-base">Powered by AI and Blockchain</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={mainSectionRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Navigation */}
          <div className="mb-12 lg:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Complete Platform Overview
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Explore each component of our comprehensive ecosystem designed to democratize access to premium investments.
              </p>
            </div>

            {/* Mobile: Sticky horizontal tabs, Desktop: Grid */}
            <div className="mb-12">
              {/* Mobile navigation - Sticky horizontal tabs */}
              <div className="md:hidden">
                <div className="sticky top-0 z-10 bg-gray-50 pt-4 pb-4 -mx-4 px-4 shadow-sm">
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 min-w-max px-1">
                      {displaySections.map((section, index) => {
                        const isActive = activeSection === section.id;
                        const colorClasses = {
                          purple: 'bg-purple-600 text-white border-purple-600',
                          blue: 'bg-blue-600 text-white border-blue-600',
                          green: 'bg-green-600 text-white border-green-600', 
                          yellow: 'bg-yellow-600 text-white border-yellow-600',
                          indigo: 'bg-indigo-600 text-white border-indigo-600'
                        };
                        
                        return (
                          <motion.button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex-shrink-0 p-3 rounded-xl text-center transition-all duration-300 min-w-[120px] border-2 ${
                              isActive 
                                ? colorClasses[section.color]
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`mb-2 flex justify-center ${isActive ? 'text-white' : `text-${section.color}-600`}`}>
                              {section.icon}
                            </div>
                            <div className={`font-semibold text-xs mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                              Step {index + 1}
                            </div>
                            <div className={`text-xs leading-tight ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                              {section.shortTitle}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop navigation */}
              <div className="hidden md:grid md:grid-cols-5 gap-4">
                {displaySections.map((section, index) => {
                  const isActive = activeSection === section.id;
                  const colorClasses = {
                    purple: 'bg-purple-600 text-white',
                    blue: 'bg-blue-600 text-white',
                    green: 'bg-green-600 text-white', 
                    yellow: 'bg-yellow-600 text-white',
                    indigo: 'bg-indigo-600 text-white'
                  };
                  
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        isActive 
                          ? colorClasses[section.color]
                          : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`mb-2 ${isActive ? 'text-white' : `text-${section.color}-600`}`}>
                        {section.icon}
                      </div>
                      <div className={`font-semibold text-sm mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        Step {index + 1}
                      </div>
                      <div className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                        {section.shortTitle}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-20">
                {/* Content */}
                <div className="order-2 lg:order-1">
                  <div className={`inline-flex items-center gap-2 bg-${currentSection.color}-100 text-${currentSection.color}-700 px-4 py-2 rounded-full text-sm font-semibold mb-6`}>
                    {currentSection.icon}
                    {currentSection.shortTitle}
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    {currentSection.title}
                  </h3>
                  
                  <p className="text-base sm:text-lg text-gray-600 mb-6">
                    {currentSection.description}
                  </p>
                  
                  <div className="prose prose-sm sm:prose-lg max-w-none text-gray-600 mb-8">
                    {currentSection.detailedContent.split('\n\n').map((paragraph, idx) => (
                      <div key={idx} className="mb-4">
                        {paragraph.includes('•') ? (
                          <ul className="list-none space-y-2">
                            {paragraph.split('• ').slice(1).map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-sm sm:text-base">
                                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 text-${currentSection.color}-600 mt-0.5 flex-shrink-0`} />
                                <span>{item.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm sm:text-base">{paragraph}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats - Mobile responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                    {currentSection.stats.map((stat, idx) => (
                      <div key={idx} className="text-center p-3 sm:p-4 bg-white rounded-xl border border-gray-200">
                        <div className={`text-xl sm:text-2xl font-bold text-${currentSection.color}-600 mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Component */}
                <div className="order-1 lg:order-2 lg:sticky lg:top-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                  >
                    <div className={`bg-${currentSection.color}-600 text-white p-4 sm:p-6 text-center`}>
                      <h4 className="font-semibold text-base sm:text-lg mb-2">Interactive Demo</h4>
                      <p className="text-white/90 text-xs sm:text-sm">{currentSection.shortTitle} in Action</p>
                    </div>
                    <div className="p-4 sm:p-6">
                      {currentSection.visual}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={benefitsSectionRef} className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works - FAQ
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Common questions about our platform mechanics, tokens, and investment process.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {displayFaqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isBenefitsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                    Q
                  </div>
                  <span className="leading-relaxed">{faq.question}</span>
                </h3>
                <div className="ml-9 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Link to full FAQ */}
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-gray-600 mb-4">Need more detailed information?</p>
            <motion.a
              href="/faq"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              View Complete FAQ
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section ref={ctaSectionRef} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              {ctaTitle}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
              {ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center min-h-[48px] sm:min-h-[56px]"
              >
                Explore Marketplace
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 transition-colors min-h-[48px] sm:min-h-[56px]"
              >
                Learn About Tokens
              </motion.button>
            </div>
            <div className="text-xs sm:text-sm text-white/80 mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed">
              <strong>Disclaimer:</strong> Bidding and FXCT use are for participation only. FXST limited to accredited investors. Consult financial advisor before participating.
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
