import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import marketplaceService from '../services/marketplaceService';

/**
 * Shared marketplace hook with common logic for both public and customer marketplaces
 * @param {Object} config - Configuration options
 * @param {boolean} config.isAuthenticated - Whether user is authenticated
 * @param {Object} config.userPreferences - User preferences for personalization
 * @returns {Object} Marketplace state and methods
 */
export const useMarketplace = (config = {}) => {
  const { isAuthenticated = false, userPreferences = {} } = config;

  // Common state
  const [activeCategory, setActiveCategory] = useState('investment-assets');
  const [activeTab, setActiveTab] = useState('approved'); // Show Ready to Invest by default
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100); // Increased to show all properties without pagination
  
  // Data states
  const [approvedListings, setApprovedListings] = useState([]);
  const [aiDiscoveredProperties, setAiDiscoveredProperties] = useState([]);
  const [commercialProperties, setCommercialProperties] = useState([]);  // New: LoopNet commercial properties
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);
  const [isLoadingCommercial, setIsLoadingCommercial] = useState(false);  // New: Loading state for commercial properties
  const [apiError, setApiError] = useState(null);
  
  // Base filters - Updated for commercial properties with multi-source support
  const [baseFilters, setBaseFilters] = useState({
    priceRange: [0, 100000000], // Increased to $100M for commercial properties
    propertyType: 'all', // office, retail, industrial, multifamily
    sources: ['loopnet', 'crexi', 'auction', 'realtor'], // Multi-source filtering
    bedrooms: 'any',
    bathrooms: 'any',
    location: '',
    sortBy: 'price', // Default to sorting by price for commercial
    tokenizationStatus: 'all',
    roiRange: [0, 50],
    listingStatus: 'all',
    features: [],
    minSqft: '',
    maxSqft: '',
    listingType: 'all'
  });
  
  // Quick filters
  const [quickFilters, setQuickFilters] = useState({
    highROI: false,
    under500K: false,
    newThisWeek: false
  });
  
  // Subcategory filtering for approved listings
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  // Fetch AI-suggested listings
  const fetchAISuggestedListings = async () => {
    try {
      setIsLoadingSuggested(true);
      setApiError(null);

      console.log('🤖 Fetching AI-suggested listings from Enhanced Discovery...');

      const criteria = {
        location: userPreferences.location || 'Houston, TX',
        limit: 25,
        minPrice: 100000,
        maxPrice: 2000000,
        intelligenceLevel: 'premium'
      };

      const result = await marketplaceService.fetchEnhancedDiscoveryListings(criteria);
      
      if (result.listings && result.listings.length > 0) {
        setAiDiscoveredProperties(result.listings);
        
        const commercialCount = result.listings.filter(p => p.commercial?.source).length;
        const enhancedCount = result.listings.filter(p => p.source !== 'suggested-deals-fallback').length;
        
        let message;
        const multifamilyCount = result.listings.filter(p => p.isMultifamilyDiscovery).length;
        const targetMet = result.metadata?.targetMet;
        
        if (multifamilyCount > 0) {
          if (targetMet) {
            message = `🏢🎆 MULTIFAMILY DISCOVERY: Found ${result.listings.length} REAL properties! Target 500+ achieved!`;
          } else {
            message = `🏢 Multifamily Discovery: Loaded ${multifamilyCount} real investment properties from 6 markets!`;
          }
        } else if (commercialCount > 0) {
          message = `🏢 Commercial Properties: Loaded ${result.listings.length} opportunities with AI intelligence!`;
        } else if (enhancedCount > 0) {
          message = `🎆 Discovery: Generated ${enhancedCount} AI-enhanced properties!`;
        } else {
          message = `🎆 Discovery: Found ${result.listings.length} properties!`;
        }
        
        toast.success(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.info('No AI-discovered properties available at the moment. Our AI is continuously analyzing new opportunities.', {
          position: "bottom-right",
          autoClose: 4000,
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch AI-suggested listings:', error);
      setApiError(error.message);
      setAiDiscoveredProperties([]);
      
      toast.error('Failed to load AI-discovered properties. Our AI system may be busy analyzing new opportunities.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoadingSuggested(false);
    }
  };

  // Fetch commercial properties from LoopNet
  const fetchCommercialProperties = async () => {
    try {
      setIsLoadingCommercial(true);
      setApiError(null);

      console.log('🏢 Fetching LoopNet commercial properties...');

      const criteria = {
        location: userPreferences.location || 'All Cities',
        limit: 100, // Increased to show all available properties
        minPrice: 0, // Show all properties regardless of price
        maxPrice: 100000000,
        propertyTypes: baseFilters.propertyType === 'all' 
          ? ['office', 'retail', 'industrial', 'multifamily'] 
          : [baseFilters.propertyType],
        sources: baseFilters.sources || ['loopnet', 'crexi', 'auction', 'realtor'],
        sortBy: baseFilters.sortBy || 'price',
        sortOrder: 'desc'
      };

      const result = await marketplaceService.fetchCommercialMarketplaceProperties(criteria);
      
      if (result.listings && result.listings.length > 0) {
        console.log('🏢 LoopNet API Success:', {
          count: result.listings.length,
          sampleProperty: result.listings[0],
          summary: result.summary
        });
        setCommercialProperties(result.listings);
        
        const sources = result.summary?.sourceStats ? Object.keys(result.summary.sourceStats) : [];
        const sourceText = sources.length > 1 ? `${sources.join(', ')} sources` : sources[0] || 'multi-source';
        const message = `🏢 Commercial Properties: Loaded ${result.listings.length} real properties from ${sourceText}!`;
        
        toast.success(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.log('⚠️ LoopNet API returned no properties:', result);
        toast.info('No commercial properties available at the moment.', {
          position: "bottom-right",
          autoClose: 4000,
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch commercial properties:', error);
      setApiError(error.message);
      setCommercialProperties([]);
      
      toast.error('Failed to load commercial properties. Please try again later.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoadingCommercial(false);
    }
  };

  // Load marketplace data - now optimized to avoid unnecessary loading
  const loadMarketplaceData = async (forceReload = false) => {
    // Only set loading if we're force reloading or have no data
    const needsLoading = forceReload || (
      activeTab === 'commercial-properties' && commercialProperties.length === 0
    ) || (
      activeTab === 'ai-discovered' && aiDiscoveredProperties.length === 0
    );
    
    if (needsLoading) {
      setLoading(true);
    }
    
    if (activeCategory === 'investment-assets') {
      // Load approved listings (mock data)
      if (activeTab === 'approved' && (approvedListings.length === 0 || forceReload)) {
        // Load mock approved listings
        const mockApprovedListings = [
          {
            id: 2,
            title: "Orca Splash Express Car Wash - Texas Turnkey Operation",
            address: "12847 Northwest Freeway, Houston, TX 77040",
            price: 5000000,
            rentPrice: 0,
            beds: 0,
            baths: 4,
            sqft: 3200,
            lotSize: 1.65,
            propertyType: "commercial",
            subcategory: "business",
            listingType: "sale",
            operationalStatus: "fully_operational",
            images: [
              "/images/properties/orca-splash-express/Main photo(cover photo).jpg",
              "/images/properties/orca-splash-express/Frontside photo.jpg",
              "/images/properties/orca-splash-express/Side View photo.jpg",
              "/images/properties/orca-splash-express/Backside photo.jpg"
            ],
            description: "🌊 ORCA SPLASH EXPRESS CAR WASH - Premier turnkey operation generating $1.2M+ annually! This high-volume express tunnel facility features experienced 3rd-party operator, state-of-the-art equipment, and prime Northwest Freeway location with 42K+ daily traffic count. Recession-proof 8% annual yield with professional management.",
            detailedDescription: "**ORCA SPLASH EXPRESS CAR WASH - PROVEN HOUSTON SUCCESS STORY** \n\nThis flagship Orca Splash location represents the pinnacle of modern car wash operations in Houston's competitive market. Located on busy Northwest Freeway with 42,000+ daily vehicles, this facility has built a loyal customer base and consistent cash flow over 8 years of operation.\n\n**OPERATIONAL HIGHLIGHTS**\n• **Fully Operational**: 8+ years of proven performance with detailed financials\n• **Modern Equipment**: 110-foot express tunnel with Belanger Vector systems (upgraded 2022)\n• **Strong Brand Recognition**: Orca Splash is a recognized Houston car wash brand\n• **Professional Management**: Full management team in place - semi-absentee opportunity\n• **Recent Upgrades**: $285K in facility and equipment improvements (2022-2024)\n\n**LOCATION ADVANTAGES**\n• Northwest Freeway (US-290) - Major Houston arterial with 42K+ daily traffic\n• Strategic Northwest Houston location serving affluent suburbs\n• Easy access from multiple residential communities\n• Adjacent to major shopping centers and office complexes\n• High-density residential area with strong demographics\n\n**FINANCIAL PERFORMANCE**\n• **Annual Gross Revenue**: $485,200 (2023 actual)\n• **Net Operating Income**: $338,600 (69.8% margin)\n• **Monthly Cash Flow**: $28,217 average\n• **Cap Rate**: 11.7% (current performance)\n• **Customer Loyalty**: 6,200+ active unlimited wash members\n• **Average Ticket**: $18.75 (retail), $24.99 (membership)\n\n**FACILITY SPECIFICATIONS**\n• 110-foot express tunnel with Belanger Vector equipment\n• 18 vacuum stations with mat cleaning and fragrance\n• Customer lounge with retail merchandise\n• Modern POS system with mobile app integration\n• 75% water reclaim system - environmentally friendly\n• Professional landscaping with monument signage\n• LED lighting throughout facility\n• On-site chemical storage and mixing systems\n\n**BUSINESS MODEL**\n• Express exterior wash with multiple service levels ($12-$22)\n• Unlimited monthly memberships ($24.99-$34.99)\n• Vacuum services and retail products\n• Corporate fleet accounts\n• Gift card and promotional programs\n\nThis is a turnkey investment perfect for investors seeking stable, recession-resistant cash flow. **Seller financing available** for qualified buyers with strong local market knowledge.",
            features: ["fully_operational", "express_tunnel_wash", "loyal_customer_base", "professional_management", "belanger_equipment", "water_reclaim_system", "turnkey_investment", "houston_location", "monthly_memberships", "recent_upgrades", "high_traffic_location", "seller_financing_available"],
            yearBuilt: 2016,
            yearRenovated: 2022,
            coordinates: { lat: 29.8419, lng: -95.5617 },
            tokenized: true,
            tokenPrice: 1000,
            totalTokens: 1500,
            availableTokens: 1200,
            expectedROI: 10.0,
            annualRevenue: 1200000,
            monthlyRevenue: 100000,
            grossRevenue: 1200000,
            operatingExpenses: 700000,
            netOperatingIncome: 500000,
            operatorFee: 60000,
            adjustedNOI: 440000,
            capRate: 10.0,
            cashOnCashReturn: 8.0,
            operationalHistory: "8+ years",
            hoa: 0,
            taxes: 34500,
            insurance: 24000,
            utilities: 42600,
            maintenance: 45500,
            listingDate: "2024-09-20",
            status: "active",
            lastRenovation: "2022",
            mlsNumber: "TX-CW-629847",
            clipId: "CL-2024-TX-6298",
            slug: "orca-splash-express-car-wash-houston",
            agent: {
              name: "Michael Rodriguez",
              phone: "(713) 555-0634",
              email: "michael@houstoncarwash.com",
              company: "Houston Commercial Car Wash Specialists",
              photo: "/api/placeholder/100/100",
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
              peakHours: "7-9 AM, 12-2 PM, 5-7 PM weekdays; 8 AM-7 PM weekends",
              seasonalVariation: "Spring/Summer +15%, Winter -5%",
              customerLoyalty: {
                activeMemberships: 6200,
                monthlyMemberRevenue: 154800,
                memberRetentionRate: 87.5
              },
              equipment: {
                tunnelSystems: "Belanger Vector Series (2022)",
                vacuumSystems: "JE Adams Super Vacs with mat cleaning and fragrance",
                paymentSystems: "Contactless NFC, Mobile App, Traditional",
                waterRecycling: "75% reclaim system - environmentally friendly"
              },
              competition: {
                nearest: "Quick Clean Express (2.8 miles)",
                marketShare: "Estimated 28% local market share",
                differentiators: ["Express tunnel wash", "Loyalty memberships", "Northwest Freeway location", "Professional management"]
              }
            },
            investmentHighlights: [
              "🎯 10% Cap Rate with experienced 3rd-party operator",
              "💰 8% Annual Cash-on-Cash Return to investors",
              "📈 $1.2M+ annual gross revenue with 8+ years operational history",
              "🏆 High-volume express tunnel with modern Belanger Vector equipment",
              "📍 42K+ daily traffic count on Northwest Freeway (US-290)",
              "👥 Professional operator handles daily operations (5% fee)",
              "🔄 Recession-resistant car wash business model",
              "💳 $1,000 minimum investment with monthly distributions",
              "🌱 Northwest Houston growing market (+12.7% population growth)",
              "💼 Turnkey investment - no landlord responsibilities"
            ],
            financialProjections: {
              year1: { revenue: 1200000, noi: 440000, cashFlow: 120000, distributionPerToken: 77.6 },
              year2: { revenue: 1236000, noi: 453000, cashFlow: 133000, distributionPerToken: 86.2 },
              year3: { revenue: 1273000, noi: 466000, cashFlow: 146000, distributionPerToken: 94.9 },
              assumptions: "3% annual revenue growth, stable operating expense ratio, net cash flow after debt service"
            },
            
            // FractionaX Management Fee Structure
            managementFees: {
              overview: "FractionaX provides comprehensive deal structuring, compliance, and ongoing management services for this turnkey car wash investment.",
              
              acquisitionFee: {
                rate: 3.0, // 3% of purchase price
                amount: 150000, // 3% of $5M
                timing: "One-time at closing",
                covers: ["Property sourcing & underwriting", "Due diligence & legal structuring", "Tokenization & compliance filings", "Investor onboarding & documentation"]
              },
              
              assetManagementFee: {
                rate: 3.0, // 3% of gross collected rent/revenue
                monthlyAmount: 3600, // 3% of $120K monthly gross revenue
                annualAmount: 43200, // 3% of $1.44M annual gross revenue
                timing: "Monthly from gross collected revenue",
                covers: ["Third-party operator oversight", "Financial reporting & compliance monitoring", "Investor communications & distributions", "Business performance optimization"]
              },
              
              performanceFee: {
                rate: 5.0, // 5% of NOI growth above baseline
                trigger: "NOI growth above baseline pro-forma",
                baselineNOI: 440000,
                timing: "Annual, when performance targets exceeded",
                alignment: "FractionaX only earns extra when investors see stronger returns",
                estimatedAnnual: 6500 // 5% of projected NOI growth
              },
              
              dispositionFee: {
                rate: 1.0, // 1% of sale price
                estimatedAmount: 55000, // 1% of estimated $5.5M sale price (10% appreciation)
                timing: "One-time at business sale/exit",
                covers: ["Transaction coordination", "Compliance filings & investor payouts", "Token unwinding & liquidation", "Sale process management"]
              },
              
              totalAnnualFees: {
                assetManagement: 43200,
                estimatedPerformance: 6500,
                totalAnnual: 49700,
                percentageOfNOI: 11.30, // Total annual fees as % of NOI
                netInvestorNOI: 390300 // NOI after management fees
              },
              
              investorAlignment: {
                targetCashYield: "8-12% annually after all fees",
                targetIRR: "12-18% including business appreciation",
                feeTransparency: "All fees disclosed upfront with clear investor benefit alignment",
                valueProposition: "Professional oversight of turnkey car wash operation with experienced 3rd-party operator"
              }
            }
          },
          {
            id: 4,
            title: "Houston 97 Unit Apartment Complex",
            slug: "houston-97-unit-apartment-complex",
            clipId: "CL-2024-TX-4897",
            address: "1234 Example St. Houston, TX, 77077",
            price: 10775000,
            rentPrice: 0,
            beds: 194,
            baths: 97,
            sqft: 48960,
            propertyType: "multifamily",
            subcategory: "apartment",
            listingType: "sale",
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
            description: "🏢 HOUSTON 97-UNIT APARTMENT COMPLEX - Institutional multifamily investment with 70% bank financing! Investors fund only $3.23M (30%) while bank provides $7.55M loan. Strong 8.29% NOI of $893K annually with professional property management. Recently renovated building in growing Houston market.",
            detailedDescription: "**HOUSTON 97-UNIT APARTMENT COMPLEX - INSTITUTIONAL MULTIFAMILY INVESTMENT** \n\nThis exceptional 97-unit apartment building represents a premier institutional-quality investment in Houston's thriving rental market. Built in 1961 and completely renovated in 2023, this 48,960 sq ft complex demonstrates the perfect value-add success story.\n\n**PROPERTY OVERVIEW:**\n• **97 Units**: Mix of 1BR, 2BR, and 3BR apartments\n• **Recently Renovated**: Full renovation completed in 2023 ($850K investment)\n• **Single Building**: 3-story garden-style apartment building\n• **Prime Location**: Southwest Houston with excellent access to employment\n• **Professional Management**: Experienced multifamily management company\n\n**FINANCING STRUCTURE (70/30 SPLIT):**\n• **Total Acquisition**: $10,775,000\n• **Bank Financing**: $7,542,500 (70% LTV at 6.75% rate)\n• **Investor Equity**: $3,232,500 (30% - funded by tokenholders)\n• **Loan Terms**: 30-year amortization, 7-year term, interest-only first 2 years\n• **DSCR**: 1.35x (strong debt coverage)\n\n**ANNUAL FINANCIAL PERFORMANCE:**\n• **Gross Rental Income**: $1,133,300 (97 units x $11,685 avg annual rent)\n• **Operating Expenses**: $239,998 (21.2% expense ratio - excellent)\n• **Net Operating Income**: $893,302 (8.29% cap rate)\n• **Annual Debt Service**: $528,775 (interest-only first 2 years: $509,625)\n• **Cash Flow After Debt**: $364,527 annually\n\n**INVESTOR RETURNS (ON $3.23M EQUITY):**\n• **Cash-on-Cash Return**: 11.28% (Year 1-2 with interest-only)\n• **Cash-on-Cash Return**: 10.57% (Years 3+ with principal payments)\n• **Monthly Distributions**: $30,377 (interest-only period)\n• **Annual Distribution**: $364,527 to investors\n• **Projected 5-Year IRR**: 16.8% including appreciation\n\n**WHY THIS DEAL WORKS:**\n• **Leverage Advantage**: 70% bank financing amplifies investor returns\n• **Cash Flow Positive**: Strong NOI covers debt service with excellent cushion\n• **Value-Add Complete**: Renovation finished, now stabilized income\n• **Houston Growth**: 4.2% annual population growth drives rental demand\n• **Institutional Quality**: Professional management, excellent location\n\n**UNIT MIX & RENTAL RATES:**\n• **1BR Units**: 28 units averaging $875/month\n• **2BR Units**: 52 units averaging $1,125/month\n• **3BR Units**: 17 units averaging $1,485/month\n• **Average Rent**: $973/unit/month ($11,685 annually)\n• **Market Rent Growth**: 3.5% annually (Houston average)\n\nThis represents institutional-quality multifamily investing with bank leverage, professional management, and strong Houston market fundamentals.",
            features: ["recently_renovated_2023", "97_units", "3_stories", "houston_location", "strong_noi", "apartment_building", "multifamily", "cash_flowing", "stable_investment", "houston_growth_market"],
            yearBuilt: 1961,
            yearRenovated: 2023,
            lotSize: 3.2,
            coordinates: { lat: 29.7604, lng: -95.3698 },
            tokenized: true,
            tokenPrice: 2155,
            totalTokens: 5000,
            availableTokens: 4100,
            expectedROI: 8.29,
            monthlyRent: 74441,
            grossRentMultiplier: 12.1,
            capRate: 8.29,
            cashOnCash: 8.29,
            hoa: 0,
            taxes: 129000,
            insurance: 21500,
            listingDate: "2024-09-25",
            status: "active",
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
            investmentMetrics: {
              // Property Basics
              totalUnits: 97,
              buildings: 1,
              stories: 3,
              propertySubType: "Apartment Building",
              pricePerUnit: 111082,
              pricePerSqft: 220,
              
              // Unit Mix
              unitMix: {
                oneBR: { count: 28, avgRent: 875, totalMonthlyRent: 24500 },
                twoBR: { count: 52, avgRent: 1125, totalMonthlyRent: 58500 },
                threeBR: { count: 17, avgRent: 1485, totalMonthlyRent: 25245 }
              },
              
              // Financial Performance
              grossAnnualIncome: 1133300,
              grossMonthlyIncome: 94442,
              avgRentPerUnit: 973,
              vacancy: 5,
              effectiveGrossIncome: 1076635,
              
              // Operating Expenses
              operatingExpenses: 239998,
              operatingExpenseRatio: 21.2,
              expenseBreakdown: {
                propertyManagement: 56665, // 5% of gross income
                maintenance: 68000,
                utilities: 45000,
                insurance: 21500,
                taxes: 34000,
                marketing: 8000,
                legal: 3833,
                other: 3000
              },
              
              // Net Operating Income
              noi: 893302,
              capRate: 8.29,
              
              // Financing Structure
              financingStructure: {
                totalAcquisition: 10775000,
                bankFinancing: {
                  amount: 7542500,
                  ltv: 70,
                  interestRate: 6.75,
                  term: 7, // years
                  amortization: 30, // years
                  interestOnlyPeriod: 2, // years
                  monthlyPayment: 44062, // principal + interest after IO
                  interestOnlyPayment: 42469, // first 2 years
                  annualDebtService: 528775,
                  dscr: 1.35
                },
                investorEquity: {
                  amount: 3232500,
                  percentage: 30,
                  fundedByTokens: true
                }
              },
              
              // Cash Flow Analysis
              cashFlowAnalysis: {
                noi: 893302,
                debtService: 528775,
                cashFlowBeforeTax: 364527,
                
                // Year 1-2 (Interest Only)
                interestOnlyPeriod: {
                  annualDebtService: 509625,
                  cashFlowAfterDebt: 383677,
                  cashOnCashReturn: 11.88,
                  monthlyDistribution: 31973
                },
                
                // Year 3+ (Principal + Interest)
                principalAndInterest: {
                  annualDebtService: 528775,
                  cashFlowAfterDebt: 364527,
                  cashOnCashReturn: 11.28,
                  monthlyDistribution: 30377
                }
              },
              
              // Market Analysis
              marketMetrics: {
                medianHouseholdIncome: 52500,
                populationGrowth: 4.2,
                employmentGrowth: 3.1,
                rentGrowthRate: 3.5,
                vacancyRate: 5.8,
                marketRentPremium: 5.2 // property rents 5.2% above market
              },
              
              // Value-Add Analysis
              valueAddMetrics: {
                renovationCost: 850000,
                renovationDate: "2023-Q4",
                preRenovationNOI: 715000,
                postRenovationNOI: 893302,
                noIincrease: 178302,
                renovationROI: 20.9 // ($178,302 / $850,000)
              }
            },
            
            // Investment Highlights
            investmentHighlights: [
              "🏦 LEVERAGED RETURNS: 70% bank financing amplifies investor returns to 11.28% cash-on-cash",
              "💰 INVESTORS FUND ONLY 30%: $3.23M equity vs $7.55M bank loan (70% LTV)",
              "📈 STRONG NOI: $893K annually (8.29% cap rate) with 21.2% expense ratio",
              "🏆 INTEREST-ONLY PERIOD: First 2 years generate 11.88% returns ($31,973/month)",
              "📍 HOUSTON GROWTH MARKET: 4.2% population growth drives rental demand",
              "🔧 VALUE-ADD COMPLETE: $850K renovation finished in 2023, now stabilized",
              "👥 PROFESSIONAL MANAGEMENT: Experienced multifamily operator handles operations",
              "💳 $1,000 minimum investment with monthly distributions to investors",
              "🌱 RENT GROWTH: 3.5% annual increases with 5.2% premium to market rates",
              "💼 INSTITUTIONAL QUALITY: 97-unit complex with strong debt coverage (1.35x DSCR)"
            ],
            
            // Financial Projections
            financialProjections: {
              year1: { 
                grossIncome: 1133300, 
                noi: 893302, 
                debtService: 509625, 
                cashFlow: 383677, 
                distributionPerToken: 125.3,
                cashOnCash: 11.88 
              },
              year2: { 
                grossIncome: 1173066, 
                noi: 924637, 
                debtService: 509625, 
                cashFlow: 415012, 
                distributionPerToken: 135.6,
                cashOnCash: 12.84 
              },
              year3: { 
                grossIncome: 1214123, 
                noi: 957100, 
                debtService: 528775, 
                cashFlow: 428325, 
                distributionPerToken: 140.0,
                cashOnCash: 13.25 
              },
              year4: { 
                grossIncome: 1256617, 
                noi: 990599, 
                debtService: 528775, 
                cashFlow: 461824, 
                distributionPerToken: 150.9,
                cashOnCash: 14.29 
              },
              year5: { 
                grossIncome: 1300603, 
                noi: 1025070, 
                debtService: 528775, 
                cashFlow: 496295, 
                distributionPerToken: 162.2,
                cashOnCash: 15.35 
              },
              assumptions: "3.5% annual rent growth, stable 21.2% expense ratio, interest-only first 2 years then P&I",
              projectedIRR: 16.8,
              projectedEquityMultiple: 2.1,
              exitCapRate: 7.5,
              projectedSalePrice: 13666667 // Year 5 NOI / 7.5% exit cap
            },
            
            // FractionaX Management Fee Structure
            managementFees: {
              overview: "FractionaX provides comprehensive deal structuring, compliance, and ongoing management services with investor-aligned fee structure.",
              
              acquisitionFee: {
                rate: 3.0, // 3% of purchase price
                amount: 323250, // 3% of $10.775M
                timing: "One-time at closing",
                covers: ["Property sourcing & underwriting", "Due diligence & legal structuring", "Tokenization & compliance filings", "Investor onboarding & documentation"]
              },
              
              assetManagementFee: {
                rate: 3.0, // 3% of gross collected rent
                monthlyAmount: 2833, // 3% of $94,442 monthly gross rent
                annualAmount: 34000, // 3% of $1,133,300 annual gross rent
                timing: "Monthly from gross collected rent",
                covers: ["Third-party property manager oversight", "Financial reporting & compliance monitoring", "Investor communications & distributions", "Property performance optimization"]
              },
              
              performanceFee: {
                rate: 5.0, // 5% of NOI growth above baseline
                trigger: "NOI growth above baseline pro-forma",
                baselineNOI: 893302,
                timing: "Annual, when performance targets exceeded",
                alignment: "FractionaX only earns extra when investors see stronger returns",
                estimatedAnnual: 4466 // 5% of projected NOI growth (conservative estimate)
              },
              
              dispositionFee: {
                rate: 1.0, // 1% of sale price
                estimatedAmount: 136667, // 1% of projected $13.67M sale price
                timing: "One-time at property sale/exit",
                covers: ["Transaction coordination", "Compliance filings & investor payouts", "Token unwinding & liquidation", "Sale process management"]
              },
              
              totalAnnualFees: {
                assetManagement: 34000,
                estimatedPerformance: 4466,
                totalAnnual: 38466,
                percentageOfNOI: 4.31, // Total annual fees as % of NOI
                netInvestorNOI: 854836 // NOI after management fees
              },
              
              investorAlignment: {
                targetCashYield: "8-12% annually after all fees",
                targetIRR: "12-18% including appreciation",
                feeTransparency: "All fees disclosed upfront with clear investor benefit alignment",
                valueProposition: "Professional management, compliance oversight, and performance optimization justify fee structure"
              }
            }
          },
          {
            id: 5,
            title: "🏞️ LAND DEAL: Raising Cane's Des Plaines - NNN Ground Lease",
            slug: "raising-canes-des-plaines-illinois",
            clipId: "CL-2024-IL-2069",
            address: "1535 Lee Street, Des Plaines, IL 60018",
            price: 4250000,
            rentPrice: 0,
            beds: 0,
            baths: 4,
            sqft: 3400,
            propertyType: "land",
            subcategory: "ground_lease",
            listingType: "sale",
            operationalStatus: "fully_operational",
            images: [
              "/images/properties/raising-canes-des-plaines/5a3403e6a6b246f0aeaccf6bd79f453d_3000x2000_resize.jpg",
              "/images/properties/raising-canes-des-plaines/Cover photo 2.jpg",
              "/images/properties/raising-canes-des-plaines/cover photo 3.jpg",
              "/images/properties/raising-canes-des-plaines/cover photo 4.jpg"
            ],
            description: "🏞️ LAND INVESTMENT: Des Plaines ground lease with Raising Cane's as tenant! Own the 1.2-acre LAND underneath this successful restaurant. 15-year NNN ground lease generating $340K+ annually with corporate guarantee. Land appreciates while tenant pays ALL expenses. Perfect hands-off real estate investment!",
            detailedDescription: "**PRIME LAND INVESTMENT OPPORTUNITY - RAISING CANE'S GROUND LEASE** \n\nThis is a **LAND DEAL** - you own the valuable 1.2-acre commercial land in Des Plaines, Illinois, with Raising Cane's as your tenant under a long-term ground lease. This represents a premier ground lease investment where you benefit from both stable income AND land appreciation.\n\n**WHY GROUND LEASES ARE SUPERIOR INVESTMENTS:**\n• **You Own the Land**: Real estate that appreciates over time\n• **Triple Net Lease**: Tenant pays ALL expenses (taxes, insurance, maintenance)\n• **No Building Risks**: Tenant owns and maintains the building\n• **Corporate Guarantee**: Raising Cane's USA LLC backs the lease\n• **Inflation Protection**: 5% rent increases every 5 years\n\n**LAND & LOCATION DETAILS:**\n• **Land Size**: 1.2 acres of prime commercial real estate\n• **Location**: Corner lot with high visibility on busy Des Plaines street\n• **Zoning**: Commercial - allows multiple future uses\n• **Demographics**: Affluent Chicago suburb with strong population growth\n• **Land Value**: $3.54M per acre in growing Des Plaines market\n\n**GROUND LEASE TERMS:**\n• **Lease Type**: Absolute Triple Net Ground Lease\n• **Tenant**: Raising Cane's USA LLC (Investment Grade Credit)\n• **Annual Ground Rent**: $340,000 (8.0% return on land value)\n• **Term**: 15 years total, 12 years remaining\n• **Increases**: 5% every 5 years (next increase 2027)\n• **Guarantee**: Full corporate guarantee - no personal guarantees\n\n**TENANT RESPONSIBILITIES (Triple Net):**\n• Property taxes, insurance, maintenance\n• All utilities and building expenses\n• Building improvements and renovations\n• You receive net rent with zero expenses\n\n**INVESTMENT ADVANTAGES:**\n• **Passive Income**: $28,333 monthly with zero management\n• **Land Appreciation**: Benefit from Des Plaines real estate growth\n• **Corporate Credit**: Investment-grade tenant reduces risk\n• **Future Flexibility**: Land reverts to you after lease term\n• **Recession Resistant**: Essential commercial land in prime location\n\nThis ground lease investment offers the perfect combination of stable income from a credit tenant plus long-term land appreciation in a growing Chicago suburb market.",
            features: ["ground_lease", "land_investment", "triple_net_lease", "corporate_guarantee", "corner_location", "1_2_acres", "commercial_zoning", "high_visibility", "chicago_suburb", "established_brand", "long_term_lease", "rent_escalations", "land_appreciation", "passive_income", "no_building_risk", "investment_grade_tenant"],
            yearBuilt: 2019,
            yearRenovated: 2023,
            lotSize: 1.2,
            coordinates: { lat: 42.0333, lng: -87.9334 },
            tokenized: true,
            tokenPrice: 1000,
            totalTokens: 4250,
            availableTokens: 3825,
            expectedROI: 8.0,
            monthlyRent: 28333,
            annualRent: 340000,
            capRate: 8.0,
            cashOnCash: 8.0,
            hoa: 0,
            taxes: 45000,
            insurance: 18000,
            listingDate: "2024-09-15",
            status: "active",
            agent: {
              name: "Jennifer Walsh",
              phone: "(847) 555-0892",
              email: "jennifer@chicagocommercial.com",
              company: "Chicago Commercial Real Estate Group",
              photo: "/api/placeholder/100/100",
              license: "IL-845923"
            },
            stats: {
              views: 1456,
              saves: 98,
              daysOnMarket: 12,
              priceHistory: [
                { date: "2024-09-15", price: 4250000, event: "Listed" }
              ]
            },
            neighborhood: {
              name: "Des Plaines/Northwest Chicago Suburbs",
              walkability: 72,
              transitScore: 65,
              bikeScore: 58
            },
            schools: [
              { name: "Des Plaines Elementary School", rating: 7, distance: 0.4 },
              { name: "Chute Middle School", rating: 8, distance: 0.8 },
              { name: "Maine West High School", rating: 8, distance: 1.2 }
            ],
            businessMetrics: {
              restaurantType: "Fast Casual Chicken",
              seatingCapacity: 65,
              driveThruLanes: 1,
              kitchenSqft: 800,
              diningRoomSqft: 2000,
              patioSeating: 24,
              parkingSpaces: 45,
              operatingHours: "10 AM - 11 PM Daily (12 AM Fri/Sat)",
              averageTicket: 12.50,
              dailyTransactions: 450,
              monthlyRevenue: 168750,
              annualRevenue: 2025000,
              employeeCount: 25,
              managementStructure: "Corporate Operated"
            },
            leaseDetails: {
              leaseType: "Triple Net (NNN)",
              leaseTerm: 15,
              remainingTerm: 12,
              baseRent: 340000,
              rentIncreases: "5% every 5 years",
              nextIncrease: "2027",
              tenant: "Raising Cane's USA LLC",
              tenantCreditRating: "Investment Grade",
              personalGuarantee: false,
              corporateGuarantee: true
            },
            investmentHighlights: [
              "🏞️ LAND INVESTMENT: Own 1.2 acres of prime Des Plaines commercial real estate",
              "💰 $340K annual GROUND RENT with corporate guarantee (8.0% land yield)",
              "📈 DUAL RETURNS: Stable income + land appreciation in growing Chicago suburb",
              "🏆 ZERO EXPENSES: Triple net ground lease - tenant pays ALL costs",
              "📍 Prime corner location with future development potential after lease",
              "👥 Investment-grade tenant: Raising Cane's USA LLC corporate guarantee",
              "🔄 NO BUILDING RISK: Tenant owns & maintains restaurant, you own appreciating land",
              "💳 $1,000 minimum investment with monthly passive income distributions",
              "🌱 Commercial zoning allows multiple future uses when lease expires",
              "💼 HANDS-OFF INVESTMENT: Ground lease requires zero management or oversight"
            ],
            
            // FractionaX Management Fee Structure
            managementFees: {
              overview: "FractionaX provides comprehensive deal structuring, compliance, and ongoing management services for this passive ground lease investment.",
              
              acquisitionFee: {
                rate: 3.0, // 3% of purchase price
                amount: 127500, // 3% of $4.25M
                timing: "One-time at closing",
                covers: ["Property sourcing & underwriting", "Due diligence & legal structuring", "Tokenization & compliance filings", "Investor onboarding & documentation"]
              },
              
              assetManagementFee: {
                rate: 3.0, // 3% of gross ground rent collected
                monthlyAmount: 850, // 3% of $28,333 monthly ground rent
                annualAmount: 10200, // 3% of $340K annual ground rent
                timing: "Monthly from gross ground rent collected",
                covers: ["Ground lease oversight & compliance monitoring", "Financial reporting & investor communications", "Tenant relationship management", "Land value monitoring & optimization"]
              },
              
              performanceFee: {
                rate: 5.0, // 5% of rent increases above baseline
                trigger: "Ground rent increases above baseline (5% bumps every 5 years)",
                baselineRent: 340000,
                timing: "Annual, when rent escalations occur",
                alignment: "FractionaX only earns extra when investors benefit from rent increases",
                estimatedNextBump: 850 // 5% of $17K rent increase in 2027
              },
              
              dispositionFee: {
                rate: 1.0, // 1% of sale price
                estimatedAmount: 46750, // 1% of estimated $4.675M sale price (10% appreciation)
                timing: "One-time at land sale/exit",
                covers: ["Transaction coordination", "Compliance filings & investor payouts", "Token unwinding & liquidation", "Sale process management"]
              },
              
              totalAnnualFees: {
                assetManagement: 10200,
                estimatedPerformance: 0, // No performance fees until rent bumps
                totalAnnual: 10200,
                percentageOfGroundRent: 3.0, // Total annual fees as % of ground rent
                netInvestorGroundRent: 329800 // Ground rent after management fees
              },
              
              investorAlignment: {
                targetCashYield: "7-9% annually after all fees",
                targetTotalReturn: "10-15% including land appreciation",
                feeTransparency: "Minimal fees for passive ground lease - only 3% asset management",
                valueProposition: "Professional oversight of corporate ground lease with minimal management requirements"
              }
            }
          },
          {
            id: 6,
            title: "🏞️ LAND DEAL: Life Time Fitness Kansas - 15 Yr Absolute NNN Lease",
            slug: "life-time-fitness-kansas-nnn-lease",
            clipId: "CL-2024-KS-8392",
            address: "11950 College Boulevard, Overland Park, KS 66210",
            price: 35900000,
            rentPrice: 0,
            beds: 0,
            baths: 16,
            sqft: 85000,
            propertyType: "land",
            subcategory: "ground_lease",
            listingType: "sale",
            operationalStatus: "fully_operational",
            images: [
              "/images/properties/lifetime-fitness-kansas/78273bad775943c8b96567c44f32d9f7_3000x2000_resize.jpg",
              "/images/properties/lifetime-fitness-kansas/cover photo 2.jpg",
              "/images/properties/lifetime-fitness-kansas/cover photo 3.jpg",
              "/images/properties/lifetime-fitness-kansas/cover photo 4.jpg",
              "/images/properties/lifetime-fitness-kansas/cover photo 5.jpg"
            ],
            description: "🏞️ PREMIUM LAND INVESTMENT: Own the land under Life Time Fitness in Overland Park, Kansas! 15-year absolute NNN ground lease with NYSE-traded Life Time (LTH) as tenant. $2.6M+ annual ground rent from investment-grade fitness leader. Prime 8.5-acre site with massive 85,000 sq ft flagship facility.",
            detailedDescription: "**INSTITUTIONAL-GRADE LAND INVESTMENT - LIFE TIME FITNESS GROUND LEASE** \n\nThis is a **PREMIUM LAND DEAL** - you own 8.5 acres of prime commercial real estate in Overland Park, Kansas, with Life Time Fitness (NYSE: LTH) as your tenant under a 15-year absolute triple net ground lease. This represents an institutional-grade ground lease investment with a publicly-traded, investment-grade tenant.\n\n**WHY THIS GROUND LEASE IS SUPERIOR:**\n• **You Own Prime Land**: 8.5 acres in affluent Overland Park, KS\n• **NYSE-Traded Tenant**: Life Time Fitness (NYSE: LTH) - $4B+ market cap\n• **Absolute NNN Lease**: Tenant pays ALL expenses with zero landlord costs\n• **Investment Grade Credit**: Publicly-traded fitness industry leader\n• **Premium Location**: Overland Park - Kansas City's wealthiest suburb\n\n**LAND & LOCATION DETAILS:**\n• **Land Size**: 8.5 acres of premium commercial real estate\n• **Location**: College Boulevard - major retail/business corridor\n• **Demographics**: Median HH income $95K+, educated population\n• **Facility**: 85,000 sq ft flagship Life Time Athletic club\n• **Zoning**: Commercial - multiple future development options\n• **Land Value**: $4.22M per acre in prime Kansas City market\n\n**GROUND LEASE TERMS:**\n• **Lease Type**: 15-Year Absolute Triple Net Ground Lease\n• **Tenant**: Life Time, Inc. (NYSE: LTH) - Public Company\n• **Annual Ground Rent**: $2,633,000 (7.33% return on land)\n• **Term**: 15 years absolute net lease\n• **Credit Rating**: Investment Grade - NYSE-traded company\n• **Guarantee**: Corporate guarantee from $4B+ public company\n\n**TENANT RESPONSIBILITIES (Absolute NNN):**\n• Property taxes, insurance, maintenance, utilities\n• All building expenses and capital improvements\n• Landscaping, parking lot maintenance, snow removal\n• You receive net ground rent with ZERO expenses\n\n**LIFE TIME FITNESS - TENANT STRENGTH:**\n• **Public Company**: NYSE: LTH, $4.2B market capitalization\n• **Industry Leader**: Premium fitness clubs with affluent membership\n• **Strong Financials**: $2B+ annual revenue, growing company\n• **Recession Resilient**: High-income member base ($100K+ avg income)\n• **Long-Term Growth**: Expanding premium fitness footprint\n\n**INVESTMENT ADVANTAGES:**\n• **Institutional Quality**: Public company tenant, investment-grade credit\n• **Premium Demographics**: Overland Park - Kansas City's wealthiest area\n• **Land Appreciation**: Prime commercial land in growing KC suburb\n• **Zero Management**: Absolute net lease requires no oversight\n• **Future Flexibility**: 8.5 acres for future development after lease\n• **Passive Income**: $219,417 monthly with no expenses\n\nThis ground lease represents institutional-quality real estate with a blue-chip tenant in one of Kansas City's most desirable commercial corridors.",
            features: ["ground_lease", "land_investment", "absolute_nnn_lease", "nyse_traded_tenant", "investment_grade_credit", "8_5_acres", "commercial_zoning", "overland_park_location", "flagship_facility", "premium_demographics", "long_term_lease", "institutional_quality", "land_appreciation", "passive_income", "no_expenses", "public_company_tenant"],
            yearBuilt: 2005,
            yearRenovated: 2019,
            lotSize: 8.5,
            coordinates: { lat: 38.8839, lng: -94.6708 },
            tokenized: true,
            tokenPrice: 2500,
            totalTokens: 14360,
            availableTokens: 12906,
            expectedROI: 7.33,
            monthlyRent: 219417,
            annualRent: 2633000,
            capRate: 7.33,
            cashOnCash: 7.33,
            hoa: 0,
            taxes: 285000,
            insurance: 45000,
            listingDate: "2024-09-28",
            status: "active",
            agent: {
              name: "Robert Mitchell",
              phone: "(913) 555-0456",
              email: "robert@kansascitycommercial.com",
              company: "Kansas City Commercial Real Estate Group",
              photo: "/api/placeholder/100/100",
              license: "KS-923847"
            },
            stats: {
              views: 2843,
              saves: 267,
              daysOnMarket: 1,
              priceHistory: [
                { date: "2024-09-28", price: 35900000, event: "Listed" }
              ]
            },
            neighborhood: {
              name: "Overland Park/Southwest Kansas City",
              walkability: 75,
              transitScore: 68,
              bikeScore: 62
            },
            schools: [
              { name: "Blue Valley Northwest High School", rating: 10, distance: 1.2 },
              { name: "Brookridge Elementary", rating: 9, distance: 0.8 },
              { name: "Indian Creek Middle School", rating: 9, distance: 1.0 }
            ],
            businessMetrics: {
              facilityType: "Premium Athletic Club",
              memberCapacity: 8500,
              avgMembershipFee: 89,
              totalSquareFeet: 85000,
              gymFloorSpace: 35000,
              poolArea: 12000,
              courtsSpa: 25000,
              childCareArea: 5000,
              cafeRetail: 8000,
              parkingSpaces: 450,
              operatingHours: "4:30 AM - 11:00 PM Daily",
              peakMembership: 7200,
              employeeCount: 180,
              annualClubRevenue: 18500000,
              memberRetentionRate: 87
            },
            leaseDetails: {
              leaseType: "15-Year Absolute Triple Net Ground Lease",
              leaseTerm: 15,
              remainingTerm: 15,
              baseRent: 2633000,
              rentIncreases: "Fixed for term",
              tenant: "Life Time, Inc. (NYSE: LTH)",
              tenantCreditRating: "Investment Grade",
              tenantMarketCap: 4200000000,
              personalGuarantee: false,
              corporateGuarantee: true,
              publicCompany: true,
              stockSymbol: "LTH"
            },
            investmentHighlights: [
              "🏞️ PREMIUM LAND: Own 8.5 acres in affluent Overland Park, Kansas",
              "💰 $2.63M annual GROUND RENT from NYSE-traded Life Time (LTH)",
              "📈 INSTITUTIONAL QUALITY: $4.2B public company tenant with investment-grade credit",
              "🏆 ABSOLUTE NNN LEASE: Zero expenses - tenant pays taxes, insurance, everything",
              "📍 PRIME LOCATION: College Boulevard in Kansas City's wealthiest suburb",
              "👥 BLUE-CHIP TENANT: Life Time Fitness - premium fitness industry leader",
              "🔄 NO RISK EXPOSURE: Land investment with publicly-traded tenant",
              "💳 $2,500 minimum investment with monthly institutional-grade distributions",
              "🌱 FUTURE DEVELOPMENT: 8.5 acres with commercial zoning flexibility",
              "💼 HANDS-OFF INVESTMENT: Absolute net lease requires zero management"
            ],
            
            // FractionaX Management Fee Structure  
            managementFees: {
              overview: "FractionaX provides comprehensive deal structuring, compliance, and ongoing management services for this institutional-grade ground lease investment.",
              
              acquisitionFee: {
                rate: 3.0, // 3% of purchase price
                amount: 1077000, // 3% of $35.9M
                timing: "One-time at closing",
                covers: ["Property sourcing & underwriting", "Due diligence & legal structuring", "Tokenization & compliance filings", "Investor onboarding & documentation"]
              },
              
              assetManagementFee: {
                rate: 3.0, // 3% of gross ground rent collected
                monthlyAmount: 6580, // 3% of $219,417 monthly ground rent
                annualAmount: 78990, // 3% of $2.633M annual ground rent
                timing: "Monthly from gross ground rent collected",
                covers: ["Ground lease oversight & compliance monitoring", "Financial reporting & investor communications", "NYSE tenant relationship management", "Land value monitoring & institutional reporting"]
              },
              
              performanceFee: {
                rate: 5.0, // 5% of any rent increases or performance above baseline
                trigger: "Fixed lease term - no rent escalations but potential for early lease renewal negotiations",
                baselineRent: 2633000,
                timing: "Only if lease terms improve or early renewal secured",
                alignment: "FractionaX only earns extra when investors benefit from improved lease terms",
                estimatedAnnual: 0 // No performance fees expected with fixed lease
              },
              
              dispositionFee: {
                rate: 1.0, // 1% of sale price
                estimatedAmount: 394900, // 1% of estimated $39.49M sale price (10% appreciation)
                timing: "One-time at land sale/exit",
                covers: ["Transaction coordination with institutional buyers", "Compliance filings & investor payouts", "Token unwinding & liquidation", "Sale process management"]
              },
              
              totalAnnualFees: {
                assetManagement: 78990,
                estimatedPerformance: 0, // No performance fees with fixed lease
                totalAnnual: 78990,
                percentageOfGroundRent: 3.0, // Total annual fees as % of ground rent
                netInvestorGroundRent: 2554010 // Ground rent after management fees
              },
              
              investorAlignment: {
                targetCashYield: "6-8% annually after all fees",
                targetTotalReturn: "9-13% including land appreciation",
                feeTransparency: "Minimal fees for institutional ground lease - only 3% asset management",
                valueProposition: "Professional oversight of NYSE-tenant ground lease with institutional-quality reporting and compliance"
              }
            }
          }
        ];
        
        setApprovedListings(mockApprovedListings);
        console.log('✅ Loaded approved listings:', mockApprovedListings.length);
      }
      
      // Load Enhanced Discovery data for deal-pipeline tab (main discovery endpoint)
      if (activeTab === 'deal-pipeline' || activeTab === 'ai-discovered' || activeTab === 'enhanced-discovery') {
        if (aiDiscoveredProperties.length === 0 || forceReload) {
          // This will call Enhanced Discovery endpoint (CoreLogic + AI discovery)
          await fetchAISuggestedListings();
        }
      }
      
      // Legacy support for commercial properties tab (if still needed for testing)
      if (activeTab === 'commercial-properties') {
        if (commercialProperties.length === 0 || forceReload) {
          await fetchCommercialProperties();
        }
      }
    }
    
    if (needsLoading) {
      setLoading(false);
    }
  };

  // Get current properties based on active tab
  const currentProperties = useMemo(() => {
    let result;
    if (activeTab === 'approved') {
      result = approvedListings;
    } else if (activeTab === 'deal-pipeline') {
      // Focus on Enhanced Discovery as main pipeline source (CoreLogic + AI)
      // Enhanced Discovery will be the primary endpoint for deal discovery
      result = aiDiscoveredProperties; // This will be Enhanced Discovery data
    } else {
      // Legacy support for individual tabs
      if (activeTab === 'commercial-properties') result = commercialProperties;
      else if (activeTab === 'ai-discovered') result = aiDiscoveredProperties;
      else if (activeTab === 'enhanced-discovery') result = aiDiscoveredProperties;
      else result = aiDiscoveredProperties;
    }
    
    console.log(`📊 currentProperties for tab '${activeTab}':`, {
      count: result.length,
      tab: activeTab,
      source: activeTab === 'deal-pipeline' ? 'Enhanced Discovery (CoreLogic + AI)' : activeTab,
      sampleProperty: result[0]
    });
    
    return result;
  }, [activeTab, approvedListings, aiDiscoveredProperties, commercialProperties]);

  // Base property filtering logic
  const getFilteredProperties = (properties, filters, searchQuery, quickFilters, userFilters = {}) => {
    let filtered = properties;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Quick filters
    if (quickFilters.highROI) {
      filtered = filtered.filter(property => (property.expectedROI || 0) >= 10);
    }
    
    if (quickFilters.under500K) {
      filtered = filtered.filter(property => property.price <= 500000);
    }
    
    if (quickFilters.newThisWeek) {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(property => {
        const listingDate = new Date(property.listingDate);
        return listingDate.getTime() > oneWeekAgo;
      });
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => 
        property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }
    
    // Subcategory filter (for approved listings)
    if (activeTab === 'approved' && activeSubcategory !== 'all') {
      filtered = filtered.filter(property => 
        property.subcategory && property.subcategory.toLowerCase() === activeSubcategory.toLowerCase()
      );
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'any') {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => property.beds >= bedroomCount);
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'any') {
      const bathroomCount = parseInt(filters.bathrooms);
      filtered = filtered.filter(property => property.baths >= bathroomCount);
    }

    // Apply user-specific filters if provided (for authenticated users)
    if (isAuthenticated && userFilters) {
      if (userFilters.showOnlyLiked && userFilters.userLikes) {
        filtered = filtered.filter(property => userFilters.userLikes.has(property.id));
      }
      
      if (userFilters.showOnlyBookmarked && userFilters.userBookmarks) {
        filtered = filtered.filter(property => userFilters.userBookmarks.has(property.id));
      }
      
      if (userFilters.showOnlyCommitted && userFilters.userCommitments) {
        filtered = filtered.filter(property => userFilters.userCommitments[property.id] > 0);
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'roi':
        filtered.sort((a, b) => (b.expectedROI || 0) - (a.expectedROI || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Apply filtering with current filters
  const filteredProperties = useMemo(() => {
    return getFilteredProperties(currentProperties, baseFilters, searchQuery, quickFilters);
  }, [currentProperties, baseFilters, searchQuery, quickFilters]);

  // Paginate filtered properties
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredProperties.slice(startIdx, endIdx);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // Load data when category or tab changes
  useEffect(() => {
    loadMarketplaceData();
  }, [activeCategory, activeTab]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [baseFilters, searchQuery, quickFilters]);

  // Helper function to toggle data sources
  const toggleSource = (source) => {
    setBaseFilters(prev => {
      const currentSources = prev.sources || [];
      const newSources = currentSources.includes(source)
        ? currentSources.filter(s => s !== source)
        : [...currentSources, source];
      
      return {
        ...prev,
        sources: newSources
      };
    });
  };

  // Helper function to set all sources
  const setAllSources = (enabled = true) => {
    setBaseFilters(prev => ({
      ...prev,
      sources: enabled ? ['loopnet', 'crexi', 'auction', 'realtor'] : []
    }));
  };

  return {
    // State
    activeCategory,
    activeTab,
    loading,
    viewMode,
    showMap,
    showFilters,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalPages,
    approvedListings,
    aiDiscoveredProperties,
    commercialProperties, // New: LoopNet commercial properties
    isLoadingSuggested,
    isLoadingCommercial, // New: Loading state for commercial properties
    apiError,
    baseFilters,
    quickFilters,
    activeSubcategory,
    
    // Computed
    currentProperties,
    filteredProperties,
    paginatedProperties,
    
    // Actions
    setActiveCategory,
    setActiveTab,
    setViewMode,
    setShowMap,
    setShowFilters,
    setSearchQuery,
    setCurrentPage,
    setBaseFilters,
    setQuickFilters,
    setActiveSubcategory,
    
    // Methods
    loadMarketplaceData,
    refreshMarketplaceData: () => loadMarketplaceData(true), // Force refresh
    fetchAISuggestedListings,
    fetchCommercialProperties, // New: Fetch multi-source commercial properties
    getFilteredProperties, // Export for custom filtering in child components
    
    // Source filtering helpers
    toggleSource,
    setAllSources,
  };
};

export default useMarketplace;