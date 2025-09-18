import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from "./shared/utils";
import { ErrorBoundary, NavBar, Footer } from "./shared/components";
import { ProtectedRoute } from "./features/auth/components";
import AuthContext from "./context/AuthContext";
import { CoreLogicInsightsProvider } from "./context/CoreLogicInsightsContext";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy load pages for better performance
const Home = lazy(() => import("./features/marketing/pages/Home.jsx"));
const InvestmentHomepage = lazy(() => import("./features/marketplace/pages/InvestmentHomepage.jsx"));
const AiSearchPage = lazy(() => import("./features/admin/ai-search/pages/AiSearchPage.jsx"));
const PropertyIntelligenceDemo = lazy(() => import("./features/admin/ai-search/pages/PropertyIntelligenceDemo.jsx"));
const CustomerLayout = lazy(() => import("./features/user-dashboard/layouts/CustomerLayout.jsx"));

// Customer Dashboard Pages
const CustomerHome = lazy(() => import("./features/user-dashboard/pages/CustomerHome.jsx"));
const CustomerInvestments = lazy(() => import("./features/user-dashboard/pages/CustomerInvestments.jsx"));
const CustomerWallet = lazy(() => import("./features/user-dashboard/pages/CustomerWallet.jsx"));
const CustomerProperties = lazy(() => import("./features/user-dashboard/pages/CustomerProperties.jsx"));
const CustomerDocuments = lazy(() => import("./features/user-dashboard/pages/CustomerDocuments.jsx"));
const CustomerSecurity = lazy(() => import("./features/user-dashboard/pages/CustomerSecurity.jsx"));
const CustomerSupport = lazy(() => import("./features/user-dashboard/pages/CustomerSupport.jsx"));
const CustomerTokens = lazy(() => import("./features/user-dashboard/pages/CustomerTokens.jsx"));
const CustomerTrading = lazy(() => import("./features/user-dashboard/pages/CustomerTrading.jsx"));
const CustomerPortfolioAnalytics = lazy(() => import("./features/user-dashboard/pages/CustomerPortfolioAnalytics.jsx"));
const CustomerSettings = lazy(() => import("./features/user-dashboard/pages/CustomerSettings.jsx"));
const CustomerMarketplace = lazy(() => import("./features/user-dashboard/pages/CustomerMarketplace.jsx"));
const CustomerStaking = lazy(() => import("./features/user-dashboard/pages/CustomerStaking.jsx"));
const CustomerCommunications = lazy(() => import("./features/user-dashboard/pages/CustomerCommunications.jsx"));
const Marketplace = lazy(() => import("./features/marketplace/pages/Marketplace.jsx"));
const CustomerDashboard = lazy(() => import("./features/user-dashboard/pages/CustomerDashboard.jsx"));
const FractionaXTokenEcosystem = lazy(() => import("./features/marketing/pages/FractionaXTokenEcosystem.jsx"));
const SignUpLoginPage = lazy(() => import("./features/auth/pages/SignUpLoginPage.jsx"));
const FXCTPreSale = lazy(() => import("./features/marketing/pages/FXCTPreSale.jsx"));
const AccountCreationSuccess = lazy(() => import("./features/auth/components/AccountCreationSuccess.jsx"));
const PropertyDetails = lazy(() => import("./features/marketplace/pages/PropertyDetails.jsx"));
const Blog = lazy(() => import("./features/marketing/pages/Blog.jsx"));
const BlogPost = lazy(() => import("./features/marketing/pages/BlogPost.jsx"));
const FXTokenTerms = lazy(() => import("./features/marketing/pages/FXTokenTerms.jsx"));
const FAQ = lazy(() => import("./features/marketing/pages/FAQ.jsx"));
const HowItWorksPage = lazy(() => import("./features/marketing/pages/HowItWorks.jsx"));
const Contact = lazy(() => import("./features/marketing/pages/Contact.jsx"));
const Careers = lazy(() => import("./features/marketing/pages/Careers.jsx"));
const TermsAndConditions = lazy(() => import("./features/marketing/pages/TermsAndConditions.jsx"));
const PrivacyPolicy = lazy(() => import("./features/marketing/pages/PrivacyPolicy.jsx"));
const InvestmentProtocols = lazy(() => import("./features/marketing/pages/InvestmentProtocols.jsx"));
const SearchResults = lazy(() => import("./features/marketing/pages/SearchResults.jsx"));
const Pricing = lazy(() => import("./features/marketing/pages/Pricing.jsx"));
const NotFoundPage = lazy(() => import("./features/marketing/pages/NotFoundPage.jsx"));

// Admin components - lazy loaded for better performance
const AdminLayout = lazy(() => import("./features/admin/pages/AdminLayout.jsx"));
const AdminHome = lazy(() => import("./features/admin/pages/AdminHome.jsx"));
const UsersPanel = lazy(() => import("./features/admin/pages/UserPanel.jsx"));
const UserProfile = lazy(() => import("./features/admin/pages/UserProfile.jsx"));
const PropertiesPanel = lazy(() => import("./features/admin/pages/PropertiesPanel.jsx"));
const TokenAnalytics = lazy(() => import("./features/admin/pages/TokenAnalytics.jsx"));
const InvestmentHistory = lazy(() => import("./features/admin/pages/InvestmentHistory.jsx"));
const SubscriptionBilling = lazy(() => import("./features/admin/pages/SubscriptionBilling.jsx"));
const AuditLog = lazy(() => import("./features/admin/pages/AuditLog.jsx"));
const UserSettings = lazy(() => import("./features/admin/pages/UserSettings.jsx"));
const AdminBlogEditor = lazy(() => import("./features/admin/components/AdminBlogEditor.jsx"));
const AdminBlogList = lazy(() => import("./features/admin/components/AdminBlogList.jsx"));
const EditWrapper = lazy(() => import("./features/admin/components/EditWrapper.jsx"));

