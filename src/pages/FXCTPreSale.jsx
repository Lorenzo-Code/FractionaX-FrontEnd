import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Footer from "../components/common/Footer";
import { smartFetch } from "../utils/apiClient";



export default function FXCTPreSale() {
    const { address, isConnected } = useAccount();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [whitelistCount, setWhitelistCount] = useState(0);
    const [emailCount, setEmailCount] = useState(0);
    const [tokensAvailable, setTokensAvailable] = useState(12_500_000);
    const [tokensSold, setTokensSold] = useState(0);
    const [whitelistStatus, setWhitelistStatus] = useState(null);


    const totalTokens = 1_000_000;

    // Countdown logic
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const launchDate = new Date("2025-09-20T00:00:00Z");
            const diff = launchDate - now;

            if (diff <= 0) {
                setCountdown(null);
                return;
            }

            setCountdown({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    // Signup handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await smartFetch("/api/email/subscribe", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    context: "presale", // ensure proper group routing
                    wallet: isConnected ? address : "", // ✅ define wallet here safely
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || "Signup failed");

            console.log("Presale signup successful:", data);
            setStatus("success");
            setEmail("");
            setSubmitted(true);
        } catch (err) {
            console.error("Signup error:", err.message);
            setStatus("error");
        }
    };

    // Whitelist checker (frontend)
    const checkWhitelist = async () => {
        if (!address) return;

        try {
            const res = await smartFetch("/api/email/check-whitelist", {
                method: "POST",
                body: JSON.stringify({ wallet: address }),
            });

            const data = await res.json();
            setWhitelistStatus(
                data.whitelisted ? "✅ You're whitelisted!" : "❌ Not yet whitelisted."
            );
        } catch (err) {
            console.error("Whitelist check error:", err.message);
            setWhitelistStatus("⚠️ Error checking status.");
        }
    };


    return (
        <div>
            <section className="bg-[#0B0B0B] text-white min-h-screen px-6 sm:px-12 py-20 flex flex-col items-center justify-center">
                {/* Countdown */}
                {/* <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">Countdown to Launch</h2>
                    {countdown ? (
                        <div className="text-3xl sm:text-4xl font-mono text-blue-400">
                            {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                        </div>
                    ) : (
                        <p className="text-lg text-green-400 font-semibold">The pre-sale is live! 🚀</p>
                    )}
                </motion.div> */}
                < b />
                {/* Hero Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">FXCT Token Pre-Sale</h1>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8">
                        Get early access to the FractionaX ecosystem. Token holders unlock exclusive tools, premium reports, and discounted platform fees.
                    </p>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                className="px-4 py-3 rounded-xl text-black text-base w-full sm:w-80"
                            />
                            <ConnectButton chainStatus="icon" accountStatus="address" showBalance={false} />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                            >
                                Join Waitlist
                            </button>
                            {isConnected && (
                                <p className="text-sm text-gray-400">
                                    Wallet: <span className="text-blue-400">{address}</span>
                                </p>
                            )}
                        </form>
                    ) : (
                        <p className="mt-4 text-green-400 font-semibold">You're on the list! 🚀</p>
                    )}
                    <p className="mt-4 text-sm text-gray-400">
                        Pre-sale opens: <strong>To be determined</strong>
                    </p>
                    <p className="mt-2 text-sm text-blue-300">
                        ✅ <strong>{whitelistCount}</strong> wallets whitelisted &nbsp;|&nbsp; 📧 <strong>{emailCount}</strong> emails joined
                    </p>
                </motion.div>


                {/* Pre-Sale Progress */}
                <div className="mt-12 w-full max-w-xl text-left">
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">🔥 Pre-Sale Progress</h3>
                    <p className="text-sm text-gray-300 mb-1">
                        <strong>{tokensSold}</strong> tokens sold out of <strong>{totalTokens}</strong>
                    </p>
                    <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${(tokensSold / totalTokens) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Limited supply. Don’t miss your chance.</p>
                </div>


                {/* Whitelist Wallet Checker */}
                {/* {isConnected && (
                    <div className="bg-[#1F2937] text-white p-6 rounded-2xl shadow-md mt-20 max-w-lg w-full text-center">
                        <h3 className="text-xl font-semibold mb-2">Check Whitelist Status</h3>
                        <p className="text-sm text-gray-400 mb-2">Wallet: <span className="text-blue-400">{address}</span></p>
                        <button onClick={checkWhitelist} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm transition">
                            Check Status
                        </button>
                        {whitelistStatus && <p className="mt-4 text-base">{whitelistStatus}</p>}
                    </div>
                )} */}

                {/* Core Sections */}
                <section className="mt-28 max-w-6xl w-full px-6 sm:px-0 text-white space-y-14">
                    {/* What is FXCT */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4">What is FXCT?</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            FXCT (FractionaX Collateral Token) is the native utility token powering the FractionaX platform.
                            It is used to access premium property reports, reduce transaction fees, and gain early access to
                            tokenized real estate deals. FXCT also plays a role in staking, governance, and future ecosystem expansion.
                        </p>
                    </div>

                    {/* Ecosystem Utility */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">How FXCT Powers the Ecosystem</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 text-base">
                            <li>🔍 Unlock premium AI-generated property insights</li>
                            <li>💰 Reduce transaction fees on deal participation and secondary sales</li>
                            <li>🏡 Priority access to high-yield property drops</li>
                            <li>📊 Future governance & DAO voting rights (phase 2+)</li>
                            <li>🧾 Monthly tax receipts and staking yield payouts (via FXST)</li>
                        </ul>
                    </div>

                    <div className="bg-[#111827] text-white p-6 rounded-xl mt-16 max-w-4xl mx-auto space-y-6">
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">🎯 FXCT Pre-Sale Strategy & Liquidity Commitment</h3>
                            <p className="text-gray-300 text-sm mb-3">
                                The FXCT pre-sale is designed to raise between <strong>$750,000 – $1,250,000</strong> to bootstrap FractionaX with real liquidity, support early development, and cover audits and regulatory onboarding. Early buyers gain access to FXCT tokens at up to <strong>65% off</strong> the public sale price.
                            </p>
                            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1 mb-3">
                                <li><strong>Soft Cap:</strong> $250,000 (minimum raise goal)</li>
                                <li><strong>Hard Cap:</strong> $1.25M (full allocation cap)</li>
                                <li><strong>Pre-Sale Token Price:</strong> $0.035 – $0.07 USD</li>
                                <li><strong>Next Round:</strong> Community Sale — Q4 2025</li>
                            </ul>
                            <p className="text-xs text-gray-500">
                                If the soft cap is not reached, funds will either be refunded or automatically rolled into the next round.
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <h4 className="text-xl font-semibold mb-2">💧 Long-Term Liquidity & Collateralization</h4>
                            <p className="text-gray-300 text-sm mb-3">
                                FXCT isn’t just another utility token — it’s backed by real, verifiable capital from day one. Our liquidity model ensures sustainable token economics and frictionless trading for the long haul.
                            </p>
                            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2">
                                <li>🚀 <strong>Initial Liquidity Pool:</strong> 20M FXCT + $1.6M USDC (1:1 ratio)</li>
                                <li>🔐 <strong>Year 3:</strong> 5% of total FXCT supply permanently locked for ecosystem liquidity</li>
                                <li>📈 <strong>Year 5:</strong> Collateral coverage target: <strong>1:1.5</strong> (backed by stablecoins and yield assets)</li>
                                <li>🛡️ <strong>Stability Focus:</strong> Designed to avoid heavy slippage and speculative swings</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">
                                Unlike typical utility tokens, FXCT is deployed with a treasury-first strategy — balancing growth with real collateral to maximize trust.
                            </p>
                        </div>
                    </div>
                    {/* Token Allocation */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">FXCT Token Allocation</h3>
                        <div className="bg-[#1F2937] p-6 rounded-xl shadow-md text-sm text-gray-300">
                            <ul className="space-y-2">
                                <li><strong>3.5%</strong> — Pre-sale distribution</li>
                                <li><strong>2%</strong> — Liquidity reserve (Year 1)</li>
                                <li><strong>25%</strong> — Operations & ecosystem reserve</li>
                                <li><strong>20%</strong> — Founders (4-year vesting, 1-year cliff)</li>
                                <li><strong>10%</strong> — Team & contributor incentives</li>
                                <li><strong>39.5%</strong> — Ecosystem growth, rewards, future partner incentives</li>
                            </ul>
                        </div>
                    </div>


                    {/* Security, Audit & Transparency */}
                    <div className="bg-[#111827] p-6 rounded-xl text-sm text-gray-300">
                        <h3 className="text-2xl font-bold text-white mb-4">🛡️ Security, Audit & Transparency</h3>
                        <p className="mb-3">
                            Security is core to everything we build at FractionaX. FXCT's smart contract is deployed on the Base network using hardened, audited code. The contract is undergoing a full audit by a leading blockchain security firm.
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Auditor: <strong>[Auditing Firm]</strong></li>
                            <li>Audit Report: <em>Coming September 2025</em></li>
                            <li>24/7 contract monitoring and upgrade-safe architecture</li>
                            <li>Multisig controls for treasury and token minting</li>
                        </ul>
                        <div className="border-t border-gray-700 mt-6 pt-4">
                            <h4 className="text-lg font-semibold text-white mb-2">📊 Transparency & Treasury Overview</h4>
                            <p>We’ll publish monthly updates of:</p>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>🔗 FXCT supply breakdown (sold, reserved, staked)</li>
                                <li>💰 Treasury holdings (USDC, liquidity locked, capital allocated)</li>
                                <li>🔍 Audit & security reports</li>
                                <li>🛂 KYC Verified Platform – Built to comply with U.S. Digital Asset Law (2025)</li>
                            </ul>
                            <p className="mt-2 text-gray-500 text-xs">
                                Initial treasury dashboard will go live in October 2025.
                            </p>
                        </div>
                    </div>

                    {/* Smart Contract Info */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Smart Contract Details</h3>
                        <p className="text-gray-300 text-base mb-4">
                            FXCT is deployed on the <strong>Base network</strong> via a secure ERC-20 smart contract with built-in
                            dynamic fee logic. Rather than charging a flat fee, FXCT adapts the transaction cost based on the transfer amount, balancing affordability with long-term ecosystem support.
                        </p>
                        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mb-3">
                            <li>🔁 Minimum fee: <strong>1%</strong> of the transaction amount</li>
                            <li>💸 Tiered maximum cap based on transaction size:</li>
                            <ul className="ml-4 list-disc list-inside space-y-1 text-gray-400">
                                <li><strong>Up to $100</strong> → Max <strong>$0.50</strong></li>
                                <li><strong>$100–$1,000</strong> → Max <strong>$3.00</strong></li>
                                <li><strong>$1,000–$5,000</strong> → Max <strong>$7.50</strong></li>
                                <li><strong>$5,000+</strong> → Max <strong>$12.00</strong></li>
                            </ul>
                            <li>🧠 Fee logic prevents abuse while remaining affordable for retail users and scalable for high-volume traders</li>
                            <li>🔒 <strong>Subscription Locking:</strong> FXCT tokens received through FractionaX monthly subscriptions are locked for <strong>45 days</strong> before they become transferable. These tokens are discounted at <strong>20%</strong> off market price and intended for ecosystem use.</li>
                        </ul>
                        <p className="text-sm text-gray-400">
                            All collected fees go toward platform development, property data integrations, staking rewards, and ecosystem growth initiatives.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Contract address: <code className="text-blue-400">[to be announced]</code><br />
                            Audited by: <em>[Your auditing firm]</em>
                        </p>
                    </div>

                    {/* Regulation Compliance - Expanded */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Regulatory Compliance</h3>
                        <p className="text-gray-300 text-base mb-3">
                            FractionaX is built with regulation in mind — both current and future. As the landscape around digital assets evolves, we’re leading with transparency and compliance-first architecture.
                        </p>
                        <h4 className="text-lg font-semibold text-white mt-4 mb-2">📜 Past & Present Framework</h4>
                        <ul className="list-disc list-inside text-sm text-gray-400 mb-3">
                            <li>🛡️ Compliant with FinCEN guidelines on utility tokens (since 2023)</li>
                            <li>🔍 Token design reviewed under SEC Howey Test & relevant IRS crypto tax rules</li>
                            <li>🌐 Jurisdictional compliance layered into the onboarding process (KYC/AML)</li>
                        </ul>
                        <h4 className="text-lg font-semibold text-white mt-4 mb-2">⚖️ U.S. Digital Asset Bill (2025)</h4>
                        <p className="text-gray-300 text-sm mb-2">
                            The recently passed U.S. Digital Asset Market Structure Bill outlines:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-400 mb-3">
                            <li>✅ Registration framework for digital asset platforms</li>
                            <li>🏛️ Definitions for asset-backed vs. utility tokens</li>
                            <li>🔐 Custody standards and capital requirements</li>
                            <li>💡 Tax treatment and clarity on staking/yield income</li>
                        </ul>
                        <p className="text-sm text-gray-500">
                            FractionaX is integrating SEC, FinCEN, and CFTC rulesets into a unified compliance engine. This helps ensure future-proof operation across U.S. and global jurisdictions.
                        </p>
                        <h4 className="text-lg font-semibold text-white mt-4 mb-2">📈 Looking Ahead</h4>
                        <ul className="list-disc list-inside text-sm text-gray-400 mb-3">
                            <li>👥 Phase 2 DAO voting framework to meet evolving governance standards</li>
                            <li>🧾 Reg A+ registration pathway for FXST security token in 2026</li>
                            <li>🔍 Smart contract audits & wallet-level transparency for all future tokens</li>
                            <li>🌍 Optional EU MiCA alignment for expansion into European markets</li>
                        </ul>
                        <div className="text-sm text-gray-500">
                            <p className="mb-2">
                                FractionaX is integrating compliance frameworks from:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>
                                    <a
                                        href="https://www.sec.gov/news/statement/gensler-crypto-2023-12-15"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        SEC: Howey Test Guidance (2023)
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.congress.gov/bill/118th-congress/house-bill/4763"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        H.R.4763 - Financial Innovation and Technology for the 21st Century Act (2025)
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.fincen.gov/news/news-releases/fincen-announces-new-guidelines-crypto-kyc-aml"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        FinCEN Digital Asset KYC Guidelines
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.irs.gov/individuals/international-taxpayers/digital-assets"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        IRS Tax Treatment of Digital Assets
                                    </a>
                                </li>
                            </ul>
                        </div>


                    </div>



                    {/* FXCT + FXST Comparison */}
                    <div className="mt-14">
                        <h3 className="text-2xl font-bold mb-6">FXCT vs. FXST — How They Work Together</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg">
                                <h4 className="text-xl font-semibold mb-2 text-blue-400">FXCT – Utility Token</h4>
                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    <li>Used to unlock premium reports & tools</li>
                                    <li>Required to reduce platform fees</li>
                                    <li>Governance & ecosystem participation</li>
                                    <li>Optional staking for rewards</li>
                                    <li>No equity or real estate claim</li>
                                </ul>
                            </div>
                            <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg">
                                <h4 className="text-xl font-semibold mb-2 text-emerald-400">FXST – Security Token</h4>
                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    <li>Backed by real-world real estate</li>
                                    <li>Represents fractional ownership</li>
                                    <li>Receives property income & resale gains</li>
                                    <li>SEC-compliant offering (Reg A+)</li>
                                    <li>Custodial & liquidation-backed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community */}
                {/* <div className="mt-28 max-w-5xl mx-auto text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">🚀 Join the Community</h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Get real-time updates, early insights, and engage with other FXCT supporters.
                    </p>
                    <div className="flex justify-center">
                        <iframe
                            title="FractionaX Twitter Feed"
                            src="https://twitframe.com/show?url=https://twitter.com/FractionaX"
                            className="w-full sm:w-[500px] h-[600px] border-none overflow-hidden rounded-xl shadow-md"
                            scrolling="no"
                            loading="lazy"
                        />

                    </div>
                </div> */}

                {/* Legal Notice */}
                <div className="mt-24 max-w-4xl mx-auto text-gray-400 text-sm border-t border-gray-700 pt-6">
                    <h3 className="text-white text-lg font-semibold mb-3">Legal Notice</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>FXCT is a utility token used for access and rewards within the FractionaX platform.</li>
                        <li>It does not represent equity, debt, or ownership of FractionaX or any real-world asset.</li>
                        <li>FXCT does not grant entitlement to revenue, dividends, or real estate ownership (FXST covers that).</li>
                        <li>All purchases of FXCT are final. Token value may fluctuate based on market conditions.</li>
                        <li>FXST, our fractionalized security token, will be released under separate compliance rules.</li>
                    </ul>
                    <p className="mt-4 text-sm">
                        By participating in this token offering, you agree to the{" "}
                        <a href="/legal/token-terms" className="text-blue-400 underline hover:text-blue-500">
                            FXCT Token Terms of Use
                        </a>.
                    </p>

                </div>
            </section>
            <Footer />
        </div>
    );
};