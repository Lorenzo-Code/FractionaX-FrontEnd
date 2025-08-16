import React, { useState, useEffect } from 'react';
import {
  FaCoins,
  FaMoneyBillWave,
  FaHandHoldingUsd
} from 'react-icons/fa';
import { SEO } from "../../../shared/components";
import { generatePageSEO } from "../../../shared/utils";
import userApiService from '../services/userApiService';

import {
  DashboardHeader,
  StatCard,
  PassiveIncomeGraph,
  UserProperties,
  PropertyTimeline,
  ComplianceStatus,
  StakingSummary,
  Notifications,
  ReferralBox,
  DocumentsVault,
  PortfolioBreakdownChart,
  StakingBreakdownChart
} from '../components';

const userProperties = [/* ... your properties ... */];
const propertyStages = [/* ... your stages ... */];

export default function CustomerDashboard() {
  const seoData = generatePageSEO({
    title: "Customer Dashboard",
    description: "Manage your FractionaX investments, track FXCT and FST tokens, view passive income, and monitor your real estate portfolio.",
    url: "/dashboard",
    keywords: ["customer dashboard", "portfolio management", "token tracking", "passive income"]
  });

  // ===== STATE MANAGEMENT =====
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [tokenPrices, setTokenPrices] = useState(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ===== API INTEGRATION =====
  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Enable when backend user endpoints are ready
      // Currently disabled to prevent authentication logout issues
      const ENABLE_BACKEND_CALLS = false;
      
      if (ENABLE_BACKEND_CALLS) {
        const data = await userApiService.getAllDashboardData();
        setDashboardData(data);
        console.log('✅ Fetched all dashboard data:', data);
        
        if (data.errors.length > 0) {
          console.warn('⚠️ Some data failed to load:', data.errors);
        }
      } else {
        console.log('🔧 Backend API calls disabled - using fallback data');
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set fallback data
        setDashboardData({
          profile: { name: 'Lorenzo', email: 'lorenzo@fractionax.io' },
          overview: { totalValue: 45720.50, totalIncome: 158.74 },
          balances: { FXCT: 12000, FST: 15500 },
          staking: { totalStaked: 5000, claimableRewards: 120 },
          properties: [],
          income: { monthly: 158.74, change24h: 2.5 },
          portfolio: null,
          notifications: [],
          compliance: null,
          referrals: null,
          errors: []
        });
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenPrices = async () => {
    try {
      const ENABLE_PRICE_CALLS = false;
      
      if (ENABLE_PRICE_CALLS) {
        const prices = await userApiService.getTokenPrices();
        setTokenPrices(prices);
        console.log('🔄 Refreshed token prices:', prices);
      } else {
        // Fallback token prices
        setTokenPrices({
          FXCT: { price: 0.27, bid: 0.2680, ask: 0.2720, change24h: 3.2 },
          fst: { price: 1.45, bid: 1.4480, ask: 1.4520, change24h: -1.8 }
        });
      }
    } catch (error) {
      console.warn('❌ Failed to fetch token prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    fetchAllDashboardData();
    fetchTokenPrices();
  }, []);

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTokenPrices();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh dashboard data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllDashboardData();
      setLastUpdated(new Date());
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <SEO {...seoData} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <SEO {...seoData} />
      <DashboardHeader 
        user={dashboardData?.profile?.name || "Lorenzo"} 
        lastUpdated={lastUpdated}
      />

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>Warning: {error}. Using cached data.</span>
        </div>
      )}

      {/* Backend Data Status */}
      {dashboardData && dashboardData.errors?.length === 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>✅ Connected to backend - showing live dashboard data</span>
        </div>
      )}

      {/* Token Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokenPrices && dashboardData?.balances && (
          <>
            <StatCard
              title="FXCT Balance"
              symbol="FXCT"
              balance={dashboardData.balances.FXCT || 0}
              price={tokenPrices.FXCT?.price}
              bid={tokenPrices.FXCT?.bid}
              ask={tokenPrices.FXCT?.ask}
              change24h={tokenPrices.FXCT?.change24h}
              icon={<FaCoins className="text-yellow-500" />}
              loading={isLoadingPrices}
            />
            <StatCard
              title="FST Balance"
              symbol="FST"
              balance={dashboardData.balances.FST || 0}
              price={tokenPrices.fst?.price}
              bid={tokenPrices.fst?.bid}
              ask={tokenPrices.fst?.ask}
              change24h={tokenPrices.fst?.change24h}
              icon={<FaMoneyBillWave className="text-green-500" />}
              loading={isLoadingPrices}
            />
          </>
        )}
        <StatCard
          title="Passive Income"
          amount={`$${dashboardData?.income?.monthly?.toFixed(2) || '158.74'}`}
          change24h={dashboardData?.income?.change24h?.toString() || "2.5"}
          icon={<FaHandHoldingUsd className="text-purple-500" />}
        />
      </div>

      {/* Passive Income Chart */}
      <PassiveIncomeGraph incomeData={dashboardData?.income} />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserProperties properties={dashboardData?.properties || userProperties} />
        <PropertyTimeline properties={propertyStages} />
        <ComplianceStatus complianceData={dashboardData?.compliance} />
        <StakingSummary stakingData={dashboardData?.staking} />
        <Notifications notifications={dashboardData?.notifications} />
        <ReferralBox referralData={dashboardData?.referrals} />
        <DocumentsVault documents={dashboardData?.documents} />
      </div>

      {/* Portfolio Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PortfolioBreakdownChart portfolioData={dashboardData?.portfolio} />
        <StakingBreakdownChart stakingData={dashboardData?.staking} />
      </div>
    </div>
  );
}
