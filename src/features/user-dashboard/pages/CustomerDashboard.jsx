import React, { useState, useEffect } from 'react';
import {
  FaCoins,
  FaMoneyBillWave,
  FaHandHoldingUsd
} from 'react-icons/fa';
import { SEO } from "../../../shared/components";
import { generatePageSEO } from "../../../shared/utils";

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

  const [tokenData, setTokenData] = useState(null);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const FXCTBalance = 12000;
  const fstBalance = 15500;

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    let isActive = true; // Prevent state updates if component unmounts

    const fetchPrices = async () => {
      if (!isActive) return;
      
      try {
        setTokenError(null);
        const response = await fetch(`${API_URL}/api/token-prices`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isActive) {
          setTokenData(data);
          console.log('🔄 Refreshed token data:', data);
        }
      } catch (err) {
        if (isActive) {
          console.error('❌ Error refreshing token data', err);
          setTokenError(err.message);
        }
      } finally {
        if (isActive) {
          setIsLoadingTokens(false);
        }
      }
    };

    fetchPrices(); // fetch once on mount
    const interval = setInterval(fetchPrices, 10000); // refresh every 10 sec
    
    return () => {
      isActive = false; // Prevent state updates after unmount
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <SEO {...seoData} />
      <DashboardHeader user="Lorenzo" />

      {/* Token Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokenData && (
          <>
            <StatCard
              title="FXCT Price"
              symbol="FXCT"
              balance={FXCTBalance}
              price={tokenData.FXCT.price}
              bid={tokenData.FXCT.bid}
              ask={tokenData.FXCT.ask}
              change24h={tokenData.FXCT.change24h}
              icon={<FaCoins className="text-yellow-500" />}
              loading={isLoadingTokens}
            />
            <StatCard
              title="FST Price"
              symbol="FST"
              balance={fstBalance}
              price={tokenData.fst.price}
              bid={tokenData.fst.bid}
              ask={tokenData.fst.ask}
              change24h={tokenData.fst.change24h}
              icon={<FaMoneyBillWave className="text-green-500" />}
              loading={isLoadingTokens}
            />
          </>
        )}
        <StatCard
          title="Passive Income"
          amount="$158.74"
          change24h="2.5"
          icon={<FaHandHoldingUsd className="text-purple-500" />}
        />
      </div>

      {/* Passive Income Chart */}
      <PassiveIncomeGraph />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserProperties properties={userProperties} />
        <PropertyTimeline properties={propertyStages} />
        <ComplianceStatus />
        <StakingSummary />
        <Notifications />
        <ReferralBox />
        <DocumentsVault />
      </div>

      {/* Portfolio Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PortfolioBreakdownChart />
        <StakingBreakdownChart />
      </div>
    </div>
  );
}
