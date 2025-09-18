import React, { useState } from "react";
import { Facebook, X, Instagram, Linkedin } from "lucide-react"; // 👈 make sure this is correct
import logo from "/assets/images/MainLogo1.webp";
import { Link, useLocation } from "react-router-dom";
import { smartFetch } from '../utils';


// Safe Link component that handles router context issues
const SafeLink = ({ to, children, className, ...props }) => {
  try {
    // Test if we have router context
    useLocation();
    return <Link to={to} className={className} {...props}>{children}</Link>;
  } catch (error) {
    // If router context is not available, render as anchor tag
    return <a href={to} className={className} {...props}>{children}</a>;
  }
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_BASE_API_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setMessage("");

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("❌ Please enter a valid email.");
      return;
    }

    try {
      const res = await smartFetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        console.warn("⚠️ Response was not valid JSON.");
      }

      if (res.ok) {
        setStatus("success");
        setMessage("✅ You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data?.error || "❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("❌ Subscription failed:", err);
      setStatus("error");
      setMessage("❌ Network error. Please try again.");
    }
  };


  return (
    <footer className="bg-[#191d2b] text-white md:pt-8 pb-6 -mb-4">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-[7rem] md:mb-[3rem]">
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center md:items-start">
            <SafeLink to="/">
              <img src={logo} alt="FractionaX Logo" className="w-48 -mb-3" />
            </SafeLink>
            <p className="text-sm text-gray-400 text-center md:text-left">
              AI-powered real estate investing. Backed by data. Powered by FXCT. Built for smart investors.
            </p>
          </div>

          {/* Column 2: Company + Resources */}
          <div className="flex flex-row gap-8 w-full">
            <div className="w-1/2">
              <h6 className="text-lg font-bold mb-4">Company</h6>
              <ul className="space-y-2 text-sm">
                <li><SafeLink to="/faq" className="hover:text-blue-500 transition">FAQ</SafeLink></li>
                <li><SafeLink to="/contact" className="hover:text-blue-500 transition">Contact</SafeLink></li>
                <li><SafeLink to="/careers" className="hover:text-blue-500 transition">Careers</SafeLink></li>
                <li><SafeLink to="/blog" className="hover:text-blue-500 transition">Blog</SafeLink></li>
              </ul>
            </div>
            <div>
              <h6 className="text-lg font-bold mb-4">Platform</h6>
              <ul className="space-y-2 text-sm">
                <li><SafeLink to="/pre-sale" className="hover:text-blue-500 transition">FXCT Pre-Sale</SafeLink></li>
                <li><SafeLink to="/investment-protocols" className="hover:text-blue-500 transition">Investment Protocols</SafeLink></li>
                <li><SafeLink to="/legal/token-terms" className="hover:text-blue-500 transition">FXTokens Terms</SafeLink></li>
                <li><SafeLink to="/property-intelligence-demo" className="hover:text-blue-500 transition">AI Demo</SafeLink></li>
                <li className="block md:hidden">
                  <SafeLink to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</SafeLink>
                </li>
                <li className="block md:hidden">
                  <SafeLink to="/terms" className="hover:text-blue-500 transition">Terms & Conditions</SafeLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter Signup */}
          <div>
            <div className="flex flex-row justify-between items-center mb-4">
              <h6 className="text-lg font-bold">Stay in the Loop</h6>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row items-center md:items-stretch mb-4 space-y-3 md:space-y-0 md:space-x-2"
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-[300px] lg:w-[400px] px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded transition"
              >
                Subscribe
              </button>
            </form>

            {status && (
              <p className={`text-sm mb-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            <p className="text-sm text-gray-400 mb-4">
              Join our early access list for updates and perks.
            </p>

            <div className="flex gap-4 text-gray-300">
              <a href="https://www.facebook.com/profile.php?id=61578735023640" target="_blank" rel="noreferrer" className="hover:text-blue-500">
                <Facebook size={18} />
              </a>
              {/* <a href="https://instagram.com/FractionaX" target="_blank" rel="noreferrer" className="hover:text-blue-500"><Instagram size={18} /></a> */}
              <a href="https://twitter.com/FractionaX" target="_blank" rel="noreferrer" className="hover:text-blue-500">
                <X size={18} />
              </a>
              <a href="https://linkedin.com/company/fractionax" target="_blank" rel="noreferrer" className="hover:text-blue-500">
                <Linkedin size={18} /> {/* ✅ Fixed typo */}
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="border-gray-700 my-2" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 mt-4">
          <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} FractionaX. All rights reserved.</p>
          <div className="hidden sm:flex space-x-4">
            <SafeLink to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</SafeLink>
            <SafeLink to="/terms" className="hover:text-blue-400 transition">Terms & Conditions</SafeLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
