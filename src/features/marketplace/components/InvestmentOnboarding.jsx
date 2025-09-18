import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Shield, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  Coins,
  PieChart,
  Target
} from 'lucide-react';

const InvestmentOnboarding = ({ onComplete, userType = "guest" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInvestmentGoal, setSelectedInvestmentGoal] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [isAccredited, setIsAccredited] = useState(null);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to FractionaX',
      subtitle: 'Your fractional real estate investment journey starts here'
    },
    {
      id: 'investment-goal',
      title: 'What\'s Your Investment Goal?',
      subtitle: 'Help us customize your experience'
    },
    {
      id: 'budget',
      title: 'Investment Budget Range',
      subtitle: 'Start small, grow over time'
    },
    {
      id: 'accreditation',
      title: 'Investor Status',
      subtitle: 'Determines available investment options'
    },
    {
      id: 'ecosystem',
      title: 'FXCT Token Benefits',
      subtitle: 'Fuel your investment activity'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      subtitle: 'Start exploring investment opportunities'
    }
  ];

  const investmentGoals = [
    {
      id: 'passive-income',
      title: 'Generate Passive Income',
      description: 'Earn monthly dividends from rental properties',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'portfolio-diversification',
      title: 'Diversify Portfolio',
      description: 'Add real estate exposure to investment mix',
      icon: PieChart,
      color: 'blue'
    },
    {
      id: 'wealth-building',
      title: 'Long-term Wealth Building',
      description: 'Build wealth through property appreciation',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'community-investing',
      title: 'Community Investing',
      description: 'Join investment groups and earn rewards',
      icon: Users,
      color: 'orange'
    }
  ];

  const budgetRanges = [
    { id: 'starter', label: '$100 - $1,000', description: 'Perfect for getting started' },
    { id: 'growing', label: '$1,000 - $5,000', description: 'Build a diversified portfolio' },
    { id: 'serious', label: '$5,000 - $25,000', description: 'Serious wealth building' },
    { id: 'major', label: '$25,000+', description: 'Major investment commitment' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const onboardingData = {
        investmentGoal: selectedInvestmentGoal,
        budgetRange: selectedBudget,
        isAccredited,
        completedAt: new Date().toISOString()
      };
      onComplete(onboardingData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">🏠</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <DollarSign className="w-8 h-8 text-green-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-green-800">Start with $100</h3>
                <p className="text-sm text-green-600">Low barrier to entry</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Users className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-blue-800">Community Driven</h3>
                <p className="text-sm text-blue-600">Invest with others</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <Shield className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
                <h3 className="font-semibold text-purple-800">SEC Compliant</h3>
                <p className="text-sm text-purple-600">Legal protection</p>
              </div>
            </div>
          </div>
        );

      case 'investment-goal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investmentGoals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedInvestmentGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedInvestmentGoal(goal.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {goal.title}
                        </h3>
                        <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.subtitle}</p>
            </div>
            <div className="space-y-3">
              {budgetRanges.map((range) => {
                const isSelected = selectedBudget === range.id;
                return (
                  <button
                    key={range.id}
                    onClick={() => setSelectedBudget(range.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-semibold ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                          {range.label}
                        </h3>
                        <p className={`text-sm ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                          {range.description}
                        </p>
                      </div>
                      {isSelected && <CheckCircle className="w-6 h-6 text-green-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'accreditation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.subtitle}</p>
            </div>
            
            {/* Accreditation Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What is an Accredited Investor?</h3>
              <p className="text-sm text-blue-800 mb-3">
                Accredited investors can own actual fractional property shares (FXST security tokens). 
                Non-accredited investors can still participate through bidding and earning rewards.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsAccredited(true)}
                className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                  isAccredited === true 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Shield className={`w-8 h-8 ${isAccredited === true ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <h3 className={`font-semibold ${isAccredited === true ? 'text-green-900' : 'text-gray-900'}`}>
                      Yes, I am an Accredited Investor
                    </h3>
                    <p className={`text-sm ${isAccredited === true ? 'text-green-700' : 'text-gray-600'}`}>
                      Access to FXST security tokens, ownership rights, and dividends
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsAccredited(false)}
                className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                  isAccredited === false 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Coins className={`w-8 h-8 ${isAccredited === false ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    <h3 className={`font-semibold ${isAccredited === false ? 'text-blue-900' : 'text-gray-900'}`}>
                      No, I am not Accredited
                    </h3>
                    <p className={`text-sm ${isAccredited === false ? 'text-blue-700' : 'text-gray-600'}`}>
                      Access to FXCT bidding, rewards, staking, and community features
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 'ecosystem':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.subtitle}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Coins className="w-8 h-8 text-orange-600" />
                <h3 className="text-xl font-semibold text-orange-900">FXCT Utility Token</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-800">Primary Uses:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Bid on properties to signal demand</li>
                    <li>• Access premium marketplace features</li>
                    <li>• Earn 5-10% bonus rewards</li>
                    <li>• Stake for 5-10% APY yields</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-800">Benefits:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Own and trade your tokens</li>
                    <li>• Share on social for extra rewards</li>
                    <li>• Reduce transaction fees up to 70%</li>
                    <li>• Join exclusive investment groups</li>
                  </ul>
                </div>
              </div>
            </div>

            {isAccredited && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-900">FXST Security Token Access</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-800">Ownership Benefits:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Legal fractional property ownership</li>
                      <li>• Monthly rental income dividends</li>
                      <li>• Property appreciation participation</li>
                      <li>• Secondary market liquidity</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-800">Master FXST Rewards:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 1% of ALL platform net income</li>
                      <li>• Exposure to crypto growth wallet</li>
                      <li>• Compounded returns over time</li>
                      <li>• Platform-wide diversification</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.subtitle}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Your Investment Profile</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Goal:</span>
                  <span className="font-medium text-blue-800">
                    {investmentGoals.find(g => g.id === selectedInvestmentGoal)?.title || 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Range:</span>
                  <span className="font-medium text-blue-800">
                    {budgetRanges.find(b => b.id === selectedBudget)?.label || 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investor Status:</span>
                  <span className={`font-medium ${isAccredited ? 'text-green-800' : 'text-orange-800'}`}>
                    {isAccredited === null ? 'Not specified' : 
                     isAccredited ? 'Accredited Investor' : 'Non-Accredited Investor'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Next Steps:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
                  <Target className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Explore Properties</h4>
                  <p className="text-sm text-gray-600">Browse investment opportunities in the marketplace</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
                  <Coins className="w-6 h-6 text-orange-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Get FXCT Tokens</h4>
                  <p className="text-sm text-gray-600">Start bidding and earning rewards</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep 
                      ? 'bg-blue-600' 
                      : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={
                (steps[currentStep].id === 'investment-goal' && !selectedInvestmentGoal) ||
                (steps[currentStep].id === 'budget' && !selectedBudget) ||
                (steps[currentStep].id === 'accreditation' && isAccredited === null)
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestmentOnboarding;
