# FractionaX Frontend Architecture

## 📁 Feature-Based Folder Structure

This project follows a **feature-based architecture** that organizes code by business domains rather than technical layers. This approach improves maintainability, scalability, and developer experience.

## 🏗️ Structure Overview

```
src/
├── features/          # Feature-based modules
│   ├── admin/         # Admin dashboard & management
│   ├── ai-search/     # AI-powered property search
│   ├── auth/          # Authentication & authorization
│   ├── user-dashboard/# User dashboard & portfolio
│   ├── marketplace/   # Property marketplace
│   └── marketing/     # Marketing pages & content
├── shared/            # Shared utilities & components
└── [existing folders] # Legacy structure (to be migrated)
```

## 🎯 Feature Domains

### `/admin`
**Purpose**: Administrative functionality for platform management
- **Components**: DashboardHeader, ProtocolCard, AnalyticsCharts
- **Pages**: AdminProtocolPage, UserPanel, TokenAnalytics, etc.
- **Examples**: Protocol management, user analytics, system monitoring

**Status**: ✅ **Complete** (AdminProtocolPage refactored into modular components)

### `/ai-search`
**Purpose**: AI-powered property search and discovery
- **Components**: PropertySearch, SmartFilters, AIInsights
- **Pages**: AiSearchPage, PropertyResults
- **Examples**: Natural language search, AI recommendations, property matching

**Status**: 🔄 **Ready for migration** from `src/components/AiSearch/`

### `/auth`
**Purpose**: User authentication and account management
- **Components**: LoginForm, SignupForm, ProtectedRoute
- **Pages**: SignUpLoginPage, ProfileSettings
- **Examples**: Login/signup, password reset, account verification

**Status**: 🔄 **Ready for migration** from existing auth components

### `/user-dashboard`
**Purpose**: User portfolio and investment management
- **Components**: PortfolioChart, PropertyCard, InvestmentSummary
- **Pages**: CustomerDashboard, PropertyDetails
- **Examples**: Portfolio tracking, investment history, performance metrics

**Status**: 🔄 **Ready for migration** from `src/components/dashboard/`

### `/marketplace`
**Purpose**: Property marketplace and transaction functionality
- **Components**: PropertyListing, FilterPanel, TransactionModal
- **Pages**: Marketplace, PropertyDetails
- **Examples**: Property browsing, buying/selling, tokenization

**Status**: 🔄 **Ready for migration** from `src/components/marketplace/`

### `/marketing`
**Purpose**: Public-facing marketing and informational content
- **Components**: HeroSection, FeaturedProperties, HowItWorks
- **Pages**: Home, Blog, FAQ, Legal Pages
- **Examples**: Landing pages, blog posts, company information

**Status**: 🔄 **Ready for migration** from `src/components/homepage/`

## 🔧 Shared Resources

### `/shared`
**Purpose**: Reusable components, utilities, and types used across features
- **Components**: Button, Modal, ErrorBoundary, SEO
- **Hooks**: useAuth, useLocalStorage, useApi
- **Utils**: formatters, validators, API clients
- **Types**: User, Property, Transaction interfaces
- **Constants**: API endpoints, configuration values

## 📋 Migration Checklist

### Priority 1: Core Features
- [x] **Admin** - AdminProtocolPage (Complete) ✅
- [x] **User Dashboard** - Move `src/components/dashboard/` components ✅
- [x] **AI Search** - Move `src/components/AiSearch/` components ✅

### Priority 2: Public Features  
- [ ] **Marketing** - Move `src/components/homepage/` components
- [ ] **Marketplace** - Move `src/components/marketplace/` components
- [ ] **Auth** - Move authentication-related components

### Priority 3: Shared Resources
- [ ] **Components** - Move `src/components/common/` to `src/shared/components/`
- [ ] **Hooks** - Move `src/hooks/` to `src/shared/hooks/`
- [ ] **Utils** - Move `src/utils/` to `src/shared/utils/`

## 🎯 Benefits of This Structure

1. **Domain-Driven Organization**: Code is organized by business functionality
2. **Improved Scalability**: Easy to add new features without affecting existing ones
3. **Better Team Collaboration**: Teams can work on specific features independently
4. **Enhanced Maintainability**: Related code is co-located and easier to find
5. **Clearer Dependencies**: Feature boundaries make dependencies more explicit

## 🔄 Import Examples

```javascript
// Feature-specific imports
import DashboardHeader from 'features/admin/components/DashboardHeader';
import PropertySearch from 'features/ai-search/components/PropertySearch';
import LoginForm from 'features/auth/components/LoginForm';

// Shared imports
import Button from 'shared/components/Button';
import { formatCurrency } from 'shared/utils/formatters';
import { useAuth } from 'shared/hooks/useAuth';
```

## 🚀 Next Steps

1. **Continue Migration**: Move existing components into appropriate feature folders
2. **Update Imports**: Update import statements to use new paths
3. **Add Index Files**: Create index.js files for cleaner imports
4. **Implement Barrel Exports**: Use barrel exports for feature APIs
5. **Add Feature Documentation**: Document each feature's specific architecture

---

*This structure positions the FractionaX frontend for scalable growth while maintaining clean separation of concerns.*
