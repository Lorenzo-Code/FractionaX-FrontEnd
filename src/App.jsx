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
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import UsersPanel from "./pages/admin/UserPanel.jsx";
import PropertiesPanel from "./pages/admin/PropertiesPanel.jsx";
import TokenAnalytics from "./pages/admin/TokenAnalytics.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import InvestmentHistory from "./pages/admin/InvestmentHistory";
import SubscriptionBilling from "./pages/admin/SubscriptionBilling";
import AuditLog from "./pages/admin/AuditLog.jsx";



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

          {/* 🔒 Protected: User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="user">
            <CustomerDashboard />
          </ProtectedRoute>
          }
          />
          <Route path="/ecosystem" element={<FractionaXTokenEcosystem />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<SignUpLoginPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/success" element={<AccountCreationSuccess />} />

          {/* 🔒 Protected: Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin">
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
    </>
  );
}

export default App;