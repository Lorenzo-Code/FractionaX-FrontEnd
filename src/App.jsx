import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import FCTLandingPage from "./pages/FCTLandingPage.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import DocsPage from "./pages/DocsPage.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gray-50 text-gray-900 font-sans">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/fct" element={<FCTLandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

// export default function App() {
//   return (
//     <div className="relative z-10 text-white p-10">
//       <h1 className="text-4xl font-bold">Welcome to FractionaX</h1>
//       <p className="mt-4 text-lg">Powerful investing, simplified.</p>
//     </div>
//   );
// }
