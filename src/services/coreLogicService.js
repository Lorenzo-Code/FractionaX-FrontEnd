import { smartFetch } from '../shared/utils';

/**
 * CoreLogic Data Service
 * Handles API calls to CoreLogic with proper limit checking
 */
class CoreLogicService {
  constructor() {
    this.baseUrl = '/api/corelogic';
  }

  /**
   * Fetch enhanced property data from CoreLogic
   * @param {string} propertyId - Property ID
   * @param {Object} insightsContext - CoreLogic insights context from hook
   * @returns {Object} Enhanced property data or error
   */
  async fetchPropertyInsights(propertyId, insightsContext) {
    const { canViewInsight, viewInsight, isUnlimited } = insightsContext;

    try {
      // Check if user can view insight
      if (!canViewInsight()) {
        return {
          success: false,
          error: 'LIMIT_REACHED',
          message: 'CoreLogic insight limit reached. Please upgrade to continue.',
          requiresAuth: true
        };
      }

      // Record the insight view (this will increment counter for free users)
      const allowed = viewInsight();
      if (!allowed) {
        return {
          success: false,
          error: 'LIMIT_REACHED',
          message: 'CoreLogic insight limit reached. Please upgrade to continue.',
          requiresAuth: true
        };
      }

      // Make API call to fetch CoreLogic data
      const response = await smartFetch(`${this.baseUrl}/property/${propertyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`CoreLogic API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          ...data,
          isEnhanced: true,
          dataSource: 'corelogic',
          fetchedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('CoreLogic service error:', error);
      
      // Return fallback data structure
      return {
        success: false,
        error: 'API_ERROR',
        message: error.message || 'Failed to fetch CoreLogic data',
        fallbackData: this.getMockCoreLogicData(propertyId)
      };
    }
  }

  /**
   * Get mock CoreLogic data for development/fallback
   * @param {string} propertyId - Property ID
   * @returns {Object} Mock enhanced data
   */
  getMockCoreLogicData(propertyId) {
    return {
      propertyId,
      isEnhanced: true,
      dataSource: 'corelogic',
      fetchedAt: new Date().toISOString(),
      
      // Market Analysis
      marketAnalysis: {
        medianPrice: '$485,000',
        priceChange: '+8.2%',
        daysOnMarket: '23 days',
        inventoryLevel: 'Low',
        demandScore: '8.5/10',
        marketTrend: 'Rising',
        competitiveIndex: 'High'
      },

      // Comparable Sales
      comparableSales: {
        recentSales: 12,
        avgSalePrice: '$467,500',
        priceRange: '$420K - $515K',
        avgDaysOnMarket: '18 days',
        salesTrend: 'Increasing',
        lastSale: {
          address: '456 Nearby St',
          price: '$475,000',
          date: '2024-01-10',
          sqft: 1150
        }
      },

      // Property History
      propertyHistory: {
        lastSold: '2019 - $395,000',
        previousOwners: '3 previous owners',
        renovations: 'Kitchen (2020), Roof (2021)',
        propertyTax: '$6,750/year',
        taxHistory: [
          { year: 2023, amount: 6750 },
          { year: 2022, amount: 6500 },
          { year: 2021, amount: 6200 }
        ],
        ownershipHistory: [
          { year: 2019, owner: 'Smith Family Trust', salePrice: 395000 },
          { year: 2015, owner: 'Johnson, Michael', salePrice: 325000 }
        ]
      },

      // Neighborhood Insights
      neighborhoodInsights: {
        avgIncome: '$78,500',
        crimeRate: 'Below Average',
        schoolRating: '8.5/10',
        walkScore: '72/100',
        demographics: 'Family-oriented',
        growthRate: '+12.3%',
        amenities: ['Parks', 'Shopping', 'Public Transit'],
        futureProjects: ['New Metro Line (2025)', 'Park Expansion (2024)']
      },

      // Investment Analysis
      investmentAnalysis: {
        estimatedRent: '$2,800/month',
        capRate: '6.8%',
        cashFlow: '+$450/month',
        appreciation: '5.2%/year',
        roiProjection: '12.5%',
        riskScore: 'Low',
        vacancyRate: '3.2%',
        rentalDemand: 'High'
      },

      // Additional Data
      buildingDetails: {
        construction: 'Steel Frame',
        foundation: 'Concrete Slab',
        roofMaterial: 'Composite Shingle',
        hvacSystem: 'Central Air/Heat',
        insulationRating: 'R-15',
        energyEfficiency: 'B+'
      },

      // Environmental Data
      environmentalFactors: {
        floodZone: 'X (Minimal Risk)',
        earthquakeRisk: 'Very Low',
        airQuality: 'Good',
        noiseLevel: 'Moderate',
        nearbyHazards: 'None Identified'
      }
    };
  }

  /**
   * Check if enhanced data is available (mock implementation)
   * @param {string} propertyId - Property ID
   * @returns {boolean} Whether enhanced data is available
   */
  async isEnhancedDataAvailable(propertyId) {
    try {
      const response = await smartFetch(`${this.baseUrl}/availability/${propertyId}`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.available === true;
      }
      
      // Assume available for development
      return true;
    } catch (error) {
      console.warn('Failed to check CoreLogic availability:', error);
      return true; // Default to available
    }
  }
}

// Create singleton instance
const coreLogicService = new CoreLogicService();

export default coreLogicService;
