import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from "./shared/utils";
import { ErrorBoundary, NavBar } from "./shared/components";
import { ProtectedRoute } from "./features/auth/components";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load pages for better performance
const Home = lazy(() => import("./features/marketing/pages/Home"));
const AiSearchPage = lazy(() => import("./features/ai-search/pages/AiSearchPage.jsx"));
const Marketplace = lazy(() => import("./features/marketplace/pages/Marketplace.jsx"));
const CustomerDashboard = lazy(() => import("./features/user-dashboard/pages/CustomerDashboard.jsx"));
const FractionaXTokenEcosystem = lazy(() => import("./features/marketing/pages/FractionaXTokenEcosystem.jsx"));
const SignUpLoginPage = lazy(() => import("./features/auth/pages/SignUpLoginPage.jsx"));
const FXCTPreSale = lazy(() => import("./features/marketing/pages/FXCTPreSale.jsx"));
const AccountCreationSuccess = lazy(() => import("./features/auth/components/AccountCreationSuccess.jsx"));
const PropertyDetails = lazy(() => import("./features/marketplace/pages/PropertyDetails.jsx"));

// Admin components - lazy loaded for better performance
const AdminLayout = lazy(() => import("./features/admin/pages/AdminLayout.jsx"));
const AdminHome = lazy(() => import("./features/admin/pages/AdminHome.jsx"));
const UsersPanel = lazy(() => import("./features/admin/pages/UserPanel.jsx"));
const PropertiesPanel = lazy(() => import("./features/admin/pages/PropertiesPanel.jsx"));
const TokenAnalytics = lazy(() => import("./features/admin/pages/TokenAnalytics.jsx"));
const InvestmentHistory = lazy(() => import("./features/admin/pages/InvestmentHistory.jsx"));
const SubscriptionBilling = lazy(() => import("./features/admin/pages/SubscriptionBilling.jsx"));
const AuditLog = lazy(() => import("./features/admin/pages/AuditLog.jsx"));
const AdminBlogEditor = lazy(() => import("./features/admin/components/AdminBlogEditor.jsx"));
const AdminBlogList = lazy(() => import("./features/admin/components/AdminBlogList.jsx"));
const EditWrapper = lazy(() => import("./features/admin/components/EditWrapper.jsx"));

// Phase 1 & Phase 2 Admin Components - lazy loaded
const OptimizedUserAnalyticsDashboard = lazy(() => import("./features/admin/components/OptimizedUserAnalyticsDashboard.jsx"));
const KycAmlManager = lazy(() => import("./features/admin/components/KycAmlManager.jsx"));
const SecurityControlsDashboard = lazy(() => import("./features/admin/components/SecurityControlsDashboard.jsx"));
const CommunicationTools = lazy(() => import("./features/admin/components/CommunicationTools.jsx"));
const AdminProtocolPage = lazy(() => import("./features/admin/pages/AdminProtocolPage.jsx"));



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
            <Route path="/login" element={<SignUpLoginPage />} />
            <Route path="/success" element={<AccountCreationSuccess />} />
            <Route path="/pre-sale" element={<FXCTPreSale />} />
        
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

          {/* Protocol Management */}
          <Route path="protocols" element={<AdminProtocolPage />} />

          {/* Phase 1 & Phase 2 Admin Components */}
          <Route path="analytics" element={<OptimizedUserAnalyticsDashboard />} />
          <Route path="kyc" element={<KycAmlManager />} />
          <Route path="security" element={<SecurityControlsDashboard />} />
          <Route path="communications" element={<CommunicationTools />} />

        </Route>
        
        {/* Catch-all route for 404 errors - redirect to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
