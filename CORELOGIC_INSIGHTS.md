# CoreLogic Insights Limiting System

## Overview

This system implements per-user limits on viewing CoreLogic property insights, allowing up to 5 property detail views per user before requiring login for unlimited access. The system is triggered by the "View Details" button rather than separate premium insight buttons.

## Architecture

### 1. Context & State Management
- **CoreLogicInsightsContext.jsx** - Main context for managing insight usage state
- **useCoreLogicInsights.js** - Custom hook providing easy access to insights functionality

### 2. Components
- **CoreLogicInsightButton.jsx** - Reusable button component for different insight types
- **CoreLogicLoginModal.jsx** - Specialized modal for insight limit enforcement

### 3. Integration Points
- **PropertyDetails.jsx** - Shows enhanced CoreLogic data sections when user has access
- **SearchResults.jsx** - View Details button enforces CoreLogic limits and shows remaining count
- **App.jsx** - Wraps the app with CoreLogicInsightsProvider
- **coreLogicService.js** - Handles API calls to CoreLogic with proper limit checking

## Features

### Insight Types Supported
1. **Market Analysis** - Market trends and pricing data
2. **Comparable Sales** - Recent property sales comparisons
3. **Property History** - Ownership and transaction history
4. **Neighborhood Insights** - Demographics and local data
5. **Investment Analysis** - ROI calculations and rental estimates

### User Experience
- **Free Users**: 5 property detail views per day with usage counter shown on View Details button
- **Authenticated Users**: Unlimited access to enhanced property data
- **Persistent Tracking**: Usage stored in localStorage across sessions
- **View Details Integration**: Single button controls both navigation and CoreLogic access

### UI/UX Features
- Loading states with spinner animations
- Gradient buttons with usage counters
- Professional modal displays with CoreLogic branding
- Responsive design for all screen sizes
- Smooth animations with Framer Motion

## Usage Examples

### View Details Button with CoreLogic Limiting
```jsx
import useCoreLogicInsights from 'path/to/useCoreLogicInsights';

const { canViewInsight, viewInsight, getRemainingInsights } = useCoreLogicInsights();

<button
  onClick={() => handleViewDetailsClick(property)}
  className={canViewInsight() ? 'enabled' : 'disabled'}
  disabled={!canViewInsight()}
>
  {canViewInsight() 
    ? `View Details (${getRemainingInsights()} left)` 
    : 'Login Required'
  }
</button>
```

### CoreLogic Service Usage
```jsx
import coreLogicService from 'path/to/coreLogicService';
import useCoreLogicInsights from 'path/to/useCoreLogicInsights';

const PropertyDetails = () => {
  const coreLogicInsights = useCoreLogicInsights();
  const [enhancedData, setEnhancedData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await coreLogicService.fetchPropertyInsights(id, coreLogicInsights);
      if (result.success) {
        setEnhancedData(result.data);
      }
    };
    loadData();
  }, [id]);
};
```

## Configuration

### Customizable Settings
```jsx
// In CoreLogicInsightsContext.jsx
const FREE_USER_LIMIT = 5; // Change limit here
const STORAGE_KEY = 'fractionax_corelogic_insights'; // Storage key
```

## Data Flow

1. **User clicks View Details button**
2. **Check if user can view** (`canViewInsight()`)
3. **If yes**: Record usage (`viewInsight()`) and navigate to PropertyDetails
4. **PropertyDetails loads**: Fetch enhanced CoreLogic data via service
5. **If no access**: Show login modal
6. **On login**: Reset counter and grant unlimited access

## Storage Schema

```json
{
  "count": 3,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing Scenarios

1. **Anonymous User Journey**:
   - Click View Details on 5 properties successfully (counter decrements)
   - 6th click shows disabled button or triggers login modal
   - Login grants unlimited access and shows enhanced data

2. **Authenticated User**:
   - View Details always enabled with "Full Analysis" text
   - Enhanced CoreLogic sections automatically loaded
   - No counters or restrictions shown

3. **Cross-Session Persistence**:
   - Usage counter persists across browser sessions
   - Enhanced data loading works consistently

## Future Enhancements

- **Real CoreLogic API Integration**: Replace mock data with actual CoreLogic API calls
- **Tiered Access**: Different limits for different subscription levels
- **Usage Analytics**: Track conversion rates from free to paid users
- **Enhanced Data Types**: Add more CoreLogic data categories (environmental, zoning, etc.)
- **Server-side Enforcement**: Backend validation of insight limits
- **Caching Strategy**: Cache CoreLogic responses to reduce API costs
