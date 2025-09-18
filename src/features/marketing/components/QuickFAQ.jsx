import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const QuickFAQ = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "How can I invest in real estate with just $100?",
      answer: "Through fractional ownership! You purchase FXST tokens representing shares in real estate properties, making premium real estate accessible with small investments. However, you must be an accredited investor to purchase property tokens due to SEC regulations."
    },
    {
      question: "What are FXCT and FXST tokens?", 
      answer: "FXCT are utility tokens used for platform operations, bidding, rewards, and governance. FXST are property ownership tokens representing fractional shares in real estate. Each FXST token provides proportional rental income and property appreciation rights."
    },
    {
      question: "Do I need to be an Accredited Investor?",
      answer: "Yes, due to SEC regulations, only accredited investors can purchase fractional real estate properties. This means meeting income ($200K+ individual, $300K+ joint) or net worth ($1M+ excluding primary residence) requirements, or holding certain professional certifications."
    },
    {
      question: "How do the internal wallets work?",
      answer: "Each user gets secure internal wallets for FXCT and FXST tokens with automatic rental income distributions, real-time balance updates, and easy trading. You can also connect external wallets like MetaMask for additional security and control."
    },
    {
      question: "What if I need help or have account issues?",
      answer: "Our support team is available 24/7 through live chat, email, or support tickets. We can help with password resets, 2FA issues, wallet management, KYC verification, and all platform features. Admin support can reset passwords and assist with account recovery."
    }
  ];

  return (
    <section id="quick-faq" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Common Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know to get started
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full px-6 py-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openFaq === index && (
                <div className="px-6 py-5 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* More questions CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have more questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="/faq" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              View Full FAQ
            </a>
            <span className="text-gray-300 hidden sm:block">•</span>
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickFAQ;
