import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, TrendingUp, Clock, Shield, Star } from "lucide-react";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", or ""
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_BASE_API_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setMessage("");

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
  const res = await fetch(`${API_BASE}/api/email/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  let data = {};
  try {
    const text = await res.text(); // ✅ Safe fallback
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.warn("⚠️ Response was not valid JSON.");
  }

  if (res.ok) {
    setStatus("success");
    setMessage("✅ You're subscribed!");
    setEmail("");
  } else {
    setStatus("error");
    setMessage(data?.error || "❌ Something went wrong. Try again.");
  }
} catch (err) {
  console.error("❌ Subscription failed:", err);
  setStatus("error");
  setMessage("❌ Network error. Please try again later.");
}

  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-5xl mx-auto text-center text-white relative z-10">
        {/* Beta launch banner */}
        <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <Star className="w-4 h-4" />
          <span>Beta Testing Phase: November 2024</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Don't Let Another Great Deal
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
            Slip Away
          </span>
        </h2>
        
        <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
          While you're manually searching Zillow, smart investors are using AI to find and analyze the best deals first. Join them.
        </p>

        {/* Value propositions */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">NOV</div>
            <div className="text-sm text-gray-400">Beta Testing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">100%</div>
            <div className="text-sm text-gray-400">Blockchain Secured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">AI</div>
            <div className="text-sm text-gray-400">Advanced Analysis</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Primary CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-green-400 text-sm font-semibold mb-2">🎯 RECOMMENDED</div>
            <h3 className="text-2xl font-bold mb-4">Start Finding Profitable Deals Today</h3>
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>5 free AI property searches</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Instant ROI analysis & market insights</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
            
            <Link to="/login" className="block w-full">
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
                Start Free Trial Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            
            <p className="text-xs text-gray-400 mt-3">Get started in under 30 seconds</p>
          </div>

          {/* Right side - Email capture */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-4">Get Weekly Deal Alerts</h3>
            <p className="text-gray-300 mb-6">Join our beta testing program in November and get exclusive early access.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Get Weekly Alerts
              </button>
            </form>
            
            {status && (
              <p className={`text-sm mt-4 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
            
            <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
        
        {/* Secondary CTA */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-gray-300 mb-4">Want to see pricing first?</p>
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            View Pricing Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Beta Testing Program</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Secure Blockchain Technology</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
