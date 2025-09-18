import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Send, Search } from 'lucide-react';

const CustomerSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  const faqItems = [
    {
      question: 'How do I invest in a property?',
      answer: 'You can invest in properties through our marketplace. Browse available properties, review the details, and make your investment with just a few clicks.',
      category: 'Investment'
    },
    {
      question: 'What are FXCT and FST tokens?',
      answer: 'FXCT is our core utility token, while FST is our premium staking token that offers enhanced rewards.',
      category: 'Tokens'
    },
    {
      question: 'How do I stake my tokens?',
      answer: 'Go to the Tokens page and click the "Stake" button. Choose your staking duration and amount to start earning rewards.',
      category: 'Tokens'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600">Get help with your FractionaX account and investments</p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-600 text-sm mb-4">Chat with our support team</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Start Chat
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 text-sm mb-4">Get help via email</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Send Email
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <Phone className="w-8 h-8 text-purple-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-600 text-sm mb-4">Call our support line</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Call Now
          </button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Send us a Message</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="investment">Investment Questions</option>
                <option value="tokens">Token & Staking</option>
                <option value="technical">Technical Issues</option>
                <option value="account">Account Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Describe your issue or question..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Send size={16} />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details key={index} className="border border-gray-200 rounded-lg">
              <summary className="p-4 cursor-pointer hover:bg-gray-50 flex items-center">
                <HelpCircle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <span className="font-medium">{item.question}</span>
              </summary>
              <div className="p-4 pt-0 text-gray-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
