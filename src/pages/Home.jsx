// src/pages/Home.js
import React from "react";
import SearchWithFeatured from "../components/homepage/SearchWithFeatured";
import HeroSectionTest from "../components/homepage/HeroSectionTest.jsx";
import Footer from "../components/common/Footer.jsx";
import PricingOverview from "../components/homepage/PricingOverview.jsx";
import HowItWorks from "../components/homepage/HowItWorks.jsx";
import WhyFractionaX from "../components/homepage/WhyFractionaX.jsx";
import FinalCTA from "../components/homepage/FinalCTA.jsx";


const Home = () => (
  <>
    <HeroSectionTest />
    {/* <SmartPropertySearch showSuggestions={true} /> */}
    <SearchWithFeatured />
    {/* <FeaturedProperties /> */}
    <PricingOverview />
    <HowItWorks />
    <WhyFractionaX />
    {/* <AIInsightHighlight /> */}
    <FinalCTA />
    {/* <EarnCrypto /> */}
    <Footer />
  </>
);

export default Home;
