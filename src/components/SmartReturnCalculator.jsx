// src/components/SmartReturnCalculator.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const lockOptions = [
  { label: "90 Days – 5.00%", days: 90, apy: 5.0 },
  { label: "121 Days – 6.75%", days: 121, apy: 6.75 },
  { label: "242 Days – 8.25%", days: 242, apy: 8.25 },
  { label: "365 Days – 10.50%", days: 365, apy: 10.5 },
];

const propertyData = {
  HOU123: {
    address: "123 Bayou Ln, Houston, TX",
    purchase_price: 160000,
    rehab_cost: 15000,
    monthly_rent: 1850,
    monthly_expenses: 650,
  },
  DAL456: {
    address: "456 Maple Dr, Dallas, TX",
    purchase_price: 210000,
    rehab_cost: 30000,
    monthly_rent: 2250,
    monthly_expenses: 850,
  },
  ATX789: {
    address: "789 Barton Blvd, Austin, TX",
    purchase_price: 285000,
    rehab_cost: 20000,
    monthly_rent: 2500,
    monthly_expenses: 900,
  },
};

const SmartReturnCalculator = () => {
  const FXCTPrice = 0.1825;
  const [mode, setMode] = useState("crypto");
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [selectedLock, setSelectedLock] = useState(lockOptions[2]);
  const [monthlyReturn, setMonthlyReturn] = useState(0);
  const [annualReturn, setAnnualReturn] = useState(0);
  const [comparisonMode, setComparisonMode] = useState("staking");
  const [showWhy, setShowWhy] = useState(false);

  const [propertyId, setPropertyId] = useState("");
  const [propertyInfo, setPropertyInfo] = useState(null);

  useEffect(() => {
    if (mode === "crypto") {
      const targetAnnual = ((stakeAmount * selectedLock.apy) / 100).toFixed(2);
      const targetMonthly = (targetAnnual / 12).toFixed(2);
      let current = 0;
      const step = Math.max(1, targetAnnual / 30);
      const animate = setInterval(() => {
        current += step;
        if (current >= targetAnnual) {
          setAnnualReturn(Number(targetAnnual));
          setMonthlyReturn(Number(targetMonthly));
          clearInterval(animate);
        } else {
          setAnnualReturn(Number(current.toFixed(2)));
          setMonthlyReturn(Number((current / 12).toFixed(2)));
        }
      }, 20);
      return () => clearInterval(animate);
    }
  }, [stakeAmount, selectedLock, mode]);

  const handleLookup = () => {
    const data = propertyData[propertyId.toUpperCase()];
    setPropertyInfo(data || null);
  };

  const comparisonRates = {
    staking: selectedLock.apy,
    bank: 4.0,
    sp500: 7.0,
  };

  const comparisonAnnual = ((stakeAmount * (comparisonRates[comparisonMode] / 100))).toFixed(2);
  const tokenEquivalent = Math.floor(stakeAmount / FXCTPrice);
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + selectedLock.days);

  const chartData = {
    labels: ["Principal", "Projected Return"],
    datasets: [
      {
        label: "Investment Breakdown",
        data: [stakeAmount, annualReturn],
        backgroundColor: ["#60A5FA", "#34D399"],
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl mx-auto mb-12 text-left">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Smart Return Calculator</h3>
        <select
          className="p-2 border rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="crypto">Crypto Staking</option>
          <option value="realestate">Real Estate Investment</option>
        </select>
      </div>

      {mode === "crypto" && (
        <>
          <div className="flex gap-3 mb-4">
            {[1000, 5000, 10000].map((val) => (
              <button
                key={val}
                onClick={() => setStakeAmount(val)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                ${val.toLocaleString()}
              </button>
            ))}
          </div>

          <label className="block mb-2 text-sm font-medium text-gray-700">Investment Amount (USD):</label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">Select Lock Period:</label>
          <select
            className="w-full p-3 rounded-lg border border-gray-300 mb-6"
            value={selectedLock.label}
            onChange={(e) =>
              setSelectedLock(lockOptions.find((opt) => opt.label === e.target.value))
            }
          >
            {lockOptions.map((opt) => (
              <option key={opt.days} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>

          <p className="text-sm text-gray-500 text-center mb-4">
            You’ll stake approximately <span className="font-semibold">{tokenEquivalent} FXCT</span> tokens.
          </p>

          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Monthly Return</p>
              <p className="text-xl font-bold text-green-600">${monthlyReturn}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Annual Return</p>
              <p className="text-xl font-bold text-green-600">${annualReturn}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6">
            Maturity Date: <strong>{maturityDate.toLocaleDateString()}</strong>
          </p>
        </>
      )}

      {mode === "realestate" && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Property ID:</label>
          <div className="flex mb-4 gap-2">
            <input
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              placeholder="e.g. HOU123"
            />
            <button
              onClick={handleLookup}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Lookup
            </button>
          </div>

          {propertyInfo && (
            <div className="text-sm bg-gray-100 p-4 rounded mb-4">
              <p><strong>Address:</strong> {propertyInfo.address}</p>
              <p><strong>Total Investment:</strong> ${propertyInfo.purchase_price + propertyInfo.rehab_cost}</p>
              <p><strong>Monthly Rent:</strong> ${propertyInfo.monthly_rent}</p>
              <p><strong>Expenses:</strong> ${propertyInfo.monthly_expenses}</p>

              <p className="mt-2"><strong>Monthly Cash Flow:</strong> ${propertyInfo.monthly_rent - propertyInfo.monthly_expenses}</p>
              <p><strong>Cap Rate:</strong> {(((propertyInfo.monthly_rent * 12) / (propertyInfo.purchase_price + propertyInfo.rehab_cost)) * 100).toFixed(2)}%</p>
              <p><strong>ROI:</strong> {((((propertyInfo.monthly_rent - propertyInfo.monthly_expenses) * 12) / (propertyInfo.purchase_price + propertyInfo.rehab_cost)) * 100).toFixed(2)}%</p>
            </div>
          )}
        </>
      )}

      {/* AI Prompt */}
      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Ask the AI (coming soon):</label>
        <input
          disabled
          placeholder="e.g. Should I stake or buy a 4plex in Dallas?"
          className="w-full p-3 rounded-lg border border-dashed border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-2">
          This feature will use AI to evaluate deals, risk, and investment paths based on your input.
        </p>
      </div>

      {/* Chart */}
      {mode === "crypto" && (
        <div className="mt-6">
          <Bar data={chartData} height={150} />
        </div>
      )}
    </div>
  );
};

export default SmartReturnCalculator;
