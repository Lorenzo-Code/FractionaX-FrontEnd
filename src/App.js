import React from "react";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import PropertySearch from "./components/PropertySearch";
import FeaturedProperties from "./components/FeaturedProperties";
import AIInsightHighlight from "./components/AIInsightHighlight";
import EarnCrypto from "./components/EarnCrypto";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <PropertySearch />
      <FeaturedProperties />
      <AIInsightHighlight />
      <EarnCrypto />
      <Footer />
    </div>
  );
}

export default App;
