import React from "react";
import { useNavigate } from "react-router-dom";
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
    // Send user to marketplace and include the query as a URL parameter
    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
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
