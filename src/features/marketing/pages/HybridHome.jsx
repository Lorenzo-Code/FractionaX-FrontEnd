import React from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "../../../shared/components";
import { generatePageSEO, generateStructuredData } from "../../../shared/utils";
import {
  HybridHero,
  MarketOverview,
  PropertyMarketplace,
  InvestmentDashboard,
  CommunityStats,
  TradingInterface,
  FinalCTA
} from "../components";

const HybridHome = () => {
  const navigate = useNavigate();

  // Generate SEO data for hybrid homepage
  const seoData = generatePageSEO({
    title: 'FractionaX | Real Estate Investment Platform - Buy, Trade, Earn',
    description: 'Trade fractional real estate like stocks. Discover properties, invest with $100, earn dividends. The hybrid platform combining real estate marketplace with investment trading.',
    keywords: [
      'fractional real estate trading',
      'real estate investment platform',
      'property marketplace',
      'real estate tokens',
      'invest in real estate',
      'property trading',
      'real estate crowdfunding',
      'tokenized property investment'
    ],
    url: '/home',
  });

  // Structured data for hybrid homepage
  const structuredData = [
    generateStructuredData.organization(),
    generateStructuredData.website(),
    generateStructuredData.breadcrumb([
      { name: "Home", url: "/" },
    ]),
    generateStructuredData.webPage({
      title: seoData.title,
      description: seoData.description,
      url: '/',
      type: 'WebPage',
    }),
    generateStructuredData.service({
      name: 'Fractional Real Estate Trading Platform',
      description: 'Trade fractional real estate investments like stocks. Discover properties, analyze investments, and build your portfolio starting at $100.',
      url: '/marketplace',
      serviceType: 'FinancialService',
    })
  ];

  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        {...seoData}
        structuredData={structuredData}
      >
        {/* Additional meta tags for homepage */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0052FF" />
      </SEO>

      {/* 1. HYBRID HERO - Robinhood/Coinbase style with real estate twist */}
      <HybridHero />

      {/* 2. MARKET OVERVIEW - Live market data like trading platforms */}
      <MarketOverview />

      {/* 3. PROPERTY MARKETPLACE - HAR/Zillow style property discovery */}
      <PropertyMarketplace />

      {/* 4. INVESTMENT DASHBOARD - Portfolio and trading interface */}
      <InvestmentDashboard />

      {/* 5. COMMUNITY STATS - Social proof and community features */}
      <CommunityStats />

      {/* 6. TRADING INTERFACE - Buy/sell interface like Robinhood */}
      <TradingInterface />

      {/* 7. FINAL CTA - Clear next step */}
      <FinalCTA />
    </div>
  );
};

export default HybridHome;
