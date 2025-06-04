// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./utils/ScrollToTop";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";

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
        </Routes>
      </div>
    </>
  );
}

export default App;
