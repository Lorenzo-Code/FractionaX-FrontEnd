import React from "react";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import { Routes, Route, Navigate } from 'react-router-dom';
import FCTLandingPage from "./pages/FCTLandingPage.jsx";
import NavBar from "./components/common/NavBar.jsx";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import FractionaXTokenEcosystem from "./pages/FractionaXTokenEcosystem.jsx";
import ContactPage from "./pages/ContactPage.jsx"
import SignUpLoginPage from "./pages/SignUpLoginPage.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx"
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import AccountCreationSuccess from "./components/common/AccountCreationSuccess";
import AdminDashboard from "./pages/AdminDashboard.jsx";


function App() {
  return (
    <>
      <div className="bg-gray-50 text-gray-900 font-sans">
      <ScrollToTop />
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/fct" element={<FCTLandingPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/ecosystem" element={<FractionaXTokenEcosystem />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<SignUpLoginPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/success" element={<AccountCreationSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;