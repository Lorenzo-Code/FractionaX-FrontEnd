import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/common/Footer";

const TermsAndConditions = () => {
  return (
    <div className="bg-[#191d2b] text-white min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-lg text-white/90">Effective Date: July 11, 2025</p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="flex-grow px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">1. Acceptance of Terms</h2>
            <p>
              These Terms & Conditions constitute a legally binding agreement between you and FractionaX. By accessing or using the platform, you agree to comply with these Terms and our Privacy Policy. If you do not agree, do not use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and legally capable of entering contracts in your jurisdiction. FractionaX is currently intended for users located in the United States only. Use outside of permitted jurisdictions is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">3. Permitted Use</h2>
            <p>
              You agree to use the platform solely for its intended purposes. You may not reverse-engineer, data mine, scrape, or interfere with the performance or availability of FractionaX services or smart contracts. Unauthorized access or abuse will result in account termination and potential legal action.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">4. Token Disclosures</h2>
            <p>
              FractionaX offers two distinct digital assets: FXCT (utility token) and FST (security token). FST is offered only to accredited U.S. investors and governed by SEC and FINRA regulations. We do not guarantee any increase in token value or platform returns. Use at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">5. No Financial Advice</h2>
            <p>
              All materials on the platform are for general informational purposes only and do not constitute investment, financial, or legal advice. Please consult a licensed advisor before making any financial decisions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">6. Intellectual Property</h2>
            <p>
              All content, branding, software, and code on the FractionaX platform are the exclusive property of FractionaX LLC. Unauthorized reproduction, modification, or distribution is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">7. Limitation of Liability</h2>
            <p>
              FractionaX is provided “as is” without warranty of any kind. We are not liable for indirect, incidental, or consequential damages, including but not limited to losses caused by network failures, smart contract bugs, regulatory changes, or user error.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">8. Indemnification</h2>
            <p>
              You agree to defend and indemnify FractionaX, its officers, employees, and partners from any claims, damages, or liabilities arising out of your use of the platform, tokens, or violation of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time, with or without notice, if you violate these Terms or engage in harmful behavior toward the platform or community.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">10. Export Compliance</h2>
            <p>
              You may not access or use the platform if you are located in a country subject to U.S. export restrictions or sanctions. By using the platform, you represent and warrant that you are not subject to such restrictions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">11. Changes to Terms</h2>
            <p>
              FractionaX may revise these Terms at any time. Material updates will be posted to the site or emailed to users. Your continued use of the platform after changes are published constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes will be resolved through binding arbitration or the courts located in Delaware.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">13. Contact</h2>
            <p>
              If you have questions regarding these Terms, please contact us at{" "}
              <a href="mailto:support@fractionax.io" className="text-blue-400 underline">
                support@fractionax.io
              </a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
