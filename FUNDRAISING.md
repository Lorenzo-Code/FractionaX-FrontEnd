# FractionaX Fundraising Progress System

This system provides a single source of truth for your Series A fundraising progress across all crowdfunding platforms.

## 🎯 Overview

The investor relations page (`/investors`) displays real-time fundraising progress, SAFE investment terms, and key metrics that remain consistent across all platforms including Republic, SeedInvest, StartEngine, Wefunder, NetCapital, and EquityNet.

## 📊 Current Configuration

- **Target Amount**: $500,000 (Seed Round)
- **Current Progress**: $75,000 (15.0%)
- **Investor Count**: 8
- **Investment Range**: $5,000 - $100,000 (accredited investors)
- **SAFE Terms**: $6M cap, 20% discount, YC Post-Money SAFE

## 🔄 How to Update Progress

### Method 1: Quick Update Script (Recommended)
```bash
node scripts/update-fundraising.js [currentAmount] [investorCount] [optionalNote]
```

**Examples:**
```bash
# Update to $1.25M raised with 68 investors
node scripts/update-fundraising.js 1250000 68

# Update with a custom note
node scripts/update-fundraising.js 1250000 68 "Reached 25% funding milestone"
```

### Method 2: Manual Edit
Edit `src/data/fundraisingConfig.js` directly:

1. Update `currentAmount` with total raised across all platforms
2. Update `investorCount` with total number of investors
3. Update `lastUpdated` to today's date
4. Add entry to `updateHistory` array
5. Mark milestones as `achieved: true` when reached

## 🏆 Milestones

- **$100K (20%)**: MVP development and compliance setup
- **$250K (50%)**: AI search integration and beta launch  
- **$400K (80%)**: Key hires and marketing push
- **$500K (100%)**: Seed round complete - Series A preparation

## 🔧 Technical Details

### Files Structure
```
src/
├── data/
│   └── fundraisingConfig.js          # Main configuration file
├── features/marketing/pages/
│   └── InvestorRelations.jsx         # Investor page component
└── scripts/
    └── update-fundraising.js         # Quick update script
```

### Key Components

**Progress Bar**: Automatically calculates percentage and displays visual progress
**Metrics Grid**: Shows raised amount, target, investor count, and days remaining
**SAFE Terms**: Displays consistent investment terms across all platforms
**Milestone Tracker**: Shows next milestone and amount remaining

## 🎨 SAFE Investment Terms

**Consistent across ALL platforms:**

- **Instrument**: Y Combinator Post-Money SAFE
- **Valuation Cap**: $6,000,000
- **Discount Rate**: 20%
- **Minimum Investment**: $5,000
- **Maximum (Accredited)**: $100,000
- **Regulation**: Regulation D (Accredited Investors Only)
- **Pro-Rata Rights**: Included
- **Token Allocation**: Optional FXCT via Side Letter
- **Conversion Trigger**: $1M+ Series A financing

## 📈 Platform Tracking

The system tracks progress from each platform:

- **Republic**: Active
- **SeedInvest**: Active  
- **StartEngine**: Active
- **Wefunder**: Active
- **NetCapital**: Not yet launched
- **EquityNet**: Not yet launched

## 🚀 Benefits

✅ **Single Source of Truth**: All platforms show identical progress and terms
✅ **Real-Time Updates**: Investors see live progress across all platforms
✅ **Professional Presentation**: Builds investor confidence with transparency
✅ **Easy Maintenance**: Simple script updates all progress data
✅ **Milestone Tracking**: Shows progress toward key funding goals
✅ **Compliance**: Ensures consistent terms meet SEC requirements

## 📝 Best Practices

1. **Update Weekly**: Keep progress current to maintain investor interest
2. **Document Updates**: Use descriptive notes in update history
3. **Verify Totals**: Double-check numbers match platform totals
4. **Commit Changes**: Always commit updates to version control
5. **Test Locally**: Verify changes on development site before deploying

## 🎯 Investment Page Features

- **Hero Section**: Compelling investment opportunity presentation
- **Live Progress Bar**: Visual funding progress with key metrics
- **SAFE Terms**: Clear, consistent investment terms
- **Use of Funds**: Transparent allocation of investment
- **Team Information**: Leadership team with open positions
- **Investor Form**: Capture investor interest with platform selection
- **Contact Information**: Direct investor relations contact

## 🔗 URL

**Production**: https://your-domain.com/investors
**Development**: http://localhost:5174/investors

---

**Need Help?** Contact Lorenzo Holmes for questions about the fundraising system or investor relations.