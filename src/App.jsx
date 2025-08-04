import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from "./utils/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Critical components loaded immediately
import NavBar from "./components/common/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const AiSearchPage = lazy(() => import("./pages/AiSearchPage.jsx"));
const Marketplace = lazy(() => import("./pages/Marketplace.jsx"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard.jsx"));
const FractionaXTokenEcosystem = lazy(() => import("./pages/FractionaXTokenEcosystem.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const SignUpLoginPage = lazy(() => import("./pages/SignUpLoginPage.jsx"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const FXCTPreSale = lazy(() => import("./pages/FXCTPreSale.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const Careers = lazy(() => import("./pages/Careers.jsx"));
const AccountCreationSuccess = lazy(() => import("./components/common/AccountCreationSuccess.jsx"));
const TokenTerms = lazy(() => import("./pages/TokenTerms.jsx"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails.jsx"));

// Admin components - lazy loaded for better performance
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome.jsx"));
const UsersPanel = lazy(() => import("./pages/admin/UserPanel.jsx"));
const PropertiesPanel = lazy(() => import("./pages/admin/PropertiesPanel.jsx"));
const TokenAnalytics = lazy(() => import("./pages/admin/TokenAnalytics.jsx"));
const InvestmentHistory = lazy(() => import("./pages/admin/InvestmentHistory.jsx"));
const SubscriptionBilling = lazy(() => import("./pages/admin/SubscriptionBilling.jsx"));
const AuditLog = lazy(() => import("./pages/admin/AuditLog.jsx"));
const AdminBlogEditor = lazy(() => import("./components/admin/AdminBlogEditor.jsx"));
const AdminBlogList = lazy(() => import("./components/admin/AdminBlogList.jsx"));
const EditWrapper = lazy(() => import("./components/admin/EditWrapper.jsx"));

// Phase 1 & Phase 2 Admin Components - lazy loaded
const OptimizedUserAnalyticsDashboard = lazy(() => import("./components/admin/OptimizedUserAnalyticsDashboard.jsx"));
const KycAmlManager = lazy(() => import("./components/admin/KycAmlManager.jsx"));
const SecurityControlsDashboard = lazy(() => import("./components/admin/SecurityControlsDashboard.jsx"));
const CommunicationTools = lazy(() => import("./components/admin/CommunicationTools.jsx"));



function App() {
  return (
    <ErrorBoundary>
      <div className="bg-gray-50 text-gray-900 font-sans">
        <ScrollToTop />
        <NavBar />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ai-search" element={<AiSearchPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/ecosystem" element={<FractionaXTokenEcosystem />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<SignUpLoginPage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/success" element={<AccountCreationSuccess />} />
            <Route path="/pre-sale" element={<FXCTPreSale />} />
            <Route path="/legal/token-terms" element={<TokenTerms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/careers" element={<Careers />} />

        {/* Public blog routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        
        {/* Property details route */}
        <Route path="/property/:id" element={<PropertyDetails />} />

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

          {/* Admin blog management */}
          <Route path="blogs" element={<AdminBlogList />} />
          <Route path="blogs/new" element={<AdminBlogEditor />} />
          <Route path="blogs/edit/:id" element={<EditWrapper />} />

          {/* Phase 1 & Phase 2 Admin Components */}
          <Route path="analytics" element={<OptimizedUserAnalyticsDashboard />} />
          <Route path="kyc" element={<KycAmlManager />} />
          <Route path="security" element={<SecurityControlsDashboard />} />
          <Route path="communications" element={<CommunicationTools />} />

        </Route>
        
        {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