// Phase 1 & Phase 2 Admin Components - lazy loaded
const OptimizedUserAnalyticsDashboard = lazy(() => import("./features/admin/components/OptimizedUserAnalyticsDashboard.jsx"));
const KycAmlManager = lazy(() => import("./features/admin/components/KycAmlManager.jsx"));
const AdvancedSecurityDashboard = lazy(() => import("./features/admin/components/AdvancedSecurityDashboard.jsx"));
const CommunicationTools = lazy(() => import("./features/admin/components/CommunicationTools.jsx"));
const SupportTickets = lazy(() => import("./features/admin/pages/SupportTickets.jsx"));
const AdminProtocolPage = lazy(() => import("./features/admin/pages/AdminProtocolPage.jsx"));
const NetworkAnalyticsPage = lazy(() => import("./features/admin/pages/NetworkAnalyticsPage.jsx"));
const ProviderPriceOverridePage = lazy(() => import("./features/admin/pages/ProviderPriceOverridePage.jsx"));
const PromoCodeManager = lazy(() => import("./features/admin/pages/PromoCodeManager.jsx"));
const HomepageAdmin = lazy(() => import("./features/admin/pages/HomepageAdmin.jsx"));



function App() {
  const { isLoading } = useContext(AuthContext);
  
  // Show loading screen while AuthProvider is initializing
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 transition-opacity duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your experience...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <CoreLogicInsightsProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans animate-fade-in" style={{
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          <ScrollToTop />
        
        {/* Static positioned navbar */}
        <NavBar />

        {/* Content - no top padding needed for static navbar */}
        <div style={{
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/invest" element={<InvestmentHomepage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/ecosystem" element={<FractionaXTokenEcosystem />} />
              <Route path="/login" element={<SignUpLoginPage />} />
              <Route path="/signup" element={<SignUpLoginPage />} />
              <Route path="/success" element={<AccountCreationSuccess />} />
              <Route path="/pre-sale" element={<FXCTPreSale />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/legal/token-terms" element={<FXTokenTerms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/investment-protocols" element={<InvestmentProtocols />} />
              <Route path="/search/results" element={<SearchResults />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/property-intelligence-demo" element={<PropertyIntelligenceDemo />} />

            {/* Public blog routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* Property details route */}
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* Protected: User Dashboard - Accessible by both users and admins */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerHome />} />
              <Route path="marketplace" element={<CustomerMarketplace />} />
              <Route path="investments" element={<CustomerInvestments />} />
              <Route path="analytics" element={<CustomerPortfolioAnalytics />} />
              <Route path="wallet" element={<CustomerWallet />} />
              <Route path="staking" element={<CustomerStaking />} />
              <Route path="trading" element={<CustomerTrading />} />
              <Route path="properties" element={<CustomerProperties />} />
              <Route path="communications" element={<CustomerCommunications />} />
              <Route path="documents" element={<CustomerDocuments />} />
              <Route path="security" element={<CustomerSecurity />} />
              <Route path="settings" element={<CustomerSettings />} />
              <Route path="support" element={<CustomerSupport />} />
            </Route>

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
              <Route path="users/:userId" element={<UserProfile />} />
              <Route path="properties" element={<PropertiesPanel />} />
              <Route path="tokens" element={<TokenAnalytics />} />
              <Route path="investments" element={<InvestmentHistory />} />
              <Route path="billing" element={<SubscriptionBilling />} />
              <Route path="audit" element={<AuditLog />} />
              <Route path="settings" element={<UserSettings />} />

              {/* Admin blog management */}
              <Route path="blogs" element={<AdminBlogList />} />
              <Route path="blogs/new" element={<AdminBlogEditor />} />
              <Route path="blogs/edit/:id" element={<EditWrapper />} />

              {/* Protocol Management */}
              <Route path="protocols" element={<AdminProtocolPage />} />
              
              {/* Homepage Management */}
              <Route path="homepage" element={<HomepageAdmin />} />
              
              {/* Promo Code Management */}
              <Route path="promo-codes" element={<PromoCodeManager />} />

              {/* Phase 1 & Phase 2 Admin Components */}
              <Route path="analytics" element={<OptimizedUserAnalyticsDashboard />} />
              <Route path="kyc" element={<KycAmlManager />} />
              <Route path="security" element={<AdvancedSecurityDashboard />} />
              <Route path="communications" element={<CommunicationTools />} />
              <Route path="support-tickets" element={<SupportTickets />} />
              
              {/* Network Analytics */}
              <Route path="network-analytics" element={<NetworkAnalyticsPage />} />

              {/* Basic Due Diligence (simplified) */}
              <Route path="due-diligence" element={<AiSearchPage />} />
              
              {/* Admin Marketplace */}
              <Route path="marketplace" element={<Marketplace />} />

            </Route>
            
            {/* Catch-all route for 404 errors */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          
          {/* Footer inside scrollable area */}
          <div className="flex-shrink-0">
            <Footer />
          </div>
        </div>
      </div>
      </CoreLogicInsightsProvider>
    </ErrorBoundary>
  );
}

export default App;
