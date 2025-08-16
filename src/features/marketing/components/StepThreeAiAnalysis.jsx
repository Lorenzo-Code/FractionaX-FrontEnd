import {
  ShieldCheck,
  AlertTriangle,
  TrafficCone,
  Building2,
  School,
  TrendingUp,
  FileText,
  ShoppingCart,
  PieChart,
  BarChart3,
  DollarSign,
  Calendar,
  Users,
  Award,
  Zap,
  Target,
  Activity,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function StepThreeAiAnalysis() {
  const [currentView, setCurrentView] = useState(0);
  
  const investmentViews = [
    {
      id: 0,
      type: "Real Estate",
      title: "AI Property Analysis",
      icon: "🏠",
      color: "blue",
      data: {
        asset: "Miami Luxury Condo",
        location: "Brickell, Miami, FL",
        price: "$850,000",
        image: "/assets/properties/miami-condo.jpg",
        roi: "7.2%",
        monthlyIncome: "$4,250",
        appreciation: "+15.8%",
        riskLevel: "Medium",
        fractionalPrice: "$1,250",
        details: {
          occupancy: "96%",
          yearBuilt: "2018",
          sqft: "1,850",
          condition: "Excellent"
        }
      }
    },
    {
      id: 1,
      type: "Luxury Car",
      title: "Classic Car Investment", 
      icon: "🏎️",
      color: "purple",
      data: {
        asset: "1967 Porsche 911S",
        location: "Barrett-Jackson Vault",
        price: "$275,000",
        image: "/assets/cars/porsche-911.jpg",
        roi: "12.5%",
        monthlyIncome: "$2,850",
        appreciation: "+22.3%",
        riskLevel: "High",
        fractionalPrice: "$550",
        details: {
          mileage: "89,500",
          condition: "Restored",
          rarity: "Limited",
          insurance: "Comprehensive"
        }
      }
    },
    {
      id: 2,
      type: "Art Portfolio",
      title: "Digital Art Collection",
      icon: "🎨",
      color: "pink", 
      data: {
        asset: "NFT Blue Chip Bundle",
        location: "Ethereum Blockchain",
        price: "$125,000",
        image: "/assets/art/digital-collection.jpg",
        roi: "15.8%",
        monthlyIncome: "$1,640",
        appreciation: "+31.2%",
        riskLevel: "High",
        fractionalPrice: "$95",
        details: {
          pieces: "12 NFTs",
          creators: "Verified",
          rarity: "Floor 2.5x",
          liquidity: "High"
        }
      }
    },
    {
      id: 3,
      type: "DeFi Yield",
      title: "Yield Farming Strategy",
      icon: "💎",
      color: "green",
      data: {
        asset: "Multi-Protocol Pool",
        location: "Ethereum + Base",
        price: "$50,000",
        image: "/assets/defi/yield-farming.jpg",
        roi: "18.7%",
        monthlyIncome: "$778",
        appreciation: "+8.4%",
        riskLevel: "Medium",
        fractionalPrice: "$100",
        details: {
          protocols: "Aave, Comp",
          apr: "18.7%",
          impLoss: "<2%",
          autoComp: "Daily"
        }
      }
    }
  ];

  const [isAutoPlay, setIsAutoPlay] = useState(true);
  
  // Switch between investment views every 5 seconds (only when auto-playing)
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const viewInterval = setInterval(() => {
      setCurrentView((prev) => (prev + 1) % investmentViews.length);
    }, 5000);
    return () => clearInterval(viewInterval);
  }, [investmentViews.length, isAutoPlay]);
  
  // Handle manual card switching
  const handleCardClick = (index) => {
    setCurrentView(index);
    setIsAutoPlay(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };

  const currentInvestment = investmentViews[currentView];
  
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return {
        header: 'text-blue-800',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'text-blue-600',
        button: 'bg-blue-700 hover:bg-blue-800'
      };
      case 'purple': return {
        header: 'text-purple-800', 
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        accent: 'text-purple-600',
        button: 'bg-purple-700 hover:bg-purple-800'
      };
      case 'pink': return {
        header: 'text-pink-800',
        bg: 'bg-pink-50', 
        text: 'text-pink-900',
        accent: 'text-pink-600',
        button: 'bg-pink-700 hover:bg-pink-800'
      };
      case 'green': return {
        header: 'text-green-800',
        bg: 'bg-green-50',
        text: 'text-green-900', 
        accent: 'text-green-600',
        button: 'bg-green-700 hover:bg-green-800'
      };
      default: return {
        header: 'text-gray-800',
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        accent: 'text-gray-600', 
        button: 'bg-gray-700 hover:bg-gray-800'
      };
    }
  };

  const colors = getColorClasses(currentInvestment.color);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-2 px-1 sm:px-2 lg:px-4 text-gray-800">
      <div className="relative">
        {/* Investment type indicator */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div 
            className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow border cursor-pointer group hover:shadow-lg transition-all duration-200"
            onClick={() => handleCardClick((currentView + 1) % investmentViews.length)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="text-sm"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              {currentInvestment.icon}
            </motion.span>
            <span className="text-xs text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
              {currentInvestment.type}
            </span>
            <div className="flex gap-1">
              {investmentViews.map((view, idx) => (
                <motion.div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    currentView === idx ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(idx);
                  }}
                  whileHover={{ scale: currentView === idx ? 1.25 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={view.type}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="max-w-sm mx-auto border border-gray-300 rounded-[20px] overflow-hidden shadow-xl p-2 bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">{currentInvestment.icon}</span>
              <h2 className={`text-base font-bold text-center ${colors.header}`}>
                {currentInvestment.title}
              </h2>
            </div>

            {/* Image and Basic Info */}
            <div className="flex flex-col items-center mb-2">
              <motion.img 
                src={currentInvestment.data.image} 
                alt={currentInvestment.data.asset} 
                className="w-full h-28 object-cover rounded-lg mb-1"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <p className="font-semibold text-xs">{currentInvestment.data.asset}</p>
              <p className="text-[9px] text-gray-500 mb-1">{currentInvestment.data.location}</p>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-green-600">{currentInvestment.data.price}</p>
                <span className={`px-2 py-1 rounded-full text-[8px] font-medium ${getRiskColor(currentInvestment.data.riskLevel)}`}>
                  {currentInvestment.data.riskLevel}
                </span>
              </div>
              <p className="text-[9px] text-gray-400">Fractional from {currentInvestment.data.fractionalPrice}</p>
            </div>

            {/* Investment Metrics */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className={`${colors.bg} rounded-md p-2`}>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <h4 className={`text-[9px] font-semibold ${colors.text}`}>Returns</h4>
                </div>
                <p className="text-[9px]">ROI: <span className="font-bold text-green-700">{currentInvestment.data.roi}</span></p>
                <p className="text-[9px]">Monthly: <span className="font-bold">{currentInvestment.data.monthlyIncome}</span></p>
                <p className="text-[9px]">Growth: <span className="font-bold text-blue-600">{currentInvestment.data.appreciation}</span></p>
              </div>

              <div className={`${colors.bg} rounded-md p-2`}>
                <div className="flex items-center gap-1 mb-1">
                  <Award className="w-3 h-3 text-orange-500" />
                  <h4 className={`text-[9px] font-semibold ${colors.text}`}>Details</h4>
                </div>
                {Object.entries(currentInvestment.data.details).map(([key, value]) => (
                  <p key={key} className="text-[9px] capitalize">
                    {key}: <span className="font-bold">{value}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-indigo-50 rounded-md p-2 mb-2">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-indigo-600" />
                <h4 className="text-[9px] font-semibold text-indigo-800">AI Insights</h4>
              </div>
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentInvestment.type === 'Real Estate' && (
                  <>
                    <p className="text-[9px] flex items-center gap-1">
                      <Target className="w-2 h-2 text-green-600" />
                      High rental demand in area
                    </p>
                    <p className="text-[9px] flex items-center gap-1">
                      <Activity className="w-2 h-2 text-blue-600" />
                      Property value trending upward
                    </p>
                  </>
                )}
                {currentInvestment.type === 'Luxury Car' && (
                  <>
                    <p className="text-[9px] flex items-center gap-1">
                      <Target className="w-2 h-2 text-purple-600" />
                      Classic model with strong auction history
                    </p>
                    <p className="text-[9px] flex items-center gap-1">
                      <Activity className="w-2 h-2 text-orange-600" />
                      Collector interest increasing 18% YoY
                    </p>
                  </>
                )}
                {currentInvestment.type === 'Art Portfolio' && (
                  <>
                    <p className="text-[9px] flex items-center gap-1">
                      <Target className="w-2 h-2 text-pink-600" />
                      Floor price 2.5x above mint
                    </p>
                    <p className="text-[9px] flex items-center gap-1">
                      <Activity className="w-2 h-2 text-cyan-600" />
                      Verified creators with strong royalties
                    </p>
                  </>
                )}
                {currentInvestment.type === 'DeFi Yield' && (
                  <>
                    <p className="text-[9px] flex items-center gap-1">
                      <Target className="w-2 h-2 text-green-600" />
                      Auto-compounding maximizes returns
                    </p>
                    <p className="text-[9px] flex items-center gap-1">
                      <Activity className="w-2 h-2 text-blue-600" />
                      Low impermanent loss risk detected
                    </p>
                  </>
                )}
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] text-gray-500">Funding Progress</span>
                <span className="text-[8px] text-gray-700 font-semibold">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${colors.button}`}
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-1">
              <motion.button 
                className={`flex items-center justify-center gap-1 w-full sm:w-1/2 ${colors.button} text-white text-[9px] py-1 px-2 rounded-md transition`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-3 h-3" /> Full Report
              </motion.button>
              <motion.button 
                className={`flex items-center justify-center gap-1 w-full sm:w-1/2 ${colors.button} text-white text-[9px] py-1 px-2 rounded-md transition`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <DollarSign className="w-3 h-3" /> Invest Now
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
