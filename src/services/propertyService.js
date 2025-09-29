/**
 * 🏠 Property Service - Backend Integration
 * 
 * Connects the frontend to the FractionaX backend API for property data
 * Uses the unified property API endpoints from your backend
 */

const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

/**
 * Fetch property by ID from backend
 * Uses the unified property details endpoint
 */
export const fetchPropertyById = async (propertyId) => {
  try {
    console.log('🏠 Fetching property from backend:', propertyId);
    
    // For Houston 97 unit apartment complex, use detailed frontend data
    if (propertyId === 'CL-2024-TX-4897') {
      console.log('🏠 Loading detailed Houston 97 unit data from frontend');
      return getHouston97UnitData();
    }
    
    // For Orca Splash Express Car Wash, use detailed frontend data
    if (propertyId === 'CL-2024-TX-6298') {
      console.log('🚗 Loading detailed Orca Car Wash data from frontend');
      return getOrcaCarWashData();
    }
    
    // For Raising Cane's Des Plaines, use detailed frontend data
    if (propertyId === 'CL-2024-IL-2069') {
      console.log('🍗 Loading detailed Raising Cane\'s Des Plaines data from frontend');
      return getRaisingCanesDesPlaines();
    }
    
    // For Life Time Fitness Kansas, use detailed frontend data
    if (propertyId === 'CL-2024-KS-8392') {
      console.log('🏋️ Loading detailed Life Time Fitness Kansas data from frontend');
      return getLifeTimeFitnessKansas();
    }
    
    // For "discover" ID, use the discovery endpoint
    if (propertyId === 'discover') {
      const response = await fetch(`${API_URL}/api/properties/discover?location=Houston,TX&limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to discover property');
      }
      
      return transformBackendProperty(data.data);
    }
    
    // For other property IDs, try direct lookup
    const response = await fetch(`${API_URL}/api/properties/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Property not found: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch property');
    }

    return transformBackendProperty(data.data || data.property);
    
  } catch (error) {
    console.error('❌ Error fetching property from backend:', error);
    throw error;
  }
};

/**
 * Discover properties from backend
 * Uses the unified property discovery endpoint
 */
export const fetchPropertiesFromBackend = async (searchParams = {}) => {
  try {
    console.log('🔍 Discovering properties from backend:', searchParams);
    
    const {
      location = "Houston, TX",
      intelligence = "standard",
      limit = 12,
      propertyTypes = ["Multifamily", "Business"]
    } = searchParams;
    
    const params = new URLSearchParams({
      location,
      intelligence,
      limit: limit.toString(),
      propertyTypes: propertyTypes.join(',')
    });

    const response = await fetch(`${API_URL}/api/properties/discover?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Discovery failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to discover properties');
    }

    return {
      properties: data.properties.map(transformBackendProperty),
      searchMetadata: data.searchMetadata,
      systemStatus: data.systemStatus
    };
    
  } catch (error) {
    console.error('❌ Error discovering properties from backend:', error);
    throw error;
  }
};

/**
 * Get featured properties from backend
 */
export const fetchFeaturedProperties = async () => {
  try {
    console.log('⭐ Fetching featured properties from backend');
    
    const response = await fetch(`${API_URL}/api/properties/featured`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Featured properties failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch featured properties');
    }

    return data.properties.map(transformBackendProperty);
    
  } catch (error) {
    console.error('❌ Error fetching featured properties from backend:', error);
    throw error;
  }
};

/**
 * Transform backend property data to frontend format
 */
const transformBackendProperty = (backendProperty) => {
  // Handle both unified API format and direct property format
  const property = backendProperty.data || backendProperty;
  
  return {
    // Core property info
    id: property.id || property._id || property.zpid,
    title: property.title || `${property.beds || 'N/A'}-Bedroom Property`,
    address: property.address || `${property.streetAddress || ''}, ${property.city || ''}, ${property.state || ''}`.trim(),
    city: property.city,
    state: property.state,
    
    // Property specs
    price: property.price || property.zestimate || 0,
    beds: property.beds || property.bedrooms || 0,
    baths: property.baths || property.bathrooms || 0,
    sqft: property.sqft || property.livingArea || 0,
    yearBuilt: property.yearBuilt || new Date().getFullYear() - 10,
    
    // Property type and categorization
    propertyType: determinePropertyType(property),
    subcategory: determineSubcategory(property),
    
    // Images
    images: property.images || (property.imgSrc ? [property.imgSrc] : [generatePlaceholderImage()]),
    imgSrc: property.imgSrc || property.images?.[0] || generatePlaceholderImage(),
    
    // Financial data
    monthlyRent: property.monthlyRent || property.rentEstimate || calculateEstimatedRent(property),
    expectedROI: property.expectedROI || calculateExpectedROI(property),
    
    // Business metrics (for commercial properties)
    businessMetrics: property.businessMetrics || generateBusinessMetrics(property),
    
    // Tokenization data
    tokenization: property.tokenization || generateTokenizationData(property),
    
    // Property details
    description: property.description || generateDescription(property),
    features: property.features || [],
    neighborhood: property.neighborhood || {},
    
    // Additional data
    listingDate: property.listingDate || new Date().toISOString(),
    agent: property.agent || { name: "FractionaX Team", phone: "(555) 123-4567" },
    
    // Intelligence data (if available from backend)
    intelligence: property.intelligence || {},
    aiIntelligence: property.aiIntelligence || null,
    
    // Location data
    coordinates: property.coordinates || { lat: 29.7604, lng: -95.3698 }, // Default to Houston
    schools: property.schools || []
  };
};

/**
 * Determine property type from backend data
 */
const determinePropertyType = (property) => {
  if (property.propertyType) return property.propertyType;
  
  // Analyze property characteristics
  const beds = property.beds || property.bedrooms || 0;
  const units = property.units || beds;
  const businessType = property.businessType || property.subcategory;
  
  if (businessType && businessType.toLowerCase().includes('car wash')) {
    return 'Business';
  }
  
  if (units >= 5) {
    return 'Multifamily';
  }
  
  return 'Residential';
};

/**
 * Determine subcategory from backend data
 */
const determineSubcategory = (property) => {
  if (property.subcategory) return property.subcategory;
  
  const businessType = property.businessType;
  if (businessType) {
    if (businessType.toLowerCase().includes('car wash')) return 'Car Wash';
    return businessType;
  }
  
  const beds = property.beds || property.bedrooms || 0;
  if (beds >= 50) return 'Apartment Complex';
  if (beds >= 10) return 'Multi-Unit Building';
  
  return 'Single Family';
};

/**
 * Calculate estimated rent if not provided
 */
const calculateEstimatedRent = (property) => {
  const price = property.price || property.zestimate || 0;
  const sqft = property.sqft || property.livingArea || 1200;
  
  // Use 1% rule as baseline, adjust by square footage
  const baseRent = price * 0.01;
  const sqftAdjustment = Math.max(0.8, Math.min(1.2, sqft / 1500)); // Adjust based on size
  
  return Math.round(baseRent * sqftAdjustment);
};

/**
 * Calculate expected ROI
 */
const calculateExpectedROI = (property) => {
  const price = property.price || property.zestimate || 0;
  const monthlyRent = property.monthlyRent || property.rentEstimate || calculateEstimatedRent(property);
  
  if (!price || !monthlyRent) return 8.0; // Default ROI
  
  const annualRent = monthlyRent * 12;
  const grossYield = (annualRent / price) * 100;
  
  // Estimate net ROI (accounting for expenses)
  return Math.max(4.0, Math.min(15.0, grossYield * 0.7));
};

/**
 * Generate business metrics for commercial properties
 */
const generateBusinessMetrics = (property) => {
  const propertyType = determinePropertyType(property);
  const subcategory = determineSubcategory(property);
  
  if (propertyType === 'Business' && subcategory === 'Car Wash') {
    return {
      monthlyGrossIncome: 120000,
      netOperatingIncome: 600000, // Annual
      operatingExpenses: 540000, // Annual
      expressTunnels: 3,
      vacuumStations: 16,
      occupancyRate: 0.85,
      businessType: 'Car Wash'
    };
  }
  
  if (propertyType === 'Multifamily') {
    const beds = property.beds || property.bedrooms || 97;
    const monthlyRent = calculateEstimatedRent(property);
    
    return {
      monthlyGrossIncome: monthlyRent * beds,
      netOperatingIncome: monthlyRent * beds * 12 * 0.7, // 30% expense ratio
      operatingExpenses: monthlyRent * beds * 12 * 0.3,
      units: beds,
      occupancyRate: 0.94,
      avgRentPerUnit: monthlyRent
    };
  }
  
  return {};
};

/**
 * Generate tokenization data
 */
const generateTokenizationData = (property) => {
  const price = property.price || property.zestimate || 1000000;
  const monthlyRent = property.monthlyRent || calculateEstimatedRent(property);
  const propertyType = determinePropertyType(property);
  
  let tokenPrice = 1000; // Default for multifamily
  if (propertyType === 'Business') tokenPrice = 5000;
  
  const totalTokens = Math.floor(price * 0.25 / tokenPrice); // 25% tokenized
  const netMonthlyCashFlowPerToken = (monthlyRent * 0.7) / totalTokens; // 70% to investors
  const equityYield = (netMonthlyCashFlowPerToken * 12 / tokenPrice) * 100;
  
  return {
    tokenPrice,
    totalTokens,
    netMonthlyCashFlowPerToken: Math.round(netMonthlyCashFlowPerToken * 100) / 100,
    equityYield: Math.round(equityYield * 100) / 100,
    projectedAnnualizedReturn: Math.max(12, equityYield * 1.8), // Include appreciation
    fiveYearTotalReturnPerToken: Math.round(netMonthlyCashFlowPerToken * 60 + tokenPrice * 0.3) // 5 years cash flow + 30% appreciation
  };
};

/**
 * Generate property description
 */
const generateDescription = (property) => {
  const propertyType = determinePropertyType(property);
  const beds = property.beds || property.bedrooms || 3;
  const city = property.city || 'Houston';
  const state = property.state || 'TX';
  
  if (propertyType === 'Business') {
    return `Modern commercial car wash facility located in ${city}, ${state}. This fully operational business features automated wash systems, multiple service bays, and strong cash flow generation. Perfect for fractional investment opportunities.`;
  }
  
  if (propertyType === 'Multifamily') {
    return `${beds}-unit multifamily property in ${city}, ${state}. Well-maintained building with strong rental history and excellent cash flow potential. Ideal for fractional real estate investment.`;
  }
  
  return `Beautiful ${beds}-bedroom property in ${city}, ${state}. Great investment opportunity with strong rental potential and appreciation prospects.`;
};

/**
 * Generate placeholder image URL
 */
const generatePlaceholderImage = () => {
  const imageIds = [1564013, 1643383, 2102587, 2343465, 2346119];
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&w=800&q=80`;
};

/**
 * Get detailed Houston 97 Unit Apartment Complex data
 */
const getHouston97UnitData = () => {
  return {
    id: 'CL-2024-TX-4897',
    clipId: 'CL-2024-TX-4897',
    title: 'Houston 97 Unit Apartment Complex',
    slug: 'houston-97-unit-apartment-complex',
    address: '1234 Example St. Houston, TX, 77077',
    city: 'Houston',
    state: 'TX',
    zipCode: '77077',
    price: 10775000,
    beds: 97,
    baths: 97,
    sqft: 48960,
    propertyType: 'Multifamily',
    subcategory: 'Apartment Building',
    yearBuilt: 1961,
    yearRenovated: 2023,
    lotSize: '3.2 acres',
    coordinates: { lat: 29.7604, lng: -95.3698 },
    images: [
      '/images/properties/houston-97-unit/Main photo(cover photo).jpg',
      '/images/properties/houston-97-unit/Side View photo.jpg',
      '/images/properties/houston-97-unit/Interor.jpg',
      '/images/properties/houston-97-unit/Interor 2.jpg',
      '/images/properties/houston-97-unit/interor 3.jpg',
      '/images/properties/houston-97-unit/interor 4.jpg',
      '/images/properties/houston-97-unit/Interor 5.jpg',
      '/images/properties/houston-97-unit/Interor 6.jpg'
    ],
    description: '🏢 HOUSTON 97-UNIT APARTMENT COMPLEX - Institutional multifamily investment with 70% bank financing! Investors fund only $3.23M (30%) while bank provides $7.55M loan. Strong 8.29% NOI of $893K annually with professional property management. Recently renovated building in growing Houston market.',
    detailedDescription: 'This exceptional 97-unit apartment building represents a premier institutional-quality investment in Houston\'s thriving rental market. Built in 1961 and completely renovated in 2023, this 48,960 sq ft complex demonstrates the perfect value-add success story with 70% bank financing that amplifies investor returns. The financing structure allows investors to fund only 30% ($3.23M) while the bank provides $7.55M, creating leveraged returns of 11.28% cash-on-cash. With professional management, strong NOI of $893,302, and Houston\'s 4.2% population growth, this represents institutional-quality multifamily investing with excellent debt coverage and monthly distributions to investors.',
    features: ['recently_renovated_2023', '97_units', '3_stories', 'houston_location', 'strong_noi', 'apartment_building', 'multifamily', 'cash_flowing', 'stable_investment', 'houston_growth_market'],
    expectedROI: 6.98,
    monthlyRent: 97000,
    hoa: 0,
    taxes: 129000,
    insurance: 21500,
    agent: {
      name: 'Lorenzo Martinez',
      phone: '(713) 555-0897',
      email: 'lorenzo@houstonmultifamily.com',
      company: 'Houston Investment Properties',
      photo: '/api/placeholder/100/100',
      license: 'TX-789012'
    },
    stats: {
      views: 876,
      saves: 156,
      daysOnMarket: 1,
      pricePerSqft: 220,
      priceHistory: [{ date: '2024-09-25', price: 10775000, event: 'Listed' }]
    },
    neighborhood: {
      name: 'Southwest Houston',
      walkability: 65,
      transitScore: 58,
      bikeScore: 52
    },
    schools: [
      { name: 'Westbury High School', rating: 7, distance: 0.8 },
      { name: 'Piney Point Elementary', rating: 8, distance: 1.2 },
      { name: 'Pin Oak Middle School', rating: 7, distance: 1.5 }
    ],
    businessMetrics: {
      propertyUnits: 97,
      averageRent: 973,
      monthlyGrossIncome: 94442,
      annualGrossIncome: 1133300,
      operatingExpenses: 239998,
      netOperatingIncome: 893302,
      occupancyRate: 95,
      vacancyRate: 5,
      capRate: 8.29,
      grossRentMultiplier: 9.5,
      pricePerUnit: 111082,
      operatingExpenseRatio: 21.2,
      propertyManagementFee: 56665,
      
      // Unit Mix Details
      unitMix: {
        oneBR: { count: 28, avgRent: 875, totalMonthlyRent: 24500 },
        twoBR: { count: 52, avgRent: 1125, totalMonthlyRent: 58500 },
        threeBR: { count: 17, avgRent: 1485, totalMonthlyRent: 25245 }
      },
      
      // Financing Structure
      financingStructure: {
        totalAcquisition: 10775000,
        bankFinancing: {
          amount: 7542500,
          ltv: 70,
          interestRate: 6.75,
          term: 7,
          amortization: 30,
          interestOnlyPeriod: 2,
          annualDebtService: 528775,
          dscr: 1.35
        },
        investorEquity: {
          amount: 3232500,
          percentage: 30
        }
      },
      
      // Market Analysis
      marketMetrics: {
        medianHouseholdIncome: 52500,
        populationGrowth: 4.2,
        employmentGrowth: 3.1,
        rentGrowthRate: 3.5,
        vacancyRate: 5.8,
        marketRentPremium: 5.2
      }
    },
    tokenization: {
      totalTokens: 5000,
      tokenPrice: 1000,
      minimumInvestment: 1000,
      maximumInvestment: 100000,
      
      // Enhanced Cash Flow Analysis
      annualCashFlowAfterDebt: 364527,
      monthlyCashFlowAfterDebt: 30377,
      netMonthlyCashFlowPerToken: 6.08,
      
      // Interest-Only Period (Years 1-2)
      interestOnlyPeriod: {
        annualCashFlow: 383677,
        monthlyCashFlow: 31973,
        netMonthlyCashFlowPerToken: 6.39,
        cashOnCashReturn: 11.88
      },
      
      // Principal & Interest Period (Years 3+)
      principalAndInterestPeriod: {
        annualCashFlow: 364527,
        monthlyCashFlow: 30377,
        netMonthlyCashFlowPerToken: 6.08,
        cashOnCashReturn: 11.28
      },
      
      equityYield: 11.28,
      distributionFrequency: 'monthly',
      firstDistributionDate: '2024-12-01',
      projectedAnnualizedReturn: 16.8,
      fiveYearTotalReturnPerToken: 1247, // Including appreciation
      projectedIRR: 16.8,
      projectedEquityMultiple: 2.1,
      
      // Investment Structure
      investorEquityTotal: 3232500,
      investorEquityPercentage: 30,
      bankLoanAmount: 7542500,
      bankLoanPercentage: 70,
      leverageRatio: 2.33 // Total acquisition / investor equity
    },
    
    // FractionaX Management Fee Structure
    managementFees: {
      acquisitionFee: {
        percentage: 3.0,
        amount: 323250, // 3% of $10.775M purchase price
        description: 'One-time fee paid at closing for property acquisition, due diligence, and legal coordination'
      },
      assetManagementFee: {
        percentage: 2.5,
        annualAmount: 28333, // 2.5% of $1.133M gross revenue
        description: 'Annual fee for ongoing asset oversight, investor reporting, and portfolio management'
      },
      performanceFee: {
        percentage: 10.0,
        trigger: 'Rent increases >3% annually',
        description: 'Performance fee on rent growth exceeding 3% annually, ensuring alignment with market performance'
      },
      dispositionFee: {
        percentage: 1.5,
        description: 'Fee at property sale to maximize exit value through strategic marketing and buyer optimization'
      }
    },
    
    listingDate: '2024-09-25T00:00:00Z',
    status: 'active'
  };
};

/**
 * Get detailed Orca Splash Express Car Wash data
 */
const getOrcaCarWashData = () => {
  return {
    id: 'CL-2024-TX-6298',
    clipId: 'CL-2024-TX-6298',
    title: 'Orca Splash Express Car Wash - Texas Turnkey Operation',
    slug: 'orca-splash-express-car-wash-houston',
    address: '12847 Northwest Freeway, Houston, TX 77040',
    city: 'Houston',
    state: 'TX',
    zipCode: '77040',
    price: 5000000,
    beds: 0, // Commercial property
    baths: 4, // Employee facilities
    sqft: 3200,
    propertyType: 'Business',
    subcategory: 'Car Wash',
    operationalStatus: 'fully_operational',
    yearBuilt: 2016,
    yearRenovated: 2022,
    lotSize: '1.65 acres',
    coordinates: { lat: 29.8419, lng: -95.5617 },
    images: [
      '/images/properties/orca-splash-express/Main photo(cover photo).jpg',
      '/images/properties/orca-splash-express/Frontside photo.jpg',
      '/images/properties/orca-splash-express/Side View photo.jpg',
      '/images/properties/orca-splash-express/Backside photo.jpg'
    ],
    description: '🌊 ORCA SPLASH EXPRESS CAR WASH - Premier turnkey operation generating $1.2M+ annually! This high-volume express tunnel facility features state-of-the-art equipment, experienced 3rd-party operator, and prime Northwest Freeway location with 42K+ daily traffic count. Recession-proof 8% annual yield with professional management in place.',
    detailedDescription: 'This flagship Orca Splash location represents the pinnacle of modern car wash operations in Houston\'s competitive market. Located on busy Northwest Freeway with 42,000+ daily vehicles, this facility has built a loyal customer base and consistent cash flow over 8 years of operation. Fully operational with 8+ years of proven performance, modern 110-foot express tunnel with Belanger Vector systems, and strong brand recognition in the Houston market.',
    features: ['fully_operational', 'express_tunnel_wash', 'loyal_customer_base', 'professional_management', 'belanger_equipment', 'water_reclaim_system', 'turnkey_investment', 'houston_location', 'monthly_memberships', 'recent_upgrades', 'high_traffic_location', 'seller_financing_available'],
    expectedROI: 10.0,
    monthlyRent: 100000, // Monthly revenue
    hoa: 0,
    taxes: 60000,
    insurance: 35000,
    agent: {
      name: 'Michael Rodriguez',
      phone: '(713) 555-0634',
      email: 'michael@houstoncarwash.com',
      company: 'Houston Commercial Car Wash Specialists',
      photo: '/api/placeholder/100/100',
      license: 'TX-742891'
    },
    stats: {
      views: 2187,
      saves: 163,
      daysOnMarket: 6,
      pricePerSqft: 1563,
      priceHistory: [{ date: '2024-09-20', price: 5000000, event: 'Listed' }]
    },
    neighborhood: {
      name: 'Northwest Houston/Willowbrook',
      walkability: 48,
      transitScore: 52,
      bikeScore: 31
    },
    schools: [
      { name: 'Spring Woods High School', rating: 7, distance: 1.4 },
      { name: 'Bammel Elementary', rating: 8, distance: 0.9 },
      { name: 'Northwest Forest Middle School', rating: 7, distance: 1.1 }
    ],
    businessMetrics: {
      washBays: 1,
      expressTunnels: 1,
      tunnelLength: 110,
      vacuumStations: 18,
      averageTicket: 18.75,
      premiumServiceTicket: 24.99,
      dailyCarCount: 125,
      weekendCarCount: 220,
      monthlyGrossIncome: 100000,
      annualGrossIncome: 1200000,
      operatingExpenses: 700000,
      netOperatingIncome: 500000,
      operatorFee: 60000,
      adjustedNOI: 440000,
      annualDebtService: 320000,
      netCashFlow: 120000,
      employeeCount: 12,
      fullTimeStaff: 8,
      partTimeStaff: 4,
      activeMemberships: 6200,
      monthlyMemberRevenue: 154800,
      memberRetentionRate: 87.5
    },
    tokenization: {
      totalTokens: 1500,
      tokenPrice: 1000,
      minimumInvestment: 5000,
      maximumInvestment: 50000,
      
      // Cash Flow Analysis
      annualCashFlowAfterDebt: 120000,
      monthlyCashFlowAfterDebt: 10000,
      annualCashFlowPerToken: 80, // $120k / 1,500 tokens
      netMonthlyCashFlowPerToken: 6.67,
      equityYield: 8.0,
      
      distributionFrequency: 'monthly',
      firstDistributionDate: '2024-12-01',
      
      // 5-Year Projections
      projectedHoldPeriod: 5,
      projectedAnnualizedReturn: 11.0,
      projectedExitPrice: 6000000, // 3.7% annual appreciation
      fiveYearTotalReturnPerToken: 400,
      
      // 10-Year Projections
      totalDividends10Year: 1200000, // 10 years * $120k
      projectedEquityAtExit: 2500000, // After debt paydown
      totalReturn10Year: 3700000, // Dividends + equity
      equityMultiple: 2.47 // $3.7M / $1.5M invested
    },
    
    // FractionaX Management Fee Structure
    managementFees: {
      acquisitionFee: {
        percentage: 3.0,
        amount: 150000, // 3% of $5M purchase price
        description: 'One-time fee paid at closing for property acquisition, due diligence, and legal services'
      },
      assetManagementFee: {
        percentage: 3.0,
        annualAmount: 36000, // 3% of $1.2M gross revenue
        description: 'Annual fee for ongoing property oversight, investor relations, and strategic management'
      },
      performanceFee: {
        percentage: 5.0,
        trigger: 'NOI growth >3% annually',
        description: 'Performance fee applied only when NOI exceeds 3% annual growth, aligning our success with yours'
      },
      dispositionFee: {
        percentage: 1.0,
        description: 'Optional fee at property sale to maximize exit value through professional marketing and negotiation'
      }
    },
    
    listingDate: '2024-09-20T00:00:00Z',
    status: 'active'
  };
};

/**
 * Get detailed Raising Cane's Des Plaines property data
 */
const getRaisingCanesDesPlaines = () => {
  return {
    id: 'CL-2024-IL-2069',
    clipId: 'CL-2024-IL-2069',
    title: '🏞️ LAND DEAL: Raising Cane\'s Des Plaines - NNN Ground Lease',
    slug: 'raising-canes-des-plaines-illinois',
    address: '1535 Lee Street, Des Plaines, IL 60018',
    city: 'Des Plaines',
    state: 'IL',
    zipCode: '60018',
    price: 4250000,
    beds: 0, // Commercial property
    baths: 4, // Employee and customer restrooms
    sqft: 3400,
    propertyType: 'Land',
    subcategory: 'Ground Lease',
    operationalStatus: 'fully_operational',
    yearBuilt: 2019,
    yearRenovated: 2023,
    lotSize: '1.2 acres',
    coordinates: { lat: 42.0333, lng: -87.9334 },
    images: [
      '/images/properties/raising-canes-des-plaines/5a3403e6a6b246f0aeaccf6bd79f453d_3000x2000_resize.jpg',
      '/images/properties/raising-canes-des-plaines/Cover photo 2.jpg',
      '/images/properties/raising-canes-des-plaines/cover photo 3.jpg',
      '/images/properties/raising-canes-des-plaines/cover photo 4.jpg'
    ],
    description: '🏞️ LAND INVESTMENT: Des Plaines ground lease with Raising Cane\'s as tenant! Own the 1.2-acre LAND underneath this successful restaurant. 15-year NNN ground lease generating $340K+ annually with corporate guarantee. Land appreciates while tenant pays ALL expenses. Perfect hands-off real estate investment!',
    detailedDescription: 'This exceptional Raising Cane\'s Chicken Fingers represents a premier triple net lease investment opportunity in the heart of Des Plaines, Illinois. The property features a modern 3,400 sq ft restaurant facility on a prominent 1.2-acre corner lot with excellent visibility and access. Built in 2019 with recent renovations completed in 2023, this location benefits from Raising Cane\'s continued expansion and brand strength. The 15-year corporate lease provides stable, predictable cash flow with built-in rent escalations. Located in a high-traffic retail corridor with strong demographics and proximity to Chicago, this investment offers both stability and growth potential for income-focused investors.',
    features: ['triple_net_lease', 'corporate_guarantee', 'corner_location', 'recent_renovation', 'drive_thru', 'patio_seating', 'modern_kitchen', 'high_visibility', 'chicago_suburb', 'established_brand', 'long_term_lease', 'rent_escalations'],
    expectedROI: 8.0,
    monthlyRent: 28333, // Monthly lease income
    hoa: 0,
    taxes: 45000,
    insurance: 18000,
    agent: {
      name: 'Jennifer Walsh',
      phone: '(847) 555-0892',
      email: 'jennifer@chicagocommercial.com',
      company: 'Chicago Commercial Real Estate Group',
      photo: '/api/placeholder/100/100',
      license: 'IL-845923'
    },
    stats: {
      views: 1456,
      saves: 98,
      daysOnMarket: 12,
      pricePerSqft: 1250,
      priceHistory: [{ date: '2024-09-15', price: 4250000, event: 'Listed' }]
    },
    neighborhood: {
      name: 'Des Plaines/Northwest Chicago Suburbs',
      walkability: 72,
      transitScore: 65,
      bikeScore: 58
    },
    schools: [
      { name: 'Des Plaines Elementary School', rating: 7, distance: 0.4 },
      { name: 'Chute Middle School', rating: 8, distance: 0.8 },
      { name: 'Maine West High School', rating: 8, distance: 1.2 }
    ],
    businessMetrics: {
      restaurantType: 'Fast Casual Chicken',
      seatingCapacity: 65,
      driveThruLanes: 1,
      kitchenSqft: 800,
      diningRoomSqft: 2000,
      patioSeating: 24,
      parkingSpaces: 45,
      operatingHours: '10 AM - 11 PM Daily (12 AM Fri/Sat)',
      averageTicket: 12.50,
      dailyTransactions: 450,
      monthlyRevenue: 168750,
      annualRevenue: 2025000,
      employeeCount: 25,
      managementStructure: 'Corporate Operated'
    },
    leaseDetails: {
      leaseType: 'Triple Net (NNN)',
      leaseTerm: 15, // years
      remainingTerm: 12, // years remaining
      baseRent: 340000, // annual
      monthlyRent: 28333,
      rentIncreases: '5% every 5 years',
      nextIncrease: '2027',
      tenant: 'Raising Cane\'s USA LLC',
      tenantCreditRating: 'Investment Grade',
      personalGuarantee: false,
      corporateGuarantee: true,
      tenantResponsibilities: ['Property Taxes', 'Insurance', 'Maintenance', 'Utilities']
    },
    tokenization: {
      totalTokens: 4250,
      tokenPrice: 1000,
      minimumInvestment: 5000,
      maximumInvestment: 100000,
      
      // Cash Flow Analysis (NNN Ground Lease)
      annualCashFlow: 340000,
      monthlyCashFlow: 28333,
      annualCashFlowPerToken: 80, // $340k / 4,250 tokens
      netMonthlyCashFlowPerToken: 6.67,
      equityYield: 8.0,
      
      distributionFrequency: 'monthly',
      firstDistributionDate: '2024-11-01',
      
      // 5-Year Projections (with rent escalations)
      projectedHoldPeriod: 12, // Remaining lease term
      projectedAnnualizedReturn: 8.5, // Including rent increases
      projectedExitPrice: 5000000, // Land appreciation + rent increases
      fiveYearTotalReturnPerToken: 475, // Including rent escalations
      
      // 10-Year Projections
      totalDividends10Year: 3750000, // 10 years * $340k + escalations
      projectedEquityAtExit: 5000000, // Land value appreciation
      totalReturn10Year: 8750000, // Dividends + land value
      equityMultiple: 2.06 // $8.75M / $4.25M invested
    },
    
    // FractionaX Management Fee Structure
    managementFees: {
      acquisitionFee: {
        percentage: 2.5,
        amount: 106250, // 2.5% of $4.25M purchase price
        description: 'One-time fee for ground lease acquisition, legal due diligence, and tenant credit analysis'
      },
      assetManagementFee: {
        percentage: 2.0,
        annualAmount: 6800, // 2% of $340K annual lease income
        description: 'Annual ground lease management, tenant relations, and lease administration'
      },
      performanceFee: {
        percentage: 15.0,
        trigger: 'Rent escalations executed',
        description: 'Performance fee on successful rent escalations every 5 years (5% increases in 2027, 2032)'
      },
      dispositionFee: {
        percentage: 1.0,
        description: 'Fee at land sale to maximize exit value through buyer identification and negotiation'
      }
    },
    
    listingDate: '2024-09-15T00:00:00Z',
    status: 'active'
  };
};

/**
 * Get detailed Life Time Fitness Kansas property data
 */
const getLifeTimeFitnessKansas = () => {
  return {
    id: 'CL-2024-KS-8392',
    clipId: 'CL-2024-KS-8392',
    title: '🏞️ LAND DEAL: Life Time Fitness Kansas - 15 Yr Absolute NNN Lease',
    slug: 'life-time-fitness-kansas-nnn-lease',
    address: '11950 College Boulevard, Overland Park, KS 66210',
    city: 'Overland Park',
    state: 'KS',
    zipCode: '66210',
    price: 29165000,
    beds: 0, // Commercial property
    baths: 16, // Fitness facility restrooms/locker rooms
    sqft: 85000,
    propertyType: 'Land',
    subcategory: 'Ground Lease',
    operationalStatus: 'fully_operational',
    yearBuilt: 2005,
    yearRenovated: 2019,
    lotSize: '8.5 acres',
    coordinates: { lat: 38.8839, lng: -94.6708 },
    images: [
      '/images/properties/lifetime-fitness-kansas/78273bad775943c8b96567c44f32d9f7_3000x2000_resize.jpg',
      '/images/properties/lifetime-fitness-kansas/cover photo 2.jpg',
      '/images/properties/lifetime-fitness-kansas/cover photo 3.jpg',
      '/images/properties/lifetime-fitness-kansas/cover photo 4.jpg',
      '/images/properties/lifetime-fitness-kansas/cover photo 5.jpg'
    ],
    description: '🏞️ INSTITUTIONAL NNN LEASE: Life Time Fitness (NYSE: LTH) ground lease in Lenexa, KS! $29.17M institutional deal with 70% bank financing. Investors fund only $8.75M (30%) for 3.7% annual yield plus appreciation upside. 14.8-year absolute NNN lease with built-in rent escalations and 4×5-year extension options.',
    detailedDescription: 'This is a **PREMIUM INSTITUTIONAL GROUND LEASE** - own 8.5 acres under Life Time Fitness (NYSE: LTH) with sophisticated 70/30 financing structure. Purchase price of $29.17M with $20.4M bank loan allows investors to fund only $8.75M equity for leveraged returns. The 14.8-year absolute NNN lease generates $2.04M annual NOI with built-in rent escalations protecting against inflation. After debt service of $1.72M, investors receive $325k annual cash flow (3.7% yield). Located in affluent Lenexa/Overland Park with 4×5-year extension options providing 35-year total lease potential. Exit projections show 2.67x equity multiple and 10-11% IRR over 10 years.',
    features: ['ground_lease', 'land_investment', 'absolute_nnn_lease', 'nyse_traded_tenant', 'investment_grade_credit', '8_5_acres', 'commercial_zoning', 'overland_park_location', 'flagship_facility', 'premium_demographics', 'long_term_lease', 'institutional_quality', 'land_appreciation', 'passive_income', 'no_expenses', 'public_company_tenant'],
    expectedROI: 7.00, // Cap rate
    monthlyRent: 170130, // Monthly lease income ($2.04M / 12)
    hoa: 0,
    taxes: 285000,
    insurance: 45000,
    agent: {
      name: 'Robert Mitchell',
      phone: '(913) 555-0456',
      email: 'robert@kansascitycommercial.com',
      company: 'Kansas City Commercial Real Estate Group',
      photo: '/api/placeholder/100/100',
      license: 'KS-923847'
    },
    stats: {
      views: 2843,
      saves: 267,
      daysOnMarket: 1,
      pricePerSqft: 343, // $29.17M / 85,000 sqft
      priceHistory: [{ date: '2024-09-28', price: 29165000, event: 'Listed' }]
    },
    neighborhood: {
      name: 'Overland Park/Southwest Kansas City',
      walkability: 75,
      transitScore: 68,
      bikeScore: 62
    },
    schools: [
      { name: 'Blue Valley Northwest High School', rating: 10, distance: 1.2 },
      { name: 'Brookridge Elementary', rating: 9, distance: 0.8 },
      { name: 'Indian Creek Middle School', rating: 9, distance: 1.0 }
    ],
    businessMetrics: {
      facilityType: 'Premium Athletic Club',
      memberCapacity: 8500,
      avgMembershipFee: 89,
      totalSquareFeet: 85000,
      gymFloorSpace: 35000,
      poolArea: 12000,
      courtsSpa: 25000,
      childCareArea: 5000,
      cafeRetail: 8000,
      parkingSpaces: 450,
      operatingHours: '4:30 AM - 11:00 PM Daily',
      peakMembership: 7200,
      employeeCount: 180,
      annualClubRevenue: 18500000,
      memberRetentionRate: 87
    },
    leaseDetails: {
      leaseType: '14.8-Year Absolute Triple Net Ground Lease',
      leaseTerm: 15, // original years
      remainingTerm: 14.8, // years remaining (expires June 2040)
      baseRent: 2041560, // annual NOI
      monthlyRent: 170130,
      rentIncreases: 'Built-in escalators (inflation protection)',
      extensionOptions: '4 × 5-year extensions (35 years total potential)',
      tenant: 'Life Time, Inc. (NYSE: LTH)',
      tenantCreditRating: 'Investment Grade',
      tenantMarketCap: 4200000000,
      personalGuarantee: false,
      corporateGuarantee: true,
      publicCompany: true,
      stockSymbol: 'LTH',
      tenantResponsibilities: ['Property Taxes', 'Insurance', 'Maintenance', 'Utilities', 'Capital Improvements', 'All Building Expenses']
    },
    tokenization: {
      // Financing Structure (70/30)
      totalAcquisition: 29165000,
      bankLoan: 20415500, // 70% LTV @ 6%, 20 years
      equityRaise: 8749500, // 30% investor equity
      annualDebtService: 1716000,
      
      // Tokenization
      totalTokens: 1750, // $8.75M / $5K per token
      tokenPrice: 5000,
      minimumInvestment: 5000,
      maximumInvestment: 250000,
      
      // Cash Flow
      annualNOI: 2041560,
      annualCashFlowAfterDebt: 325560, // $2.04M NOI - $1.72M debt service
      monthlyCashFlowAfterDebt: 27130,
      annualCashFlowPerToken: 186, // $325k / 1,750 tokens
      monthlyCashFlowPerToken: 15.5, // $186 / 12
      equityYield: 3.7, // 3.7% cash-on-cash return
      
      distributionFrequency: 'quarterly',
      firstDistributionDate: '2024-12-01',
      
      // 10-Year Exit Projections
      projectedExitPrice: 35600000, // 2% annual appreciation
      projectedLoanBalance: 15500000, // After 10 years paydown
      projectedEquityAtExit: 20100000,
      totalDividends10Year: 3255600, // 10 years * $325k
      totalReturn10Year: 23355600, // Dividends + equity
      equityMultiple: 2.67, // $23.4M / $8.75M
      projectedIRR: 10.5 // 10-11% IRR
    },
    
    // FractionaX Management Fee Structure
    managementFees: {
      acquisitionFee: {
        percentage: 3.0,
        amount: 875000, // 3% of $29.17M purchase price (ChatGPT recommendation)
        description: 'One-time fee for institutional ground lease acquisition, NYSE-tenant due diligence, and deal structuring'
      },
      assetManagementFee: {
        percentage: 3.0,
        annualAmount: 61247, // 3% of $2.04M annual NOI
        description: 'Annual institutional asset management, 1,750 token holder relations, and corporate tenant oversight'
      },
      performanceFee: {
        percentage: 5.0,
        trigger: 'NOI growth from built-in rent escalators',
        description: 'Performance fee on NOI growth from built-in rent escalations protecting against inflation'
      },
      dispositionFee: {
        percentage: 1.0,
        description: 'Fee at exit (~$356K on projected $35.6M sale) to maximize institutional buyer network'
      }
    },
    
    listingDate: '2024-09-28T00:00:00Z',
    status: 'active'
  };
};
