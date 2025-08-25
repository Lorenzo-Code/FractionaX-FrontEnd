# 🎯 CoreLogic Analytics Dashboard - Frontend Integration Guide

## Overview

The CoreLogic Analytics Dashboard provides real-time monitoring and cost management for your CoreLogic API usage. It integrates seamlessly with your existing admin panel and provides comprehensive insights into API performance, costs, and optimization opportunities.

## 🚀 What's Been Added

### 1. **CoreLogicAnalyticsDashboard Component**
Location: `src/features/admin/components/CoreLogicAnalyticsDashboard.jsx`

A comprehensive dashboard with 5 main tabs:
- **📊 Overview**: Key metrics, charts, and performance data
- **🔗 Endpoints**: Detailed endpoint usage analysis
- **👥 Users**: Top API consumers and user analytics
- **⚠️ Errors**: Error analysis and troubleshooting
- **💡 Optimize**: Cost optimization recommendations

### 2. **Updated NetworkAnalyticsPage**
Location: `src/features/admin/pages/NetworkAnalyticsPage.jsx`

Now includes tabs for both:
- **General Network Analytics**: Your existing network monitoring
- **CoreLogic API Analytics**: New CoreLogic-specific tracking

### 3. **New UI Components**
- `src/shared/components/ui/alert.jsx` - Alert notifications
- `src/shared/components/ui/progress.jsx` - Progress bars for budget tracking

## 📊 Dashboard Features

### Real-time Budget Monitoring
```jsx
// Budget status card shows:
- Monthly budget usage (visual progress bar)
- Daily usage tracking
- Cache hit rate monitoring  
- Projected monthly costs
- Days until budget exhaustion
- Recommended daily limits
```

### Comprehensive Analytics
- **Total Requests**: All API calls (cached + actual)
- **Cache Hit Rate**: Percentage of requests served from cache
- **Average Cost**: Cost per API request
- **Error Rate**: Failed API calls percentage
- **Performance Metrics**: Response times by endpoint
- **Cost Breakdown**: Spending by API endpoint

### Alert System
The dashboard automatically shows alerts for:
- Budget limits approaching (80%, 95%, exceeded)
- High error rates
- Duplicate requests detected
- Poor cache performance
- System connectivity issues

### Interactive Charts
- **Endpoint Performance**: Bar chart of response times
- **Cost Breakdown**: Pie chart of spending by endpoint
- **Usage Trends**: Line charts of request patterns over time

## 🔧 API Integration

The dashboard connects to your backend CoreLogic tracking system:

```javascript
// API endpoints used:
GET /api/admin/corelogic-analytics/dashboard
GET /api/admin/corelogic-analytics/budget-status  
GET /api/admin/corelogic-analytics/usage-summary
GET /api/admin/corelogic-analytics/top-consumers
GET /api/admin/corelogic-analytics/duplicate-requests
GET /api/admin/corelogic-analytics/errors
GET /api/admin/corelogic-analytics/alerts
GET /api/admin/corelogic-analytics/export-data
```

### Automatic Refresh
- **Real-time updates**: Every 60 seconds
- **Manual refresh**: Click refresh button
- **Data caching**: Intelligent caching to reduce backend load

## 🎨 UI/UX Features

### Responsive Design
- **Desktop**: Full dashboard with all charts and tables
- **Tablet**: Responsive grid layout
- **Mobile**: Stacked cards and simplified views

### Interactive Elements
- **Time Range Selector**: 1 day, 7 days, 30 days
- **Export Functionality**: Download usage data as CSV
- **Tab Navigation**: Easy switching between different views
- **Real-time Indicators**: Live status indicators

### Visual Feedback
- **Animated Alerts**: Slide-in notifications
- **Progress Bars**: Visual budget consumption
- **Color Coding**: Red/yellow/green for status indicators
- **Loading States**: Spinners and skeleton loading

## 📈 Key Metrics Displayed

### Budget Metrics
```jsx
// Real-time budget tracking
Monthly Budget: $5,000
Used: $1,247.50 (24.95%)
Remaining: $3,752.50
Today's Usage: $67.50
```

### Performance Metrics  
```jsx
// API performance tracking
Total Requests: 15,420
Cache Hit Rate: 78.3%
Average Cost: $2.15 per request
Error Rate: 0.8%
```

### Cost Analysis
```jsx
// Cost breakdown by endpoint
Property Detail: $450.00 (35%)
Comparables: $320.00 (25%)
Search: $180.00 (14%)
Climate Risk: $125.00 (10%)
```

## 🔍 How to Access

