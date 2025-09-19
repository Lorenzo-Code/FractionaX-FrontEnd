import React, { useState } from 'react';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Bitcoin,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  Settings,
  RefreshCw
} from 'lucide-react';

const MembershipManagement = ({ 
  currentSubscription,
  onUpgrade,
  onDowngrade,
  onCancelSubscription,
  onRenewSubscription 
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock subscription data structure
  const subscription = currentSubscription || {
    planName: 'Professional',
    planId: 'professional',
    status: 'active',
    billingCycle: 'monthly',
    amount: 29,
    nextBillingDate: '2024-03-15',
    subscriptionId: 'sub_1234567890',
    paymentMethod: 'stripe',
    cardLast4: '4242',
    cardBrand: 'visa',
    startDate: '2024-02-15',
    features: [
      'Unlimited property investments',
      'Advanced portfolio analytics',
      'Priority customer support',
      'Market intelligence reports',
      'Automated investment strategies'
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'canceled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'trialing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'canceled':
        return <AlertTriangle className="w-4 h-4" />;
      case 'past_due':
        return <Clock className="w-4 h-4" />;
      case 'trialing':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      await onCancelSubscription?.(subscription.subscriptionId);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewSubscription = async () => {
    setIsLoading(true);
    try {
      await onRenewSubscription?.(subscription.subscriptionId);
    } catch (error) {
      console.error('Failed to renew subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Current Subscription</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(subscription.status)}`}>
            {getStatusIcon(subscription.status)}
            <span className="ml-2 capitalize">{subscription.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Plan Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Crown className="w-5 h-5 text-purple-600 mr-2" />
                {subscription.planName} Plan
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                ${subscription.amount}/{subscription.billingCycle === 'monthly' ? 'month' : 'year'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Plan Features:</h4>
              <ul className="space-y-1">
                {subscription.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {subscription.features.length > 3 && (
                  <li className="text-sm text-gray-500">
                    +{subscription.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Billing Information</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Next billing: {formatDate(subscription.nextBillingDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Started: {formatDate(subscription.startDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
              <div className="flex items-center space-x-3">
                {subscription.paymentMethod === 'stripe' ? (
                  <>
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div className="text-sm text-gray-600">
                      <div className="capitalize">{subscription.cardBrand} ****{subscription.cardLast4}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Bitcoin className="w-5 h-5 text-orange-600" />
                    <div className="text-sm text-gray-600">
                      Cryptocurrency
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Upgrade Plan */}
          <button
            onClick={() => onUpgrade?.()}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Upgrade Plan
          </button>

          {/* Change Payment Method */}
          <button
            onClick={() => {/* Handle payment method change */}}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            <Settings className="w-4 h-4 mr-2" />
            Payment Method
          </button>

          {/* Download Invoice */}
          <button
            onClick={() => {/* Handle invoice download */}}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </button>

          {/* Cancel/Renew Subscription */}
          {subscription.status === 'active' ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Cancel Subscription
            </button>
          ) : (
            <button
              onClick={handleRenewSubscription}
              className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Renew Subscription
            </button>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        
        <div className="space-y-3">
          {[
            {
              id: 'inv_001',
              date: '2024-02-15',
              amount: 29,
              status: 'paid',
              description: 'Professional Plan - Monthly'
            },
            {
              id: 'inv_002',
              date: '2024-01-15',
              amount: 29,
              status: 'paid',
              description: 'Professional Plan - Monthly'
            },
            {
              id: 'inv_003',
              date: '2023-12-15',
              amount: 29,
              status: 'paid',
              description: 'Professional Plan - Monthly'
            }
          ].map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900">{invoice.description}</div>
                <div className="text-sm text-gray-600">{formatDate(invoice.date)}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium text-gray-900">${invoice.amount}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'paid' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-yellow-600 bg-yellow-50'
                  }`}>
                    {invoice.status}
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Subscription</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your {subscription.planName} subscription? 
                You'll lose access to premium features at the end of your current billing period.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Canceling...
                  </div>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipManagement;