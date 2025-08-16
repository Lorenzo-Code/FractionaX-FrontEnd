import React from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "../../../shared/components";
import { generatePageSEO, generateStructuredData } from "../../../shared/utils";
import {
  SearchWithFeatured,
  HeroSectionTest,
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
      name: 'Tokenized Real Estate Investing',
      description: 'Fractional ownership of real estate properties through blockchain tokenization with AI-powered deal discovery.',
      url: '/marketplace',
      serviceType: 'FinancialService',
    }),
    generateStructuredData.service({
      name: 'AI-Powered Property Analysis',
      description: 'Advanced artificial intelligence algorithms analyze property investment potential and market trends.',
      url: '/marketplace',
      serviceType: 'ConsultingService',
    }),
    generateStructuredData.service({
      name: 'FXCT Token Ecosystem',
      description: 'Native cryptocurrency token for governance, rewards, and accessing premium platform features.',
      url: '/token',
      serviceType: 'FinancialService',
    }),
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

      {/* 1. HOOK - Problem-focused hero */}
      <HeroSectionTest />

      {/* 2. SEARCH & FEATURED PROPERTIES - Show AI search with top listings */}
      <SearchWithFeatured
        onSearch={handleSearch}
        showListings={true}
        showSearch={true}
        title="Smart Real Estate Search. AI-Powered Returns."
        description="Describe your ideal deal using natural language. Our AI will find properties that match your investment criteria."
      />

      {/* 3. STORY - Our journey and why we built this */}
      <WhyFractionaX />


      {/* 4. SOLUTION - How our platform works */}
      <HowItWorks />

      {/* 5. TECHNOLOGY - Advanced capabilities section */}
      <TechnologyCapabilities />

      {/* 6. BENEFITS - What you get with the ecosystem */}
      <EcosystemBenefits />

      {/* 7. FINAL CTA - Clear next step */}
      <FinalCTA />
    </div>
  );
};

export default Home;
