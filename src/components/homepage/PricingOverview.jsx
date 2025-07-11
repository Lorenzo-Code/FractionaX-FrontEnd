import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


const tiers = [
    {
        name: "Starter",
        price: "$29",
        period: "/ month",
        featured: false,
        features: [
            "FCT Valve at 20% discount",
            "Up to 30 AI searches/month",
            "Basic analytics",
            "Starter-tier deal access"
        ],
        missing: ["Advanced analytics", "Access to investor-grade deals", "Community support"],
        cta: "Start with Starter"
    },
    {
        name: "Pro",
        price: "$79",
        period: "/ month",
        featured: true,
        features: [
            "✅ FCT Valve at 20% discount",
            "🔍 ~100 AI searches/month",
            "📊 Advanced analytics",
            "🏠 Investor-grade property deals",
            "🚀 Priority support",
            "📈 Deal insights & scoring",
            "🛠 Access to AI property tools",
            "👥 Community access"
        ],
        missing: [],
        cta: "Get Pro"
    },
    {
        name: "Enterprise",
        price: "$199",
        period: "/ month",
        featured: false,
        features: [
            "FCT Valve at 20% discount",
            "~300 AI searches/month",
            "Premium AI tools & insights",
            "Early access to exclusive listings",
            "White-glove support",
            "API access (coming soon)",
            "Portfolio & team tools"
        ],
        missing: ["Token trading included"],
        cta: "Join Enterprise"
    }
];

export default function PricingGrid() {
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 600,
            easing: 'ease-out-cubic',
            anchorPlacement: 'top-bottom',
        });
    }, []);

    return (
        <section
            data-aos="fade-in"
            data-aos-delay="0"
            className="bg-gray-50 py-20 px-4 sm:px-10 lg:px-24"
        >
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-semibold text-black mb-3">Choose Your AI Access Plan</h2>
                <p className="text-black mb-12 text-sm">
                    Token amount varies with live FCT price. Tokens unlock 30 days after issuance.
                </p>

                <div className="grid grid-cols-1 text-white md:grid-cols-3 gap-8">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            data-aos="fade-up"
                            data-aos-delay={idx * 100}
                            className={`relative rounded-2xl p-6 shadow-md border transform transition-transform duration-300 ease-in-out hover:scale-105 ${tier.featured ? "border-white/20" : "border-white/10"
                                }`}

                            style={{
                                backgroundColor: tier.featured ? "#151543" : "#0F182B",
                            }}
                        >
                            {tier.name === "Pro" && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
                                    Most Popular
                                </div>
                            )}


                            <div className="text-center mb-6 space-y-2">
                                <p
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100 + 100}
                                    className={`inline-block px-4 py-1 rounded-full text-xs tracking-wide font-semibold ${tier.name === "Pro"
                                        ? "bg-green-400 text-black"
                                        : tier.name === "Enterprise"
                                            ? "bg-black text-white"
                                            : "bg-blue-600 text-white"
                                        }`}
                                >
                                    {tier.name}
                                </p>

                                <div
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100 + 200}
                                    className="text-2xl font-semibold text-white"
                                >
                                    {tier.price}
                                </div>

                                <div
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100 + 250}
                                    className="text-xs text-white/50 italic"
                                >
                                    (~Based on current FCT value)
                                </div>

                                <div
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 100 + 300}
                                    className="text-sm text-white/70"
                                >
                                    {tier.period}
                                </div>
                            </div>

                            <ul className="text-left space-y-3 mb-6 text-sm">
                                {tier.features.map((feat, i) => (
                                    <li
                                        key={i}
                                        data-aos="fade-up"
                                        data-aos-delay={idx * 100 + 400 + i * 50}
                                        className="flex items-start"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1" />
                                        {feat}
                                    </li>
                                ))}

                                {tier.missing.map((feat, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start text-gray-500 line-through"
                                    >
                                        <XCircle className="w-4 h-4 text-gray-600 mr-2 mt-1" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                data-aos="zoom-in"
                                data-aos-delay={idx * 70 + 600}
                                className={`w-full py-2 rounded-lg text-sm font-semibold transition duration-200 ${tier.name === "Pro"
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : tier.name === "Enterprise"
                                        ? "bg-black hover:bg-neutral-900 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                <span className="inline-flex items-center justify-center gap-2">
                                    {tier.cta}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </button>




                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
}
