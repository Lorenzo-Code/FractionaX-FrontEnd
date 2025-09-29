import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiHeart, FiShare2, FiChevronLeft, FiChevronRight, FiMaximize, FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { TrendingUp, DollarSign, Calendar, MapPin as MapPinIcon, AlertCircle, Star, Loader, X } from 'lucide-react';
import { BsRobot } from 'react-icons/bs';
import { SEO } from '../../../shared/components';
import CoreLogicLoginModal from '../../../shared/components/CoreLogicLoginModal';
import FXCTConfirmationModal from '../../../shared/components/FXCTConfirmationModal';
import useCoreLogicInsights from '../../../shared/hooks/useCoreLogicInsights';
import { useAuth } from '../../../shared/hooks';
import coreLogicService from '../../../services/coreLogicService';
import { smartFetch } from '../../../shared/utils';
import marketplaceService from '../services/marketplaceService';
import PropertyLocationMap from '../components/PropertyLocationMap';

// Generate URL slug from property title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Direct property data lookup - SIMPLIFIED APPROACH
const getPropertyData = (identifier) => {
  console.log(`🔍 Getting property data for identifier: ${identifier}`);
  
  // Direct property data mapping
  const properties = {
    '1': {
      id: 1,
      title: "Premium Clock Tower Car Wash & Detail Center - Georgia",
      slug: "premium-clock-tower-car-wash-georgia",
      clipId: "CL-2024-GA-7852",
      address: "4460 N Henry Blvd, Stockbridge, GA 30281",
      price: 2750000,
      propertyType: "commercial",
      subcategory: "business",
      operationalStatus: "fully_operational",
      images: [
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&h=600&fit=crop&auto=format&q=85",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=85",
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format&q=85",
        "https://images.unsplash.com/photo-1616587894289-86480e533129?w=800&h=600&fit=crop&auto=format&q=85"
      ],
      coordinates: { lat: 33.5434, lng: -84.2335 },
      description: "🏆 Turn-key car wash empire generating $547K+ annually! This flagship Clock Tower Car Wash features 10 automated bays, premium detail center, and prime 2.3-acre corner lot with 35K+ daily traffic count. Newly renovated with state-of-the-art equipment and recession-proof cash flow model.",
      detailedDescription: "**INSTITUTIONAL-GRADE CAR WASH INVESTMENT** - This is the crown jewel of Georgia's car wash industry. Located at one of Henry County's busiest intersections (Henry Blvd & Rock Quarry Rd), this facility serves the rapidly growing Stockbridge market with 35,000+ vehicles passing daily.",
      features: ["automated_express_tunnels", "premium_detail_center", "vacuum_stations", "customer_loyalty_program", "contactless_payments", "corner_lot_visibility", "recession_resistant", "professional_management", "recent_renovation", "seller_financing_available", "high_traffic_location", "growing_market"],
      yearBuilt: 2017,
      yearRenovated: 2024,
      lotSize: 2.3,
      sqft: 9200,
      expectedROI: 15.8,
      capRate: 14.3,
      monthlyRevenue: 45600,
      annualRevenue: 547200,
      netOperatingIncome: 392400,
      taxes: 31200,
      insurance: 15600,
      utilities: 28800,
      maintenance: 42000,
      businessMetrics: {
        washBays: 10,
        detailBays: 6,
        vacuumStations: 16,
        averageTicket: 22.75,
        premiumServiceTicket: 48.50,
        dailyCarCount: 110,
        weekendCarCount: 185,
        monthlyExpenses: 154800,
        employeeCount: 14,
        fullTimeStaff: 8,
        partTimeStaff: 6,
        operatingHours: "6:00 AM - 10:00 PM Daily"
      },
      agent: {
        name: "Marcus Thompson",
        phone: "(770) 555-0245",
        email: "marcus@georgiacommercial.com",
        company: "Georgia Commercial Properties",
        license: "GA-987654",
        yearsExperience: 12,
        specialization: "Car Wash & Service Business Sales"
      }
    },
    '2': {
      id: 2,
      title: "Orca Splash Express Car Wash - Texas Turnkey Operation",
      slug: "orca-splash-express-car-wash-houston",
      clipId: "CL-2024-TX-6298",
      address: "12847 Northwest Freeway, Houston, TX 77040",
      price: 5000000,
      propertyType: "commercial",
      subcategory: "business",
      operationalStatus: "fully_operational",
      images: [
        "/images/properties/orca-splash-express/Main photo(cover photo).jpg",
        "/images/properties/orca-splash-express/Frontside photo.jpg",
        "/images/properties/orca-splash-express/Side View photo.jpg",
        "/images/properties/orca-splash-express/Backside photo.jpg"
      ],
      coordinates: { lat: 29.8419, lng: -95.5617 },
      description: "🌊 ORCA SPLASH EXPRESS CAR WASH - Premier turnkey operation generating $1.2M+ annually! This high-volume express tunnel facility features state-of-the-art equipment, experienced 3rd-party operator, and prime Northwest Freeway location with 42K+ daily traffic count. Recession-proof 8% annual yield with professional management in place.",
      detailedDescription: "**ORCA SPLASH EXPRESS CAR WASH - PROVEN HOUSTON SUCCESS STORY** \n\nThis flagship Orca Splash location represents the pinnacle of modern car wash operations in Houston's competitive market. Located on busy Northwest Freeway with 42,000+ daily vehicles, this facility has built a loyal customer base and consistent cash flow over 8 years of operation.\n\n**OPERATIONAL HIGHLIGHTS**\n• **Fully Operational**: 8+ years of proven performance with detailed financials\n• **Modern Equipment**: 110-foot express tunnel with Belanger Vector systems (upgraded 2022)\n• **Strong Brand Recognition**: Orca Splash is a recognized Houston car wash brand\n• **Professional Management**: Full management team in place - semi-absentee opportunity\n• **Recent Upgrades**: $285K in facility and equipment improvements (2022-2024)",
      features: ["fully_operational", "express_tunnel_wash", "loyal_customer_base", "professional_management", "belanger_equipment", "water_reclaim_system", "turnkey_investment", "houston_location", "monthly_memberships", "recent_upgrades", "high_traffic_location", "seller_financing_available"],
      yearBuilt: 2016,
      yearRenovated: 2022,
      lotSize: 1.65,
      sqft: 3200,
      expectedROI: 10.0,
      capRate: 10.0,
      monthlyRevenue: 100000,
      annualRevenue: 1200000,
      grossRevenue: 1200000,
      operatingExpenses: 700000,
      netOperatingIncome: 500000,
      operatorFee: 60000,
      adjustedNOI: 440000,
      annualDebtService: 320000,
      netCashFlow: 120000,
      cashOnCashReturn: 8.0,
      operationalHistory: "8+ years",
      taxes: 60000,
      insurance: 35000,
      utilities: 85000,
      maintenance: 120000,
      supplies: 180000,
      staffing: 220000,
      businessMetrics: {
        washBays: 1,
        expressTunnels: 1,
        tunnelLength: 110,
        vacuumStations: 18,
        averageTicket: 18.75,
        premiumServiceTicket: 24.99,
        dailyCarCount: 125,
        weekendCarCount: 220,
        monthlyExpenses: 146600,
        employeeCount: 12,
        fullTimeStaff: 8,
        partTimeStaff: 4,
        operatingHours: "6:00 AM - 9:00 PM Daily",
        customerLoyalty: {
          activeMemberships: 6200,
          monthlyMemberRevenue: 154800,
          memberRetentionRate: 87.5
        }
      },
      agent: {
        name: "Michael Rodriguez",
        phone: "(713) 555-0634",
        email: "michael@houstoncarwash.com",
        company: "Houston Commercial Car Wash Specialists",
        license: "TX-742891",
        yearsExperience: 18,
        specialization: "Car Wash Sales & Operations"
      },
      stats: {
        views: 2187,
        saves: 163,
        inquiries: 28,
        virtualTours: 89,
        daysOnMarket: 6,
        priceHistory: [
          { date: "2024-09-20", price: 5000000, event: "Listed", details: "High-volume operational car wash with 3rd-party operator" },
          { date: "2024-08-15", price: 5200000, event: "Pre-listing estimate", details: "Before market adjustment" }
        ]
      },
      neighborhood: {
        name: "Northwest Houston/Willowbrook",
        walkability: 48,
        transitScore: 52,
        bikeScore: 31,
        demographics: {
          medianIncome: 89500,
          populationGrowth: 12.7,
          avgHouseholdSize: 2.6,
          homeOwnership: 73.8,
          avgVehiclesPerHousehold: 2.8
        }
      },
      schools: [
        { name: "Spring Woods High School", rating: 7, distance: 1.4, enrollment: 2156 },
        { name: "Bammel Elementary", rating: 8, distance: 0.9, enrollment: 587 },
        { name: "Northwest Forest Middle School", rating: 7, distance: 1.1, enrollment: 964 }
      ],
      
      // Financing Structure (ChatGPT's 70/30 Model)
      financing: {
        totalAcquisitionCost: 5000000,
        loanToValue: 0.70, // 70% LTV
        debtAmount: 3500000, // $3.5M bank loan
        equityAmount: 1500000, // $1.5M equity raise
        interestRate: 0.065, // 6.5% interest rate
        loanTerm: 20, // 20 years
        annualDebtService: 320000,
        monthlyDebtService: 26667
      },
      
      // Tokenization Structure (FractionaX Model)
      tokenization: {
        totalTokens: 1500, // $1.5M equity ÷ $1,000 per token
        tokenPrice: 1000, // $1,000 per token
        minimumInvestment: 1000, // 1 token minimum
        maximumInvestment: 50000, // 50 tokens maximum per investor
        
        // Cash flow calculations (Based on ChatGPT Analysis)
        grossRevenue: 1200000, // $1.2M annual gross
        operatingExpenses: 700000, // $700K operating expenses
        noi: 500000, // $500K NOI
        operatorFee: 60000, // 5% of gross revenue
        adjustedNOI: 440000, // $500K - $60K operator fee
        annualDebtService: 320000,
        netCashFlowToEquity: 120000, // $440K - $320K debt service
        
        // Per token returns
        annualCashFlowPerToken: 80.0, // $120,000 ÷ 1,500 tokens
        monthlyCashFlowPerToken: 6.67, // $80.0 ÷ 12
        cashOnCashReturn: 8.0, // ($80 / $1000) * 100
        
        // Distribution details
        distributionFrequency: 'monthly',
        firstDistributionDate: '2024-12-01',
        managementFee: 0.03, // 3% annual management fee
        netCashFlowPerToken: 77.6, // After 3% management fee
        netMonthlyCashFlowPerToken: 6.47, // After management fee
        
        // 5-year projection
        projectedHoldPeriod: 5,
        totalDividends: 388.0, // $77.6 × 5 years
        projectedSalePrice: 5000000, // Stable exit assumption
        loanBalanceAtExit: 3300000, // Estimated after 5 years
        netSaleProceeds: 1700000,
        equityReturnPerToken: 1133, // $1.7M ÷ 1,500 tokens
        totalReturnPerToken: 1521, // $388 + $1,133
        fiveYearROI: 52.1, // ($1,521 - $1,000) / $1,000
        projectedIRR: 11.0 // 5-year IRR
      },
      
      // FractionaX Fee Structure
      feeStructure: {
        acquisitionFee: 150000, // 3% of $5M = $150K upfront
        assetManagementFee: 36000, // 3% of gross revenue annually
        performanceFeeRate: 0.05, // 5% of NOI growth
        exitFee: 50000 // 1% of sale price
      },
      
      // Investment Highlights (Updated)
      investmentHighlights: [
        "🎯 10% Cap Rate with experienced 3rd-party operator",
        "💰 8% Annual Cash-on-Cash Return to investors",
        "📈 $1.2M+ annual gross revenue with 8+ years operational history",
        "🏆 High-volume express tunnel with modern equipment",
        "📍 42K+ daily traffic count on Northwest Freeway (US-290)",
        "👥 Professional operator handles daily operations (5% fee)",
        "🔄 Recession-resistant car wash business model",
        "💳 $1,000 minimum investment with monthly distributions",
        "🌱 Northwest Houston growing market (+12.7% population growth)",
        "💼 Turnkey investment - no landlord responsibilities"
      ],
      
      // Financial Projections (5-Year Hold)
      financialProjections: {
        year1: { revenue: 1200000, noi: 440000, cashFlow: 120000, distributionPerToken: 77.6 },
        year2: { revenue: 1236000, noi: 453000, cashFlow: 133000, distributionPerToken: 86.2 },
        year3: { revenue: 1273000, noi: 466000, cashFlow: 146000, distributionPerToken: 94.9 },
        year4: { revenue: 1311000, noi: 480000, cashFlow: 160000, distributionPerToken: 104.0 },
        year5: { revenue: 1350000, noi: 494000, cashFlow: 174000, distributionPerToken: 113.2 },
        assumptions: "3% annual revenue growth, stable operating expense ratio"
      }
    },
    '4': {
      id: 4,
      title: "Houston 97 Unit Apartment Complex",
      slug: "houston-97-unit-apartment-complex",
      clipId: "CL-2024-TX-4897",
      address: "1234 Example St. Houston, TX, 77077",
      price: 10775000,
      rentPrice: 0,
      beds: 97,
      baths: 97,
      sqft: 48960,
      propertyType: "multifamily",
      images: [
        "/images/properties/houston-97-unit/Main photo(cover photo).jpg",
        "/images/properties/houston-97-unit/Side View photo.jpg",
        "/images/properties/houston-97-unit/Interor.jpg",
        "/images/properties/houston-97-unit/Interor 2.jpg",
        "/images/properties/houston-97-unit/interor 3.jpg",
        "/images/properties/houston-97-unit/interor 4.jpg",
        "/images/properties/houston-97-unit/Interor 5.jpg",
        "/images/properties/houston-97-unit/Interor 6.jpg"
      ],
      expectedROI: 6.98, // Updated to realistic cap rate
      monthlyRent: 97000, // Effective gross income at 92% occupancy
      coordinates: { lat: 29.7604, lng: -95.3698 },
      description: "Premier 97-unit multifamily apartment complex in Houston, Texas. This 3-story apartment building offers institutional-grade investment potential with strong NOI of $698,000 annually and 6.98% cap rate. Built in 1961 and fully renovated in 2023, this property represents a perfect blend of classic architecture with modern amenities.",
      detailedDescription: "This exceptional 97-unit apartment building represents a premier investment opportunity in Houston's thriving rental market. The 3-story multifamily complex features 48,960 square feet of quality living space across a single building. Originally constructed in 1961, the property underwent comprehensive renovation in 2023, bringing all systems and amenities to modern standards. The strategic Houston location provides excellent access to major employment centers, shopping, and transportation corridors. With strong fundamentals and proven rental demand, this asset offers excellent cash flow and appreciation potential for sophisticated investors.",
      features: ["recently_renovated_2023", "97_units", "3_stories", "houston_location", "strong_noi", "apartment_building", "multifamily", "cash_flowing", "stable_investment", "houston_growth_market"],
      yearBuilt: 1961,
      yearRenovated: 2023,
      lotSize: "3.2 acres",
      hoa: 0,
      taxes: 129000,
      insurance: 21500,
      agent: {
        name: "Lorenzo Martinez",
        phone: "(713) 555-0897",
        email: "lorenzo@houstonmultifamily.com",
        company: "Houston Investment Properties",
        photo: "/api/placeholder/100/100",
        license: "TX-789012"
      },
      stats: {
        views: 876,
        saves: 156,
        daysOnMarket: 1,
        pricePerSqft: 220,
        priceHistory: [
          { date: "2024-09-25", price: 10775000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Southwest Houston",
        walkability: 65,
        transitScore: 58,
        bikeScore: 52
      },
      schools: [
        { name: "Westbury High School", rating: 7, distance: 0.8 },
        { name: "Piney Point Elementary", rating: 8, distance: 1.2 },
        { name: "Pin Oak Middle School", rating: 7, distance: 1.5 }
      ],
      marketData: {
        daysOnMarket: 1,
        opportunityScore: 85,
        sellerMotivation: 'high',
        estimatedROI: 8.29
      },
      intelligence: {
        walkScore: 65,
        transitScore: 58,
        bikeScore: 52,
        schoolQuality: 'Very Good',
        overallScore: 85
      },
      investmentMetrics: {
        noi: 698000, // ChatGPT's realistic NOI calculation
        vacancy: 8, // 92% occupancy = 8% vacancy
        operatingExpenses: 466000, // 40% of effective gross income
        totalUnits: 97,
        avgRentPerUnit: 1085, // $105,435 ÷ 97 units = $1,085 at 100% occupancy
        pricePerUnit: 111082,
        pricePerSqft: 220,
        buildings: 1,
        stories: 3,
        grossPotentialIncome: 1265220, // $105,435 × 12 (100% occupancy)
        effectiveGrossIncome: 1164000, // $97,000 × 12 (92% occupancy)
        propertySubType: "Apartment Building"
      },
      businessMetrics: {
        propertyUnits: 97,
        averageRent: 1000, // Effective average rent considering vacancy
        monthlyGrossIncome: 97000, // Effective gross income
        annualGrossIncome: 1164000, // $97,000 × 12
        operatingExpenses: 466000, // 40% of effective gross income (industry standard)
        netOperatingIncome: 698000, // $1,164,000 - $466,000
        occupancyRate: 92, // More realistic occupancy rate
        vacancyRate: 8,
        capRate: 6.98, // $698,000 ÷ $10,000,000 (using $10M for cap rate calc)
        grossRentMultiplier: 9.3, // $10,775,000 ÷ $1,164,000
        pricePerUnit: 111082,
        operatingExpenseRatio: 40.0, // 40% is industry standard for multifamily
        propertyManagementFee: 46560 // 4% of collected rent annually
      },
      
      // Financing & Tokenization Structure (Based on ChatGPT Analysis)
      financing: {
        totalAcquisitionCost: 10775000, // Keep at purchase price for simplicity
        loanToValue: 0.70, // 70% LTV
        debtAmount: 7000000, // 70% of $10M (ChatGPT's calculation)
        equityAmount: 3000000, // 30% of $10M (rounded for clean tokenization)
        interestRate: 0.060, // 6.0% interest rate
        loanTerm: 30, // 30 years
        annualDebtService: 503000, // ChatGPT's realistic debt service calculation
        monthlyDebtService: 41917 // $503,000 ÷ 12
      },
      
      tokenization: {
        totalTokens: 3000, // Clean number: $3M equity ÷ $1,000 per token
        tokenPrice: 1000, // $1,000 per token
        minimumInvestment: 1000, // 1 token minimum
        maximumInvestment: 100000, // 100 tokens maximum per investor
        
        // Cash flow calculations (Based on ChatGPT Analysis)
        annualCashFlowAfterDebt: 195000, // NOI - Debt Service = $698,000 - $503,000
        monthlyCashFlowAfterDebt: 16250, // $195,000 ÷ 12
        
        // Per token returns
        annualCashFlowPerToken: 65.0, // $195,000 ÷ 3000 tokens
        monthlyCashFlowPerToken: 5.42, // $65.0 ÷ 12
        equityYield: 6.5, // ($65.0 / $1000) * 100 - ChatGPT's cash-on-cash return
        
        // Distribution details
        distributionFrequency: 'monthly',
        firstDistributionDate: '2024-11-01',
        managementFee: 0.01, // 1% annual management fee (FractionaX keeps spread from 4% property mgmt)
        netCashFlowPerToken: 64.35, // After 1% management fee ($65.0 * 0.99)
        netMonthlyCashFlowPerToken: 5.36, // After management fee ($64.35 ÷ 12)
        
        // Exit scenario (ChatGPT's 5-year projection)
        projectedAppreciation: 1500000, // $1.5M gain over 5 years (property $10M → $11.5M)
        appreciationPerToken: 500, // $1.5M ÷ 3000 tokens
        fiveYearTotalReturnPerToken: 825, // $325 cash flow + $500 appreciation
        projectedAnnualizedReturn: 16.5 // 5-year IRR including appreciation
      },
      
      // Alternative 35% Equity Scenario (for comparison)
      alternativeFinancing: {
        equityPercentage: 0.35, // 35% equity
        loanToValue: 0.65, // 65% LTV
        debtAmount: 7704125, // 65% of $11,852,500
        equityAmount: 4148375, // 35% of $11,852,500
        totalTokens: 4149, // Rounded up
        annualDebtService: 554262, // Lower debt service
        annualCashFlowAfterDebt: 339040, // $893,302 - $554,262
        annualCashFlowPerToken: 81.7, // $339,040 / 4149 tokens
        equityYield: 8.17, // Similar yield but lower risk profile
        netMonthlyCashFlowPerToken: 6.64 // After 2% management fee
      }
    },
    '8': {
      id: 8,
      title: "Brookside Land Development - Prime Commercial Site",
      slug: "brookside-land-development-prime-commercial-site",
      clipId: "CL-2024-TX-8001",
      address: "4502 N Shepherd Dr, Houston, TX 77018",
      price: 1850000,
      rentPrice: 0,
      beds: 0, // Land development
      baths: 0,
      sqft: 0, // Raw land
      lotSize: "2.1 acres",
      propertyType: "land",
      images: [
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop&auto=format&q=85",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format&q=85",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format&q=85",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&auto=format&q=85"
      ],
      coordinates: { lat: 29.8011, lng: -95.4101 },
      description: "Prime 2.1-acre commercial development site in Houston's thriving Heights/Garden Oaks corridor. Pre-approved for mixed-use development including retail and multifamily components. Exceptional location with high traffic counts and strong demographics. Ideal for build-to-suit or speculative development.",
      detailedDescription: "This exceptional 2.1-acre development site represents a rare opportunity to participate in Houston's dynamic Heights/Garden Oaks growth story. Located on high-traffic N Shepherd Drive, the property offers excellent visibility and accessibility with approved entitlements for mixed-use development. The site is strategically positioned to capture the area's ongoing gentrification and population growth, with strong demographics showing median household incomes 25% above Houston average. Pre-approved development rights include up to 150,000 sq ft of mixed-use space combining ground-floor retail with residential units above. Infrastructure is readily available with recent utility upgrades completed by the city. Perfect for developers seeking a turnkey development opportunity in one of Houston's most desirable emerging neighborhoods.",
      features: ["prime_location", "mixed_use_approved", "high_traffic_counts", "utility_ready", "heights_location", "development_ready", "gentrification_area", "strong_demographics", "retail_potential", "residential_upside"],
      yearBuilt: null, // Raw land
      coordinates: { lat: 29.8011, lng: -95.4101 },
      taxes: 24000,
      insurance: 8500,
      agent: {
        name: "Sarah Chen",
        phone: "(713) 555-2401",
        email: "sarah@houstonlandgroup.com",
        company: "Houston Land Development Group",
        photo: "/api/placeholder/100/100",
        license: "TX-890123"
      },
      stats: {
        views: 1456,
        saves: 234,
        daysOnMarket: 18,
        pricePerSqft: 0, // Land - price per acre instead
        pricePerAcre: 880952, // $1.85M ÷ 2.1 acres
        priceHistory: [
          { date: "2024-09-10", price: 1850000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Heights/Garden Oaks",
        walkability: 72,
        transitScore: 65,
        bikeScore: 68
      },
      schools: [
        { name: "Garden Oaks Elementary", rating: 8, distance: 0.6 },
        { name: "Hamilton Middle School", rating: 7, distance: 1.1 },
        { name: "Heights High School", rating: 8, distance: 1.4 }
      ],
      marketData: {
        daysOnMarket: 18,
        opportunityScore: 92,
        sellerMotivation: 'high',
        estimatedROI: 22.5
      },
      intelligence: {
        walkScore: 72,
        transitScore: 65,
        bikeScore: 68,
        schoolQuality: 'Excellent',
        overallScore: 92
      },
      
      // Land Development Metrics
      landMetrics: {
        totalAcres: 2.1,
        buildableAcres: 1.85, // After setbacks
        zoning: "MU-2 (Mixed Use)",
        maxDensity: "75 units per acre",
        maxHeight: "5 stories",
        parkingRatio: "1.5 spaces per unit",
        maximumFAR: 3.5, // Floor Area Ratio
        approvedUses: ["retail", "restaurant", "office", "multifamily", "mixed_use"]
      },
      
      // Development Program (Approved Entitlements)
      developmentProgram: {
        totalSquareFeet: 145000,
        retailSquareFeet: 25000, // Ground floor
        residentialUnits: 95, // Units above retail
        avgUnitSize: 1200, // sq ft
        residentialSquareFeet: 114000, // 95 units × 1,200 sq ft
        parkingSpaces: 180,
        amenitySpace: 6000 // Clubhouse, fitness, etc.
      },
      
      // Financial Projections
      developmentFinancials: {
        totalDevelopmentCost: 28500000, // All-in development cost
        landCost: 1850000,
        hardConstructionCost: 22000000, // $152/sq ft blended
        softCosts: 2850000, // 10% of total
        contingency: 1425000, // 5% of total
        financingCost: 375000,
        
        // Revenue Projections
        retailValue: 6250000, // 25,000 sq ft × $250/sq ft
        residentialValue: 23750000, // 95 units × $250K avg
        totalAsBuiltValue: 30000000,
        
        // Development Returns
        developmentProfit: 1500000, // $30M - $28.5M
        profitMargin: 5.3, // Conservative for this market
        developmentPeriod: 28, // months
        
        // Land Return Analysis
        landAppreciation: 650000, // Expected land value increase during entitlement/development
        landTotalReturn: 2500000, // $1.85M + $650K appreciation
        landROI: 35.1 // ($650K ÷ $1.85M) × 100
      },
      
      // Tokenization Structure for Land Investment
      financing: {
        totalAcquisitionCost: 1850000,
        loanToValue: 0.65, // Land development financing
        debtAmount: 1202500, // $1.85M × 65%
        equityAmount: 647500, // $1.85M × 35%
        interestRate: 0.075, // Higher rate for land development
        loanTerm: 5, // Short-term construction/development loan
        annualDebtService: 120000, // Interest-only during development
        monthlyDebtService: 10000
      },
      
      tokenization: {
        totalTokens: 648, // $647,500 equity ÷ $1,000 per token (rounded)
        tokenPrice: 1000,
        minimumInvestment: 5000, // 5 tokens minimum for land deals
        maximumInvestment: 50000, // 50 tokens maximum
        
        // Land Development Returns
        expectedHoldingPeriod: 28, // months
        projectedLandAppreciation: 650000,
        appreciationPerToken: 1003, // $650K ÷ 648 tokens
        
        // Development Participation
        developmentRightsIncluded: true,
        profitParticipation: 0.35, // 35% of development profits
        estimatedDevelopmentProfit: 525000, // 35% of $1.5M total profit
        developmentProfitPerToken: 810, // $525K ÷ 648 tokens
        
        // Total Returns
        totalReturnPerToken: 1813, // $1003 + $810
        projectedAnnualizedReturn: 34.8, // High return for development risk
        
        // Distribution Schedule
        distributionFrequency: 'quarterly',
        firstDistributionDate: '2025-03-01',
        managementFee: 0.02 // 2% annual fee for land development management
      },
      
      // Development Timeline & Milestones
      developmentTimeline: {
        phase1: {
          name: "Due Diligence & Financing",
          duration: "3 months",
          status: "in_progress",
          milestones: ["Soil testing", "Survey completion", "Title work", "Environmental Phase I", "Construction financing"]
        },
        phase2: {
          name: "Entitlement & Design",
          duration: "6 months",
          status: "upcoming",
          milestones: ["Final site plan approval", "Building permits", "Architectural plans", "Engineering drawings"]
        },
        phase3: {
          name: "Construction",
          duration: "18 months",
          status: "planned",
          milestones: ["Site preparation", "Foundation", "Vertical construction", "Interior build-out", "Landscaping"]
        },
        phase4: {
          name: "Lease-Up & Stabilization",
          duration: "6 months",
          status: "planned",
          milestones: ["Pre-leasing", "Grand opening", "Tenant improvements", "Property stabilization"]
        }
      },
      
      // Risk Factors & Mitigation
      riskFactors: {
        constructionRisk: "Medium - Experienced development team with proven track record",
        marketRisk: "Low - Strong demand in Heights/Garden Oaks submarket",
        regulatoryRisk: "Low - Pre-approved entitlements reduce approval risk",
        financingRisk: "Medium - Construction financing secured, permanent financing pre-qualified",
        timingRisk: "Medium - 28-month development timeline with built-in contingencies"
      },
      
      // Market Analysis
      marketAnalysis: {
        retailDemand: "Strong - Limited retail supply in immediate trade area",
        residentialDemand: "Excellent - Heights/Garden Oaks showing 8% annual rent growth",
        competitiveSet: "Limited new supply planned within 1-mile radius",
        demographicTrends: "Young professionals, families, strong income growth",
        transportationAccess: "Excellent - Major arterial with future light rail proximity",
        walkabilityScore: 72
      }
    }
  };
  
  // First try direct ID lookup
  if (properties[identifier.toString()]) {
    return properties[identifier.toString()];
  }
  
  // Then try slug lookup
  const propertyBySlug = Object.values(properties).find(prop => 
    prop.slug === identifier || 
    prop.clipId === identifier
  );
  
  return propertyBySlug || null;
};

// Fetch property details - SIMPLIFIED
const fetchPropertyById = async (identifier) => {
  console.log(`🔍 Fetching property details for identifier: ${identifier}`);
  
  // Get direct property data
  const property = getPropertyData(identifier);
  
  if (property) {
    console.log(`✅ Found property: ${property.title}`);
    return property;
  }
  
  console.log(`❌ Property identifier ${identifier} not found, using fallback`);
  return generateEnhancedFallbackProperty(identifier);
};

// Generate enhanced fallback property with realistic data
const generateEnhancedFallbackProperty = (id) => {
  // HARDCODED: If ID is 4, return Houston 97 Unit Apartment Complex
  if (id === '4' || id === 4 || parseInt(id) === 4) {
    return {
      id: 4,
      title: "Houston 97 Unit Apartment Complex",
      address: "1234 Example St. Houston, TX, 77077",
      price: 10775000,
      rentPrice: 0,
      beds: 97,
      baths: 97,
      sqft: 48960,
      propertyType: "multifamily",
      images: [
        "/images/properties/houston-97-unit/Main photo(cover photo).jpg",
        "/images/properties/houston-97-unit/Side View photo.jpg",
        "/images/properties/houston-97-unit/Interor.jpg",
        "/images/properties/houston-97-unit/Interor 2.jpg",
        "/images/properties/houston-97-unit/interor 3.jpg",
        "/images/properties/houston-97-unit/interor 4.jpg",
        "/images/properties/houston-97-unit/Interor 5.jpg",
        "/images/properties/houston-97-unit/Interor 6.jpg"
      ],
      expectedROI: 8.29,
      monthlyRent: 74441,
      coordinates: { lat: 29.7604, lng: -95.3698 },
      description: "Premier 97-unit multifamily apartment complex in Houston, Texas. This 3-story apartment building offers exceptional investment potential with strong NOI of $893,302 annually. Built in 1961 and fully renovated in 2023, this property represents a perfect blend of classic architecture with modern amenities.",
      features: ["recently_renovated_2023", "97_units", "3_stories", "houston_location", "strong_noi", "apartment_building", "multifamily", "cash_flowing", "stable_investment", "houston_growth_market"],
      yearBuilt: 1961,
      yearRenovated: 2023,
      lotSize: "3.2 acres",
      hoa: 0,
      taxes: 129000,
      insurance: 21500,
      agent: {
        name: "Lorenzo Martinez",
        phone: "(713) 555-0897",
        email: "lorenzo@houstonmultifamily.com",
        company: "Houston Investment Properties",
        photo: "/api/placeholder/100/100",
        license: "TX-789012"
      },
      stats: {
        views: 876,
        saves: 156,
        daysOnMarket: 1,
        pricePerSqft: 220,
        priceHistory: [
          { date: "2024-09-25", price: 10775000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Southwest Houston",
        walkability: 65,
        transitScore: 58,
        bikeScore: 52
      },
      schools: [
        { name: "Westbury High School", rating: 7, distance: 0.8 },
        { name: "Piney Point Elementary", rating: 8, distance: 1.2 },
        { name: "Pin Oak Middle School", rating: 7, distance: 1.5 }
      ],
      marketData: {
        daysOnMarket: 1,
        opportunityScore: 85,
        sellerMotivation: 'high',
        estimatedROI: 8.29
      },
      intelligence: {
        walkScore: 65,
        transitScore: 58,
        bikeScore: 52,
        schoolQuality: 'Very Good',
        overallScore: 85
      },
      investmentMetrics: {
        noi: 893302,
        vacancy: 5,
        operatingExpenses: 239998,
        totalUnits: 97,
        avgRentPerUnit: 767,
        pricePerUnit: 111082,
        pricePerSqft: 220,
        buildings: 1,
        stories: 3,
        grossAnnualIncome: 1133300,
        propertySubType: "Apartment Building"
      },
      businessMetrics: {
        propertyUnits: 97,
        averageRent: 767,
        monthlyGrossIncome: 74441,
        annualGrossIncome: 1133300,
        operatingExpenses: 239998,
        netOperatingIncome: 893302,
        occupancyRate: 95,
        vacancyRate: 5,
        capRate: 8.29,
        grossRentMultiplier: 12.1,
        pricePerUnit: 111082,
        operatingExpenseRatio: 21.2
      }
    };
  }
  
  // Generate property data based on ID for consistency
  const idNumber = parseInt(id.replace(/[^0-9]/g, '')) || Math.floor(Math.random() * 1000000);
  const beds = (idNumber % 5) + 2; // 2-6 beds
  const baths = (idNumber % 4) + 2; // 2-5 baths
  const sqft = 1200 + (idNumber % 2000); // 1200-3200 sqft
  const price = 200000 + (idNumber % 800000); // $200k-$1M
  const monthlyRent = Math.round(price * 0.01); // 1% rule
  
  const cities = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Phoenix', 'Atlanta'];
  const city = cities[idNumber % cities.length];
  
  const streets = ['Oak Street', 'Pine Avenue', 'Maple Drive', 'Cedar Lane', 'Elm Way', 'Birch Road'];
  const street = streets[idNumber % streets.length];
  const streetNumber = 1000 + (idNumber % 8000);
  
  return {
    id: id,
    zillowId: `Z${idNumber}`,
    title: `${beds} Bed, ${baths} Bath Investment Property in ${city}`,
    address: `${streetNumber} ${street}, ${city}, TX 77${(idNumber % 900).toString().padStart(3, '0')}`,
    price: price,
    rentPrice: monthlyRent,
    beds: beds,
    baths: baths,
    sqft: sqft,
    propertyType: 'Multi-Family',
    
    // Fallback images
    images: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&auto=format'
    ],
    
    // Investment data
    expectedROI: Math.round((8 + Math.random() * 6) * 10) / 10, // 8-14% ROI
    monthlyRent: monthlyRent,
    
    // Market data
    marketData: {
      daysOnMarket: Math.floor(Math.random() * 30) + 1,
      opportunityScore: 70 + Math.floor(Math.random() * 30),
      sellerMotivation: 'medium',
      estimatedROI: Math.round((8 + Math.random() * 6) * 10) / 10
    },
    
    // Intelligence
    intelligence: {
      walkScore: 60 + Math.floor(Math.random() * 40),
      transitScore: 40 + Math.floor(Math.random() * 50),
      bikeScore: 30 + Math.floor(Math.random() * 60),
      schoolQuality: ['Good', 'Very Good', 'Excellent'][Math.floor(Math.random() * 3)],
      overallScore: 60 + Math.floor(Math.random() * 40)
    },
    
    // Coordinates
    coordinates: {
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Dallas': { lat: 32.7767, lng: -96.7970 },
      'Austin': { lat: 30.2672, lng: -97.7431 },
      'San Antonio': { lat: 29.4241, lng: -98.4936 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      'Atlanta': { lat: 33.7490, lng: -84.3880 }
    }[city] || { lat: 29.7604, lng: -95.3698 },
    
    // Description
    description: `This ${beds} bedroom, ${baths} bathroom multi-family investment property offers excellent potential for rental income and long-term appreciation. Located in a desirable ${city} neighborhood with good schools and amenities.`,
    
    // Features
    features: [
      'Multi-Family Investment Opportunity',
      'High ROI Potential',
      'Prime Location',
      'Near Schools and Shopping',
      'Good Transportation Access',
      'Investment Grade Property'
    ],
    
    // Agent info
    agent: {
      name: 'FractionaX Discovery Team',
      phone: '(713) 555-FXAX',
      email: 'properties@fractionax.io',
      company: 'FractionaX Properties',
      photo: '/api/placeholder/100/100',
      license: 'TX-FXAX'
    },
    
    // Stats
    stats: {
      views: Math.floor(Math.random() * 200) + 50,
      saves: Math.floor(Math.random() * 30) + 5,
      daysOnMarket: Math.floor(Math.random() * 30) + 1,
      pricePerSqft: Math.round(price / sqft),
      priceHistory: [
        { date: new Date().toISOString(), price: price, event: 'Listed' }
      ]
    },
    
    // Additional property info
    yearBuilt: 2005 + (idNumber % 20), // 2005-2024
    lotSize: `${0.15 + (idNumber % 50) / 100} acres`,
    hoa: Math.floor(Math.random() * 200),
    taxes: Math.round(price * 0.012),
    insurance: Math.round(price * 0.003),
    
    // Neighborhood info
    neighborhood: {
      name: `${city} Investment District`,
      walkability: 60 + Math.floor(Math.random() * 40),
      transitScore: 40 + Math.floor(Math.random() * 50),
      bikeScore: 30 + Math.floor(Math.random() * 60)
    },
    
    // Schools info
    schools: [
      { name: `${city} Elementary School`, rating: 7 + Math.floor(Math.random() * 3), distance: 0.3 + Math.random() * 0.5 },
      { name: `${city} Middle School`, rating: 7 + Math.floor(Math.random() * 3), distance: 0.8 + Math.random() * 0.7 },
      { name: `${city} High School`, rating: 8 + Math.floor(Math.random() * 2), distance: 1.2 + Math.random() * 1.0 }
    ],
    
    // Data source
    dataSource: 'Enhanced Fallback Generator',
    isMultifamilyProperty: true,
    isFallback: true
  };
};

const PropertyDetails = () => {
  const { identifier, clipId, slug } = useParams();
  const navigate = useNavigate();
  
  // Determine the property identifier - support both old and new URL formats
  const propertyIdentifier = identifier || clipId || slug;
  const { isAuthenticated } = useAuth();
  const coreLogicInsights = useCoreLogicInsights();
  const [property, setProperty] = useState(null);
  const [enhancedData, setEnhancedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coreLogicLoading, setCoreLogicLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Photo gallery states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('overview');

  // Load property data with Enhanced Discovery support
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🏠 Loading property details for identifier:', propertyIdentifier);
        
        let propertyData = null;
        
        // Use the updated async fetchPropertyById function
        propertyData = await fetchPropertyById(propertyIdentifier);
        
        if (propertyData) {
          console.log('✅ PROPERTY LOADED SUCCESSFULLY:');
          console.log('   🏠 Title:', propertyData.title);
          console.log('   📍 Address:', propertyData.address);
          console.log('   💰 Price: $' + (propertyData.price || 0)?.toLocaleString());
        }
        
        setProperty(propertyData);
        
      } catch (error) {
        console.error('❌ Error loading property:', error);
        setError(`Property not found with identifier: ${propertyIdentifier}. This property may no longer be available or may not be in our marketplace system.`);
      } finally {
        setLoading(false);
      }
    };

    if (propertyIdentifier) {
      loadProperty();
    }
  }, [propertyIdentifier]);

  // Handle FXCT insight confirmations and load data
  useEffect(() => {
    const handleFxctConfirmation = (event) => {
      const { propertyId, tier, data } = event.detail;
      
      // Only update if this is for the current property
      if (propertyId === propertyIdentifier) {
        setEnhancedData(data);
      }
    };

    // Listen for FXCT confirmation events
    window.addEventListener('fxctInsightConfirmed', handleFxctConfirmation);
    
    return () => {
      window.removeEventListener('fxctInsightConfirmed', handleFxctConfirmation);
    };
  }, [propertyIdentifier]);

  // Keyboard navigation for fullscreen mode
  useEffect(() => {
    if (!isFullscreenOpen) return;
    
    const handleKeyPress = (e) => {
      // Photo gallery navigation functions - defined inline to avoid closure issues
      const nextImage = () => {
        setCurrentImageIndex((prev) => {
          const images = property?.images || 
                        (property?.imgSrc ? [property.imgSrc] : 
                        ["https://via.placeholder.com/800x600?text=No+Image"]);
          return (prev + 1) % images.length;
        });
      };

      const previousImage = () => {
        setCurrentImageIndex((prev) => {
          const images = property?.images || 
                        (property?.imgSrc ? [property.imgSrc] : 
                        ["https://via.placeholder.com/800x600?text=No+Image"]);
          return (prev - 1 + images.length) % images.length;
        });
      };

      const closeFullscreen = () => {
        setIsFullscreenOpen(false);
      };

      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'Escape') closeFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreenOpen, property]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return <div className="text-center py-20 text-gray-600">{error || 'Property not found'}</div>;
  }

  const {
    title,
    address,
    price,
    beds,
    baths,
    sqft,
    description,
    detailedDescription,
    features,
    yearBuilt,
    neighborhood,
    schools,
    agent,
    stats,
    taxes,
    hoa,
    insurance,
    listingDate,
    imgSrc,
    images
  } = property || {};
  
  // Create an array of images from images or imgSrc or mock image
  let propertyImages = images || 
               (imgSrc ? [imgSrc] : 
               ["https://via.placeholder.com/800x600?text=No+Image"]);
  
  // Double-check that images is an array
  if (!Array.isArray(propertyImages)) {
    propertyImages = ["https://via.placeholder.com/800x600?text=No+Image"];
  }

  // Photo gallery navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };
  
  const handleBackToMarketplace = () => {
    // Check if we can go back in history, otherwise navigate to marketplace
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <>
      <SEO title={`${title} (Example Listing) | Property Details`} />
      <div className="bg-white min-h-screen">
        {/* Back Navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBackToMarketplace}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">← Back to Search</span>
            </button>
          </div>
        </div>

        {/* Example Listing Banner */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-2xl">⚠️</div>
              <div className="text-center">
                <div className="text-lg font-bold">EXAMPLE LISTING - FOR DEMONSTRATION PURPOSES ONLY</div>
                <div className="text-sm opacity-90">This is a sample property listing to showcase FractionaX platform features. Not an actual investment opportunity.</div>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Property Header - Crexi Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">${price.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mb-2">Purchase Price</div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title} <span className="text-orange-600 text-lg font-medium">(Example)</span></h1>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span>{address}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className="text-2xl font-bold text-blue-600">${(property.financing?.totalAcquisitionCost || price).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Investment Cost</div>
                <div className="text-xs text-gray-500 mt-1">Includes closing costs & reserves</div>
              </div>
            </div>
          </div>

          {/* Main Layout - Crexi Style */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-1">
              {/* At A Glance Box */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Investment Summary</h3>
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">EXAMPLE</span>
                </div>
                
                {/* Key Investment Metrics */}
                <div className="bg-blue-600 text-white rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">8.0%</div>
                    <div className="text-blue-100 text-xs font-medium">Annual Cash Yield (Example)</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Gross Revenue</div>
                    <div className="font-bold text-blue-600 text-lg">$120,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Operating Expenses</div>
                    <div className="font-bold text-red-600 text-lg">$70,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Net Operating Income</div>
                    <div className="font-bold text-green-600 text-lg">$50,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">3rd-Party Management Fee</div>
                    <div className="font-bold text-orange-600 text-lg">$6,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Adjusted NOI</div>
                    <div className="font-bold text-green-600 text-lg">$44,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Debt Service</div>
                    <div className="font-bold text-red-600 text-lg">$34,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Net Cash Flow to Equity</div>
                    <div className="font-bold text-purple-600 text-lg">$10,000/mo</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Monthly Dividend per Token</div>
                    <div className="font-bold text-blue-600 text-lg">$33.33</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Annual Dividend per Token</div>
                    <div className="font-bold text-purple-600 text-lg">$400</div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600">Property Type</div>
                    <div className="font-medium text-gray-900">{property.propertyType === 'commercial' ? 'Commercial - Car Wash' : property.propertyType || 'Multi-Family'}</div>
                  </div>
                  
                  {property.operationalStatus && (
                    <div>
                      <div className="text-sm text-gray-600">Operational Status</div>
                      <div className="font-medium text-green-600 capitalize">{property.operationalStatus.replace(/_/g, ' ')}</div>
                    </div>
                  )}
                  
                  {property.businessMetrics?.expressTunnels ? (
                    <div>
                      <div className="text-sm text-gray-600">Express Tunnels</div>
                      <div className="font-medium text-gray-900">{property.businessMetrics.expressTunnels}</div>
                    </div>
                  ) : property.businessMetrics?.washBays && property.businessMetrics.washBays > 1 ? (
                    <div>
                      <div className="text-sm text-gray-600">Wash Bays</div>
                      <div className="font-medium text-gray-900">{property.businessMetrics.washBays}</div>
                    </div>
                  ) : beds > 0 ? (
                    <div>
                      <div className="text-sm text-gray-600">Total Units</div>
                      <div className="font-medium text-gray-900">{beds} units</div>
                    </div>
                  ) : null}
                  
                  {property.businessMetrics?.vacuumStations && (
                    <div>
                      <div className="text-sm text-gray-600">Vacuum Stations</div>
                      <div className="font-medium text-gray-900">{property.businessMetrics.vacuumStations}</div>
                    </div>
                  )}
                  
                  {sqft > 0 && (
                    <div>
                      <div className="text-sm text-gray-600">Building Size</div>
                      <div className="font-medium text-gray-900">{sqft.toLocaleString()} sq ft</div>
                    </div>
                  )}
                  
                  {property.lotSize && (
                    <div>
                      <div className="text-sm text-gray-600">Lot Size</div>
                      <div className="font-medium text-gray-900">{property.lotSize} acres</div>
                    </div>
                  )}
                  
                  {yearBuilt && (
                    <div>
                      <div className="text-sm text-gray-600">Year Built</div>
                      <div className="font-medium text-gray-900">{yearBuilt}{property.yearRenovated && ` (Renovated ${property.yearRenovated})`}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation Menu */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <nav className="space-y-1">
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'details', label: 'Details' },
                    { key: 'about', label: 'About Property' },
                    { key: 'intelligence', label: 'Property Intelligence' },
                    { key: 'financials', label: 'Financial Analysis' },
                    { key: 'ownership', label: 'Ownership History' },
                    { key: 'building', label: 'Building Details' },
                    { key: 'map', label: 'Map' },
                    { key: 'climate', label: 'Location & Risk' },
                    { key: 'history', label: 'Property History' },
                    { key: 'fxst', label: 'FXST Calculator' },
                    { key: 'demographics', label: 'Demographics' },
                    { key: 'insights', label: 'Location Insights' },
                    ...(property.aiIntelligence ? [{ key: 'ai', label: 'AI Insights' }] : []),
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Investment Action */}
              <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Start Investing</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">DEMO ONLY</span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min Investment:</span>
                    <span className="font-semibold text-gray-900">$5,000 (1 Token)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Dividend:</span>
                    <span className="font-semibold text-green-600">$33.33</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annual Cash Yield:</span>
                    <span className="font-semibold text-blue-600">8.0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Tokens Available:</span>
                    <span className="font-semibold text-gray-900">300</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cap Rate:</span>
                    <span className="font-semibold text-purple-600">10.0%</span>
                  </div>
                </div>
                
                <button disabled className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed mb-3">
                  Invest Now (Demo Only)
                </button>
                
                <button disabled className="w-full bg-gray-100 text-gray-500 border border-gray-300 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                  Add to Watchlist (Demo Only)
                </button>
                
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xs text-yellow-800 text-center">
                    <strong>Demo Listing:</strong> Investment features are disabled. This is for demonstration purposes only.
                  </div>
                </div>
              </div>
              
              {/* Listing Contacts */}
              <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Contacts</h3>
                {agent && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {agent.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{agent.name}</div>
                        <div className="text-sm text-gray-600 mb-2">LIC: {agent.license || 'TX-FXAX'}</div>
                        <div className="text-sm text-gray-600">{agent.phone}</div>
                        <div className="text-sm text-gray-600">{agent.email}</div>
                        <div className="text-xs text-gray-500 mt-1">{agent.company}</div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">View Profile</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Photo Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                    <img
                      src={propertyImages[currentImageIndex]}
                      alt={`${title} - Photo ${currentImageIndex + 1}`}
                      className="w-full h-[400px] md:h-[500px] object-cover"
                      onLoad={() => setImageLoading(false)}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                        setImageLoading(false);
                      }}
                    />
                  </div>
                  
                  {/* Image Loading Overlay */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {propertyImages.length}
                  </div>
                  
                  {/* Fullscreen Button */}
                  <button
                    onClick={openFullscreen}
                    className="absolute bottom-4 right-4 bg-black bg-opacity-75 hover:bg-opacity-90 text-white p-2 rounded transition-all duration-200"
                    aria-label="View fullscreen"
                  >
                    <FiMaximize className="w-5 h-5" />
                  </button>
                  
                  {/* Navigation Arrows */}
                  {propertyImages.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Strip */}
                {Array.isArray(propertyImages) && propertyImages.length > 1 && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                      {propertyImages.slice(0, 10).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`aspect-square rounded overflow-hidden border-2 transition-all duration-200 ${
                            index === currentImageIndex
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                            }}
                          />
                        </button>
                      ))}
                      {propertyImages.length > 10 && (
                        <div className="aspect-square rounded bg-gray-200 border-2 border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600 font-medium">+{propertyImages.length - 10}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  {/* Enhanced Details Tab */}
                  {activeTab === 'details' && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
                      <p className="text-gray-600 mb-8">Comprehensive property information and investment metrics</p>
                      
                      {/* Property Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Property Type</h3>
                            <div className="text-2xl">🏢</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-blue-700">{property.propertyType || 'Multi-Family'}</div>
                            <div className="text-sm text-blue-600">Class B+ Apartment Complex</div>
                            <div className="text-xs text-gray-600">Built in {yearBuilt || '1995'}, well-maintained</div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Market Position</h3>
                            <div className="text-2xl">🎯</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-green-700">Prime Location</div>
                            <div className="text-sm text-green-600">Houston Growth Corridor</div>
                            <div className="text-xs text-gray-600">High demand, limited supply area</div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Investment Stage</h3>
                            <div className="text-2xl">🚀</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-purple-700">Value-Add</div>
                            <div className="text-sm text-purple-600">Staged Enhancement Program</div>
                            <div className="text-xs text-gray-600">Professional improvement strategy</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Detailed Property Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Physical Characteristics */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-bold">🏢</span>
                            </div>
                            Physical Characteristics
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Total Units:</span>
                                <span className="font-semibold text-gray-900">{beds || 97}</span>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Total Sq Ft:</span>
                                <span className="font-semibold text-gray-900">{(sqft || 89450).toLocaleString()}</span>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Avg Unit Size:</span>
                                <span className="font-semibold text-gray-900">{Math.round((sqft || 89450) / (beds || 97))} sq ft</span>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Parking Spaces:</span>
                                <span className="font-semibold text-gray-900">{(beds || 97) + 20}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Year Built:</span>
                                <span className="font-semibold text-gray-900">{yearBuilt || 1995}</span>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Stories:</span>
                                <span className="font-semibold text-gray-900">3 Stories</span>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Lot Size:</span>
                                <span className="font-semibold text-gray-900">4.2 Acres</span>
                              </div>
                              
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600 text-sm">Zoning:</span>
                                <span className="font-semibold text-gray-900">MF-2 (Multi-Family)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Unit Mix & Specifications */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-green-600 font-bold">📋</span>
                            </div>
                            Unit Mix & Rent Roll
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-gray-900">1 Bedroom / 1 Bath</span>
                                <span className="text-sm text-blue-600 font-medium">32 units (33%)</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-center">
                                  <div className="text-gray-600">Avg Size</div>
                                  <div className="font-medium">650 sq ft</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-600">Current Rent</div>
                                  <div className="font-medium">${695}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-600">Market Rent</div>
                                  <div className="font-medium text-green-600">${850}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-gray-900">2 Bedroom / 1 Bath</span>
                                <span className="text-sm text-blue-600 font-medium">45 units (46%)</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-center">
                                  <div className="text-gray-600">Avg Size</div>
                                  <div className="font-medium">900 sq ft</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-600">Current Rent</div>
                                  <div className="font-medium">${750}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-600">Market Rent</div>
                                  <div className="font-medium text-green-600">${950}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-gray-900">2 Bedroom / 2 Bath</span>
                                <span className="text-sm text-blue-600 font-medium">20 units (21%)</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-center">
                                  <div className="text-gray-600">Avg Size</div>
                                  <div className="font-medium">1,100 sq ft</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-600">Current Rent</div>
                                  <div className="font-medium">${825}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-600">Market Rent</div>
                                  <div className="font-medium text-green-600">$1,075</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-800 font-semibold">Rent-to-Market Upside:</span>
                                <span className="text-blue-600 font-bold">18.2% Average</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Investment Metrics */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-bold">📈</span>
                          </div>
                          Investment Metrics & Performance
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Purchase Price</div>
                            <div className="text-lg font-bold text-gray-900">${(price || 10775000).toLocaleString()}</div>
                            <div className="text-xs text-gray-500">$111/sq ft</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Price/Unit</div>
                            <div className="text-lg font-bold text-gray-900">${Math.round((price || 10775000) / (beds || 97)).toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Below market avg</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Current Cap Rate</div>
                            <div className="text-lg font-bold text-blue-600">{property.capRate || 6.1}%</div>
                            <div className="text-xs text-gray-500">Market: 5.8%</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Pro-Forma Cap</div>
                            <div className="text-lg font-bold text-green-600">{property.expectedROI || 7.4}%</div>
                            <div className="text-xs text-gray-500">After improvements</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Cash-on-Cash</div>
                            <div className="text-lg font-bold text-purple-600">{(property.tokenization?.equityYield || 6.4).toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">Phase 1 return</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Target IRR</div>
                            <div className="text-lg font-bold text-orange-600">{((property.tokenization?.projectedAnnualizedReturn || 16.5) * 1.15).toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">5-year projection</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Property Features & Amenities */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-orange-600 font-bold">✨</span>
                            </div>
                            Current Amenities
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Swimming Pool</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Fitness Center</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Laundry Facilities</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Covered Parking</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Landscaped Grounds</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">On-Site Management</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Basic Clubhouse</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Older Appliances</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-green-600 font-bold">🚀</span>
                            </div>
                            Planned Upgrades
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Modern Kitchens</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Luxury Bathrooms</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Premium Flooring</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Energy Efficient HVAC</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Pool Renovation</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Enhanced Fitness</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">Smart Technology</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">LED Lighting</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Market & Location Details */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-bold">🎆</span>
                          </div>
                          Location & Market Analysis
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">2.3 Miles</div>
                            <div className="text-sm text-gray-600">Downtown Houston</div>
                            <div className="text-xs text-gray-500">Major employment center</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-2">95%+</div>
                            <div className="text-sm text-gray-600">Area Occupancy</div>
                            <div className="text-xs text-gray-500">High demand market</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-2">$65k</div>
                            <div className="text-sm text-gray-600">Median Income</div>
                            <div className="text-xs text-gray-500">Growing demographic</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 mb-2">3.2%</div>
                            <div className="text-sm text-gray-600">Annual Rent Growth</div>
                            <div className="text-xs text-gray-500">5-year average</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Nearby Employers</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Texas Medical Center</span>
                                <span className="font-medium">4.1 miles</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">University of Houston</span>
                                <span className="font-medium">3.7 miles</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">NRG Stadium</span>
                                <span className="font-medium">2.8 miles</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Hobby Airport</span>
                                <span className="font-medium">8.2 miles</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Transportation</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">I-45 Access</span>
                                <span className="font-medium">0.8 miles</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Metro Rail Station</span>
                                <span className="font-medium">1.2 miles</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bus Routes</span>
                                <span className="font-medium">Multiple lines</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Walk Score</span>
                                <span className="font-medium">72/100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Property Management & Operations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-teal-600 font-bold">🗺️</span>
                            </div>
                            Property Management
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="font-semibold text-gray-900 mb-1">Current Management</div>
                              <div className="text-sm text-gray-600">Local property management company</div>
                              <div className="text-xs text-gray-500">5% management fee (industry average)</div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="font-semibold text-blue-800 mb-1">FractionaX Management</div>
                              <div className="text-sm text-blue-700">Professional asset management</div>
                              <div className="text-xs text-blue-600">2% management fee + performance incentives</div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-800">Management Services Include:</h4>
                              <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                                <div>✓ Tenant screening & leasing</div>
                                <div>✓ Rent collection & accounting</div>
                                <div>✓ Maintenance coordination</div>
                                <div>✓ Property inspections</div>
                                <div>✓ Capital improvement oversight</div>
                                <div>✓ Monthly investor reporting</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-red-600 font-bold">🛡️</span>
                            </div>
                            Due Diligence & Risks
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="font-semibold text-green-800 mb-2">Completed Due Diligence</div>
                              <div className="space-y-1 text-xs text-green-700">
                                <div>✓ Professional property inspection</div>
                                <div>✓ Environmental Phase I assessment</div>
                                <div>✓ Financial audit & rent roll verification</div>
                                <div>✓ Title & survey review</div>
                                <div>✓ Zoning & permit compliance check</div>
                              </div>
                            </div>
                            
                            <div className="bg-yellow-50 rounded-lg p-3">
                              <div className="font-semibold text-yellow-800 mb-2">Key Risk Factors</div>
                              <div className="space-y-1 text-xs text-yellow-700">
                                <div>⚠ Construction timeline delays</div>
                                <div>⚠ Market rent assumptions</div>
                                <div>⚠ Interest rate fluctuations</div>
                                <div>⚠ Economic downturn impact</div>
                                <div>⚠ Tenant turnover during renovations</div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="font-semibold text-blue-800 mb-2">Risk Mitigation</div>
                              <div className="space-y-1 text-xs text-blue-700">
                                <div>✓ Experienced management team</div>
                                <div>✓ Conservative underwriting</div>
                                <div>✓ Diversified Houston market</div>
                                <div>✓ Strong local employment base</div>
                                <div>✓ Professional renovation contractors</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About Property Tab */}
                  {activeTab === 'about' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">About This Car Wash</h2>
                        <div className="flex gap-2">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Fully Operational</span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Stabilized Income</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">Premium express car wash facility generating consistent cash flows in high-traffic Houston location.</p>
                      
                      {/* Narrative */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Overview</h3>
                        <div className="prose max-w-none text-gray-700">
                          <p>{detailedDescription || description}</p>
                          <p className="text-sm text-gray-600 mt-3">Orca Splash Express is a modern, fully-automated car wash facility featuring three express tunnels, comprehensive vacuum services, and multiple revenue streams. The business benefits from professional third-party management and serves a high-volume customer base in Houston's growing automotive market.</p>
                        </div>
                      </div>
                      
                      {/* Car Wash Business Highlights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Business Operations</h3>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">Active</span>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Daily Volume: 1,200+ car washes</li>
                            <li>• Service Mix: Basic ($8) to Premium ($25) washes</li>
                            <li>• Operating Hours: 7 AM - 9 PM daily</li>
                            <li>• Annual Revenue: $1.44M gross income</li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Investment Returns</h3>
                            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-0.5 rounded">Attractive</span>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Monthly Dividend: $33.33 per token</li>
                            <li>• Annual Cash Yield: 8.0% on investment</li>
                            <li>• Token Price: $5,000 minimum investment</li>
                            <li>• Total Tokens: 300 available</li>
                          </ul>
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="text-sm text-gray-600">Cap Rate</div>
                          <div className="text-2xl font-bold text-blue-600">8.3%</div>
                          <div className="text-xs text-gray-500">NOI / Property Value</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="text-sm text-gray-600">Operating Margin</div>
                          <div className="text-2xl font-bold text-green-600">41.7%</div>
                          <div className="text-xs text-gray-500">NOI / Gross Revenue</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="text-sm text-gray-600">Revenue per Tunnel</div>
                          <div className="text-2xl font-bold text-purple-600">$480K</div>
                          <div className="text-xs text-gray-500">Annual revenue per tunnel</div>
                        </div>
                      </div>

                      {/* Investment Highlights */}
                      {(features && features.length > 0) && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Highlights</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.map((feature, index) => (
                              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700 text-sm">{feature.replace(/_/g, ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Facility Features & Technology */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Features & Technology</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-800">Express Wash Tunnels</div>
                            <div className="text-gray-600 mt-1">3 automated tunnels, 200+ cars/hour capacity</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-800">Self-Service Area</div>
                            <div className="text-gray-600 mt-1">16 vacuum stations, detailing supplies</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-800">Water Recovery</div>
                            <div className="text-gray-600 mt-1">85% reclamation system, eco-friendly</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-4">Modern facility with state-of-the-art equipment and professional management systems ensuring optimal performance and customer satisfaction.</p>
                      </div>

                      {/* Disclosures */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="text-xs text-yellow-800">
                          Forecasts are illustrative and depend on market conditions, execution timing, and final scope. Please review full offering documents.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Map Tab */}
                  {activeTab === 'map' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Location</h2>
                      <div className="mb-4">
                        <p className="text-gray-700">{address}</p>
                        <div className="flex items-center text-blue-600 text-sm mt-2">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          <span>Interactive map showing property location</span>
                        </div>
                      </div>
                      
                      {/* Property Location Map */}
                      <div className="mb-6">
                        <PropertyLocationMap 
                          coordinates={property.coordinates}
                          address={address}
                          title={property.title}
                          height="400px"
                        />
                      </div>
                      
                      {/* Map Additional Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                            <p className="text-gray-700 text-sm">{address}</p>
                          </div>
                          {property.neighborhood && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Neighborhood</h4>
                              <p className="text-gray-700 text-sm">{property.neighborhood.name}</p>
                              {property.neighborhood.walkability && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-600">Walk Score: {property.neighborhood.walkability}/100</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Climate Risk Tab */}
                  {activeTab === 'climate' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-gray-900">Location & Risk Analysis</h2>
                        <div className="flex gap-2">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Low Risk Profile</span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Houston MSA</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">Comprehensive environmental and investment risk assessment for staged equity strategy.</p>
                      
                      {/* Risk Overview Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-600 font-medium">Overall Risk Score</div>
                          <div className="text-2xl font-bold text-green-700">7.8/10</div>
                          <div className="text-xs text-green-600">Low-moderate risk</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-blue-600 font-medium">Climate Resilience</div>
                          <div className="text-2xl font-bold text-blue-700">8.2/10</div>
                          <div className="text-xs text-blue-600">Above average</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-orange-600 font-medium">Market Stability</div>
                          <div className="text-2xl font-bold text-orange-700">8.5/10</div>
                          <div className="text-xs text-orange-600">Highly stable</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-purple-600 font-medium">Investment Grade</div>
                          <div className="text-2xl font-bold text-purple-700">A-</div>
                          <div className="text-xs text-purple-600">Investment grade</div>
                        </div>
                      </div>

                      {/* Climate & Environmental Risks */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-bold">🌊</span>
                            </div>
                            Flood & Water Risk
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-800 font-semibold">100-Year Flood Risk</span>
                                <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">LOW</span>
                              </div>
                              <div className="text-sm text-green-700">Property is outside FEMA flood zones. Historical flood events: None recorded in 30+ years.</div>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-yellow-800 font-semibold">Storm Surge Risk</span>
                                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">MODERATE</span>
                              </div>
                              <div className="text-sm text-yellow-700">Located 25+ miles from coast. Hurricane surge impact: Minimal. Category 3+ storms: Low direct impact.</div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-800 font-semibold">Infrastructure Resilience</span>
                                <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded">HIGH</span>
                              </div>
                              <div className="text-sm text-blue-700">Elevated drainage systems, recent municipal infrastructure upgrades, backup power capabilities.</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600">
                              <strong>Investment Impact:</strong> Low insurance premiums, minimal weather-related vacancy risk, strong infrastructure supports stable operations.
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-red-600 font-bold">🔥</span>
                            </div>
                            Fire & Seismic Risk
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-800 font-semibold">Wildfire Risk</span>
                                <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">LOW</span>
                              </div>
                              <div className="text-sm text-green-700">Urban location with minimal vegetation. Distance to wildland: 15+ miles. Fire dept response: &lt;4 minutes.</div>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-green-800 font-semibold">Seismic Activity</span>
                                <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">MINIMAL</span>
                              </div>
                              <div className="text-sm text-green-700">Houston area: Very low seismic activity. No major fault lines within 50 miles. Building codes: Current.</div>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-yellow-800 font-semibold">Air Quality</span>
                                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">MODERATE</span>
                              </div>
                              <div className="text-sm text-yellow-700">AQI typically 45-65. Industrial proximity managed. EPA compliance: Current. Improving trends.</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600">
                              <strong>Investment Impact:</strong> Standard insurance rates, no special construction requirements, minimal environmental compliance costs.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Market & Economic Risks */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Risk Factors</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Employment Diversification</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Population Growth</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                              <span className="text-sm text-gray-700">Supply Overhang</span>
                              <span className="text-xs font-bold text-yellow-600">MOD RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Rent Growth Sustainability</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            <strong>Assessment:</strong> Houston's diversified economy and growing population provide strong fundamentals for rental demand.
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property-Level Risks</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                              <span className="text-sm text-gray-700">Building Age (1995)</span>
                              <span className="text-xs font-bold text-yellow-600">MOD RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Condition Assessment</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Tenant Quality</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                              <span className="text-sm text-gray-700">Renovation Execution</span>
                              <span className="text-xs font-bold text-yellow-600">MOD RISK</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            <strong>Mitigation:</strong> Professional management, staged approach, and conservative underwriting address key risks.
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Environment</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Rent Control Risk</span>
                              <span className="text-xs font-bold text-green-600">NO RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Zoning Stability</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                              <span className="text-sm text-gray-700">Property Tax Growth</span>
                              <span className="text-xs font-bold text-yellow-600">MOD RISK</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">Building Code Compliance</span>
                              <span className="text-xs font-bold text-green-600">LOW RISK</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            <strong>Pro-Business:</strong> Texas maintains landlord-friendly regulations and business-friendly tax environment.
                          </div>
                        </div>
                      </div>

                      {/* Insurance & Risk Management */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold">🛡️</span>
                          </div>
                          Insurance & Risk Management Strategy
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Property Insurance</div>
                            <div className="text-lg font-bold text-green-600">$0.85</div>
                            <div className="text-xs text-gray-500">per sq ft annually</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Liability Coverage</div>
                            <div className="text-lg font-bold text-blue-600">$2M+</div>
                            <div className="text-xs text-gray-500">General liability</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Business Interruption</div>
                            <div className="text-lg font-bold text-purple-600">12 Mo</div>
                            <div className="text-xs text-gray-500">Coverage period</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Deductible</div>
                            <div className="text-lg font-bold text-orange-600">$25K</div>
                            <div className="text-xs text-gray-500">Per occurrence</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Coverage Includes:</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>✓ Named storm & hurricane damage</li>
                              <li>✓ Flood coverage (excess of NFIP limits)</li>
                              <li>✓ Equipment breakdown protection</li>
                              <li>✓ Loss of rental income</li>
                              <li>✓ Environmental liability coverage</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Risk Management:</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>✓ Quarterly property inspections</li>
                              <li>✓ Preventive maintenance programs</li>
                              <li>✓ Emergency response procedures</li>
                              <li>✓ Tenant safety education</li>
                              <li>✓ Capital reserves for improvements</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Risk Impact on Investment Phases */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Impact on Staged Equity Strategy</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Phase 1 Risk Considerations</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Low environmental risks support stable cash flows</li>
                              <li>• Insurance costs factored into underwriting (0.35% of value)</li>
                              <li>• Market risks mitigated by conservative rent assumptions</li>
                              <li>• Regulatory environment supports value-add strategies</li>
                            </ul>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Phase 2 Risk Management</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Climate resilience investments reduce long-term exposure</li>
                              <li>• Enhanced property value supports increased coverage</li>
                              <li>• Diversified tenant base reduces concentration risk</li>
                              <li>• Professional management mitigates operational risks</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-700">
                            <strong>Overall Assessment:</strong> The property presents a low-to-moderate risk profile suitable for institutional investment. 
                            Environmental risks are minimal, market fundamentals are strong, and the staged approach allows for risk management 
                            at each phase of the investment.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Property History Tab */}
                  {activeTab === 'history' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-gray-900">Property History & Tax Projections</h2>
                        <div className="flex gap-2">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Tax Forecast Included</span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Harris County</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">Historical data and forward-looking tax projections for investment planning.</p>
                      
                      {/* Tax Projection Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-blue-600 font-medium">Current Tax Rate</div>
                          <div className="text-2xl font-bold text-blue-700">2.87%</div>
                          <div className="text-xs text-blue-600">Effective rate</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-600 font-medium">5-Yr Avg Growth</div>
                          <div className="text-2xl font-bold text-green-700">+3.8%</div>
                          <div className="text-xs text-green-600">Annual increase</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-purple-600 font-medium">2024 Projection</div>
                          <div className="text-2xl font-bold text-purple-700">${Math.round((taxes || 300000) * 1.038 / 1000)}K</div>
                          <div className="text-xs text-purple-600">Est. property tax</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-orange-600 font-medium">Phase 2 Impact</div>
                          <div className="text-2xl font-bold text-orange-700">+15%</div>
                          <div className="text-xs text-orange-600">Post-renovation</div>
                        </div>
                      </div>

                      {/* Historical & Projected Tax Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax History & Projections</h3>
                          
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-2 font-semibold text-gray-900">Year</th>
                                  <th className="text-right py-2 font-semibold text-gray-900">Tax</th>
                                  <th className="text-right py-2 font-semibold text-gray-900">Assessed</th>
                                  <th className="text-right py-2 font-semibold text-gray-900">Rate</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  // Historical data
                                  { year: '2023', tax: taxes || 300000, assessed: Math.round(price * 0.80), rate: '2.87%', type: 'historical' },
                                  { year: '2022', tax: Math.round((taxes || 300000) * 0.96), assessed: Math.round(price * 0.77), rate: '2.84%', type: 'historical' },
                                  { year: '2021', tax: Math.round((taxes || 300000) * 0.92), assessed: Math.round(price * 0.73), rate: '2.81%', type: 'historical' },
                                  // Projected data
                                  { year: '2024', tax: Math.round((taxes || 300000) * 1.038), assessed: Math.round(price * 0.82), rate: '2.90%', type: 'projected' },
                                  { year: '2025', tax: Math.round((taxes || 300000) * 1.078), assessed: Math.round(price * 0.84), rate: '2.93%', type: 'projected' },
                                  { year: '2026', tax: Math.round((taxes || 300000) * 1.32), assessed: Math.round(price * 1.15 * 0.84), rate: '2.96%', type: 'phase2' },
                                ].map((entry, index) => (
                                  <tr key={index} className={`border-b border-gray-100 ${
                                    entry.type === 'projected' ? 'bg-blue-50' : 
                                    entry.type === 'phase2' ? 'bg-green-50' : ''
                                  }`}>
                                    <td className="py-2 text-gray-900">
                                      {entry.year}
                                      {entry.type === 'projected' && <span className="text-blue-600 text-xs ml-1">*</span>}
                                      {entry.type === 'phase2' && <span className="text-green-600 text-xs ml-1">**</span>}
                                    </td>
                                    <td className="py-2 text-right font-medium">${entry.tax.toLocaleString()}</td>
                                    <td className="py-2 text-right text-gray-700">${entry.assessed.toLocaleString()}</td>
                                    <td className="py-2 text-right text-gray-700">{entry.rate}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-4 text-xs text-gray-600 space-y-1">
                            <div>* Projected based on 3.8% annual growth trend</div>
                            <div>** Includes Phase 2 property value enhancement</div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Transaction History</h3>
                          
                          <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-blue-900">Current Listing</span>
                                <span className="text-sm text-blue-700">Aug 2024</span>
                              </div>
                              <div className="text-2xl font-bold text-blue-900 mb-1">${price.toLocaleString()}</div>
                              <div className="text-sm text-blue-700">${sqft > 0 ? Math.round(price / sqft) : 'N/A'}/sq ft • Listed for sale</div>
                            </div>
                            
                            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-green-900">Previous Sale</span>
                                <span className="text-sm text-green-700">Mar 2022</span>
                              </div>
                              <div className="text-2xl font-bold text-green-900 mb-1">${Math.round(price * 0.88).toLocaleString()}</div>
                              <div className="text-sm text-green-700">${sqft > 0 ? Math.round(price * 0.88 / sqft) : 'N/A'}/sq ft • Private sale</div>
                            </div>
                            
                            <div className="border-l-4 border-gray-500 bg-gray-50 p-4 rounded-r-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-900">Original Sale</span>
                                <span className="text-sm text-gray-700">Oct 2019</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 mb-1">${Math.round(price * 0.72).toLocaleString()}</div>
                              <div className="text-sm text-gray-700">${sqft > 0 ? Math.round(price * 0.72 / sqft) : 'N/A'}/sq ft • Post-construction</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="text-sm text-purple-800">
                              <strong>Appreciation:</strong> 5-year CAGR of 6.8% • Above Houston MSA average of 5.2%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investment Impact Analysis */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Impact on Investment Returns</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Phase 1 Tax Impact</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Tax (2024):</span>
                                <span className="font-medium">${Math.round((taxes || 300000) * 1.038 / 12).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Per Unit/Month:</span>
                                <span className="font-medium">${Math.round((taxes || 300000) * 1.038 / 12 / (beds || 97)).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-blue-700">
                                <span>Impact on NOI:</span>
                                <span className="font-semibold">-2.8%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Phase 2 Tax Impact</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Tax (2026):</span>
                                <span className="font-medium">${Math.round((taxes || 300000) * 1.32 / 12).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Increase:</span>
                                <span className="font-medium text-orange-600">+${Math.round((taxes || 300000) * 0.32 / 12).toLocaleString()}/mo</span>
                              </div>
                              <div className="flex justify-between text-green-700">
                                <span>ROI After Tax:</span>
                                <span className="font-semibold">16.2%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Mitigation Strategies</h4>
                            <div className="space-y-1 text-sm text-gray-700">
                              <div>• Property tax appeals process</div>
                              <div>• Improvement tax exemptions</div>
                              <div>• Rent escalation clauses</div>
                              <div>• Operating expense recovery</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="text-sm text-yellow-800">
                            <strong>Tax Planning Note:</strong> Harris County typically reassesses properties 1-2 years after major improvements. 
                            Phase 2 renovations may trigger reassessment in 2027, impacting 2028+ tax bills. Budget accordingly for investment planning.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* FXST Calculator Tab */}
                  {activeTab === 'fxst' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">FXST Token Calculator</h2>
                      
                      {/* FXST Info Banner */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-lg">FXST</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">FractionaX Staking Token</h3>
                            <p className="text-sm text-gray-600">Earn monthly returns by staking in real estate properties</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-blue-600 font-semibold">Monthly Dividend/Token</div>
                            <div className="text-2xl font-bold text-gray-900">${(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              const baseTokens = Math.floor(monthlyIncome / 50);
                              const actualDividend = monthlyIncome / baseTokens;
                              return actualDividend > 50 ? Math.round(actualDividend) : 50;
                            })()}</div>
                            <div className="text-xs text-gray-500">{(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              const baseTokens = Math.floor(monthlyIncome / 50);
                              const actualDividend = monthlyIncome / baseTokens;
                              return actualDividend > 50 ? 'Above minimum!' : 'Minimum guaranteed';
                            })()}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-green-600 font-semibold">Total Property Tokens</div>
                            <div className="text-2xl font-bold text-gray-900">{(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              return Math.floor(monthlyIncome / 50).toLocaleString();
                            })()}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-purple-600 font-semibold">Monthly Property Income</div>
                            <div className="text-2xl font-bold text-gray-900">${(property.monthlyRent || (price * 0.008)).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Calculator Input Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6">Calculate Your Investment</h3>
                          
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Number of FXST Tokens</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  id="fxst-tokens"
                                  placeholder="10"
                                  min="1"
                                  max={Math.floor((property.monthlyRent || (price * 0.008)) / 50)}
                                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                  onChange={(e) => {
                                    const selectedTokens = parseInt(e.target.value) || 0;
                                    const propertyMonthlyIncome = property.monthlyRent || (price * 0.008);
                                    const totalPropertyTokens = Math.floor(propertyMonthlyIncome / 50);
                                    const actualDividendPerToken = propertyMonthlyIncome / totalPropertyTokens;
                                    const actualTokens = Math.min(selectedTokens, totalPropertyTokens);
                                    const investmentAmount = actualTokens * 50;
                                    const monthlyEarnings = actualTokens * actualDividendPerToken;
                                    const annualEarnings = monthlyEarnings * 12;
                                    const roiPercent = actualTokens > 0 ? ((annualEarnings / investmentAmount) * 100).toFixed(0) : 0;
                                    
                                    document.getElementById('investment-amount').textContent = '$' + investmentAmount.toLocaleString();
                                    document.getElementById('tokens-result').textContent = actualTokens.toLocaleString();
                                    document.getElementById('monthly-result').textContent = '$' + Math.round(monthlyEarnings).toLocaleString();
                                    document.getElementById('annual-result').textContent = '$' + Math.round(annualEarnings).toLocaleString();
                                    document.getElementById('roi-result').textContent = roiPercent + '%';
                                    document.getElementById('dividend-per-token').textContent = '$' + Math.round(actualDividendPerToken).toLocaleString();
                                    document.getElementById('max-tokens-warning').style.display = selectedTokens > totalPropertyTokens ? 'block' : 'none';
                                  }}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Max available: {Math.floor((property.monthlyRent || (price * 0.008)) / 50).toLocaleString()} tokens
                              </div>
                              
                              {/* Quick Selection Buttons */}
                              <div className="mt-3">
                                <div className="text-xs text-gray-600 mb-2">Quick Select:</div>
                                <div className="flex flex-wrap gap-2">
                                  {[1, 5, 10, 25, 50, 100].filter(amount => amount <= Math.floor((property.monthlyRent || (price * 0.008)) / 50)).map(amount => (
                                    <button
                                      key={amount}
                                      onClick={() => {
                                        const input = document.getElementById('fxst-tokens');
                                        input.value = amount;
                                        input.dispatchEvent(new Event('change', { bubbles: true }));
                                      }}
                                      className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded text-xs transition-colors"
                                    >
                                      {amount} token{amount > 1 ? 's' : ''}
                                    </button>
                                  ))}
                                  {Math.floor((property.monthlyRent || (price * 0.008)) / 50) > 100 && (
                                    <button
                                      onClick={() => {
                                        const maxTokens = Math.floor((property.monthlyRent || (price * 0.008)) / 50);
                                        const input = document.getElementById('fxst-tokens');
                                        input.value = maxTokens;
                                        input.dispatchEvent(new Event('change', { bubbles: true }));
                                      }}
                                      className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 rounded text-xs transition-colors font-semibold"
                                    >
                                      Max ({Math.floor((property.monthlyRent || (price * 0.008)) / 50).toLocaleString()})
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Duration</label>
                              <select className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1">1 Month</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12" selected>1 Year</option>
                                <option value="24">2 Years</option>
                                <option value="60">5 Years</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Notes</label>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-sm text-blue-800">
                                  <div className="font-semibold mb-2">FXST Token Investment Structure:</div>
                                  <div className="space-y-1 text-xs">
                                    <div>• Minimum investment: $50 (1 token)</div>
                                    <div>• Each property has its own dividend rate</div>
                                    <div>• Minimum guarantee: $50/month per token</div>
                                    <div>• Higher-performing properties pay MORE</div>
                                    <div>• This property pays ${(() => {
                                      const monthlyIncome = property.monthlyRent || (price * 0.008);
                                      const baseTokens = Math.floor(monthlyIncome / 50);
                                      const actualDividend = monthlyIncome / baseTokens;
                                      return Math.round(actualDividend);
                                    })()} per token monthly</div>
                                    <div>• Limited tokens: {Math.floor((property.monthlyRent || (price * 0.008)) / 50).toLocaleString()} available</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Results Section */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Results</h3>
                          
                          <div className="space-y-6">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Total Investment Amount</div>
                              <div className="text-2xl font-bold text-blue-600" id="investment-amount">$0</div>
                              <div className="text-xs text-gray-500 mt-1">Number of tokens × $50 per token</div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">FXST Tokens Selected</div>
                              <div className="text-2xl font-bold text-indigo-600" id="tokens-result">0</div>
                              <div className="text-xs text-gray-500 mt-1">Tokens you're purchasing</div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Dividend Per Token (This Property)</div>
                              <div className="text-2xl font-bold text-indigo-600" id="dividend-per-token">${(() => {
                                const monthlyIncome = property.monthlyRent || (price * 0.008);
                                const baseTokens = Math.floor(monthlyIncome / 50);
                                const actualDividend = monthlyIncome / baseTokens;
                                return Math.round(actualDividend);
                              })()}</div>
                              <div className="text-xs text-gray-500 mt-1">{(() => {
                                const monthlyIncome = property.monthlyRent || (price * 0.008);
                                const baseTokens = Math.floor(monthlyIncome / 50);
                                const actualDividend = monthlyIncome / baseTokens;
                                return actualDividend > 50 ? 'Above $50 minimum!' : '$50 minimum guaranteed';
                              })()}</div>
                            </div>
                            
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4" id="max-tokens-warning" style={{display: 'none'}}>
                              <div className="text-sm text-red-600 font-semibold mb-1">⚠️ Investment Exceeds Available Tokens</div>
                              <div className="text-xs text-red-500">This property has limited tokens available. Your investment has been capped at the maximum available tokens.</div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Monthly Earnings</div>
                              <div className="text-2xl font-bold text-green-600" id="monthly-result">$0</div>
                              <div className="text-xs text-gray-500 mt-1">Paid monthly to your wallet</div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Annual Earnings</div>
                              <div className="text-2xl font-bold text-purple-600" id="annual-result">$0</div>
                              <div className="text-xs text-gray-500 mt-1">Total yearly return</div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">ROI Percentage</div>
                              <div className="text-2xl font-bold text-indigo-600" id="roi-result">0%</div>
                              <div className="text-xs text-gray-500 mt-1">Annual return on investment</div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                              Start Staking FXST
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Connect your wallet to begin earning returns
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Property-Specific FXST Information */}
                      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Property's FXST Performance</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">${(property.monthlyRent || (price * 0.008)).toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Monthly Property Income</div>
                            <div className="text-xs text-gray-500 mt-1">Rental income generated</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{Math.floor((property.monthlyRent || (price * 0.008)) / 50).toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total FXST Tokens</div>
                            <div className="text-xs text-gray-500 mt-1">Maximum tokens for this property</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">${(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              const baseTokens = Math.floor(monthlyIncome / 50);
                              const actualDividend = monthlyIncome / baseTokens;
                              return Math.round(actualDividend);
                            })()}</div>
                            <div className="text-sm text-gray-600">Monthly Dividend/Token</div>
                            <div className="text-xs text-gray-500 mt-1">{(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              const baseTokens = Math.floor(monthlyIncome / 50);
                              const actualDividend = monthlyIncome / baseTokens;
                              return actualDividend > 50 ? 'Above minimum!' : 'Minimum guaranteed';
                            })()}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              const baseTokens = Math.floor(monthlyIncome / 50);
                              const actualDividend = monthlyIncome / baseTokens;
                              const annualDividend = actualDividend * 12;
                              const roiPercent = ((annualDividend / 50) * 100).toFixed(0);
                              return roiPercent;
                            })()}%</div>
                            <div className="text-sm text-gray-600">Annual ROI</div>
                            <div className="text-xs text-gray-500 mt-1">{(() => {
                              const monthlyIncome = property.monthlyRent || (price * 0.008);
                              const baseTokens = Math.floor(monthlyIncome / 50);
                              const actualDividend = monthlyIncome / baseTokens;
                              const annualDividend = actualDividend * 12;
                              return '$' + Math.round(annualDividend) + ' annual per $50 invested';
                            })()}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* FXST Benefits */}
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4">Why Stake FXST?</h4>
                          <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Earn passive income from real estate without property management</span>
                            </div>
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Monthly returns paid directly to your crypto wallet</span>
                            </div>
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Diversify your portfolio with tokenized real estate</span>
                            </div>
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Flexible or locked staking options available</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4">Token Utilities</h4>
                          <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Governance rights in property decisions</span>
                            </div>
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Priority access to new property offerings</span>
                            </div>
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Reduced fees on platform transactions</span>
                            </div>
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>Tradeable on decentralized exchanges</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk Disclaimer */}
                      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Investment Disclaimer</h4>
                            <p className="text-sm text-yellow-700">
                              FXST token staking involves financial risk. Past performance does not guarantee future results. 
                              Real estate investments can fluctuate in value. Please consider your risk tolerance and consult 
                              with a financial advisor before investing. Returns are not guaranteed and may vary based on 
                              property performance and market conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demographics Tab */}
                  {activeTab === 'demographics' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-gray-900">Market Demographics</h2>
                        <div className="flex gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Houston MSA</span>
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Growth Market</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">Tenant demographics and market fundamentals supporting staged equity returns.</p>
                      
                      {/* Market Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-blue-600 font-medium">Market Growth Rate</div>
                          <div className="text-2xl font-bold text-blue-700">+2.8%</div>
                          <div className="text-xs text-blue-600">Annual population growth</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-600 font-medium">Median Income Growth</div>
                          <div className="text-2xl font-bold text-green-700">+4.2%</div>
                          <div className="text-xs text-green-600">5-year CAGR</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-purple-600 font-medium">Employment Growth</div>
                          <div className="text-2xl font-bold text-purple-700">+3.1%</div>
                          <div className="text-xs text-purple-600">Job creation rate</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-orange-600 font-medium">Rental Demand</div>
                          <div className="text-2xl font-bold text-orange-700">96.2%</div>
                          <div className="text-xs text-orange-600">Occupancy rate</div>
                        </div>
                      </div>

                      {/* Tenant Profile Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-bold">👥</span>
                            </div>
                            Target Tenant Profile
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="text-sm text-blue-600 font-medium">Median Age</div>
                              <div className="text-2xl font-bold text-blue-900">32</div>
                              <div className="text-xs text-blue-700">Young professionals</div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <div className="text-sm text-green-600 font-medium">Household Income</div>
                              <div className="text-2xl font-bold text-green-900">$68K</div>
                              <div className="text-xs text-green-700">3x rent coverage</div>
                            </div>
                            
                            <div className="bg-purple-50 rounded-lg p-4">
                              <div className="text-sm text-purple-600 font-medium">Avg. Lease Term</div>
                              <div className="text-2xl font-bold text-purple-900">13.2</div>
                              <div className="text-xs text-purple-700">Months (stable)</div>
                            </div>
                            
                            <div className="bg-orange-50 rounded-lg p-4">
                              <div className="text-sm text-orange-600 font-medium">Renewal Rate</div>
                              <div className="text-2xl font-bold text-orange-900">78%</div>
                              <div className="text-xs text-orange-700">Above market avg</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Primary Demographics</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>• 45% Healthcare & education professionals</div>
                              <div>• 25% Technology & finance workers</div>
                              <div>• 20% Service industry & skilled trades</div>
                              <div>• 10% Students & recent graduates</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-green-600 font-bold">💼</span>
                            </div>
                            Employment Base (5-mile radius)
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">Texas Medical Center</span>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">106K jobs</div>
                                <div className="text-xs text-gray-600">4.1 miles</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">Downtown Houston</span>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">185K jobs</div>
                                <div className="text-xs text-gray-600">2.3 miles</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">Energy Corridor</span>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">95K jobs</div>
                                <div className="text-xs text-gray-600">12 miles</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">University of Houston</span>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">15K jobs</div>
                                <div className="text-xs text-gray-600">3.7 miles</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-800">
                              <div className="font-semibold mb-1">Employment Stability Score: 8.6/10</div>
                              <div className="text-xs">Diverse industry mix with recession-resistant healthcare & education base</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Market Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Growth</h3>
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-blue-600">187K</div>
                            <div className="text-sm text-gray-600">5-mile radius</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">2024:</span>
                              <span className="font-medium text-green-600">+2.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">5-yr CAGR:</span>
                              <span className="font-medium text-green-600">+2.1%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">2028 Est:</span>
                              <span className="font-medium text-gray-900">203K</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Trends</h3>
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-green-600">$72K</div>
                            <div className="text-sm text-gray-600">Median household</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">US Median:</span>
                              <span className="font-medium text-gray-900">$70K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Growth Rate:</span>
                              <span className="font-medium text-green-600">+4.2%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Affordability:</span>
                              <span className="font-medium text-blue-600">Strong</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Housing Demand</h3>
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-purple-600">62%</div>
                            <div className="text-sm text-gray-600">Renter-occupied</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vacancy Rate:</span>
                              <span className="font-medium text-green-600">3.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Avg Rent Growth:</span>
                              <span className="font-medium text-green-600">+3.5%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Market Health:</span>
                              <span className="font-medium text-green-600">Robust</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investment Implications */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">💡</span>
                          </div>
                          Investment Implications for Staged Equity Strategy
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-blue-800 mb-2">Phase 1 Advantages</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Strong tenant demand supports 95%+ stabilized occupancy</li>
                              <li>• Income growth supports annual 3-5% rent increases</li>
                              <li>• Young professional demographic values amenity improvements</li>
                              <li>• Established employment base provides income stability</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">Phase 2 Upside Potential</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Growing market supports premium positioning post-renovation</li>
                              <li>• Healthcare/tech workers can afford enhanced rent levels</li>
                              <li>• Population growth creates scarcity premium for quality units</li>
                              <li>• Transit accessibility increases long-term demand</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      {/* Property-Specific Overview Content */}
                      {(() => {
                        // Car Wash Property Overview
                        if (property.propertyType === 'commercial' && property.subcategory === 'business' && property.businessMetrics?.dailyCarCount) {
                          return (
                            <div>
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Overview</h2>
                                  <div className="flex items-center space-x-3">
                                    <p className="text-gray-600 text-lg">Premium commercial car wash investment</p>
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Fully Operational</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Tokens Available</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Investment Type</div>
                                  <div className="text-lg font-semibold text-blue-600">Stabilized Cash Flow</div>
                                </div>
                              </div>
                              {/* Car wash specific content would go here */}
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">🚗 Car Wash Business Overview</h3>
                                <p className="text-gray-600">This is a commercial car wash property with detailed business metrics available in the Financial Analysis tab.</p>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">{property.businessMetrics.dailyCarCount || 'N/A'}</div>
                                    <div className="text-sm text-gray-600">Daily Car Count</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">${(property.grossRevenue || 0).toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Annual Revenue</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-purple-600">{property.capRate}%</div>
                                    <div className="text-sm text-gray-600">Cap Rate</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Multifamily Property Overview
                        if (property.propertyType === 'multifamily') {
                          return (
                            <div>
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Overview</h2>
                                  <div className="flex items-center space-x-3">
                                    <p className="text-gray-600 text-lg">Multifamily apartment investment</p>
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">{property.businessMetrics?.occupancyRate || 95}% Occupied</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Tokens Available</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Investment Type</div>
                                  <div className="text-lg font-semibold text-blue-600">Rental Income</div>
                                </div>
                              </div>
                              
                              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏢 {property.title}</h3>
                                <p className="text-gray-600 mb-4">{property.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                  <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{property.businessMetrics?.propertyUnits || property.investmentMetrics?.totalUnits}</div>
                                    <div className="text-sm text-gray-600">Units</div>
                                  </div>
                                  <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">${property.businessMetrics?.averageRent || property.investmentMetrics?.avgRentPerUnit || 'N/A'}</div>
                                    <div className="text-sm text-gray-600">Average Rent</div>
                                  </div>
                                  <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{property.businessMetrics?.occupancyRate || '95'}%</div>
                                    <div className="text-sm text-gray-600">Occupancy</div>
                                  </div>
                                  <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{property.capRate}%</div>
                                    <div className="text-sm text-gray-600">Cap Rate</div>
                                  </div>
                                </div>
                                
                                <div className="bg-white rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Property Highlights</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Built in {property.yearBuilt}, renovated in {property.yearRenovated}</li>
                                    <li>• {property.sqft?.toLocaleString()} total square feet</li>
                                    <li>• Located in {property.address}</li>
                                    <li>• {property.investmentMetrics?.stories || '3'} stories, {property.beds} bedrooms, {property.baths} bathrooms total</li>
                                    <li>• Strong rental market with stable occupancy</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Default Property Overview
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Overview</h2>
                                <div className="flex items-center space-x-3">
                                  <p className="text-gray-600 text-lg">{property.propertyType} property investment</p>
                                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Available</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">Investment Type</div>
                                <div className="text-lg font-semibold text-blue-600">Real Estate</div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-4">{property.title}</h3>
                              <p className="text-gray-600 mb-4">{property.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">${property.price?.toLocaleString()}</div>
                                  <div className="text-sm text-gray-600">List Price</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">{property.sqft?.toLocaleString()}</div>
                                  <div className="text-sm text-gray-600">Square Feet</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">{property.yearBuilt}</div>
                                  <div className="text-sm text-gray-600">Year Built</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Ownership History Tab */}
                  {activeTab === 'ownership' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ownership History</h2>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-blue-600 font-medium">📈 Subscribe to Intelligence</span>
                          <span className="text-sm text-gray-500">View ownership history data!</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">Access detailed ownership records, transfer dates, and ownership duration for this property to understand stability and investment history.</p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Date</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Owner</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Transfer Type</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Sale Price</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { date: 'Current', owner: 'FractionaX Holdings LLC', type: 'Listed for Tokenization', price: property.price, duration: 'Active' },
                              { date: 'Previous', owner: 'Previous Owner LLC', type: 'Commercial Purchase', price: Math.round(property.price * 0.88), duration: '2+ years' }
                            ].map((entry, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-3 text-sm text-gray-900">{entry.date}</td>
                                <td className="py-3 text-sm text-gray-900">{entry.owner}</td>
                                <td className="py-3 text-sm text-gray-900">{entry.type}</td>
                                <td className="py-3 text-sm text-gray-900">${entry.price.toLocaleString()}</td>
                                <td className="py-3 text-sm text-gray-900">{entry.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Building Details Tab */}
                  {activeTab === 'building' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Building Details</h2>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Property Overview</h3>
                          <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">DETAILS</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Property Type:</span>
                            <span className="text-lg font-bold text-green-700">{property.propertyType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Square Footage:</span>
                            <span className="text-lg font-bold text-green-700">{(property.sqft || 0).toLocaleString()} sq ft</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Year Built:</span>
                            <span className="text-lg font-bold text-green-700">{property.yearBuilt}</span>
                          </div>
                          <div className="bg-green-100 rounded-lg p-3 mt-3">
                            <div className="text-xs text-green-800 font-medium">Property located in {property.city}, {property.state}</div>
                            <div className="text-xs text-green-600 mt-1">Professional real estate investment opportunity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                      {/* Property Type Specific Content */}
                      {property.propertyType === 'Business' && property.subcategory === 'Car Wash' ? (
                        <div>
                          {/* Car Wash Investment Highlights */}
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 mb-8">
                            <div className="text-center">
                              <h3 className="text-xl font-bold mb-3">Car Wash Investment Highlights</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <div className="text-3xl font-bold mb-1">${Math.round((property.tokenization?.netMonthlyCashFlowPerToken || 33.33) * (property.tokenization?.tokenPrice || 5000) / 1000)}</div>
                                  <div className="text-purple-100 text-sm">Monthly dividend per ${(property.tokenization?.tokenPrice || 5000).toLocaleString()} token</div>
                                </div>
                                <div>
                                  <div className="text-3xl font-bold mb-1">{(property.tokenization?.equityYield || 8.0).toFixed(1)}%</div>
                                  <div className="text-purple-100 text-sm">Annual cash yield on investment</div>
                                </div>
                                <div>
                                  <div className="text-3xl font-bold mb-1">${(property.tokenization?.fiveYearTotalReturnPerToken || 7000).toLocaleString()}</div>
                                  <div className="text-purple-100 text-sm">5-year total return per ${(property.tokenization?.tokenPrice || 5000).toLocaleString()} token</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Car Wash Property & Investment Details */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Car Wash Property Info */}
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">🚗 {property.title} Profile</h3>
                                <div className="space-y-4">
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Type & Scale:</span>
                                      <span className="font-semibold">{property.subcategory} Facility</span>
                                    </div>
                                  </div>
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Location:</span>
                                      <span className="font-semibold">{property.city}, {property.state}</span>
                                    </div>
                                  </div>
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Operational Status:</span>
                                      <span className="font-semibold text-green-600">✓ Fully Operational</span>
                                    </div>
                                  </div>
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Express Tunnels:</span>
                                      <span className="font-semibold text-blue-600">{property.businessMetrics?.expressTunnels || 3} Automated Lines</span>
                                    </div>
                                  </div>
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Property Value:</span>
                                      <span className="font-semibold">${(property.price || 5000000).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Investment Summary */}
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">💰 Your Investment Returns</h3>
                                <div className="space-y-4">
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Minimum Investment:</span>
                                      <span className="font-semibold">${(property.tokenization?.tokenPrice || 5000).toLocaleString()} (1 Token)</span>
                                    </div>
                                  </div>
                                  <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Monthly Dividend:</span>
                                      <span className="font-semibold text-green-600">${(property.tokenization?.netMonthlyCashFlowPerToken || 33.33)}/token</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">${Math.round((property.tokenization?.netMonthlyCashFlowPerToken || 33.33) * 12)} annually per token</div>
                                  </div>
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Annual Cash Yield:</span>
                                      <span className="font-semibold text-blue-600">{(property.tokenization?.equityYield || 8.0).toFixed(1)}%</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Competitive commercial real estate yield</div>
                                  </div>
                                  <div className="bg-white/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Tokens Available:</span>
                                      <span className="font-semibold">{property.tokenization?.totalTokens || 300} tokens</span>
                                    </div>
                                  </div>
                                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-900 font-semibold">5-Year Total Return:</span>
                                      <span className="font-bold text-purple-600">${(property.tokenization?.fiveYearTotalReturnPerToken || 7000).toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Includes cash flow + property appreciation</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        property.propertyType === 'Multifamily' ? (
                          <div>
                            {/* Multifamily Investment Highlights */}
                            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 mb-8">
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-3">Multifamily Investment Highlights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <div className="text-3xl font-bold mb-1">${(property.tokenization?.netMonthlyCashFlowPerToken || 6.81).toFixed(2)}</div>
                                    <div className="text-green-100 text-sm">Monthly dividend per ${(property.tokenization?.tokenPrice || 1000).toLocaleString()} token</div>
                                  </div>
                                  <div>
                                    <div className="text-3xl font-bold mb-1">{(property.tokenization?.equityYield || 8.34).toFixed(1)}%</div>
                                    <div className="text-blue-100 text-sm">Annual cash yield on investment</div>
                                  </div>
                                  <div>
                                    <div className="text-3xl font-bold mb-1">${(property.tokenization?.fiveYearTotalReturnPerToken || 825).toLocaleString()}</div>
                                    <div className="text-yellow-100 text-sm">5-year total return per ${(property.tokenization?.tokenPrice || 1000).toLocaleString()} token</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Multifamily Property Details */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Property Info */}
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🏢 {property.title} Profile</h3>
                                  <div className="space-y-4">
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Property Type:</span>
                                        <span className="font-semibold">{property.beds}-Unit Multifamily</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Location:</span>
                                        <span className="font-semibold">{property.city}, {property.state}</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Occupancy Rate:</span>
                                        <span className="font-semibold text-green-600">{((property.businessMetrics?.occupancyRate || 0.94) * 100).toFixed(0)}%</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Year Built:</span>
                                        <span className="font-semibold">{property.yearBuilt}</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Property Value:</span>
                                        <span className="font-semibold">${(property.price || 10775000).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Investment Summary */}
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-6">💰 Your Investment Returns</h3>
                                  <div className="space-y-4">
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Minimum Investment:</span>
                                        <span className="font-semibold">${(property.tokenization?.tokenPrice || 1000).toLocaleString()} (1 Token)</span>
                                      </div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Monthly Dividend:</span>
                                        <span className="font-semibold text-green-600">${(property.tokenization?.netMonthlyCashFlowPerToken || 6.81).toFixed(2)}/token</span>
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1">${Math.round((property.tokenization?.netMonthlyCashFlowPerToken || 6.81) * 12)} annually per token</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Annual Cash Yield:</span>
                                        <span className="font-semibold text-blue-600">{(property.tokenization?.equityYield || 8.34).toFixed(1)}%</span>
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1">Strong multifamily cash flow</div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tokens Available:</span>
                                        <span className="font-semibold">{property.tokenization?.totalTokens || 10775} tokens</span>
                                      </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-900 font-semibold">5-Year Total Return:</span>
                                        <span className="font-bold text-purple-600">${(property.tokenization?.fiveYearTotalReturnPerToken || 825).toLocaleString()}</span>
                                      </div>
                                      <div className="text-xs text-gray-600 mt-1">Cash flow + appreciation</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* Generic Property Investment Highlights */}
                            <div className="bg-gradient-to-r from-gray-600 to-blue-600 text-white rounded-xl p-6 mb-8">
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-3">Investment Highlights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <div className="text-3xl font-bold mb-1">${(property.tokenization?.netMonthlyCashFlowPerToken || 5.00).toFixed(2)}</div>
                                    <div className="text-gray-100 text-sm">Monthly dividend per token</div>
                                  </div>
                                  <div>
                                    <div className="text-3xl font-bold mb-1">{(property.tokenization?.equityYield || 7.0).toFixed(1)}%</div>
                                    <div className="text-gray-100 text-sm">Annual cash yield</div>
                                  </div>
                                  <div>
                                    <div className="text-3xl font-bold mb-1">{(property.tokenization?.projectedAnnualizedReturn || 15.0).toFixed(1)}%</div>
                                    <div className="text-gray-100 text-sm">Total return potential</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Generic Property Details */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Property Info */}
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🏠 {property.title} Profile</h3>
                                  <div className="space-y-4">
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Property Type:</span>
                                        <span className="font-semibold">{property.propertyType}</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Location:</span>
                                        <span className="font-semibold">{property.city}, {property.state}</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Square Feet:</span>
                                        <span className="font-semibold">{(property.sqft || 0).toLocaleString()} sq ft</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Year Built:</span>
                                        <span className="font-semibold">{property.yearBuilt}</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Property Value:</span>
                                        <span className="font-semibold">${(property.price || 0).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Investment Summary */}
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-6">💰 Investment Details</h3>
                                  <div className="space-y-4">
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Token Price:</span>
                                        <span className="font-semibold">${(property.tokenization?.tokenPrice || 1000).toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Monthly Dividend:</span>
                                        <span className="font-semibold text-green-600">${(property.tokenization?.netMonthlyCashFlowPerToken || 5.00).toFixed(2)}/token</span>
                                      </div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Annual Cash Yield:</span>
                                        <span className="font-semibold text-blue-600">{(property.tokenization?.equityYield || 7.0).toFixed(1)}%</span>
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Tokens:</span>
                                        <span className="font-semibold">{property.tokenization?.totalTokens || 1000}</span>
                                      </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-900 font-semibold">Projected IRR:</span>
                                        <span className="font-bold text-purple-600">{(property.tokenization?.projectedAnnualizedReturn || 15.0).toFixed(1)}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                  
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Car Wash Business Details</h2>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Business Metrics</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                $12.50
                              </div>
                              <div className="text-xs text-gray-600">Average Revenue per Wash</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">8.3%</div>
                              <div className="text-xs text-gray-600">Cap Rate (NOI/Property Value)</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">438,000</div>
                              <div className="text-xs text-gray-600">Annual Car Washes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">1,200</div>
                              <div className="text-xs text-gray-600">Daily Car Volume</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Car Wash Metrics */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-600">Express Tunnels</div>
                            <div className="text-2xl font-bold text-blue-600">{property.businessMetrics?.expressTunnels || 3}</div>
                            <div className="text-xs text-gray-500">Automated wash lines</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-600">Vacuum Stations</div>
                            <div className="text-2xl font-bold text-green-600">{property.businessMetrics?.vacuumStations || 16}</div>
                            <div className="text-xs text-gray-500">Self-service units</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-600">Peak Hour Capacity</div>
                            <div className="text-2xl font-bold text-purple-600">600</div>
                            <div className="text-xs text-gray-500">Cars per hour</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Revenue Breakdown */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Composition</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-700">75%</div>
                              <div className="text-sm text-blue-600">Wash Services</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-700">15%</div>
                              <div className="text-sm text-green-600">Vacuum Revenue</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-700">7%</div>
                              <div className="text-sm text-purple-600">Memberships</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-700">3%</div>
                              <div className="text-sm text-orange-600">Retail & Vending</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Property Intelligence Tab */}
                  {activeTab === 'intelligence' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-gray-900">Business Intelligence</h2>
                        <div className="flex gap-2">
                          <button className="text-xs bg-white border border-blue-600 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50" title="View market analysis">
                            Market Report
                          </button>
                          <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700" title="Subscribe for premium analytics">
                            Subscribe
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">Comprehensive market analysis and operational intelligence for car wash business performance.</p>
                      
                      {/* Key Business Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                          <div className="text-sm text-gray-600" title="Traffic visibility and accessibility">Traffic Score</div>
                          <div className="text-3xl font-bold text-blue-600">92</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                          <div className="text-sm text-gray-600" title="Market saturation and competition density">Market Score</div>
                          <div className="text-3xl font-bold text-green-600">78</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                          <div className="text-sm text-gray-600" title="Area demographics and income levels">Demo Score</div>
                          <div className="text-3xl font-bold text-purple-600">85</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                          <div className="text-sm text-gray-600" title="Overall business location performance">Business Score</div>
                          <div className="text-3xl font-bold text-indigo-600">84/100</div>
                        </div>
                      </div>

                      {/* Market Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Traffic & Location Analysis</h3>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Daily traffic count: 28,500+ vehicles/day</li>
                            <li>• Visibility rating: Excellent (corner location)</li>
                            <li>• Access points: 2 entrances, easy ingress/egress</li>
                            <li>• Peak hour capture: 7-10 AM, 4-7 PM optimal</li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Competition & Market</h3>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Competitor density: Moderate (3 within 2 miles)</li>
                            <li>• Market penetration: 12% of addressable market</li>
                            <li>• Average pricing: Premium tier ($12-25 range)</li>
                            <li>• Customer loyalty: 35% repeat/membership base</li>
                          </ul>
                        </div>
                      </div>

                      {/* Demographics & Market Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Demographics</h3>
                          <div className="text-sm text-gray-700">Median income: $68,500 • Vehicle ownership: 95%+ • Target market: High</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seasonality</h3>
                          <div className="text-sm text-gray-700">Peak months: Apr-Sep • Weather impact: Moderate • Year-round demand</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Trends</h3>
                          <div className="text-sm text-gray-700">Volume growth: +3.2% YoY • Price elasticity: Low • Market expanding</div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-700">Access detailed market analysis, traffic studies, and competitive landscape data.</div>
                          <div className="text-xs text-gray-500">Includes demographic analysis, seasonal trends, and business performance benchmarks.</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">Preview Report</button>
                          <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Upgrade</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Analysis Tab */}
                  {activeTab === 'financials' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">Financial Analysis</h2>
                          <div className="flex items-center space-x-3">
                            <p className="text-gray-600">Car wash operational performance and optimization potential</p>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Current Operations</span>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Growth Opportunities</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Analysis Type</div>
                          <div className="text-lg font-semibold text-blue-600">Business Operations</div>
                        </div>
                      </div>
                      
                      {/* Debug Management Fees */}
                      {property.managementFees && (
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
                          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔍 Management Fees Debug</h3>
                          <div className="text-sm text-yellow-700">
                            <div>Acquisition Fee: ${property.managementFees.acquisitionFee?.amount?.toLocaleString()}</div>
                            <div>Monthly Asset Management: ${property.managementFees.assetManagementFee?.monthlyAmount?.toLocaleString()}</div>
                            <div>Annual Asset Management: ${property.managementFees.assetManagementFee?.annualAmount?.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Car Wash Performance Analysis */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">📈 Current vs Optimized Performance</h3>
                          <p className="text-gray-600">Side-by-side comparison showing operational optimization potential</p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Current Performance */}
                          <div className="bg-white rounded-xl p-6 border-2">
                            <div className="text-center mb-6">
                              <h4 className="text-xl font-semibold text-gray-900 mb-2">Current Performance</h4>
                              <p className="text-sm text-gray-600">Existing operations</p>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-600">Monthly Gross Revenue:</span>
                                <span className="font-semibold">$120,000</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-600">Operating Expenses:</span>
                                <span className="font-semibold text-red-600">-$70,000</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 border-2 border-blue-300">
                                <span className="text-blue-800 font-semibold">Net Operating Income:</span>
                                <span className="font-bold text-blue-700">$50,000</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-600">Management Fee & Debt Service:</span>
                                <span className="font-semibold text-red-600">-$40,000</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-green-50 rounded-lg p-3 border-2 border-green-300">
                                <span className="text-green-800 font-semibold">Cash Flow to Investors:</span>
                                <span className="font-bold text-green-700">$10,000</span>
                              </div>
                              
                              <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <div className="text-sm text-gray-600">Current Cash Yield</div>
                                <div className="text-2xl font-bold text-gray-800">8.0%</div>
                                <div className="text-xs text-gray-500">Annual cash-on-cash return</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Optimized Performance */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                            <div className="text-center mb-6">
                              <div className="flex items-center justify-center mb-2">
                                <h4 className="text-xl font-semibold text-gray-900 mr-2">Optimized Performance</h4>
                                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">+15% Revenue</span>
                              </div>
                              <p className="text-sm text-green-700">With operational improvements</p>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                <span className="text-gray-600">Optimized Gross Revenue:</span>
                                <span className="font-semibold text-green-700">$138,000</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                <span className="text-gray-600">Reduced Operating Expenses:</span>
                                <span className="font-semibold text-red-600">-$66,500</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 border-2 border-blue-300">
                                <span className="text-blue-800 font-semibold">Enhanced NOI:</span>
                                <span className="font-bold text-blue-700">$71,500</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                <span className="text-gray-600">Management Fee & Debt Service:</span>
                                <span className="font-semibold text-red-600">-$40,000</span>
                              </div>
                              
                              <div className="flex justify-between items-center bg-green-100 rounded-lg p-3 border-2 border-green-400">
                                <span className="text-green-800 font-semibold">Enhanced Cash Flow:</span>
                                <span className="font-bold text-green-700">$31,500</span>
                              </div>
                              
                              <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg p-4 text-center">
                                <div className="text-sm text-green-700">Enhanced Cash Yield</div>
                                <div className="text-2xl font-bold text-green-800">25.2%</div>
                                <div className="text-xs text-green-600">+17.2% improvement potential</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Key Performance Metrics */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-sm text-gray-600">Monthly Income Increase</div>
                            <div className="text-2xl font-bold text-green-600">$21,500</div>
                            <div className="text-xs text-gray-500">Additional cash flow</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-sm text-gray-600">Per Token Increase</div>
                            <div className="text-2xl font-bold text-blue-600">$71.67</div>
                            <div className="text-xs text-gray-500">Monthly dividend boost</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-sm text-gray-600">Yield Improvement</div>
                            <div className="text-2xl font-bold text-purple-600">+17.2%</div>
                            <div className="text-xs text-gray-500">Annual return increase</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-sm text-gray-600">Revenue Growth</div>
                            <div className="text-2xl font-bold text-orange-600">+15%</div>
                            <div className="text-xs text-gray-500">Operational improvement</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Staged Capital Structure */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Staged Capital Structure & Investment Timeline</h3>
                        
                        {/* Phase 1 Capital Structure */}
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-blue-800">Phase 1: Acquisition + Quick Wins</h4>
                            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">Available Now</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center bg-gray-50 rounded-lg p-4">
                              <div className="text-xl font-bold text-gray-900 mb-1">${(property.financing?.totalAcquisitionCost || 11852500).toLocaleString()}</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Property Acquisition</div>
                              <div className="text-xs text-gray-500">Purchase + closing + reserves</div>
                            </div>
                            
                            <div className="text-center bg-blue-50 rounded-lg p-4">
                              <div className="text-xl font-bold text-blue-600 mb-1">$540,000</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Phase 1 Improvements</div>
                              <div className="text-xs text-gray-500">Quick-win renovations</div>
                            </div>
                            
                            <div className="text-center bg-orange-50 rounded-lg p-4">
                              <div className="text-xl font-bold text-orange-600 mb-1">${(property.financing?.debtAmount || 8889375).toLocaleString()}</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Senior Debt (75% LTV)</div>
                              <div className="text-xs text-gray-500">{((property.financing?.interestRate || 0.065) * 100).toFixed(1)}% @ {property.financing?.loanTerm || 30} years</div>
                            </div>
                            
                            <div className="text-center bg-blue-100 rounded-lg p-4">
                              <div className="text-xl font-bold text-blue-700 mb-1">$3,500,000</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Phase 1 Equity</div>
                              <div className="text-xs text-gray-500">3,500 tokens @ $1,000</div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-orange-500 flex items-center justify-center" style={{ width: '72%' }}>
                                <span className="text-xs text-white font-semibold">Debt 72%</span>
                              </div>
                              <div className="bg-blue-500 flex items-center justify-center" style={{ width: '28%' }}>
                                <span className="text-xs text-white font-semibold">Phase 1 Equity 28%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Phase 2 Capital Structure */}
                        <div className="border-t border-gray-200 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-green-800">Phase 2: Major Value-Add (6-9 months later)</h4>
                            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">Future Opportunity</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center bg-green-50 rounded-lg p-4">
                              <div className="text-xl font-bold text-green-600 mb-1">$1,300,000</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Phase 2 Equity Raise</div>
                              <div className="text-xs text-gray-500">1,300 additional tokens</div>
                            </div>
                            
                            <div className="text-center bg-gray-50 rounded-lg p-4">
                              <div className="text-xl font-bold text-gray-900 mb-1">$4,800,000</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Total Equity</div>
                              <div className="text-xs text-gray-500">4,800 tokens total</div>
                            </div>
                            
                            <div className="text-center bg-purple-50 rounded-lg p-4">
                              <div className="text-xl font-bold text-purple-600 mb-1">$15,200,000</div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Enhanced Property Value</div>
                              <div className="text-xs text-gray-500">Post-improvements</div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-800 mb-2">Complete Capital Stack (Post Phase 2)</h5>
                            <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-orange-500 flex items-center justify-center" style={{ width: '58%' }}>
                                <span className="text-xs text-white font-semibold">Debt 58%</span>
                              </div>
                              <div className="bg-blue-500 flex items-center justify-center" style={{ width: '23%' }}>
                                <span className="text-xs text-white font-semibold">Phase 1 Equity 23%</span>
                              </div>
                              <div className="bg-green-500 flex items-center justify-center" style={{ width: '9%' }}>
                                <span className="text-xs text-white font-semibold">Phase 2 Equity 9%</span>
                              </div>
                              <div className="bg-purple-500 flex items-center justify-center" style={{ width: '10%' }}>
                                <span className="text-xs text-white font-semibold">Value Creation 10%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Phase 1 Investor Benefits */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Phase 1 Investor Advantages</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-blue-700">First rights to Phase 2 investment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-blue-700">Larger ownership percentage</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-blue-700">Lower risk, proven concept</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Per Token Returns */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-center mb-6">
                          <h4 className="text-xl font-semibold text-gray-900 mr-3">Enhanced Per Token Returns</h4>
                          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">EXAMPLE DATA</span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
                            <span className="text-gray-600">Enhanced Monthly Dividend:</span>
                            <span className="text-xl font-bold text-green-600">${((property.tokenization?.netMonthlyCashFlowPerToken || 6.81) * 1.22).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/50 rounded-lg p-3">
                            <span className="text-gray-600">Enhanced Annual Cash Flow:</span>
                            <span className="text-xl font-bold text-blue-600">${Math.round((property.tokenization?.netCashFlowPerToken || 81.7) * 1.22)}</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-green-200 pt-4">
                            <span className="text-gray-900 font-semibold">Enhanced Cash-on-Cash Return:</span>
                            <span className="text-2xl font-bold text-purple-600">{((property.tokenization?.equityYield || 8.34) * 1.22).toFixed(1)}%</span>
                          </div>
                          
                          <div className="bg-green-100 rounded-lg p-4 text-center">
                            <div className="text-sm text-green-600">Investment Example: $10,000</div>
                            <div className="text-lg font-bold text-green-700">${Math.round(((property.tokenization?.netMonthlyCashFlowPerToken || 6.81) * 1.22) * 10)}/month</div>
                            <div className="text-xs text-green-600">${Math.round(((property.tokenization?.netCashFlowPerToken || 81.7) * 1.22) * 10)}/year in cash flow</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* FractionaX Fee Structure Disclosure */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-bold">📏</span>
                            </div>
                            FractionaX Fee Structure & Investment Costs
                          </h4>
                          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">EXAMPLE PRICING</span>
                        </div>
                        
                        <div className="mb-6">
                          <div className="bg-white/80 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              When FractionaX facilitates and manages this fractionalized real estate investment, we charge the following fees to cover deal structuring, compliance, investor servicing, and ongoing oversight. These fees are designed to align our interests with investors while ensuring sustainable operations.
                            </p>
                          </div>
                        </div>
                        
                        {/* Fee Structure Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          {/* One-Time Fees */}
                          <div className="space-y-4">
                            <h5 className="font-semibold text-gray-900 text-lg mb-4">One-Time Fees</h5>
                            
                            {/* Acquisition Fee */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Acquisition & Fractionalization Fee</h6>
                                <span className="text-lg font-bold text-blue-600">3.0%</span>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Fee Basis:</span>
                                  <span className="font-medium">{property.managementFees?.acquisitionFee?.rate || 3.0}% of Purchase Price</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Property Price:</span>
                                  <span className="font-medium">${(price || 10775000).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                  <span className="text-gray-900 font-semibold">Total Fee:</span>
                                  <span className="font-bold text-blue-600">${(property.managementFees?.acquisitionFee?.amount || Math.round((price || 10775000) * 0.03)).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-blue-50 rounded">
                                <div className="text-xs text-blue-800 font-medium mb-1">What's Included:</div>
                                <div className="text-xs text-blue-700 leading-relaxed">
                                  Sourcing, underwriting, due diligence, tokenization, legal structuring, compliance filings, and investor onboarding.
                                </div>
                              </div>
                            </div>
                            
                            {/* Disposition Fee */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Disposition Fee (At Sale)</h6>
                                <span className="text-lg font-bold text-purple-600">1.0%</span>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Fee Basis:</span>
                                  <span className="font-medium">1% of Sale Price</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Est. Sale Price (5yr):</span>
                                  <span className="font-medium">${Math.round((price || 10775000) * 1.25).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                  <span className="text-gray-900 font-semibold">Est. Fee at Sale:</span>
                                  <span className="font-bold text-purple-600">${Math.round((price || 10775000) * 1.25 * 0.01).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-purple-50 rounded">
                                <div className="text-xs text-purple-800 font-medium mb-1">What's Included:</div>
                                <div className="text-xs text-purple-700 leading-relaxed">
                                  Transaction coordination, compliance filings, investor payouts, and fractional token unwinding.
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ongoing Fees */}
                          <div className="space-y-4">
                            <h5 className="font-semibold text-gray-900 text-lg mb-4">Ongoing Fees</h5>
                            
                            {/* Asset Management Fee */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Asset Management Fee</h6>
                                <span className="text-lg font-bold text-green-600">3.0%</span>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Fee Basis:</span>
                                  <span className="font-medium">{property.managementFees?.assetManagementFee?.rate || 3.0}% of Gross Collected Rent</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Monthly Gross Rent:</span>
                                  <span className="font-medium">${(property.businessMetrics?.monthlyGrossIncome || property.monthlyRent || 74441).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                  <span className="text-gray-900 font-semibold">Monthly Fee:</span>
                                  <span className="font-bold text-green-600">${(property.managementFees?.assetManagementFee?.monthlyAmount || Math.round((property.businessMetrics?.monthlyGrossIncome || property.monthlyRent || 74441) * 0.03)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-900 font-semibold">Annual Fee:</span>
                                  <span className="font-bold text-green-600">${(property.managementFees?.assetManagementFee?.annualAmount || Math.round((property.businessMetrics?.monthlyGrossIncome || property.monthlyRent || 74441) * 0.03 * 12)).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-green-50 rounded">
                                <div className="text-xs text-green-800 font-medium mb-1">What's Included:</div>
                                <div className="text-xs text-green-700 leading-relaxed">
                                  Oversight of property managers, financial reporting, compliance monitoring, and investor communications.
                                </div>
                              </div>
                            </div>
                            
                            {/* Performance Fee */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Performance Fee (Annual)</h6>
                                <span className="text-lg font-bold text-orange-600">5.0%</span>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Fee Basis:</span>
                                  <span className="font-medium">{property.managementFees?.performanceFee?.rate || 5.0}% of NOI Growth</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Current NOI:</span>
                                  <span className="font-medium">${Math.round((property.businessMetrics?.netOperatingIncome || property.managementFees?.performanceFee?.baselineNOI || 440000) / 12).toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Trigger:</span>
                                  <span className="font-medium text-xs">{property.managementFees?.performanceFee?.trigger || 'NOI growth above baseline'}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                  <span className="text-gray-900 font-semibold">Est. Annual Performance Fee:</span>
                                  <span className="font-bold text-orange-600">${(property.managementFees?.performanceFee?.estimatedAnnual || 6500).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-3 p-3 bg-orange-50 rounded">
                                <div className="text-xs text-orange-800 font-medium mb-1">Performance-Based:</div>
                                <div className="text-xs text-orange-700 leading-relaxed">
                                  Only paid when property achieves NOI growth above baseline projections. Aligns FractionaX incentives with investor returns.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Fee Impact Analysis */}
                        <div className="bg-white/80 rounded-lg p-6 mb-6">
                          <h5 className="font-semibold text-gray-900 text-lg mb-4">Fee Impact on Investment Returns</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600 mb-1">${Math.round((price || 10775000) * 0.03).toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Total Upfront Fees</div>
                              <div className="text-xs text-gray-500">Acquisition & setup costs</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="text-2xl font-bold text-green-600 mb-1">${Math.round((property.businessMetrics?.monthlyGrossIncome || 74441) * 0.03 * 12).toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Annual Management Fees</div>
                              <div className="text-xs text-gray-500">Ongoing asset management</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600 mb-1">${Math.round(((property.businessMetrics?.netOperatingIncome || 893302) * 1.26 - (property.businessMetrics?.netOperatingIncome || 893302)) * 0.05).toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Est. Performance Fees</div>
                              <div className="text-xs text-gray-500">Only if NOI grows above baseline</div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                            <h6 className="font-semibold text-blue-800 mb-2">Net Investor Returns After All Fees:</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Target Annual Cash Yield:</span>
                                <span className="font-bold text-blue-800">{((property.tokenization?.equityYield || 6.5) * 0.94).toFixed(1)}% - {((property.tokenization?.equityYield || 6.5) * 1.18).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Target 5-Year IRR:</span>
                                <span className="font-bold text-blue-800">{((property.tokenization?.projectedAnnualizedReturn || 16.5) * 0.88).toFixed(1)}% - {((property.tokenization?.projectedAnnualizedReturn || 16.5) * 1.08).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Investor Alignment & Justification */}
                        <div className="bg-white/80 rounded-lg p-6">
                          <h5 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                            <span className="text-xl mr-2">⚖️</span>
                            Why These Fees? Investor Alignment & Value
                          </h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h6 className="font-semibold text-gray-800">What You Get for These Fees:</h6>
                              <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span><strong>Tokenized Structure:</strong> Liquid, digital ownership with lower barriers to entry</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span><strong>Professional Asset Management:</strong> Active oversight and optimization</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span><strong>Full Compliance:</strong> SEC-compliant structure with ongoing regulatory oversight</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span><strong>Technology Platform:</strong> Real-time reporting, automated distributions</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span><strong>Performance Alignment:</strong> Higher fees only when you earn higher returns</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h6 className="font-semibold text-gray-800">Industry Comparison:</h6>
                              <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                  <span>Traditional Real Estate Fund:</span>
                                  <span className="font-medium">2% + 20% carry</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Real Estate Syndication:</span>
                                  <span className="font-medium">1-2% acq + 5-10% mgmt</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>REITs (public):</span>
                                  <span className="font-medium">0.5-1.5% expense ratio</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                                  <span>FractionaX (all-in):</span>
                                  <span className="text-blue-600">3% + 3% + 5% performance</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                                <strong>Premium justified by:</strong> Digital tokenization, enhanced liquidity, regulatory compliance, and active asset management.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Operating Expenses Breakdown - Standalone Section */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-red-600 font-bold">📊</span>
                            </div>
                            Operating Expenses Breakdown
                          </h4>
                          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">EXAMPLE NUMBERS</span>
                        </div>
                        
                        {/* Operating Expenses Vertical Layout */}
                        <div className="space-y-6 mb-6">
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                              <h5 className="font-semibold text-gray-900 mb-2">Current Monthly OpEx</h5>
                              <div className="text-2xl font-bold text-red-600 mb-1">
                                ${Math.round((property.businessMetrics?.operatingExpenses || 466000) / 12).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                ${Math.round(((property.businessMetrics?.operatingExpenses || 466000) / 12) / (beds || 97)).toLocaleString()}/unit/month
                              </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                              <h5 className="font-semibold text-gray-900 mb-2">Optimized Monthly OpEx</h5>
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                ${Math.round(((property.businessMetrics?.operatingExpenses || 466000) / 12) * 0.98).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                ${Math.round((((property.businessMetrics?.operatingExpenses || 466000) / 12) * 0.98) / (beds || 97)).toLocaleString()}/unit/month
                              </div>
                            </div>
                          </div>
                          
                          {/* Detailed Expense Categories */}
                          <div className="space-y-4">
                            <h5 className="font-semibold text-gray-900 text-lg mb-4">Detailed Expense Analysis</h5>
                            
                            {/* Property Taxes */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Property Taxes</h6>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600 px-2 py-1 bg-orange-100 rounded">+15% increase</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-white rounded border">
                                  <div className="text-gray-600 mb-1">Current</div>
                                  <div className="font-semibold text-gray-900">${Math.round((property.taxes || 129000) / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
                                  <div className="text-gray-600 mb-1">Phase 2</div>
                                  <div className="font-semibold text-orange-600">${Math.round((property.taxes || 129000) * 1.15 / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-orange-100 rounded border border-orange-200">
                                  <div className="text-gray-600 mb-1">Change</div>
                                  <div className="font-semibold text-orange-600">+${Math.round(((property.taxes || 129000) * 1.15 - (property.taxes || 129000)) / 12).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">Higher assessed value after improvements</div>
                            </div>
                            
                            {/* Insurance */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Insurance</h6>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600 px-2 py-1 bg-orange-100 rounded">+10% increase</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-white rounded border">
                                  <div className="text-gray-600 mb-1">Current</div>
                                  <div className="font-semibold text-gray-900">${Math.round((property.insurance || 21500) / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
                                  <div className="text-gray-600 mb-1">Phase 2</div>
                                  <div className="font-semibold text-orange-600">${Math.round((property.insurance || 21500) * 1.1 / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-orange-100 rounded border border-orange-200">
                                  <div className="text-gray-600 mb-1">Change</div>
                                  <div className="font-semibold text-orange-600">+${Math.round(((property.insurance || 21500) * 1.1 - (property.insurance || 21500)) / 12).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">Enhanced coverage for improved property</div>
                            </div>
                            
                            {/* Maintenance & Repairs */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Maintenance & Repairs</h6>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600 px-2 py-1 bg-green-100 rounded">-25% savings</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-white rounded border">
                                  <div className="text-gray-600 mb-1">Current</div>
                                  <div className="font-semibold text-gray-900">${Math.round(120000 / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                                  <div className="text-gray-600 mb-1">Phase 2</div>
                                  <div className="font-semibold text-green-600">${Math.round(120000 * 0.75 / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-green-100 rounded border border-green-200">
                                  <div className="text-gray-600 mb-1">Change</div>
                                  <div className="font-semibold text-green-600">-${Math.round((120000 - 120000 * 0.75) / 12).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">Reduced costs from newer systems and equipment</div>
                            </div>
                            
                            {/* Property Management */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Property Management</h6>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600 px-2 py-1 bg-green-100 rounded">-40% fee reduction</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-white rounded border">
                                  <div className="text-gray-600 mb-1">Current (5%)</div>
                                  <div className="font-semibold text-gray-900">${Math.round(((property.businessMetrics?.monthlyGrossIncome || 74441) * 0.05)).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                                  <div className="text-gray-600 mb-1">Phase 2 (3%)</div>
                                  <div className="font-semibold text-green-600">${Math.round((property.businessMetrics?.monthlyGrossIncome || 74441) * 1.15 * 0.03).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-green-100 rounded border border-green-200">
                                  <div className="text-gray-600 mb-1">Net Change</div>
                                  <div className="font-semibold text-green-600">${Math.round((((property.businessMetrics?.monthlyGrossIncome || 74441) * 1.15 * 0.03) - ((property.businessMetrics?.monthlyGrossIncome || 74441) * 0.05))).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">Improved efficiency and reduced fee percentage</div>
                            </div>
                            
                            {/* Utilities */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="font-medium text-gray-900">Utilities (Common Areas)</h6>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600 px-2 py-1 bg-green-100 rounded">-30% energy savings</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-white rounded border">
                                  <div className="text-gray-600 mb-1">Current</div>
                                  <div className="font-semibold text-gray-900">${Math.round(36000 / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                                  <div className="text-gray-600 mb-1">Phase 2</div>
                                  <div className="font-semibold text-green-600">${Math.round(36000 * 0.70 / 12).toLocaleString()}/mo</div>
                                </div>
                                <div className="text-center p-3 bg-green-100 rounded border border-green-200">
                                  <div className="text-gray-600 mb-1">Change</div>
                                  <div className="font-semibold text-green-600">-${Math.round((36000 - 36000 * 0.70) / 12).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">LED lighting and energy-efficient HVAC systems</div>
                            </div>
                            
                            {/* Other Expenses - Condensed */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h6 className="font-medium text-gray-900 mb-3">Other Operating Expenses</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex justify-between p-2 bg-white rounded">
                                    <span className="text-gray-600">Legal & Professional:</span>
                                    <div className="text-right">
                                      <div className="font-medium">${Math.round(18000 / 12).toLocaleString()}/mo</div>
                                      <div className="text-xs text-gray-500">No change</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between p-2 bg-green-100 rounded">
                                    <span className="text-gray-600">Marketing & Leasing:</span>
                                    <div className="text-right">
                                      <div className="font-medium text-green-600">${Math.round(24000 * 0.60 / 12).toLocaleString()}/mo</div>
                                      <div className="text-xs text-green-600">-40% (better retention)</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between p-2 bg-white rounded">
                                    <span className="text-gray-600">Janitorial & Cleaning:</span>
                                    <div className="text-right">
                                      <div className="font-medium">${Math.round(15600 / 12).toLocaleString()}/mo</div>
                                      <div className="text-xs text-gray-500">No change</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between p-2 bg-orange-100 rounded">
                                    <span className="text-gray-600">Landscaping & Grounds:</span>
                                    <div className="text-right">
                                      <div className="font-medium text-orange-600">${Math.round(14400 * 1.20 / 12).toLocaleString()}/mo</div>
                                      <div className="text-xs text-orange-600">+20% (premium grounds)</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between p-2 bg-white rounded">
                                    <span className="text-gray-600">Administrative & Other:</span>
                                    <div className="text-right">
                                      <div className="font-medium">${Math.round(12000 / 12).toLocaleString()}/mo</div>
                                      <div className="text-xs text-gray-500">No change</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between p-2 bg-white rounded">
                                    <span className="text-gray-600">Trash & Pest Control:</span>
                                    <div className="text-right">
                                      <div className="font-medium">${Math.round(9600 / 12).toLocaleString()}/mo</div>
                                      <div className="text-xs text-gray-500">No change</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expense Change Analysis */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h5 className="font-semibold text-blue-800 mb-3">Key Expense Changes (Phase 2)</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-red-100 rounded-lg p-3">
                              <div className="font-semibold text-red-800 mb-1">Expense Increases</div>
                              <div className="space-y-1 text-red-700">
                                <div>• Property taxes: +15% (higher value)</div>
                                <div>• Insurance: +10% (enhanced coverage)</div>
                                <div>• Landscaping: +20% (premium grounds)</div>
                              </div>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3">
                              <div className="font-semibold text-green-800 mb-1">Expense Savings</div>
                              <div className="space-y-1 text-green-700">
                                <div>• Maintenance: -25% (newer systems)</div>
                                <div>• Utilities: -30% (energy efficiency)</div>
                                <div>• Marketing: -40% (higher retention)</div>
                                <div>• Management: -40% fee reduction</div>
                              </div>
                            </div>
                            <div className="bg-purple-100 rounded-lg p-3">
                              <div className="font-semibold text-purple-800 mb-1">Net Impact</div>
                              <div className="space-y-1 text-purple-700">
                                <div>• Net expense increase: +2%</div>
                                <div>• Revenue increase: +15%</div>
                                <div>• NOI improvement: +26%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* OpEx Ratio Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-gray-100 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">{(((property.businessMetrics?.operatingExpenses || 466000) / ((property.businessMetrics?.monthlyGrossIncome || 97000) * 12)) * 100).toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Current OpEx Ratio</div>
                          </div>
                          <div className="text-center p-4 bg-green-100 rounded-lg">
                            <div className="text-lg font-bold text-green-700">{((((property.businessMetrics?.operatingExpenses || 466000) * 0.98) / (((property.businessMetrics?.monthlyGrossIncome || 97000) * 1.15) * 12)) * 100).toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Optimized OpEx Ratio</div>
                          </div>
                          <div className="text-center p-4 bg-blue-100 rounded-lg">
                            <div className="text-lg font-bold text-blue-700">${Math.round(((property.businessMetrics?.operatingExpenses || 466000) / 12) / (beds || 97))}</div>
                            <div className="text-sm text-gray-600">Current OpEx/Unit/Mo</div>
                          </div>
                          <div className="text-center p-4 bg-purple-100 rounded-lg">
                            <div className="text-lg font-bold text-purple-700">${Math.round((((property.businessMetrics?.operatingExpenses || 466000) / 12) * 0.98) / (beds || 97))}</div>
                            <div className="text-sm text-gray-600">Optimized OpEx/Unit/Mo</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comprehensive Enhanced Return Analysis */}
                      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Enhanced Return Analysis</h3>
                          <p className="text-gray-600">Long-term performance projections including value-add improvements</p>
                        </div>
                        
                        {/* Enhanced Key Return Metrics */}
                        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-8 mb-8">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                              <div className="text-4xl font-bold mb-2">{((property.tokenization?.equityYield || 6.5) * 1.22).toFixed(1)}%</div>
                              <div className="text-green-100 font-medium">Enhanced Annual Cash Yield</div>
                              <div className="text-green-200 text-sm mt-1">vs. {(property.tokenization?.equityYield || 6.5).toFixed(1)}% current</div>
                            </div>
                            <div>
                              <div className="text-4xl font-bold mb-2">{((property.tokenization?.projectedAnnualizedReturn || 16.5) * 1.15).toFixed(1)}%</div>
                              <div className="text-blue-100 font-medium">Enhanced 5-Year IRR</div>
                              <div className="text-blue-200 text-sm mt-1">Cash flow + enhanced appreciation</div>
                            </div>
                            <div>
                              <div className="text-4xl font-bold mb-2">${((property.tokenization?.fiveYearTotalReturnPerToken || 825) * 1.35).toLocaleString()}</div>
                              <div className="text-yellow-100 font-medium">Enhanced Total Return</div>
                              <div className="text-yellow-200 text-sm mt-1">Per $1,000 token over 5 years</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Staged Investment Performance Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Staged Performance Timeline</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                  <div className="font-medium">Phase 1 (Months 1-6)</div>
                                  <div className="text-sm text-gray-600">Acquisition + quick wins</div>
                                </div>
                                <div className="font-bold text-blue-600">{(property.tokenization?.equityYield || 6.4).toFixed(1)}%</div>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div>
                                  <div className="font-medium">Months 6-9</div>
                                  <div className="text-sm text-gray-600">Proof of concept period</div>
                                </div>
                                <div className="font-bold text-orange-600">{((property.tokenization?.equityYield || 6.4) * 1.08).toFixed(1)}%</div>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                  <div className="font-medium">Phase 2+ (Year 1+)</div>
                                  <div className="text-sm text-gray-600">Enhanced returns</div>
                                </div>
                                <div className="font-bold text-green-600">{((property.tokenization?.equityYield || 6.4) * 1.22).toFixed(1)}%</div>
                              </div>
                              
                              <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
                                <div className="text-sm font-semibold text-gray-800 mb-2">Phase 1 Investor Advantage</div>
                                <div className="text-xs text-gray-700">
                                  • Lower entry risk with proven management
                                  <br />• First rights to additional phases
                                  <br />• Larger percentage ownership
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Phase 1 vs Phase 2 Comparison</h4>
                            
                            {/* Phase 1 Investment */}
                            <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                              <h5 className="font-semibold text-blue-800 mb-2">Phase 1: $10,000 Investment</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Monthly Income:</span>
                                  <span className="font-semibold text-blue-800">${Math.round((property.tokenization?.netMonthlyCashFlowPerToken || 5.36) * 10)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Ownership Percentage:</span>
                                  <span className="font-semibold text-blue-800">{(10000 / 3500000 * 100).toFixed(2)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Phase 2 Rights:</span>
                                  <span className="font-semibold text-blue-800">Yes</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Phase 2 Enhanced Returns */}
                            <div className="p-3 bg-green-100 rounded-lg">
                              <h5 className="font-semibold text-green-800 mb-2">After Phase 2 (same investor)</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-green-700">Enhanced Monthly Income:</span>
                                  <span className="font-semibold text-green-800">${Math.round(((property.tokenization?.netMonthlyCashFlowPerToken || 5.36) * 1.22) * 10)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Property Value Increase:</span>
                                  <span className="font-semibold text-green-800">+28%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">5-Year Total Value:</span>
                                  <span className="font-semibold text-green-800">${(10000 + Math.round(((property.tokenization?.fiveYearTotalReturnPerToken || 825) * 1.35) * 10)).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-center">
                              <div className="text-xs text-gray-600">* Phase 1 investors can participate in Phase 2 for additional upside</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Car Wash Growth Opportunities Section */}
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 mb-8">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">🚀 Business Growth Opportunities</h3>
                          <p className="text-gray-600">Strategic improvements to increase car wash revenue and operational efficiency</p>
                        </div>
                        
                        {/* Current vs Enhanced Performance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          {/* Current Performance */}
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Current Performance</h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Daily Car Volume:</span>
                                <span className="font-medium">1,200 washes</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Gross Revenue:</span>
                                <span className="font-medium">$120,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Annual Gross Revenue:</span>
                                <span className="font-medium">$1,440,000</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
                                <span className="text-gray-900">Current Cash-on-Cash Return:</span>
                                <span className="text-blue-600">8.0%</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Performance */}
                          <div className="bg-green-100 rounded-xl p-6 shadow-sm border-2 border-green-300">
                            <div className="flex items-center justify-center mb-4">
                              <h4 className="text-lg font-semibold text-gray-900 mr-2">After Enhancements</h4>
                              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">+25% Revenue</span>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Enhanced Daily Volume:</span>
                                <span className="font-medium text-green-700">1,500 washes</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">New Monthly Gross Revenue:</span>
                                <span className="font-medium text-green-700">$150,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">New Annual Gross Revenue:</span>
                                <span className="font-medium text-green-700">$1,800,000</span>
                              </div>
                              <div className="flex justify-between border-t border-green-200 pt-3 font-semibold">
                                <span className="text-gray-900">Enhanced Cash-on-Cash Return:</span>
                                <span className="text-green-600">12.5%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Suggested Improvements */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-center mb-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📱</span>
                              </div>
                              <h5 className="font-semibold text-gray-900">Digital & Automation</h5>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Mobile App & Loyalty:</span>
                                <span className="font-medium">$25,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">RFID/License Recognition:</span>
                                <span className="font-medium">$35,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Enhanced POS System:</span>
                                <span className="font-medium">$15,000</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                                <span className="text-gray-900">Total Investment:</span>
                                <span className="text-blue-600">$75,000</span>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 mt-3">
                                <div className="text-xs text-blue-800">
                                  <strong>Revenue Impact:</strong> +15% customer retention
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-center mb-4">
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🛍️</span>
                              </div>
                              <h5 className="font-semibold text-gray-900">Service Expansion</h5>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Detail Service Bays:</span>
                                <span className="font-medium">$85,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Express Lube Service:</span>
                                <span className="font-medium">$45,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Retail Convenience Store:</span>
                                <span className="font-medium">$35,000</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                                <span className="text-gray-900">Total Investment:</span>
                                <span className="text-green-600">$165,000</span>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3 mt-3">
                                <div className="text-xs text-green-800">
                                  <strong>Revenue Addition:</strong> +$8,000/month
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-center mb-4">
                              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">⚙️</span>
                              </div>
                              <h5 className="font-semibold text-gray-900">Operational Efficiency</h5>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Water Recovery Upgrade:</span>
                                <span className="font-medium">$45,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tunnel Speed Optimization:</span>
                                <span className="font-medium">$25,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Energy-Efficient Equipment:</span>
                                <span className="font-medium">$35,000</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                                <span className="text-gray-900">Total Investment:</span>
                                <span className="text-purple-600">$105,000</span>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3 mt-3">
                                <div className="text-xs text-purple-800">
                                  <strong>Cost Savings:</strong> -$3,500/month operating costs
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Investment Summary */}
                        <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl p-8">
                          <h4 className="text-2xl font-bold text-center mb-6">Business Enhancement Summary</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-6">
                            <div>
                              <div className="text-3xl font-bold text-yellow-300 mb-2">$345,000</div>
                              <div className="text-gray-300 text-sm">Total Investment Required</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-green-300 mb-2">$34,500</div>
                              <div className="text-gray-300 text-sm">Monthly Revenue Increase</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-blue-300 mb-2">120%</div>
                              <div className="text-gray-300 text-sm">ROI on Improvements</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-purple-300 mb-2">12-18</div>
                              <div className="text-gray-300 text-sm">Months to Payback</div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <h5 className="text-xl font-semibold mb-3">Projected Investor Benefits</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="bg-white/10 rounded-lg p-4">
                                <div className="font-semibold text-green-300">Monthly Dividend Increase</div>
                                <div className="text-2xl font-bold">+$115</div>
                                <div className="text-xs text-gray-300">per token per month</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4">
                                <div className="font-semibold text-blue-300">Annual Yield Increase</div>
                                <div className="text-2xl font-bold">+27.6%</div>
                                <div className="text-xs text-gray-300">additional cash-on-cash return</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-4">
                                <div className="font-semibold text-purple-300">Business Value Increase</div>
                                <div className="text-2xl font-bold">$2.3M</div>
                                <div className="text-xs text-gray-300">based on enhanced cash flows</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-white/10 rounded-lg">
                            <p className="text-sm text-center text-gray-200">
                              <strong>Implementation Timeline:</strong> Business enhancements can be implemented over 12-18 months 
                              with minimal operational disruption. Service expansions and technology upgrades are staged to maintain 
                              continuous revenue while maximizing customer satisfaction and operational efficiency.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ownership History Tab */}
                  {activeTab === 'ownership' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ownership History</h2>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-blue-600 font-medium">📈 Subscribe to Intelligence</span>
                          <span className="text-sm text-gray-500">View ownership history data!</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">Access detailed ownership records, transfer dates, and ownership duration for this commercial car wash property to understand business stability and investment history.</p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Date</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Owner</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Transfer Type</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Sale Price</th>
                              <th className="text-left py-3 text-sm font-semibold text-gray-900">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { date: 'Current', owner: 'FractionaX Holdings LLC', type: 'Listed for Tokenization', price: price, duration: 'Active' },
                              { date: 'Aug 2022', owner: 'Orca Splash Express LLC', type: 'Commercial Purchase', price: Math.round(price * 0.88), duration: '2 years' },
                              { date: 'Jun 2020', owner: 'Houston Car Wash Partners', type: 'Business Acquisition', price: Math.round(price * 0.75), duration: '2 years' },
                              { date: 'Mar 2018', owner: 'Sunbelt Development Corp', type: 'New Construction', price: Math.round(price * 0.65), duration: '2 years' },
                              { date: 'Jan 2017', owner: 'Land Holdings Texas LLC', type: 'Land Purchase', price: Math.round(price * 0.25), duration: '1 year' },
                            ].map((entry, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-3 text-sm text-gray-900">{entry.date}</td>
                                <td className="py-3 text-sm text-gray-900">{entry.owner}</td>
                                <td className="py-3 text-sm text-gray-900">{entry.type}</td>
                                <td className="py-3 text-sm text-gray-900">${entry.price.toLocaleString()}</td>
                                <td className="py-3 text-sm text-gray-900">{entry.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Property History Analysis */}
                      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercial Property Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">7 Years</div>
                            <div className="text-sm text-gray-600">Property Operating History</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
                            <div className="text-sm text-gray-600">Business Operational Uptime</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">4.2x</div>
                            <div className="text-sm text-gray-600">Value Appreciation Since Construction</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Investment Highlights</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Consistent operational performance since 2018 construction</li>
                            <li>• Stable ownership transitions with business continuity</li>
                            <li>• Strong value appreciation in high-traffic Houston corridor</li>
                            <li>• Professional management throughout ownership history</li>
                            <li>• No significant operational disruptions or environmental issues</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Building Details Tab */}
                  {activeTab === 'building' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-gray-900">Facility Specifications</h2>
                        <div className="flex gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Modern Facility</span>
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Fully Operational</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">Comprehensive facility analysis of the Orca Splash Express car wash operations and infrastructure.</p>
                      
                      {/* Facility Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-blue-600 font-medium">Facility Age</div>
                          <div className="text-2xl font-bold text-blue-700">{2024 - (yearBuilt || 2018)} Yrs</div>
                          <div className="text-xs text-blue-600">Built in {yearBuilt || 2018}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-600 font-medium">Equipment Condition</div>
                          <div className="text-2xl font-bold text-green-700">9.1/10</div>
                          <div className="text-xs text-green-600">Excellent condition</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-purple-600 font-medium">Automation Level</div>
                          <div className="text-2xl font-bold text-purple-700">High</div>
                          <div className="text-xs text-purple-600">Fully automated</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-center">
                          <div className="text-sm text-orange-600 font-medium">Environmental Rating</div>
                          <div className="text-2xl font-bold text-orange-700">A</div>
                          <div className="text-xs text-orange-600">Water reclamation</div>
                        </div>
                      </div>

                      {/* Detailed Facility Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Facility Specifications */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-bold">🚗</span>
                            </div>
                            Facility Specifications
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-600">Property Type</div>
                                  <div className="font-semibold text-gray-900">Express Car Wash</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Facility Class</div>
                                  <div className="font-semibold text-gray-900">Premium</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Express Tunnels</div>
                                  <div className="font-semibold text-gray-900">{property.businessMetrics?.expressTunnels || 3} tunnels</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Tunnel Length</div>
                                  <div className="font-semibold text-gray-900">120 ft each</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Building Area</div>
                                  <div className="font-semibold text-gray-900">{(sqft || 12500).toLocaleString()} sq ft</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Vacuum Stations</div>
                                  <div className="font-semibold text-gray-900">{property.businessMetrics?.vacuumStations || 16} units</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Lot Size</div>
                                  <div className="font-semibold text-gray-900">{property.lotSize || 2.3} acres</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Customer Parking</div>
                                  <div className="font-semibold text-gray-900">45 spaces</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="text-sm text-blue-800">
                                <strong>Zoning:</strong> Commercial (C-2) • <strong>Water Usage:</strong> 15% of original (85% reclaim) • <strong>Compliance:</strong> Full EPA
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Equipment & Technology */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-green-600 font-bold">⚙️</span>
                            </div>
                            Equipment & Technology
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Wash Equipment</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Conveyor System:</span>
                                  <span className="font-medium">Chain-driven, variable speed</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Wash Chemistry:</span>
                                  <span className="font-medium">Automated dispensing</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Drying System:</span>
                                  <span className="font-medium">High-velocity blowers</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Water System:</span>
                                  <span className="font-medium">High-pressure pumps</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Support Systems</h4>
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Water Reclaim:</span>
                                  <span className="font-medium">85% reclamation system</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment Systems:</span>
                                  <span className="font-medium">Credit card, mobile app, cash</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">POS Integration:</span>
                                  <span className="font-medium">Cloud-based management</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Security:</span>
                                  <span className="font-medium">24/7 monitoring, cameras</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="text-sm text-green-800">
                                <strong>Equipment Age:</strong> Primary equipment 3-5 years • Water reclaim system 2020 • POS system updated 2023
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unit Mix & Floor Plans */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-bold">📐</span>
                          </div>
                          Unit Mix & Floor Plans
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-blue-800">1BR/1BA Units</h4>
                              <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded">32 units</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Average Size:</span>
                                <span className="font-medium">650 sq ft</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Floor Plans:</span>
                                <span className="font-medium">2 variations</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Features:</span>
                                <span className="font-medium">Walk-in closets</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Balcony/Patio:</span>
                                <span className="font-medium">85% of units</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-green-800">2BR/1BA Units</h4>
                              <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded">45 units</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-green-700">Average Size:</span>
                                <span className="font-medium">900 sq ft</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-700">Floor Plans:</span>
                                <span className="font-medium">3 variations</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-700">Features:</span>
                                <span className="font-medium">Dining areas</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-700">Balcony/Patio:</span>
                                <span className="font-medium">90% of units</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-purple-800">2BR/2BA Units</h4>
                              <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded">20 units</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-purple-700">Average Size:</span>
                                <span className="font-medium">1,100 sq ft</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Floor Plans:</span>
                                <span className="font-medium">2 variations</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Features:</span>
                                <span className="font-medium">Master suites</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Balcony/Patio:</span>
                                <span className="font-medium">100% of units</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amenities & Common Areas */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-orange-600 font-bold">🏊</span>
                            </div>
                            Current Amenities
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Swimming Pool</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Fitness Center</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Clubhouse</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Laundry Facilities</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Covered Parking</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Playground</span>
                            </div>
                            <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Basic Business Center</span>
                            </div>
                            <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Older Appliances</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-green-600 font-bold">✨</span>
                            </div>
                            Planned Upgrades (Phase 2)
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Pool Renovation</span>
                            </div>
                            <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Enhanced Fitness</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Modern Clubhouse</span>
                            </div>
                            <div className="flex items-center p-2 bg-green-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Co-working Spaces</span>
                            </div>
                            <div className="flex items-center p-2 bg-purple-50 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Smart Technology</span>
                            </div>
                            <div className="flex items-center p-2 bg-purple-50 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">LED Lighting</span>
                            </div>
                            <div className="flex items-center p-2 bg-orange-50 rounded-lg">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">EV Charging</span>
                            </div>
                            <div className="flex items-center p-2 bg-orange-50 rounded-lg">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Package Lockers</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Capital Expenditure Analysis */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold">💰</span>
                          </div>
                          Capital Expenditure Analysis
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Annual CapEx Reserve</div>
                            <div className="text-lg font-bold text-blue-600">${Math.round((price || 10775000) * 0.005 / 1000)}K</div>
                            <div className="text-xs text-gray-500">0.5% of property value</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Near-term CapEx</div>
                            <div className="text-lg font-bold text-orange-600">$285K</div>
                            <div className="text-xs text-gray-500">Next 2-3 years</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">Phase 2 Investment</div>
                            <div className="text-lg font-bold text-green-600">$1.3M</div>
                            <div className="text-xs text-gray-500">Major renovations</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">ROI on Improvements</div>
                            <div className="text-lg font-bold text-purple-600">18.5%</div>
                            <div className="text-xs text-gray-500">Projected return</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Near-term Capital Needs:</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• HVAC system replacements (select units): $85K</li>
                              <li>• Exterior painting and siding repair: $65K</li>
                              <li>• Parking lot resurfacing: $45K</li>
                              <li>• Plumbing fixture updates: $35K</li>
                              <li>• Common area refreshes: $55K</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Long-term Value Creation:</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Kitchen/bathroom renovations: $850K</li>
                              <li>• Amenity upgrades & expansion: $275K</li>
                              <li>• Energy efficiency improvements: $125K</li>
                              <li>• Technology integration: $75K</li>
                              <li>• Landscaping & exterior upgrades: $95K</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Insights Tab */}
                  {activeTab === 'insights' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Insights</h2>
                      
                      {/* Schools */}
                      {schools && schools.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Schools</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {schools.map((school, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="font-medium text-gray-900">{school.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{school.distance} miles</div>
                                <div className="flex items-center mt-2">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium ml-1">{school.rating}/10</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="text-gray-500">
                          <FiMapPin className="w-12 h-12 mx-auto mb-2" />
                          <p>Additional location insights available with premium subscription.</p>
                          <p className="text-sm mt-2">Contact our team for more information.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Insights Tab (conditional) */}
                  {activeTab === 'ai' && property.aiIntelligence && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Insights</h2>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center mb-4">
                          <BsRobot className="w-8 h-8 text-blue-600 mr-3" />
                          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Analysis</h3>
                        </div>
                        <div className="prose max-w-none text-gray-700">
                          <p>{property.aiIntelligence.analysis || 'AI analysis is being generated for this property...'}</p>
                        </div>
                      </div>
                      
                      {property.aiIntelligence.recommendations && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                          <div className="space-y-4">
                            {property.aiIntelligence.recommendations.map((rec, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                                    <p className="text-gray-600 text-sm">{rec.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {property.aiIntelligence.marketScore && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{property.aiIntelligence.marketScore}/100</div>
                            <div className="text-sm text-gray-600">Market Score</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{property.aiIntelligence.investmentGrade || 'A-'}</div>
                            <div className="text-sm text-gray-600">Investment Grade</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{property.aiIntelligence.riskLevel || 'Low'}</div>
                            <div className="text-sm text-gray-600">Risk Level</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fullscreen Modal */}
        {isFullscreenOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative max-w-screen-xl max-h-screen mx-4">
              {/* Close Button */}
              <button
                onClick={closeFullscreen}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                aria-label="Close fullscreen"
              >
                <X className="w-8 h-8" />
              </button>
              
              {/* Fullscreen Image */}
              <img
                src={propertyImages[currentImageIndex]}
                alt={`${title} - Photo ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Fullscreen Navigation */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="w-10 h-10" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="w-10 h-10" />
                  </button>
                </>
              )}
              
              {/* Fullscreen Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium">
                {currentImageIndex + 1} / {propertyImages.length}
              </div>
            </div>
          </div>
        )}

        {/* CoreLogic Login Modal */}
        <CoreLogicLoginModal />
        
        {/* FXCT Confirmation Modal */}
        <FXCTConfirmationModal />
      </div>
    </>
  );
};

export default PropertyDetails;