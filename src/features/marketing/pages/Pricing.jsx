import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, HelpCircle, Minus, Plus, Calculator, TrendingUp, Users, Shield, Star, Zap, DollarSign, Search, BarChart3, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

// Import the existing pricing data from PricingOverview
const tiers = [
    {
        name: "Basic",
        monthlyPrice: 99,
        annualPrice: 79, // 20% discount
        period: "/ month",
        badge: "",
        featured: false,
        fxct: "750 FXCT tokens every month — use them for searches, staking, or ecosystem services.",
        features: [
            "AI-powered property search & analytics",
            "Detailed property profiles (Basic Data)",
            "Access to local comps, tax records, and sales history summaries",
            "Priority email support",
            "Community & events access",
        ],
        idealFor: "Casual investors, early-stage agents, or anyone exploring tokenized real estate.",
        cta: "Get Basic",
        ctaLink: "/signup?plan=basic",
        color: "#0F182B",
        pillClass: "bg-blue-600 text-white",
    },
    {
        name: "Standard",
        monthlyPrice: 299,
        annualPrice: 239, // 20% discount
        period: "/ month",
        badge: "Best Value",
        featured: true,
        fxct: "2,000 FXCT tokens monthly",
        features: [
            "Everything in Basic",
            "Advanced property analytics (Standard Data)",
            "Expanded search history & ownership details",
            "Broker-ready comparables & mortgage data",
            "Enhanced AI valuation models",
            "Early access to premium tools & reports",
            "Priority chat support",
        ],
        idealFor: "Active real estate professionals, small brokerages, or investment groups.",
        cta: "Get Standard",
        ctaLink: "/signup?plan=standard",
        color: "#151543",
        pillClass: "bg-green-400 text-black",
    },
    {
        name: "Pro",
        monthlyPrice: 699,
        annualPrice: 559, // 20% discount
        period: "/ month",
        badge: "",
        featured: false,
        fxct: "5,000 FXCT tokens monthly",
        features: [
            "Everything in Standard",
            "Access to premium Pro Data (deep lien history, legal vesting, foreclosure pipeline, permits, and more)",
            "Priority queue for AI-assisted comps and predictive modeling",
            "Integration with CRM & portfolio tools",
            "Dedicated account manager",
        ],
        idealFor: "Brokerages, hedge funds, and institutional investors needing enterprise-grade property intelligence.",
        cta: "Get Pro",
        ctaLink: "/signup?plan=pro",
        color: "#0F182B",
        pillClass: "bg-blue-600 text-white",
    },
    {
        name: "Custom / Enterprise+",
        monthlyPrice: "Custom",
        annualPrice: "Custom",
        period: "",
        badge: "For Teams",
        featured: false,
        fxct: "Tailored FXCT bundles & usage allowances",
        features: [
            "Team seats & role-based access control",
            "SSO (Google/Microsoft/Okta)",
            "Admin console, audit logs & SLA",
            "API access & sandbox",
            "Custom data/search allowances & volume discounts",
            "Dedicated account manager & onboarding",
            "Compliance support (KYC/AML, audits)",
        ],
        idealFor: "Enterprises with complex workflows or strict compliance needs.",
        cta: "Contact Sales",
        ctaLink: "/contact-sales",
        color: "#0B1020",
        pillClass: "bg-black text-white",
    },
];

const fxctExamples = [
    { label: "Basic Data (search, tax, flood, etc.)", approxFxct: "≈ 3–6 FXCT / search" },
    { label: "Standard Data (detail, comps, mortgage)", approxFxct: "≈ 40–80 FXCT / search" },
    { label: "Pro Data (liens, transactions, CRA-AR5)", approxFxct: "≈ 150–500+ FXCT / report" },
];

