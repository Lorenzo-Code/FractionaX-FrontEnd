import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, HelpCircle, Minus, Plus, Calculator, TrendingUp, Users, Shield, Star, Zap, DollarSign, Search, BarChart3, Award, Coins, Bot, PieChart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

// Fractional Marketplace Membership Tiers
const tiers = [
    {
        name: "Explorer",
        monthlyPrice: 49,
        annualPrice: 39, // 20% discount
        period: "/ month",
        badge: "Getting Started",
        featured: false,
        fxct: "500 FXCT tokens monthly for bidding and platform participation",
        features: [
            "Community bidding with FXCT tokens",
            "5-10% bonus FXCT refunds on bids",
            "Basic AI property discovery",
            "Social sharing rewards",
            "Community access & events",
            "FXCT staking for yield (5-7% APY)",
        ],
        investmentAccess: "Non-accredited investor features only",
        idealFor: "New investors exploring fractional ownership and community bidding.",
        cta: "Start Exploring",
        ctaLink: "/signup?plan=explorer",
        color: "#0F182B",
        pillClass: "bg-blue-600 text-white",
    },
    {
        name: "Investor",
        monthlyPrice: 149,
        annualPrice: 119, // 20% discount
        period: "/ month",
        badge: "Most Popular",
        featured: true,
        fxct: "1,500 FXCT tokens monthly + premium features",
        features: [
            "Everything in Explorer",
            "AI-Research Tool for address-specific insights",
            "Advanced property analytics & comparables",
            "Enhanced bidding rewards (7-10%)",
            "DeFi staking options (6-10% APY)",
            "Priority access to new property deals",
            "FXST security token eligibility (if accredited)",
        ],
        investmentAccess: "FXST security tokens available for accredited investors",
        idealFor: "Active investors ready to own fractional real estate shares.",
        cta: "Become an Investor",
        ctaLink: "/signup?plan=investor",
        color: "#151543",
        pillClass: "bg-green-400 text-black",
    },
    {
        name: "Pro Investor",
        monthlyPrice: 399,
        annualPrice: 319, // 20% discount
        period: "/ month",
        badge: "Professional",
        featured: false,
        fxct: "3,500 FXCT tokens monthly + pro analytics",
        features: [
            "Everything in Investor",
            "Professional AI-Research Tool with deep analytics",
            "Priority FXST token allocation",
            "Master FXST automatic enrollment",
            "Advanced portfolio tracking & reporting",
            "Direct deal flow from acquisition team",
            "White-glove onboarding & support",
        ],
        investmentAccess: "Premium FXST opportunities + Master FXST rewards",
        idealFor: "Serious investors building substantial fractional portfolios.",
        cta: "Go Pro",
        ctaLink: "/signup?plan=pro",
        color: "#0F182B",
        pillClass: "bg-purple-600 text-white",
    },
    {
        name: "Institutional",
        monthlyPrice: "Custom",
        annualPrice: "Custom",
        period: "",
        badge: "Enterprise",
        featured: false,
        fxct: "Custom FXCT allocations & bulk pricing",
        features: [
            "Team access & role-based permissions",
            "API access for integrations",
            "Custom deal minimums & allocations",
            "Dedicated relationship manager",
            "Compliance & audit support",
            "Priority deal access & co-investment",
            "Custom reporting & analytics",
        ],
        investmentAccess: "Institutional-grade FXST allocations & custom structures",
        idealFor: "Investment firms, family offices, and institutional investors.",
        cta: "Contact Sales",
        ctaLink: "/contact-sales",
        color: "#0B1020",
        pillClass: "bg-black text-white",
    },
];

const fxctExamples = [
    { label: "Property Bidding (Community Participation)", approxFxct: "≈ 50–200 FXCT / bid" },
    { label: "AI-Research Tool (Address-Specific Analysis)", approxFxct: "≈ 100–300 FXCT / report" },
    { label: "Premium Analytics & Comparables", approxFxct: "≈ 150–500 FXCT / analysis" },
];

