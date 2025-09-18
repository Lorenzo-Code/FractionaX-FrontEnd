import React, { useState, useMemo } from 'react';
import { 
  FiMapPin, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiStar,
  FiNavigation,
  FiChevronDown,
  FiChevronUp,
  FiShoppingBag,
  FiUsers,
  FiHome,
  FiCloud,
  FiShield,
  FiTool,
  FiBarChart2,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiZap,
  FiCloudRain,
  FiWind,
  FiThermometer
} from 'react-icons/fi';

const PropertyIntelligencePanel = ({ 
  property, 
  priceAnalytics = {}, 
  nearbyHighValue = [], 
  majorEmployers = [],
  locationScore = null,
  comprehensiveData = null, // New comprehensive backend data
  reportTier = 'basic', // 'basic', 'premium', or 'enterprise' - controls what data to show
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    priceAnalytics: true,
    nearbyHighValue: true,
    majorEmployers: true,
    locationScore: true
  });

  // Extract property intelligence data - with demo/mock data for showcase
  const extractPropertyData = () => {
    // If we have real data, use it
    if (property?.propertyIntelligence?.data) {
      const data = property.propertyIntelligence.data;
      const buildings = data.buildings?.data || data.propertyDetail?.buildings?.data;
      const ownership = data.ownership?.data || data.propertyDetail?.ownership?.data;
      const taxData = data.taxAssessments?.items?.[0] || data.propertyDetail?.taxAssessment?.items?.[0];
      const rentModel = data.rentModel?.data;
      const siteLocation = data.propertyDetail?.siteLocation?.data;
      const fractionalAnalysis = property.fractionalInvestmentAnalysis;
      const mostRecentTransfer = data.propertyDetail?.mostRecentOwnerTransfer?.items?.[0];
      const lastMarketSale = data.propertyDetail?.lastMarketSale?.items?.[0];

      return {
        buildings: buildings,
        ownership: ownership,
        taxData: taxData,
        rentModel: rentModel,
        siteLocation: siteLocation,
        fractionalAnalysis: fractionalAnalysis,
        mostRecentTransfer: mostRecentTransfer,
        lastMarketSale: lastMarketSale,
        address: property.parsedAddress || property.propertyAddress,
        coordinates: siteLocation?.coordinatesParcel
      };
    }

    // BASIC TIER - Limited data, free features only
    if (reportTier === 'basic') {
      return {
        buildings: {
          buildings: [{
            constructionDetails: {
              yearBuilt: 2003,
              foundationTypeCode: 'SLAB_ON_GRADE'
            },
            structureVerticalProfile: {
              storiesCount: 1
            },
            structureFeatures: {
              heating: {
                typeCode: 'Central Air/Heat'
              }
            }
          }],
          allBuildingsSummary: {
            livingAreaSquareFeet: 1748,
            totalAreaSquareFeet: 1748,
            bedroomsCount: 3,
            bathroomsCount: 2,
            fireplacesCount: 1
          }
        },
        // Basic tier gets limited ownership info
        ownership: {
          currentOwners: {
            ownerNames: [{
              fullName: 'CANNEDY LISA'
            }]
          },
          currentOwnerMailingInfo: {
            mailingAddress: null // Owner-occupied
          }
        },
        // Basic tier gets basic tax info only
        taxData: {
          taxAmount: {
            totalTaxAmount: 2157.37
          },
          assessedValue: {
            calculatedTotalValue: 425000
          },
          schoolDistricts: {
            school: {
              name: 'Austin Independent School District'
            }
          }
        },
        // NO rent model for basic
        siteLocation: {
          locationLegal: {
            subdivisionName: 'Zilker Park Area'
          },
          coordinatesParcel: {
            latitude: 30.2672,
            longitude: -97.7431
          }
        },
        // Basic fractional analysis
        fractionalAnalysis: {
          investmentScore: 7.5,
          projectedROI: 8.2
        },
        // NO purchase history for basic
        address: {
          streetAddress: property.address || '123 Example St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78704'
        },
        coordinates: {
          latitude: 30.2672,
          longitude: -97.7431
        },
        // NO PREMIUM FEATURES for basic tier
      };
    }

    // PREMIUM TIER - Includes premium features but not enterprise
    if (reportTier === 'premium') {
      return {
        buildings: {
          buildings: [{
            constructionDetails: {
              yearBuilt: 2003,
              foundationTypeCode: 'SLAB_ON_GRADE'
            },
            structureVerticalProfile: {
              storiesCount: 1
            },
            structureFeatures: {
              heating: {
                typeCode: 'Central Air/Heat'
              }
            }
          }],
          allBuildingsSummary: {
            livingAreaSquareFeet: 1748,
            totalAreaSquareFeet: 1748,
            bedroomsCount: 3,
            bathroomsCount: 2,
            fireplacesCount: 1
          }
        },
        ownership: {
          currentOwners: {
            ownerNames: [{
              fullName: 'CANNEDY LISA'
            }]
          },
          currentOwnerMailingInfo: {
            mailingAddress: null // Owner-occupied
          }
        },
        taxData: {
          taxAmount: {
            totalTaxAmount: 2157.37
          },
          assessedValue: {
            calculatedTotalValue: 425000,
            calculatedLandValue: 117000,
            calculatedImprovementValue: 176800
          },
          schoolDistricts: {
            school: {
              name: 'Austin Independent School District'
            }
          }
        },
        rentModel: {
          modelOutput: {
            estimatedValue: 2850,
            additionalValues: {
              capRate: 0.048
            }
          }
        },
        siteLocation: {
          locationLegal: {
            subdivisionName: 'Zilker Park Area'
          },
          landUseAndZoningCodes: {
            zoningCodeDescription: 'Single Family Residential'
          },
          lot: {
            areaSquareFeet: 7500,
            areaAcres: 0.17
          },
          coordinatesParcel: {
            latitude: 30.2672,
            longitude: -97.7431
          }
        },
        fractionalAnalysis: {
          investmentScore: 7.5,
          projectedROI: 8.2,
          tokenizationPotential: 8,
          minimumInvestment: 10000
        },
        mostRecentTransfer: {
          transactionDetails: {
            saleDateDerived: '2003-08-05',
            saleAmount: 169600,
            isMortgagePurchase: true
          },
          sellerDetails: {
            sellerNames: [{
              fullName: 'HELMS SEAN M'
            }]
          }
        },
        lastMarketSale: {
          transactionDetails: {
            saleDateDerived: '2003-08-05',
            saleAmount: 169600
          }
        },
        address: {
          streetAddress: property.address || '123 Example St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78704'
        },
        coordinates: {
          latitude: 30.2672,
          longitude: -97.7431
        },
        // PREMIUM FEATURES DATA
        climateRisk: {
          overall_score: 3.2,
          flood_risk: {
            risk_level: 'LOW',
            score: 2.1,
            zone: 'X',
            base_flood_elevation: 525
          },
          hurricane_wind_risk: {
            risk_level: 'LOW', 
            score: 1.8,
            design_wind_speed: 90
          },
          wildfire_risk: {
            score: 4.2
          },
          earthquake_risk: {
            score: 2.1
          }
        },
        buildingCharacteristics: {
          year_built: 2003,
          foundation_type: 'SLAB_ON_GRADE',
          stories: 1,
          quality_class: 'GOOD',
          exterior_walls: 'BRICK_VENEER',
          roof_material: 'COMPOSITION_SHINGLE',
          hvac_type: 'CENTRAL_FORCED_AIR',
          garage_spaces: 2,
          condition: 'GOOD'
        },
        investmentAnalysis: {
          overall_risk_score: 4.2,
          estimated_property_value: 425000,
          reconstruction_cost: 387000,
          recommendation: 'STRONG_BUY',
          recommendation_details: 'Excellent investment opportunity with strong fundamentals, good location, and positive cash flow potential.',
          primary_concerns: [
            'Property age (21 years) requires ongoing maintenance',
            'Market dependent on Austin economic growth'
          ],
          strengths: [
            'Prime Zilker Park location with high desirability',
            'Strong rental demand in area',
            'Below replacement cost purchase opportunity',
            'Excellent school district proximity',
            'Low climate risk profile'
          ]
        },
        locationIntelligence: {
          walkability_score: 78,
          school_rating: 8.4,
          transit_score: 65,
          hospital_distance: 2.3
        },
        schoolInformation: {
          district: {
            name: 'Austin Independent School District',
            rating: 8.4,
            website: 'https://www.austinisd.org',
            total_schools: 130
          },
          elementary: {
            name: 'Zilker Elementary School',
            address: '1900 Bluebonnet Ln, Austin, TX 78704',
            rating: 9.2,
            distance: 0.4,
            enrollment: 420,
            student_teacher_ratio: '15:1',
            grades: 'PK-5',
            specialty_programs: ['Dual Language', 'GT Program'],
            test_scores: {
              reading: 89,
              math: 87,
              science: 91
            }
          },
          middle: {
            name: 'O. Henry Middle School',
            address: '2610 W 10th St, Austin, TX 78703',
            rating: 8.8,
            distance: 1.2,
            enrollment: 890,
            student_teacher_ratio: '16:1',
            grades: '6-8',
            specialty_programs: ['STEM Academy', 'Fine Arts', 'Advanced Academic Program'],
            test_scores: {
              reading: 85,
              math: 83,
              science: 88
            }
          },
          high: {
            name: 'Austin High School',
            address: '1715 W Cesar Chavez St, Austin, TX 78703',
            rating: 8.6,
            distance: 1.8,
            enrollment: 2150,
            student_teacher_ratio: '18:1',
            grades: '9-12',
            specialty_programs: ['IB Programme', 'AP Courses', 'STEM', 'Fine Arts'],
            graduation_rate: 92,
            college_readiness: 78,
            test_scores: {
              reading: 82,
              math: 80,
              science: 84
            },
            notable_achievements: [
              'Top 10% Texas High Schools',
              'National Merit Scholarship recipients',
              'State Championship Athletics'
            ]
          },
          colleges_nearby: [
            {
              name: 'University of Texas at Austin',
              type: 'Public Research University',
              distance: 1.6,
              ranking: {
                national: 38,
                public: 13
              },
              enrollment: 51832,
              acceptance_rate: 32,
              notable_programs: ['Engineering', 'Business', 'Liberal Arts', 'Computer Science'],
              tuition: {
                in_state: 11698,
                out_of_state: 41070
              }
            },
            {
              name: 'Austin Community College',
              type: 'Community College',
              distance: 2.3,
              enrollment: 41000,
              acceptance_rate: 100,
              notable_programs: ['Transfer Programs', 'Technical Certificates', 'Continuing Education'],
              tuition: {
                in_district: 2880,
                out_of_district: 4320
              }
            },
            {
              name: 'Huston-Tillotson University',
              type: 'Private Liberal Arts',
              distance: 3.1,
              enrollment: 1100,
              acceptance_rate: 61,
              notable_programs: ['Business', 'Education', 'STEM'],
              tuition: {
                annual: 14500
              }
            }
          ]
        }
        // NO ENTERPRISE FEATURES for premium tier
      };
    }

    // ENTERPRISE TIER - Full comprehensive data including all premium plus enterprise-only features
    if (reportTier === 'enterprise') {
      return {
        buildings: {
          buildings: [{
            constructionDetails: {
              yearBuilt: 2003,
              foundationTypeCode: 'SLAB_ON_GRADE'
            },
            structureVerticalProfile: {
              storiesCount: 1
            },
            structureFeatures: {
              heating: {
                typeCode: 'Central Air/Heat'
              }
            }
          }],
          allBuildingsSummary: {
            livingAreaSquareFeet: 1748,
            totalAreaSquareFeet: 1748,
            bedroomsCount: 3,
            bathroomsCount: 2,
            fireplacesCount: 1
          }
        },
        ownership: {
          currentOwners: {
            ownerNames: [{
              fullName: 'CANNEDY LISA'
            }]
          },
          currentOwnerMailingInfo: {
            mailingAddress: null // Owner-occupied
          }
        },
        taxData: {
          taxAmount: {
            totalTaxAmount: 2157.37
          },
          assessedValue: {
            calculatedTotalValue: 425000,
            calculatedLandValue: 117000,
            calculatedImprovementValue: 176800
          },
          schoolDistricts: {
            school: {
              name: 'Austin Independent School District'
            }
          }
        },
        rentModel: {
          modelOutput: {
            estimatedValue: 2850,
            additionalValues: {
              capRate: 0.048
            }
          }
        },
        siteLocation: {
          locationLegal: {
            subdivisionName: 'Zilker Park Area'
          },
          landUseAndZoningCodes: {
            zoningCodeDescription: 'Single Family Residential'
          },
          lot: {
            areaSquareFeet: 7500,
            areaAcres: 0.17
          },
          coordinatesParcel: {
            latitude: 30.2672,
            longitude: -97.7431
          }
        },
        fractionalAnalysis: {
          investmentScore: 7.5,
          projectedROI: 8.2,
          tokenizationPotential: 8,
          minimumInvestment: 10000
        },
        mostRecentTransfer: {
          transactionDetails: {
            saleDateDerived: '2003-08-05',
            saleAmount: 169600,
            isMortgagePurchase: true
          },
          sellerDetails: {
            sellerNames: [{
              fullName: 'HELMS SEAN M'
            }]
          }
        },
        lastMarketSale: {
          transactionDetails: {
            saleDateDerived: '2003-08-05',
            saleAmount: 169600
          }
        },
        address: {
          streetAddress: property.address || '123 Example St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78704'
        },
        coordinates: {
          latitude: 30.2672,
          longitude: -97.7431
        },
        // PREMIUM FEATURES DATA
        climateRisk: {
          overall_score: 3.2,
          flood_risk: {
            risk_level: 'LOW',
            score: 2.1,
            zone: 'X',
            base_flood_elevation: 525
          },
          hurricane_wind_risk: {
            risk_level: 'LOW', 
            score: 1.8,
            design_wind_speed: 90
          },
          wildfire_risk: {
            score: 4.2
          },
          earthquake_risk: {
            score: 2.1
          }
        },
        buildingCharacteristics: {
          year_built: 2003,
          foundation_type: 'SLAB_ON_GRADE',
          stories: 1,
          quality_class: 'GOOD',
          exterior_walls: 'BRICK_VENEER',
          roof_material: 'COMPOSITION_SHINGLE',
          hvac_type: 'CENTRAL_FORCED_AIR',
          garage_spaces: 2,
          condition: 'GOOD'
        },
        investmentAnalysis: {
          overall_risk_score: 4.2,
          estimated_property_value: 425000,
          reconstruction_cost: 387000,
          recommendation: 'STRONG_BUY',
          recommendation_details: 'Excellent investment opportunity with strong fundamentals, good location, and positive cash flow potential.',
          primary_concerns: [
            'Property age (21 years) requires ongoing maintenance',
            'Market dependent on Austin economic growth'
          ],
          strengths: [
            'Prime Zilker Park location with high desirability',
            'Strong rental demand in area',
            'Below replacement cost purchase opportunity',
            'Excellent school district proximity',
            'Low climate risk profile'
          ]
        },
        locationIntelligence: {
          walkability_score: 78,
          school_rating: 8.4,
          transit_score: 65,
          hospital_distance: 2.3
        },
        schoolInformation: {
          district: {
            name: 'Austin Independent School District',
            rating: 8.4,
            website: 'https://www.austinisd.org',
            total_schools: 130
          },
          elementary: {
            name: 'Zilker Elementary School',
            address: '1900 Bluebonnet Ln, Austin, TX 78704',
            rating: 9.2,
            distance: 0.4,
            enrollment: 420,
            student_teacher_ratio: '15:1',
            grades: 'PK-5',
            specialty_programs: ['Dual Language', 'GT Program'],
            test_scores: {
              reading: 89,
              math: 87,
              science: 91
            }
          },
          middle: {
            name: 'O. Henry Middle School',
            address: '2610 W 10th St, Austin, TX 78703',
            rating: 8.8,
            distance: 1.2,
            enrollment: 890,
            student_teacher_ratio: '16:1',
            grades: '6-8',
            specialty_programs: ['STEM Academy', 'Fine Arts', 'Advanced Academic Program'],
            test_scores: {
              reading: 85,
              math: 83,
              science: 88
            }
          },
          high: {
            name: 'Austin High School',
            address: '1715 W Cesar Chavez St, Austin, TX 78703',
            rating: 8.6,
            distance: 1.8,
            enrollment: 2150,
            student_teacher_ratio: '18:1',
            grades: '9-12',
            specialty_programs: ['IB Programme', 'AP Courses', 'STEM', 'Fine Arts'],
            graduation_rate: 92,
            college_readiness: 78,
            test_scores: {
              reading: 82,
              math: 80,
              science: 84
            },
            notable_achievements: [
              'Top 10% Texas High Schools',
              'National Merit Scholarship recipients',
              'State Championship Athletics'
            ]
          },
          colleges_nearby: [
            {
              name: 'University of Texas at Austin',
              type: 'Public Research University',
              distance: 1.6,
              ranking: {
                national: 38,
                public: 13
              },
              enrollment: 51832,
              acceptance_rate: 32,
              notable_programs: ['Engineering', 'Business', 'Liberal Arts', 'Computer Science'],
              tuition: {
                in_state: 11698,
                out_of_state: 41070
              }
            },
            {
              name: 'Austin Community College',
              type: 'Community College',
              distance: 2.3,
              enrollment: 41000,
              acceptance_rate: 100,
              notable_programs: ['Transfer Programs', 'Technical Certificates', 'Continuing Education'],
              tuition: {
                in_district: 2880,
                out_of_district: 4320
              }
            },
            {
              name: 'Huston-Tillotson University',
              type: 'Private Liberal Arts',
              distance: 3.1,
              enrollment: 1100,
              acceptance_rate: 61,
              notable_programs: ['Business', 'Education', 'STEM'],
              tuition: {
                annual: 14500
              }
            }
          ]
        },
        // ENTERPRISE-ONLY FEATURES
        roofAnalysis: {
          condition_score: 7.3,
          condition_grade: 'GOOD',
          estimated_age: 8,
          replacement_needed: '2029-2032',
          defects_detected: [],
          weather_damage: {
            hail_damage_detected: false,
            wind_damage_detected: false,
            damage_severity: null
          }
        },
        reconstructionCost: {
          total_cost: 387000,
          cost_per_sqft: 221,
          confidence_score: 0.87,
          components: {
            foundation: 45000,
            framing: 89000,
            roofing: 32000,
            electrical: 28000,
            plumbing: 24000,
            hvac: 35000,
            insulation: 18000,
            drywall: 22000,
            flooring: 31000,
            kitchen: 38000,
            bathrooms: 25000
          }
        },
        weatherEvents: [
          {
            event_type: 'HIGH_WIND',
            date: '2023-05-15',
            wind_speed: 62,
            damage_potential: 'LOW'
          },
          {
            event_type: 'HAIL',
            date: '2022-04-12',
            wind_speed: 45,
            max_hail_size: 0.75,
            damage_potential: 'MODERATE'
          },
          {
            event_type: 'HIGH_WIND',
            date: '2021-02-15',
            wind_speed: 78,
            damage_potential: 'MODERATE'
          }
        ]
      };
    }

    // Fallback return (shouldn't reach here, but just in case)
    return {
      address: {
        streetAddress: property.address || '123 Example St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704'
      }
    };
  };

  const propertyData = extractPropertyData();

  // Enhanced data formatting utilities
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate) => {
    if (!rate) return 'N/A';
    return `${parseFloat(rate).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPropertyAge = (yearBuilt) => {
    if (!yearBuilt) return 'N/A';
    return `${new Date().getFullYear() - yearBuilt} years`;
  };

  const getRiskLevel = (score) => {
    if (score >= 8) return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 6) return { label: 'Moderate Risk', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Higher Risk', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  // Format distance
  const formatDistance = (meters) => {
    if (!meters) return 'N/A';
    const miles = meters * 0.000621371;
    if (miles < 0.1) return `${Math.round(meters)} m`;
    return `${miles.toFixed(1)} mi`;
  };

  // Calculate price comparison
  const getPriceComparison = () => {
    if (!property.price || !priceAnalytics) return null;
    
    const comparisons = [];
    if (priceAnalytics.streetAverage) {
      const diff = property.price - priceAnalytics.streetAverage;
      const percentDiff = ((diff / priceAnalytics.streetAverage) * 100).toFixed(1);
      comparisons.push({
        level: 'Street',
        average: priceAnalytics.streetAverage,
        difference: diff,
        percentDiff: parseFloat(percentDiff)
      });
    }
    if (priceAnalytics.areaAverage) {
      const diff = property.price - priceAnalytics.areaAverage;
      const percentDiff = ((diff / priceAnalytics.areaAverage) * 100).toFixed(1);
      comparisons.push({
        level: 'Area',
        average: priceAnalytics.areaAverage,
        difference: diff,
        percentDiff: parseFloat(percentDiff)
      });
    }
    if (priceAnalytics.zipCodeAverage) {
      const diff = property.price - priceAnalytics.zipCodeAverage;
      const percentDiff = ((diff / priceAnalytics.zipCodeAverage) * 100).toFixed(1);
      comparisons.push({
        level: 'Zip Code',
        average: priceAnalytics.zipCodeAverage,
        difference: diff,
        percentDiff: parseFloat(percentDiff)
      });
    }
    return comparisons;
  };

  // Categorize nearby high-value locations
  const categorizedLocations = useMemo(() => {
    const categories = {
      'Premium Retail': { items: [], icon: '🛍️', color: '#8B5CF6' },
      'Luxury Amenities': { items: [], icon: '✨', color: '#F59E0B' },
      'Educational': { items: [], icon: '🎓', color: '#3B82F6' },
      'Recreation': { items: [], icon: '🌳', color: '#10B981' },
      'Cultural': { items: [], icon: '🎭', color: '#EF4444' },
      'Other': { items: [], icon: '📍', color: '#6B7280' }
    };

    nearbyHighValue.forEach(location => {
      let category = 'Other';
      const name = location.name?.toLowerCase() || '';
      const types = location.types || [];

      // Categorize based on name and types
      if (name.includes('whole foods') || name.includes('trader joe') || 
          name.includes('target') || name.includes('costco') || 
          name.includes('walmart') || types.includes('department_store')) {
        category = 'Premium Retail';
      } else if (name.includes('starbucks') || name.includes('apple store') ||
                 types.includes('gym') || types.includes('spa')) {
        category = 'Luxury Amenities';
      } else if (types.includes('university') || types.includes('school')) {
        category = 'Educational';
      } else if (types.includes('park') || types.includes('zoo') || 
                 name.includes('golf')) {
        category = 'Recreation';
      } else if (types.includes('museum') || types.includes('library') ||
                 name.includes('theater')) {
        category = 'Cultural';
      }

      categories[category].items.push(location);
    });

    // Filter out empty categories
    return Object.entries(categories).filter(([_, cat]) => cat.items.length > 0);
  }, [nearbyHighValue]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceComparisons = getPriceComparison();

  // Dynamic tabs based on available data
  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'overview', name: 'Overview', icon: FiHome },
      { id: 'comparison', name: 'What You Get', icon: FiInfo },
      { id: 'pricing', name: 'Pricing', icon: FiDollarSign },
      { id: 'schools', name: 'Schools', icon: FiStar },
      { id: 'locations', name: 'Nearby', icon: FiMapPin },
      { id: 'employers', name: 'Employers', icon: FiUsers }
    ];

    // Add comprehensive data tabs if available
    if (comprehensiveData) {
      baseTabs.push(
        { id: 'climate', name: 'Climate Risk', icon: FiCloud },
        { id: 'building', name: 'Building', icon: FiTool },
        { id: 'financial', name: 'Financial', icon: FiBarChart2 },
        { id: 'investment', name: 'Investment', icon: FiActivity }
      );
    }

    return baseTabs;
  }, [comprehensiveData]);

  // Detect report tier - Basic (free), Premium (50 FCT), or Enterprise (100 FCT)
  // For demo purposes, we'll cycle through report types based on comprehensive data
  const getReportTier = () => {
    // Use the prop value if explicitly provided
    if (reportTier && reportTier !== 'basic') {
      return reportTier;
    }
    if (comprehensiveData !== null) {
      // If we have comprehensive data from backend, it's Premium
      return 'premium';
    }
    if (propertyData?.climateRisk && propertyData?.buildingCharacteristics) {
      // For demo: If we have full mock data, show as Enterprise to showcase all features
      return 'enterprise';
    }
    return 'basic';
  };
  
  const currentReportTier = getReportTier();
  const isPremiumReport = currentReportTier === 'premium' || currentReportTier === 'enterprise';
  const isEnterpriseReport = currentReportTier === 'enterprise';
  
  const reportValue = currentReportTier === 'enterprise' ? "$100.00" : currentReportTier === 'premium' ? "$50.00" : "FREE";
  const reportType = currentReportTier === 'enterprise' ? "Enterprise Report" : currentReportTier === 'premium' ? "Premium Report" : "Basic Report";

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full h-full max-w-6xl max-h-screen bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Document Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Property Intelligence Report</h1>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  isPremiumReport 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {isPremiumReport ? '💎 Premium' : 'Basic'}
                </span>
              </div>
              <div className="text-gray-600">
                <p className="text-lg font-medium">{property.address || 'Property Analysis'}</p>
                <p className="text-sm mt-1">
                  Generated on {new Date().toLocaleDateString()} • Report Value: {reportValue}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-3 hover:bg-gray-100 rounded-lg"
              title="Close Report"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Document Navigation */}
          <div className="mt-4 border-t border-gray-200 pt-3">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isPremiumTab = ['climate', 'building', 'financial', 'investment'].includes(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-medium transition-all border ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.name}</span>
                    {isPremiumTab && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">
                        💎
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Current Section Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name || 'Overview'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {isPremiumReport ? 'Premium analysis with comprehensive data sources' : 'Essential property insights and market data'}
                </p>
              </div>
              {['climate', 'building', 'financial', 'investment'].includes(activeTab) && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                  💎 Premium
                </span>
              )}
            </div>
          </div>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Executive Summary Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="text-3xl mr-3">📊</span>
                    Executive Summary
                  </h2>
                  {isPremiumReport && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-lg text-sm font-semibold">
                      💎 Premium Analysis
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Assessed Value</p>
                    <p className="font-bold text-2xl text-green-600">
                      {propertyData?.taxData ? formatCurrency(propertyData.taxData.assessedValue?.calculatedTotalValue) : formatPrice(property.price)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {propertyData?.buildings?.allBuildingsSummary?.livingAreaSquareFeet && propertyData?.taxData 
                        ? `$${Math.round(propertyData.taxData.assessedValue.calculatedTotalValue / propertyData.buildings.allBuildingsSummary.livingAreaSquareFeet)}/sq ft`
                        : property.sqft ? `$${Math.round(property.price / property.sqft)}/sq ft` : ''}
                    </p>
                  </div>
                  {propertyData?.rentModel && (
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600 text-sm mb-1">Est. Monthly Rent</p>
                      <p className="font-bold text-2xl text-blue-600">
                        {formatCurrency(propertyData.rentModel.modelOutput.estimatedValue)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Cap Rate: {formatPercentage(propertyData.rentModel.modelOutput.additionalValues.capRate * 100)}
                      </p>
                    </div>
                  )}
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Property Details</p>
                    <p className="font-bold text-xl text-gray-900">
                      {propertyData?.buildings?.allBuildingsSummary ? 
                        `${propertyData.buildings.allBuildingsSummary.bedroomsCount}bd / ${propertyData.buildings.allBuildingsSummary.bathroomsCount}ba` : 
                        `${property.beds || 'N/A'}bd / ${property.baths || 'N/A'}ba`
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {propertyData?.buildings?.allBuildingsSummary?.livingAreaSquareFeet ? 
                        `${propertyData.buildings.allBuildingsSummary.livingAreaSquareFeet.toLocaleString()} sq ft` : 
                        property.sqft ? `${property.sqft.toLocaleString()} sq ft` : 'Size N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">Investment Score</p>
                    <p className="font-bold text-xl text-purple-600">
                      {propertyData?.fractionalAnalysis ? 
                        `${propertyData.fractionalAnalysis.investmentScore}/10` : 
                        nearbyHighValue.length + majorEmployers.length
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {propertyData?.fractionalAnalysis ? 
                        getRiskLevel(propertyData.fractionalAnalysis.investmentScore).label :
                        'Nearby Amenities'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Intelligence Summary - Always Show */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Building Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiHome className="w-6 h-6 text-blue-500 mr-3" />
                    Building Details
                  </h3>
                  <div className="space-y-4">
                    {propertyData?.buildings?.buildings?.[0] ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Year Built:</span>
                          <p className="font-semibold text-gray-900">
                            {propertyData.buildings.buildings[0].constructionDetails?.yearBuilt || 'N/A'}
                            {propertyData.buildings.buildings[0].constructionDetails?.yearBuilt && 
                              ` (${getPropertyAge(propertyData.buildings.buildings[0].constructionDetails.yearBuilt)})`
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Stories:</span>
                          <p className="font-semibold text-gray-900">
                            {propertyData.buildings.buildings[0].structureVerticalProfile?.storiesCount || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Foundation:</span>
                          <p className="font-semibold text-gray-900 capitalize">
                            {propertyData.buildings.buildings[0].constructionDetails?.foundationTypeCode?.replace(/[^A-Z]/g, ' ') || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fireplace:</span>
                          <p className="font-semibold text-gray-900">
                            {propertyData.buildings.allBuildingsSummary?.fireplacesCount ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">HVAC:</span>
                          <p className="font-semibold text-gray-900">
                            {propertyData.buildings.buildings[0].structureFeatures?.heating?.typeCode || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Area:</span>
                          <p className="font-semibold text-gray-900">
                            {propertyData.buildings.allBuildingsSummary?.totalAreaSquareFeet ? 
                              `${propertyData.buildings.allBuildingsSummary.totalAreaSquareFeet.toLocaleString()} sq ft` : 'N/A'
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <FiHome className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Building details not available</p>
                        <p className="text-xs text-gray-400 mt-1">Premium data required for detailed building information</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiDollarSign className="w-6 h-6 text-green-500 mr-3" />
                    Financial Overview
                  </h3>
                  <div className="space-y-4">
                    {propertyData?.taxData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Annual Tax</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(propertyData.taxData.taxAmount?.totalTaxAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Land Value</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(propertyData.taxData.assessedValue?.calculatedLandValue)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Improvement Value</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(propertyData.taxData.assessedValue?.calculatedImprovementValue)}
                          </span>
                        </div>
                        {propertyData.rentModel && (
                          <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-sm text-green-700">Est. Monthly Rent</span>
                            <span className="font-bold text-green-700">
                              {formatCurrency(propertyData.rentModel.modelOutput.estimatedValue)}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <FiDollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Financial details not available</p>
                        <p className="text-xs text-gray-400 mt-1">Basic property price: {formatPrice(property.price)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Ownership Information - Always Show */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location Details */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiMapPin className="w-6 h-6 text-purple-500 mr-3" />
                    Location Intelligence
                  </h3>
                  <div className="space-y-3">
                    {propertyData?.address ? (
                      <div>
                        <span className="text-gray-600 text-sm">Full Address:</span>
                        <p className="font-medium text-gray-900">
                          {`${propertyData.address.streetAddress}, ${propertyData.address.city}, ${propertyData.address.state} ${propertyData.address.zipCode}`}
                        </p>
                      </div>
                    ) : property.address && (
                      <div>
                        <span className="text-gray-600 text-sm">Address:</span>
                        <p className="font-medium text-gray-900">{property.address}</p>
                      </div>
                    )}
                    {propertyData?.siteLocation ? (
                      <>
                        <div>
                          <span className="text-gray-600 text-sm">Neighborhood:</span>
                          <p className="font-medium text-gray-900">
                            {propertyData.siteLocation.locationLegal?.subdivisionName || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Zoning:</span>
                          <p className="font-medium text-gray-900">
                            {propertyData.siteLocation.landUseAndZoningCodes?.zoningCodeDescription || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Lot Size:</span>
                          <p className="font-medium text-gray-900">
                            {propertyData.siteLocation.lot?.areaSquareFeet ? 
                              `${propertyData.siteLocation.lot.areaSquareFeet.toLocaleString()} sq ft (${propertyData.siteLocation.lot.areaAcres} acres)` : 
                              'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">School District:</span>
                          <p className="font-medium text-gray-900">
                            {propertyData.taxData?.schoolDistricts?.school?.name || 'N/A'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <FiMapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Detailed location data not available</p>
                        <p className="text-xs text-gray-400 mt-1">Premium data required for zoning, lot size, and neighborhood details</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ownership & Investment - Always Show */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiUsers className="w-6 h-6 text-orange-500 mr-3" />
                    Ownership & Purchase History
                  </h3>
                  <div className="space-y-4">
                    {propertyData?.ownership ? (
                      <div>
                        <span className="text-gray-600 text-sm">Current Owner:</span>
                        <p className="font-bold text-lg text-gray-900">
                          {propertyData.ownership.currentOwners?.ownerNames?.[0]?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {propertyData.ownership.currentOwnerMailingInfo?.mailingAddress ? 
                            `${propertyData.ownership.currentOwnerMailingInfo.mailingAddress.city}, ${propertyData.ownership.currentOwnerMailingInfo.mailingAddress.state}` :
                            'Owner-occupied'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-gray-500">
                        <FiUsers className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Owner information not available</p>
                        <p className="text-xs text-gray-400">Premium data required</p>
                      </div>
                    )}
                    
                    {propertyData?.mostRecentTransfer ? (
                      <div className="border-t pt-3">
                        <span className="text-gray-600 text-sm">Purchase Details:</span>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                            <span className="text-xs text-gray-600">Purchase Date:</span>
                            <span className="text-xs font-semibold text-gray-900">
                              {formatDate(propertyData.mostRecentTransfer.transactionDetails.saleDateDerived)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                            <span className="text-xs text-gray-600">Purchase Price:</span>
                            <span className="text-xs font-bold text-green-600">
                              {formatCurrency(propertyData.mostRecentTransfer.transactionDetails.saleAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                            <span className="text-xs text-gray-600">Sold By:</span>
                            <span className="text-xs font-medium text-gray-900">
                              {propertyData.mostRecentTransfer.sellerDetails?.sellerNames?.[0]?.fullName || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                            <span className="text-xs text-gray-600">Mortgage:</span>
                            <span className="text-xs font-medium text-gray-900">
                              {propertyData.mostRecentTransfer.transactionDetails.isMortgagePurchase ? 'Yes' : 'Cash'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-3">
                        <div className="text-center py-3 text-gray-500">
                          <p className="text-sm">Purchase history not available</p>
                          <p className="text-xs text-gray-400">Premium data required</p>
                        </div>
                      </div>
                    )}
                    
                    {propertyData?.fractionalAnalysis ? (
                      <div className="border-t pt-3">
                        <span className="text-gray-600 text-sm mb-2">Investment Metrics:</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-600">Score</p>
                            <p className={`font-bold text-lg ${getRiskLevel(propertyData.fractionalAnalysis.investmentScore).color}`}>
                              {propertyData.fractionalAnalysis.investmentScore}/10
                            </p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-600">ROI</p>
                            <p className="font-bold text-lg text-green-600">
                              {formatPercentage(propertyData.fractionalAnalysis.projectedROI)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-3">
                        <div className="text-center py-3 text-gray-500">
                          <p className="text-sm">Investment analysis not available</p>
                          <p className="text-xs text-gray-400">Basic location score: {locationScore?.overall || nearbyHighValue.length + majorEmployers.length}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Market Analysis Section */}
              {priceComparisons && priceComparisons.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="w-6 h-6 text-green-500 mr-3" />
                    Market Position Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {priceComparisons.map((comp, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">{comp.level} Average</p>
                          <div className={`flex items-center space-x-1 ${
                            comp.difference >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {comp.difference >= 0 ? 
                              <FiTrendingUp className="w-4 h-4" /> : 
                              <FiTrendingDown className="w-4 h-4" />
                            }
                            <span className="font-bold text-lg">
                              {Math.abs(comp.percentDiff)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Avg: {formatPrice(comp.average)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comp.difference >= 0 ? 'Above' : 'Below'} market by {formatPrice(Math.abs(comp.difference))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Intelligence Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location Score Breakdown */}
                {locationScore && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <FiStar className="w-6 h-6 text-yellow-500 mr-3" />
                      Location Quality Breakdown
                    </h3>
                    <div className="space-y-3">
                      {locationScore.breakdown && Object.entries(locationScore.breakdown).map(([key, value]) => {
                        const percentage = (value / 100) * 100;
                        return (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <span className="text-sm font-bold text-gray-900">{value}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  value >= 80 ? 'bg-green-500' :
                                  value >= 60 ? 'bg-yellow-500' :
                                  value >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Overall Rating:</strong> {locationScore.overall}/100 - 
                        {locationScore.overall >= 80 ? ' Excellent location with premium amenities and accessibility.' :
                         locationScore.overall >= 60 ? ' Good location with solid amenities and convenience.' :
                         locationScore.overall >= 40 ? ' Fair location with basic amenities available.' :
                         ' Below-average location with limited amenities.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Key Amenities Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiMapPin className="w-6 h-6 text-blue-500 mr-3" />
                    Area Highlights
                  </h3>
                  
                  {/* Top Nearby Locations */}
                  {nearbyHighValue.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">🏪 Premium Amenities Nearby</h4>
                      <div className="space-y-2">
                        {nearbyHighValue.slice(0, 3).map((location, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-700 truncate">{location.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{formatDistance(location.distance)}</span>
                          </div>
                        ))}
                        {nearbyHighValue.length > 3 && (
                          <p className="text-xs text-gray-500 italic">+{nearbyHighValue.length - 3} more locations</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Major Employers */}
                  {majorEmployers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">🏢 Major Employers</h4>
                      <div className="space-y-2">
                        {majorEmployers.slice(0, 3).map((employer, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <div className="truncate">
                              <span className="text-sm text-gray-700">{employer.name}</span>
                              <p className="text-xs text-gray-500">{employer.industry}</p>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">{formatDistance(employer.distance)}</span>
                          </div>
                        ))}
                        {majorEmployers.length > 3 && (
                          <p className="text-xs text-gray-500 italic">+{majorEmployers.length - 3} more employers</p>
                        )}
                      </div>
                    </div>
                  )}

                  {nearbyHighValue.length === 0 && majorEmployers.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <FiMapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Limited amenity data available for this area</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Schools & Education Summary */}
              {propertyData?.schoolInformation && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🎓</span>
                    Education Summary
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* District & School Overview */}
                    <div>
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{propertyData.schoolInformation.district.name}</h4>
                          <div className="text-lg font-bold text-blue-600">
                            {propertyData.schoolInformation.district.rating}<span className="text-sm text-gray-400">/10</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{propertyData.schoolInformation.district.total_schools} schools district-wide</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded border border-green-200">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Elementary</span>
                            <p className="text-xs text-gray-600">{propertyData.schoolInformation.elementary.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">{propertyData.schoolInformation.elementary.rating}/10</div>
                            <p className="text-xs text-gray-500">{propertyData.schoolInformation.elementary.distance} mi</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 px-3 bg-yellow-50 rounded border border-yellow-200">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Middle</span>
                            <p className="text-xs text-gray-600">{propertyData.schoolInformation.middle.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-yellow-600">{propertyData.schoolInformation.middle.rating}/10</div>
                            <p className="text-xs text-gray-500">{propertyData.schoolInformation.middle.distance} mi</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 px-3 bg-purple-50 rounded border border-purple-200">
                          <div>
                            <span className="text-sm font-medium text-gray-900">High School</span>
                            <p className="text-xs text-gray-600">{propertyData.schoolInformation.high.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-purple-600">{propertyData.schoolInformation.high.rating}/10</div>
                            <p className="text-xs text-gray-500">{propertyData.schoolInformation.high.distance} mi</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Higher Education & Insights */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm">🏛️ Higher Education Nearby</h4>
                      <div className="space-y-2 mb-4">
                        {propertyData.schoolInformation.colleges_nearby.slice(0, 3).map((college, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-indigo-50 rounded">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{college.name}</span>
                              <p className="text-xs text-gray-600">{college.type}</p>
                            </div>
                            <div className="text-right">
                              {college.ranking && (
                                <div className="text-xs font-bold text-indigo-600">#{college.ranking.national}</div>
                              )}
                              <p className="text-xs text-gray-500">{college.distance} mi</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Investment Impact</h4>
                        <div className="space-y-1 text-xs text-gray-700">
                          <div className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Excellent elementary (9.2/10) attracts families</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>UT Austin proximity adds property value</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>All schools within 2 miles</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREMIUM REPORT SECTIONS - Include all premium analysis in overview */}
              {isPremiumReport && (
                <>
                  {/* Climate Risk Analysis */}
                  {propertyData?.climateRisk && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">🛡️</span>
                        Climate Risk Assessment
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold ml-3">
                          💎 Premium
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 text-sm mb-1">Overall Risk</p>
                          <p className={`font-bold text-2xl ${
                            propertyData.climateRisk.overall_score >= 7 ? 'text-red-600' :
                            propertyData.climateRisk.overall_score >= 4 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {propertyData.climateRisk.overall_score}<span className="text-sm text-gray-400">/10</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {propertyData.climateRisk.overall_score >= 7 ? 'High Risk' :
                             propertyData.climateRisk.overall_score >= 4 ? 'Moderate' : 'Low Risk'}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-gray-600 text-sm mb-1">Flood Risk</p>
                          <p className="font-bold text-2xl text-blue-600">
                            {propertyData.climateRisk.flood_risk.score}<span className="text-sm text-gray-400">/10</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Zone {propertyData.climateRisk.flood_risk.zone}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-gray-600 text-sm mb-1">Wind Risk</p>
                          <p className="font-bold text-2xl text-green-600">
                            {propertyData.climateRisk.hurricane_wind_risk.score}<span className="text-sm text-gray-400">/10</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{propertyData.climateRisk.hurricane_wind_risk.design_wind_speed} mph</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-gray-600 text-sm mb-1">Fire/Quake</p>
                          <p className="font-bold text-xl text-yellow-600">
                            {propertyData.climateRisk.wildfire_risk.score}/{propertyData.climateRisk.earthquake_risk.score}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Wildfire/Earthquake</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Risk Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700">
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Flood Zone {propertyData.climateRisk.flood_risk.zone} - {propertyData.climateRisk.flood_risk.risk_level.toLowerCase()} flood risk</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Low hurricane wind exposure ({propertyData.climateRisk.hurricane_wind_risk.design_wind_speed} mph design)</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Minimal wildfire and earthquake risk</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Overall low climate risk supports property value</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Building Intelligence */}
                  {propertyData?.buildingCharacteristics && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">🏠</span>
                        Building Intelligence Analysis
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold ml-3">
                          💎 Premium
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">🔧 Construction Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                              <span className="text-gray-600">Foundation:</span>
                              <span className="font-medium text-gray-900">
                                {propertyData.buildingCharacteristics.foundation_type?.replace(/_/g, ' ') || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                              <span className="text-gray-600">Exterior Walls:</span>
                              <span className="font-medium text-gray-900">
                                {propertyData.buildingCharacteristics.exterior_walls?.replace(/_/g, ' ') || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                              <span className="text-gray-600">Roof Material:</span>
                              <span className="font-medium text-gray-900">
                                {propertyData.buildingCharacteristics.roof_material?.replace(/_/g, ' ') || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                              <span className="text-gray-600">HVAC System:</span>
                              <span className="font-medium text-gray-900">
                                {propertyData.buildingCharacteristics.hvac_type?.replace(/_/g, ' ') || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {propertyData?.reconstructionCost && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">💰 Reconstruction Analysis</h4>
                              <div className="space-y-3">
                                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                  <div className="text-2xl font-bold text-purple-600 mb-1">
                                    {formatCurrency(propertyData.reconstructionCost.total_cost)}
                                  </div>
                                  <p className="text-sm text-gray-600">Total Rebuild Cost</p>
                                  <p className="text-xs text-gray-500">
                                    ${propertyData.reconstructionCost.cost_per_sqft}/sq ft
                                  </p>
                                </div>
                                {propertyData?.roofAnalysis && (
                                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="text-xl font-bold text-yellow-600 mb-1">
                                      {propertyData.roofAnalysis.condition_score}<span className="text-sm text-gray-400">/10</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Roof Condition</p>
                                    <p className="text-xs text-gray-500">
                                      {propertyData.roofAnalysis.condition_grade} • {propertyData.roofAnalysis.estimated_age} years old
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Building Intelligence Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700">
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{propertyData.buildingCharacteristics.quality_class} quality construction materials</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Property age ({new Date().getFullYear() - propertyData.buildingCharacteristics.year_built} years) within optimal range</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Solid foundation and exterior materials</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Modern HVAC system reduces operating costs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Analysis */}
                  {propertyData?.taxData && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">💰</span>
                        Financial & Tax Analysis
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold ml-3">
                          💎 Premium
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-gray-600 text-sm mb-1">Annual Property Tax</p>
                          <p className="font-bold text-2xl text-red-600">
                            {formatCurrency(propertyData.taxData.taxAmount?.totalTaxAmount)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">$180/month</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-gray-600 text-sm mb-1">Land Value</p>
                          <p className="font-bold text-2xl text-blue-600">
                            {formatCurrency(propertyData.taxData.assessedValue?.calculatedLandValue)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">27% of total value</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-gray-600 text-sm mb-1">Improvement Value</p>
                          <p className="font-bold text-2xl text-purple-600">
                            {formatCurrency(propertyData.taxData.assessedValue?.calculatedImprovementValue)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">42% of total value</p>
                        </div>
                      </div>
                      
                      {propertyData?.rentModel && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h4 className="font-semibold text-gray-800 mb-3">📈 Rental Analysis</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Est. Monthly Rent:</span>
                                <span className="font-bold text-green-600">
                                  {formatCurrency(propertyData.rentModel.modelOutput.estimatedValue)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Annual Rent:</span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(propertyData.rentModel.modelOutput.estimatedValue * 12)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Cap Rate:</span>
                                <span className="font-bold text-green-600">
                                  {formatPercentage(propertyData.rentModel.modelOutput.additionalValues.capRate * 100)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-3">📊 Cash Flow Analysis</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Rent:</span>
                                <span className="text-green-600 font-semibold">+{formatCurrency(propertyData.rentModel.modelOutput.estimatedValue)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Property Tax:</span>
                                <span className="text-red-600 font-semibold">-{formatCurrency(propertyData.taxData.taxAmount?.totalTaxAmount / 12)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Insurance (est):</span>
                                <span className="text-red-600 font-semibold">-$120</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between font-bold">
                                <span className="text-gray-900">Net Cash Flow:</span>
                                <span className="text-green-600">
                                  +{formatCurrency(propertyData.rentModel.modelOutput.estimatedValue - (propertyData.taxData.taxAmount?.totalTaxAmount / 12) - 120)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Financial Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700">
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Property taxes are reasonable for Austin market</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Strong rental demand supports cash flow</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>4.8% cap rate indicates solid investment potential</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Positive monthly cash flow after expenses</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investment Analysis */}
                  {propertyData?.investmentAnalysis && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-3">📊</span>
                        Investment Risk Analysis
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold ml-3">
                          💎 Premium
                        </span>
                      </h3>
                      
                      {/* Investment Recommendation Banner */}
                      <div className={`rounded-lg p-4 mb-4 border-2 ${
                        propertyData.investmentAnalysis.recommendation === 'STRONG_BUY' ? 'bg-green-50 border-green-200' :
                        propertyData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            propertyData.investmentAnalysis.recommendation === 'STRONG_BUY' ? 'bg-green-100' :
                            propertyData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' ? 'bg-yellow-100' :
                            'bg-red-100'
                          }`}>
                            <span className={`text-xl ${
                              propertyData.investmentAnalysis.recommendation === 'STRONG_BUY' ? 'text-green-600' :
                              propertyData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {propertyData.investmentAnalysis.recommendation === 'STRONG_BUY' ? '✅' :
                               propertyData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' ? '⚠️' : '❌'}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-bold text-lg ${
                              propertyData.investmentAnalysis.recommendation === 'STRONG_BUY' ? 'text-green-800' :
                              propertyData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' ? 'text-yellow-800' :
                              'text-red-800'
                            }`}>
                              {propertyData.investmentAnalysis.recommendation.replace(/_/g, ' ')}
                            </h4>
                            <p className="text-sm text-gray-700 mt-1">
                              {propertyData.investmentAnalysis.recommendation_details}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Risk Factors */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="text-red-500 mr-2">⚠️</span>
                            Risk Factors
                          </h4>
                          <div className="space-y-2">
                            {propertyData.investmentAnalysis.primary_concerns.map((concern, index) => (
                              <div key={index} className="flex items-start space-x-3 py-2 px-3 bg-red-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{concern}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {propertyData.investmentAnalysis.overall_risk_score}<span className="text-lg text-gray-400">/10</span>
                            </div>
                            <p className="text-sm text-gray-600">Overall Risk Score</p>
                            <p className="text-xs text-gray-500">
                              {propertyData.investmentAnalysis.overall_risk_score >= 7 ? 'High Risk' :
                               propertyData.investmentAnalysis.overall_risk_score >= 4 ? 'Moderate Risk' : 'Low Risk'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Investment Strengths */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="text-green-500 mr-2">✅</span>
                            Investment Strengths
                          </h4>
                          <div className="space-y-2">
                            {propertyData.investmentAnalysis.strengths.map((strength, index) => (
                              <div key={index} className="flex items-start space-x-3 py-2 px-3 bg-green-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{strength}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600 mb-1">
                                {formatCurrency(propertyData.investmentAnalysis.estimated_property_value)}
                              </div>
                              <p className="text-xs text-gray-600">Est. Property Value</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600 mb-1">
                                {formatCurrency(propertyData.investmentAnalysis.reconstruction_cost)}
                              </div>
                              <p className="text-xs text-gray-600">Rebuild Cost</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* ENTERPRISE ONLY FEATURES - Show advanced analysis for enterprise tier */}
                  {isEnterpriseReport && (
                    <>
                      {/* Weather Event History Analysis */}
                      {propertyData?.weatherEvents && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="text-2xl mr-3">⛈️</span>
                            Weather Event History
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded text-xs font-semibold ml-3">
                              🏢 Enterprise
                            </span>
                          </h3>
                          <div className="space-y-3 mb-4">
                            {propertyData.weatherEvents.map((event, index) => (
                              <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    event.damage_potential === 'HIGH' ? 'bg-red-100' :
                                    event.damage_potential === 'MODERATE' ? 'bg-yellow-100' : 'bg-green-100'
                                  }`}>
                                    <span className="text-xl">
                                      {event.event_type === 'HAIL' ? '🧊' : event.event_type === 'HIGH_WIND' ? '💨' : '⛈️'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{event.event_type.replace(/_/g, ' ')}</p>
                                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">{event.wind_speed} mph</p>
                                  {event.max_hail_size && (
                                    <p className="text-xs text-gray-500">{event.max_hail_size}" hail</p>
                                  )}
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                                    event.damage_potential === 'HIGH' ? 'bg-red-100 text-red-600' :
                                    event.damage_potential === 'MODERATE' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {event.damage_potential.toLowerCase()} risk
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Weather Impact Analysis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700">
                              <div className="space-y-1">
                                <div className="flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>No significant hail damage detected in recent history</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>Wind events are within normal range for Austin area</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>Property shows resilience to weather events</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>Insurance claims likely minimal based on event history</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Advanced Building Intelligence - Enhanced for Enterprise */}
                      {propertyData?.roofAnalysis && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="text-2xl mr-3">🔍</span>
                            AI Roof Analysis
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded text-xs font-semibold ml-3">
                              🏢 Enterprise
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-4">
                                <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                                  propertyData.roofAnalysis.condition_score >= 7 ? 'bg-green-100' :
                                  propertyData.roofAnalysis.condition_score >= 4 ? 'bg-yellow-100' : 'bg-red-100'
                                }`}>
                                  <span className={`text-3xl ${
                                    propertyData.roofAnalysis.condition_score >= 7 ? 'text-green-600' :
                                    propertyData.roofAnalysis.condition_score >= 4 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {propertyData.roofAnalysis.condition_score >= 7 ? '✅' :
                                     propertyData.roofAnalysis.condition_score >= 4 ? '⚠️' : '❌'}
                                  </span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                  {propertyData.roofAnalysis.condition_score}<span className="text-xl text-gray-400">/10</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                  {propertyData.roofAnalysis.condition_grade} Condition
                                </p>
                                <p className="text-xs text-gray-600">
                                  Estimated {propertyData.roofAnalysis.estimated_age} years old
                                </p>
                              </div>
                              
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                                  <span className="text-gray-600">Replacement Timeline:</span>
                                  <span className="font-semibold text-gray-900">{propertyData.roofAnalysis.replacement_needed}</span>
                                </div>
                                <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                                  <span className="text-gray-600">Material Type:</span>
                                  <span className="font-semibold text-gray-900">
                                    {propertyData.buildingCharacteristics?.roof_material?.replace(/_/g, ' ') || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">🛡️ Weather Damage Assessment</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xl">🧊</span>
                                    <div>
                                      <span className="text-sm font-medium text-gray-900">Hail Damage</span>
                                      <p className="text-xs text-gray-600">AI Detection Analysis</p>
                                    </div>
                                  </div>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    propertyData.roofAnalysis.weather_damage?.hail_damage_detected 
                                      ? 'bg-red-100 text-red-600' 
                                      : 'bg-green-100 text-green-600'
                                  }`}>
                                    {propertyData.roofAnalysis.weather_damage?.hail_damage_detected ? 'Detected' : 'None Detected'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xl">💨</span>
                                    <div>
                                      <span className="text-sm font-medium text-gray-900">Wind Damage</span>
                                      <p className="text-xs text-gray-600">AI Detection Analysis</p>
                                    </div>
                                  </div>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    propertyData.roofAnalysis.weather_damage?.wind_damage_detected 
                                      ? 'bg-yellow-100 text-yellow-600' 
                                      : 'bg-green-100 text-green-600'
                                  }`}>
                                    {propertyData.roofAnalysis.weather_damage?.wind_damage_detected 
                                      ? propertyData.roofAnalysis.weather_damage.damage_severity 
                                      : 'None Detected'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-2 text-sm">💡 AI Insights</h5>
                                <div className="space-y-1 text-xs text-gray-700">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Roof shows minimal wear for {propertyData.roofAnalysis.estimated_age}-year age</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Material quality appears consistent across surface</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>No immediate replacement required</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Advanced Reconstruction Cost Analysis */}
                      {propertyData?.reconstructionCost && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="text-2xl mr-3">💎</span>
                            Advanced Cost Analysis
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded text-xs font-semibold ml-3">
                              🏢 Enterprise
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                              <div className="text-3xl font-bold text-purple-600 mb-2">
                                {formatCurrency(propertyData.reconstructionCost.total_cost)}
                              </div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Total Rebuild Cost</p>
                              <p className="text-xs text-gray-600">
                                ${propertyData.reconstructionCost.cost_per_sqft}/sq ft
                              </p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                              <div className="text-3xl font-bold text-blue-600 mb-2">
                                {(propertyData.reconstructionCost.confidence_score * 100).toFixed(0)}%
                              </div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Confidence Level</p>
                              <p className="text-xs text-gray-600">AI Model Accuracy</p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                              <div className="text-3xl font-bold text-green-600 mb-2">
                                {formatCurrency((propertyData?.investmentAnalysis?.estimated_property_value || 425000) - propertyData.reconstructionCost.total_cost)}
                              </div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Value Above Cost</p>
                              <p className="text-xs text-gray-600">Investment Margin</p>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-800 mb-3">🔧 Component Cost Breakdown</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Object.entries(propertyData.reconstructionCost.components).slice(0, 8).map(([component, cost]) => (
                              <div key={component} className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-lg font-bold text-gray-900 mb-1">
                                  {formatCurrency(cost)}
                                </div>
                                <p className="text-xs text-gray-600 capitalize">
                                  {component.replace(/_/g, ' ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Premium Features Preview - Only show if NOT premium */}
              {!isPremiumReport && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🚀</span>
                    Unlock Premium Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-blue-500">🛡️</span>
                        <span>Climate Risk Assessment</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">$15 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-green-500">💰</span>
                        <span>Financial & Tax History</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">$10 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-purple-500">🏠</span>
                        <span>Building Intelligence</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">$25 value</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-indigo-500">📊</span>
                        <span>Investment Risk Analysis</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">$20 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-orange-500">🔍</span>
                        <span>AI Roof Analysis</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">$10 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-red-500">⛈️</span>
                        <span>Weather Event History</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">$15 value</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Total Premium Value: $95+</strong> • Unlock for just <strong>50 FCT ($25)</strong>
                    </p>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
                      Try Premium Report
                    </button>
                  </div>
                </div>
              )}

              {/* Enterprise Features Preview - Only show if Premium (not Enterprise) */}
              {isPremiumReport && !isEnterpriseReport && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🏢</span>
                    Unlock Enterprise Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-orange-500">🔍</span>
                        <span>AI Roof Analysis</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">$10 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-red-500">⛈️</span>
                        <span>Weather Event History</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">$15 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-pink-500">💎</span>
                        <span>Advanced Cost Analysis</span>
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">$10 value</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-purple-500">🤖</span>
                        <span>AI Property Intelligence</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">$15 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-indigo-500">📈</span>
                        <span>Advanced Investment Metrics</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">$10 value</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="text-blue-500">🎯</span>
                        <span>Predictive Analytics</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">$15 value</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Total Enterprise Value: $75+</strong> • Unlock for just <strong>100 FCT ($50)</strong>
                    </p>
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors">
                      Try Enterprise Report
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Guide */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">🧭</span>
                  Explore Detailed Sections
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Use the tabs above to dive deeper into specific aspects of this property:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                  {tabs.filter(tab => tab.id !== 'overview').map((tab) => {
                    const Icon = tab.icon;
                    const isPremiumTab = ['climate', 'building', 'financial', 'investment'].includes(tab.id);
                    return (
                      <div key={tab.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">{tab.name}</span>
                        {isPremiumTab && (
                          <span className="text-xs text-yellow-600">💎</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {/* Feature Comparison Matrix */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  COMPLETE FEATURE COMPARISON - SEE WHAT YOU GET
                </h3>
                <p className="text-gray-600 text-sm mt-1">Compare all available features across our pricing tiers</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-blue-900">Premium<br/><span className="text-xs font-normal">50 FCT</span></th>
                      <th className="text-center py-4 px-4 font-semibold text-purple-900">Enterprise<br/><span className="text-xs font-normal">100 FCT</span></th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Est. Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 font-medium text-gray-900">Property Overview & Pricing</td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4 text-gray-600">-</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Nearby Locations & Amenities</td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4 text-gray-600">-</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 font-medium text-gray-900">Major Employers Analysis</td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-500 text-xl">✓</span></td>
                      <td className="text-center py-4 px-4 text-gray-600">-</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-blue-50">
                      <td className="py-4 px-6 font-medium text-blue-900">🛡️ Climate Risk Analysis</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-blue-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-blue-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-blue-600 font-semibold">$15</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-green-50">
                      <td className="py-4 px-6 font-medium text-green-900">💰 Financial Data & Tax History</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-green-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-green-600 font-semibold">$10</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-indigo-50">
                      <td className="py-4 px-6 font-medium text-indigo-900">📊 Investment Risk Analysis</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-indigo-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-indigo-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-indigo-600 font-semibold">$20</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-purple-50">
                      <td className="py-4 px-6 font-medium text-purple-900">🏠 Building Intelligence & Materials</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-purple-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4"><span className="text-purple-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-purple-600 font-semibold">$25</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-orange-50">
                      <td className="py-4 px-6 font-medium text-orange-900">🔍 AI Roof Analysis</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-orange-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-orange-600 font-semibold">$10</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-red-50">
                      <td className="py-4 px-6 font-medium text-red-900">⛈️ Weather Event History</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-red-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-red-600 font-semibold">$15</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-pink-50">
                      <td className="py-4 px-6 font-medium text-pink-900">💎 Reconstruction Cost Analysis</td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-gray-400">✗</span></td>
                      <td className="text-center py-4 px-4"><span className="text-pink-600 text-xl font-bold">✓</span></td>
                      <td className="text-center py-4 px-4 text-pink-600 font-semibold">$10</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="py-4 px-6 text-gray-900">TOTAL VALUE</td>
                      <td className="text-center py-4 px-4 text-green-600">FREE</td>
                      <td className="text-center py-4 px-4 text-blue-600">$70+ USD</td>
                      <td className="text-center py-4 px-4 text-purple-600">$105+ USD</td>
                      <td className="text-center py-4 px-4 text-gray-900">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Current Report Status */}
            <div className={`rounded-lg p-6 border-2 ${
              isPremiumReport 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300'
                : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isPremiumReport ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  <span className="text-white text-2xl">{isPremiumReport ? '💎' : '🆓'}</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  isPremiumReport ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  You're Currently Viewing: {reportType}
                </h3>
                <p className={`text-lg font-medium mb-4 ${
                  isPremiumReport ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {currentReportTier === 'enterprise' ? 'Total Value: $105+ USD • Paid with 100 FCT' : 
                   currentReportTier === 'premium' ? 'Total Value: $70+ USD • Paid with 50 FCT' : 
                   'Always free with basic property insights'}
                </p>
                
                {currentReportTier === 'basic' && (
                  <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">Missing Premium Features:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-orange-800">
                      <div>🔒 Climate risk analysis ($15)</div>
                      <div>🔒 Building intelligence ($25)</div>
                      <div>🔒 Financial data & taxes ($10)</div>
                      <div>🔒 Investment analysis ($20)</div>
                      <div>🔒 AI roof analysis ($10)</div>
                      <div>🔒 Weather event history ($15)</div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors">
                        Try Premium Report for 50 FCT ($25)
                      </button>
                    </div>
                  </div>
                )}
                
                {currentReportTier === 'premium' && (
                  <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Missing Enterprise Features:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                      <div>🔒 AI roof analysis ($10)</div>
                      <div>🔒 Weather event history ($15)</div>
                      <div>🔒 Advanced cost analysis ($10)</div>
                      <div>🔒 AI property intelligence ($15)</div>
                      <div>🔒 Advanced investment metrics ($10)</div>
                      <div>🔒 Predictive analytics ($15)</div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors">
                        Try Enterprise Report for 100 FCT ($50)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            {/* Price Comparisons */}
            {priceComparisons && priceComparisons.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  Price Comparisons
                </h3>
                <div className="space-y-3">
                  {priceComparisons.map((comp, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{comp.level} Average</p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(comp.average)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-1 ${
                            comp.difference >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {comp.difference >= 0 ? 
                              <FiTrendingUp className="w-4 h-4" /> : 
                              <FiTrendingDown className="w-4 h-4" />
                            }
                            <span className="font-semibold">
                              {Math.abs(comp.percentDiff)}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {comp.difference >= 0 ? '+' : ''}{formatPrice(comp.difference)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Insights */}
            {priceAnalytics.marketInsights && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">Market Insights</h3>
                <div className="space-y-2 text-sm">
                  {priceAnalytics.marketInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-6">
            {categorizedLocations.map(([categoryName, category]) => (
              <div key={categoryName} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(`category_${categoryName}`)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{categoryName}</h3>
                      <p className="text-sm text-gray-600">{category.items.length} locations</p>
                    </div>
                  </div>
                  {expandedSections[`category_${categoryName}`] !== false ? 
                    <FiChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <FiChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                
                {expandedSections[`category_${categoryName}`] !== false && (
                  <div className="p-4 space-y-3">
                    {category.items.map((location, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{location.name}</p>
                          <p className="text-sm text-gray-600">{location.address || location.vicinity}</p>
                          {location.rating && (
                            <div className="flex items-center space-x-1 mt-1">
                              <FiStar className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">{location.rating}/5</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-right">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDistance(location.distance)}
                            </p>
                            {location.walkTime && (
                              <p className="text-xs text-gray-500">
                                {location.walkTime} walk
                              </p>
                            )}
                          </div>
                          <FiNavigation className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="space-y-6">
            {/* District Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">🎓</span>
                  {propertyData.schoolInformation.district.name}
                </h2>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {propertyData.schoolInformation.district.rating}<span className="text-lg text-gray-400">/10</span>
                  </div>
                  <p className="text-xs text-blue-600">District Rating</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Schools:</span>
                  <p className="font-semibold text-gray-900">{propertyData.schoolInformation.district.total_schools}</p>
                </div>
                <div>
                  <span className="text-gray-600">District Website:</span>
                  <p className="font-semibold text-blue-600">
                    <a href={propertyData.schoolInformation.district.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned Schools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Elementary School */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">🏫 Elementary</h3>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      {propertyData.schoolInformation.elementary.rating}<span className="text-sm text-gray-400">/10</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{propertyData.schoolInformation.elementary.name}</h4>
                    <p className="text-xs text-gray-600">{propertyData.schoolInformation.elementary.address}</p>
                    <p className="text-xs text-blue-600">{propertyData.schoolInformation.elementary.distance} mi away</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Grades:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.elementary.grades}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Enrollment:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.elementary.enrollment}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ratio:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.elementary.student_teacher_ratio}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Specialty Programs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {propertyData.schoolInformation.elementary.specialty_programs.map((program, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-600 text-xs">Test Scores:</span>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.elementary.test_scores.reading}</div>
                        <div className="text-gray-500">Reading</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.elementary.test_scores.math}</div>
                        <div className="text-gray-500">Math</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.elementary.test_scores.science}</div>
                        <div className="text-gray-500">Science</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle School */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">🏫 Middle</h3>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-600">
                      {propertyData.schoolInformation.middle.rating}<span className="text-sm text-gray-400">/10</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{propertyData.schoolInformation.middle.name}</h4>
                    <p className="text-xs text-gray-600">{propertyData.schoolInformation.middle.address}</p>
                    <p className="text-xs text-blue-600">{propertyData.schoolInformation.middle.distance} mi away</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Grades:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.middle.grades}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Enrollment:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.middle.enrollment}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ratio:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.middle.student_teacher_ratio}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Specialty Programs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {propertyData.schoolInformation.middle.specialty_programs.map((program, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-600 text-xs">Test Scores:</span>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.middle.test_scores.reading}</div>
                        <div className="text-gray-500">Reading</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.middle.test_scores.math}</div>
                        <div className="text-gray-500">Math</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.middle.test_scores.science}</div>
                        <div className="text-gray-500">Science</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* High School */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">🏫 High</h3>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">
                      {propertyData.schoolInformation.high.rating}<span className="text-sm text-gray-400">/10</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{propertyData.schoolInformation.high.name}</h4>
                    <p className="text-xs text-gray-600">{propertyData.schoolInformation.high.address}</p>
                    <p className="text-xs text-blue-600">{propertyData.schoolInformation.high.distance} mi away</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Grades:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.high.grades}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Enrollment:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.high.enrollment}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ratio:</span>
                      <p className="font-medium text-gray-900">{propertyData.schoolInformation.high.student_teacher_ratio}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Grad Rate:</span>
                      <p className="font-medium text-green-600">{propertyData.schoolInformation.high.graduation_rate}%</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">College Readiness:</span>
                    <div className="mt-1">
                      <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs inline-block">
                        {propertyData.schoolInformation.high.college_readiness}% College Ready
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Specialty Programs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {propertyData.schoolInformation.high.specialty_programs.map((program, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-600 text-xs">Test Scores:</span>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.high.test_scores.reading}</div>
                        <div className="text-gray-500">Reading</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.high.test_scores.math}</div>
                        <div className="text-gray-500">Math</div>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <div className="font-bold">{propertyData.schoolInformation.high.test_scores.science}</div>
                        <div className="text-gray-500">Science</div>
                      </div>
                    </div>
                  </div>
                  {propertyData.schoolInformation.high.notable_achievements && (
                    <div>
                      <span className="text-gray-600 text-xs">Achievements:</span>
                      <div className="mt-1 space-y-1">
                        {propertyData.schoolInformation.high.notable_achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-xs text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nearby Colleges */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🎓</span>
                Higher Education Nearby
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {propertyData.schoolInformation.colleges_nearby.map((college, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{college.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{college.type}</p>
                        <p className="text-xs text-blue-600">{college.distance} mi away</p>
                      </div>
                      {college.ranking && (
                        <div className="text-center">
                          <div className="text-sm font-bold text-indigo-600">
                            #{college.ranking.national}
                          </div>
                          <div className="text-xs text-gray-500">National</div>
                          {college.ranking.public && (
                            <>
                              <div className="text-sm font-bold text-green-600">
                                #{college.ranking.public}
                              </div>
                              <div className="text-xs text-gray-500">Public</div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Enrollment:</span>
                          <p className="font-medium text-gray-900">{college.enrollment?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Accept Rate:</span>
                          <p className="font-medium text-gray-900">{college.acceptance_rate}%</p>
                        </div>
                      </div>
                      {college.tuition && (
                        <div>
                          <span className="text-gray-600 text-xs">Tuition:</span>
                          <div className="mt-1">
                            {college.tuition.in_state && (
                              <div className="text-xs">
                                <span className="text-gray-600">In-State: </span>
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(college.tuition.in_state)}
                                </span>
                              </div>
                            )}
                            {college.tuition.out_of_state && (
                              <div className="text-xs">
                                <span className="text-gray-600">Out-of-State: </span>
                                <span className="font-semibold text-orange-600">
                                  {formatCurrency(college.tuition.out_of_state)}
                                </span>
                              </div>
                            )}
                            {college.tuition.annual && (
                              <div className="text-xs">
                                <span className="text-gray-600">Annual: </span>
                                <span className="font-semibold text-blue-600">
                                  {formatCurrency(college.tuition.annual)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 text-xs">Notable Programs:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {college.notable_programs.slice(0, 4).map((program, pIndex) => (
                            <span key={pIndex} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                              {program}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* School Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Education Investment Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Excellent elementary school with 9.2/10 rating attracts families with young children</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>High school offers IB Programme and strong college readiness (78%)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>University of Texas at Austin (1.6 mi) adds significant property value</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All assigned schools within 2 miles - excellent for families</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Strong specialty programs (STEM, IB, Dual Language) boost appeal</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Austin ISD reputation enhances long-term investment value</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FiUsers className="w-5 h-5 text-blue-500 mr-2" />
                Major Employers Nearby
              </h3>
              <span className="text-sm text-gray-600">
                {majorEmployers.length} companies
              </span>
            </div>
            
            {majorEmployers.length > 0 ? (
              <div className="space-y-3">
                {majorEmployers.map((employer, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{employer.name}</h4>
                            <p className="text-sm text-gray-600">{employer.industry}</p>
                            {employer.employees && (
                              <p className="text-xs text-gray-500">
                                ~{employer.employees.toLocaleString()} employees
                              </p>
                            )}
                          </div>
                        </div>
                        {employer.description && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {employer.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDistance(employer.distance)}
                        </p>
                        {employer.commute && (
                          <p className="text-xs text-gray-500">
                            {employer.commute.time} drive
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No major employers found in the area</p>
              </div>
            )}
          </div>
        )}

        {/* Climate Risk Tab */}
        {activeTab === 'climate' && comprehensiveData?.climateRisk && (
          <div className="space-y-6">
            {/* Risk Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Overall Risk Score */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Overall Risk</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    comprehensiveData.climateRisk.overall_score >= 7 ? 'bg-red-400' :
                    comprehensiveData.climateRisk.overall_score >= 4 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {comprehensiveData.climateRisk.overall_score}<span className="text-lg text-gray-400">/10</span>
                </div>
                <p className={`text-xs font-medium ${
                  comprehensiveData.climateRisk.overall_score >= 7 ? 'text-red-600' :
                  comprehensiveData.climateRisk.overall_score >= 4 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {comprehensiveData.climateRisk.overall_score >= 7 ? 'High Risk' :
                   comprehensiveData.climateRisk.overall_score >= 4 ? 'Moderate' : 'Low Risk'}
                </p>
              </div>

              {/* Flood Risk */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Flood Risk</h3>
                  <FiCloudRain className={`w-4 h-4 ${
                    comprehensiveData.climateRisk.flood_risk.risk_level === 'HIGH' ? 'text-red-400' :
                    comprehensiveData.climateRisk.flood_risk.risk_level === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {comprehensiveData.climateRisk.flood_risk.score}<span className="text-lg text-gray-400">/10</span>
                </div>
                <p className="text-xs text-gray-600">Zone {comprehensiveData.climateRisk.flood_risk.zone}</p>
              </div>

              {/* Wind Risk */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Wind Risk</h3>
                  <FiWind className={`w-4 h-4 ${
                    comprehensiveData.climateRisk.hurricane_wind_risk.risk_level === 'HIGH' ? 'text-red-400' :
                    comprehensiveData.climateRisk.hurricane_wind_risk.risk_level === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {comprehensiveData.climateRisk.hurricane_wind_risk.score}<span className="text-lg text-gray-400">/10</span>
                </div>
                <p className="text-xs text-gray-600">{comprehensiveData.climateRisk.hurricane_wind_risk.design_wind_speed} mph</p>
              </div>

              {/* Fire/Earthquake Combined */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Other Risks</h3>
                  <FiZap className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Wildfire:</span>
                    <span className="font-medium">{comprehensiveData.climateRisk.wildfire_risk.score}/10</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Earthquake:</span>
                    <span className="font-medium">{comprehensiveData.climateRisk.earthquake_risk.score}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Summary Panel */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Risk Summary</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        comprehensiveData.climateRisk.flood_risk.risk_level === 'HIGH' ? 'bg-red-400' :
                        comprehensiveData.climateRisk.flood_risk.risk_level === 'MODERATE' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Flood Zone {comprehensiveData.climateRisk.flood_risk.zone}</p>
                        <p className="text-xs text-gray-600">
                          Base elevation {comprehensiveData.climateRisk.flood_risk.base_flood_elevation} ft above sea level
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        comprehensiveData.climateRisk.hurricane_wind_risk.risk_level === 'HIGH' ? 'bg-red-400' :
                        comprehensiveData.climateRisk.hurricane_wind_risk.risk_level === 'MODERATE' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Hurricane Wind Zone</p>
                        <p className="text-xs text-gray-600">
                          Design wind speed {comprehensiveData.climateRisk.hurricane_wind_risk.design_wind_speed} mph for construction
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Insurance Impact</h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      {comprehensiveData.climateRisk.flood_risk.risk_level === 'HIGH' && (
                        <p>• Flood insurance required</p>
                      )}
                      {comprehensiveData.climateRisk.hurricane_wind_risk.risk_level !== 'LOW' && (
                        <p>• Wind damage coverage recommended</p>
                      )}
                      <p>• Low wildfire/earthquake risk reduces premiums</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Events Timeline */}
            {comprehensiveData.weatherEvents?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiThermometer className="w-5 h-5 text-blue-500 mr-2" />
                  Weather History
                </h3>
                <div className="space-y-3">
                  {comprehensiveData.weatherEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.damage_potential === 'HIGH' ? 'bg-red-100' :
                          event.damage_potential === 'MODERATE' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {event.event_type === 'HAIL' ? '🧊' : event.event_type === 'HIGH_WIND' ? '💨' : '⛈️'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.event_type.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium text-gray-900">{event.wind_speed} mph</p>
                        {event.max_hail_size && (
                          <p className="text-gray-500">{event.max_hail_size}" hail</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Building Intelligence Tab */}
        {activeTab === 'building' && comprehensiveData?.buildingCharacteristics && (
          <div className="space-y-6">
            {/* Building Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reconstruction Cost */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Rebuild Cost</h3>
                  <FiTool className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(comprehensiveData.reconstructionCost?.total_cost)}
                </div>
                <p className="text-xs text-gray-600">
                  ${comprehensiveData.reconstructionCost?.cost_per_sqft}/sq ft
                </p>
              </div>

              {/* Roof Condition */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Roof Condition</h3>
                  <FiShield className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {comprehensiveData.roofAnalysis?.condition_score}<span className="text-lg text-gray-400">/10</span>
                </div>
                <p className="text-xs text-gray-600">
                  {comprehensiveData.roofAnalysis?.condition_grade} Grade
                </p>
              </div>

              {/* Building Age */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Building Age</h3>
                  <FiHome className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {new Date().getFullYear() - comprehensiveData.buildingCharacteristics.year_built}
                </div>
                <p className="text-xs text-gray-600">
                  Built {comprehensiveData.buildingCharacteristics.year_built}
                </p>
              </div>
            </div>

            {/* Building Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Building Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Structure</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Foundation:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.foundation_type?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stories:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.stories || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quality:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.quality_class || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Exterior</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Walls:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.exterior_walls?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Roof:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.roof_material?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Parking:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.garage_spaces || 0} spaces
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Systems</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">HVAC:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.hvac_type?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Condition:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.buildingCharacteristics.condition || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reconstruction Cost Breakdown */}
            {comprehensiveData.reconstructionCost && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Total Reconstruction Cost</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(comprehensiveData.reconstructionCost.total_cost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Per square foot</span>
                    <span className="font-medium text-gray-700">
                      ${comprehensiveData.reconstructionCost.cost_per_sqft}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Confidence level</span>
                    <span className="font-medium text-gray-700">
                      {(comprehensiveData.reconstructionCost.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                {/* Cost Component Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-500">Component Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(comprehensiveData.reconstructionCost.components).map(([component, cost]) => (
                      <div key={component} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 capitalize">{component.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Roof Condition Details */}
            {comprehensiveData.roofAnalysis && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Roof Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        comprehensiveData.roofAnalysis.condition_score >= 7 ? 'bg-green-100' :
                        comprehensiveData.roofAnalysis.condition_score >= 4 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-xl ${
                          comprehensiveData.roofAnalysis.condition_score >= 7 ? 'text-green-600' :
                          comprehensiveData.roofAnalysis.condition_score >= 4 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {comprehensiveData.roofAnalysis.condition_score >= 7 ? '✅' :
                           comprehensiveData.roofAnalysis.condition_score >= 4 ? '⚠️' : '❌'}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {comprehensiveData.roofAnalysis.condition_score}/10
                        </div>
                        <p className="text-sm text-gray-600">
                          {comprehensiveData.roofAnalysis.condition_grade} condition
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated age:</span>
                        <span className="font-medium">{comprehensiveData.roofAnalysis.estimated_age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Replacement needed:</span>
                        <span className="font-medium">{comprehensiveData.roofAnalysis.replacement_needed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Issues Found */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Issues Detected</h4>
                    {comprehensiveData.roofAnalysis.defects_detected?.length > 0 ? (
                      <div className="space-y-2">
                        {comprehensiveData.roofAnalysis.defects_detected.map((defect, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {defect.type.replace(/_/g, ' ').toLowerCase()}
                              </p>
                              <p className="text-xs text-gray-500">{defect.coverage_percentage}% coverage</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              defect.severity === 'HIGH' ? 'bg-red-100 text-red-600' :
                              defect.severity === 'MODERATE' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {defect.severity.toLowerCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-600 text-lg">✅</span>
                        </div>
                        <p className="text-sm text-gray-600">No major defects detected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Material & Systems Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials & Systems</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Structural</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Foundation:</span>
                        <span className="font-medium text-gray-900">
                          {comprehensiveData.buildingCharacteristics.foundation_type?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Walls:</span>
                        <span className="font-medium text-gray-900">
                          {comprehensiveData.buildingCharacteristics.exterior_walls?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Roof:</span>
                        <span className="font-medium text-gray-900">
                          {comprehensiveData.buildingCharacteristics.roof_material?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Systems & Features</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">HVAC:</span>
                        <span className="font-medium text-gray-900">
                          {comprehensiveData.buildingCharacteristics.hvac_type?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parking:</span>
                        <span className="font-medium text-gray-900">
                          {comprehensiveData.buildingCharacteristics.garage_spaces || 0} spaces
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className={`font-medium ${
                          comprehensiveData.buildingCharacteristics.condition === 'GOOD' ? 'text-green-600' :
                          comprehensiveData.buildingCharacteristics.condition === 'AVERAGE' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {comprehensiveData.buildingCharacteristics.condition || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Damage Assessment */}
            {comprehensiveData.roofAnalysis?.weather_damage && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Damage Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🧊</span>
                      <span className="text-sm font-medium text-gray-900">Hail Damage</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      comprehensiveData.roofAnalysis.weather_damage.hail_damage_detected 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {comprehensiveData.roofAnalysis.weather_damage.hail_damage_detected ? 'Detected' : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">💨</span>
                      <span className="text-sm font-medium text-gray-900">Wind Damage</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      comprehensiveData.roofAnalysis.weather_damage.wind_damage_detected 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {comprehensiveData.roofAnalysis.weather_damage.wind_damage_detected 
                        ? comprehensiveData.roofAnalysis.weather_damage.damage_severity 
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && comprehensiveData?.taxData && (
          <div className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tax Amount */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Annual Tax</h3>
                  <FiDollarSign className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(comprehensiveData.taxData.annual_tax_amount)}
                </div>
                <p className="text-xs text-gray-600">{comprehensiveData.taxData.effective_tax_rate}% rate</p>
              </div>

              {/* Market Value */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Market Value</h3>
                  <FiTrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(comprehensiveData.taxData.market_value)}
                </div>
                <p className="text-xs text-gray-600">Current estimate</p>
              </div>

              {/* Assessed Value */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Assessed Value</h3>
                  <FiBarChart2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(comprehensiveData.taxData.assessed_value)}
                </div>
                <p className="text-xs text-gray-600">{comprehensiveData.taxData.tax_year} assessment</p>
              </div>

              {/* Tax Status */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Tax Status</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    comprehensiveData.taxData.tax_status === 'CURRENT' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {comprehensiveData.taxData.tax_status}
                </div>
                <p className="text-xs text-gray-600">
                  {comprehensiveData.taxData.exemptions?.length > 0 
                    ? comprehensiveData.taxData.exemptions.join(', ') 
                    : 'No exemptions'}
                </p>
              </div>
            </div>

            {/* Value Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Valuation Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Market Value</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(comprehensiveData.taxData.market_value)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Tax Assessed Value</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(comprehensiveData.taxData.assessed_value)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="text-sm font-medium text-gray-900">Value Difference</span>
                      <span className={`text-lg font-bold ${
                        comprehensiveData.taxData.market_value > comprehensiveData.taxData.assessed_value 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {comprehensiveData.taxData.market_value > comprehensiveData.taxData.assessed_value ? '+' : ''}
                        {(((comprehensiveData.taxData.market_value - comprehensiveData.taxData.assessed_value) / comprehensiveData.taxData.assessed_value) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Tax Impact Analysis</h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p>• Property is {comprehensiveData.taxData.market_value > comprehensiveData.taxData.assessed_value ? 'under-assessed' : 'fairly assessed'} for tax purposes</p>
                      <p>• Effective tax rate of {comprehensiveData.taxData.effective_tax_rate}% is {comprehensiveData.taxData.effective_tax_rate > 2.5 ? 'above' : comprehensiveData.taxData.effective_tax_rate > 1.5 ? 'average for' : 'below'} regional average</p>
                      {comprehensiveData.taxData.exemptions?.length > 0 && (
                        <p>• Active exemptions provide tax savings</p>
                      )}
                      <p>• Tax status is current with no delinquencies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax History Chart */}
            {comprehensiveData.taxHistory?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                  Tax Trend Analysis
                </h3>
                <div className="space-y-3">
                  {comprehensiveData.taxHistory.map((tax, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">{tax.year}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Tax Year {tax.year}</p>
                          <p className="text-sm text-gray-500">Assessed: {formatPrice(tax.assessed_value)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(tax.tax_amount)}</p>
                        {index > 0 && (
                          <div className={`flex items-center space-x-1 text-xs ${
                            tax.tax_amount > comprehensiveData.taxHistory[index - 1].tax_amount 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            <span>{tax.tax_amount > comprehensiveData.taxHistory[index - 1].tax_amount ? '↑' : '↓'}</span>
                            <span>
                              {Math.abs(
                                ((tax.tax_amount - comprehensiveData.taxHistory[index - 1].tax_amount) / 
                                 comprehensiveData.taxHistory[index - 1].tax_amount * 100).toFixed(1)
                              )}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ownership Details */}
            {comprehensiveData.ownership && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="w-5 h-5 text-blue-500 mr-2" />
                  Ownership Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Owner:</span>
                      <span className="text-sm font-medium text-gray-900">{comprehensiveData.ownership.current_owner}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Acquired:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(comprehensiveData.ownership.acquisition_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Purchase Price:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatPrice(comprehensiveData.ownership.acquisition_price)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Vesting:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.ownership.vesting?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Deed Type:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {comprehensiveData.ownership.deed_type?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </div>
                    {comprehensiveData.ownership.mortgage_info && (
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">Loan Amount:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(comprehensiveData.ownership.mortgage_info.loan_amount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {comprehensiveData.ownership.mortgage_info && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Lender:</span>
                      <span className="text-sm text-gray-700">{comprehensiveData.ownership.mortgage_info.lender}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Investment Analysis Tab */}
        {activeTab === 'investment' && comprehensiveData?.investmentAnalysis && (
          <div className="space-y-6">
            {/* Investment Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Risk Score */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    comprehensiveData.investmentAnalysis.overall_risk_score >= 7 ? 'bg-red-400' :
                    comprehensiveData.investmentAnalysis.overall_risk_score >= 4 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {comprehensiveData.investmentAnalysis.overall_risk_score}<span className="text-lg text-gray-400">/10</span>
                </div>
                <p className={`text-xs font-medium ${
                  comprehensiveData.investmentAnalysis.overall_risk_score >= 7 ? 'text-red-600' :
                  comprehensiveData.investmentAnalysis.overall_risk_score >= 4 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {comprehensiveData.investmentAnalysis.overall_risk_score >= 7 ? 'High Risk' :
                   comprehensiveData.investmentAnalysis.overall_risk_score >= 4 ? 'Moderate' : 'Low Risk'}
                </p>
              </div>

              {/* Property Value */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Property Value</h3>
                  <FiTrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(comprehensiveData.investmentAnalysis.estimated_property_value)}
                </div>
                <p className="text-xs text-gray-600">Market estimate</p>
              </div>

              {/* Rebuild Cost */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Rebuild Cost</h3>
                  <FiTool className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(comprehensiveData.investmentAnalysis.reconstruction_cost)}
                </div>
                <p className="text-xs text-gray-600">Full reconstruction</p>
              </div>

              {/* Value vs Cost */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Value Margin</h3>
                  <FiActivity className={`w-4 h-4 ${
                    comprehensiveData.investmentAnalysis.estimated_property_value > comprehensiveData.investmentAnalysis.reconstruction_cost
                      ? 'text-green-400' : 'text-red-400'
                  }`} />
                </div>
                <div className={`text-2xl font-bold mb-1 ${
                  comprehensiveData.investmentAnalysis.estimated_property_value > comprehensiveData.investmentAnalysis.reconstruction_cost
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comprehensiveData.investmentAnalysis.estimated_property_value > comprehensiveData.investmentAnalysis.reconstruction_cost ? '+' : ''}
                  {formatPrice(comprehensiveData.investmentAnalysis.estimated_property_value - comprehensiveData.investmentAnalysis.reconstruction_cost)}
                </div>
                <p className="text-xs text-gray-600">
                  {comprehensiveData.investmentAnalysis.estimated_property_value > comprehensiveData.investmentAnalysis.reconstruction_cost 
                    ? 'Above rebuild cost' : 'Below rebuild cost'}
                </p>
              </div>
            </div>

            {/* Investment Recommendation */}
            <div className={`bg-white rounded-xl p-6 shadow-sm border ${
              comprehensiveData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' 
                ? 'border-yellow-200' 
                : comprehensiveData.investmentAnalysis.recommendation === 'STRONG_BUY'
                ? 'border-green-200'
                : 'border-red-200'
            }`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  comprehensiveData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' 
                    ? 'bg-yellow-100' 
                    : comprehensiveData.investmentAnalysis.recommendation === 'STRONG_BUY'
                    ? 'bg-green-100'
                    : 'bg-red-100'
                }`}>
                  <span className={`text-xl ${
                    comprehensiveData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' 
                      ? 'text-yellow-600' 
                      : comprehensiveData.investmentAnalysis.recommendation === 'STRONG_BUY'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {comprehensiveData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' ? '⚠️' :
                     comprehensiveData.investmentAnalysis.recommendation === 'STRONG_BUY' ? '✅' : '❌'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Investment Recommendation</h3>
                  <p className={`font-medium ${
                    comprehensiveData.investmentAnalysis.recommendation === 'PROCEED_WITH_CAUTION' 
                      ? 'text-yellow-600' 
                      : comprehensiveData.investmentAnalysis.recommendation === 'STRONG_BUY'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {comprehensiveData.investmentAnalysis.recommendation.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              {comprehensiveData.investmentAnalysis.recommendation_details && (
                <p className="text-sm text-gray-700">
                  {comprehensiveData.investmentAnalysis.recommendation_details}
                </p>
              )}
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Concerns */}
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-3 flex items-center">
                    <FiAlertTriangle className="w-4 h-4 mr-2" />
                    Primary Concerns
                  </h4>
                  <div className="space-y-2">
                    {comprehensiveData.investmentAnalysis.primary_concerns.map((concern, index) => (
                      <div key={index} className="flex items-start space-x-3 py-2 px-3 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-3 flex items-center">
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Investment Strengths
                  </h4>
                  <div className="space-y-2">
                    {comprehensiveData.investmentAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3 py-2 px-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Intelligence */}
            {comprehensiveData.locationIntelligence && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 text-blue-500 mr-2" />
                  Location Intelligence
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center py-3">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {comprehensiveData.locationIntelligence.walkability_score}
                    </div>
                    <p className="text-xs text-gray-500">Walkability Score</p>
                  </div>
                  <div className="text-center py-3">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {comprehensiveData.locationIntelligence.school_rating}<span className="text-lg text-gray-400">/10</span>
                    </div>
                    <p className="text-xs text-gray-500">School Rating</p>
                  </div>
                  <div className="text-center py-3">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {comprehensiveData.locationIntelligence.transit_score}
                    </div>
                    <p className="text-xs text-gray-500">Transit Score</p>
                  </div>
                  <div className="text-center py-3">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {comprehensiveData.locationIntelligence.hospital_distance}<span className="text-sm text-gray-400"> mi</span>
                    </div>
                    <p className="text-xs text-gray-500">To Hospital</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default PropertyIntelligencePanel;