const faqs = [
    {
        question: "What exactly are FXCT tokens?",
        answer: "FXCT tokens are FractionaX's native cryptocurrency that powers our AI property search platform. Think of them as credits that you use to access premium property data, run AI searches, and earn staking rewards. Unlike traditional subscription models, FXCT tokens are yours to own, trade, or stake for additional yield."
    },
    {
        question: "How does the AI search with natural language work?",
        answer: "Our advanced AI understands queries like 'Show me duplexes under $300K in Houston with good rental potential' or 'Find properties near downtown with recent renovations'. The AI searches across Zillow, MLS, HAR.com and other sources to find properties matching your criteria, then provides detailed analytics and investment insights."
    },
    {
        question: "Can I upgrade or downgrade my plan anytime?",
        answer: "Yes! You can change your plan at any time. When upgrading, you get immediate access to higher-tier features and additional FXCT tokens. When downgrading, changes take effect at your next billing cycle, but you keep any unused FXCT tokens."
    },
    {
        question: "What happens to unused FXCT tokens?",
        answer: "FXCT tokens never expire and roll over month to month. You can also stake unused tokens to earn additional yield, trade them on supported exchanges, or save them for larger premium reports. This makes your membership more valuable over time."
    },
    {
        question: "Is there a free trial available?",
        answer: "Yes! New users get 5 free AI-powered property searches to experience our platform. No credit card required. You can see property basics, AI analysis, and get a feel for our natural language search capabilities."
    },
    {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied within your first 30 days, we'll provide a full refund. However, any FXCT tokens used for searches during this period cannot be refunded as they represent actual data costs."
    },
    {
        question: "How accurate is the AI property analysis?",
        answer: "Our AI combines data from multiple sources including MLS, public records, tax assessments, and market trends to provide comprehensive analysis. While we strive for accuracy, our analysis should be used as a starting point for your research, not as the sole basis for investment decisions."
    },
    {
        question: "Can I use FractionaX for commercial real estate?",
        answer: "Currently, our platform focuses primarily on residential properties (single-family homes, condos, duplexes, etc.). Commercial real estate features are planned for future releases, especially for our Pro and Enterprise+ users."
    }
];

// Social proof data
const socialProofStats = [
    { icon: Users, number: "2,500+", label: "Active Investors" },
    { icon: Search, number: "50K+", label: "AI Searches Completed" },
    { icon: TrendingUp, number: "$12M+", label: "Properties Analyzed" },
    { icon: Award, number: "4.9/5", label: "Customer Rating" }
];

