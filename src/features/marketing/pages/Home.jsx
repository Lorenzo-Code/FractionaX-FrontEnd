import React from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "../../../shared/components";
import { generatePageSEO, generateStructuredData } from "../../../shared/utils";
import {
  HybridHero,
  MarketOverview,
  PropertyMarketplace,
  HowItWorks,
  EcosystemBenefits,
  TechnologyCapabilities,
  WhyFractionaX,
  FinalCTA
} from "../components";

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search/results?q=${encodeURIComponent(query)}`);
  };

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

  // Structured data for homepage
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
      name: 'Fractional Real Estate Investment Marketplace',
      description: 'Community-driven fractional ownership of real estate properties starting at $100. Bid with FXCT tokens, earn rewards, and build passive income.',
      url: '/marketplace',
      serviceType: 'FinancialService',
    }),
    generateStructuredData.service({
      name: 'FXCT Community Bidding System',
      description: 'Use utility tokens to bid on properties and validate market demand. Earn rewards while helping build investment opportunities.',
      url: '/marketplace',
      serviceType: 'FinancialService',
    }),
    generateStructuredData.service({
      name: 'FXCT Token Ecosystem',
      description: 'Native cryptocurrency token for governance, rewards, and accessing premium platform features.',
      url: '/token',
      serviceType: 'FinancialService',
    })
  ];

  return (
    <div className="overflow-x-hidden">
      <SEO
        {...seoData}
        structuredData={structuredData}
      >
        {/* Additional meta tags for homepage */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C0F1C" />
      </SEO>

      {/* 1. HYBRID HERO - Robinhood/Coinbase style with real estate twist */}
      <HybridHero />

      {/* 2. MARKET OVERVIEW - Live market data like trading platforms */}
      <MarketOverview />

      {/* 3. PROPERTY MARKETPLACE - HAR/Zillow style property discovery */}
      <PropertyMarketplace />

      {/* 4. SOLUTION - How our platform works (keeping some original content) */}
      <HowItWorks />

      {/* 5. BENEFITS - What you get with the ecosystem */}
      <EcosystemBenefits />

      {/* 6. FINAL CTA - Clear next step */}
      <FinalCTA />
    </div>
  );
};

export default Home;
