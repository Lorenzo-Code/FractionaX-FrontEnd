import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Rocket, 
  Brain, 
  DollarSign,
  Users,
  Globe,
  Star,
  ArrowRight,
  Play,
  Clock,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';

export default function WhyFractionaX() {
  const [currentStory, setCurrentStory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const storySteps = [
    {
      step: "01",
      title: "The Problem We're Solving",
      subtitle: "Real estate investing is broken for regular people",
      problem: "High minimums ($50K+), complex research, endless paperwork, and zero transparency make real estate investing inaccessible.",
      solution: "We're building fractional ownership with $25 minimums, AI-powered research, and complete blockchain transparency.",
      icon: <Target className="w-16 h-16" />,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      step: "02", 
      title: "The Technology We're Building",
      subtitle: "Advanced AI meets secure blockchain",
      problem: "Investors waste hours researching properties and still make poor decisions due to incomplete information.",
      solution: "Our AI analyzes multiple data sources instantly, while blockchain ensures security and transparency.",
      icon: <Lightbulb className="w-16 h-16" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      step: "03",
      title: "The Future We're Creating", 
      subtitle: "Beta launching November 2024",
      problem: "Current platforms are complex, expensive, and don't put investors first.",
      solution: "We're launching a beta that combines industry-leading security, advanced AI, and investor-first design.",
      icon: <Award className="w-16 h-16" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const coreReasons = [
    {
      title: "🔒 Security First Architecture",
      description: "Built with industry-leading security practices and blockchain technology to protect your investments.",
      stat: "Bank-Level",
      detail: "Security Standards"
    },
    {
      title: "🤖 Advanced AI Technology", 
      description: "Cutting-edge artificial intelligence analyzes market data and property metrics faster than any human could.",
      stat: "Multi-Source",
      detail: "Data Analysis"
    },
    {
      title: "⛓️ Blockchain Transparency",
      description: "Every transaction is recorded on the blockchain, giving you complete transparency and ownership proof.",
      stat: "100%",
      detail: "Transparent Ownership"
    },
    {
      title: "👥 Built By Investors",
      description: "Our team understands real estate investing because we are investors ourselves. No corporate fluff.",
      stat: "Investor-Led",
      detail: "Team & Vision"
    }
  ];

  // Auto-cycle through story steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % storySteps.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [storySteps.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-100 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Header - Mobile Optimized */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2"
          >
            Why FractionaX?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-2 leading-relaxed"
          >
We're not just building another platform — we're solving the real problems that keep everyday investors out of real estate.
          </motion.p>
        </div>

        {/* Our Story - Mobile Optimized Timeline */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h3>
            <p className="text-sm sm:text-base text-gray-600">From problem to solution to beta launch</p>
          </div>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Timeline Section - Takes 8 columns on desktop */}
            <div className="lg:col-span-8">
              {/* Mobile: Simple vertical stack, Desktop: Complex timeline */}
              <div className="relative">
            {/* Desktop timeline line - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-red-300 via-blue-300 to-green-300" />
            
            {/* Mobile timeline line - left aligned */}
            <div className="lg:hidden absolute left-6 sm:left-8 top-0 h-full w-0.5 bg-gradient-to-b from-red-300 via-blue-300 to-green-300" />
            
            {storySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.3 }}
                className="relative flex items-center mb-10 sm:mb-12 lg:mb-16"
              >
                {/* Mobile Layout */}
                <div className="lg:hidden w-full pl-12 sm:pl-16">
                  <div className={`${step.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-white`}>
                    <div className={`text-xs sm:text-sm font-bold ${step.color} mb-2`}>STEP {step.step}</div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                    <h5 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">{step.subtitle}</h5>
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                      <strong>Problem:</strong> {step.problem}
                    </p>
                    <p className={`text-sm font-medium ${step.color} leading-relaxed`}>
                      <strong>Our Solution:</strong> {step.solution}
                    </p>
                  </div>
                </div>
                
                {/* Mobile icon - left positioned */}
                <div className={`lg:hidden absolute left-4 sm:left-6 top-4 ${step.bgColor} p-2 sm:p-3 rounded-full border-4 border-white shadow-lg`}>
                  <div className={step.color}>
                    {index === 0 && <Target className="w-6 h-6 sm:w-8 sm:h-8" />}
                    {index === 1 && <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8" />}
                    {index === 2 && <Award className="w-6 h-6 sm:w-8 sm:h-8" />}
                  </div>
                </div>

                {/* Desktop Layout - Content - Simplified for single column */}
                <div className="hidden lg:block w-full">
                  <div className="flex items-center">
                    <div className={`${step.bgColor} p-3 rounded-full border-4 border-white shadow-lg mr-6`}>
                      <div className={step.color}>
                        {index === 0 && <Target className="w-8 h-8" />}
                        {index === 1 && <Lightbulb className="w-8 h-8" />}
                        {index === 2 && <Award className="w-8 h-8" />}
                      </div>
                    </div>
                    <div className={`${step.bgColor} p-6 rounded-2xl shadow-lg border-2 border-white flex-1`}>
                      <div className={`text-sm font-bold ${step.color} mb-2`}>STEP {step.step}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                      <h5 className="text-lg font-semibold text-gray-700 mb-3">{step.subtitle}</h5>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        <strong>Problem:</strong> {step.problem}
                      </p>
                      <p className={`text-sm font-medium ${step.color} leading-relaxed`}>
                        <strong>Our Solution:</strong> {step.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
              </div>
            </div>
            
            {/* Desktop-only Sidebar - Takes 4 columns */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                {/* Marketplace Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 p-2 rounded-lg mr-3">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Marketplace</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Browse and invest in tokenized real estate properties with as little as $25. Each property is thoroughly vetted by our AI and backed by blockchain transparency.
                  </p>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>Fractional ownership from $25</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>AI-verified investment opportunities</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>Instant liquidity through tokenization</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Yield Staking Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 p-2 rounded-lg mr-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Yield Opportunities</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Don't let unused FXCT tokens sit idle. Choose from multiple staking pools to earn passive income while supporting the ecosystem.
                  </p>
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Liquidity Pool Staking
                      </span>
                      <span className="text-green-600 font-semibold">5-12% APY</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Governance Staking
                      </span>
                      <span className="text-green-600 font-semibold">3-8% APY</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Property Yield Pools
                      </span>
                      <span className="text-green-600 font-semibold">8-15% APY</span>
                    </div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600">
                    <strong>Coming in Beta:</strong> Choose your staking strategy based on risk tolerance and yield preferences.
                  </div>
                </motion.div>
                
                {/* Token Utility Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-purple-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600 p-2 rounded-lg mr-3">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">FXCT Utility</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    FXCT tokens power the entire FractionaX ecosystem, from property purchases to governance voting.
                  </p>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>Property investment transactions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>Governance and voting rights</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>Premium AI analysis features</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>Staking rewards and yield farming</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Reasons - Mobile Optimized Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Why We're Different</h3>
            <p className="text-sm sm:text-base text-gray-600">Four core principles that guide everything we build</p>
          </div>
          
          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2">
            {coreReasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">
                    {reason.title.split(' ')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {reason.title.substring(2)}
                    </h4>
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                      {reason.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">{reason.stat}</span>
                      <span className="text-xs sm:text-sm text-gray-500">{reason.detail}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 mx-2 sm:mx-0"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to Be an Early Adopter?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Join our beta testing program launching November 2024 and help shape the future of real estate investing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                Join Beta Program
              </motion.button>
            </Link>
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                View Pricing
              </motion.button>
            </Link>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
            ✨ Beta access includes early adopter benefits and special pricing.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