const faqs = [
    {
        question: "What exactly are FXCT tokens and how do they work?",
        answer: "FXCT tokens are FractionaX's utility cryptocurrency that powers our fractional marketplace. Use them for community bidding on properties, accessing premium AI-Research Tools, and staking for yield (5-10% APY). Unlike traditional subscriptions, FXCT tokens are yours to own, trade, stake, or spend across our ecosystem."
    },
    {
        question: "How does community bidding work?",
        answer: "Use your FXCT tokens to bid on properties and signal market demand. When community bids reach 50% of a property's value, our team negotiates with sellers. Non-accredited investors earn 5-10% bonus FXCT refunds, while accredited investors can purchase FXST security tokens representing actual ownership shares."
    },
    {
        question: "What are FXST security tokens?",
        answer: "FXST security tokens represent legal fractional ownership in real estate assets. Available only to accredited investors, they provide monthly dividends from rental income, asset appreciation, and liquidity through secondary markets. Each FXST holder also receives Master FXST tokens for platform-wide rewards."
    },
    {
        question: "Can non-accredited investors participate?",
        answer: "Absolutely! Non-accredited investors can bid with FXCT tokens, earn bidding rewards, access AI tools, stake for yield, and participate in our community. While FXST security tokens require accreditation, there are many ways to benefit from our fractional marketplace ecosystem."
    },
    {
        question: "What makes the AI-Research Tool different?",
        answer: "Our AI-Research Tool is a professional-grade feature that provides instant, comprehensive analysis for specific property addresses. Unlike basic discovery tools, it delivers in-depth market analysis, comparable sales, investment scoring, and risk assessment for confident decision-making."
    },
    {
        question: "How do staking rewards work?",
        answer: "Unused FXCT tokens can be staked through our platform or integrated DeFi protocols for 5-10% APY. You maintain full control through your staking dashboard, choosing between marketplace staking or external DeFi options like Aave and Compound."
    },
    {
        question: "Is there a free trial available?",
        answer: "Yes! New users get free FXCT tokens to experience community bidding and basic AI discovery. No credit card required. This lets you explore our fractional marketplace and see how community-driven property investment works."
    },
    {
        question: "What happens if I want to cancel?",
        answer: "You can cancel anytime with a 30-day money-back guarantee. Your FXCT tokens remain yours to keep, stake, or trade even after cancellation. Any earned rewards or tokens from community participation are permanently yours."
    }
];

// Platform readiness stats (honest pre-launch metrics)
const platformStats = [
    { icon: Search, number: "Ready", label: "AI-Research Tool" },
    { icon: Coins, number: "Ready", label: "FXCT Token System" },
    { icon: Shield, number: "Ready", label: "Security Framework" },
    { icon: Users, number: "Coming Soon", label: "Community Launch" }
];

