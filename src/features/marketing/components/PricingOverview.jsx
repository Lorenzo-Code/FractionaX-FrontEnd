import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
    {
        name: "Basic",
        price: "$99",
        period: "/ month",
        badge: "",
        featured: false,
        fxct: "750 FXCT tokens every month — use them for searches, staking, or ecosystem services.",
        features: [
            "AI-powered property search & analytics",
            "Detailed property profiles (Basic Data)",
            "Access to local comps, tax records, and sales history summaries",
            "Priority email support",
            "Community & events access",
        ],
        idealFor: "Casual investors, early-stage agents, or anyone exploring tokenized real estate.",
        cta: "Get Basic",
        ctaLink: "/signup?plan=basic",
        color: "#0F182B",
        pillClass: "bg-blue-600 text-white",
    },
    {
        name: "Standard",
        price: "$299",
        period: "/ month",
        badge: "Best Value",
        featured: true,
        fxct: "2,000 FXCT tokens monthly",
        features: [
            "Everything in Basic",
            "Advanced property analytics (Standard Data)",
            "Expanded search history & ownership details",
            "Broker-ready comparables & mortgage data",
            "Enhanced AI valuation models",
            "Early access to premium tools & reports",
            "Priority chat support",
        ],
        idealFor: "Active real estate professionals, small brokerages, or investment groups.",
        cta: "Get Standard",
        ctaLink: "/signup?plan=standard",
        color: "#151543",
        pillClass: "bg-green-400 text-black",
    },
    {
        name: "Pro",
        price: "$699",
        period: "/ month",
        badge: "",
        featured: false,
        fxct: "5,000 FXCT tokens monthly",
        features: [
            "Everything in Standard",
            "Access to premium Pro Data (deep lien history, legal vesting, foreclosure pipeline, permits, and more)",
            "Priority queue for AI-assisted comps and predictive modeling",
            "Integration with CRM & portfolio tools",
            "Dedicated account manager",
        ],
        idealFor: "Brokerages, hedge funds, and institutional investors needing enterprise-grade property intelligence.",
        cta: "Get Pro",
        ctaLink: "/signup?plan=pro",
        color: "#0F182B",
        pillClass: "bg-blue-600 text-white",
    },
    // Custom / Enterprise+ plan for teams and tailored data/searches
    {
        name: "Custom / Enterprise+",
        price: "Let’s talk",
        period: "",
        badge: "For Teams",
        featured: false,
        fxct: "Tailored FXCT bundles & usage allowances",
        features: [
            "Team seats & role-based access control",
            "SSO (Google/Microsoft/Okta)",
            "Admin console, audit logs & SLA",
            "API access & sandbox",
            "Custom data/search allowances & volume discounts",
            "Dedicated account manager & onboarding",
            "Compliance support (KYC/AML, audits)",
        ],
        idealFor: "Enterprises with complex workflows or strict compliance needs.",
        cta: "Contact Sales",
        ctaLink: "/contact-sales",
        color: "#0B1020",
        pillClass: "bg-black text-white",
    },
];

// Optional static examples (no live pricing; can be wired later)
const fxctExamples = [
    { label: "Basic Data (search, tax, flood, etc.)", approxFxct: "≈ 3–6 FXCT / search" },
    { label: "Standard Data (detail, comps, mortgage)", approxFxct: "≈ 40–80 FXCT / search" },
    { label: "Pro Data (liens, transactions, CRA-AR5)", approxFxct: "≈ 150–500+ FXCT / report" },
];

export default function PricingOverview() {
    return (
        <section className="bg-gray-50 py-20 px-4 sm:px-10 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-black mb-3">
                        💰 FractionaX Membership Plans
                    </h2>
                    <p className="text-black/80 mb-12 text-sm">
                        Join the future of AI-powered property intelligence — earn FXCT tokens, access premium market data,
                        and stake your way to rewards.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
                    {tiers.map((t, i) => (
                        <div
                            key={i}
                            className={`relative rounded-2xl p-6 shadow-md border transform transition-transform duration-300 hover:scale-[1.02] ${t.featured ? "ring-2 ring-green-400" : "border-white/10"
                                }`}
                            style={{ backgroundColor: t.color }}
                        >
                            {t.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
                                    {t.badge}
                                </div>
                            )}

                            <div className="text-center mb-6 space-y-2">
                                <span className={`inline-block px-4 py-1 rounded-full text-xs tracking-wide font-semibold ${t.pillClass}`}>
                                    {t.name}
                                </span>

                                <div className="text-3xl font-semibold text-white">{t.price}</div>
                                <div className="text-sm text-white/70">{t.period}</div>

                                <p className="text-xs text-white/80 italic mt-2">{t.fxct}</p>
                            </div>

                            <ul className="text-left space-y-3 mb-6 text-sm">
                                {t.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-xs text-white/70 mb-4">{t.idealFor}</p>

                            <Link to={t.ctaLink}>
                                <button
                                    className={`w-full py-2 rounded-lg text-sm font-semibold transition duration-200 ${t.featured
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : t.name.includes("Custom")
                                            ? "bg-black hover:bg-neutral-900 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                >
                                    <span className="inline-flex items-center justify-center gap-2">
                                        {t.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* How FXCT pricing works (no live market pulls here) */}
                <div className="max-w-5xl mx-auto mt-14 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">How FXCT-Based Pricing Works</h3>
                    <p className="text-sm text-gray-700">
                        Membership plans provide monthly FXCT tokens. Searches and premium reports are priced in FXCT and may vary over time.
                        FXCT-per-search reflects data provider costs and market conditions, keeping pricing fair and scalable.
                        You can always top up with additional FXCT if you need more usage.
                    </p>

                    {/* Static examples to set expectations (purely illustrative) */}
                    <div className="mt-5">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Current FXCT Cost Examples*</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {fxctExamples.map((row, idx) => (
                                <div key={idx} className="rounded-lg border border-gray-200 p-3">
                                    <div className="text-sm font-medium text-gray-900">{row.label}</div>
                                    <div className="text-xs text-gray-600 mt-1">{row.approxFxct}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-2">
                            *Examples for illustration only. FXCT-per-search updates periodically and is shown in your dashboard.
                        </p>
                    </div>
                </div>

                {/* All Plans Include */}
                <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">All Plans Include</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Use FXCT tokens for AI-powered searches, staking rewards, and ecosystem services.
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Stake unused FXCT to earn yield and grow your holdings.
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Transparent, blockchain-based transaction history.
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            Seamless fiat & crypto payments.
                        </li>
                    </ul>
                </div>

                {/* Why FXCT Membership is Different */}
                <div className="max-w-5xl mx-auto mt-8 text-gray-800">
                    <h3 className="text-xl font-semibold mb-3">Why FXCT Membership is Different</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>
                            <strong>Own part of the ecosystem</strong> – FXCT tokens are yours to hold, trade, stake, or spend.
                        </li>
                        <li>
                            <strong>Scales with you</strong> – Buy more FXCT anytime for deeper searches and premium reports.
                        </li>
                        <li>
                            <strong>Built for growth</strong> – As the platform expands, your tokens gain more ways to be used.
                        </li>
                    </ul>

                    {/* Internal note to your team: keep or remove */}
                    <div className="text-xs text-gray-500 mt-5">
                        Note: FXCT-per-search is set by backend policy and may adjust periodically to reflect market FXCT/USD and provider
                        cost changes. High-cost data has built-in monthly caps; additional usage requires FXCT top-ups.
                    </div>
                </div>
            </div>
        </section>
    );
}
