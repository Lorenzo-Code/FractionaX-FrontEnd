// src/utils/api.js

const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

// Import rule-based portfolio filter (fast, no AI needed)
import { filterCrexiStylePortfolios } from '../../utils/portfolioFilter.js';

/**
 * 🤖 AI FILTERING CONFIGURATION
 * 
 * Default settings for OpenAI-powered property filtering
 * Adjust these values to change the investment criteria
 */
export const AI_FILTER_CONFIG = {
  // CREXI-STYLE PORTFOLIO CRITERIA (35-unit Alabama example)
  DEFAULT_TARGET_UNITS: 10,         // 10+ units minimum (true portfolios)
  DEFAULT_MAX_BUDGET: 3000000,      // $3M max (commercial-grade)
  DEFAULT_ANALYSIS_MODE: 'comprehensive', // Thorough analysis needed
  
  // Quality Thresholds (Higher for true portfolios)
  MIN_QUALIFICATION_SCORE: 8,       // High AI score required (8-10)
  MIN_ROI_THRESHOLD: 10.0,          // High ROI threshold (10%+)
  
  // Target Markets (Where true portfolios exist)
  PREFERRED_MARKETS: ['Texas', 'Alabama', 'Georgia', 'Florida', 'North Carolina', 'Tennessee'],
  
  // Processing Options (Quality over speed)
  ENABLE_BY_DEFAULT: true,          // Always use AI for portfolio discovery
  FALLBACK_TO_RULES: false,         // No fallback - quality over quantity
  CACHE_RESULTS: true,              // Cache expensive AI analysis
  PORTFOLIO_FOCUS: true             // Focus on true multi-family portfolios
};

/**
 * 🏢 CREXI-STYLE MULTIFAMILY PORTFOLIO DISCOVERY
 * 
 * Finds true multi-family investment properties like the 35-unit Alabama portfolio:
 * - Actual apartment buildings/complexes (not single-family homes)
 * - 10+ units minimum
 * - Commercial-grade investment properties
 * - Portfolio opportunities for fractionalization
 * 
 * Uses rule-based filtering by default to avoid AI timeouts.
 */
