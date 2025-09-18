import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, HelpCircle, Minus, Plus, Calculator, TrendingUp, Users, Shield, Star, Zap, DollarSign, Search, BarChart3, Award, Coins, Bot, PieChart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

// Single Membership with Staking Benefits Model
const membershipPlan = {
    name: "FractionaX Membership",
    regularPrice: 150,
    launchPrice: 99,
    period: "/ month",
    badge: "Founding Members Special",
    featured: true,
    description: "Complete access to fractional real estate marketplace with staking rewards",
    baseFeatures: [
        "Full platform access to fractional property investments",
        "Community marketplace bidding with FXCT tokens",
        "Portfolio tracking & FXST security token management",
        "10 AI-Research searches included monthly",
        "Property performance reports & analytics",
        "Community forum access",
        "Mobile app access",
    ],
    launchOffer: {
        discount: 51, // $150 - $99 = $51
        duration: "3 months",
        totalSavings: 153, // $51 x 3 = $153
        urgency: "Limited launch discount"
    },
    stakingBenefits: [
        {
            tier: "Basic Staking",
            requirement: "1,000+ FXCT staked",
            benefits: ["10% discount on additional AI searches", "Priority property notifications"]
        },
        {
            tier: "Pro Staking", 
            requirement: "5,000+ FXCT staked",
            benefits: ["20% discount on AI searches", "Advanced analytics access", "Early property access"]
        },
        {
            tier: "Elite Staking",
            requirement: "15,000+ FXCT staked", 
            benefits: ["30% discount on AI searches", "Premium analytics", "Dedicated support", "White-label reports"]
        }
    ],
    idealFor: "Serious real estate investors ready to build wealth through fractional ownership.",
    cta: "Join as Founding Member",
    ctaLink: "/signup?plan=founding-member",
    color: "#151543"
};

// Additional services pricing
const additionalServices = [
    { name: "Extra AI Searches", price: "$2 each", stakingDiscount: "Up to 30% off with staking" },
    { name: "Premium Analytics Report", price: "$15 each", stakingDiscount: "Up to 30% off with staking" },
    { name: "Property Due Diligence", price: "$50 each", stakingDiscount: "Up to 30% off with staking" }
];

const faqs = [
    {
        question: "What's included in the $99 launch offer?",
        answer: "The Founding Members Special includes full platform access at $99/month for your first 3 months (normally $150/month). You save $153 total and lock in our lowest pricing during launch. After 3 months, you'll pay the standard $150/month."
    },
    {
        question: "How does FXCT staking work for discounts?",
        answer: "Stake FXCT tokens to unlock discounts on additional services: Basic Staking (1,000+ FXCT) gets 10% off, Pro Staking (5,000+ FXCT) gets 20% off, Elite Staking (15,000+ FXCT) gets 30% off plus premium features."
    },
    {
        question: "What are FXCT and FXST tokens?",
        answer: "FXCT are community tokens earned through participation in property bidding and marketplace activities. FXST are security tokens that represent your actual fractional ownership in real properties. Both work together to create a transparent, fair investment ecosystem."
    },
    {
        question: "How does fractional real estate ownership work?",
        answer: "You can purchase fractional shares in real properties starting at just $50. Your ownership is secured by FXST security tokens, and you earn proportional rental income from your shares. Our community bidding system ensures fair property acquisition prices."
    },
    {
        question: "What happens if I need more than 10 AI searches per month?",
        answer: "Additional AI searches are available at $2 each (discounted with FXCT staking). Premium analytics reports are $15 each and property due diligence reports are $50 each - all with staking discounts available."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes! There are no long-term commitments. You can cancel your membership at any time. We also offer a 30-day money-back guarantee if you're not satisfied with the platform."
    },
    {
        question: "Is there a money-back guarantee?",
        answer: "Yes! We offer a 30-day money-back guarantee on all paid memberships. If you're not satisfied with our fractional marketplace and tools, we'll provide a full refund within the first 30 days of your subscription."
    },
    {
        question: "What's the difference between the launch price and regular price?",
        answer: "The launch price of $99/month is a limited-time discount for early adopters. After your first 3 months, the membership is $150/month. This anchors the true value of the platform while making early access affordable."
    }
];

