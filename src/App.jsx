import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from "./utils/ScrollToTop.jsx";

// Global Pages
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import FractionaXTokenEcosystem from "./pages/FractionaXTokenEcosystem.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import SignUpLoginPage from "./pages/SignUpLoginPage.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import FXCTPreSale from "./pages/FXCTPreSale.jsx";

// UI Components
import NavBar from "./components/common/NavBar.jsx";
import AccountCreationSuccess from "./components/common/AccountCreationSuccess.jsx";

// Protected Wrapper
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import UsersPanel from "./pages/admin/UserPanel.jsx";
import PropertiesPanel from "./pages/admin/PropertiesPanel.jsx";
import TokenAnalytics from "./pages/admin/TokenAnalytics.jsx";
import InvestmentHistory from "./pages/admin/InvestmentHistory.jsx";
import SubscriptionBilling from "./pages/admin/SubscriptionBilling.jsx";
import AuditLog from "./pages/admin/AuditLog.jsx";
import TokenTerms from "./pages/TokenTerms.jsx";


function App() {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      <ScrollToTop />
      <NavBar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/ecosystem" element={<FractionaXTokenEcosystem />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<SignUpLoginPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/success" element={<AccountCreationSuccess />} />
        <Route path="/pre-sale" element={<FXCTPreSale />} />
        <Route path="/legal/token-terms" element={<TokenTerms />} />

        {/* Protected: User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected: Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UsersPanel />} />
          <Route path="properties" element={<PropertiesPanel />} />
          <Route path="tokens" element={<TokenAnalytics />} />
          <Route path="investments" element={<InvestmentHistory />} />
          <Route path="billing" element={<SubscriptionBilling />} />
          <Route path="audit" element={<AuditLog />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
