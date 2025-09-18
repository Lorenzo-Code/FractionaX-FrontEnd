import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, HelpCircle, Minus, Plus, Calculator, TrendingUp, Users, Shield, Star, Zap, DollarSign, Search, BarChart3, Award, Coins, Bot, PieChart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';
import { usePageContent } from '../../../hooks/useFrontendPagesData';

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
        answer: "Yes! There are no long-term commitments. You can cancel your membership at any time. We also offer a 7-day free trial to explore the platform risk-free before any charges."
    },
    {
        question: "What happens during the 7-day free trial?",
        answer: "During your 7-day free trial, you get full access to all membership features including fractional property investments, FXCT tokens, FXST security tokens, AI-Research searches, and community marketplace. No charges until your trial ends."
    },
    {
        question: "What's the difference between the launch price and regular price?",
        answer: "The launch price of $99/month is a limited-time discount for early adopters. After your first 3 months, the membership is $150/month. This anchors the true value of the platform while making early access affordable."
    }
];

// Platform readiness stats (honest pre-launch metrics)
const platformStats = [
    { icon: Bot, number: "In Development", label: "AI Analytics Engine" },
    { icon: Search, number: "In Development", label: "Property Search Tool" },
    { icon: Shield, number: "In Development", label: "Security Framework" },
    { icon: Users, number: "Q2 2026", label: "Community Launch" }
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState(null);
    const [roiSearches, setRoiSearches] = useState(50);
    
    // Fetch pricing data from API
    const { data: pricingData, loading: pricingLoading, error: pricingError } = usePageContent('pricing');
    
    // Use API data if available, fall back to hardcoded data
    const apiPlans = pricingData?.plans || [];
    const apiFaqs = pricingData?.faq || [];
    const pageTitle = pricingData?.title || "Simple, Transparent Pricing";
    const pageSubtitle = pricingData?.subtitle || "Choose the plan that works for your investment goals";
    
    // Use API FAQs if available, otherwise use hardcoded ones
    const displayFaqs = apiFaqs.length > 0 ? apiFaqs : faqs;
    
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
            
            <div className="bg-white min-h-screen">
                {/* Hero Section - Integrated without header */}
                <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            {/* Launch Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-lg"
                            >
                                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{membershipPlan.launchOffer.urgency} • Save ${membershipPlan.launchOffer.totalSavings}</span>
                                <span className="sm:hidden">Save ${membershipPlan.launchOffer.totalSavings}</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 text-gray-900 leading-tight">
                                Fractional Real Estate
                                <span className="block text-blue-600">Membership</span>
                            </h1>
                            
                            {/* Subheading */}
                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
                                Join as a <strong className="text-blue-600">Founding Member</strong> for just 
                                <span className="text-2xl sm:text-3xl font-bold text-gray-900 block sm:inline mt-2 sm:mt-0 sm:mx-2">${membershipPlan.launchPrice}</span>
                                <span className="block sm:inline">for your first 3 months</span>
                            </p>
                            
                            {/* Feature Pills */}
                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                                {[
                                    { icon: "🏗️", text: "Fractional Ownership" },
                                    { icon: "🪙", text: "FXCT Community Tokens" },
                                    { icon: "📜", text: "FXST Security Tokens" },
                                    { icon: "🤖", text: "AI-Research Tools" }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.text}
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="px-4"
                            >
                                <Link 
                                    to={membershipPlan.ctaLink}
                                    className="inline-flex items-center gap-2 sm:gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto justify-center"
                                >
                                    <span className="hidden sm:inline">Join as Founding Member</span>
                                    <span className="sm:hidden">Join as Member</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Card */}
                <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12 sm:mb-16"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                                {pageTitle}
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                                {pageSubtitle}
                            </p>
                        </motion.div>

                        {/* Main Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            {/* Main Card */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                                {/* Badge */}
                                <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-10">
                                    <div className="bg-blue-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg">
                                        <span className="hidden sm:inline">{membershipPlan.badge}</span>
                                        <span className="sm:hidden">Special Offer</span>
                                    </div>
                                </div>

                                {/* Header Section */}
                                <div className="bg-white px-4 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 text-center border-b border-gray-100">
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">
                                        {membershipPlan.name}
                                    </h3>
                                    
                                    {/* Pricing Display */}
                                    <div className="mb-4 sm:mb-6">
                                        <div className="flex items-baseline justify-center gap-2 sm:gap-4 mb-2">
                                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">
                                                ${membershipPlan.launchPrice}
                                            </span>
                                            <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">
                                                ${membershipPlan.regularPrice}
                                            </span>
                                        </div>
                                        <div className="text-gray-600 mb-2 text-sm sm:text-base">
                                            {membershipPlan.period} for first <span className="font-semibold">{membershipPlan.launchOffer.duration}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                                            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Save ${membershipPlan.launchOffer.totalSavings} total
                                        </div>
                                    </div>

                                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                                        {membershipPlan.description}
                                    </p>
                                </div>

                                {/* Features Section */}
                                <div className="px-4 sm:px-8 py-6 sm:py-8">
                                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                                        Everything included
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                        {membershipPlan.baseFeatures.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                </div>
                                                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                                    <Link to={membershipPlan.ctaLink}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-2xl font-bold text-base sm:text-lg shadow-xl transition-all duration-300"
                                        >
                                            <span className="inline-flex items-center justify-center gap-2 flex-wrap">
                                                <span className="hidden sm:inline">{membershipPlan.cta} - ${membershipPlan.launchPrice}/mo</span>
                                                <span className="sm:hidden">Join - ${membershipPlan.launchPrice}/mo</span>
                                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </span>
                                        </motion.button>
                                    </Link>
                                    <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4">
                                        7-day free trial • Access code required for registration
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Staking Benefits */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <Coins className="w-4 h-4" />
                                FXCT Staking Rewards
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                Unlock Premium Benefits
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Stake FXCT tokens to earn significant discounts on additional services and unlock exclusive premium features
                            </p>
                        </motion.div>

                        {/* Staking Tiers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {membershipPlan.stakingBenefits.map((tier, index) => {
                                const colors = [
                                    { bg: 'from-blue-500 to-blue-600', accent: 'blue' },
                                    { bg: 'from-gray-700 to-gray-800', accent: 'gray' },
                                    { bg: 'from-blue-700 to-blue-900', accent: 'blue' }
                                ];
                                const color = colors[index];
                                
                                return (
                                    <motion.div
                                        key={tier.tier}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        whileHover={{ y: -8 }}
                                        className="relative group"
                                    >
                                        {/* Main Card */}
                                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
                                            {/* Header */}
                                            <div className="text-center mb-8">
                                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${color.bg} rounded-2xl mb-4 shadow-lg`}>
                                                    <Coins className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.tier}</h3>
                                                <div className={`inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold`}>
                                                    <Target className="w-3 h-3" />
                                                    {tier.requirement}
                                                </div>
                                            </div>
                                            
                                            {/* Benefits */}
                                            <div className="space-y-4">
                                                {tier.benefits.map((benefit, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                        </div>
                                                        <span className="text-gray-700 text-sm">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Additional Services */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            {/* Main Card */}
                            <div className="bg-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                        <DollarSign className="w-4 h-4" />
                                        Pay-as-you-go Services
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Additional Services</h3>
                                    <p className="text-gray-600">Expand your capabilities with premium add-on services</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {additionalServices.map((service, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                                        >
                                            <h4 className="font-bold text-gray-900 mb-2">{service.name}</h4>
                                            <div className="text-2xl font-black text-gray-900 mb-2">{service.price}</div>
                                            <div className="text-sm text-blue-600 font-semibold">{service.stakingDiscount}</div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <div className="text-center mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                                    <p className="text-sm text-blue-800 font-medium">
                                        <span className="inline-flex items-center gap-1">
                                            <Star className="w-4 h-4" />
                                            All additional services are discounted when you stake FXCT tokens
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
                
                {/* How It Works */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                One simple membership unlocks access to fractional real estate investing with cutting-edge technology
                            </p>
                        </motion.div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: "🏗️",
                                    title: "Fractional Ownership",
                                    subtitle: "Real Shares",
                                    description: "Own actual shares in properties starting at $50 with FXST security tokens for transparent ownership",
                                    gradient: "from-blue-500 to-blue-600"
                                },
                                {
                                    icon: "🪙",
                                    title: "Community Bidding",
                                    subtitle: "FXCT Rewards",
                                    description: "Participate in fair property acquisition and earn FXCT tokens through marketplace activities",
                                    gradient: "from-gray-700 to-gray-800"
                                },
                                {
                                    icon: "🤖",
                                    title: "AI-Research Tool",
                                    subtitle: "10 Searches Included",
                                    description: "Professional property insights with additional searches available at discounted rates",
                                    gradient: "from-blue-700 to-blue-900"
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    whileHover={{ y: -8 }}
                                    className="relative group"
                                >
                                    {/* Main Card */}
                                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
                                        {/* Icon */}
                                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 shadow-lg`}>
                                            <span className="text-2xl">{feature.icon}</span>
                                        </div>
                                        
                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <div className="text-lg font-semibold text-blue-600 mb-4">
                                            {feature.subtitle}
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Platform Status */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <BarChart3 className="w-4 h-4" />
                                Platform Status
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                Platform Development Update
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We're actively building the future of fractional real estate investing. Here's where we stand in development.
                            </p>
                        </motion.div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {platformStats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                const isInDevelopment = stat.number === "In Development";
                                const isScheduled = stat.number === "Q2 2026";
                                
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg ${
                                            isInDevelopment 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-600 text-white'
                                        }`}>
                                            <IconComponent className="w-10 h-10" />
                                        </div>
                                        <div className={`text-2xl font-black mb-2 ${
                                            isInDevelopment ? 'text-blue-600' : 'text-gray-600'
                                        }`}>
                                            {stat.number}
                                        </div>
                                        <div className="text-gray-700 font-semibold text-lg">
                                            {stat.label}
                                        </div>
                                        {isInDevelopment && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                    <Target className="w-3 h-3" />
                                                    Active
                                                </span>
                                            </div>
                                        )}
                                        {isScheduled && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Planned
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        {/* Progress Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-16 text-center"
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-3xl mx-auto">
                                <p className="text-blue-800 font-medium text-lg">
                                    🚧 <strong>Development Timeline:</strong> Beta opens November 2024, with full platform launch scheduled for Q2 2026. Early access members will help shape the platform during development.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Value Comparison */}
                <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12 sm:mb-16"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                                Traditional vs. Fractional Investing
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                                See how FractionaX makes real estate investing accessible to everyone
                            </p>
                        </motion.div>

                        {/* Comparison Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
                        >
                            {/* Mobile Card Layout - visible on small screens */}
                            <div className="block lg:hidden">
                                <div className="p-4 sm:p-6 space-y-4">
                                    {[
                                        {
                                            feature: "Minimum Investment",
                                            traditional: "$50,000 - $500,000+",
                                            fractionax: "$50"
                                        },
                                        {
                                            feature: "Liquidity",
                                            traditional: "Months to years to sell",
                                            fractionax: "Trade on marketplace"
                                        },
                                        {
                                            feature: "Diversification",
                                            traditional: "Limited by capital",
                                            fractionax: "Multiple properties easily"
                                        },
                                        {
                                            feature: "Management",
                                            traditional: "Full responsibility",
                                            fractionax: "Professionally managed"
                                        },
                                        {
                                            feature: "Research Tools",
                                            traditional: "Hire professionals",
                                            fractionax: "AI-powered analytics included"
                                        },
                                        {
                                            feature: "Ownership Verification",
                                            traditional: "Paper records, legal fees",
                                            fractionax: "Blockchain security tokens"
                                        }
                                    ].map((row, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                                        >
                                            <h3 className="font-bold text-gray-900 mb-3 text-center text-lg">{row.feature}</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="bg-white rounded-xl p-3 border border-red-200">
                                                    <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Traditional</div>
                                                    <div className="text-sm text-gray-700">{row.traditional}</div>
                                                </div>
                                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">FractionaX</div>
                                                    <div className="text-sm font-semibold text-blue-700">{row.fractionax}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Table Layout - hidden on small screens */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-8 py-6 text-left text-lg font-bold text-gray-900">Feature</th>
                                            <th className="px-8 py-6 text-center text-lg font-bold text-red-600">Traditional Real Estate</th>
                                            <th className="px-8 py-6 text-center text-lg font-bold text-blue-600">FractionaX</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[
                                            {
                                                feature: "Minimum Investment",
                                                traditional: "$50,000 - $500,000+",
                                                fractionax: "$50"
                                            },
                                            {
                                                feature: "Liquidity",
                                                traditional: "Months to years to sell",
                                                fractionax: "Trade on marketplace"
                                            },
                                            {
                                                feature: "Diversification",
                                                traditional: "Limited by capital",
                                                fractionax: "Multiple properties easily"
                                            },
                                            {
                                                feature: "Management",
                                                traditional: "Full responsibility",
                                                fractionax: "Professionally managed"
                                            },
                                            {
                                                feature: "Research Tools",
                                                traditional: "Hire professionals",
                                                fractionax: "AI-powered analytics included"
                                            },
                                            {
                                                feature: "Ownership Verification",
                                                traditional: "Paper records, legal fees",
                                                fractionax: "Blockchain security tokens"
                                            }
                                        ].map((row, index) => (
                                            <motion.tr
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-8 py-6 font-semibold text-gray-900">{row.feature}</td>
                                                <td className="px-8 py-6 text-center text-gray-600">{row.traditional}</td>
                                                <td className="px-8 py-6 text-center font-semibold text-blue-600">{row.fractionax}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* CTA in table */}
                            <div className="bg-blue-50 p-4 sm:p-6 lg:p-8 text-center">
                                <p className="text-blue-800 font-semibold mb-4 text-sm sm:text-base">
                                    Ready to experience the future of real estate investing?
                                </p>
                                <Link to={membershipPlan.ctaLink}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        Start Your 7-Day Free Trial
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Why Choose FractionaX */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                Why Choose FractionaX?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                The future of real estate investing is here - accessible, transparent, and powered by blockchain technology
                            </p>
                        </motion.div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    emoji: "⚡",
                                    title: "Low Barrier to Entry",
                                    description: "Start investing in premium real estate with just $50, compared to traditional $50,000+ down payments",
                                    stat: "$50",
                                    statLabel: "Minimum Investment"
                                },
                                {
                                    emoji: "🔒",
                                    title: "Blockchain Security", 
                                    description: "Your ownership is secured by FXST security tokens on the blockchain - transparent and immutable",
                                    stat: "100%",
                                    statLabel: "Transparent Ownership"
                                },
                                {
                                    emoji: "🎯",
                                    title: "AI-Powered Insights",
                                    description: "Make informed decisions with professional-grade AI analysis and market research tools",
                                    stat: "10+",
                                    statLabel: "AI Searches Included"
                                }
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="text-5xl mb-6 text-center">{benefit.emoji}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{benefit.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed text-center">{benefit.description}</p>
                                    
                                    {/* Stat Display */}
                                    <div className="text-center p-4 bg-white rounded-2xl border border-gray-200">
                                        <div className="text-3xl font-black text-blue-600 mb-1">{benefit.stat}</div>
                                        <div className="text-sm text-gray-600 font-medium">{benefit.statLabel}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social Proof & Trust */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                Why Join Early Access?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                As an early access member, you'll help shape the platform while securing exclusive founding member benefits
                            </p>
                        </motion.div>

                        {/* Trust Indicators Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    icon: Shield,
                                    title: "Secure & Transparent",
                                    description: "Blockchain-backed ownership with FXST security tokens ensures your investments are protected and verifiable.",
                                    metric: "100%",
                                    metricLabel: "Transparent Ownership"
                                },
                                {
                                    icon: Award,
                                    title: "Early Access Benefits",
                                    description: "Founding members get exclusive pricing, beta access, and input on platform features before public launch.",
                                    metric: "Nov 2024",
                                    metricLabel: "Beta Access Starts"
                                },
                                {
                                    icon: Users,
                                    title: "Community Driven",
                                    description: "Fair property acquisition through community bidding ensures everyone gets access at market prices.",
                                    metric: "FXCT",
                                    metricLabel: "Community Tokens"
                                }
                            ].map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        className="text-center"
                                    >
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-lg">
                                            <IconComponent className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                            <div className="text-2xl font-black text-blue-600 mb-1">{item.metric}</div>
                                            <div className="text-sm text-gray-600 font-medium">{item.metricLabel}</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Development Progress */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-blue-50 border border-blue-200 rounded-3xl p-12 text-center"
                        >
                            <div className="mb-8">
                                <div className="text-6xl font-black text-blue-600 mb-4">Pre-Launch</div>
                                <div className="text-xl font-semibold text-gray-900 mb-2">Early Access Program</div>
                                <div className="text-gray-600">Be among the first to experience fractional real estate investing</div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: "Beta Launch", value: "Nov 2024" },
                                    { label: "Full Platform", value: "Q2 2026" },
                                    { label: "Development Stage", value: "Active" },
                                    { label: "Early Access Spots", value: "Limited" }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="text-2xl font-black text-gray-900 mb-2">{stat.value}</div>
                                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section - Founding Members */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Rocket Emoji with Animation */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="text-8xl mb-8"
                            >
                                🚀
                            </motion.div>
                            
                            <h2 className="text-4xl sm:text-5xl font-black mb-6">
                                Join Our Founding Members
                            </h2>
                            
                            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Be among the first to experience fractional real estate investing. 
                                Lock in our special <strong className="text-white">${membershipPlan.launchPrice}/month</strong> pricing for your first 3 months.
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                <Link 
                                    to={membershipPlan.ctaLink}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300"
                                    >
                                        Join as Founding Member
                                    </motion.button>
                                </Link>
                                <Link 
                                    to="/contact"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                                    >
                                        Learn More
                                    </motion.button>
                                </Link>
                            </div>
                            
                            {/* Benefit Pills */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {[
                                    "Exclusive Launch Pricing",
                                    "Priority Property Access", 
                                    "FXCT Token Rewards",
                                    "Premium Support"
                                ].map((benefit, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                                        className="bg-blue-700 border border-blue-500 px-4 py-2 rounded-full text-sm font-medium"
                                    >
                                        ✨ {benefit}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <HelpCircle className="w-4 h-4" />
                                FAQ
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4">
                                Questions & Answers
                            </h2>
                            <p className="text-xl text-gray-600">
                                Everything you need to know about our fractional real estate membership
                            </p>
                        </motion.div>

                        {/* FAQ Items */}
                        <div className="space-y-4">
                            {displayFaqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                                        >
                                            <span className="font-bold text-gray-900 pr-4 text-lg group-hover:text-blue-600 transition-colors">{faq.question}</span>
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                openFaq === index 
                                                    ? 'bg-blue-100 text-blue-600 rotate-180' 
                                                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                                            }`}>
                                                {openFaq === index ? (
                                                    <Minus className="w-5 h-5" />
                                                ) : (
                                                    <Plus className="w-5 h-5" />
                                                )}
                                            </div>
                                        </button>
                                        
                                        <AnimatePresence>
                                            {openFaq === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="border-t border-gray-100"
                                                >
                                                    <div className="p-8 pt-6">
                                                        <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-4xl mx-auto">
                        {/* Main CTA Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            {/* Main Card */}
                            <div className="bg-gray-900 rounded-3xl p-12 text-center text-white">
                                <div className="relative">
                                    {/* Animated Money Emoji */}
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-6xl mb-6"
                                    >
                                        💰
                                    </motion.div>
                                    
                                    <h2 className="text-4xl sm:text-5xl font-black mb-6">
                                        Ready to Start Building Wealth?
                                    </h2>
                                    
                                    <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
                                        Join thousands of investors already building wealth through fractional real estate
                                    </p>
                                    
                                    {/* Pricing Highlight */}
                                    <div className="bg-white/10 rounded-2xl p-6 mb-8 inline-block">
                                        <div className="text-sm text-gray-300 mb-1">Launch Special</div>
                                        <div className="text-3xl font-black text-white mb-1">
                                            ${membershipPlan.launchPrice}/month
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            First 3 months • Then ${membershipPlan.regularPrice}/month
                                        </div>
                                    </div>
                                    
                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                                        <Link to={membershipPlan.ctaLink}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all duration-300"
                                            >
                                                Join as Founding Member
                                            </motion.button>
                                        </Link>
                                        <Link to="/contact">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                                            >
                                                Learn More
                                            </motion.button>
                                        </Link>
                                    </div>
                                    
                                    {/* Trust Indicators */}
                                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            7-day free trial
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Access code required
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4" />
                                            Instant access
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
