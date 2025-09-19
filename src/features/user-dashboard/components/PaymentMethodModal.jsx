import React, { useState } from 'react';
import { X, CreditCard, Bitcoin, Shield, Lock, AlertCircle } from 'lucide-react';
import { initializeStripePayment, formatStripeError } from '../utils/stripeIntegration';
import { initializeCoinbasePayment, formatCoinbaseError } from '../utils/coinbaseIntegration';

const PaymentMethodModal = ({ isOpen, onClose, selectedPlan, billingCycle, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const planPrices = {
    basic: { monthly: 0, yearly: 0 },
    professional: { monthly: 29, yearly: 299 },
    premium: { monthly: 99, yearly: 999 }
  };

  const planNames = {
    basic: 'Basic',
    professional: 'Professional', 
    premium: 'Premium'
  };

  const currentPrice = planPrices[selectedPlan]?.[billingCycle] || 0;
  const planName = planNames[selectedPlan] || 'Unknown';

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const paymentData = {
        planId: selectedPlan,
        billingCycle,
        amount: currentPrice
      };

      const session = await initializeStripePayment(paymentData);
      
      if (session.success) {
        // In a real implementation, you would redirect to Stripe checkout
        // window.location.href = session.checkoutUrl;
        
        // For demo purposes, show success message
        alert(`Demo: Would redirect to Stripe checkout at: ${session.checkoutUrl}`);
        onPaymentSuccess?.(selectedPlan, 'stripe');
        onClose();
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (err) {
      console.error('Stripe payment error:', err);
      setError(formatStripeError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCoinbasePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const paymentData = {
        planId: selectedPlan,
        billingCycle,
        amount: currentPrice
      };

      const charge = await initializeCoinbasePayment(paymentData);
      
      if (charge.success) {
        // In a real implementation, you would redirect to Coinbase Commerce checkout
        // window.location.href = charge.hostedUrl;
        
        // For demo purposes, show success message
        alert(`Demo: Would redirect to Coinbase Commerce at: ${charge.hostedUrl}`);
        onPaymentSuccess?.(selectedPlan, 'coinbase');
        onClose();
      } else {
        throw new Error('Failed to create crypto payment charge');
      }
    } catch (err) {
      console.error('Coinbase payment error:', err);
      setError(formatCoinbaseError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (selectedMethod === 'stripe') {
      handleStripePayment();
    } else {
      handleCoinbasePayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Choose Payment Method</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{planName} Plan</h3>
                <p className="text-sm text-gray-600">
                  {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} subscription
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${currentPrice}
                </div>
                <div className="text-sm text-gray-600">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center mb-6">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
            
            {/* Stripe Option */}
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedMethod === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod('stripe')}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'stripe' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <CreditCard className="w-6 h-6 text-gray-700 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Credit Card</h4>
                  <p className="text-sm text-gray-600">
                    Secure payment via Stripe
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">MC</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">Amex</div>
                </div>
              </div>
            </div>

            {/* Coinbase Option */}
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedMethod === 'coinbase'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod('coinbase')}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedMethod === 'coinbase'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'coinbase' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <Bitcoin className="w-6 h-6 text-gray-700 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Cryptocurrency</h4>
                  <p className="text-sm text-gray-600">
                    Pay with Bitcoin, Ethereum & more
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">BTC</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">ETH</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">+</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Secure Payment</h4>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We use industry-standard
                  security measures to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || currentPrice === 0}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {currentPrice === 0 ? 'Start Free Plan' : `Pay $${currentPrice}`}
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;