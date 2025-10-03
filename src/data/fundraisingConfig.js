// FractionaX Fundraising Configuration
// Update this file as you raise funds across all platforms
// This serves as your single source of truth for fundraising progress
//
// TODO: Backend Integration
// Replace static data with API calls to your backend:
// - GET /api/fundraising/progress
// - POST /api/fundraising/update
// - GET /api/fundraising/platforms

export const fundraisingConfig = {
  // Campaign Details
  targetAmount: 500000, // $500K Seed round target
  currentAmount: 0, // UPDATE THIS: Current amount raised across all platforms
  campaignStartDate: '2024-01-15', // Campaign start date
  campaignEndDate: '2025-06-15', // Campaign end date (18 months)
  
  // Investment Limits
  minimumInvestment: 5000, // $5,000 minimum investment
  maximumInvestment: 50000, // $50,000 maximum for non-accredited (Reg D)
  accreditedMaximum: 100000, // $100K maximum for accredited investors
  
  // Progress Metrics
  investorCount: 0, // UPDATE THIS: Total number of investors across all platforms
  averageInvestment: 0, // Calculated: currentAmount / investorCount
  
  // SAFE Terms (consistent across all platforms)
  safeTerms: {
    valuationCap: 6000000, // $6M valuation cap
    discountRate: 20, // 20% discount rate
    type: 'Y Combinator Post-Money SAFE', // YC Post-Money SAFE
    proRataRights: true,
    mostFavoredNation: true,
    conversionTrigger: 1000000, // $1M+ qualified financing round (Series A)
    regulation: 'Regulation D', // For accredited investors
    tokenAllocation: true, // Optional FXCT Token Allocation via Side Letter
  },
  
  // Platform Distribution (for internal tracking)
  platformBreakdown: {
    republic: {
      amount: 0,
      investors: 0,
      active: false // Not yet launched
    },
    seedinvest: {
      amount: 0,
      investors: 0,
      active: false // Not yet launched
    },
    startengine: {
      amount: 0,
      investors: 0,
      active: false // Not yet launched
    },
    wefunder: {
      amount: 0,
      investors: 0,
      active: false // Not yet launched
    },
    netcapital: {
      amount: 0,
      investors: 0,
      active: false // Not yet launched
    },
    equitynet: {
      amount: 0,
      investors: 0,
      active: false // Not yet launched
    }
  },
  
  // Update History (for tracking changes)
  lastUpdated: new Date().toISOString().split('T')[0],
  updateHistory: [
    {
      date: '2025-10-03',
      amount: 0,
      investors: 0,
      note: 'Seed round initialized - ready for backend integration'
    }
    // Add new entries here when you update the amounts
  ],
  
  // Milestones
  milestones: [
    {
      amount: 100000,
      title: '20% Funded',
      description: 'MVP development and compliance setup',
      achieved: false
    },
    {
      amount: 250000,
      title: '50% Funded',
      description: 'AI search integration and beta launch',
      achieved: false
    },
    {
      amount: 400000,
      title: '80% Funded',
      description: 'Key hires and marketing push',
      achieved: false
    },
    {
      amount: 500000,
      title: 'Fully Funded',
      description: 'Seed round complete - Series A preparation',
      achieved: false
    }
  ]
};

// Utility functions
export const calculateProgress = () => {
  return (fundraisingConfig.currentAmount / fundraisingConfig.targetAmount) * 100;
};

export const calculateDaysLeft = () => {
  const endDate = new Date(fundraisingConfig.campaignEndDate);
  const today = new Date();
  const timeDiff = endDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(0, daysLeft);
};

export const getNextMilestone = () => {
  return fundraisingConfig.milestones.find(milestone => 
    !milestone.achieved && milestone.amount > fundraisingConfig.currentAmount
  );
};

export const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
};

// Backend Integration Functions (TODO)
// Uncomment and implement when backend is ready:

/*
export const fetchFundraisingData = async () => {
  try {
    const response = await fetch('/api/fundraising/progress');
    const data = await response.json();
    return {
      ...fundraisingConfig,
      currentAmount: data.currentAmount,
      investorCount: data.investorCount,
      platformBreakdown: data.platformBreakdown,
      lastUpdated: data.lastUpdated
    };
  } catch (error) {
    console.error('Failed to fetch fundraising data:', error);
    return fundraisingConfig; // Fallback to static data
  }
};

export const updateFundraisingProgress = async (newAmount, newInvestorCount, note) => {
  try {
    const response = await fetch('/api/fundraising/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentAmount: newAmount,
        investorCount: newInvestorCount,
        updateNote: note,
        timestamp: new Date().toISOString()
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to update fundraising progress:', error);
    throw error;
  }
};
*/

// Instructions for updating:
/*
TO UPDATE FUNDRAISING PROGRESS:

1. Update `currentAmount` with the total raised across all platforms
2. Update `investorCount` with the total number of investors
3. Update `platformBreakdown` to reflect amounts from each platform
4. Add an entry to `updateHistory` with the date and new amounts
5. Update `lastUpdated` to today's date
6. Mark milestones as `achieved: true` when reached

Example update:
fundraisingConfig.currentAmount = 1250000; // $1.25M raised
fundraisingConfig.investorCount = 68; // 68 total investors
fundraisingConfig.lastUpdated = '2024-04-01';

The page will automatically calculate:
- Progress percentage
- Days remaining
- Next milestone
- Average investment amount
*/