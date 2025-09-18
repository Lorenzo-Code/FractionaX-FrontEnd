# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build and serve locally to analyze bundle
npm run build:analyze

# Fast development build (without full optimization)
npm run build:fast

# Preview production build locally
npm run preview

# Clean build artifacts and dependencies
npm run clean

# Full optimization pipeline
npm run optimize
```

### Quality & Linting
```bash
# Run ESLint on entire codebase
npm run lint

# Run ESLint with auto-fix
npm run lint --fix
```

### Testing & Development
```bash
# Test API connection
node test-api-connection.js

# Test marketplace integration
node src/test-marketplace-integration.js

# Cache testing utility
node scripts/cache-test.js

# Protocol sync testing
node scripts/test-api-integration.js
```

## Architecture Overview

### Feature-Based Architecture
This project follows a **feature-based architecture** organizing code by business domains rather than technical layers. This approach improves maintainability and scalability.

**Core Feature Domains:**
- **`/admin`** - Administrative functionality and platform management
- **`/user-dashboard`** - User portfolio, investments, and account management  
- **`/marketplace`** - Property marketplace and transaction functionality
- **`/marketing`** - Public-facing marketing pages and content
- **`/auth`** - Authentication, authorization, and account management
- **`/shared`** - Reusable components, hooks, and utilities across features

### Technology Stack
- **React 18** with modern hooks and context patterns
- **Vite** for lightning-fast builds and HMR
- **React Router v7** with nested protected routes
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations and transitions
- **Web3 Integration** via Rainbow Kit + Wagmi + Viem
- **Real-time Data** via Socket.io and React Query
- **Charts & Analytics** via Chart.js, Recharts, and TradingView widgets

### Key Architectural Patterns

#### Route Protection System
```javascript
// Two-tier protection: user routes + admin routes
<Route path="/dashboard" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
<Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
```

#### Context Providers Hierarchy
```javascript
// AuthProvider → CoreLogicInsightsProvider → App components
<AuthProvider>
  <CoreLogicInsightsProvider>
    <Routes />
  </CoreLogicInsightsProvider>
</AuthProvider>
```

#### Lazy Loading Strategy
All major components use React.lazy() with Suspense for code splitting, improving initial load performance.

#### Barrel Exports System
Each feature includes `index.js` files for clean imports:
```javascript
import { DashboardHeader, StatCard } from 'src/features/user-dashboard/components';
import { PropertyCard, FilterPanel } from 'src/features/marketplace/components';
```

## FractionaX-Specific Context

### Platform Purpose
FractionaX is an AI-powered real estate investment platform combining blockchain, AI, and data-driven tools for high-yield real estate opportunities.

### Token Ecosystem
- **FXCT Tokens** - Primary utility token for platform access
- **FXST Tokens** - Secondary staking/governance token
- Internal wallet management system for each user account
- External wallet connection support for trading/withdrawal

### Admin Management Features
The admin system includes comprehensive user management:
- Reset/change temporary passwords
- Clear/reset 2-step verification for locked accounts
- Manage linked crypto wallets (remove, suspend, add)
- Access user ID verification documents
- Pull signed contracts and maintain document checklists
- Internal wallet management for Fractionax tokens

### Integration Points
- **OpenAI API** - AI-powered property search and insights
- **Google Maps API** - Property location and mapping
- **Zillow RapidAPI** - Property data and market information
- **CoreLogic Integration** - Advanced property analytics
- **LoopNet API** - Commercial real estate data

## Development Guidelines

### File Structure Patterns
```
src/features/[domain]/
├── components/     # Domain-specific UI components
├── pages/         # Route-level page components  
├── hooks/         # Domain-specific custom hooks
├── services/      # API and data services
├── utils/         # Domain utilities
├── config/        # Domain configuration
└── index.js       # Barrel exports
```

### Import Conventions
- Use absolute paths via `@/` alias for src imports
- Prefer barrel imports from feature directories
- Keep shared utilities in `/shared` for cross-feature use

### Environment Variables
Required environment variables (see `.env.example`):
```bash
VITE_CLIENT_ID=your-client-id
VITE_CLIENT_SECRET=your-client-secret
```

### Build Optimization
The Vite config includes advanced chunking strategies:
- `react-vendor` - React core libraries
- `web3-vendor` - Rainbow Kit, Wagmi, Viem
- `charts-vendor` - Chart.js, Recharts  
- `ui-vendor` - Framer Motion, Lucide icons

Production builds drop console logs and optimize for performance with Terser compression.

### Security Considerations
- CORS configured for production domains
- CSP headers in preview mode
- No sensitive information in client-side code
- All admin routes protected by role-based authentication

## Common Development Patterns

### Adding New Features
1. Create feature directory under `src/features/[feature-name]/`
2. Add components, pages, and services as needed
3. Create barrel exports in `index.js`
4. Add routes to `App.jsx` with appropriate protection
5. Update imports throughout the application

### Working with Protected Routes
```javascript
// User-level protection
<ProtectedRoute>
  <UserComponent />
</ProtectedRoute>

// Admin-level protection  
<ProtectedRoute requiredRole="admin">
  <AdminComponent />
</ProtectedRoute>
```

### Real-time Data Integration
Use React Query for API state management and Socket.io for real-time updates:
```javascript
const { data, isLoading } = useQuery({
  queryKey: ['properties'],
  queryFn: fetchProperties
});
```

This architecture supports the platform's complex user management, token ecosystems, and real-estate data integrations while maintaining clean separation between public marketing, user dashboards, and administrative functionality.