1. **Login to Admin Panel**: Navigate to your admin dashboard
2. **Go to Analytics**: Click on "Network Analytics" or "API Analytics Center"
3. **Select CoreLogic Tab**: Click the "CoreLogic API Analytics" tab
4. **Explore Data**: Use the tabs to explore different aspects of your API usage

## ⚙️ Configuration Options

### Time Range Selection
```jsx
// Available time ranges
- Last 1 Day: Recent activity and issues
- Last 7 Days: Weekly trends and patterns  
- Last 30 Days: Monthly overview and budgeting
```

### Export Options
```jsx
// Data export formats
- CSV: Spreadsheet-compatible data
- JSON: Raw API data for analysis
// Export includes: requests, costs, performance, errors
```

## 🚨 Alert Types

### Budget Alerts
- **🔴 Critical**: Monthly budget exceeded (API calls blocked)
- **🟡 Warning**: Approaching 95% of budget
- **🔵 Info**: Reached 80% of budget

### Performance Alerts
- **🟡 Warning**: Cache hit rate below 70%
- **🟡 Warning**: High error rates detected
- **🔵 Info**: Duplicate requests found

### System Alerts
- **🔴 Critical**: Backend connectivity issues
- **🟡 Warning**: API response times degrading

## 💡 Optimization Recommendations

The dashboard provides automated recommendations:

### Cache Optimization
```
Current cache hit rate: 65%
Recommendation: Increase TTL for stable endpoints
Potential Savings: $200-500/month
```

### Duplicate Prevention
```  
15 duplicate requests detected
Recommendation: Implement request deduplication
Potential Savings: $45.50/day
```

### Endpoint Optimization
```
Property Detail accounts for $450 in costs
Recommendation: Batch requests or increase cache time
Potential Savings: 10-15% cost reduction
```

## 🔧 Technical Implementation

### Component Structure
```
NetworkAnalyticsPage
├── NetworkAnalyticsDashboard (existing)
└── CoreLogicAnalyticsDashboard (new)
    ├── Budget Status Card
    ├── Key Metrics Grid  
    ├── Charts Section
    ├── Data Tables
    └── Optimization Panel
```

### State Management
```javascript
// Main state variables
const [dashboardData, setDashboardData] = useState(null);
const [budgetStatus, setBudgetStatus] = useState(null);
const [usageAnalytics, setUsageAnalytics] = useState(null);
const [alerts, setAlerts] = useState([]);
const [loading, setLoading] = useState(true);
```

### API Service Layer
```javascript
// Organized API methods
const coreLogicApi = {
  getDashboard: () => secureApiClient.get('/api/admin/corelogic-analytics/dashboard'),
  getBudgetStatus: () => secureApiClient.get('/api/admin/corelogic-analytics/budget-status'),
  getUsageSummary: (period, type) => secureApiClient.get(`/api/admin/corelogic-analytics/usage-summary?period=${period}&type=${type}`),
  // ... more methods
};
```

## 🎯 Usage Examples

### Monitoring Daily Usage
1. Open the dashboard
2. Check the budget status card at the top
3. Review today's usage and cache hit rate
4. Look for any budget alerts

### Investigating High Costs
1. Go to the "Endpoints" tab
2. Sort by "Avg Cost" to find expensive endpoints
3. Check the "Optimize" tab for recommendations
4. Review duplicate requests in the "Errors" tab

### Analyzing User Behavior
1. Visit the "Users" tab
2. See top API consumers
3. Check which users are driving costs
4. Identify unusual usage patterns

### Optimizing Performance
1. Review the "Optimize" tab recommendations
2. Check cache hit rates by endpoint
3. Look for duplicate request patterns
4. Export data for deeper analysis

## 🚀 Next Steps

1. **Access the Dashboard**: Navigate to your admin panel's Network Analytics section
2. **Review Budget Status**: Check your current CoreLogic API spending
3. **Explore Analytics**: Use the different tabs to understand your usage patterns
4. **Implement Optimizations**: Follow the recommendations to reduce costs
5. **Monitor Regularly**: Set up a routine to check the dashboard weekly

## 💬 Support & Troubleshooting

### Common Issues

**Dashboard not loading data**
- Check backend connectivity
- Verify admin permissions
- Look for error alerts on the page

**Charts showing "No data available"**
- May indicate no recent API usage
- Check if CoreLogic API tracking is active
- Verify time range selection

**Budget data seems incorrect**
- Check environment variables for budget limits
- Verify backend tracking is running
- Look at the "Errors" tab for failed requests

### Getting Help
- Check the browser console for error messages
- Review backend logs for API tracking issues
- Contact support with specific error messages

---

**🎉 You now have comprehensive CoreLogic API monitoring with real-time cost management and optimization insights!**
