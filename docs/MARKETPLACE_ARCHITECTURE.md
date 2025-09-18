# FractionaX Marketplace Architecture

## Overview

The FractionaX marketplace consists of two distinct but related components that serve different user contexts:

1. **Public Marketplace** (`Marketplace.jsx`) - For anonymous users and admin
2. **Customer Marketplace** (`CustomerMarketplace.jsx`) - For authenticated users with personalization

## Architecture Decision

After thorough analysis, we've implemented a **shared logic pattern** instead of full consolidation:

### Why Not Full Consolidation?

The components serve fundamentally different purposes:

- **Different User Contexts**: Public vs authenticated users
- **Different Feature Sets**: Basic viewing vs user interactions (likes, bookmarks, commitments)
- **Different UI Components**: PropertyCard vs PersonalizedPropertyCard
- **Different Routing**: `/marketplace` vs `/dashboard/marketplace`

### Implemented Solution: Shared Logic Hooks

We've extracted common marketplace logic into reusable hooks:

#### 1. `useMarketplace.js` - Base Marketplace Hook
- Core marketplace functionality
- Property fetching from backend APIs
- Basic filtering and pagination
- Search functionality
- Used by both public and customer marketplaces

#### 2. `useCustomerMarketplace.js` - Extended Customer Hook
- Extends the base marketplace hook
- Adds user-specific features (likes, bookmarks, commitments)
- Enhanced filtering with user preferences
- Personalized sorting options
- User activity tracking

## Benefits of This Architecture

### 1. **Code Reuse**
- Shared logic is centralized in hooks
- No duplication of API calls, filtering, or pagination logic
- Easy to maintain and update core functionality

### 2. **Separation of Concerns**
- Public marketplace focuses on discovery and basic interaction
- Customer marketplace provides personalized investment experience
- Clear boundaries between features

### 3. **Maintainability**
- Changes to core marketplace logic automatically benefit both components
- User-specific features are isolated and easy to modify
- Clean, testable code structure

### 4. **Extensibility**
- Easy to add new features to either marketplace
- Can create additional specialized marketplaces (e.g., admin marketplace)
- Hook pattern allows for easy composition

## Component Structure

```
/features/marketplace/
├── pages/
│   ├── Marketplace.jsx              # Public marketplace
│   └── /user-dashboard/pages/
│       └── CustomerMarketplace.jsx  # Customer marketplace
├── hooks/
│   ├── useMarketplace.js           # Base marketplace logic
│   └── useCustomerMarketplace.js   # Customer-specific features
├── components/                     # Shared components
│   ├── PropertyCard.jsx
│   ├── SmartFilterPanel.jsx
│   └── PropertyMap.jsx
├── services/
│   └── marketplaceService.js       # API integration
└── user-dashboard/components/      # Customer-specific components
    ├── PersonalizedPropertyCard.jsx
    └── FXCTCalculator.jsx
```

## Usage Examples

### Public Marketplace
```javascript
import { useMarketplace } from '../hooks/useMarketplace';

function Marketplace() {
  const {
    loading,
    paginatedProperties,
    searchQuery,
    setSearchQuery,
    baseFilters,
    setBaseFilters,
    // ... other shared marketplace features
  } = useMarketplace();

  // Render public marketplace UI
}
```

### Customer Marketplace
```javascript
import { useCustomerMarketplace } from '../hooks/useCustomerMarketplace';

function CustomerMarketplace() {
  const {
    // All base marketplace features
    loading,
    paginatedProperties,
    searchQuery,
    setSearchQuery,
    
    // Plus customer-specific features
    userLikes,
    userBookmarks,
    userActivity,
    toggleLike,
    toggleBookmark,
    showUserInsights,
    // ... other customer features
  } = useCustomerMarketplace(userPreferences);

  // Render personalized marketplace UI
}
```

## Backend Integration

Both marketplaces use the updated backend endpoint:
- **Endpoint**: `/api/properties/discover?intelligence=standard`
- **Required Parameters**: `city`, `state`
- **Response**: Properties with comprehensive metadata

The `marketplaceService.js` has been updated to use this new endpoint and handle the required parameters correctly.

## Key Features

### Shared Features (Both Marketplaces)
- Property discovery using AI-enhanced backend
- Search and filtering
- Pagination
- Map view
- Property details
- Responsive design

### Customer-Only Features
- User interactions (likes, bookmarks, commitments)
- Personal notes and watchlist
- User activity insights
- Personalized sorting
- Investment tracking
- Enhanced filtering options

## Routing Configuration

The routes are configured in `src/App.jsx`:

- **Public**: `/marketplace` → `Marketplace.jsx`
- **Customer**: `/dashboard/marketplace` → `CustomerMarketplace.jsx`
- **Admin**: `/admin/marketplace` → `Marketplace.jsx` (reuses public component)

## Performance Considerations

1. **Lazy Loading**: Both components are lazy-loaded for better performance
2. **Memoization**: Expensive computations are memoized in the hooks
3. **Efficient Filtering**: Filtering logic is optimized to prevent unnecessary re-renders
4. **API Caching**: Backend responses are cached where appropriate

## Testing Strategy

1. **Hook Testing**: Unit tests for both marketplace hooks
2. **Component Testing**: Isolated tests for each marketplace component
3. **Integration Testing**: End-to-end tests for the complete marketplace flows
4. **API Testing**: Mock backend responses for consistent testing

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live property updates
2. **Advanced Personalization**: ML-based property recommendations
3. **Social Features**: User reviews and property discussions
4. **Mobile App**: Native mobile marketplace using shared hooks
5. **Third-party Integrations**: MLS, Zillow, and other property data sources

This architecture provides a solid foundation for the FractionaX marketplace while maintaining flexibility for future growth and feature additions.