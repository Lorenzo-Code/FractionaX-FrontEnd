// src/pages/Home.js
import React from "react";
import HeroSection from "../components/HeroSection.jsx";
import HowItWorks from "../components/HowItWorks";
import FeaturedProperties from "../components/FeaturedProperties.jsx";
import AIInsightHighlight from "../components/AIInsightHighlight.jsx";
import EarnCrypto from "../components/EarnCrypto.jsx";
import Footer from "../components/Footer.jsx";
import SmartPropertySearch from "../components/SmartPropertySearch.jsx";

const Home = () => (
  <>
    <HeroSection />
    {/* <HowItWorks /> */}
    <SmartPropertySearch showSuggestions={true} />
    <FeaturedProperties />
    <AIInsightHighlight />
    <EarnCrypto />
    <Footer />
  </>
);

export default Home;


// import HeroSection from '../components/HeroSection';

// function Home() {
//   return (
//     <div>
//       <h2 className="text-xl text-purple-600">Home page loaded</h2>
//       <HeroSection />
//     </div>
//   );
// }

// export default Home;
