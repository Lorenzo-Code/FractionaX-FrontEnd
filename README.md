# FractionaX Frontend

Welcome to the official frontend repository for **FractionaX**, a next-gen AI-powered real estate investment platform.

This project is built using **React + Vite**, delivering fast performance, modular components, and a clean developer experience.

---

## 🚀 Project Overview

FractionaX combines blockchain, AI, and data-driven tools to help users discover and evaluate high-yield real estate opportunities.

This frontend powers:

- 🔎 AI Property Search with Smart Filtering  
- 💸 FXCT Token Ecosystem & Utility Pages  
- 🧠 Smart Return Calculator  
- 📈 Investor Dashboard (token-based access)  
- 📬 Contact & Account Management Workflows  
- 🛠 Fully responsive UI  
- 🛡️ Privacy-first: GDPR/Cookie-compliant setup  

---

## 🧪 Tech Stack

- **React 18** with Hooks & Context  
- **Vite** for lightning-fast builds  
- **Tailwind CSS** for utility-first styling  
- **Framer Motion** for animations  
- **Lucide Icons** / **React Icons**  
- Integration with **OpenAI API**, **Zillow RapidAPI**, and a **custom backend API**

---

## 📂 Feature-Based Folder Structure

We've migrated to a modern **feature-based architecture** for better scalability and maintainability:

```bash
src/
├── assets/                 # Static assets & logos
├── features/               # Feature-based organization
│   ├── admin/             # ✅ Admin dashboard & management
│   │   ├── components/    # Admin UI components
│   │   └── pages/         # Admin-specific pages
│   ├── user-dashboard/    # ✅ User dashboard & portfolio
│   │   ├── components/    # Dashboard components
│   │   └── pages/         # User dashboard pages
│   ├── ai-search/         # ✅ AI-powered property search
│   │   ├── components/    # Search & filter components
│   │   └── pages/         # Search result pages
│   ├── marketing/         # ✅ Homepage & marketing pages
│   │   ├── components/    # Hero, CTA, feature sections
│   │   └── pages/         # Marketing pages
│   ├── marketplace/       # ✅ Property marketplace
│   │   ├── components/    # Property cards, filters, maps
│   │   └── pages/         # Marketplace & property details
│   └── auth/              # ✅ Authentication & access control
│       ├── components/    # Auth-related components
│       └── pages/         # Login, signup pages
├── shared/                 # ✅ Shared resources
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── styles/                 # Global Tailwind & custom styles
└── main.jsx               # Root entry point
```

### 🎯 Migration Status

- ✅ **Admin Feature**: Complete (components, pages, barrel exports)
- ✅ **User Dashboard Feature**: Complete (components, pages, barrel exports)
- ✅ **AI Search Feature**: Complete (components, pages)
- ✅ **Marketing Feature**: Complete (components, pages, barrel exports)
- ✅ **Marketplace Feature**: Complete (components, pages, barrel exports)
- ✅ **Auth Feature**: Complete (components, pages, barrel exports)
- ✅ **Shared Resources**: Complete (components, hooks, utils with barrel exports)

### 🔄 Clean Import System

Each feature includes barrel exports (`index.js`) for clean imports:

```javascript
// Import from feature-specific barrels
import { DashboardHeader, StatCard } from 'src/features/user-dashboard/components';
import { PropertyCard, FilterPanel } from 'src/features/marketplace/components';
import { Button, Modal } from 'src/shared/components';
```

---

🛠 Getting Started

git clone https://github.com/Lorenzo-Code/FractionaX-frontend.git
cd FractionaX-frontend
npm install
npm run dev

🧾 Environment Variables
Create a .env file at the root with:
VITE_CLIENT_ID=your-client-id
VITE_CLIENT_SECRET=your-client-secret

🔐 Auth & Routing
🔒 Secure pages (e.g., /dashboard) require login

✅ /success displays account creation confirmation

📬 Pages like /login, /contact, /terms, and /privacy are fully integrated

📦 Deployment
We use Cloudflare Pages for production deployment.
Pushes to the main branch trigger automatic builds.

📄 License
© 2025 FractionaX, LLC. All rights reserved.


---

### 💡 Final Tips:
- Replace `{currentYear}` with `2025` unless you use JS interpolation in a build system.
- Add a `📸 Screenshots` or `🌐 Live Demo` section when ready.
- Consider a `CONTRIBUTING.md` later for team onboarding.

Would you like me to generate and save this updated version to your `README.md` file?
