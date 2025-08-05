import React, { useEffect, useState } from "react";
import SmartReturnCalculator from "../../../shared/components/SmartReturnCalculator";
import {
  FaCoins,
  FaLock,
  FaChartBar,
  FaRocket,
  FaWallet,
} from "react-icons/fa";

const mockRewards = [
  { date: "May 2025", amount: 68.75, tx: "0x2f3c...9ba1", nft: "#" },
  { date: "April 2025", amount: 66.91, tx: "0x7a1d...e34f", nft: "#" },
  { date: "March 2025", amount: 65.23, tx: "0xaab4...cd91", nft: "#" },
  { date: "Feb 2025", amount: 64.88, tx: "0xbb12...83aa", nft: "#" },
  { date: "Jan 2025", amount: 62.51, tx: "0x71f1...0d1e", nft: "#" },
  { date: "Dec 2024", amount: 60.45, tx: "0x5dd7...5b22", nft: "#" },
  { date: "Nov 2024", amount: 59.22, tx: "0x8aa6...2b55", nft: "#" },
  { date: "Oct 2024", amount: 58.12, tx: "0x2a0e...c88f", nft: "#" },
  { date: "Sept 2024", amount: 56.89, tx: "0xd0ab...f667", nft: "#" },
  { date: "Aug 2024", amount: 55.63, tx: "0x7c91...1ed2", nft: "#" },
];

const EarnCrypto = () => {
  const [animatedAPR, setAnimatedAPR] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(8.25);
  const [stakeAmount, setStakeAmount] = useState(1000);
  const lastUpdated = new Date().toLocaleString();

  // Animate initial APR (visual only)
  useEffect(() => {
    let start = 0;
    const end = 8.25;
    const duration = 1000;
    const increment = end / (duration / 20);
    const animate = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(animate);
      }
      setAnimatedAPR(parseFloat(start.toFixed(2)));
    }, 20);
    return () => clearInterval(animate);
  }, []);

  const monthlyReward = ((stakeAmount * (expectedReturn / 100)) / 12).toFixed(2);
  const yearlyReward = ((stakeAmount * (expectedReturn / 100))).toFixed(2);

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-[#E0ECFF] to-[#F5F9FF] text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Earn Crypto While You Sleep</h2>
        <p className="text-lg text-gray-700 mb-10">
          Stake your FXCT tokens and earn passive income backed by real estate. Payouts happen monthly—no trading, no stress.
        </p>

        {/* APR + Token Stats Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto mb-10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FaRocket className="text-green-500 text-2xl" />
              <span className="text-xl font-semibold text-gray-800">Current Staking Yield</span>
            </div>
            <p className="text-5xl font-bold text-green-600">
              {animatedAPR}% <span className="text-xl text-gray-500 font-normal">APY</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">Updated daily. Subject to network performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500 mb-1">FXCT Token Price</p>
              <p className="text-xl font-bold text-blue-600">$0.1825 USD</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500 mb-1">FST Token Price</p>
              <p className="text-xl font-bold text-green-600">$1.00 USD</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500 mb-1">30-Day Avg Yield (FST Property)</p>
              <p className="text-xl font-bold text-purple-600">0.34%</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Disclaimer: All figures shown are for demonstration purposes only and do not represent live market data.
          </p>
        </div>
        {/* Smart Return Calculator */}
        <SmartReturnCalculator />

        {/* Benefit Icons */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full shadow text-sm">
            <FaCoins className="text-yellow-500" />
            Monthly Reward Payouts
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full shadow text-sm">
            <FaLock className="text-blue-500" />
            Secure Smart Contracts
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full shadow text-sm">
            <FaChartBar className="text-green-600" />
            Backed by Tokenized Real Estate
          </div>
        </div>

        <button className="bg-green-600 text-white px-8 py-3 rounded-2xl shadow-md hover:bg-green-700 transition mb-16">
          Start Staking
        </button>

        {/* Rewards History */}
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-left">Rewards History</h3>
            <p className="text-sm text-gray-500 text-right">Last updated: {lastUpdated}</p>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Amount Earned</th>
                <th className="py-2 pr-4">Transaction ID</th>
                <th className="py-2">NFT Receipt</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {mockRewards.map((reward, index) => (
                <tr className="border-t" key={index}>
                  <td className="py-2 pr-4">{reward.date}</td>
                  <td className="py-2 pr-4">{reward.amount} FXCT</td>
                  <td className="py-2 pr-4">{reward.tx}</td>
                  <td className="py-2">
                    <a href={reward.nft} className="text-blue-600 underline">View NFT</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EarnCrypto;
