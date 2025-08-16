# 🚀 Caching Implementation Guide

This guide shows how to use the new 10-minute caching system to reduce backend API calls.

## ✅ What's Been Implemented

### 1. **CacheService** (`src/shared/services/cacheService.js`)
- **10-minute default TTL** (was 5 minutes)
- **Memory cache** with LRU eviction
- **localStorage persistence** for important data
- **Cache invalidation** and force refresh
- **Real-time statistics** and monitoring

### 2. **Enhanced UserApiService** 
- All major methods now have **cached versions**
- **Raw API methods** still available for bypassing cache
- **Batch cached method** for dashboard loading
- **Cache utilities** for clearing and preloading

## 🔧 How to Use in Components

### Before (Direct API Calls):
```jsx
// ❌ Old way - calls backend every time
useEffect(() => {
  const loadData = async () => {
    const data = await userApiService.getDashboardOverview();
    setData(data);
  };
  loadData();
}, []);
```

### After (With Caching):
```jsx
// ✅ New way - uses 10-minute cache
useEffect(() => {
  const loadData = async () => {
    const data = await userApiService.getDashboardOverviewCached();
    setData(data);
  };
  loadData();
}, []);
```

### Force Refresh (Override Cache):
```jsx
// ✅ Force fresh data when needed
const handleRefresh = async () => {
  const data = await userApiService.getDashboardOverviewCached(true);
  setData(data);
};
```

## 📋 Available Cached Methods

### User Dashboard Methods:
```jsx
// Profile & Overview
userApiService.getUserProfileCached(forceRefresh?)
userApiService.getDashboardOverviewCached(forceRefresh?)

// Token & Balances  
userApiService.getTokenBalancesCached(forceRefresh?)
userApiService.getTokenPricesCached(forceRefresh?) // 5-min cache

// Staking & Portfolio
userApiService.getStakingSummaryCached(forceRefresh?)
userApiService.getPortfolioBreakdownCached(forceRefresh?)

// Income Data (with time range)
userApiService.getPassiveIncomeDataCached(timeRange, forceRefresh?)

// Batch Data Loading (RECOMMENDED for dashboards)
userApiService.getAllDashboardDataCached(forceRefresh?)
```

## 🎯 Quick Migration Steps

### Step 1: Update Component Imports
```jsx
import userApiService from '../services/userApiService';
// No additional imports needed - caching is built-in!
```

### Step 2: Replace Method Calls
```jsx
// Replace these methods:
getDashboardOverview() → getDashboardOverviewCached()
getUserProfile() → getUserProfileCached()  
getTokenBalances() → getTokenBalancesCached()
getTokenPrices() → getTokenPricesCached()
getStakingSummary() → getStakingSummaryCached()
getPortfolioBreakdown() → getPortfolioBreakdownCached()

// Special case - batch loading:
getAllDashboardData() → getAllDashboardDataCached()
```

### Step 3: Add Refresh Functionality
```jsx
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  try {
    // Force refresh bypasses cache
    const data = await userApiService.getAllDashboardDataCached(true);
    setDashboardData(data);
  } finally {
    setRefreshing(false);
  }
};
```

## 🔍 Cache Management

### Clear Cache on Logout:
```jsx
const handleLogout = () => {
  userApiService.clearAllCache(); // Clear user-specific cache
  // ... rest of logout logic
};
```

### Preload Data (Optional):
```jsx
// Preload data in background for better UX
userApiService.preloadDashboardData();
```

### Debug Cache Performance:
```jsx
// Get cache statistics
const stats = userApiService.getCacheStats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Cache size:', stats.size);
```

## 🎨 Example: Dashboard Component Migration

### Before:
```jsx
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await userApiService.getAllDashboardData();
        setData(result);
      } catch (error) {
        console.error('Failed to load:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div>
      {loading ? <Spinner /> : <DashboardContent data={data} />}
    </div>
  );
};
```

### After:
```jsx
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    const isInitialLoad = !data;
    setLoading(isInitialLoad);
    setRefreshing(!isInitialLoad);

    try {
      // ✅ Uses 10-minute cache automatically
      const result = await userApiService.getAllDashboardDataCached(forceRefresh);
      setData(result);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => loadData(true);

  return (
    <div>
      <button onClick={handleRefresh} disabled={refreshing}>
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>
      
      {loading ? <Spinner /> : <DashboardContent data={data} />}
    </div>
  );
};
```

## 📊 Benefits You'll See

### 1. **Reduced Backend Load**
- **10-minute caching** means same data reused across page refreshes
- **Intelligent cache keys** based on parameters
- **Automatic cleanup** of expired items

### 2. **Better User Experience**
- **Instant loading** for cached data
- **Background refresh** capabilities
- **Persistent cache** survives page refreshes

### 3. **Developer Tools**
- **Cache statistics** for monitoring performance
- **Force refresh** for testing
- **Pattern-based cache clearing**

## 🚀 Next Steps

1. **Start with main dashboard components** - biggest impact
2. **Replace heavy data calls first** - network analytics, portfolio data
3. **Add refresh buttons** where users expect live data
4. **Monitor cache hit rates** in development console
5. **Consider shorter TTLs** for rapidly changing data (prices, live metrics)

## 💡 Pro Tips

- Use `getAllDashboardDataCached()` for dashboard loads
- Set `forceRefresh=true` for user-initiated refreshes
- Clear cache on logout for security
- Monitor cache stats during development
- Keep raw API methods for admin/debug purposes

---

**Cache TTL Settings:**
- **Default**: 10 minutes (600,000ms)
- **Token Prices**: 5 minutes (300,000ms)  
- **Custom TTL**: Pass as 4th parameter

Your application will now be much more efficient with significantly fewer backend calls! 🎉
