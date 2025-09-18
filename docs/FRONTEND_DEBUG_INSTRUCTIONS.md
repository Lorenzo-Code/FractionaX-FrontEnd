# Frontend Debug Instructions

## 🐛 Debug Missing Pricing and Images Issue

Your backend is providing **complete data** (verified ✅), but the frontend isn't displaying pricing and images. Let's debug this step by step.

## Step 1: Add Debug Component

1. **The debug component is now at** `src/components/debug/PropertyDebugPanel.jsx`

2. **Add it to your marketplace page** - Open the file where you display properties and add:

```jsx
import PropertyDebugPanel from '../components/debug/PropertyDebugPanel';

// Inside your component, after your properties are displayed:
<PropertyDebugPanel properties={aiDiscoveredProperties} title="Marketplace Debug" />
```

3. **Common files to add this to:**
   - `src/features/user-dashboard/pages/CustomerMarketplace.jsx`
   - `src/features/marketplace/pages/MarketplacePage.jsx` (if it exists)
   - `src/features/marketing/components/PropertyMarketplace.jsx`

## Step 2: Check Your Frontend

1. **Start your frontend** (if not running):
   ```bash
   cd C:\Users\loren\Build Projects\FractionaX-FrontEnd
   npm run dev
   # or
   npm start
   ```

2. **Open your browser** to your frontend (usually http://localhost:5173 or http://localhost:3000)

3. **Look for the red 🐛 Debug button** in the bottom right corner

4. **Click the Debug button** and then **"Test Raw API"**

## Step 3: Browser Developer Tools

1. **Press F12** to open Developer Tools

2. **Go to the Console tab**

3. **Look for these debug messages:**
   ```
   🔍 Debug: Testing raw API...
   🔍 Debug: Raw API Response: {success: true, properties: [...]...}
   🔍 Debug: First property pricing: {listPrice: 10500000, ...}
   🔍 Debug: First property media: {images: [...], ...}
   ```

4. **Go to the Network tab**

5. **Refresh the page and look for:**
   - API call to `/api/properties/multifamily-discovery/search`
   - Check if it returns data with `pricing` and `media` objects

## Step 4: Check for Common Issues

### Issue 1: Wrong API Base URL
```jsx
// Check your .env file or vite config
const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";
```

### Issue 2: JavaScript Errors
Look in Console tab for red error messages that might be breaking the data flow.

### Issue 3: React State Issues
Check if the `setAiDiscoveredProperties` is actually being called with the data.

### Issue 4: Component Props Issues
Verify that properties are being passed correctly to PropertyCard components.

## Step 5: Manual Browser Test

**Open browser console and run this:**

```javascript
// Test the API directly in browser
fetch('/api/properties/multifamily-discovery/search')
  .then(response => response.json())
  .then(data => {
    console.log('🔍 API Test Results:');
    console.log('Properties count:', data.properties?.length);
    console.log('First property pricing:', data.properties?.[0]?.pricing);
    console.log('First property images:', data.properties?.[0]?.media?.images);
  });
```

## Expected Results

✅ **If everything is working:**
- Debug panel shows matching numbers for Raw vs Transformed data
- Console shows pricing and images data
- Network tab shows successful API calls

❌ **If there's an issue:**
- Missing API calls in Network tab → Frontend not calling API
- API returns data but Debug panel shows 0 properties → Transformation issue
- JavaScript errors in Console → Code errors preventing execution
- API calls to wrong URL → Configuration issue

## Quick Fix Checklist

- [ ] Backend is running on port 5000 ✅ (already confirmed)
- [ ] Frontend can reach backend API
- [ ] No JavaScript errors in console
- [ ] API call returns complete data
- [ ] Data transformation is working
- [ ] React components receive the data
- [ ] PropertyCard components display the data

## If You Still See Missing Pricing/Images

**Take a screenshot of:**
1. The Debug panel showing the data comparison
2. Browser Console tab showing any errors
3. Network tab showing the API call response

This will help us pinpoint exactly where the data is being lost!