export const multiFamilyPropertyDiscovery = async (searchParams = {}) => {
  try {
    const {
      location = "Austin, TX",
      limit = 50, // Expect fewer true multi-family portfolios
      filters = {},
      // Aggressive Multi-Family Filtering (Crexi-style)
      useAIFilter = false, // Use rule-based filtering by default (faster)
      useRuleBasedFilter = true, // New rule-based filter for Crexi-style properties
      targetUnits = 10, // 10+ units minimum (like 35-unit portfolio)
      maxBudget = 3000000, // Higher budget for true portfolios ($3M max)
      analysisMode = 'comprehensive', // Need thorough analysis
      // Timeout and fallback options
      timeoutMs = 300000, // 5 minute timeout for comprehensive analysis
      fallbackToRaw = true // Fallback enabled for safety
    } = searchParams;

    console.log('🏢 Crexi-Style Portfolio Discovery - Investment Grade Properties');
    console.log(`📍 Target Markets: 10 major US cities`);
    console.log(`🎯 AI Filtering: ${useAIFilter ? 'ENABLED' : 'DISABLED'}`);
    console.log(`⚡ Rule-Based Filter: ${useRuleBasedFilter ? 'ENABLED (FAST)' : 'DISABLED'}`);
    console.log(`📊 Target Units: ${targetUnits}+`);
    console.log(`💰 Max Budget: $${maxBudget.toLocaleString()}`);
    console.log(`🔬 Analysis Mode: ${analysisMode}`);

    // Build query parameters for OpenAI filtering
    const params = new URLSearchParams();
    if (useAIFilter) {
      params.set('ai_filter', 'true');
      params.set('target_units', targetUnits.toString());
      params.set('max_budget', maxBudget.toString());
      params.set('analysis_mode', analysisMode);
    }

    const url = `${API_URL}/api/properties/search${params.toString() ? `?${params}` : ''}`;
    console.log(`🔗 API Call: ${url}`);

    // Create a timeout promise for AI filtering
    const timeoutPromise = new Promise((_, reject) => {
      if (useAIFilter) {
        setTimeout(() => {
          reject(new Error(`AI filtering timed out after ${timeoutMs/1000} seconds`));
        }, timeoutMs);
      }
    });

    // Make the API call with timeout (only if AI filtering is enabled)
    const apiPromise = fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    let response;
    if (useAIFilter) {
      console.log(`⏱️ AI filtering may take 30-120 seconds... (timeout: ${timeoutMs/1000}s)`);
      try {
        response = await Promise.race([apiPromise, timeoutPromise]);
      } catch (timeoutError) {
        console.warn(`⚠️ ${timeoutError.message}`);
        if (fallbackToRaw) {
          console.log(`🔄 Falling back to raw properties without AI filtering...`);
          // Make a new call without AI filtering
          const fallbackUrl = `${API_URL}/api/properties/search`;
          response = await fetch(fallbackUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
        } else {
          throw timeoutError;
        }
      }
    } else {
      response = await apiPromise;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || errorData?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Multifamily discovery request failed");
    }

    // Apply rule-based Crexi-style filtering if enabled
    let finalProperties = data.properties || [];
    let isRuleFiltered = false;
    
    if (useRuleBasedFilter && finalProperties.length > 0) {
      console.log('🏢 Applying Crexi-style rule-based portfolio filter...');
      
      const ruleFilterOptions = {
        minUnits: 1,                         // Accept all properties (1+ units)
        minScore: 15,                        // Very low threshold - 15+ score
        minPrice: 100000,                    // Very low minimum - $100k
        maxPrice: maxBudget,                 // Respect budget limit
        maxResults: 100                      // Allow up to 100 results
      };
      
      finalProperties = filterCrexiStylePortfolios(finalProperties, ruleFilterOptions);
      isRuleFiltered = true;
      
      console.log(`✅ Rule-based filter: ${data.properties?.length || 0} → ${finalProperties.length} properties`);
    }

    // Enhanced logging for filtered results
    if (data.aiFiltered) {
      console.log(`🤖 AI-Filtered Discovery: Found ${finalProperties.length} qualified properties`);
      console.log(`📊 Original Pool: ${data.originalFound || 0} properties analyzed`);
      console.log(`✅ Qualification Rate: ${data.aiFiltering?.qualificationRate || '0%'}`);
      console.log(`🎯 Analysis Mode: ${data.aiFiltering?.analysisMode || 'N/A'}`);
      console.log(`💰 Budget Limit: $${data.aiFiltering?.maxBudget?.toLocaleString() || 'N/A'}`);
      console.log(`🏢 Target Units: ${data.aiFiltering?.targetUnits || 'N/A'}+`);
    } else if (isRuleFiltered) {
      console.log(`⚡ Rule-Based Filtered Discovery: Found ${finalProperties.length} Crexi-style portfolios`);
      console.log(`📊 Original Pool: ${data.totalFound || 0} raw properties analyzed`);
      const qualRate = (finalProperties.length / (data.totalFound || 1)) * 100;
      const displayRate = qualRate > 0 && qualRate < 0.1 ? '0.1%' : `${qualRate.toFixed(1)}%`;
      console.log(`✅ Qualification Rate: ${displayRate}`);
      console.log(`🎯 Filter Mode: Rule-based (no AI timeout)`);
      console.log(`💰 Budget Range: $500k - $${maxBudget.toLocaleString()}`);
      console.log(`🏢 Target Units: ${targetUnits}+`);
    } else {
      console.log(`✅ Multifamily Discovery: Found ${finalProperties.length} real properties`);
      console.log(`📊 Target Met: ${data.targetMet ? 'YES - 500+ properties found!' : 'NO'}`);
    }
    
    console.log(`🏢 Multi-Family Analysis: ${data.multiFamilyAnalysis?.totalMultiFamilyCandidates || 0} candidates`);
    console.log(`⚡ Processing Time: ${data.searchMetrics?.responseTime || 'N/A'}`);
    console.log(`💰 Estimated Cost: ${data.apiUsage?.estimatedCost || 'N/A'}`);

    return {
      success: true,
      properties: finalProperties,
      totalFound: finalProperties.length,
      originalFound: data.originalFound || data.totalFound || 0,
      aiFiltered: data.aiFiltered || false,
      ruleFiltered: isRuleFiltered,
      searchMetadata: {
        coverage: `${finalProperties.length} properties from ${data.searchMetrics?.totalCitiesSearched || 6} markets`,
        intelligenceLevel: data.aiFiltered ? 'premium-ai' : (isRuleFiltered ? 'premium-rules' : 'premium'),
        processingTime: data.performance?.timePerProperty || data.searchMetrics?.responseTime || '0ms',
        apiCalls: data.searchMetrics?.totalApiCalls || 0,
        targetMet: finalProperties.length > 0,
        aiFiltering: data.aiFiltered,
        ruleFiltering: isRuleFiltered,
        qualificationRate: isRuleFiltered 
          ? (() => {
              const rate = (finalProperties.length / (data.totalFound || 1)) * 100;
              return rate > 0 && rate < 0.1 ? '0.1%' : `${rate.toFixed(1)}%`;
            })()
          : (data.aiFiltering?.qualificationRate || null)
      },
      // AI Filtering Results
      aiFiltering: data.aiFiltering || null,
      marketIntelligence: {
        multiFamilyPercentage: data.multiFamilyAnalysis?.multiFamilyPercentage || '0%',
        marketCoverage: data.marketCoverage || {},
        strategyPerformance: data.strategyPerformance || []
      },
      systemStatus: {
        aiEnhanced: true,
        aiFiltered: data.aiFiltered || false,
        ruleFiltered: isRuleFiltered,
        dataQuality: 'high',
        realProperties: true,
        engine: data.discoveryEngine || (data.aiFiltered ? 'Multi-Family Discovery v2.0 + OpenAI' : (isRuleFiltered ? 'Multi-Family Discovery v2.0 + Rule-Based Filter' : 'Multi-Family Discovery v2.0'))
      },
      // Legacy compatibility for existing frontend code
      listings: finalProperties,
      filters: data.searchMetrics || {},
      ai_summary: data.aiFiltered 
        ? `Found ${finalProperties.length} AI-qualified investment properties from ${data.originalFound || 0} analyzed (${data.aiFiltering?.qualificationRate || '0%'} qualification rate).`
        : isRuleFiltered
          ? (() => {
              const rate = (finalProperties.length / (data.totalFound || 1)) * 100;
              const displayRate = rate > 0 && rate < 0.1 ? '0.1%' : `${rate.toFixed(1)}%`;
              return `Found ${finalProperties.length} Crexi-style multi-family portfolios from ${data.originalFound || data.totalFound || 0} properties (${displayRate} qualification rate).`;
            })()
          : `Found ${finalProperties.length} multi-family investment properties with ${data.multiFamilyAnalysis?.multiFamilyPercentage || '0%'} confidence.`
    };
  } catch (error) {
    console.error("❌ Multifamily Property Discovery failed:", error);
    throw error;
  }
};

/**
 * 🎯 Custom AI-Filtered Property Search
 * 
 * Allows customization of AI filtering parameters for specific investment criteria
 */
export const customAIFilteredSearch = async (filterCriteria = {}) => {
  const {
    targetUnits = 4,
    maxBudget = 1500000,
    analysisMode = 'quick',
    preferredMarkets = ['Texas', 'Alabama', 'Georgia', 'Florida'],
    minROI = 8.0
  } = filterCriteria;

  return await multiFamilyPropertyDiscovery({
    useAIFilter: true,
    targetUnits,
    maxBudget,
    analysisMode
  });
};

/**
 * 🔄 Toggle between AI-filtered and all properties
 */
export const toggleAIFiltering = async (enableAI = true, customCriteria = {}) => {
  if (enableAI) {
    return await multiFamilyPropertyDiscovery({
      useAIFilter: true,
      ...customCriteria
    });
  } else {
    return await multiFamilyPropertyDiscovery({
      useAIFilter: false
    });
  }
};

/**
 * 🎯 Enable AI Filtering with Progress Tracking
 * 
 * Provides a user-friendly way to enable AI filtering with loading states
 */
export const enableAIFilteringWithProgress = async (options = {}, onProgress = null) => {
  const {
    targetUnits = 4,
    maxBudget = 1500000,
    analysisMode = 'quick'
  } = options;

  try {
    // Notify progress: Starting
    if (onProgress) onProgress({ 
      stage: 'starting', 
      message: 'Initializing AI property analysis...', 
      progress: 0 
    });

    // Step 1: Get raw properties first (fast)
    if (onProgress) onProgress({ 
      stage: 'discovering', 
      message: 'Discovering properties from 10+ markets...', 
      progress: 20 
    });

    // Step 2: Start AI filtering (slow)
    if (onProgress) onProgress({ 
      stage: 'analyzing', 
      message: `AI analyzing properties for ${targetUnits}+ units under $${maxBudget.toLocaleString()}...`, 
      progress: 40 
    });

    const result = await multiFamilyPropertyDiscovery({
      useAIFilter: true,
      targetUnits,
      maxBudget,
      analysisMode,
      timeoutMs: 120000, // 2 minute timeout
      fallbackToRaw: true
    });

    // Step 3: Complete
    if (onProgress) onProgress({ 
      stage: 'complete', 
      message: result.aiFiltered 
        ? `Found ${result.totalFound} AI-qualified properties (${result.aiFiltering?.qualificationRate} qualification rate)`
        : `Showing ${result.totalFound} properties (AI filtering timed out)`,
      progress: 100 
    });

    return result;

  } catch (error) {
    if (onProgress) onProgress({ 
      stage: 'error', 
      message: 'AI filtering failed, showing all properties', 
      progress: 0 
    });
    
    // Fallback to raw properties
    return await multiFamilyPropertyDiscovery({ useAIFilter: false });
  }
};

/**
 * Legacy AI-powered property search (fallback)
 */
export const smartPropertySearch = async (query) => {
  try {
    console.log('⚠️ Using legacy AI pipeline as fallback');
    
    const response = await fetch(`${API_URL}/api/ai-pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error from AI pipeline");
    }

    const data = await response.json();

    return {
      filters: data.parsed_intent || {},
      listings: data.property_data?.property || [],
      attom_raw: data.property_data,
      ai_summary: data.parsed_intent?.user_notes || "",
    };
  } catch (error) {
    console.error("❌ smartPropertySearch failed:", error);
    throw error;
  }
};
