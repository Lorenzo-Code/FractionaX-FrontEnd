/**
 * Enhanced Caching Service
 * Features:
 * - 10-minute default TTL (was 5 minutes)
 * - Memory cache with LRU eviction
 * - localStorage persistence for important data
 * - Cache invalidation and force refresh
 * - Selective cache clearing
 * - Cache statistics and monitoring
 */

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds
const MAX_MEMORY_CACHE_SIZE = 50; // Maximum items in memory cache

// Different TTLs for different data types (optimized for Cloudflare + Backend cache)
const CACHE_STRATEGIES = {
  // User-specific data (not cached by Cloudflare)
  user_data: 10 * 60 * 1000,        // 10 minutes
  dashboard_data: 10 * 60 * 1000,    // 10 minutes  
  token_balances: 5 * 60 * 1000,     // 5 minutes (changes frequently)
  
  // Public/shared data (Cloudflare handles network, we handle UI persistence)
  token_prices: 2 * 60 * 1000,       // 2 minutes (Cloudflare caches 5 min)
  property_data: 15 * 60 * 1000,     // 15 minutes (Cloudflare caches 30 min)
  network_analytics: 5 * 60 * 1000,  // 5 minutes (live data)
  
  // UI state and preferences (long cache)
  ui_preferences: 24 * 60 * 60 * 1000, // 24 hours
  user_settings: 60 * 60 * 1000        // 1 hour
};

