# FractionaX Frontend

Welcome to the official frontend repository for **FractionaX**, a next-gen AI-powered real estate investment platform.

This project is built using **React + Vite**, delivering fast performance, modular components, and a clean developer experience.

---

## 🚀 Project Overview

FractionaX combines blockchain, AI, and data-driven tools to help users discover and evaluate high-yield real estate opportunities.

This frontend powers:

- 🔎 AI Property Search with Smart Filtering  
- 💸 FCT Token Ecosystem & Utility Pages  
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

## 📂 Folder Structure

```bash
src/
├── assets/              # Static assets & logos
├── components/
│   ├── homepage/        # Hero, search, CTA
│   ├── layout/          # Footer, NavBar
│   ├── marketplace/     # Property cards, filters
│   └── shared/          # UI elements, buttons
├── pages/               # Route-based views
├── styles/              # Global Tailwind & custom styles
├── utils/               # ScrollToTop, formatters
└── main.jsx             # Root entry point

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
