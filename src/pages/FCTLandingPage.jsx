import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FXCTLandingPage = () => {
    const tokenAllocations = [
        { label: "Ecosystem Growth", percentage: 39.5 },
        { label: "Operations Reserve", percentage: 25 },
        { label: "Founders Allocation", percentage: 20 },
        { label: "Employee Incentives", percentage: 10 },
        { label: "Pre-Sale", percentage: 3.5 },
        { label: "Liquidity Pool (Yr 1)", percentage: 2 },
    ];

    const pieData = {
        labels: tokenAllocations.map((item) => item.label),
        datasets: [
            {
                data: tokenAllocations.map((item) => item.percentage),
                backgroundColor: [
                    "#3B82F6",
                    "#6366F1",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                ],
                borderWidth: 1,
            },
        ],
    };

    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail("");
        }
    };

    return (
        <section className="bg-gradient-to-br from-blue-50 to-white text-gray-800 px-6 py-16 overflow-x-hidden">
            {/* Hero */}
            <div className="text-center mb-20">
                <h1 className="text-5xl font-extrabold mb-4 text-blue-700 animate-pulse">
                    FC-Token Pre-Sale is Live!
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Be a part of the future of fractional real estate investing with FractionaX Collateral Tokens — built for real-world utility and rewards.
                </p>
                <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition">
                    Join the Pre-Sale Now
                </button>
            </div>

            {/* Presale Progress */}
            <div className="max-w-4xl mx-auto text-center mb-16 bg-blue-50 p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-2">Presale Progress</h2>
                <p className="mb-1 text-gray-700">Total Raised: <strong>$274,300</strong></p>
                <p className="mb-1 text-gray-700">🔹 42.86 ETH &nbsp; 🔸 $120,000 USDC</p>
                <p className="mb-3 text-gray-700">👥 <strong>1,284</strong> participants</p>
                <div className="bg-white border mt-4 rounded-xl overflow-hidden">
                    <div className="relative w-full h-6 bg-gray-200 rounded-xl overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-green-500 text-white text-xs flex items-center justify-center"
                            style={{ width: '78%' }}
                        >
                            27.43M / 35M Tokens Sold
                        </div>
                    </div>

                </div>
            </div>

            {/* Utility Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20">
                <div>
                    {/* Token Allocation */}
                    <div className="max-w-3xl mx-auto mb-20 text-center">
                        <h2 className="text-2xl font-bold mb-4">Token Allocation</h2>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                            {tokenAllocations.map((item, i) => (
                                <li key={i} className="bg-gray-100 p-3 rounded-lg shadow">
                                    <strong>{item.label}</strong>
                                    <p>{item.percentage}%</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Token Utility</h2>
                    <div className="grid gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
                            💰 Invest in fractional deals with FXCT
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
                            🚀 Unlock VIP perks and fee discounts
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
                            📈 Earn staking rewards and loyalty bonuses
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
                            🏡 Access exclusive deals before others
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-6 rounded-xl shadow overflow-x-auto">
                    <Pie data={pieData} />
                </div>
            </div>


            {/* Email Collection */}
            <div className="bg-blue-50 p-8 rounded-xl max-w-xl mx-auto text-center shadow">
                <h3 className="text-xl font-bold mb-2">Whitelist Now for FC-Tokens</h3>
                <p className="text-gray-600 mb-4">
                    Join early and get priority access to FractionaX Collateral Tokens. Enter your email to reserve your spot.
                </p>
                {submitted ? (
                    <p className="text-green-600 font-semibold">🎉 You're on the list!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="px-4 py-2 rounded-md border border-gray-300 w-full sm:w-auto"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Notify Me
                        </button>
                    </form>
                )}
            </div>
            {/* Referral Bonus */}
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl max-w-3xl mx-auto text-center shadow mb-16">
                <h3 className="text-xl font-bold mb-2">💸 Referral Bonus</h3>
                <p className="text-gray-700">Invite your friends and earn <strong>10% bonus FXCT</strong> on every purchase made using your referral link.</p>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-xs text-gray-500 max-w-4xl mx-auto">
                <p>
                    Disclaimer: FXCT is a utility token designed for use within the FractionaX ecosystem. It is not intended as an investment contract or security. Participation in the pre-sale does not imply ownership or equity in any FractionaX asset.
                </p>
            </div>
        </section>
    );
};

export default FXCTLandingPage;