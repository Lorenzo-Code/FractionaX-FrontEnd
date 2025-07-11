import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/common/Footer";

const PrivacyPolicy = () => {
    return (
        <div>
            <div className="bg-[#191d2b] text-white min-h-screen py-16 px-6 md:px-20 lg:px-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold mb-6">📜 FractionaX Privacy Policy</h1>
                    <p className="text-gray-400 mb-6 text-sm">
                        <strong>Effective Date:</strong> July 11, 2025 &nbsp;|&nbsp; <strong>Last Updated:</strong> July 11, 2025
                    </p>

                    {/* 1. Introduction */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">1. Introduction</h2>
                        <p className="text-gray-300">
                            FractionaX ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you interact with our platform.
                        </p>
                        <p className="text-gray-300 mt-2">
                            By using FractionaX, you agree to the terms outlined in this Privacy Policy.
                        </p>
                    </section>

                    {/* 2. Information We Collect */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">2. Information We Collect</h2>
                        <p className="text-gray-300 mb-2 font-semibold">a) Information You Provide:</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                            <li>Name, email, and phone number</li>
                            <li>Wallet address or linked accounts</li>
                            <li>Feedback, messages, or form submissions</li>
                        </ul>
                        <p className="text-gray-300 mt-4 font-semibold">b) Automatically Collected Data:</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                            <li>IP address and browser fingerprint</li>
                            <li>Device and usage data</li>
                            <li>Activity logs and session behavior</li>
                        </ul>
                        <p className="text-gray-300 mt-4 font-semibold">c) Blockchain Data:</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                            <li>Smart contract interactions</li>
                            <li>Transaction hashes and wallet events</li>
                        </ul>
                        <p className="text-gray-400 mt-2 italic">
                            Note: We do not store private keys, seed phrases, or passwords from connected crypto wallets.
                        </p>
                    </section>

                    {/* 3. How We Use Your Data */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">3. How We Use Your Data</h2>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Provide platform access and customer support</li>
                            <li>Improve site functionality and features</li>
                            <li>Notify you of updates, changes, or alerts</li>
                            <li>Comply with legal, tax, or audit obligations</li>
                            <li>Prevent fraud, abuse, and security threats</li>
                        </ul>
                    </section>

                    {/* 4. Data Sharing */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">4. Data Sharing</h2>
                        <p className="text-gray-300 mb-2">
                            We do not sell or share your personal data for advertising purposes. We may share data only with:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Third-party processors under strict contracts (e.g., email or hosting providers)</li>
                            <li>Legal or regulatory authorities when required by law</li>
                            <li>Security auditors or compliance agents under NDA</li>
                        </ul>
                    </section>

                    {/* 5. Cookies */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">5. Cookies and Tracking</h2>
                        <p className="text-gray-300 mb-2">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Remember user preferences</li>
                            <li>Analyze traffic and performance</li>
                            <li>Secure session activity</li>
                        </ul>
                        <p className="text-gray-400 mt-2">
                            You may adjust your cookie settings in your browser or opt-out via platform settings (when available).
                        </p>
                    </section>

                    {/* 6. Data Retention */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">6. Data Retention</h2>
                        <p className="text-gray-300">
                            We retain personal information only as long as necessary for business or legal purposes. You may request deletion of your data at any time, subject to compliance obligations.
                        </p>
                    </section>

                    {/* 7. Your Rights */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">7. Your Rights</h2>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Access, correct, or delete your personal data</li>
                            <li>Withdraw consent to marketing or data processing</li>
                            <li>Request a copy of your stored information</li>
                        </ul>
                        <p className="text-gray-300 mt-2">
                            To exercise these rights, email us at{" "}
                            <a href="mailto:support@fractionax.io" className="text-blue-400 underline hover:text-blue-300">
                                support@fractionax.io
                            </a>.
                        </p>
                    </section>

                    {/* 8. International Users */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">8. International Users</h2>
                        <p className="text-gray-300">
                            Our services are hosted in the United States. If you are accessing from the EU, UK, or other regions, your data may be transferred and stored outside your jurisdiction in compliance with applicable data protection laws.
                        </p>
                    </section>

                    {/* 9. Data Security */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">9. Data Security</h2>
                        <p className="text-gray-300">
                            We use strong encryption, secure storage, and access controls to protect your data. However, no online system is ever 100% secure. You use our services at your own risk.
                        </p>
                    </section>

                    {/* 10. Children’s Privacy */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">10. Children’s Privacy</h2>
                        <p className="text-gray-300">
                            FractionaX is not intended for use by children under 18. We do not knowingly collect data from minors. If you believe a minor has provided data, please contact us for prompt removal.
                        </p>
                    </section>

                    {/* 11. Policy Changes */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">11. Policy Changes</h2>
                        <p className="text-gray-300">
                            We may update this Privacy Policy at any time. You will be notified of material changes via email or in-app notices. Your continued use of the platform after updates constitutes acceptance.
                        </p>
                    </section>

                    {/* 12. Contact Information */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">12. Third-Party Processors</h2>
                        <p className="text-gray-400">
                            We engage trusted service providers to help operate and improve our platform, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                            <li><strong>Hosting:</strong> Amazon Web Services (AWS)</li>
                            <li><strong>Email Delivery:</strong> SendGrid</li>
                            <li><strong>Analytics:</strong> Plausible Analytics (privacy-first, cookie-free)</li>
                            <li><strong>Payments & KYC:</strong> Stripe, Sila, or similar verified providers</li>
                        </ul>
                        <p className="text-gray-400 mt-2">
                            All processors are under contract to uphold strict data protection, encryption, and confidentiality standards.
                        </p>
                    </section>

                    {/* 13. Contact Information */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">13. Data Breach Notification</h2>
                        <p className="text-gray-400">
                            If a data breach occurs involving your personal information, FractionaX will notify affected users within <strong>72 hours</strong> via email and/or in-app notifications. We will detail what occurred, what data was involved, and the steps being taken to address it.
                        </p>
                    </section>

                    {/* 14. Contact Information */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">14. International Data Transfers & GDPR</h2>
                        <p className="text-gray-400">
                            FractionaX is headquartered in the United States. If you are located in the European Union (EU), United Kingdom (UK), or other regions with data transfer restrictions, your personal data may be processed in the U.S.
                        </p>
                        <p className="text-gray-400 mt-2">
                            We follow applicable data protection regulations (e.g., GDPR, UK GDPR). If legally required, we will appoint a data protection representative in those jurisdictions, and update this policy with their contact details.
                        </p>
                    </section>

                    {/* 15. Contact Information */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">15. Accessibility & Translation</h2>
                        <p className="text-gray-400">
                            This Privacy Policy is provided in English. If you require a translated version for accessibility or legal reasons, please contact us at{" "}
                            <a href="mailto:support@fractionax.io" className="text-blue-400 underline hover:text-blue-300">
                                support@fractionax.io
                            </a>
                            , and we’ll do our best to accommodate your request.
                        </p>
                    </section>

                    {/* 16. Contact Information */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">16. Contact Information</h2>
                        <p className="text-gray-300">
                            <strong>FractionaX</strong><br />
                            200 Continental Drive, Suite 401<br />
                            Newark, DE 19713<br />
                            📧 <a href="mailto:support@fractionax.io" className="text-blue-400 hover:underline">support@fractionax.io</a><br />
                            📞 +1 (713) 309-6573
                        </p>
                    </section>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
