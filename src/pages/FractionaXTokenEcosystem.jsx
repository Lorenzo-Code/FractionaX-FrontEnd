import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/common/Footer";
import PreSaleModal from "../components/ecosystem/PreSaleModal";
import SEO from '../components/SEO';
import { generatePageSEO, generateStructuredData } from '../utils/seo';

// Token Allocation Data
const allocationData = [
  { name: "Pre-Sale", value: 3.5 },
  { name: "Liquidity Pool", value: 2 },
  { name: "Operations Reserve", value: 25 },
  { name: "Founders", value: 20 },
  { name: "Employee Incentives", value: 10 },
  { name: "Ecosystem Growth", value: 39.5 },
];

// Modernized Color Palette
const COLORS = [
  "#3B82F6", // Blue-500 (Primary)
  "#10B981", // Emerald-500 (Growth)
  "#F59E0B", // Amber-500 (Allocation)
  "#EF4444", // Red-500 (Burn)
  "#6366F1", // Indigo-500 (Governance)
  "#14B8A6"  // Teal-500 (Utility)
];

export default function FractionaXTokenEcosystem() {
  const seoData = generatePageSEO({
    title: "FractionaX Token Ecosystem",
    description: "Explore the FractionaX token ecosystem including FXCT pre-sale, token allocation, live metrics, and market activity.",
    url: "/token-ecosystem",
    keywords: ["token ecosystem", "FXCT pre-sale", "token metrics", "blockchain analytics"]
  });
  const structuredData = generateStructuredData.organization();

  const [metrics, setMetrics] = useState({
    totalSupply: "Loading...",
    circulatingSupply: "Loading...",
    burned: "Loading...",
    tokenizedAssets: "Loading...",
    collateralRatio: "Loading...",
    lastBurn: "Loading..."
  });

  const [market, setMarket] = useState({
    price: null,
    volume: null,
    priceChange24h: null
  });

  const [showFeed, setShowFeed] = useState(true);
  const toggleFeed = () => setShowFeed(!showFeed);
  const [activity, setActivity] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreSaleModal, setShowPreSaleModal] = useState(false);


  const [presale, setPresale] = useState({
    currentPrice: null,
    tokensAvailable: null,
    softCap: null,
    hardCap: null,
    totalRaised: null
  });


  // Fetch Presale Stats
  useEffect(() => {
    async function fetchPresale() {
      try {
        const res = await fetch("https://api.fractionax.io/presale");
        const data = await res.json();
        setPresale({
          currentPrice: data.currentPrice,
          tokensAvailable: data.tokensAvailable,
          softCap: data.softCap,
          hardCap: data.hardCap,
          totalRaised: data.totalRaised
        });
      } catch (err) {
        console.error("Failed to fetch presale data", err);
      }
    }

    fetchPresale();
    const interval = setInterval(fetchPresale, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Live Metrics + Contract Activity
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("https://api.fractionax.io/metrics");
        const data = await res.json();
        setMetrics({
          totalSupply: data.totalSupply ?? "Unavailable",
          circulatingSupply: data.circulatingSupply ?? "Unavailable",
          burned: data.burned ?? "Unavailable",
          tokenizedAssets: data.tokenizedAssets ?? "Unavailable",
          collateralRatio: data.collateralRatio ?? "Unavailable",
          lastBurn: data.lastBurn ?? "Unavailable"
        });
        setMarket({
          price: data.marketPrice ?? null,
          volume: data.marketVolume ?? null,
          priceChange24h: data.priceChange24h ?? null
        });
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await fetch("https://api.fractionax.io/activity");
        const data = await res.json();
        setActivity(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
        setActivity([]);
      }
    };

    fetchMetrics();
    fetchActivity();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchActivity();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();
  const getIcon = (type) => {
    switch (type) {
      case "burn": return "🔥";
      case "transfer": return "🧾";
      case "mint": return "🪙";
      default: return "📄";
    }
  };
  const getColor = (type) => {
    switch (type) {
      case "burn": return "bg-red-100 text-red-800";
      case "transfer": return "bg-blue-100 text-blue-800";
      case "mint": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <SEO {...seoData} structuredData={structuredData} />
      <div className="p-6 md:p-12 max-w-6xl mx-auto text-gray-800">
        <h1 className="text-3xl font-bold mb-6">FractionaX Token Ecosystem</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">🚀 FXCT Token Pre-Sale</h2>
          <p className="mb-4 text-gray-700">
            Be among the first to own FXCT — the utility token powering the FractionaX ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Token Price</p>
              <p className="text-lg font-bold">
                {presale.currentPrice ? `$${parseFloat(presale.currentPrice).toFixed(2)} / FXCT` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-lg font-bold">
                {presale.tokensAvailable ? presale.tokensAvailable.toLocaleString() + " FXCT" : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Soft Cap</p>
              <p className="text-lg font-bold">
                {presale.softCap ? `$${parseFloat(presale.softCap).toLocaleString()}` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Hard Cap</p>
              <p className="text-lg font-bold">
                {presale.hardCap ? `$${parseFloat(presale.hardCap).toLocaleString()}` : "Loading..."}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowPreSaleModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition"
            >
              Join the Pre-Sale
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Raised: {presale.totalRaised ? `$${parseFloat(presale.totalRaised).toLocaleString()}` : "Loading..."}
            </p>
          </div>
        </section>


        {/* Market Stats Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">FXCT Market Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Current Price (USD)</p>
              <p className="font-semibold">
                {market.price !== null ? `$${parseFloat(market.price).toFixed(4)}` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">24h Volume</p>
              <p className="font-semibold">
                {market.volume !== null ? `$${parseFloat(market.volume).toLocaleString()}` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="font-semibold">
                {market.price !== null && !isNaN(parseFloat(metrics.circulatingSupply))
                  ? `$${(market.price * parseFloat(metrics.circulatingSupply)).toLocaleString()}`
                  : "Loading..."}
              </p>
            </div>
            {market.priceChange24h !== null && (
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="text-sm text-gray-500">24h Change</p>
                <p className={`font-semibold ${market.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(market.priceChange24h).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-gray-400 mt-2">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </section>
        {/* Advanced Stats Toggle */}
        <section className="mb-6 text-center">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Advanced Stats</h2>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 underline font-medium hover:text-blue-800"
            >
              {showAdvanced ? "Hide Advanced Token Stats" : "Show Advanced Token Stats"}
            </button>
          </div>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.30 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">FXCT Total Supply</p>
                    <p className="font-semibold">{metrics.totalSupply}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Circulating Supply</p>
                    <p className="font-semibold">{metrics.circulatingSupply}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">FXCT Burned</p>
                    <p className="font-semibold">{metrics.burned}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">FST Tokenized Assets</p>
                    <p className="font-semibold">{metrics.tokenizedAssets}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Collateral Ratio</p>
                    <p className="font-semibold">{metrics.collateralRatio}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Last Burn Event</p>
                    <p className="font-semibold">{metrics.lastBurn}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        {/* Token Allocation Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">📊 FXCT Token Allocation</h2>
          <p className="text-sm text-gray-600 mb-6">
            The total supply of <span className="font-bold text-blue-700">1 billion FXCT</span> is distributed across strategic categories to ensure long-term growth, platform sustainability, and community participation.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={3}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={true}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "0.85rem" }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Clean Table with color + spacing */}
            <div className="text-sm w-full">
              <table className="w-full border border-gray-200 rounded overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-2">Category</th>
                    <th className="text-left px-4 py-2">Allocation</th>
                    <th className="text-left px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#3B82F6" }}></span>
                      <span className="text-blue-700">Pre-Sale</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">3.5%</td>
                    <td className="px-4 py-3">Raise $750k to 1.5m at $0.10 per FXCT</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#10B981" }}></span>
                      <span className="text-blue-700">Liquidity Pool</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">5% (by Year 5)</td>
                    <td className="px-4 py-3">Starts at 2% in Year 1; grows with platform adoption</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#F59E0B" }}></span>
                      <span className="text-blue-700">Operations Reserve</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">25%</td>
                    <td className="px-4 py-3">Marketing, partnerships, legal, growth</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#EF4444" }}></span>
                      <span className="text-blue-700">Founders</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">20%</td>
                    <td className="px-4 py-3">4-year vesting with 1-year cliff</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#6366F1" }}></span>
                      <span className="text-blue-700">Employee Incentives</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">10%</td>
                    <td className="px-4 py-3">Team rewards, hiring, bounties</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#14B8A6" }}></span>
                      <span className="text-blue-700">Ecosystem Growth</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">39.5%</td>
                    <td className="px-4 py-3">Staking rewards, partner grants, community incentives</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
               {/* FXCT Treasury & Utility Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-black">💰 FXCT Fundraising, Utility & Burn Strategy</h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            FXCT is built to serve real utility inside the FractionaX ecosystem — from accessing premium features to reducing fees — while simultaneously powering treasury growth through usage and fundraising mechanics.
          </p>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {/* Fundraising Strategy */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">🎯 Fundraising Breakdown</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-2">
                <li><strong>Raise Goal:</strong> $750K to $1.25M via up to 35M FXCT tokens (~3.5% of total supply)</li>
                <li><strong>Pre-Sale Pricing:</strong> $0.035–$0.07 per token (tiered by contribution size)</li>
                <li><strong>Launch Price:</strong> $0.10 per token (Phase 2)</li>
                <li><strong>Minimum Soft Cap:</strong> $250K (rollover/refund policy if not met)</li>
                <li><strong>Future Rounds:</strong> Community Sale, Strategic Round, DAO Allocation</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                All proceeds go toward liquidity, platform development, security audits, and user onboarding.
              </p>
            </div>

            {/* Liquidity & Treasury Model */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">💧 Liquidity & Collateralization</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-2">
                <li>🚀 Initial Pool: 20M FXCT + $1.6M USDC (1:1 ratio)</li>
                <li>🔐 5% of supply locked by Year 3</li>
                <li>📈 1.5:1 collateral ratio target by Year 5</li>
                <li>🛡️ Treasury includes stablecoins, crypto, and FXST-backed real estate</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                We do what most projects don’t — back our utility token with real reserves from Day 1.
              </p>
            </div>
          </div>
        </section>

        {/* FXCT Utility, Burn, & Verification Model */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-black">🔥 FXCT Token Utility, Burn & Verification Model</h2>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            FXCT is designed to drive real usage — while being deflationary, fee-powered, and transparently governed via smart contract.
          </p>

          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔥 30% Burn on Platform Usage:</span>
                30% of FXCT used for AI search, subscriptions, and tools is permanently burned — reducing supply.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">💼 70% Treasury Allocation:</span>
                The other 70% funds operations, audits, rewards, and strategic growth via the treasury.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔁 Smart Fee Model:</span>
                Transfers are subject to 1% minimum and a $5.00 USD cap. Large volume = higher support to ecosystem.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔒 45-Day Subscription Lock:</span>
                Discounted FXCT from subscriptions is non-transferable for the first 45 days.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">📊 Treasury Diversification:</span>
                Assets include USDC, ETH, blue-chip crypto, FXST real estate holdings, and select securities.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔗 Auditable on Base:</span>
                All fees, burns, and treasury movements are published monthly and trackable on BaseScan.
              </p>
            </li>
          </ul>

          <div className="mt-6 text-sm">
            🔗 <a
              href="https://basescan.org/address/0xYourTokenAddress#tokentxns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View FXCT burn & fee activity on BaseScan
            </a>
          </div>

          <div className="mt-4 text-sm">
            📄 <a
              href="/docs/SmartContractAudit.pdf"
              download
              className="text-blue-600 hover:underline"
            >
              Download Smart Contract Audit (PDF)
            </a>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            <strong>Why it matters:</strong> Every dollar raised and token burned is traceable. FXCT was designed to reward utility — not hype.
          </p>
        </section>

        {/* Smart Contract Verification Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-black">🔐 Smart Contract Verification</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            FXCT and FXST contracts are live on the Base network and fully verifiable. These contracts govern token supply, fees, locks, and usage permissions.
          </p>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div className="border border-blue-100 rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-600">FXCT Token Contract</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Verified</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Contract Address: <span className="font-mono">0xYourFXCTAddress</span></p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Utility Token</span> — grants access to AI reports, staking, and discounted platform fees.
              </p>
              <a
                href="https://basescan.org/token/0xYourFXCTAddress"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View on BaseScan
              </a>
            </div>

            <div className="border border-blue-100 rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-600">FXST Token Contract</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Verified</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Contract Address: <span className="font-mono">0xYourFXSTAddress</span></p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Security Token</span> — represents fractionalized real estate ownership and income rights.
              </p>
              <a
                href="https://basescan.org/token/0xYourFXSTAddress"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View on BaseScan
              </a>
            </div>
          </div>

          <div className="mt-6 text-sm">
            📄 <a
              href="/docs/SmartContractAudit.pdf"
              download
              className="text-blue-600 hover:underline"
            >
              Download Smart Contract Audit PDF
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            These contracts are immutable and verified. Status: <span className="text-green-600 font-medium">Audited, Public, and Compliant</span>.
          </p>

          <div className="mt-8">
            <button
              onClick={toggleFeed}
              className="text-sm text-blue-600 underline hover:text-blue-800 transition"
            >
              {showFeed ? "Hide Live Activity" : "Show Live Activity Feed"}
            </button>
            <AnimatePresence>
              {showFeed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <p className="text-sm text-gray-500 mb-3">Auto-refreshes every 15 seconds</p>
                    <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {activity.map((item, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 p-3 rounded-md shadow-sm flex items-start gap-3"
                        >
                          <div className={`text-lg ${getColor(item.type)} px-2 py-1 rounded-full font-bold`}>
                            {getIcon(item.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.description}</p>
                            <p className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-black">🚀 FractionaX Roadmap</h2>
          <div className="space-y-8 relative border-l-4 border-blue-500 pl-6">

            <div className="relative">
              <h3 className="text-blue-700 font-semibold text-lg">Q3 2025 — Launch Phase</h3>
              <p className="text-gray-700 text-sm mt-1">🌐 Official launch of FXCT token and live deployment of the FractionaX ecosystem dashboard.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Token generation and distribution via presale</li>
                <li>Ecosystem page with live metrics, supply tracking</li>
                <li>Smart contract verification (HashScan)</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-emerald-600 font-semibold text-lg">Q4 2025 — Utility Activation</h3>
              <p className="text-gray-700 text-sm mt-1">🧠 Launch of AI-driven investment tools and real-time FXCT burn tracking.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Smart AI Property Search (FXCT-powered)</li>
                <li>Real-time token burn and usage stats</li>
                <li>Release of public whitepaper and staking teaser</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-indigo-600 font-semibold text-lg">Q1 2026 — Governance Framework</h3>
              <p className="text-gray-700 text-sm mt-1">📜 Begin rollout of DAO tooling, voting modules, and on-chain proposals.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>DAO portal (submit/view/vote proposals)</li>
                <li>Delegate voting preview and token locking</li>
                <li>Legal framework for early governance</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-yellow-600 font-semibold text-lg">Q2 2026 — Reg CF Expansion</h3>
              <p className="text-gray-700 text-sm mt-1">💼 Begin onboarding real-world tokenized offerings via FXST using Reg CF.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Fractional property onboarding tools</li>
                <li>Begin first tokenized real estate campaigns</li>
                <li>Early retail investor access via KYC portal</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-purple-600 font-semibold text-lg">Q3 2026 — Marketplace & Yield</h3>
              <p className="text-gray-700 text-sm mt-1">🏘 Launch of the full investment marketplace and real-time asset tracking.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Marketplace live with FST asset listings</li>
                <li>Wallet integration for live yield tracking</li>
                <li>Launch of staking + burn leaderboard</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-pink-600 font-semibold text-lg">Q4 2026 — Global Scale & Compliance</h3>
              <p className="text-gray-700 text-sm mt-1">📱 Final launch of mobile experience, VASP compliance certification, and global reach.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Mobile app beta release (iOS + Android)</li>
                <li>Global KYC/AML & VASP integrations</li>
                <li>Smart contract upgrade audit and decentralization steps</li>
              </ul>
            </div>
          </div>
        </section>
        {/* Coming Soon Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-black">🌟 What’s Coming to FractionaX</h2>
          <p className="text-gray-700 mb-6 max-w-3xl">
            The journey has just begun. We’re building an ecosystem designed to unlock real financial opportunities, empower token holders, and redefine access to fractional ownership. Here's a glimpse of what’s ahead:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
              <h3 className="text-blue-600 font-semibold text-lg">🗳 DAO-Based Governance</h3>
              <p className="text-sm text-gray-600 mt-2">
                Community voting for proposals, treasury decisions, and protocol upgrades. FXCT holders will gain real influence over the ecosystem’s future.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
              <h3 className="text-green-600 font-semibold text-lg">💰 Staking Tiers & Bonuses</h3>
              <p className="text-sm text-gray-600 mt-2">
                Earn yield and exclusive platform perks by locking your FXCT. Higher tiers unlock voting power, partner rewards, and early access.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
              <h3 className="text-yellow-600 font-semibold text-lg">📈 Reg A+ Expansion</h3>
              <p className="text-sm text-gray-600 mt-2">
                Launching a $75M/year equity offering to bring real estate ownership to thousands of investors, fully SEC-compliant.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
              <h3 className="text-purple-600 font-semibold text-lg">🔁 FST Trading on ATS</h3>
              <p className="text-sm text-gray-600 mt-2">
                Secondary trading for real estate-backed tokens (FST) on FINRA-registered ATS platforms like INX and tZERO.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
              <h3 className="text-red-600 font-semibold text-lg">🔥 Burn Dashboard & Reserves</h3>
              <p className="text-sm text-gray-600 mt-2">
                View real-time token burns, treasury allocations, and wallet reserves in one transparent, public interface.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-teal-500">
              <h3 className="text-teal-600 font-semibold text-lg">📱 Mobile App</h3>
              <p className="text-sm text-gray-600 mt-2">
                Access the entire FractionaX platform on iOS & Android: track investments, vote, stake, and explore deals on the go.
              </p>
            </div>
          </div>
        </section>
        {/* Downloads Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-black">📄 Downloadable Documents</h2>
          <p className="text-gray-700 mb-4">
            Access our most up-to-date documents for due diligence, transparency, and project understanding.
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm text-gray-700">
            <li>
              <a href="/docs/FractionaX_Whitepaper.pdf" download className="text-blue-600 hover:underline font-medium">
                FractionaX Whitepaper
              </a> — Comprehensive overview of the FractionaX protocol, goals, mechanics, and token strategy.
            </li>
            <li>
              <a href="/docs/Tokenomics_FXCT.pdf" download className="text-blue-600 hover:underline font-medium">
                Tokenomics Overview
              </a> — Visual breakdown of supply, utility, and allocation schedules for FXCT and FST.
            </li>
            <li>
              <a href="/docs/SmartContractAudit.pdf" download className="text-blue-600 hover:underline font-medium">
                Smart Contract Audit (FXCT)
              </a> — Security review of the FXCT token contracts and transfer logic.
            </li>
            <li>
              <a href="/docs/FractionaX_BusinessPlan.pdf" download className="text-blue-600 hover:underline font-medium">
                Business Plan
              </a> — Financial model, use of funds, milestones, and growth forecasts.
            </li>
            <li>
              <a href="/docs/FractionaX_PitchDeck.pdf" download className="text-blue-600 hover:underline font-medium">
                Investor Pitch Deck
              </a> — Quick overview for early-stage VCs, angels, and crowdfunding backers.
            </li>
            <li>
              <a href="/docs/Legal_Disclaimers.pdf" download className="text-blue-600 hover:underline font-medium">
                Legal Disclaimers & Terms
              </a> — Policies, user protections, jurisdiction disclosures, and risk factors.
            </li>
            <li>
              <a href="/docs/FractionaX_Litepaper.pdf" download className="text-blue-600 hover:underline font-medium">
                Litepaper (Short Version)
              </a> — A simplified summary of our project for faster understanding.
            </li>
          </ul>
        </section>
        <PreSaleModal isOpen={showPreSaleModal} onClose={() => setShowPreSaleModal(false)} />
      </div>
      <Footer />
    </div>
  );
}
