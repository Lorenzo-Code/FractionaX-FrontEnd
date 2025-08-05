import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import {
  DashboardHeader,
  ProtocolCard,
  AnalyticsCharts,
  KeyMetricsGrid,
  DataTables
} from '../components';

const AdminProtocolPage = () => {
  const [protocols, setProtocols] = useState([
    // Low-Risk Options (Conservative Yields, Minimal Volatility)
    {
      name: "Lido (Liquid Staking for ETH)",
      description: "Users stake ETH to earn network rewards while keeping liquidity via stETH tokens. Treasury deploys ETH here for passive validator yields.",
      apyRange: "~3-5%",
      blockchains: "Ethereum, Layer-2s like Polygon",
      uniqueFeatures: "Liquid staking—no lock-ups beyond unbonding; audited by top firms.",
      whyUnmatched: "Competitors lack ETH exposure; your AI could suggest 'Stake here for stable 4% + FXST rental boosts, projecting 10% total for low-risk portfolios.'",
      risks: "Low (minimal slashing, high TVL ~$30B); mitigated by insurance options.",
      category: "Low-Risk",
      enabled: true,
      highlighted: false,
      apiPercentage: 4
    },
    {
      name: "Curve Finance (Stablecoin Liquidity Pools)",
      description: "Provides liquidity for stablecoin swaps (e.g., USDC/USDT), earning trading fees with low impermanent loss.",
      apyRange: "~4-10%",
      blockchains: "Ethereum, Optimism, Arbitrum",
      uniqueFeatures: "Reduces slippage for stable assets; integrates with veCRV for boosted yields.",
      whyUnmatched: "Ties stable yields to your global real estate expansion (e.g., AI-optimized for 'low-volatility deals under $500 entry').",
      risks: "Low (pegged assets); focus on audited pools.",
      category: "Low-Risk",
      enabled: true,
      highlighted: true,
      apiPercentage: 6
    },
    
    // Medium-Risk Options (Balanced Yields, Some Volatility)
    {
      name: "Aave (Lending Protocol)",
      description: "Lend treasury ETH/stablecoins to borrowers; earn interest adjusted by supply/demand.",
      apyRange: "~2-15%",
      blockchains: "14+ including Ethereum, Avalanche",
      uniqueFeatures: "Safety Module staking for extra rewards (~5-7% on AAVE); $50M annual buyback program boosts ecosystem.",
      whyUnmatched: "Flash loan integration allows AI to simulate 'instant arbitrage' tied to FXST deals, outpacing static fractional platforms.",
      risks: "Medium (utilization fluctuations, past exploits mitigated by audits); overcollateralization protects.",
      category: "Medium-Risk",
      enabled: true,
      highlighted: false,
      apiPercentage: 8
    },
    {
      name: "Frax Finance (Stablecoin Staking & Lending)",
      description: "Stake in FRAX/frxETH pools for yields from overcollateralized loans and AMM.",
      apyRange: "~5-12%",
      blockchains: "Ethereum, Fraxchain",
      uniqueFeatures: "Issues stablecoins like frxETH for ETH staking without nodes; permissionless lending.",
      whyUnmatched: "Enables 'stablecoin fractionalization' (e.g., AI suggests pairing with FXST for crypto-payout properties, projecting 15% yields).",
      risks: "Medium (ETH exposure); strong audits and TVL ~$5B.",
      category: "Medium-Risk",
      enabled: false,
      highlighted: false,
      apiPercentage: 10
    },
    {
      name: "Yearn.Finance (Yield Optimizer)",
      description: "Automates shifting treasury funds across protocols (e.g., Aave, Compound) for max returns.",
      apyRange: "~5-15%",
      blockchains: "Ethereum, Fantom",
      uniqueFeatures: "Vaults for passive optimization; modular strategies for layering yields.",
      whyUnmatched: "Your AI enhances Yearn's automation with personalized FXST integrations (e.g., 'Optimize for 12% APY on properties <3 miles from police stations').",
      risks: "Medium (relies on underlying protocols); audited extensively.",
      category: "Medium-Risk",
      enabled: true,
      highlighted: true,
      apiPercentage: 12
    },
    
    // High-Risk Options (Aggressive Yields, Higher Volatility)
    {
      name: "EigenLayer (Restaking Protocol)",
      description: "Restake LSTs (e.g., stETH) to secure other networks, earning layered rewards.",
      apyRange: "~10-20%+",
      blockchains: "Ethereum",
      uniqueFeatures: "Multi-layer staking; high TVL ~$15B post-2025 expansions.",
      whyUnmatched: "Offers 'restaked fractions'—AI predicts 18%+ yields for high-growth FXST assets like tokenized art.",
      risks: "High (slashing from multiple validations); use caps and warnings.",
      category: "High-Risk",
      enabled: false,
      highlighted: false,
      apiPercentage: 15
    },
    {
      name: "Ethena (Synthetic Dollar Staking)",
      description: "Stake USDe for sUSDe, yielding from delta-hedging and ETH funding rates.",
      apyRange: "~15%+",
      blockchains: "Ethereum, Solana integrations",
      uniqueFeatures: "Pegged synthetics for high yields without direct asset sales.",
      whyUnmatched: "Synths tie to your omni-asset engine (e.g., AI for 'synthetic property fractions with 20% est. APY').",
      risks: "High (hedging failures); monitor with AI alerts.",
      category: "High-Risk",
      enabled: false,
      highlighted: false,
      apiPercentage: 18
    },
    {
      name: "Synthetix (Synthetic Asset Lending)",
      description: "Mint/lend synthetics (e.g., sUSD) against collateral for derivatives exposure.",
      apyRange: "~8-18%",
      blockchains: "Ethereum, Optimism",
      uniqueFeatures: "Perpetual futures and modular debt pools.",
      whyUnmatched: "Enables 'fractional synthetics' for exotic assets (e.g., AI-optimized for worldwide deals, projecting 15% yields).",
      risks: "High (leverage volatility); overcollateralization helps.",
      category: "High-Risk",
      enabled: false,
      highlighted: false,
      apiPercentage: 14
    }
  ]);

  const toggleEnabled = (index) => {
    const updatedProtocols = [...protocols];
    updatedProtocols[index].enabled = !updatedProtocols[index].enabled;
    setProtocols(updatedProtocols);
    setProtocolsLastUpdated(new Date()); // Update timestamp when protocols change
  };

  const toggleHighlighted = (index) => {
    const updatedProtocols = [...protocols];
    updatedProtocols[index].highlighted = !updatedProtocols[index].highlighted;
    setProtocols(updatedProtocols);
    setProtocolsLastUpdated(new Date()); // Update timestamp when protocols change
  };

  const handleApiChange = (index, value) => {
    const updatedProtocols = [...protocols];
    updatedProtocols[index].apiPercentage = value;
    setProtocols(updatedProtocols);
    setProtocolsLastUpdated(new Date()); // Update timestamp when protocols change
  };

  // Time range filter state
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [protocolsLastUpdated, setProtocolsLastUpdated] = useState(new Date());
  const [protocolInfoLastUpdated, setProtocolInfoLastUpdated] = useState(new Date());
  const [isUpdatingProtocolInfo, setIsUpdatingProtocolInfo] = useState(false);

  // Time range options
  const timeRangeOptions = [
    { value: '1d', label: 'Today', days: 1 },
    { value: '7d', label: '7 Days', days: 7 },
    { value: '14d', label: '2 Weeks', days: 14 },
    { value: '30d', label: '1 Month', days: 30 },
    { value: '90d', label: '3 Months', days: 90 },
    { value: '180d', label: '6 Months', days: 180 },
    { value: '365d', label: '1 Year', days: 365 }
  ];

  // Generate time series data based on selected range
  const generateTimeSeriesData = (days) => {
    const data = [];
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
    
    // Base values for realistic progression
    const baseStaked = 10000000;
    const baseWallets = 15000;
    const baseCommission = 600000;
    
    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const progress = i / days;
      
      // Simulate realistic growth with some variance
      const growthFactor = 1 + (progress * 0.5) + (Math.sin(i * 0.1) * 0.05);
      const variance = 0.95 + (Math.random() * 0.1);
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        totalStaked: Math.round(baseStaked * growthFactor * variance),
        wallets: Math.round(baseWallets * growthFactor * variance),
        commission: Math.round(baseCommission * growthFactor * variance)
      });
    }
    
    return data;
  };

  // Mock analytics data - in production, this would come from your backend/blockchain
  const [analyticsData, setAnalyticsData] = useState(() => {
    const totalFXCTStaked = 15420000;
    const lockPeriods = {
      "30 days": { amount: 2840000, percentage: 18.4, wallets: 4820 },
      "90 days": { amount: 4520000, percentage: 29.3, wallets: 7140 },
      "180 days": { amount: 3980000, percentage: 25.8, wallets: 6280 },
      "365 days": { amount: 2450000, percentage: 15.9, wallets: 3890 },
      "Flexible": { amount: 1630000, percentage: 10.6, wallets: 2717 }
    };
    
    const totalLockedDays = Object.entries(lockPeriods).reduce((acc, [period, data]) => {
      const days = parseInt(period) || 0;
      return acc + (data.amount * days);
    }, 0);
    
    const totalAmountForAvg = Object.entries(lockPeriods).reduce((acc, [period, data]) => {
      const days = parseInt(period) || 0;
      return days > 0 ? acc + data.amount : acc;
    }, 0);

    return {
      totalConnectedWallets: 24847,
      totalFXCTStaked,
      totalValueLocked: 89650000,
      avgLockPeriod: Math.round(totalLockedDays / totalFXCTStaked),
      netFlow: {
        daily: 150000, // Positive net inflow
        weekly: -50000, // Negative net outflow
        monthly: 850000
      },
      unlockingSchedule: {
        next24h: 75000,
        next7d: 450000,
        next30d: 1800000,
        detailed: {
          today: { tokens: 25000, usdValue: 125000 },
          tomorrow: { tokens: 50000, usdValue: 250000 },
          next3days: { tokens: 125000, usdValue: 625000 },
          nextWeek: { tokens: 325000, usdValue: 1625000 },
          next2weeks: { tokens: 675000, usdValue: 3375000 },
          nextMonth: { tokens: 1125000, usdValue: 5625000 }
        },
        byLockPeriod: {
          "30 days": { tokensUnlocking: 284000, usdValue: 1420000, walletsAffected: 482 },
          "90 days": { tokensUnlocking: 150667, usdValue: 753335, walletsAffected: 238 },
          "180 days": { tokensUnlocking: 66167, usdValue: 330835, walletsAffected: 105 },
          "365 days": { tokensUnlocking: 20274, usdValue: 101370, walletsAffected: 32 }
        }
      },
      protocolMetrics: {
        "Lido (Liquid Staking for ETH)": { connectedWallets: 8420, fxctStaked: 5200000, tvl: 32500000, apr: 4.2, commissionEarned: 208000, volume24h: 2100000, netFlow24h: 80000, newWallets7d: 520 },
        "Curve Finance (Stablecoin Liquidity Pools)": { connectedWallets: 6840, fxctStaked: 4100000, tvl: 25800000, apr: 7.8, commissionEarned: 246000, volume24h: 1850000, netFlow24h: 65000, newWallets7d: 410 },
        "Aave (Lending Protocol)": { connectedWallets: 5220, fxctStaked: 3300000, tvl: 18900000, apr: 9.1, commissionEarned: 264000, volume24h: 1420000, netFlow24h: 40000, newWallets7d: 350 },
        "Yearn.Finance (Yield Optimizer)": { connectedWallets: 2890, fxctStaked: 2100000, tvl: 12400000, apr: 11.5, commissionEarned: 252000, volume24h: 980000, netFlow24h: -15000, newWallets7d: 180 },
        "Frax Finance (Stablecoin Staking & Lending)": { connectedWallets: 0, fxctStaked: 0, tvl: 0, apr: 0, commissionEarned: 0, volume24h: 0, netFlow24h: 0, newWallets7d: 0 },
        "EigenLayer (Restaking Protocol)": { connectedWallets: 0, fxctStaked: 0, tvl: 0, apr: 0, commissionEarned: 0, volume24h: 0, netFlow24h: 0, newWallets7d: 0 },
        "Ethena (Synthetic Dollar Staking)": { connectedWallets: 0, fxctStaked: 0, tvl: 0, apr: 0, commissionEarned: 0, volume24h: 0, netFlow24h: 0, newWallets7d: 0 },
        "Synthetix (Synthetic Asset Lending)": { connectedWallets: 0, fxctStaked: 0, tvl: 0, apr: 0, commissionEarned: 0, volume24h: 0, netFlow24h: 0, newWallets7d: 0 }
      },
      lockPeriods,
      timeSeriesData: [
        { date: '2025-01-01', totalStaked: 12500000, wallets: 18420, commission: 850000 },
        { date: '2025-01-15', totalStaked: 13200000, wallets: 19840, commission: 920000 },
        { date: '2025-02-01', totalStaked: 14100000, wallets: 21250, commission: 1020000 },
        { date: '2025-02-15', totalStaked: 14800000, wallets: 22680, commission: 1140000 },
        { date: '2025-03-01', totalStaked: 15420000, wallets: 24847, commission: 1280000 }
      ]
    };
  });

  // Chart colors
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#6B7280'];

  // Prepare data for charts
  const protocolChartData = protocols.map((protocol, index) => ({
    name: protocol.name.split(' ')[0],
    wallets: analyticsData.protocolMetrics[protocol.name]?.connectedWallets || 0,
    staked: analyticsData.protocolMetrics[protocol.name]?.fxctStaked || 0,
    tvl: analyticsData.protocolMetrics[protocol.name]?.tvl || 0,
    commission: analyticsData.protocolMetrics[protocol.name]?.commissionEarned || 0,
    enabled: protocol.enabled
  })).filter(p => p.enabled);

  const lockPeriodChartData = Object.entries(analyticsData.lockPeriods).map(([period, data]) => ({
    name: period,
    amount: data.amount,
    percentage: data.percentage,
    wallets: data.wallets
  }));

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatCurrency = (num) => {
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(1) + 'K';
    return '$' + num.toLocaleString();
  };

  // Group protocols by category
  const groupedProtocols = protocols.reduce((acc, protocol, index) => {
    if (!acc[protocol.category]) {
      acc[protocol.category] = [];
    }
    acc[protocol.category].push({ ...protocol, originalIndex: index });
    return acc;
  }, {});

  const getRiskColor = (category) => {
    switch (category) {
      case 'Low-Risk': return 'border-green-200 bg-green-50';
      case 'Medium-Risk': return 'border-yellow-200 bg-yellow-50';
      case 'High-Risk': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Low-Risk': return '🛡️';
      case 'Medium-Risk': return '⚖️';
      case 'High-Risk': return '🚀';
      default: return '📊';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DeFi Protocol Management</h1>
        <p className="text-gray-600">Configure which protocols are available to users and set commission rates.</p>
      </div>

      <DashboardHeader 
        lastUpdated={lastUpdated}
        protocolsLastUpdated={protocolsLastUpdated}
        protocolInfoLastUpdated={protocolInfoLastUpdated}
        isUpdatingProtocolInfo={isUpdatingProtocolInfo}
        selectedTimeRange={selectedTimeRange}
        timeRangeOptions={timeRangeOptions}
        onRefreshAnalytics={() => {
          setLastUpdated(new Date());
          const selectedOption = timeRangeOptions.find(opt => opt.value === selectedTimeRange);
          if (selectedOption) {
            setAnalyticsData(prev => ({
              ...prev,
              timeSeriesData: generateTimeSeriesData(selectedOption.days)
            }));
          }
        }}
        onUpdateProtocolInfo={() => {
          setIsUpdatingProtocolInfo(true);
          setTimeout(() => {
            setProtocolInfoLastUpdated(new Date());
            setIsUpdatingProtocolInfo(false);
          }, 1500); // Simulate API call
        }}
        onTimeRangeChange={(e) => {
          setSelectedTimeRange(e.target.value);
          const selectedOption = timeRangeOptions.find(opt => opt.value === e.target.value);
          if (selectedOption) {
            setAnalyticsData(prev => ({
              ...prev,
              timeSeriesData: generateTimeSeriesData(selectedOption.days)
            }));
          }
        }}
      />

      {Object.entries(groupedProtocols).map(([category, categoryProtocols]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">{getCategoryIcon(category)}</span>
            {category} Options
            <span className="ml-2 text-sm font-normal text-gray-500">({categoryProtocols.length} protocols)</span>
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryProtocols.map((protocol) => (
              <ProtocolCard 
                key={protocol.originalIndex} 
                protocol={protocol} 
                analyticsData={analyticsData}
                getRiskColor={getRiskColor}
                formatNumber={formatNumber}
                formatCurrency={formatCurrency}
                toggleEnabled={toggleEnabled}
                toggleHighlighted={toggleHighlighted}
                handleApiChange={handleApiChange}
              />
            ))}
          </div>
        </div>
      ))}

      <AnalyticsCharts 
        protocolChartData={protocolChartData}
        lockPeriodChartData={lockPeriodChartData}
        analyticsData={analyticsData}
        formatNumber={formatNumber}
        formatCurrency={formatCurrency}
        COLORS={COLORS}
      />

      {/* Summary Stats */}
      <KeyMetricsGrid
        analyticsData={analyticsData}
        protocolChartData={protocolChartData}
        formatNumber={formatNumber}
        formatCurrency={formatCurrency}
      />

      <DataTables
        analyticsData={analyticsData}
        formatNumber={formatNumber}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default AdminProtocolPage;
