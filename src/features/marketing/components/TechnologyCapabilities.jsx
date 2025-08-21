import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Database, 
  Shield, 
  MessageCircle, 
  Zap, 
  Globe, 
  Layers, 
  TrendingUp,
  Lock,
  Cpu,
  BarChart3,
  Smartphone,
  Cloud,
  CheckCircle,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

export default function TechnologyCapabilities() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const technologyCategories = [
    {
      id: 'ai-intelligence',
      name: 'AI Intelligence',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      capabilities: [
        {
          title: "Advanced Machine Learning",
          description: "Sophisticated algorithms analyze 50+ data points per property including market trends, neighborhood analytics, and investment potential.",
          icon: <Brain className="w-8 h-8 text-purple-600" />,
          stats: { accuracy: "94%", dataPoints: "50+", properties: "2.4M" }
        },
        {
          title: "Natural Language Processing",
          description: "Describe your ideal investment in plain English and our AI understands context, preferences, and constraints to find perfect matches.",
          icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
          stats: { languages: "12", queries: "450K", success: "96%" }
        },
        {
          title: "Predictive Analytics",
          description: "Forecast property appreciation, rental yields, and market trends using advanced predictive models and real-time data.",
          icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
          stats: { forecast: "5-year", models: "15", accuracy: "87%" }
        }
      ]
    },
    {
      id: 'data-infrastructure',
      name: 'Data Infrastructure',
      icon: <Database className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
      capabilities: [
        {
          title: "Real-Time Data Integration",
          description: "Pull live data from MLS systems, public records, school ratings, crime statistics, and demographic information for complete market intelligence.",
          icon: <Database className="w-8 h-8 text-blue-600" />,
          stats: { sources: "50+", updates: "Real-time", coverage: "95%" }
        },
        {
          title: "Comprehensive Analytics",
          description: "Access property valuations, comparable sales, rental histories, tax records, and neighborhood insights in one unified platform.",
          icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
          stats: { metrics: "100+", history: "20-year", accuracy: "98%" }
        },
        {
          title: "API-First Architecture",
          description: "Built on scalable cloud infrastructure with enterprise-grade APIs that integrate seamlessly with external platforms and tools.",
          icon: <Cloud className="w-8 h-8 text-blue-600" />,
          stats: { uptime: "99.9%", apis: "25+", requests: "10M+" }
        }
      ]
    },
    {
      id: 'security-banking',
      name: 'Security & Banking',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-600 to-emerald-600',
      capabilities: [
        {
          title: "Enterprise Security",
          description: "Bank-grade encryption, multi-factor authentication, and regulatory compliance ensure your investments and data are protected.",
          icon: <Shield className="w-8 h-8 text-green-600" />,
          stats: { encryption: "AES-256", compliance: "SOC 2", audits: "Quarterly" }
        },
        {
          title: "Integrated Banking",
          description: "Seamless financial infrastructure handles payments, transfers, and settlements with traditional banking and crypto rails.",
          icon: <Lock className="w-8 h-8 text-green-600" />,
          stats: { banks: "50+", currencies: "15", settlements: "T+1" }
        },
        {
          title: "Regulatory Compliance",
          description: "Full KYC/AML compliance, audit trails, and regulatory reporting ensure institutional-grade investment protection.",
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          stats: { jurisdictions: "23", compliance: "100%", audits: "Clean" }
        }
      ]
    },
    {
      id: 'platform-experience',
      name: 'Platform Experience',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600',
      capabilities: [
        {
          title: "Professional Communication",
          description: "Built-in messaging, video calls, document sharing, and project management keep all stakeholders connected and informed.",
          icon: <MessageCircle className="w-8 h-8 text-orange-600" />,
          stats: { response: "<2hr", satisfaction: "98%", channels: "5+" }
        },
        {
          title: "Cross-Platform Access",
          description: "Native mobile apps, responsive web interface, and API access ensure you can manage investments from anywhere, anytime.",
          icon: <Smartphone className="w-8 h-8 text-orange-600" />,
          stats: { platforms: "5", users: "24.8K", rating: "4.8★" }
        },
        {
          title: "Global Infrastructure",
          description: "Worldwide content delivery, multi-region data centers, and localized experiences deliver fast, reliable service globally.",
          icon: <Globe className="w-8 h-8 text-orange-600" />,
          stats: { regions: "14", latency: "<100ms", availability: "99.99%" }
        }
      ]
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % technologyCategories.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, technologyCategories.length]);

  // Intersection Observer for visibility
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

  const currentCategory = technologyCategories[activeCategory];

  return (
    <section ref={sectionRef} className="bg-white py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Enterprise-Grade Technology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge technology to deliver comprehensive 
              real estate insights and seamless investment experiences you can trust.
            </p>
          </motion.div>
        </div>

        {/* Technology Category Tabs */}
        <div className="flex justify-center mb-10 flex-wrap gap-2">
          {technologyCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(index);
                setIsAutoPlaying(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-sm font-medium transition-all duration-300 mb-2
                ${
                  activeCategory === index
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }
              `}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
          
          {/* Auto-play control */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 px-4 py-3 rounded-full border bg-gray-800 text-white hover:bg-gray-700 transition-all text-sm font-medium mb-2"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoPlaying ? 'Pause' : 'Auto'}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Header */}
          <div className="lg:col-span-3 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`bg-gradient-to-r ${currentCategory.color} p-8 rounded-2xl text-white text-center`}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    {currentCategory.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{currentCategory.name}</h3>
                </div>
                
                {/* Progress indicators */}
                <div className="flex justify-center gap-2">
                  {technologyCategories.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 w-12 rounded-full transition-all duration-300 ${
                        index === activeCategory ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Capabilities Grid */}
          <AnimatePresence>
            {currentCategory.capabilities.map((capability, index) => (
              <motion.div
                key={`${activeCategory}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4">
                  {capability.icon}
                </div>
                
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {capability.title}
                </h4>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {capability.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {Object.entries(capability.stats).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-2 border">
                      <div className="text-sm font-bold text-gray-900">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience Advanced Real Estate Technology?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of investors who trust our technology to find, analyze, and invest in profitable real estate opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                Try AI Search
                <ArrowRight size={20} />
              </button>
            </Link>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
