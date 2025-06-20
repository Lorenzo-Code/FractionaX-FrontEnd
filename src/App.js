// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FCTLandingPage from "./pages/FCTLandingPage";
import ScrollToTop from "./utils/ScrollToTop";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import DocsPage from "./pages/DocsPage";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gray-50 text-gray-900 font-sans">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/fct" element={<FCTLandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </>
  );
}

export default App;
