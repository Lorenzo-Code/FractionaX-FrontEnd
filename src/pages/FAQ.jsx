import React, { useState, useEffect, useCallback } from 'react';
import SEO from '../components/SEO';
import { FiChevronDown, FiSearch, FiMessageCircle, FiHelpCircle } from 'react-icons/fi';
import faqAnalytics from '../utils/faqAnalytics';
import HelpfulVoting from '../components/HelpfulVoting';
import UnifiedSearchAssistant from '../components/UnifiedSearchAssistant';
import Footer from '../components/common/Footer';
import { generatePageSEO, generateStructuredData } from '../utils/seo';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is FractionaX and how does it work?",
          answer: "FractionaX is a revolutionary platform that enables fractional real estate investment through blockchain technology. Users can purchase tokens representing ownership shares in real estate properties, making property investment accessible with smaller capital requirements. Our platform uses smart contracts on the Base blockchain to ensure transparent, secure, and automated transactions.",
        },
        {
          question: "How do I create an account?",
          answer: "Creating an account is simple: 1) Click 'Sign Up' on our homepage, 2) Provide your email address and create a strong password, 3) Verify your email through the confirmation link we send, 4) Complete your profile with basic information, 5) For investment features, complete KYC verification by uploading required documents. The entire process typically takes 5-10 minutes.",
        },
        {
          question: "What documents do I need for KYC verification?",
          answer: "For KYC verification, you'll need: 1) Government-issued photo ID (passport, driver's license, or national ID), 2) Proof of address (utility bill, bank statement, or rental agreement from the last 3 months), 3) For business accounts: incorporation documents and beneficial ownership information. All documents must be clear, readable, and current. Verification typically takes 1-3 business days.",
        },
      ],
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "To reset your password: 1) Go to the login page and click 'Forgot Password', 2) Enter your registered email address, 3) Check your email for a reset link (check spam folder if not in inbox), 4) Click the link and enter your new password, 5) Confirm the new password and save. The reset link expires after 24 hours for security reasons.",
        },
        {
          question: "How do I update my profile information?",
          answer: "To update your profile: 1) Log into your account and go to 'Account Settings', 2) Click 'Edit Profile', 3) Update the desired information (name, phone, address, etc.), 4) Save changes. Note: Some changes like email address may require verification. Critical information changes might require additional verification for security purposes.",
        },
        {
          question: "How do I enable two-factor authentication (2FA)?",
          answer: "To enable 2FA: 1) Go to 'Account Settings' > 'Security', 2) Click 'Enable 2FA', 3) Download an authenticator app (Google Authenticator, Authy, etc.), 4) Scan the QR code with your app, 5) Enter the 6-digit code from your app, 6) Save your backup codes in a secure location. We strongly recommend enabling 2FA for enhanced account security.",
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account: 1) Go to 'Account Settings' > 'Privacy', 2) Click 'Delete Account', 3) Complete the verification process, 4) Confirm deletion. WARNING: This action is irreversible. Ensure you've withdrawn all funds and transferred any token holdings before deletion. We'll retain some data as required by law for a specified period.",
        },
      ],
    },
    {
      category: "Property Investment & Tokenization",
      questions: [
        {
          question: "How does property tokenization work?",
          answer: "Property tokenization converts real estate into digital tokens on the blockchain: 1) Properties are professionally appraised and legally structured, 2) The property value is divided into tokens (e.g., a $500,000 property = 500,000 tokens at $1 each), 3) Smart contracts manage ownership and transactions, 4) Tokens can be bought, sold, or traded on our platform, 5) Token holders receive proportional rental income and property appreciation. Each token represents fractional ownership with legal backing.",
        },
        {
          question: "What's the minimum investment amount?",
          answer: "The minimum investment varies by property but typically starts at $100 worth of tokens. This low barrier allows investors to diversify across multiple properties easily. Some premium properties may have higher minimums. You can check specific requirements on each property's listing page.",
        },
        {
          question: "How do I receive rental income from my tokens?",
          answer: "Rental income is distributed automatically: 1) Properties generate monthly rental income, 2) After deducting management fees and expenses, net income is calculated, 3) Income is distributed proportionally to token holders, 4) Payments are made directly to your platform wallet monthly, 5) You can track all payments in your 'Investment Dashboard'. Income distribution typically occurs within the first week of each month.",
        },
        {
          question: "Can I sell my tokens anytime?",
          answer: "Yes, tokens can be traded on our secondary marketplace: 1) Go to 'My Portfolio' and select the tokens you want to sell, 2) Set your asking price or accept market price, 3) List your tokens for sale, 4) Other users can purchase your tokens, 5) Transactions are processed instantly via smart contracts. Note: Liquidity may vary depending on property demand and market conditions.",
        },
        {
          question: "How are properties selected and vetted?",
          answer: "Our rigorous selection process includes: 1) Market analysis and location assessment, 2) Professional property inspection and appraisal, 3) Legal due diligence and title verification, 4) Financial projections and ROI analysis, 5) Property management partner evaluation, 6) Final approval by our investment committee. Only properties meeting our strict criteria are tokenized and offered to investors.",
        },
      ],
    },
    {
      category: "Wallet & Transactions",
      questions: [
        {
          question: "How do I deposit funds into my wallet?",
          answer: "To deposit funds: 1) Go to 'Wallet' in your dashboard, 2) Click 'Deposit', 3) Choose your payment method (bank transfer, credit/debit card, or cryptocurrency), 4) Enter the deposit amount, 5) Follow the payment instructions, 6) Funds typically appear within 1-3 business days for bank transfers, instantly for cards (subject to verification). All deposits are secured with bank-level encryption.",
        },
        {
          question: "How do I withdraw funds from my wallet?",
          answer: "To withdraw funds: 1) Go to 'Wallet' > 'Withdraw', 2) Enter withdrawal amount (minimum $50), 3) Select your withdrawal method (bank transfer or cryptocurrency), 4) Provide necessary details (bank account or crypto address), 5) Confirm withdrawal. Processing times: 3-5 business days for bank transfers, 1-24 hours for crypto. Withdrawal fees may apply.",
        },
        {
          question: "What are the transaction fees?",
          answer: "Our fee structure: 1) Deposit fees: 0% for bank transfers, 2.5% for credit/debit cards, 2) Trading fees: 1% per transaction (0.5% from buyer, 0.5% from seller), 3) Withdrawal fees: $5 for bank transfers, network fees for crypto, 4) Management fees: 1-2% annually on property holdings, 5) No monthly account maintenance fees. All fees are clearly displayed before transaction confirmation.",
        },
        {
          question: "Is my wallet secure?",
          answer: "Yes, we implement multiple security layers: 1) Funds are held in segregated accounts with licensed financial institutions, 2) Multi-signature wallet technology, 3) Cold storage for cryptocurrency holdings, 4) Regular security audits by third-party firms, 5) Insurance coverage for digital assets, 6) 24/7 monitoring for suspicious activities. Your funds are as secure as traditional banking systems.",
        },
      ],
    },
    {
      category: "Technical Issues & Troubleshooting",
      questions: [
        {
          question: "The website is loading slowly or not at all. What should I do?",
          answer: "Try these troubleshooting steps: 1) Check your internet connection, 2) Clear your browser cache and cookies, 3) Try a different browser or incognito/private mode, 4) Disable browser extensions temporarily, 5) Try accessing from a different device, 6) Check our status page for any ongoing issues. If problems persist, contact support with your browser version and error messages.",
        },
        {
          question: "I can't see my transaction history or it's showing incorrectly.",
          answer: "If transaction history isn't displaying properly: 1) Refresh the page and wait a few minutes, 2) Check your internet connection, 3) Clear browser cache, 4) Try logging out and back in, 5) If using mobile, try the desktop version. Blockchain transactions may take a few minutes to appear. If issues persist after 30 minutes, contact support with your transaction hash or reference number.",
        },
        {
          question: "I'm getting an error when trying to buy tokens.",
          answer: "Common solutions for purchase errors: 1) Ensure sufficient wallet balance including fees, 2) Check if the property sale is still active, 3) Verify your account is fully verified (KYC completed), 4) Try refreshing the page and attempting again, 5) Check if you've reached any investment limits, 6) Ensure stable internet connection. If the error persists, note the exact error message and contact support.",
        },
        {
          question: "The mobile app is not working properly.",
          answer: "For mobile app issues: 1) Force close and restart the app, 2) Check for app updates in your app store, 3) Restart your device, 4) Ensure you have stable internet connection, 5) Clear app cache (Android) or offload app (iOS), 6) Try using the web version temporarily. If problems continue, uninstall and reinstall the app, then contact support if issues persist.",
        },
      ],
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept multiple payment methods: 1) Bank transfers (ACH, wire transfers), 2) Credit and debit cards (Visa, Mastercard, American Express), 3) Cryptocurrencies (Bitcoin, Ethereum, USDC, USDT), 4) PayPal (in select regions), 5) Apple Pay and Google Pay for mobile users. Payment method availability may vary by region due to regulatory requirements.",
        },
        {
          question: "Why was my payment declined?",
          answer: "Payment declines can occur for several reasons: 1) Insufficient funds in your account, 2) Card expired or details incorrect, 3) Bank flagged as suspicious transaction, 4) Daily/monthly spending limits exceeded, 5) Geographic restrictions, 6) Account verification incomplete. Contact your bank first, then try an alternative payment method. If issues persist, our support team can help identify the specific cause.",
        },
        {
          question: "How do I update my payment method?",
          answer: "To update payment information: 1) Go to 'Account Settings' > 'Payment Methods', 2) Click 'Add New Payment Method' or edit existing ones, 3) Enter new card/bank details, 4) Verify the method through micro-deposits or instant verification, 5) Set as default if desired. Old payment methods remain available unless manually removed. Always ensure your payment information is current to avoid transaction failures.",
        },
        {
          question: "Can I get a refund on my investment?",
          answer: "Direct refunds aren't available as you're purchasing actual property tokens, not a service. However, you have options: 1) Sell your tokens on our secondary marketplace, 2) Trade with other users, 3) Hold for potential appreciation and rental income. In exceptional cases (technical errors, unauthorized transactions), we may process refunds case-by-case. Contact support immediately for such issues.",
        },
      ],
    },
    {
      category: "Legal & Compliance",
      questions: [
        {
          question: "Is FractionaX regulated and legal?",
          answer: "Yes, FractionaX operates under full legal compliance: 1) Licensed as a securities dealer where required, 2) Compliant with SEC regulations for digital securities, 3) Partner with licensed real estate brokers, 4) Follow AML/KYC requirements, 5) Regular audits by regulatory bodies, 6) Legal structure reviewed by top-tier law firms. All property tokens are legally backed by actual real estate ownership.",
        },
        {
          question: "What are the tax implications of my investments?",
          answer: "Tax treatment varies by jurisdiction, but generally: 1) Rental income is taxable as ordinary income, 2) Token sales may be subject to capital gains tax, 3) We provide tax documents (1099s in the US), 4) International users should consult local tax advisors, 5) Some jurisdictions may have different rules for digital assets. We strongly recommend consulting with a tax professional familiar with digital securities and real estate investments.",
        },
        {
          question: "What happens if FractionaX goes out of business?",
          answer: "Your investments are protected through several mechanisms: 1) Property ownership is held in separate legal entities, 2) Independent trustees manage property assets, 3) Token ownership is recorded on the blockchain, 4) Licensed backup servicers can continue operations, 5) Properties can be sold and proceeds distributed to token holders, 6) Legal documentation ensures investor rights are preserved. Your property ownership exists independently of FractionaX's business operations.",
        },
      ],
    },
    {
      category: "Security & Privacy",
      questions: [
        {
          question: "How do you protect my personal and financial data?",
          answer: "We implement comprehensive security measures: 1) Bank-grade 256-bit SSL encryption for all data transmission, 2) Personal data stored in encrypted databases, 3) SOC 2 Type II compliance, 4) Regular penetration testing, 5) GDPR and CCPA compliance for privacy rights, 6) Minimal data collection principle, 7) Secure data centers with 24/7 monitoring. We never sell your personal information to third parties.",
        },
        {
          question: "What should I do if I suspect unauthorized access to my account?",
          answer: "If you suspect unauthorized access: 1) Immediately change your password, 2) Enable 2FA if not already active, 3) Check your transaction history for unauthorized activities, 4) Contact our security team immediately, 5) Review and revoke any suspicious login sessions, 6) Consider temporarily freezing your account, 7) Monitor your email for any account change notifications. We have 24/7 security monitoring to help protect your account.",
        },
        {
          question: "Do you share my information with third parties?",
          answer: "We only share information when necessary: 1) With service providers under strict confidentiality agreements, 2) For legal compliance and regulatory requirements, 3) With your explicit consent, 4) For fraud prevention and security purposes, 5) In anonymized form for analytics (no personal identification). We never sell your data for marketing purposes. You can review our full privacy policy for complete details.",
        },
      ],
    },
  ];

  // Track page view on mount
  useEffect(() => {
    faqAnalytics.trackPageView();
  }, []);

  // Handle search with analytics
  const handleSearchChange = useCallback((event) => {
    const term = event.target.value;
    setSearchTerm(term);
    
    if (term) {
      const resultsCount = faqData.reduce((count, category) => {
        return count + category.questions.filter(item =>
          item.question.toLowerCase().includes(term.toLowerCase()) ||
          item.answer.toLowerCase().includes(term.toLowerCase())
        ).length;
      }, 0);
      
      faqAnalytics.trackSearch(term, resultsCount);
      
      if (resultsCount === 0) {
        faqAnalytics.trackNoSearchResults(term);
      }
    }
  }, [faqData]);

  // Track question interactions
  const handleQuestionExpand = useCallback((category, question, index) => {
    faqAnalytics.trackQuestionExpand(category, question, index);
  }, []);

  const handleQuestionView = useCallback((category, question, index) => {
    faqAnalytics.trackQuestionView(category, question, index);
  }, []);

  // Track AI Assistant and Support clicks
  const handleAIAssistantClick = useCallback(() => {
    faqAnalytics.trackAIAssistantClick();
  }, []);

  const handleSupportContactClick = useCallback(() => {
    faqAnalytics.trackSupportContactClick();
  }, []);

  // Handle category filtering
  const handleCategoryFilter = useCallback((categories) => {
    setSelectedCategories(categories);
  }, []);

  // Handle AI query (placeholder function)
  const handleAIQuery = useCallback((query) => {
    // Track AI query analytics
    faqAnalytics.trackAIAssistantClick();
    // Additional AI query logic can be added here
  }, []);

  // Filter FAQs based on search term and selected categories
  const filteredFAQs = faqData
    .filter(category => 
      selectedCategories.length === 0 || selectedCategories.includes(category.category)
    )
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        item => 
          !searchTerm || 
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.questions.length > 0);

  const displayFAQs = filteredFAQs;
  const resultsCount = displayFAQs.reduce((total, category) => total + category.questions.length, 0);

  // Generate SEO data for FAQ page
  const seoData = generatePageSEO({
    title: 'FAQ - Frequently Asked Questions',
    description: 'Find answers to common questions about FractionaX, property tokenization, investments, account management, and technical issues. Get help fast with our comprehensive FAQ.',
    keywords: [
      'FAQ',
      'help', 
      'support',
      'property tokenization',
      'real estate investment',
      'blockchain',
      'troubleshooting',
      'account management',
      'wallet',
      'security'
    ],
    url: '/faq',
  });

  // Flatten all FAQ questions for structured data
  const allFaqs = faqData.reduce((acc, category) => {
    return acc.concat(category.questions.map(q => ({
      question: q.question,
      answer: q.answer
    })));
  }, []);

  // Generate structured data
  const structuredData = [
    generateStructuredData.webPage({
      title: seoData.title,
      description: seoData.description,
      url: '/faq',
      type: 'FAQPage',
    }),
    generateStructuredData.faqPage(allFaqs),
    generateStructuredData.breadcrumb([
      { name: "Home", url: "/" },
      { name: "FAQ", url: "/faq" },
    ]),
  ];

  return (
    <>
      <SEO 
        {...seoData}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 mb-6">
              Find answers to common questions and get the help you need quickly.
            </p>
            
            {/* Unified Search Assistant */}
            <UnifiedSearchAssistant
              faqData={faqData}
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleCategoryFilter={handleCategoryFilter}
              handleAIQuery={handleAIQuery}
              selectedCategories={selectedCategories}
              resultsCount={resultsCount}
            />
          </div>

          {/* FAQ Categories */}
          {displayFAQs.length === 0 ? (
            <div className="text-center py-12">
              <FiSearch className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try different keywords or browse through our categories below.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {displayFAQs.map((category, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">
                        {category.questions.length}
                      </span>
                      {category.category}
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {category.questions.map((item, qIdx) => (
                        <div key={qIdx}>
                          <details className="group">
                            <summary 
                              className="cursor-pointer flex items-center justify-between py-4 px-5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                              onClick={() => handleQuestionExpand(category.category, item.question, qIdx)}
                              onMouseEnter={() => handleQuestionView(category.category, item.question, qIdx)}
                            >
                              <span className="text-lg font-medium text-gray-800 pr-4">{item.question}</span>
                              <FiChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="mt-4 px-5 py-4 bg-blue-50 rounded-lg">
                              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {item.answer}
                              </div>
                              <HelpfulVoting
                                category={category.category}
                                question={item.question}
                                questionIndex={qIdx}
                              />
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Links Section */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/support" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FiHelpCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Contact Support</div>
                  <div className="text-sm text-gray-600">Get personalized help</div>
                </div>
              </a>
              <a href="/status" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">System Status</div>
                  <div className="text-sm text-gray-600">Check platform status</div>
                </div>
              </a>
              <a href="/documentation" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FiMessageCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Documentation</div>
                  <div className="text-sm text-gray-600">Detailed guides</div>
                </div>
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-gray-600">
            <p className="mb-2">Still can't find what you're looking for?</p>
            <p>
              Our support team is available 24/7 to help you. 
              <a href="/contact" className="text-blue-600 hover:text-blue-800 underline ml-1">
                Contact us directly
              </a>
            </p>
          </div>
        </div>
        < Footer />
      </div>
    </>
  );
};

export default FAQ;
