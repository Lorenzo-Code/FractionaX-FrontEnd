import { useState, useEffect, useRef } from "react";
import { Bot, Search, BarChart3, Play, Pause, ArrowRight, Zap, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import StepOneTypingExperience from "./StepOneTypingExperience";
import StepTwoMapPreview from "./StepTwoMapPreview";
import StepThreeAiAnalysis from "./StepThreeAiAnalysis"

const steps = [
  {
    id: 1,
    title: "Tell Us What You Want",
    shortTitle: "Describe",
    description: "Use natural language to describe your ideal real estate investment. Just say it like you mean it — our AI understands context.",
    detailedDescription: "Simply type what you're looking for in plain English: 'Miami condos under $400K', 'Houston rental properties', or 'commercial buildings with 10%+ ROI'. Multi-asset categories launching soon!",
    icon: <Bot className="w-6 h-6" />,
    component: <StepOneTypingExperience />,
    time: "30 seconds",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    id: 2,
    title: "AI Finds Real Estate Deals",
    shortTitle: "Discover", 
    description: "Our FXCT-powered AI scans real estate marketplaces and data sources to find the best investment opportunities.",
    detailedDescription: "Advanced algorithms analyze market data from Zillow, LoopNet, MLS, and other real estate sources to find properties that match your investment criteria and risk profile. Multi-asset scanning coming in Phase 2!",
    icon: <Search className="w-6 h-6" />,
    component: <StepTwoMapPreview />,
    time: "Instant",
    color: "bg-blue-600",
    lightColor: "bg-blue-50", 
    textColor: "text-blue-600"
  },
  {
    id: 3,
    title: "Invest & Earn Yield",
    shortTitle: "Invest",
    description: "Get comprehensive analysis, invest fractionally, and earn ongoing yields through rental income and property appreciation.",
    detailedDescription: "Complete ROI projections, market insights, and risk assessments for real estate investments. Earn yields through rental income and property appreciation with full transparency.",
    icon: <BarChart3 className="w-6 h-6" />,
    component: <StepThreeAiAnalysis />,
    time: "5 minutes", 
    color: "bg-green-600",
    lightColor: "bg-green-50",
    textColor: "text-green-600"
  },
];

export default function InteractiveHowItWorks() {
  const [active, setActive] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  
  const step = steps.find((s) => s.id === active);
  const currentIndex = steps.findIndex((s) => s.id === active);
  
  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) {
      clearInterval(intervalRef.current);
      setProgress(0);
      return;
    }
    
    const duration = 5000; // 5 seconds per step
    const increment = 100 / (duration / 50); // Update every 50ms
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next step
          setActive((current) => {
            const currentIdx = steps.findIndex(s => s.id === current);
            const nextIdx = (currentIdx + 1) % steps.length;
            return steps[nextIdx].id;
          });
          return 0;
        }
        return prev + increment;
      });
    }, 50);
    
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, active]);
  
  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
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
  
  const handleStepClick = (stepId) => {
    setActive(stepId);
    setProgress(0);
    setIsAutoPlay(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-gray-200 py-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced messaging */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Simple 3-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              From idea to investment in under 6 minutes. Our AI-powered platform makes real estate investing as easy as online shopping. <span className="text-blue-600 font-semibold">Multi-asset categories launching in 2026!</span>
            </p>
            
            {/* Launch focus messaging */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold border-2 border-blue-200">🏠 Real Estate - Live Now!</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium opacity-60">🚗 Luxury Cars - Phase 2</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium opacity-60">🎨 Art & NFTs - Phase 2</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium opacity-60">🃏 Collectibles - Phase 2</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium opacity-60">💎 DeFi Yields - Phase 2</span>
            </div>
            
            {/* Total time and auto-play control */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Total time: ~6 minutes</span>
              </div>
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAutoPlay ? 'Pause Demo' : 'Auto Demo'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-center items-center space-x-4 sm:space-x-8 mb-8 sm:mb-10">
            {steps.map((s, index) => {
              const isActive = active === s.id;
              const isCompleted = currentIndex > index;
              
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handleStepClick(s.id)}
                >
                  {/* Step Circle */}
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    isActive 
                      ? `${step.color} text-white shadow-lg scale-110` 
                      : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 border-2 border-gray-300 group-hover:border-blue-400"
                  }`}>
                    {isCompleted && !isActive ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      <div className={isActive ? "text-white" : step.textColor}>
                        {s.icon}
                      </div>
                    )}
                    
                    {/* Progress ring for active step */}
                    {isActive && isAutoPlay && (
                      <div className="absolute inset-0 rounded-full">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="white"
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 46}`}
                            strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                            className="transition-all duration-75 ease-linear"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Step Info */}
                  <div className="text-center">
                    <div className={`font-semibold text-sm mb-1 transition-colors ${
                      isActive ? step.textColor : "text-gray-900"
                    }`}>
                      {s.shortTitle}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isActive ? step.lightColor : "bg-gray-100"
                    } ${isActive ? step.textColor : "text-gray-600"}`}>
                      {s.time}
                    </div>
                  </div>
                  
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-8 left-full w-8 h-0.5 ${
                      currentIndex > index ? "bg-green-600" : "bg-gray-300"
                    } transition-colors duration-300`} style={{marginLeft: '2rem'}} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Content Area - Fixed Height to Prevent Jumping */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Fixed Height Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="relative"
            style={{ minHeight: '500px' }} // Fixed minimum height
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  step.lightColor
                } ${step.textColor} w-fit`}>
                  Step {step.id} of {steps.length}
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {step.description}
                </p>
                
                <p className="text-gray-500 text-base leading-relaxed mb-6">
                  {step.detailedDescription}
                </p>
                
                {/* Action buttons */}
                <div className="flex gap-4 mt-auto">
                  <button className={`${step.color} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2`}>
                    Try This Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  {currentIndex < steps.length - 1 && (
                    <button 
                      onClick={() => handleStepClick(steps[currentIndex + 1].id)}
                      className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Next Step
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Side - Fixed Height Component Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white" style={{ height: '500px' }}>
              {/* Component header */}
              <div className={`${step.lightColor} ${step.textColor} p-4 border-b border-gray-200`}>
                <div className="flex items-center gap-3">
                  <div className={`${step.color} text-white p-2 rounded-lg`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{step.shortTitle} Phase</div>
                    <div className="text-sm opacity-70">Interactive Demo</div>
                  </div>
                </div>
              </div>
              
              {/* Component content - Fixed Height Container */}
              <div className="relative" style={{ height: '430px' }}>
                <AnimatePresence mode="wait">
                  {step.component ? (
                    <motion.div
                      key={step.id + "-component"}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-2 sm:p-4 lg:p-6 flex items-center justify-center"
                    >
                      {step.component}
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center p-8">
                      <div>
                        <div className="text-4xl mb-4">{step.icon}</div>
                        <div>Interactive demo loading...</div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Floating time indicator */}
            <div className={`absolute -top-3 -right-3 ${step.color} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1`}>
              <Clock className="w-3 h-3" />
              {step.time}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Investing?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of investors who've discovered fractional real estate investing with AI-powered insights. <strong>Multi-asset categories launching in 2026!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Start Your First Search
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
              >
                Watch Full Demo
              </motion.button>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              ✨ No credit card required. Try it free.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
