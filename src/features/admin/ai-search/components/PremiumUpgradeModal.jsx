import React, { useState } from 'react';
import { 
  FiX, 
  FiCreditCard, 
  FiShield, 
  FiTrendingUp, 
  FiCheck,
  FiStar,
  FiZap,
  FiDollarSign
} from 'react-icons/fi';

const PremiumUpgradeModal = ({ selectedFeature, onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentMethod, setPaymentMethod] = useState('fct');

  const plans = {
    premium: {
      name: 'Premium Report',
      price: 50,
      currency: 'FCT',
      usdValue: 25.00,
      features: [
        'Climate risk analysis',
        'Building intelligence',
        'Financial data & taxes',
        'Investment analysis',
        'Detailed market insights',
        'Property valuation models'
      ],
      color: 'blue',
      popular: true
    },
    enterprise: {
      name: 'Enterprise Report',
      price: 100,
      currency: 'FCT',
      usdValue: 50.00,
      features: [
        'Everything in Premium',
        'AI-powered roof analysis',
        'Weather event history',
        'Reconstruction cost analysis',
        'Portfolio correlation data',
        'Custom risk modeling',
        'Priority support'
      ],
      color: 'purple',
      popular: false
    }
  };

  const handleUpgrade = () => {
    onUpgrade({
      plan: selectedPlan,
      paymentMethod,
      amount: plans[selectedPlan].price,
      currency: plans[selectedPlan].currency
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Unlock Premium Property Intelligence</h2>
              <p className="text-blue-100 mt-2">
                Get comprehensive insights that professional investors rely on
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors p-2 hover:bg-blue-700 rounded-lg"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Value Proposition */}
          <div className="mb-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Make Better Investment Decisions with Professional-Grade Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <FiTrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800">Reduce Risk</h4>
                <p className="text-sm text-green-700">Identify potential issues before they cost you money</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <FiShield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800">Protect Investment</h4>
                <p className="text-sm text-blue-700">Comprehensive risk analysis and mitigation strategies</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <FiZap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-800">Save Time</h4>
                <p className="text-sm text-purple-700">Instant access to data that takes weeks to research</p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(plans).map(([planId, plan]) => (
                <div
                  key={planId}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlan === planId
                      ? `border-${plan.color}-500 bg-${plan.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPlan(planId)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                    <div className="mt-2">
                      <span className={`text-3xl font-bold text-${plan.color}-600`}>
                        {plan.price} {plan.currency}
                      </span>
                      <p className="text-gray-500 text-sm">≈ ${plan.usdValue} USD</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FiCheck className={`w-4 h-4 text-${plan.color}-500`} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPlan === planId
                        ? `bg-${plan.color}-500 border-${plan.color}-500`
                        : 'border-gray-300'
                    }`}>
                      {selectedPlan === planId && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'fct'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('fct')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === 'fct'
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'fct' && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">Fractionax Tokens (FCT)</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Pay with your FCT wallet balance</p>
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'credit'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('credit')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === 'credit'
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'credit' && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <FiCreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Credit Card</span>
                    </div>
                    <p className="text-sm text-gray-600">Pay with USD (converted to FCT)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Balance Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <FiDollarSign className="w-5 h-5" />
              <span>Your Wallet Balance</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">FCT Balance</p>
                <p className="font-semibold text-green-600">1,250 FCT</p>
              </div>
              <div>
                <p className="text-gray-600">FXST Balance</p>
                <p className="font-semibold text-blue-600">500 FXST</p>
              </div>
            </div>
            {plans[selectedPlan].price > 1250 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Insufficient FCT balance. You can top up your wallet or pay with credit card.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">{plans[selectedPlan].name}</span>
              <span className="font-semibold">{plans[selectedPlan].price} FCT</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
              <span>USD Value</span>
              <span>${plans[selectedPlan].usdValue.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{plans[selectedPlan].price} FCT</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={paymentMethod === 'fct' && plans[selectedPlan].price > 1250}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentMethod === 'fct' ? 'Pay with FCT' : `Pay $${plans[selectedPlan].usdValue}`}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiShield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4" />
                <span>Trusted by 10,000+ users</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiZap className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;
