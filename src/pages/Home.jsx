import React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { generatePageSEO, generateStructuredData } from "../utils/seo.js";

import SearchWithFeatured from "../components/homepage/SearchWithFeatured";
import HeroSectionTest from "../components/homepage/HeroSectionTest.jsx";
import Footer from "../components/common/Footer.jsx";
import PricingOverview from "../components/homepage/PricingOverview.jsx";
import HowItWorks from "../components/homepage/HowItWorks.jsx";
import WhyFractionaX from "../components/homepage/WhyFractionaX.jsx";
import FinalCTA from "../components/homepage/FinalCTA.jsx";

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  // Generate SEO data for homepage
  const seoData = generatePageSEO({
    title: 'Tokenized Real Estate Investing Platform',
    description: 'Discover smarter fractional property investments with built-in AI insights, smart contracts, and crypto-powered returns on Base blockchain.',
    keywords: [
      'tokenized real estate',
      'fractional investing', 
      'AI property analysis',
      'FXCT token',
      'Base blockchain',
      'DeFi real estate',
      'smart contracts',
      'cryptocurrency investing'
    ],
    url: '/home',
  });

  // Structured data for homepage
  const structuredData = [
    generateStructuredData.organization(),
    generateStructuredData.website(),
  ];

  return (
    <>
      <SEO 
        {...seoData} 
        structuredData={structuredData}
      >        
        {/* Additional meta tags for homepage */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C0F1C" />
      </SEO>

      <HeroSectionTest />
      <SearchWithFeatured onSearch={handleSearch} showListings={false} />
      <PricingOverview />
      <HowItWorks />
      <WhyFractionaX />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Home;
