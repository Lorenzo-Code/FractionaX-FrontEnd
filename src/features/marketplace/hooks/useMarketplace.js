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
            id: 1,
            title: "Premium Clock Tower Car Wash & Detail Center - Georgia",
            address: "4460 N Henry Blvd, Stockbridge, GA 30281",
            price: 2750000,
            rentPrice: 0,
            beds: 0,
            baths: 6,
            sqft: 9200,
            propertyType: "commercial",
            subcategory: "business",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1616587894289-86480e533129?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1625231209584-93b7fd2b5b3e?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1593963192444-8b9b93b3e2d7?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "🏆 Turn-key car wash empire generating $547K+ annually! This flagship Clock Tower Car Wash features 10 automated bays, premium detail center, and prime 2.3-acre corner lot with 35K+ daily traffic count. Newly renovated with state-of-the-art equipment and recession-proof cash flow model.",
            detailedDescription: "**INSTITUTIONAL-GRADE CAR WASH INVESTMENT** - This is the crown jewel of Georgia's car wash industry. Located at one of Henry County's busiest intersections (Henry Blvd & Rock Quarry Rd), this facility serves the rapidly growing Stockbridge market with 35,000+ vehicles passing daily. \n\n**RECENT $450K RENOVATION COMPLETED** - All equipment upgraded to industry-leading Belanger Vector systems, new LED lighting throughout, enhanced customer experience with premium waiting lounge, and contactless payment technology. \n\n**FINANCIAL HIGHLIGHTS** \n• Gross Revenue: $547,200/year (growing 12% annually) \n• Net Operating Income: $392,400 (71.7% margin) \n• 6-Year Performance History Available \n• Recession-resistant essential service business \n\n**OPERATIONAL EXCELLENCE** \n• 10 fully automated express wash tunnels \n• 16 self-service vacuum stations with mat cleaners \n• Premium full-service detail center (6 bays) \n• Customer loyalty program with 8,500+ active members \n• Professional management team in place \n\n**STRATEGIC LOCATION ADVANTAGES** \n• Prime corner visibility on Henry Boulevard \n• Adjacent to major shopping centers & residential developments \n• Easy access from I-75 (Exit 224) \n• Growing Atlanta metro suburb with 15%+ population growth \n• Limited competition in 5-mile radius \n\nPerfect for investors seeking stable, high-margin cash flow with minimal management requirements. **Seller financing available** for qualified buyers.",
            features: ["automated_express_tunnels", "premium_detail_center", "vacuum_stations", "customer_loyalty_program", "contactless_payments", "corner_lot_visibility", "recession_resistant", "professional_management", "recent_renovation", "seller_financing_available", "high_traffic_location", "growing_market"],
            yearBuilt: 2017,
            yearRenovated: 2024,
            lotSize: 2.3,
            coordinates: { lat: 33.5434, lng: -84.2335 },
            tokenized: true,
            tokenPrice: 510,
            totalTokens: 5392,
            availableTokens: 4045,
            expectedROI: 15.8,
            annualRevenue: 547200,
            monthlyRevenue: 45600,
            grossRevenue: 547200,
            netOperatingIncome: 392400,
            capRate: 14.3,
            cashOnCashReturn: 18.2,
            hoa: 0,
            taxes: 31200,
            insurance: 15600,
            utilities: 28800,
            maintenance: 42000,
            listingDate: "2024-09-01",
            status: "active",
            daysOnMarket: 18,
            mlsNumber: "GA-CW-785432",
            agent: {
              name: "Marcus Thompson",
              phone: "(770) 555-0245",
              email: "marcus@georgiacommercial.com",
              company: "Georgia Commercial Properties",
              photo: "/api/placeholder/100/100",
              license: "GA-987654",
              yearsExperience: 12,
              specialization: "Car Wash & Service Business Sales"
            },
            stats: {
              views: 2456,
              saves: 218,
              inquiries: 34,
              virtualTours: 156,
              daysOnMarket: 18,
              priceHistory: [
                { date: "2024-09-01", price: 2750000, event: "Listed", details: "Initial listing with recent renovation" },
                { date: "2024-08-15", price: 2850000, event: "Pre-listing estimate", details: "Before market adjustment" }
              ]
            },
            neighborhood: {
              name: "Stockbridge/Henry County",
              walkability: 52,
              transitScore: 38,
              bikeScore: 34,
              demographics: {
                medianIncome: 68500,
                populationGrowth: 15.2,
                avgHouseholdSize: 2.8,
                homeOwnership: 71.5
              }
            },
            schools: [
              { name: "Stockbridge Elementary", rating: 7, distance: 0.8, enrollment: 642 },
              { name: "Stockbridge Middle School", rating: 6, distance: 1.2, enrollment: 854 },
              { name: "Stockbridge High School", rating: 7, distance: 1.5, enrollment: 1156 }
            ],
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
              operatingHours: "6:00 AM - 10:00 PM Daily",
              peakHours: "7-9 AM, 12-2 PM, 5-7 PM weekdays; 8 AM-6 PM weekends",
              seasonalVariation: "Spring/Summer +18%, Winter -8%",
              customerLoyalty: {
                activeMemberships: 8540,
                monthlyMemberRevenue: 127500,
                memberRetentionRate: 84.2
              },
              equipment: {
                tunnelSystems: "Belanger Vector Series (2024)",
                vacuumSystems: "JE Adams Super Vacs with mat cleaners",
                paymentSystems: "Contactless NFC, Mobile App, Traditional",
                waterRecycling: "80% reclaim system - eco-friendly"
              },
              competition: {
                nearest: "Quick Wash Express (2.1 miles)",
                marketShare: "Estimated 35% local market share",
                differentiators: ["Premium detail services", "Loyalty program", "Corner location", "Extended hours"]
              }
            },
            investmentHighlights: [
              "🎯 14.3% Cap Rate with 71.7% NOI Margin",
              "📈 12% Annual Revenue Growth (6-year trend)",
              "💰 $392K+ Annual Net Operating Income",
              "🏆 Market-leading facility with recent $450K renovation",
              "📍 35K+ daily traffic count prime corner location",
              "👥 8,500+ loyalty program members generating recurring revenue",
              "🔄 Recession-resistant essential service business model",
              "💳 Multiple revenue streams: Express wash, Detail, Memberships",
              "🌱 Growing Atlanta suburb market (+15% population growth)",
              "💼 Professional management team in place - semi-absentee opportunity"
            ],
            financialProjections: {
              year1: { revenue: 547200, noi: 392400, roi: 14.3 },
              year2: { revenue: 612864, noi: 439344, roi: 16.0 },
              year3: { revenue: 686408, noi: 491613, roi: 17.9 },
              assumptions: "12% annual growth, 71.7% NOI margin maintained"
            }
          },
          {
            id: 2,
            title: "🚧 Michigan Express Car Wash - Development Opportunity",
            address: "2847 E Grand River Ave, Howell, MI 48843",
            price: 3200000,
            rentPrice: 0,
            beds: 0,
            baths: 0,
            sqft: 0,
            lotSize: 1.8,
            propertyType: "commercial",
            subcategory: "business",
            listingType: "development",
            developmentStage: "approved",
            images: [
              "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1616587894289-86480e533129?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "🚀 GROUND-UP CAR WASH DEVELOPMENT! Join us in building Michigan's newest express car wash on this prime 1.8-acre site. All permits approved, architectural plans complete, construction ready to start. Projected $680K+ annual revenue with 16.5% stabilized returns!",
            detailedDescription: "**BUILD THE FUTURE OF CAR WASHING IN MICHIGAN** \n\nThis is a rare opportunity to participate in a ground-up car wash development from day one. Located on high-traffic East Grand River Avenue in rapidly growing Howell, Michigan, this approved development site offers investors the chance to build and own a state-of-the-art express car wash facility.\n\n**DEVELOPMENT HIGHLIGHTS**\n• **All Approvals Complete**: Site plan, building permits, and environmental clearances obtained\n• **Architectural Plans Finalized**: Modern express tunnel design by car wash specialists\n• **Construction Ready**: Ground breaking scheduled for Q4 2024\n• **Equipment Pre-Ordered**: Latest Ryko Maxx 5 tunnel systems secured\n• **Professional Management**: Experienced car wash operators managing construction & operations\n\n**LOCATION ADVANTAGES**\n• East Grand River Avenue - 28,500+ daily traffic count\n• Growing Howell market with 18% population growth (5-year)\n• Limited competition within 3-mile radius\n• Adjacent to major retail centers and residential developments\n• Easy highway access (I-96 & US-23)\n\n**FINANCIAL PROJECTIONS**\n• **Total Development Cost**: $3.2M (land + construction)\n• **Stabilized Annual Revenue**: $687,500 (Year 2)\n• **Stabilized NOI**: $525,000+ (76.4% margin)\n• **Stabilized Cap Rate**: 16.4%\n• **Construction Timeline**: 8-10 months\n• **Stabilization**: 18 months from groundbreaking\n\n**DEVELOPMENT TEAM**\n• **General Contractor**: MidWest Car Wash Construction (50+ facilities built)\n• **Equipment Supplier**: Ryko Solutions (industry leader)\n• **Architect**: Commercial Design Associates\n• **Operator**: Great Lakes Car Wash Management\n\n**CONSTRUCTION SPECIFICATIONS**\n• 100-foot express tunnel with Ryko Maxx 5 equipment\n• 14 vacuum stations with mat cleaning capability\n• Customer waiting area with retail space\n• LED lighting and modern payment systems\n• Water reclaim system (85% recycling)\n• Professional landscaping and signage\n\nThis is turnkey development - investors provide capital, professionals handle everything else. **Limited partnership structure available** with quarterly distributions starting in Year 2.",
            features: ["ground_up_development", "all_permits_approved", "construction_ready", "express_tunnel_design", "high_traffic_location", "limited_competition", "professional_management", "ryko_equipment", "water_reclaim_system", "turnkey_investment", "growing_market", "quarterly_distributions"],
            yearBuilt: 2025,
            yearCompleted: 2025,
            coordinates: { lat: 42.6073, lng: -83.9294 },
            tokenized: true,
            tokenPrice: 640,
            totalTokens: 5000,
            availableTokens: 5000,
            expectedROI: 16.5,
            constructionCost: 2450000,
            landCost: 750000,
            totalDevelopmentCost: 3200000,
            projectedAnnualRevenue: 687500,
            stabilizedNOI: 525000,
            stabilizedCapRate: 16.4,
            constructionTimeline: "8-10 months",
            stabilizationPeriod: "18 months",
            hoa: 0,
            projectedTaxes: 42000,
            projectedInsurance: 18000,
            projectedUtilities: 36000,
            projectedMaintenance: 66500,
            listingDate: "2024-09-15",
            status: "pre-construction",
            constructionStartDate: "2024-11-01",
            expectedCompletionDate: "2025-07-01",
            mlsNumber: "MI-DEV-448821",
            agent: {
              name: "Jennifer Walsh",
              phone: "(248) 555-0892",
              email: "jennifer@michigancommercialdev.com",
              company: "Michigan Commercial Development",
              photo: "/api/placeholder/100/100",
              license: "MI-445789",
              yearsExperience: 15,
              specialization: "Car Wash Development & Commercial Construction"
            },
            stats: {
              views: 3241,
              saves: 294,
              inquiries: 87,
              virtualTours: 45,
              daysOnMarket: 4,
              priceHistory: [
                { date: "2024-09-15", price: 3200000, event: "Development Launch", details: "Initial offering - construction ready" }
              ]
            },
            neighborhood: {
              name: "Howell/Livingston County",
              walkability: 42,
              transitScore: 28,
              bikeScore: 35,
              demographics: {
                medianIncome: 72800,
                populationGrowth: 18.3,
                avgHouseholdSize: 2.9,
                homeOwnership: 78.2,
                avgVehiclesPerHousehold: 2.4
              }
            },
            schools: [
              { name: "Howell High School", rating: 8, distance: 2.1, enrollment: 1842 },
              { name: "Southeast Elementary", rating: 7, distance: 1.8, enrollment: 465 },
              { name: "Howell Middle School", rating: 7, distance: 2.3, enrollment: 678 }
            ],
            developmentMetrics: {
              plannedWashBays: 1,
              tunnelLength: 100,
              vacuumStations: 14,
              estimatedDailyCarCount: 125,
              estimatedWeekendCarCount: 220,
              averageTicket: 15.75,
              membershipTicket: 29.99,
              projectedMembershipPenetration: 35,
              operatingHours: "6:00 AM - 9:00 PM Daily",
              peakSeasons: "Spring through Fall (April-October)",
              employeeCount: 12,
              equipment: {
                tunnelSystem: "Ryko Maxx 5 Express Tunnel",
                vacuumSystems: "JE Adams Super Vacs with mat cleaning",
                paymentSystems: "Full contactless NFC, mobile app, credit/debit",
                waterRecycling: "85% reclaim system with advanced filtration",
                lighting: "Full LED interior/exterior with smart controls"
              },
              permits: {
                sitePlan: "Approved - July 2024",
                buildingPermit: "Approved - August 2024",
                environmental: "Phase I & II Environmental completed - Clean",
                utilities: "All connections approved and designed",
                traffic: "Traffic study completed - no improvements required"
              },
              competition: {
                nearest: "Howell Car Spa (3.2 miles)",
                competitorCount: 2,
                marketGap: "No express tunnel within 3 miles",
                differentiators: ["First express tunnel in area", "Modern technology", "Eco-friendly systems", "Premium location"]
              }
            },
            constructionSchedule: [
              { phase: "Site Preparation", duration: "3 weeks", startDate: "2024-11-01" },
              { phase: "Foundation & Utilities", duration: "4 weeks", startDate: "2024-11-22" },
              { phase: "Building Construction", duration: "12 weeks", startDate: "2024-12-20" },
              { phase: "Equipment Installation", duration: "6 weeks", startDate: "2025-03-14" },
              { phase: "Testing & Training", duration: "2 weeks", startDate: "2025-04-25" },
              { phase: "Grand Opening", duration: "1 week", startDate: "2025-05-09" }
            ],
            investmentHighlights: [
              "🚀 Ground-up development with 16.4% stabilized cap rate",
              "🏆 All permits approved - construction ready to start",
              "📍 Prime East Grand River location (28.5K daily traffic)",
              "📈 Growing Howell market (+18% population growth)",
              "⚡ Latest Ryko Maxx 5 tunnel technology pre-ordered",
              "🎯 No express tunnel competition within 3 miles",
              "💰 Projected $525K+ annual NOI at stabilization",
              "🌱 85% water reclaim system - eco-friendly operation",
              "💼 Professional development & management team",
              "📅 18-month timeline to full operations & cash flow"
            ],
            financialProjections: {
              year1: { revenue: 206250, noi: -48000, roi: -1.5, status: "construction" },
              year2: { revenue: 687500, noi: 525000, roi: 16.4, status: "stabilized" },
              year3: { revenue: 740625, noi: 566250, roi: 17.7, status: "mature" },
              assumptions: "Ramp-up: 30% Y1 (9 months), 100% Y2, 7.5% growth Y3+"
            },
            riskFactors: [
              "Construction delays due to weather or permitting",
              "Equipment delivery delays",
              "Market competition from new entrants",
              "Economic downturn affecting discretionary spending",
              "Labor shortages during construction"
            ],
            mitigationStrategies: [
              "Experienced construction team with weather contingencies",
              "Equipment pre-ordered with delivery guarantees",
              "First-mover advantage in underserved market",
              "Car wash industry historically recession-resistant",
              "Fixed-price construction contract with skilled trades"
            ]
          },
          {
            id: 3,
            title: "Dallas Office Building - Value-Add Investment",
            address: "2750 N Stemmons Fwy, Dallas, TX 75207",
            price: 4750000,
            rentPrice: 0,
            beds: 0,
            baths: 12,
            sqft: 58000,
            propertyType: "office",
            subcategory: "business",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop&auto=format&q=85", 
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "Prime Dallas office building presenting exceptional value-add opportunity in the heart of the Design District. This 58,000 sq ft professional office complex features 4 floors of modern workspace with excellent highway visibility and access. Currently 65% occupied with significant upside potential through strategic leasing and property improvements.",
            detailedDescription: "This strategically positioned office building represents a premier value-add investment opportunity in Dallas's rapidly evolving Design District. The 4-story structure offers flexible floor plates ideal for corporate tenants, creative agencies, and professional services firms. Recent infrastructure improvements include updated HVAC systems and fiber optic connectivity throughout. The property benefits from excellent access to I-35E and proximity to downtown Dallas, Trinity Groves, and the Medical District. With current below-market rents and strong tenant demand in the area, this asset offers substantial NOI growth potential through strategic capital improvements and aggressive leasing. Perfect for institutional investors seeking core-plus returns in a dynamic submarket.",
            features: ["highway_visibility", "fiber_optic_ready", "flexible_floor_plates", "updated_hvac", "covered_parking", "conference_facilities", "elevator_access", "security_systems", "design_district_location", "value_add_potential"],
            yearBuilt: 1995,
            lotSize: 2.8,
            coordinates: { lat: 32.7879, lng: -96.8372 },
            tokenized: true,
            tokenPrice: 950,
            totalTokens: 5000,
            availableTokens: 4250,
            expectedROI: 15.8,
            monthlyRent: 0,
            grossRentRoll: 45000,
            netOperatingIncome: 385000,
            occupancyRate: 65,
            stabilizedOccupancy: 90,
            capRate: 8.1,
            stabilizedCapRate: 11.2,
            improvementBudget: 850000,
            hoa: 0,
            taxes: 67500,
            insurance: 28500,
            listingDate: "2024-01-30",
            status: "active",
            agent: {
              name: "Rebecca Martinez",
              phone: "(214) 555-0892",
              email: "rebecca@dallascommercialgroup.com",
              company: "Dallas Commercial Investment Group",
              photo: "/api/placeholder/100/100",
              license: "TX-678901"
            },
            stats: {
              views: 1834,
              saves: 156,
              daysOnMarket: 35,
              priceHistory: [
                { date: "2024-01-30", price: 4750000, event: "Listed" },
                { date: "2024-01-15", price: 5200000, event: "Price Reduction" }
              ]
            },
            neighborhood: {
              name: "Design District/Trinity Groves",
              walkability: 72,
              transitScore: 65,
              bikeScore: 58
            },
            schools: [
              { name: "Thomas Jefferson High School", rating: 6, distance: 1.8 },
              { name: "N.W. Harllee Elementary", rating: 5, distance: 2.2 },
              { name: "Billy Earl Dade Middle School", rating: 5, distance: 2.5 }
            ],
            investmentMetrics: {
              totalLeasableArea: 58000,
              currentOccupancy: 65,
              averageRentPSF: 18.50,
              marketRentPSF: 24.00,
              operatingExpenseRatio: 42,
              parkingRatio: 3.8,
              majorTenants: [
                { name: "Design Agency Inc.", sqft: 12000, lease_expires: "2026-12" },
                { name: "Marketing Solutions LLC", sqft: 8500, lease_expires: "2027-06" },
                { name: "Professional Services Group", sqft: 6800, lease_expires: "2025-09" }
              ]
            }
          },
          {
            id: 4,
            title: "Ohio Value-Add 11-Unit Apartment Building",
            address: "2456 Bryden Road, Columbus, OH 43205",
            price: 1250000,
            rentPrice: 0,
            beds: 22,
            baths: 11,
            sqft: 8800,
            propertyType: "multifamily",
            subcategory: "multifamily",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "Exceptional value-add opportunity featuring an 11-unit multifamily property in Columbus, Ohio. Currently generating strong rental income with significant upside potential through strategic renovations and rent optimization. Perfect for investors seeking cash flow and appreciation.",
            detailedDescription: "This well-positioned 11-unit apartment building represents a prime value-add investment opportunity in Columbus's growing rental market. The property consists of a mix of 1 and 2-bedroom units with individual utilities and separate entrances. Recent capital improvements include updated electrical and plumbing systems. The strategic location provides excellent access to downtown Columbus, Ohio State University, and major employment centers. With below-market rents and renovation potential, this asset offers substantial upside for the savvy investor.",
            features: ["value_add_opportunity", "separate_utilities", "parking_included", "close_to_osu", "recent_improvements", "below_market_rents", "cash_flowing", "renovation_upside", "strong_rental_demand", "downtown_proximity"],
            yearBuilt: 1995,
            lotSize: 0.8,
            coordinates: { lat: 39.9742, lng: -82.9988 },
            tokenized: true,
            tokenPrice: 250,
            totalTokens: 5000,
            availableTokens: 3200,
            expectedROI: 16.8,
            monthlyRent: 8900,
            grossRentMultiplier: 11.7,
            capRate: 8.5,
            cashOnCash: 12.3,
            hoa: 0,
            taxes: 18500,
            insurance: 2400,
            listingDate: "2024-01-20",
            status: "active",
            agent: {
              name: "Robert Martinez",
              phone: "(614) 555-0234",
              email: "robert@multifamilyohio.com",
              company: "Columbus Investment Properties",
              photo: "/api/placeholder/100/100",
              license: "OH-567890"
            },
            stats: {
              views: 1247,
              saves: 89,
              daysOnMarket: 12,
              priceHistory: [
                { date: "2024-01-20", price: 1250000, event: "Listed" }
              ]
            },
            neighborhood: {
              name: "Near East Side Columbus",
              walkability: 78,
              transitScore: 71,
              bikeScore: 65
            },
            schools: [
              { name: "East Columbus Elementary", rating: 6, distance: 0.4 },
              { name: "Linden Middle School", rating: 5, distance: 0.8 },
              { name: "East High School", rating: 6, distance: 1.1 }
            ],
            investmentMetrics: {
              noi: 95000,
              vacancy: 5,
              operatingExpenses: 32000,
              totalUnits: 11,
              avgRentPerUnit: 809,
              pricePerUnit: 113636,
              pricePerSqft: 142
            }
          },
          {
            id: 5,
            title: "Houston Galleria Hotel - Rebrand/Repurpose Opportunity",
            address: "3838 Richmond Avenue, Houston, TX 77027",
            price: 8500000,
            rentPrice: 0,
            beds: 180,
            baths: 180,
            sqft: 125000,
            propertyType: "hospitality",
            subcategory: "hospitality",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "Prime Houston Galleria hotel presenting an exceptional rebrand and repurpose opportunity. This 180-room property sits on premium real estate in the heart of Houston's business district. Ideal for conversion to luxury apartments, extended stay, or continued hotel operations under new management.",
            detailedDescription: "Located in Houston's prestigious Galleria area, this hotel property represents a unique opportunity for savvy investors and developers. The 125,000 sq ft building features 180 well-appointed rooms, meeting facilities, restaurant space, and parking. The prime location offers unparalleled access to the Galleria shopping center, major corporate offices, and Houston's business core. Multiple exit strategies include: luxury apartment conversion, extended-stay hotel repositioning, senior living facility, or continued traditional hotel operations. The property benefits from strong fundamentals including high-income demographics, excellent transportation access, and proven demand for both residential and hospitality uses.",
            features: ["prime_galleria_location", "180_rooms", "meeting_facilities", "restaurant_space", "parking_garage", "conversion_ready", "multiple_exit_strategies", "high_income_area", "corporate_proximity", "retail_access"],
            yearBuilt: 1987,
            lotSize: 2.1,
            coordinates: { lat: 29.7370, lng: -95.4619 },
            tokenized: true,
            tokenPrice: 1000,
            totalTokens: 8500,
            availableTokens: 6800,
            expectedROI: 14.2,
            monthlyRent: 0,
            hotelRevPAR: 95,
            occupancyRate: 68,
            averageADR: 140,
            hoa: 0,
            taxes: 125000,
            insurance: 18500,
            listingDate: "2024-01-18",
            status: "active",
            agent: {
              name: "Diana Foster",
              phone: "(713) 555-0345",
              email: "diana@galleriacommercial.com",
              company: "Galleria Commercial Real Estate",
              photo: "/api/placeholder/100/100",
              license: "TX-234567"
            },
            stats: {
              views: 2134,
              saves: 167,
              daysOnMarket: 25,
              priceHistory: [
                { date: "2024-01-18", price: 8500000, event: "Listed" },
                { date: "2023-12-15", price: 9200000, event: "Price Reduction" }
              ]
            },
            neighborhood: {
              name: "Galleria/Uptown Houston",
              walkability: 85,
              transitScore: 78,
              bikeScore: 71
            },
            schools: [
              { name: "Briargrove Elementary", rating: 8, distance: 1.2 },
              { name: "Memorial Middle School", rating: 9, distance: 1.8 },
              { name: "Memorial High School", rating: 9, distance: 2.1 }
            ],
            investmentMetrics: {
              noi: 890000,
              conversionPotential: "High",
              apartmentUnits: 160,
              projectedRentPerUnit: 1850,
              conversionCost: 2500000,
              stabilizedValue: 14000000,
              pricePerSqft: 68
            }
          },
          {
            id: 6,
            title: "Pennsylvania Development Land - Wawa Vicinity",
            address: "1275 Baltimore Pike, Glen Mills, PA 19342",
            price: 2850000,
            rentPrice: 0,
            beds: 0,
            baths: 0,
            sqft: 0,
            propertyType: "land",
            subcategory: "land",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1574263867128-7c5e4c8c9cfd?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "Premium development opportunity featuring 23.7 acres of prime commercial land strategically located near Wawa, Pennsylvania. Excellent visibility and access from major highways with approved zoning for mixed-use development. Perfect for retail, residential, or industrial development projects.",
            detailedDescription: "This exceptional 23.7-acre development parcel represents one of the most attractive land opportunities in the greater Philadelphia metropolitan area. Located at the intersection of Route 322 and Conchester Highway, the property offers unparalleled visibility and accessibility. The site benefits from approved mixed-use zoning, allowing for retail centers, residential developments, industrial facilities, or combinations thereof. Recent improvements to area infrastructure and the proximity to Wawa's growing commercial corridor make this an ideal location for forward-thinking developers. The property features level topography, existing utility access, and completed Phase 1 environmental assessment. With Philadelphia's continued suburban expansion and the area's strong demographic profile, this land presents significant development and appreciation potential.",
            features: ["mixed_use_zoning", "highway_frontage", "23_7_acres", "level_topography", "utilities_available", "environmental_cleared", "development_ready", "high_visibility", "growing_area", "philadelphia_proximity"],
            yearBuilt: null,
            lotSize: 23.7,
            coordinates: { lat: 39.8893, lng: -75.4557 },
            tokenized: true,
            tokenPrice: 500,
            totalTokens: 5700,
            availableTokens: 4845,
            expectedROI: 22.5,
            monthlyRent: 0,
            zoningType: "Mixed Use Commercial",
            buildableArea: 21.2,
            maxDensity: "35 units per acre residential, 0.45 FAR commercial",
            hoa: 0,
            taxes: 34200,
            insurance: 1200,
            listingDate: "2024-01-22",
            status: "active",
            agent: {
              name: "Thomas Chen",
              phone: "(484) 555-0456",
              email: "thomas@palanddevelopment.com",
              company: "Pennsylvania Land & Development Co.",
              photo: "/api/placeholder/100/100",
              license: "PA-345678"
            },
            stats: {
              views: 892,
              saves: 123,
              daysOnMarket: 18,
              priceHistory: [
                { date: "2024-01-22", price: 2850000, event: "Listed" }
              ]
            },
            neighborhood: {
              name: "Glen Mills/Wawa Area",
              walkability: 35,
              transitScore: 28,
              bikeScore: 42
            },
            schools: [
              { name: "Glen Mills Elementary", rating: 8, distance: 2.1 },
              { name: "Garnet Valley Middle", rating: 9, distance: 3.4 },
              { name: "Garnet Valley High School", rating: 9, distance: 3.8 }
            ],
            developmentMetrics: {
              pricePerAcre: 120254,
              residentialPotential: 743,
              commercialPotential: 425000,
              projectedDevelopmentValue: 8500000,
              developmentTimeframe: "18-36 months",
              municipalApprovals: "Pre-approved concept plan",
              marketDemand: "High - Growing suburban corridor"
            }
          },
          {
            id: 7,
            title: "Northeast Houston Gas Station - Remodel Opportunity",
            address: "14902 Aldine Westfield Rd, Houston, TX 77032",
            price: 1850000,
            rentPrice: 0,
            beds: 0,
            baths: 2,
            sqft: 3200,
            propertyType: "retail",
            subcategory: "business",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "Prime value-add opportunity featuring a corner gas station and convenience store in Northeast Houston. This hard corner location offers exceptional visibility and traffic count, perfect for a complete remodel and repositioning. Current operations include 6 gas pumps and 3,200 sq ft convenience store with significant upside potential.",
            detailedDescription: "This strategically located gas station presents an outstanding value-add investment opportunity in Houston's rapidly developing northeast corridor. Positioned on a hard corner with excellent visibility from Aldine Westfield Road, the property benefits from high traffic counts and established customer base. The facility includes 6 fueling positions, a 3,200 sq ft convenience store, and ample parking. While currently operational, the property requires comprehensive remodeling to maximize its potential. Recent market analysis indicates strong demand for modernized fuel/convenience facilities in this growing area. Post-renovation projections show significant NOI improvement through enhanced fuel margins, expanded convenience offerings, and potential additional revenue streams. Perfect for investors with experience in retail/fuel operations seeking a high-return repositioning project.",
            features: ["hard_corner_location", "6_gas_pumps", "convenience_store", "high_traffic_count", "established_customer_base", "remodel_opportunity", "value_add_potential", "ample_parking", "northeast_houston", "growing_area"],
            yearBuilt: 1998,
            lotSize: 1.2,
            coordinates: { lat: 29.9174, lng: -95.3698 },
            tokenized: true,
            tokenPrice: 750,
            totalTokens: 2467,
            availableTokens: 1973,
            expectedROI: 18.5,
            monthlyRevenue: 85000,
            grossRevenue: 1020000,
            netOperatingIncome: 185000,
            projectedNOI: 370000,
            capRate: 10.0,
            projectedCapRate: 20.0,
            remodelBudget: 450000,
            hoa: 0,
            taxes: 22200,
            insurance: 18500,
            listingDate: "2024-01-25",
            status: "active",
            agent: {
              name: "Carlos Rodriguez",
              phone: "(713) 555-0567",
              email: "carlos@houstoncommercialgroup.com",
              company: "Houston Commercial Investment Group",
              photo: "/api/placeholder/100/100",
              license: "TX-456789"
            },
            stats: {
              views: 2456,
              saves: 198,
              daysOnMarket: 28,
              priceHistory: [
                { date: "2024-01-25", price: 1850000, event: "Listed" },
                { date: "2023-12-10", price: 2100000, event: "Price Reduction" }
              ]
            },
            neighborhood: {
              name: "Northeast Houston/Aldine",
              walkability: 35,
              transitScore: 42,
              bikeScore: 28
            },
            schools: [
              { name: "Aldine Elementary", rating: 5, distance: 0.6 },
              { name: "Stehlik Intermediate", rating: 6, distance: 1.1 },
              { name: "Aldine Senior High", rating: 6, distance: 1.8 }
            ],
            businessMetrics: {
              fuelPumps: 6,
              storeSize: 3200,
              dailyFuelSales: 1800,
              averageFuelMargin: 0.12,
              convenientStoreRevenue: 25000,
              trafficCount: 28000,
              operatingHours: "24/7",
              employeeCount: 8,
              peakHours: "7-9 AM, 4-7 PM",
              competitorAnalysis: "Moderate competition, opportunity for premium positioning"
            }
          },
          {
            id: 8,
            title: "Brookside Grocery & Gas Station - Turn-Key Investment",
            address: "3402 E Southmore Ave, Pasadena, TX 77502",
            price: 3200000,
            rentPrice: 0,
            beds: 0,
            baths: 3,
            sqft: 4850,
            propertyType: "retail",
            subcategory: "business",
            listingType: "sale",
            images: [
              "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1604719312683-d349353a8b5c?w=800&h=600&fit=crop&auto=format&q=85",
              "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop&auto=format&q=85"
            ],
            description: "Exceptional turn-key investment opportunity featuring Brookside Grocery & Gas Station in established Pasadena, Texas location. This fully operational convenience store and fuel station generates strong cash flow with minimal management requirements. Property includes 8 modern gas pumps, 4,850 sq ft retail space, and established customer base serving the local community.",
            detailedDescription: "Brookside Grocery represents a premier turn-key investment in the heart of Pasadena's established residential corridor. This well-maintained facility combines a full-service convenience store with a high-volume fuel operation, creating multiple revenue streams and consistent cash flow. The property features modern infrastructure including recently upgraded fuel dispensers, comprehensive security systems, and efficient point-of-sale technology. With over 15 years of successful operation under current ownership, the business has built strong community loyalty and brand recognition. The strategic location on busy Southmore Avenue ensures consistent traffic flow, while the diverse product mix including groceries, prepared foods, beverages, and automotive supplies maximizes per-customer transaction values. Perfect for investors seeking a passive income opportunity with proven performance metrics and growth potential.",
            features: ["turn_key_operation", "8_gas_pumps", "full_service_grocery", "established_customer_base", "modern_equipment", "security_systems", "pos_technology", "multiple_revenue_streams", "high_traffic_location", "community_loyalty"],
            yearBuilt: 2008,
            lotSize: 1.8,
            coordinates: { lat: 29.6911, lng: -95.1591 },
            tokenized: true,
            tokenPrice: 800,
            totalTokens: 4000,
            availableTokens: 3200,
            expectedROI: 16.2,
            monthlyRevenue: 145000,
            grossRevenue: 1740000,
            netOperatingIncome: 468000,
            capRate: 14.6,
            cashFlow: 39000,
            hoa: 0,
            taxes: 35200,
            insurance: 24000,
            listingDate: "2024-01-28",
            status: "active",
            agent: {
              name: "Patricia Gonzalez",
              phone: "(281) 555-0789",
              email: "patricia@pasadenacommercial.com",
              company: "Pasadena Commercial Real Estate",
              photo: "/api/placeholder/100/100",
              license: "TX-567890"
            },
            stats: {
              views: 3245,
              saves: 287,
              daysOnMarket: 22,
              priceHistory: [
                { date: "2024-01-28", price: 3200000, event: "Listed" }
              ]
            },
            neighborhood: {
              name: "Pasadena/Southeast Houston",
              walkability: 58,
              transitScore: 45,
              bikeScore: 32
            },
            schools: [
              { name: "Brookside Elementary", rating: 6, distance: 0.4 },
              { name: "Queens Intermediate", rating: 7, distance: 0.9 },
              { name: "Pasadena Memorial High", rating: 7, distance: 1.3 }
            ],
            businessMetrics: {
              fuelPumps: 8,
              storeSize: 4850,
              dailyFuelSales: 2400,
              averageFuelMargin: 0.15,
              groceryRevenue: 85000,
              fuelRevenue: 60000,
              trafficCount: 35000,
              operatingHours: "5 AM - 11 PM Daily",
              employeeCount: 12,
              averageTransaction: 28.50,
              loyaltyCustomers: 2850,
              peakHours: "6-8 AM, 12-1 PM, 5-7 PM",
              seasonalVariation: "10% higher in summer months"
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