// Customer testimonials
const testimonials = [
    {
        name: "Sarah Chen",
        role: "Real Estate Investor",
        company: "Houston, TX",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=100&h=100&fit=crop&crop=face",
        quote: "FractionaX's AI found me 3 profitable duplexes in Houston that I never would have discovered on my own. The ROI predictions were spot-on.",
        plan: "Standard"
    },
    {
        name: "Mike Rodriguez",
        role: "Real Estate Agent",
        company: "Dallas Realty Group",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        quote: "The natural language search is game-changing. I can just ask 'Find condos under $200K near downtown with parking' and get exactly what I need.",
        plan: "Pro"
    },
    {
        name: "Jennifer Park",
        role: "Investment Firm Partner",
        company: "Park Capital",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        quote: "The FXCT token model is brilliant. We earn staking rewards on unused tokens while getting the best property data in the market.",
        plan: "Enterprise"
    }
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState(null);
    const [roiSearches, setRoiSearches] = useState(50);
    const [selectedTier, setSelectedTier] = useState('Standard');
    const [annualBilling, setAnnualBilling] = useState(false);
    
    const seoData = generatePageSEO({
        title: 'Pricing - AI-Powered Real Estate Search Plans | FractionaX',
        description: 'Choose the perfect FractionaX plan for your real estate investment needs. Get FXCT tokens, AI property search, and premium market data starting at $99/month.',
        url: '/pricing',
        keywords: [
            'real estate software pricing',
            'AI property search cost',
            'FXCT token plans',
            'property analysis subscription',
            'real estate data pricing',
            'MLS search pricing',
            'property investment tools cost'
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
                                💰 Choose Your Plan
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Join the future of AI-powered property intelligence. Earn FXCT tokens, access premium market data, and stake your way to rewards.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">✨ Natural Language AI Search</span>
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">🔒 Own Your FXCT Tokens</span>
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">📈 Staking Rewards</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Social Proof Stats */}
                <section className="py-12 px-4 sm:px-10 lg:px-24 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {socialProofStats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className=""
                                >
                                    <div className="flex justify-center mb-3">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <stat.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
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
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 text-sm font-bold rounded-full shadow-lg">
                                            {tier.badge}
                                        </div>
                                    )}

                                    <div className="text-center mb-6 space-y-2">
                                        <span className={`inline-block px-4 py-1 rounded-full text-xs tracking-wide font-semibold ${tier.pillClass}`}>
                                            {tier.name}
                                        </span>

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

                {/* Customer Testimonials */}
                <section className="py-16 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Loved by Real Estate Professionals</h3>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                See how FractionaX is helping investors and agents find better deals faster
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center mb-4">
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                            <div className="text-xs text-gray-500">{testimonial.company}</div>
                                        </div>
                                    </div>
                                    
                                    <blockquote className="text-gray-700 leading-relaxed mb-4">
                                        "{testimonial.quote}"
                                    </blockquote>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                            {testimonial.plan} Plan
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ROI Calculator */}
                <section className="py-16 px-4 sm:px-10 lg:px-24 bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <Calculator className="w-4 h-4" />
                                ROI Calculator
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Calculate Your Investment Return</h3>
                            <p className="text-lg text-gray-600">
                                See how much FractionaX could save you compared to traditional research methods
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Calculator Inputs */}
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Your Usage</h4>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Properties researched per month
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="200"
                                                value={roiSearches}
                                                onChange={(e) => setRoiSearches(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                <span>10</span>
                                                <span className="font-semibold">{roiSearches}</span>
                                                <span>200+</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current research method
                                            </label>
                                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option>Manual research (5-10 hours/property)</option>
                                                <option>Other software tools</option>
                                                <option>Hiring researchers</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Results */}
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Your Savings</h4>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-600">Time saved per month</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {Math.round(roiSearches * 4.5)} hours
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-600">Cost savings (at $50/hour)</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                ${(roiSearches * 4.5 * 50).toLocaleString()}/month
                                            </div>
                                        </div>
                                        
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <div className="text-sm text-blue-600">Recommended Plan</div>
                                            <div className="text-xl font-bold text-blue-700">
                                                {roiSearches < 25 ? 'Basic' : roiSearches < 75 ? 'Standard' : 'Pro'}
                                            </div>
                                            <div className="text-sm text-blue-600 mt-1">
                                                ROI: {Math.round(((roiSearches * 4.5 * 50) - (roiSearches < 25 ? 99 : roiSearches < 75 ? 299 : 699)) / (roiSearches < 25 ? 99 : roiSearches < 75 ? 299 : 699) * 100)}% per month
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to={`/signup?plan=${roiSearches < 25 ? 'basic' : roiSearches < 75 ? 'standard' : 'pro'}`}
                                            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                        >
                                            Get Started with {roiSearches < 25 ? 'Basic' : roiSearches < 75 ? 'Standard' : 'Pro'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> This calculator provides estimates based on average time savings reported by our users. 
                                    Your actual results may vary depending on property complexity and research depth.
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
                        <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
                        <p className="text-xl text-blue-100 mb-8">
                            Start with 5 free searches, no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/signup?plan=standard" 
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Start Free Trial
                            </Link>
                            <Link 
                                to="/contact-sales" 
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                            >
                                Contact Sales
                            </Link>
                        </div>
                        <p className="text-sm text-blue-200 mt-4">30-day money-back guarantee • Cancel anytime</p>
                    </div>
                </section>
            </div>
        </>
    );
}
