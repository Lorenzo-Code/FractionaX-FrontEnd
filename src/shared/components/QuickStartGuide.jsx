import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  User, 
  Building, 
  Wallet, 
  TrendingUp,
  Star,
  Shield,
  Zap
} from 'lucide-react';

const QuickStartGuide = ({ onClose, userRole = 'new' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const getStepsForRole = (role) => {
    switch (role) {
      case 'investor':
        return [
          {
            title: 'Complete Your Profile',
            description: 'Verify your identity and set up your investor profile for secure trading.',
            path: '/dashboard/security',
            icon: Shield,
            completed: false,
            duration: '5 min'
          },
          {
            title: 'Fund Your Wallet',
            description: 'Add funds to start investing in fractional real estate properties.',
            path: '/dashboard/wallet',
            icon: Wallet,
            completed: false,
            duration: '3 min'
          },
          {
            title: 'Explore Properties',
            description: 'Browse available investment opportunities starting from $100.',
            path: '/marketplace',
            icon: Building,
            completed: false,
            duration: '10 min'
          },
          {
            title: 'Make Your First Investment',
            description: 'Select a property and purchase your fractional ownership shares.',
            path: '/marketplace',
            icon: TrendingUp,
            completed: false,
            duration: '5 min'
          },
          {
            title: 'Get FXCT Tokens',
            description: 'Join the pre-sale to unlock platform benefits and fee reductions.',
            path: '/pre-sale',
            icon: Zap,
            completed: false,
            duration: '3 min'
          }
        ];
      
      case 'admin':
        return [
          {
            title: 'Dashboard Overview',
            description: 'Get familiar with the main admin dashboard and key metrics.',
            path: '/admin',
            icon: User,
            completed: false,
            duration: '5 min'
          },
          {
            title: 'User Management',
            description: 'Learn to manage users, KYC processes, and security controls.',
            path: '/admin/users',
            icon: Shield,
            completed: false,
            duration: '10 min'
          },
          {
            title: 'Property Management',
            description: 'Add and manage investment properties on the platform.',
            path: '/admin/properties',
            icon: Building,
            completed: false,
            duration: '15 min'
          },
          {
            title: 'Analytics & Reports',
            description: 'Understand platform performance and user analytics.',
            path: '/admin/analytics',
            icon: TrendingUp,
            completed: false,
            duration: '10 min'
          },
          {
            title: 'AI Tools Setup',
            description: 'Configure AI property search and other automated features.',
            path: '/admin/ai-search',
            icon: Zap,
            completed: false,
            duration: '8 min'
          }
        ];
      
      default: // new users
        return [
          {
            title: 'Learn How It Works',
            description: 'Understand fractional real estate investing and the FractionaX process.',
            path: '/how-it-works',
            icon: User,
            completed: false,
            duration: '5 min'
          },
          {
            title: 'Explore Token Ecosystem',
            description: 'Discover FXCT utility tokens and FXST security tokens.',
            path: '/ecosystem',
            icon: Star,
            completed: false,
            duration: '7 min'
          },
          {
            title: 'Browse Investment Opportunities',
            description: 'See real properties available for fractional investment.',
            path: '/marketplace',
            icon: Building,
            completed: false,
            duration: '10 min'
          },
          {
            title: 'Choose Your Plan',
            description: 'Select an investor membership plan that fits your goals.',
            path: '/pricing',
            icon: TrendingUp,
            completed: false,
            duration: '3 min'
          },
          {
            title: 'Create Your Account',
            description: 'Sign up and start your fractional real estate journey.',
            path: '/signup?plan=investor',
            icon: CheckCircle,
            completed: false,
            duration: '2 min'
          }
        ];
    }
  };

  const steps = getStepsForRole(userRole);
  const totalDuration = steps.reduce((sum, step) => {
    const minutes = parseInt(step.duration.split(' ')[0]);
    return sum + minutes;
  }, 0);

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {userRole === 'new' ? 'Welcome to FractionaX!' : 
             userRole === 'investor' ? 'Complete Your Setup' : 
             'Admin Quick Start'}
          </h2>
          <p className="text-blue-100">
            {userRole === 'new' ? 'Let us guide you through getting started with fractional real estate investing' :
             userRole === 'investor' ? 'Finish setting up your investor account to start trading' :
             'Get familiar with the admin tools and platform management'}
          </p>
          <div className="mt-4 text-sm text-blue-100">
            Estimated time: ~{totalDuration} minutes
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Steps Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Steps</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300'
                    }`}>
                      {step.completed ? (
                        <CheckCircle size={16} />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        index === currentStep ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <currentStepData.icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentStepData.title}</h3>
                  <p className="text-gray-600">Step {currentStep + 1} of {steps.length}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {currentStepData.description}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>

                {/* Action Button */}
                <Link
                  to={currentStepData.path}
                  onClick={onClose}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <span>Start This Step</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              <div className="text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </div>

              <button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === steps.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;
