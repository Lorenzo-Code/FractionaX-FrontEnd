import { smartFetch } from '../../../shared/utils';

/**
 * Marketplace Service - Handles API calls for marketplace data
 */
class MarketplaceService {
  constructor() {
    this.suggestedDealsUrl = '/api/suggested';
    this.zillowListingsUrl = '/api/marketplace/listings';
  }

  /**
   * Fetch AI-suggested/discovered property listings from SuggestedDeal model
   * @returns {Promise<Array>} Array of suggested property deals
   */
  async fetchSuggestedListings() {
    try {
      console.log('🤖 Fetching AI-suggested listings...');
      
      const response = await smartFetch(this.suggestedDealsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch suggested listings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.deals) {
        throw new Error('Invalid response format from suggested listings API');
      }

      console.log(`✅ Successfully fetched ${data.deals.length} AI-suggested listings`);
      
      return data.deals;
    } catch (error) {
      console.error('❌ Error fetching AI-suggested listings:', error);
      throw error;
    }
  }

  /**
   * Fetch AI-powered marketplace listings via dedicated backend API
   * @param {Object} criteria - Search criteria for AI analysis
   * @returns {Promise<Object>} AI-generated marketplace listings with metadata
   */
  async fetchAIMarketplaceListings(criteria = {}) {
    try {
      console.log('🤖🏠 Calling dedicated AI marketplace endpoint...');
      
      // Build investment-focused query
      const aiQuery = this.buildInvestmentQuery(criteria);
      
      const requestBody = {
        query: aiQuery,
        location: criteria.location || 'Houston, TX',
        maxPrice: criteria.maxPrice || 800000,
        minPrice: criteria.minPrice || 100000,
        limit: criteria.limit || 25,
        analysis_type: 'investment_focus'
      };

      console.log('📤 AI Marketplace Request:', requestBody);
      
      const response = await smartFetch('/api/ai/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.error || response.statusText;
        throw new Error(`AI Marketplace API Error (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      console.log('🎯 AI Marketplace Response:', data);

      if (!data.success) {
        throw new Error(data.message || 'AI marketplace request failed');
      }

      const listings = data.listings || [];
      const summary = data.ai_summary || '';
      const metadata = data.metadata || {};
      
      // Validate that all listings have real images
      const listingsWithRealImages = listings.filter(listing => {
        const hasRealImages = this.ensureRealImages(listing).length > 0;
        if (!hasRealImages) {
          console.warn(`🚫 Filtering out AI listing '${listing.title || listing.address}' - no real Zillow images`);
        }
        return hasRealImages;
      });
      
      console.log(`📸 ${listingsWithRealImages.length}/${listings.length} AI properties have real Zillow images`);
      
      console.log(`✅ AI Marketplace: Successfully retrieved ${listings.length} investment properties`);
      console.log(`📊 Processing time: ${metadata.processing_time}ms`);
      console.log(`🎯 Data source: ${metadata.source}`);
      
      return {
        listings: listingsWithRealImages, // Only return properties with real images
        summary,
        metadata: {
          ...metadata,
          generated_at: new Date().toISOString(),
          frontend_processed_at: Date.now(),
          filtered_for_real_images: true,
          original_count: listings.length,
          filtered_count: listingsWithRealImages.length
        }
      };
    } catch (error) {
      console.error('❌ Error fetching AI marketplace listings:', error);
      throw error;
    }
  }

  /**
   * Build SimplyRETS query parameters for MLS property search
   * @param {Object} criteria - Search criteria
   * @returns {Object} SimplyRETS-compatible query parameters
   */
  buildSimplyRETSQuery(criteria = {}) {
    const {
      location = 'Houston, TX',
      maxPrice = 800000,
      minPrice = 100000,
      propertyTypes = ['RES', 'CON'], // SimplyRETS property types
      targetROI = 8,
      limit = 25
    } = criteria;

    // Extract city and state from location
    const locationParts = location.split(',').map(part => part.trim());
    const city = locationParts[0] || 'Houston';
    const state = locationParts[1] || 'TX';

    // Build SimplyRETS query parameters
    const simplyRETSQuery = {
      q: city, // City search
      state: state,
      minprice: minPrice,
      maxprice: maxPrice,
      type: propertyTypes.join(','), // Property types
      limit: limit,
      offset: 0,
      sort: '-listdate', // Sort by newest listings first
      // Add additional filters for investment properties
      status: 'Active',
      include: 'photos,schools,neighborhood' // Include additional data
    };

    return simplyRETSQuery;
  }

  /**
   * Build AI query optimized for investment property discovery (LEGACY - kept for fallback)
   * @param {Object} criteria - Search criteria
   * @returns {string} AI-optimized query string
   */
  buildInvestmentQuery(criteria = {}) {
    const {
      location = 'Houston, TX',
      maxPrice = 800000,
      minPrice = 100000,
      propertyTypes = ['house', 'condo', 'townhouse'],
      targetROI = 8,
      includeRentals = true
    } = criteria;

    const baseQuery = `Find high-potential investment properties in ${location} area`;
    const priceRange = `between $${minPrice.toLocaleString()} and $${maxPrice.toLocaleString()}`;
    
    const investmentCriteria = [
      'strong rental potential',
      'good appreciation prospects',
      'suitable for fractionalization',
      `target ROI above ${targetROI}%`,
      'stable neighborhoods',
      'good condition or renovation potential'
    ];
    
    const propertyTypeText = propertyTypes.length > 1 
      ? `${propertyTypes.slice(0, -1).join(', ')} or ${propertyTypes[propertyTypes.length - 1]} properties`
      : `${propertyTypes[0]} properties`;

    const fullQuery = [
      baseQuery,
      priceRange,
      `Focus on ${propertyTypeText}`,
      `Analyze for: ${investmentCriteria.join(', ')}`,
      includeRentals ? 'Include rental income analysis' : '',
      'Prioritize properties with strong investment fundamentals and tokenization potential'
    ].filter(Boolean).join('. ');

    return fullQuery;
  }

  /**
   * Fetch real Zillow property listings for marketplace (DEPRECATED - use AI LoopNet instead)
   * @param {Object} searchParams - Optional search parameters
   * @returns {Promise<Array>} Array of real Zillow property listings
   */
  async fetchZillowListings(searchParams = {}) {
    try {
      console.log('🏠 Fetching real Zillow listings for marketplace...');
      
      // Build query parameters
      const params = new URLSearchParams(searchParams);
      const url = params.toString() ? 
        `${this.zillowListingsUrl}?${params.toString()}` : 
        this.zillowListingsUrl;
      
      const response = await smartFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Zillow listings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.listings) {
        throw new Error('Invalid response format from Zillow listings API');
      }

      console.log(`✅ Successfully fetched ${data.listings.length} real Zillow listings`);
      
      return data.listings;
    } catch (error) {
      console.error('❌ Error fetching Zillow listings:', error);
      throw error;
    }
  }

  /**
   * Create a new suggested deal (admin only)
   * @param {Object} dealData - Deal data to create
   * @returns {Promise<Object>} Created deal object
   */
  async createSuggestedDeal(dealData) {
    try {
      console.log('💼 Creating new suggested deal...');
      
      const response = await smartFetch(this.suggestedDealsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create suggested deal: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.deal) {
        throw new Error('Invalid response format from create deal API');
      }

      console.log('✅ Successfully created suggested deal:', data.deal.id);
      
      return data.deal;
    } catch (error) {
      console.error('❌ Error creating suggested deal:', error);
      throw error;
    }
  }

  /**
   * Transform SuggestedDeal model data to frontend property format
   * @param {Object} suggestedDeal - Raw suggested deal from backend
   * @returns {Object} Transformed property object
   */
  transformSuggestedDealToProperty(suggestedDeal) {
    try {
      const {
        _id,
        title,
        address1,
        city,
        state,
        postalcode,
        lat,
        lng,
        structure = {},
        valuation = {},
        targetPrice,
        fractionable,
        dealStatus,
        imageUrl,
        source,
        tags = [],
        createdAt
      } = suggestedDeal;

      // Create address string
      const fullAddress = [address1, city, state, postalcode]
        .filter(Boolean)
        .join(', ');

      // Calculate some estimated values based on the property data
      const estimatedROI = this.calculateEstimatedROI(valuation, targetPrice);
      const estimatedRent = this.estimateMonthlyRent(targetPrice, structure);

      // Transform to frontend property format
      const transformedProperty = {
        id: _id,
        title: title || 'AI-Discovered Property',
        address: fullAddress || address1 || 'Location not specified',
        price: targetPrice || valuation.avm || valuation.rangeHigh || 0,
        rentPrice: estimatedRent,
        beds: structure.beds || 0,
        baths: structure.baths || 0,
        sqft: structure.sqft || 0,
        propertyType: structure.propertyType || 'house',
        listingType: 'ai-discovered', // Special type for AI-discovered properties
        images: this.ensureRealImages(suggestedDeal),
        description: `AI-discovered property with strong investment potential. ${dealStatus === 'approved' ? 'Approved for review.' : 'Under analysis.'}`,
        detailedDescription: `This property was identified by our AI system as having excellent potential for fractionalization. Located at ${fullAddress}, it offers promising investment characteristics based on market analysis.`,
        features: this.generateFeaturesFromTags(tags),
        yearBuilt: structure.yearBuilt || 2000,
        lotSize: 0, // Not available in SuggestedDeal model
        coordinates: lat && lng ? { lat, lng } : { lat: 29.7604, lng: -95.3698 }, // Default to Houston
        tokenized: fractionable || false,
        tokenPrice: fractionable ? Math.floor(targetPrice / 1000) : 0, // Estimate token price
        totalTokens: fractionable ? 1000 : 0, // Default tokenization
        availableTokens: fractionable ? 1000 : 0, // All available initially
        expectedROI: estimatedROI,
        monthlyRent: estimatedRent,
        hoa: 0, // Not available in model
        taxes: this.estimatePropertyTaxes(targetPrice),
        insurance: this.estimateInsurance(targetPrice),
        listingDate: createdAt || new Date().toISOString(),
        status: dealStatus === 'approved' ? 'active' : 'pending',
        agent: {
          name: 'FractionaX AI',
          phone: '(713) 555-AI00',
          email: 'ai-discoveries@fractionax.io',
          company: 'FractionaX Intelligence',
          photo: '/api/placeholder/100/100',
          license: 'AI-DISCOVERY'
        },
        stats: {
          views: Math.floor(Math.random() * 100) + 10, // Simulated views
          saves: Math.floor(Math.random() * 20) + 1,   // Simulated saves
          daysOnMarket: Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) || 1
        },
        neighborhood: {
          name: city || 'Unknown Area',
          walkability: Math.floor(Math.random() * 40) + 40, // Random walkability
          transitScore: Math.floor(Math.random() * 30) + 30,
          bikeScore: Math.floor(Math.random() * 30) + 30
        },
        schools: [], // Not available in current model
        source: source || 'ai-discovery',
        aiGenerated: true, // Flag to indicate this is AI-generated
        dealStatus,
        originalData: suggestedDeal // Keep reference to original data
      };

      return transformedProperty;
    } catch (error) {
      console.error('❌ Error transforming suggested deal:', error);
      // Return a minimal property object as fallback
      return {
        id: suggestedDeal._id || `fallback-${Date.now()}`,
        title: suggestedDeal.title || 'Property Details Unavailable',
        address: suggestedDeal.address1 || 'Location not specified',
        price: suggestedDeal.targetPrice || 0,
        images: this.ensureRealImages(suggestedDeal, true),
        beds: 0,
        baths: 0,
        sqft: 0,
        propertyType: 'house',
        listingType: 'ai-discovered',
        tokenized: false,
        expectedROI: 0,
        stats: { views: 0, saves: 0, daysOnMarket: 1 },
        error: true
      };
    }
  }

  /**
   * Calculate estimated ROI based on property valuation and target price
   */
  calculateEstimatedROI(valuation, targetPrice) {
    try {
      if (!valuation || !targetPrice) return 8.5; // Default ROI

      const { avm, rangeLow, rangeHigh } = valuation;
      const marketValue = avm || ((rangeLow + rangeHigh) / 2) || targetPrice;
      
      if (marketValue > targetPrice) {
        // Property is undervalued, potentially good ROI
        const discount = ((marketValue - targetPrice) / marketValue) * 100;
        return Math.min(15, 8 + discount); // Cap at 15%
      }
      
      return 8.5; // Default conservative ROI
    } catch (error) {
      return 8.5;
    }
  }

  /**
   * Estimate monthly rent based on property price and characteristics
   */
  estimateMonthlyRent(price, structure = {}) {
    try {
      if (!price) return 0;

      // Basic rent estimation: 1% rule (monthly rent = 1% of property value)
      let baseRent = price * 0.01;

      // Adjust based on property size
      if (structure.sqft) {
        const pricePerSqft = price / structure.sqft;
        if (pricePerSqft > 150) baseRent *= 1.2; // Higher quality area
        if (pricePerSqft < 80) baseRent *= 0.9;  // Lower cost area
      }

      // Adjust based on bedrooms
      if (structure.beds) {
        if (structure.beds >= 4) baseRent *= 1.15;
        if (structure.beds <= 1) baseRent *= 0.85;
      }

      return Math.round(baseRent);
    } catch (error) {
      return Math.round(price * 0.008); // Fallback to 0.8% rule
    }
  }

  /**
   * Generate property features from tags array
   */
  generateFeaturesFromTags(tags = []) {
    const defaultFeatures = ['potential', 'investment', 'ai_selected'];
    
    // Map common tags to features
    const tagMap = {
      'fixer-upper': 'renovation_potential',
      'investment': 'investment_property',
      'rental': 'rental_income',
      'commercial': 'commercial_potential',
      'residential': 'residential',
      'multifamily': 'multi_unit'
    };

    const mappedFeatures = tags.map(tag => tagMap[tag.toLowerCase()] || tag.toLowerCase());
    
    return [...defaultFeatures, ...mappedFeatures].slice(0, 8); // Limit to 8 features
  }

  /**
   * Estimate property taxes (rough estimate)
   */
  estimatePropertyTaxes(price) {
    if (!price) return 0;
    // Rough estimate: 1.2% of property value annually
    return Math.round(price * 0.012);
  }

  /**
   * Estimate insurance costs (rough estimate)
   */
  estimateInsurance(price) {
    if (!price) return 0;
    // Rough estimate: 0.3% of property value annually
    return Math.round(price * 0.003);
  }

  /**
   * Ensure real images from MLS/SimplyRETS are used, no placeholders allowed
   * @param {Object} property - Property data from API
   * @param {boolean} isError - Whether this is an error fallback
   * @returns {Array} Array of real image URLs
   */
  ensureRealImages(property, isError = false) {
    // If this is an error case, return empty array to avoid showing placeholder
    if (isError) {
      console.warn('⚠️ Property has incomplete data, no images will be shown');
      return [];
    }

    // Try multiple possible image fields from different API sources (MLS/SimplyRETS/Zillow)
    const possibleImageFields = [
      property.imageUrl,
      property.images,
      property.photos,
      property.image_url,
      property.photo_urls,
      property.mls_photos, // SimplyRETS MLS photos
      property.listing_photos, // Alternative MLS field
      property.zillow_photos, // Legacy Zillow support
      property.property_photos
    ];

    for (const imageField of possibleImageFields) {
      if (imageField) {
        // If it's an array of images
        if (Array.isArray(imageField)) {
          const realImages = imageField.filter(img => 
            img && 
            typeof img === 'string' && 
            !img.includes('/api/placeholder') &&
            !img.includes('placeholder') &&
            (img.startsWith('http') || img.startsWith('https'))
          );
          if (realImages.length > 0) {
            console.log(`✅ Found ${realImages.length} real MLS/property images`);
            return realImages;
          }
        }
        // If it's a single image URL
        else if (typeof imageField === 'string' && 
                 !imageField.includes('/api/placeholder') &&
                 !imageField.includes('placeholder') &&
                 (imageField.startsWith('http') || imageField.startsWith('https'))) {
          console.log('✅ Found 1 real MLS/property image');
          return [imageField];
        }
      }
    }

    // Log warning if no real images found
    console.warn('⚠️ No real MLS/property images found for property:', property.title || property._id);
    console.warn('Available image fields:', possibleImageFields.filter(Boolean));
    
    // Return empty array - frontend will handle missing images gracefully
    return [];
  }

  /**
   * Transform array of suggested deals to frontend properties format
   * @param {Array} suggestedDeals - Array of suggested deals from backend
   * @returns {Array} Array of transformed property objects
   */
  transformSuggestedDealsToProperties(suggestedDeals = []) {
    if (!Array.isArray(suggestedDeals)) {
      console.warn('⚠️ Expected array of suggested deals, got:', typeof suggestedDeals);
      return [];
    }

    return suggestedDeals.map(deal => this.transformSuggestedDealToProperty(deal)).filter(property => {
      // Filter out properties without real images
      if (!property.images || property.images.length === 0) {
        console.log(`🚫 Filtering out property '${property.title}' - no real images available`);
        return false;
      }
      return true;
    });
  }
}

// Create and export singleton instance
const marketplaceService = new MarketplaceService();
export default marketplaceService;

// Also export the class for testing purposes
export { MarketplaceService };
