import React, { useState, useMemo } from 'react';
import PropertyIntelligencePanel from '../components/PropertyIntelligencePanel';
import PremiumUpgradeModal from '../components/PremiumUpgradeModal';
import { mockComprehensivePropertyData } from '../mockData/comprehensivePropertyData';

const PropertyIntelligenceDemo = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentDemo, setCurrentDemo] = useState('basic');
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Basic demo data (existing format)
  const basicDemoData = {
    property: {
      address: "1234 Oak Street, Austin, TX 78704",
      beds: 3,
      baths: 2,
      sqft: 1748,
      price: 425000
    },
    priceAnalytics: {
      streetAverage: 410000,
      areaAverage: 445000,
      zipCodeAverage: 385000,
      marketTrend: "Rising",
      marketInsights: [
        "Property is priced 3.7% above street average",
        "Area showing strong growth patterns",
        "Comparable homes selling within 30 days"
      ]
    },
    nearbyHighValue: [
      {
        name: "Whole Foods Market",
        types: ["grocery_store", "supermarket"],
        address: "1678 South Lamar Blvd, Austin, TX",
        distance: 800,
        rating: 4.2,
        walkTime: "10 min"
      },
      {
        name: "Zilker Park",
        types: ["park"],
        address: "2100 Barton Springs Rd, Austin, TX",
        distance: 1200,
        rating: 4.8
      },
      {
        name: "University of Texas",
        types: ["university"],
        address: "110 Inner Campus Dr, Austin, TX",
        distance: 2500,
        rating: 4.5
      }
    ],
    majorEmployers: [
      {
        name: "Dell Technologies",
        industry: "Technology",
        employees: 15000,
        distance: 5000,
        description: "Leading technology corporation providing end-to-end solutions",
        commute: { time: "25 min" }
      },
      {
        name: "IBM Austin",
        industry: "Technology",
        employees: 8500,
        distance: 4200,
        description: "Global technology and consulting company",
        commute: { time: "22 min" }
      }
    ],
    locationScore: {
      overall: 85,
      breakdown: {
        walkability: 78,
        transit: 65,
        amenities: 92,
        schools: 88
      }
    }
  };

  // Comprehensive demo data (new backend format)
  const comprehensiveDemoData = {
    ...basicDemoData,
    comprehensiveData: mockComprehensivePropertyData
  };

  const handleOpenDemo = (demoType) => {
    setCurrentDemo(demoType);
    setShowPanel(true);
  };

  const handlePremiumFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setShowUpgradeModal(true);
  };

  const getCurrentDemoData = () => {
    return currentDemo === 'comprehensive' ? comprehensiveDemoData : basicDemoData;
  };

  // 7-day average USD price per FXCT (placeholder; fetch from backend)
  const [fxctUsd7d, setFxctUsd7d] = useState(0.50);
  const [creditsInput, setCreditsInput] = useState(25);
  const [fxctInput, setFxctInput] = useState(50);

  // Derived conversions assuming 1 Credit = $1.00 USD
  const fxctForCredits = useMemo(() => {
    if (!fxctUsd7d || fxctUsd7d <= 0) return 0;
    return creditsInput / fxctUsd7d;
  }, [creditsInput, fxctUsd7d]);

  const creditsForFxct = useMemo(() => {
    return fxctInput * fxctUsd7d;
  }, [fxctInput, fxctUsd7d]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Property Intelligence Reports
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-4xl mx-auto">
              Experience our AI-powered property analysis reports. From basic insights to comprehensive investment intelligence - see what each report type delivers.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🆓</span>
                <span>Free Basic Reports</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">💎</span>
                <span>Premium Intelligence</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏢</span>
                <span>Enterprise Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Selection and Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Choose Your Report and Preview
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-3xl mx-auto">Select a report tier below to see a live preview of the insights included.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="border border-gray-200 rounded-lg p-6 relative">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Basic Report</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">FREE</p>
                <p className="text-gray-500 text-sm">Always available</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Property overview & pricing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Nearby locations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Major employers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Basic location scoring</span>
                </li>
              </ul>
              <button
                onClick={() => handleOpenDemo('basic')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Free Report
              </button>
            </div>

            {/* Premium Tier */}
            <div className="border-2 border-blue-500 rounded-lg p-6 relative bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Premium Report</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-blue-600">25 Credits</span>
                  <p className="text-gray-500 text-sm">Professional analysis</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm font-medium">Everything in Basic</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">🛡️</span>
                  <span className="text-sm">Climate risk analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">🏠</span>
                  <span className="text-sm">Building intelligence</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">💰</span>
                  <span className="text-sm">Financial data & taxes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-500">📊</span>
                  <span className="text-sm">Investment analysis</span>
                </li>
              </ul>
              <button
                onClick={() => handleOpenDemo('comprehensive')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-semibold"
              >
                Try Premium Report
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="border border-gray-200 rounded-lg p-6 relative bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Enterprise Report</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-purple-600">50 Credits</span>
                  <p className="text-gray-500 text-sm">Complete analysis</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm font-medium">Everything in Premium</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">🔍</span>
                  <span className="text-sm">AI roof analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">⛈️</span>
                  <span className="text-sm">Weather event history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">💎</span>
                  <span className="text-sm">Reconstruction cost analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">📈</span>
                  <span className="text-sm">Portfolio correlation</span>
                </li>
              </ul>
              <button
                onClick={() => handlePremiumFeatureClick('enterprise')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
              >
                Try Enterprise Report
              </button>
            </div>
          </div>
        </div>


        {/* How Billing Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">How Billing Works</h2>
          <div className="max-w-3xl mx-auto text-gray-700 text-sm space-y-3">
            <p>• Reports are priced in Credits. Credits are issued and spent automatically in the background when you buy a report.</p>
            <p>• At checkout you'll see: <span className="font-semibold">1 report = 25 Credits</span> with a live FXCT estimate using the 7‑day average.</p>
            <p>• Users cannot convert Credits into FXCT. Credits are only obtained by: (1) buying a multipack, or (2) being issued by an admin.</p>
            <p className="text-xs text-gray-500">FXCT estimates use a 7‑day average rate; the FXCT total is locked briefly during checkout.</p>
          </div>
        </div>

        {/* Multipacks (Optional) */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Multipacks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Starter Pack</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">5 Reports</p>
              <p className="text-gray-600">125 Credits</p>
              <button className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">Purchase Multipack</button>
            </div>
            <div className="border-2 border-blue-400 rounded-xl p-6 text-center bg-blue-50 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Popular</span>
              <h3 className="text-lg font-semibold text-gray-900">Pro Pack</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">10 Reports</p>
              <p className="text-gray-600">250 Credits</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Purchase Multipack</button>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Team Pack</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">25 Reports</p>
              <p className="text-gray-600">625 Credits</p>
              <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">Purchase Multipack</button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">Credits are deposited into your account and redeemed automatically at checkout.</p>
        </div>

        {/* Coming Soon - Portfolio Rebalancing */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">Coming Soon: AI Portfolio Rebalancing</h2>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Get your crypto portfolio analyzed and rebalanced by AI based on your risk tolerance and investment goals. Starting with FXCT/FXST holdings, expanding to your entire connected wallet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="text-yellow-500 mr-2">📊</span>
                  Portfolio Analysis
                </h3>
                <ul className="text-sm text-gray-300 space-y-2 text-left">
                  <li>• Risk assessment of current holdings</li>
                  <li>• Goal alignment analysis</li>
                  <li>• Performance optimization recommendations</li>
                  <li>• Diversification insights</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-yellow-500 font-semibold">~15 Credits</span>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="text-blue-400 mr-2">⚖️</span>
                  AI Rebalancing
                </h3>
                <ul className="text-sm text-gray-300 space-y-2 text-left">
                  <li>• Automated rebalancing recommendations</li>
                  <li>• Tax-optimized trade suggestions</li>
                  <li>• Phase 1: FXCT/FXST optimization</li>
                  <li>• Phase 2: Full wallet integration</li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="text-blue-400 font-semibold">~30 Credits</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                🔔 Notify Me When Available
              </button>
              <p className="text-xs text-gray-400 mt-2">Coming Q3 2026 - Q2 2027</p>
            </div>
          </div>
        </div>

        {/* Panel Demo */}
        {showPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <PropertyIntelligencePanel
              {...getCurrentDemoData()}
              onClose={() => setShowPanel(false)}
            />
          </div>
        )}

        {/* Premium Upgrade Modal */}
        {showUpgradeModal && (
          <PremiumUpgradeModal
            selectedFeature={selectedFeature}
            onClose={() => setShowUpgradeModal(false)}
            onUpgrade={(plan) => {
              console.log('Upgrading to:', plan);
              setShowUpgradeModal(false);
              // Here you would integrate with your payment system
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyIntelligenceDemo;