const PERSISTENT_CACHE_KEYS = [
  'user_profile',
  'dashboard_overview', 
  'token_balances',
  'ui_preferences',
  'user_settings'
];

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      totalRequests: 0
    };
    this.initializeFromStorage();
  }

  /**
   * Initialize cache from localStorage for persistent keys
   */
  initializeFromStorage() {
    try {
      PERSISTENT_CACHE_KEYS.forEach(key => {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (this.isValid(parsed)) {
            this.memoryCache.set(key, parsed);
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to initialize cache from storage:', error);
    }
  }

  /**
   * Generate cache key from parameters
   */
  generateKey(baseKey, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(k => `${k}:${params[k]}`)
      .join('|');
    return paramString ? `${baseKey}_${paramString}` : baseKey;
  }

  /**
   * Check if cached item is still valid
   */
  isValid(cacheItem) {
    if (!cacheItem || !cacheItem.timestamp) return false;
    
    // Use the item's specific TTL if available, otherwise fall back to default CACHE_TTL
    const ttl = cacheItem.ttl || CACHE_TTL;
    const age = Date.now() - cacheItem.timestamp;
    const isStillValid = age < ttl;
    
    if (process.env.NODE_ENV === 'development' && !isStillValid) {
      console.log(`📦 Cache EXPIRED: ${cacheItem.key || 'unknown'} (age: ${Math.round(age/1000)}s, ttl: ${Math.round(ttl/1000)}s)`);
    }
    
    return isStillValid;
  }

  /**
   * Get item from cache
   */
  get(key, params = {}) {
    this.cacheStats.totalRequests++;
    const cacheKey = this.generateKey(key, params);
    
    const cached = this.memoryCache.get(cacheKey);
    if (cached && this.isValid(cached)) {
      this.cacheStats.hits++;
      
      // Update last accessed time
      cached.lastAccessed = Date.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Cache HIT: ${cacheKey}`);
      }
      
      return cached.data;
    }

    // Cache miss - remove expired item
    if (cached) {
      this.delete(cacheKey);
    }

    this.cacheStats.misses++;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache MISS: ${cacheKey}`);
    }
    
    return null;
  }

  /**
   * Set item in cache
   */
  set(key, data, params = {}, customTTL = null) {
    const cacheKey = this.generateKey(key, params);
    const ttl = customTTL || CACHE_TTL;
    
    const cacheItem = {
      data,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      ttl,
      key: cacheKey
    };

    // Evict oldest items if cache is full
    this.evictIfNeeded();

    this.memoryCache.set(cacheKey, cacheItem);
    this.cacheStats.sets++;

    // Persist important keys to localStorage
    if (PERSISTENT_CACHE_KEYS.includes(key)) {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      } catch (error) {
        console.warn(`Failed to persist cache item ${cacheKey}:`, error);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache SET: ${cacheKey} (TTL: ${ttl}ms)`);
    }

    return data;
  }

  /**
   * Delete item from cache
   */
  delete(key, params = {}) {
    const cacheKey = this.generateKey(key, params);
    
    const deleted = this.memoryCache.delete(cacheKey);
    if (deleted) {
      this.cacheStats.deletes++;
    }

    // Remove from localStorage if it's a persistent key
    const baseKey = key.split('_')[0];
    if (PERSISTENT_CACHE_KEYS.includes(baseKey)) {
      localStorage.removeItem(`cache_${baseKey}`);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache DELETE: ${cacheKey}`);
    }

    return deleted;
  }

  /**
   * Clear all cache items (memory and localStorage)
   */
  clear() {
    const size = this.memoryCache.size;
    this.memoryCache.clear();
    
    // Clear persistent cache from localStorage
    PERSISTENT_CACHE_KEYS.forEach(key => {
      localStorage.removeItem(`cache_${key}`);
    });

    this.cacheStats.deletes += size;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache CLEARED: ${size} items removed`);
    }
  }

  /**
   * Clear cache for specific pattern
   */
  clearPattern(pattern) {
    let deletedCount = 0;
    
    for (const [key] of this.memoryCache) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
        deletedCount++;
      }
    }

    this.cacheStats.deletes += deletedCount;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache PATTERN CLEAR: ${pattern} - ${deletedCount} items removed`);
    }
  }

  /**
   * Evict least recently used items if cache is full
   */
  evictIfNeeded() {
    if (this.memoryCache.size >= MAX_MEMORY_CACHE_SIZE) {
      // Find the least recently accessed item
      let oldestKey = null;
      let oldestTime = Date.now();

      for (const [key, item] of this.memoryCache) {
        if (item.lastAccessed < oldestTime) {
          oldestTime = item.lastAccessed;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
        this.cacheStats.deletes++;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📦 Cache EVICTED: ${oldestKey} (LRU)`);
        }
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate = this.cacheStats.totalRequests > 0 
      ? (this.cacheStats.hits / this.cacheStats.totalRequests * 100).toFixed(2)
      : '0.00';

    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
      size: this.memoryCache.size,
      maxSize: MAX_MEMORY_CACHE_SIZE,
      ttl: CACHE_TTL,
      persistentKeys: PERSISTENT_CACHE_KEYS
    };
  }

  /**
   * Check if cache has item (regardless of validity)
   */
  has(key, params = {}) {
    const cacheKey = this.generateKey(key, params);
    return this.memoryCache.has(cacheKey);
  }

  /**
   * Get all cache keys (for debugging)
   */
  getKeys() {
    return Array.from(this.memoryCache.keys());
  }

  /**
   * Preload cache with data
   */
  preload(key, dataFetcher, params = {}, customTTL = null) {
    const cacheKey = this.generateKey(key, params);
    
    if (!this.memoryCache.has(cacheKey) || !this.isValid(this.memoryCache.get(cacheKey))) {
      // Fetch data in background
      dataFetcher().then(data => {
        this.set(key, data, params, customTTL);
      }).catch(error => {
        console.warn(`Failed to preload cache for ${cacheKey}:`, error);
      });
    }
  }

  /**
   * Refresh cache item by fetching new data
   */
  async refresh(key, dataFetcher, params = {}, customTTL = null) {
    try {
      const data = await dataFetcher();
      this.set(key, data, params, customTTL);
      return data;
    } catch (error) {
      console.error(`Failed to refresh cache for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get cache item with automatic refresh if expired
   * Supports both old signature (key, dataFetcher, params, customTTL) and new signature (key, dataFetcher, options)
   */
  async getOrFetch(key, dataFetcher, paramsOrOptions = {}, customTTL = null) {
    let params = {};
    let ttl = customTTL;
    let forceRefresh = false;

    // Check if this is the new options signature by looking for our specific properties
    if (paramsOrOptions && typeof paramsOrOptions === 'object' && 
        (paramsOrOptions.hasOwnProperty('ttl') || paramsOrOptions.hasOwnProperty('forceRefresh'))) {
      // New signature: { ttl, forceRefresh }
      ttl = paramsOrOptions.ttl || customTTL || CACHE_TTL;
      forceRefresh = paramsOrOptions.forceRefresh || false;
      params = {}; // No additional params in new signature
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Cache getOrFetch [NEW]: ${key} (TTL: ${ttl}ms, forceRefresh: ${forceRefresh})`);
      }
    } else {
      // Old signature: params object
      params = paramsOrOptions || {};
      ttl = customTTL || CACHE_TTL;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Cache getOrFetch [OLD]: ${key} (params: ${JSON.stringify(params)})`);
      }
    }

    // Force refresh if requested
    if (forceRefresh) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Cache FORCE REFRESH: ${key}`);
      }
      return this.refresh(key, dataFetcher, params, ttl);
    }

    const cached = this.get(key, params);
    
    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch new data
    return this.refresh(key, dataFetcher, params, ttl);
  }

  /**
   * Cleanup expired items (run periodically)
   */
  cleanup() {
    let cleanedCount = 0;
    
    for (const [key, item] of this.memoryCache) {
      if (!this.isValid(item)) {
        this.memoryCache.delete(key);
        cleanedCount++;
      }
    }

    this.cacheStats.deletes += cleanedCount;
    
    if (process.env.NODE_ENV === 'development' && cleanedCount > 0) {
      console.log(`📦 Cache CLEANUP: ${cleanedCount} expired items removed`);
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Run cleanup every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);

// Export cache service and utilities
export default cacheService;

// Helper hooks and functions for React components
export const useCachedData = (key, dataFetcher, params = {}, options = {}) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const { 
    ttl = null, 
    forceRefresh = false,
    dependencies = []
  } = options;

  React.useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let result;
        if (forceRefresh) {
          result = await cacheService.refresh(key, dataFetcher, params, ttl);
        } else {
          result = await cacheService.getOrFetch(key, dataFetcher, params, ttl);
        }

        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [key, ...dependencies, forceRefresh]);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await cacheService.refresh(key, dataFetcher, params, ttl);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key, dataFetcher, params, ttl]);

  return { data, loading, error, refresh };
};

// Cache invalidation patterns
export const invalidateUserCache = () => {
  cacheService.clearPattern('user_');
};

export const invalidateAnalyticsCache = () => {
  cacheService.clearPattern('network_analytics');
  cacheService.clearPattern('cost_analysis');
  cacheService.clearPattern('error_analysis');
};

export const invalidateDashboardCache = () => {
  cacheService.clearPattern('dashboard_');
  cacheService.clearPattern('token_');
  cacheService.clearPattern('staking_');
  cacheService.clearPattern('portfolio_');
};