// No testimonials yet - we're launching soon!
const testimonials = [];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState(null);
    const [roiSearches, setRoiSearches] = useState(50);
    const [selectedTier, setSelectedTier] = useState('Standard');
    const [annualBilling, setAnnualBilling] = useState(false);
    
    const seoData = generatePageSEO({
        title: 'Fractional Marketplace Membership Plans | FractionaX Pricing',
        description: 'Join FractionaX fractional real estate marketplace. Choose your membership tier for FXCT tokens, community bidding, FXST security tokens, and AI-Research Tools starting at $49/month.',
        url: '/pricing',
        keywords: [
            'fractional real estate pricing',
            'FXCT token membership',
            'FXST security tokens',
            'fractional property investment',
            'community bidding platform',
            'AI research tool pricing',
            'fractional marketplace membership',
            'real estate tokenization cost'
        ]
    });

    const structuredData = [
        generateStructuredData.breadcrumb([
            { name: "Home", url: "/" },
            { name: "Pricing", url: "/pricing" }
        ]),
        generateStructuredData.webPage({
            title: seoData.title,
            description: seoData.description,
            url: '/pricing',
            type: 'WebPage'
        }),
        // Add pricing schema for each tier
        ...tiers.slice(0, 3).map(tier => ({
            "@context": "https://schema.org",
            "@type": "Offer",
            "name": `FractionaX ${tier.name} Plan`,
            "description": tier.idealFor,
            "price": typeof tier.monthlyPrice === 'number' ? tier.monthlyPrice.toString() : '0',
            "priceCurrency": "USD",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "FractionaX"
            }
        }))
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <>
            <SEO {...seoData} structuredData={structuredData} />
            
            <div className="bg-gray-50 min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                                🏠 Join the Fractional Marketplace
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Choose your membership tier and start building wealth through fractional real estate ownership. Earn FXCT tokens, participate in community bidding, and access professional AI-Research Tools.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">🎯 Community Bidding</span>
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">🔒 Own FXCT & FXST Tokens</span>
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">📈 Fractional Ownership</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Platform Readiness Stats */}
                <section className="py-12 px-4 sm:px-10 lg:px-24 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Status</h2>
                            <p className="text-gray-600">Built and ready for launch - join our early access community</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {platformStats.map((stat, index) => {
                                const isReady = stat.number === "Ready";
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className=""
                                    >
                                        <div className="flex justify-center mb-3">
                                            <div className={`p-3 rounded-full ${
                                                isReady ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                                <stat.icon className={`w-6 h-6 ${
                                                    isReady ? 'text-green-600' : 'text-blue-600'
                                                }`} />
                                            </div>
                                        </div>
                                        <div className={`text-xl font-bold mb-1 ${
                                            isReady ? 'text-green-600' : 'text-blue-600'
                                        }`}>{stat.number}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Pricing Toggle - Annual/Monthly */}
                <section className="py-8 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
                            <button
                                onClick={() => setAnnualBilling(false)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    !annualBilling 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setAnnualBilling(true)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    annualBilling 
                                        ? 'bg-white text-gray-900 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Annual
                                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                    Save 20%
                                </span>
                            </button>
                        </div>
                        {annualBilling && (
                            <p className="mt-3 text-sm text-gray-600">
                                Save over $700 per year with annual billing
                            </p>
                        )}
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-8 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
                            {tiers.map((tier, index) => (
                                <motion.div
                                    key={tier.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative rounded-2xl p-6 shadow-xl border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                                        tier.featured ? "ring-4 ring-green-400 scale-[1.05]" : "border-white/10"
                                    }`}
                                    style={{ backgroundColor: tier.color }}
                                >
                                    {tier.badge && (
                                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                                            tier.featured 
                                                ? 'bg-green-500 text-white' 
                                                : tier.badge === 'Getting Started'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : tier.badge === 'Professional'
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                        : tier.badge === 'Enterprise'
                                                            ? 'bg-gray-100 text-gray-700 border border-gray-200'
                                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {tier.badge}
                                        </div>
                                    )}

                                    <div className="text-center mb-6 space-y-2">
                                        <h3 className={`text-2xl font-bold mb-4 ${
                                            tier.name === 'Explorer' ? 'text-blue-300' :
                                            tier.name === 'Investor' ? 'text-green-300' :
                                            tier.name === 'Pro Investor' ? 'text-purple-300' :
                                            tier.name === 'Institutional' ? 'text-yellow-300' :
                                            'text-white'
                                        }`}>
                                            {tier.name}
                                        </h3>

                                        <div className="space-y-1">
                                            {typeof tier.monthlyPrice === 'number' ? (
                                                <>
                                                    <div className="text-4xl font-bold text-white">
                                                        ${annualBilling ? tier.annualPrice : tier.monthlyPrice}
                                                    </div>
                                                    {annualBilling && (
                                                        <div className="text-sm text-white/60 line-through">
                                                            ${tier.monthlyPrice}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-4xl font-bold text-white">
                                                    {tier.monthlyPrice === 'Custom' ? 'Let\'s talk' : tier.monthlyPrice}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-white/70">
                                            {tier.period && typeof tier.monthlyPrice === 'number' 
                                                ? (annualBilling ? '/ month (billed annually)' : '/ month')
                                                : tier.period
                                            }
                                        </div>

                                        <p className="text-xs text-white/80 italic mt-2 min-h-[40px]">{tier.fxct}</p>
                                    </div>

                                    <ul className="text-left space-y-3 mb-6 text-sm">
                                        {tier.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-xs text-white/70 mb-6 min-h-[40px]">{tier.idealFor}</p>

                                    <Link to={tier.ctaLink} className="block">
                                        <button
                                            className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                                                tier.featured
                                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                                                    : tier.name.includes("Custom")
                                                        ? "bg-black hover:bg-neutral-900 text-white shadow-lg"
                                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                            }`}
                                        >
                                            <span className="inline-flex items-center justify-center gap-2">
                                                {tier.cta}
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How FXCT Works */}
                <section className="py-16 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">How FXCT-Based Pricing Works</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Membership plans provide monthly FXCT tokens. Searches and premium reports are priced in FXCT and may vary over time.
                                FXCT-per-search reflects data provider costs and market conditions, keeping pricing fair and scalable.
                                You can always top up with additional FXCT if you need more usage.
                            </p>

                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Current FXCT Cost Examples*</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {fxctExamples.map((row, idx) => (
                                    <div key={idx} className="rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                                        <div className="text-sm font-semibold text-gray-900">{row.label}</div>
                                        <div className="text-lg font-bold text-blue-600 mt-1">{row.approxFxct}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                *Examples for illustration only. FXCT-per-search updates periodically and is shown in your dashboard.
                            </p>
                        </div>
                    </div>
                </section>

                {/* All Plans Include */}
                <section className="py-16 px-4 sm:px-10 lg:px-24 bg-blue-50">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Plans Include</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Use FXCT tokens for AI-powered searches, staking rewards, and ecosystem services</span>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Stake unused FXCT to earn yield and grow your holdings</span>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Transparent, blockchain-based transaction history</span>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Seamless fiat & crypto payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why FXCT Is Different */}
                <section className="py-16 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">Why FXCT Membership is Different</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                <div className="text-4xl mb-4">🏆</div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Own Your Ecosystem</h4>
                                <p className="text-gray-600">FXCT tokens are yours to hold, trade, stake, or spend. Build wealth while using the platform.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                <div className="text-4xl mb-4">📈</div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Scales With You</h4>
                                <p className="text-gray-600">Buy more FXCT anytime for deeper searches and premium reports. No plan restrictions.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                <div className="text-4xl mb-4">🚀</div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Built For Growth</h4>
                                <p className="text-gray-600">As the platform expands, your tokens unlock more features and use cases.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Early Access Community */}
                <section className="py-16 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 border border-blue-200">
                            <div className="text-6xl mb-6">🚀</div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Early Access Community</h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Be among the first to experience fractional real estate investing through our innovative marketplace. 
                                Help shape the future of property investment.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link 
                                    to="/signup?plan=investor" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Join Early Access
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                                >
                                    Learn More
                                </Link>
                            </div>
                            <div className="text-sm text-gray-500 mt-6">
                                Early access members get exclusive benefits and priority access to investment opportunities
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fractional Investment Calculator */}
                <section className="py-16 px-4 sm:px-10 lg:px-24 bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <Calculator className="w-4 h-4" />
                                Investment Calculator
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Calculate Your Fractional Investment Potential</h3>
                            <p className="text-lg text-gray-600">
                                See how fractional real estate ownership could grow your portfolio compared to traditional barriers
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Calculator Inputs */}
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Your Investment Goals</h4>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Monthly investment budget
                                            </label>
                                            <input
                                                type="range"
                                                min="100"
                                                max="5000"
                                                value={roiSearches * 10} // Reusing state for demo
                                                onChange={(e) => setRoiSearches(parseInt(e.target.value) / 10)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                <span>$100</span>
                                                <span className="font-semibold">${roiSearches * 10}</span>
                                                <span>$5,000+</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Investment timeline
                                            </label>
                                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option>1-2 years (Short-term)</option>
                                                <option>3-5 years (Medium-term)</option>
                                                <option>5+ years (Long-term wealth building)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Results */}
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Fractional vs Traditional</h4>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-600">Properties you could invest in</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {Math.round((roiSearches * 10) / 50)} properties
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">With $50 minimum fractional shares</div>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-600">Traditional real estate barrier</div>
                                            <div className="text-2xl font-bold text-red-600">
                                                $50,000+ down payment
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">Single property, high barrier to entry</div>
                                        </div>
                                        
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <div className="text-sm text-blue-600">Recommended Plan</div>
                                            <div className="text-xl font-bold text-blue-700">
                                                {roiSearches * 10 < 200 ? 'Explorer' : roiSearches * 10 < 500 ? 'Investor' : roiSearches * 10 < 1500 ? 'Pro Investor' : 'Institutional'}
                                            </div>
                                            <div className="text-sm text-blue-600 mt-1">
                                                Diversification: {Math.round((roiSearches * 10) / 50)}x more properties than traditional
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to={`/signup?plan=${roiSearches * 10 < 200 ? 'explorer' : roiSearches * 10 < 500 ? 'investor' : roiSearches * 10 < 1500 ? 'pro' : 'institutional'}`}
                                            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                        >
                                            Start with {roiSearches * 10 < 200 ? 'Explorer' : roiSearches * 10 < 500 ? 'Investor' : roiSearches * 10 < 1500 ? 'Pro Investor' : 'Institutional'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> This calculator demonstrates the power of fractional ownership to lower barriers to real estate investment. 
                                    Actual returns depend on property performance, market conditions, and individual investment decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 px-4 sm:px-10 lg:px-24 bg-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                        {openFaq === index ? (
                                            <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-6 pb-6"
                                        >
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-10 lg:px-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-3xl font-bold mb-4">Ready to Start Building Wealth?</h3>
                        <p className="text-xl text-blue-100 mb-8">
                            Join the fractional real estate revolution. Start with free FXCT tokens, no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/signup?plan=investor" 
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Join Marketplace
                            </Link>
                            <Link 
                                to="/contact-sales" 
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                            >
                                Enterprise Solutions
                            </Link>
                        </div>
                        <p className="text-sm text-blue-200 mt-4">30-day money-back guarantee • Keep your FXCT tokens forever</p>
                    </div>
                </section>
            </div>
        </>
    );
}
