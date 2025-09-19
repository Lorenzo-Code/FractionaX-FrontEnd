import React, { useState } from 'react';
import { Check, Star, Crown, Shield, Users, TrendingUp, Gem, Settings } from 'lucide-react';
import { SEO } from '../../../shared/components';
import { generatePageSEO } from '../../../shared/utils';
import PaymentMethodModal from '../components/PaymentMethodModal';
import MembershipManagement from '../components/MembershipManagement';

const CustomerMembership = () => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState('professional');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');

  const seoData = generatePageSEO({
    title: "Membership Plans | FractionaX",
    description: "Choose the perfect membership plan for your fractional real estate investment journey. Unlock exclusive features and benefits.",
    url: "/dashboard/membership",
    keywords: ["membership", "subscription", "premium features", "real estate investment", "FractionaX"]
  });

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Users,
      color: 'blue',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started with fractional real estate',
      badge: 'Free Forever',
      features: [
        'Access to marketplace',
        'Basic portfolio tracking',
        'Standard customer support',
        'Up to 3 property investments',
        'Basic market analytics',
        'Mobile app access'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: TrendingUp,
      color: 'purple',
      monthlyPrice: 29,
      yearlyPrice: 299,
      description: 'Advanced tools and analytics for serious investors',
      badge: 'Most Popular',
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited property investments',
        'Advanced portfolio analytics',
        'Priority customer support',
        'Market intelligence reports',
        'Automated investment strategies',
        'Tax optimization tools',
        'Early access to new properties',
        'Custom investment alerts'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      color: 'gold',
      monthlyPrice: 99,
      yearlyPrice: 999,
      description: 'Exclusive access and white-glove service',
      badge: 'VIP Experience',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Exclusive property deals',
        'Custom investment research',
        'White-label investment tools',
        'Direct developer access',
        'Institutional-grade analytics',
        '24/7 concierge support',
        'Private investor events',
        'Custom reporting dashboard'
      ]
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.yearlyPrice;
      return Math.round((savings / monthlyCost) * 100);
    }
    return 0;
  };

  const getColorClasses = (color, variant = 'primary') => {
    const colorMap = {
      blue: {
        primary: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
        secondary: 'border-blue-200 hover:border-blue-300',
        accent: 'text-blue-600',
        gradient: 'from-blue-50 to-blue-100'
      },
      purple: {
        primary: 'bg-purple-600 hover:bg-purple-700 border-purple-600',
        secondary: 'border-purple-200 hover:border-purple-300 ring-2 ring-purple-500',
        accent: 'text-purple-600',
        gradient: 'from-purple-50 to-purple-100'
      },
      gold: {
        primary: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600',
        secondary: 'border-yellow-200 hover:border-yellow-300',
        accent: 'text-yellow-600',
        gradient: 'from-yellow-50 to-yellow-100'
      }
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    if (planId !== currentPlan) {
      setPaymentPlan(planId);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (planId, paymentMethod) => {
    console.log('Payment successful for plan:', planId, 'via', paymentMethod);
    setCurrentPlan(planId);
    setSelectedPlan(planId);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentPlan(null);
  };

  const handleUpgrade = () => {
    setActiveTab('plans');
  };

  const handleCancelSubscription = async (subscriptionId) => {
    console.log('Canceling subscription:', subscriptionId);
    return Promise.resolve();
  };

  const handleRenewSubscription = async (subscriptionId) => {
    console.log('Renewing subscription:', subscriptionId);
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO {...seoData} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Membership & Subscription
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage your subscription and unlock exclusive features for your investment journey
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-sm border max-w-md mx-auto flex">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                  activeTab === 'plans'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Crown className="w-4 h-4 mr-2" />
                Plans & Pricing
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Subscription
              </button>
            </div>
          </div>

          {/* Current Plan Badge - Only show on plans tab */}
          {currentPlan && activeTab === 'plans' && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4 mr-2" />
              Currently on {membershipPlans.find(p => p.id === currentPlan)?.name} plan
            </div>
          )}

          {/* Billing Toggle - Only show on plans tab */}
          {activeTab === 'plans' && (
            <div className="flex items-center justify-center space-x-4 bg-white rounded-xl p-1 shadow-sm border max-w-xs mx-auto">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">Save 17%</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'plans' ? (
          <div>
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {membershipPlans.map((plan) => {
                const price = getPrice(plan);
                const savings = getSavings(plan);
                const IconComponent = plan.icon;
                const isCurrentPlan = plan.id === currentPlan;
                const isPopular = plan.popular;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                      isPopular ? getColorClasses(plan.color, 'secondary') : 'border-gray-200 hover:border-gray-300'
                    } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-4">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Current Plan
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getColorClasses(plan.color, 'gradient')} mb-4`}>
                          <IconComponent className={`w-8 h-8 ${getColorClasses(plan.color, 'accent')}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-6">
                        {price === 0 ? (
                          <div className="text-3xl font-bold text-gray-900">Free</div>
                        ) : (
                          <div>
                            <div className="text-4xl font-bold text-gray-900">
                              ${price}
                              <span className="text-lg font-medium text-gray-600">
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                              </span>
                            </div>
                            {savings > 0 && (
                              <div className="text-sm text-green-600 font-medium mt-1">
                                Save {savings}% with yearly billing
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isCurrentPlan}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 ${
                          isCurrentPlan
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : selectedPlan === plan.id
                            ? `${getColorClasses(plan.color, 'primary')} text-white`
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                      >
                        {isCurrentPlan
                          ? 'Current Plan'
                          : price === 0
                          ? 'Get Started Free'
                          : `Upgrade to ${plan.name}`
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    question: "Can I change my plan anytime?",
                    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your current billing cycle for downgrades."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards through Stripe, as well as cryptocurrency payments including Bitcoin, Ethereum, and other major tokens through Coinbase Commerce."
                  },
                  {
                    question: "Is there a free trial for premium plans?",
                    answer: "We offer a 7-day free trial for Professional and Premium plans. You can cancel anytime during the trial period without being charged."
                  },
                  {
                    question: "What happens if I cancel my subscription?",
                    answer: "You'll continue to have access to your plan features until the end of your current billing period. After that, you'll be moved to our Basic free plan."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <MembershipManagement
            currentSubscription={{
              planName: membershipPlans.find(p => p.id === currentPlan)?.name,
              planId: currentPlan,
              status: 'active',
              billingCycle: billingCycle,
              amount: membershipPlans.find(p => p.id === currentPlan)?.[billingCycle === 'monthly' ? 'monthlyPrice' : 'yearlyPrice'],
              nextBillingDate: '2024-03-15',
              subscriptionId: 'sub_1234567890',
              paymentMethod: 'stripe',
              cardLast4: '4242',
              cardBrand: 'visa',
              startDate: '2024-02-15',
              features: membershipPlans.find(p => p.id === currentPlan)?.features || []
            }}
            onUpgrade={handleUpgrade}
            onCancelSubscription={handleCancelSubscription}
            onRenewSubscription={handleRenewSubscription}
          />
        )}
      </div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        selectedPlan={paymentPlan}
        billingCycle={billingCycle}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CustomerMembership;