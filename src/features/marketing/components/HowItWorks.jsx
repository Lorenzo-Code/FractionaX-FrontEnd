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
    description: "Use natural language to describe your ideal investment. Real estate, luxury cars, NFTs, collectibles, art — just say it like you mean it.",
    detailedDescription: "Simply type what you're looking for in plain English: 'Miami condos under $100K', 'vintage Porsche 911s', 'rare Pokemon cards', or 'blue-chip art pieces'. Our AI understands context across all asset classes.",
    icon: <Bot className="w-6 h-6" />,
    component: <StepOneTypingExperience />,
    time: "30 seconds",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    id: 2,
    title: "AI Finds Multi-Asset Deals",
    shortTitle: "Discover", 
    description: "Our FXCT-powered AI scans global marketplaces and data sources across real estate, collectibles, art, cars, and digital assets.",
    detailedDescription: "Advanced algorithms analyze market data from Zillow, Barrett-Jackson, Christie's, OpenSea, eBay, and 100+ other sources to find deals that match your criteria and risk profile.",
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
    description: "Get comprehensive analysis, invest fractionally, and earn ongoing yields through rentals, appreciation, and DeFi staking.",
    detailedDescription: "Complete ROI projections, market insights, and risk assessments. Then earn yields through property rentals, car leasing, art exhibitions, and DeFi protocol staking.",
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
              From idea to investment in under 6 minutes. Our AI-powered platform makes investing in real estate, luxury cars, art, collectibles, and digital assets as easy as online shopping.
            </p>
            
            {/* Asset class badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">🏠 Real Estate</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">🚗 Luxury Cars</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">🎨 Art & NFTs</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">🃏 Collectibles</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">💎 DeFi Yields</span>
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
        <div className="mb-12">
          <div className="flex justify-center items-center space-x-8 mb-10">
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

        {/* Enhanced Content Area */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Enhanced Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  step.lightColor
                } ${step.textColor}`}>
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
                <div className="flex gap-4">
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

          {/* Right Side - Enhanced Component Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white">
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
              
              {/* Component content */}
              <div className="min-h-[350px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {step.component ? (
                    <motion.div
                      key={step.id + "-component"}
                      initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full p-6"
                    >
                      {step.component}
                    </motion.div>
                  ) : (
                    <div className="text-gray-400 text-center p-8">
                      <div className="text-4xl mb-4">{step.icon}</div>
                      <div>Interactive demo loading...</div>
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
              Join thousands of investors who've discovered fractional investing across real estate, luxury assets, collectibles, and digital assets with AI-powered insights.
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
