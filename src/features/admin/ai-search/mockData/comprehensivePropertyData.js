// Mock data structure for testing comprehensive property intelligence UI
// Based on the backend data structure provided

export const mockComprehensivePropertyData = {
  // Basic property info
  property: {
    address: "1234 Oak Street, Austin, TX 78704",
    apn: "025613140001",
    clipId: "CL12345678901",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1748,
    totalSqft: 1988,
    yearBuilt: 1980,
    stories: 2,
    propertyType: "Single Family Residential",
    condition: "Average",
    price: 425000,
    coordinates: {
      latitude: 30.2431,
      longitude: -97.7431
    }
  },

  // Climate Risk Intelligence (Spatial API)
  climateRisk: {
    overall_score: 7.2,
    flood_risk: {
      score: 8.5,
      zone: "AE",
      base_flood_elevation: 542.3,
      risk_level: "HIGH"
    },
    wildfire_risk: {
      score: 3.1,
      distance_to_wildland: 2.8,
      risk_level: "LOW"
    },
    earthquake_risk: {
      score: 2.4,
      peak_ground_acceleration: 0.12,
      risk_level: "LOW"
    },
    hurricane_wind_risk: {
      score: 6.8,
      design_wind_speed: 120,
      risk_level: "MODERATE"
    }
  },

  // Crime and Safety Data
  crimeStatistics: {
    overall_crime_index: 4.2,
    violent_crime_rate: 2.1,
    property_crime_rate: 6.3,
    distance_to_police: 0.8,
    neighborhood_safety_score: 6.5
  },

  // Location Intelligence
  locationIntelligence: {
    fire_station_distance: 1.2,
    hospital_distance: 3.4,
    school_rating: 8.5,
    walkability_score: 72,
    transit_score: 45
  },

  // Building Intelligence (Interchange API)
  buildingCharacteristics: {
    total_living_area: 2145,
    stories: 2,
    bedrooms: 3,
    bathrooms: 2.5,
    garage_spaces: 2,
    foundation_type: "SLAB_ON_GRADE",
    exterior_walls: "BRICK_VENEER",
    roof_material: "ASPHALT_SHINGLE",
    roof_shape: "GABLE",
    hvac_type: "CENTRAL_AIR_GAS_HEAT",
    quality_class: "GOOD",
    condition: "AVERAGE"
  },

  // Reconstruction Cost Analysis
  reconstructionCost: {
    total_cost: 387450,
    cost_per_sqft: 180.65,
    confidence_score: 0.92,
    components: {
      foundation: 23500,
      framing: 89200,
      exterior_finish: 45600,
      roofing: 18900,
      electrical: 22400,
      plumbing: 19800,
      hvac: 28500,
      interior_finish: 139550
    }
  },

  // AI-Powered Roof Analysis
  roofAnalysis: {
    condition_score: 6.8,
    condition_grade: "FAIR",
    estimated_age: 12,
    replacement_needed: "5-7 years",
    defects_detected: [
      {
        type: "GRANULE_LOSS",
        severity: "MODERATE",
        coverage_percentage: 15
      },
      {
        type: "MINOR_CRACKING",
        severity: "LOW",
        coverage_percentage: 5
      }
    ],
    weather_damage: {
      hail_damage_detected: false,
      wind_damage_detected: true,
      damage_severity: "MINOR"
    }
  },

  // Weather Event History
  weatherEvents: [
    {
      date: "2023-05-15",
      event_type: "HAIL",
      max_hail_size: 1.25,
      wind_speed: 65,
      damage_potential: "MODERATE"
    },
    {
      date: "2022-08-20",
      event_type: "HIGH_WIND",
      wind_speed: 85,
      damage_potential: "HIGH"
    }
  ],

  // Tax Information
  taxData: {
    tax_year: 2024,
    assessed_value: 285000,
    market_value: 425000,
    annual_tax_amount: 8550,
    effective_tax_rate: 2.01,
    tax_status: "CURRENT",
    last_payment_date: "2024-01-15",
    exemptions: ["HOMESTEAD"],
    special_assessments: []
  },

  // Tax History
  taxHistory: [
    { year: 2024, assessed_value: 285000, tax_amount: 8550 },
    { year: 2023, assessed_value: 265000, tax_amount: 7950 },
    { year: 2022, assessed_value: 245000, tax_amount: 7350 },
    { year: 2021, assessed_value: 225000, tax_amount: 6750 }
  ],

  // Storm Verification
  stormVerification: {
    address_impacted: true,
    verification_events: [
      {
        date: "2023-05-15",
        event_id: "TX_HAIL_20230515_001",
        verified: true,
        max_hail_size: 1.25,
        wind_gust: 68,
        confidence: 0.94
      }
    ]
  },

  // Ownership Information
  ownership: {
    current_owner: "JOHNSON, ROBERT & MARIA",
    vesting: "JOINT_TENANTS",
    acquisition_date: "2019-03-15",
    acquisition_price: 325000,
    deed_type: "WARRANTY_DEED",
    mortgage_info: {
      lender: "WELLS FARGO BANK",
      loan_amount: 260000,
      loan_date: "2019-03-15",
      loan_type: "CONVENTIONAL"
    }
  },

  // Parcel Information
  parcelData: {
    parcel_area: 0.25,
    parcel_dimensions: "100x109 feet",
    zoning: "SF-3",
    land_use: "SINGLE_FAMILY_RESIDENTIAL",
    census_tract: "48453001702",
    school_district: "Austin ISD"
  },

  // Weather Impact Assessment
  weatherImpact: {
    annual_weather_risk_score: 6.7,
    seasonal_risks: {
      spring: "HIGH_STORM_SEASON",
      summer: "MODERATE_HEAT",
      fall: "LOW_RISK",
      winter: "FREEZE_POTENTIAL"
    },
    portfolio_correlation: 0.73
  },

  // Investment Analysis Summary
  investmentAnalysis: {
    overall_risk_score: 6.8,
    primary_concerns: ["Flood risk", "Aging roof", "Storm exposure"],
    strengths: ["Low earthquake/wildfire risk", "Good school district"],
    estimated_property_value: 425000,
    reconstruction_cost: 387450,
    recommendation: "PROCEED_WITH_CAUTION",
    recommendation_details: "Property shows moderate investment potential but requires attention to flood risk mitigation and roof maintenance planning."
  }
};

// Helper function to simulate API delay for testing
export const simulateApiDelay = (ms = 1500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Function to get mock data with simulated loading
export const getMockComprehensiveData = async (address) => {
  await simulateApiDelay(2000); // Simulate 2 second API call
  return mockComprehensivePropertyData;
};
