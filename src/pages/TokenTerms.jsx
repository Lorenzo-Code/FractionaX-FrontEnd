import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/common/Footer";

const TokenTerms = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FXCT Token Terms of Use</h1>
          <p className="text-lg text-white/90">Effective Date: July 20, 2025</p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="flex-grow px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">1. Purpose and Use of FXCT</h2>
            <p>
              FXCT is a non-refundable, non-redeemable utility token intended solely for use within the FractionaX platform. FXCT grants no rights, express or implied, to any equity, dividends, voting power, or ownership in FractionaX or any affiliated entity.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">2. Subscription-Based Issuance & Locking Period</h2>
            <p>
              FXCT distributed through subscriptions is provided at a discounted rate and subject to a mandatory 45-day lock-up period. Users agree not to transfer, exchange, or sell these tokens during the lock period. This restriction is hardcoded in the smart contract to prevent manipulation and ensure sustainability.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">3. Transfer Fees & Smart Contract Behavior</h2>
            <p>
              Transfers of FXCT incur variable fees according to smart contract logic. Fees range from 1% of the transaction amount to a maximum of $12.00 USD. Fee caps vary by transaction size tier. FractionaX reserves the right to update smart contract parameters as needed for compliance or economic balancing. All fees are used to support operations, ecosystem development, and platform security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">4. Acknowledgement of Risk</h2>
            <p>
              The purchase and use of FXCT involves risk. You acknowledge that token prices may be volatile and market conditions unpredictable. No assurance is made regarding liquidity, secondary market availability, or continued utility. You accept full responsibility for your use of FXCT and agree that FractionaX bears no liability for token loss, theft, or devaluation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">5. No Refunds or Chargebacks</h2>
            <p>
              All FXCT purchases are final. You waive all rights to reversal, chargeback, or refund unless explicitly required by law. It is your responsibility to confirm wallet addresses and transaction details before submission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">6. Regulatory Classification & Disclosures</h2>
            <p>
              FXCT is intended to be classified as a utility token under applicable U.S. laws and is not a security under the Securities Act of 1933. FractionaX complies with relevant FinCEN, CFTC, and SEC guidance, and will adjust operations as laws evolve, including under the 2025 U.S. Digital Asset Market Structure Bill. We make no warranties that FXCT will be treated as non-security in all jurisdictions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">7. Eligibility</h2>
            <p>
              You must be at least 18 years old and not a citizen or resident of any jurisdiction where purchasing FXCT is prohibited by law. You are solely responsible for complying with your local laws and tax obligations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless FractionaX, its affiliates, directors, employees, and contractors from any claim, liability, damage, or loss arising from your use of FXCT, breach of these terms, or violation of any applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">9. Dispute Resolution</h2>
            <p>
              Any dispute arising under these Terms shall be resolved via binding arbitration in the State of Texas under the rules of the American Arbitration Association. You waive any right to class actions or jury trials.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">10. Optional Agreements</h2>
            <p>
              FractionaX offers a downloadable PDF version of these Token Terms for offline reference. Large or institutional investors may request a separately signed Token Purchase Agreement (TPA) by contacting us directly.
            </p>
          </div>

          <p className="text-gray-500 text-xs mt-8">
            Updated: July 2025 · Questions? Contact <a href="mailto:support@fractionax.io" className="text-blue-400">support@fractionax.io</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TokenTerms;