// Platform readiness stats (honest pre-launch metrics)
const platformStats = [
    { icon: Bot, number: "Ready", label: "AI Analytics Engine" },
    { icon: Search, number: "Ready", label: "Property Search Tool" },
    { icon: Shield, number: "Ready", label: "Security Framework" },
    { icon: Users, number: "Coming Soon", label: "Community Launch" }
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState(null);
    const [roiSearches, setRoiSearches] = useState(50);
    const [annualBilling, setAnnualBilling] = useState(false);
    
    const seoData = generatePageSEO({
        title: 'Fractional Real Estate Membership | FractionaX Pricing - $99 Launch Offer',
        description: 'Join FractionaX fractional real estate marketplace. Founding Members Special: $99/month for first 3 months (normally $150). Get FXCT tokens, community bidding, FXST security tokens, and AI-Research Tools.',
        url: '/pricing',
        keywords: [
            'fractional real estate pricing',
            'FXCT token membership',
            'FXST security tokens',
            'fractional property investment',
            'community bidding platform',
            'AI research tool pricing',
            'fractional marketplace membership',
            'real estate tokenization pricing'
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
        // Add pricing schema for membership
        {
            "@context": "https://schema.org",
            "@type": "Offer",
            "name": `FractionaX ${membershipPlan.name}`,
            "description": membershipPlan.idealFor,
            "price": membershipPlan.launchPrice.toString(),
            "priceCurrency": "USD",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "FractionaX"
            }
        }
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
                            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-green-400/30">
                                <Star className="w-4 h-4" />
                                {membershipPlan.launchOffer.urgency} - Save ${membershipPlan.launchOffer.totalSavings}
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                                🏘️ Fractional Real Estate Marketplace
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Join as a Founding Member for just <strong>${membershipPlan.launchPrice}/month</strong> for your first 3 months.
                                Get full access to fractional property investments, community bidding with FXCT tokens, and AI-Research Tools.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">🪙 FXCT Community Tokens</span>
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">📜 FXST Security Tokens</span>
                                <span className="bg-blue-800/50 px-4 py-2 rounded-full">🤖 AI-Research Tools</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Single Membership Card */}
                <section className="py-16 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative rounded-2xl p-8 shadow-2xl border bg-gradient-to-br from-blue-900 to-indigo-900 text-white ring-4 ring-green-400 transform hover:scale-[1.02] transition-all duration-300"
                        >
                            {/* Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 text-sm font-bold rounded-full shadow-lg">
                                {membershipPlan.badge}
                            </div>

                            <div className="text-center mb-8 mt-4">
                                <h2 className="text-3xl font-bold text-green-300 mb-4">
                                    {membershipPlan.name}
                                </h2>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="text-5xl font-bold">
                                            ${membershipPlan.launchPrice}
                                        </div>
                                        <div className="text-xl text-white/60 line-through">
                                            ${membershipPlan.regularPrice}
                                        </div>
                                    </div>
                                    <div className="text-lg text-blue-200">
                                        {membershipPlan.period} for first {membershipPlan.launchOffer.duration}
                                    </div>
                                    <div className="text-sm text-green-300 font-semibold">
                                        Then ${membershipPlan.regularPrice}/month • Save ${membershipPlan.launchOffer.totalSavings} total
                                    </div>
                                </div>

                                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                                    {membershipPlan.description}
                                </p>
                            </div>

                            {/* Base Features */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-4">✅ Included with Membership:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {membershipPlan.baseFeatures.map((feature, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center mb-6">
                                <Link to={membershipPlan.ctaLink} className="block">
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl">
                                        <span className="inline-flex items-center justify-center gap-2">
                                            {membershipPlan.cta} - ${membershipPlan.launchPrice}/mo
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </button>
                                </Link>
                                <p className="text-xs text-blue-200 mt-3">30-day money-back guarantee • Access code required for registration</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Staking Benefits */}
                <section className="py-16 px-4 sm:px-10 lg:px-24 bg-blue-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">🪙 Unlock More with FXCT Staking</h2>
                            <p className="text-lg text-gray-600">
                                Stake FXCT tokens to earn discounts on additional services and unlock premium features
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {membershipPlan.stakingBenefits.map((tier, index) => (
                                <motion.div
                                    key={tier.tier}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                                >
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.tier}</h3>
                                        <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            {tier.requirement}
                                        </div>
                                    </div>
                                    <ul className="space-y-3">
                                        {tier.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Services */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">💰 Additional Services (Pay-as-you-go)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {additionalServices.map((service, index) => (
                                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-gray-900 mb-2">{service.name}</div>
                                        <div className="text-lg font-bold text-blue-600">{service.price}</div>
                                        <div className="text-xs text-green-600 mt-1">{service.stakingDiscount}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 text-center mt-4">
                                All additional services are discounted when you stake FXCT tokens
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 px-4 sm:px-10 lg:px-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">How Our Fractional Marketplace Works</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                One simple membership gives you full access to fractional property investments. 
                                Start investing with just $50 per property, participate in community bidding, and use FXCT staking for additional discounts and premium features.
                            </p>

                            <h4 className="text-lg font-semibold text-gray-900 mb-4">What You Get With Your Membership</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                                    <div className="text-sm font-semibold text-gray-900">Fractional Ownership</div>
                                    <div className="text-lg font-bold text-blue-600 mt-1">Real Shares</div>
                                    <div className="text-xs text-gray-600 mt-2">Own actual shares in properties starting at $50 with FXST security tokens</div>
                                </div>
                                <div className="rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                                    <div className="text-sm font-semibold text-gray-900">Community Bidding</div>
                                    <div className="text-lg font-bold text-blue-600 mt-1">FXCT Rewards</div>
                                    <div className="text-xs text-gray-600 mt-2">Participate in fair property acquisition and earn FXCT tokens</div>
                                </div>
                                <div className="rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                                    <div className="text-sm font-semibold text-gray-900">AI-Research Tool</div>
                                    <div className="text-lg font-bold text-blue-600 mt-1">10 Searches Included</div>
                                    <div className="text-xs text-gray-600 mt-2">Professional property insights with additional searches available</div>
                                </div>
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
                        <h3 className="text-3xl font-bold mb-4">Ready to Start Building Wealth Through Fractional Real Estate?</h3>
                        <p className="text-xl text-blue-100 mb-8">
                            Join now and lock in our lowest pricing: $99/month for your first 3 months, then $150/month.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to={membershipPlan.ctaLink}
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Join as Founding Member
                            </Link>
                            <Link 
                                to="/contact" 
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                            >
                                Learn More
                            </Link>
                        </div>
                        <p className="text-sm text-blue-200 mt-4">30-day money-back guarantee • Access code required for registration</p>
                    </div>
                </section>
            </div>
        </>
    );
}
