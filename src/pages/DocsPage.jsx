import React, { useState } from "react";

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 border border-gray-300 rounded-xl overflow-hidden">
      <button
        className="w-full text-left p-4 font-semibold text-xl bg-gray-50 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        {title}
      </button>
      {open && <div className="p-4 bg-white text-base text-gray-800">{children}</div>}
    </div>
  );
};

export default function FractionaXDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">📘 FractionaX Documentation</h1>

      <Section title="🚀 Introduction & Vision">
        <p>
          FractionaX is redefining fractional investing through a dual-token blockchain platform. Our mission is to provide transparent, compliant, and accessible wealth-building tools to the world. Backed by real assets and powered by Hedera Hashgraph, we ensure investors get the best of both security and innovation.
        </p>
      </Section>

      <Section title="🪙 Token System: FCT vs FST">
        <p><strong>FCT (Utility Token)</strong>: Used for access, staking, and platform services. Fixed supply of 1 billion tokens, backed with 1:1 to 1.5:1 reserves over time.</p>
        <p><strong>FST (Security Token)</strong>: Represents real fractional ownership of tokenized assets. Backed 1:1 by physical asset value and compliant with securities law (Reg CF, A+).</p>
      </Section>

      <Section title="💡 How It Works">
        <ul className="list-disc pl-6">
          <li>Connect wallet or onboard with fiat (via MoonPay/Circle).</li>
          <li>Buy FCT to interact with platform or access exclusive assets.</li>
          <li>Invest in properties and receive FST tokens proportionally.</li>
          <li>Earn rental/dividend income monthly and trade on secondary ATS markets.</li>
        </ul>
      </Section>

      <Section title="📊 Tokenomics & Buyback">
        <p>FCT supply: 1B. Key allocations include Pre-Sale (3.5%), Liquidity (5%), Founders (20%), Ops Reserve (25%), Ecosystem Growth (39.5%).
        </p>
        <p>5% of platform revenue supports quarterly buybacks to burn FCT and strengthen token value.</p>
      </Section>

      <Section title="⚖️ Legal & Compliance">
        <ul className="list-disc pl-6">
          <li>FST is SEC-compliant and offered under Reg CF (and later Reg A+).</li>
          <li>KYC/AML enforced with blockchain-based ID solutions.</li>
          <li>Smart contracts audited with built-in tax and transfer rules.</li>
        </ul>
      </Section>

      <Section title="📈 Revenue & Business Model">
        <ul className="list-disc pl-6">
          <li>FCT transfer fee: $0.015 per transaction.</li>
          <li>1.5% on asset transactions + up to 5% commission on sales.</li>
          <li>1–2% annual property management fee.</li>
          <li>Subscription analytics and staking tier fees.</li>
        </ul>
      </Section>

      <Section title="🔐 Collateral Backing & Transparency">
        <p>FCT starts with 1:1 backing (cash/stablecoins) and moves to 1.5:1 as revenue grows. Collateral Explorer (launching 2026) will provide real-time reserve data.</p>
      </Section>

      <Section title="🌍 Growth & Roadmap">
        <ul className="list-disc pl-6">
          <li><strong>2025:</strong> Pre-sale, platform MVP, first tokenized properties.</li>
          <li><strong>2026:</strong> Reg A+ expansion, DAO-lite staking governance, Collateral Explorer launch.</li>
          <li><strong>2027+:</strong> Expand into global markets and diversify assets (luxury, green energy, etc.).</li>
        </ul>
      </Section>

      <Section title="🙋‍♂️ FAQs">
        <p><strong>Is FCT a security?</strong> No. It’s a utility token with no ownership or profit-sharing rights.</p>
        <p><strong>How do I get FST?</strong> Invest in approved assets via Reg CF; FST is issued post-verification.</p>
        <p><strong>Where can I trade FST?</strong> On regulated Alternative Trading Systems (ATS) post-lockup.</p>
      </Section>

      <Section title="📬 Contact & Support">
        <p>Email: <a href="mailto:Support@FractionaX.io" className="text-blue-600 underline">Support@FractionaX.io</a></p>
        <p>Phone: 713-482-1108</p>
        <p>Website: <a href="https://fractionax.io" className="text-blue-600 underline">FractionaX.io</a></p>
      </Section>
    </div>
  );
}
