// src/pages/Home.js
import React from "react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedProperties from "../components/FeaturedProperties";
import AIInsightHighlight from "../components/AIInsightHighlight";
import EarnCrypto from "../components/EarnCrypto";
import Footer from "../components/Footer";
import SmartPropertySearch from "../components/SmartPropertySearch";

const Home = () => (
  <>
    <HeroSection />
    <HowItWorks />
    <SmartPropertySearch showSuggestions={true} />
    <FeaturedProperties />
    <AIInsightHighlight />
    <EarnCrypto />
    <Footer />
  </>
);

export default Home;
