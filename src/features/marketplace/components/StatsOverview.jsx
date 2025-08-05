import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiDollarSign, FiHome, FiUsers } from "react-icons/fi";
import { BsCoin } from "react-icons/bs";

const StatsOverview = ({ properties }) => {
  // Calculate stats from properties
  const totalProperties = properties.length;
  const tokenizedProperties = properties.filter(p => p.tokenized).length;
  const averagePrice = properties.length > 0 ? 
    properties.reduce((sum, p) => sum + p.price, 0) / properties.length : 0;
  const averageROI = properties.length > 0 ?
    properties.reduce((sum, p) => sum + (p.expectedROI || 0), 0) / properties.length : 0;

  const totalTokenValue = properties
    .filter(p => p.tokenized)
    .reduce((sum, p) => sum + (p.totalTokens * p.tokenPrice), 0);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price?.toLocaleString()}`;
  };

  const stats = [
    {
      title: "Total Properties",
      value: totalProperties.toLocaleString(),
      subtitle: "Available listings",
      icon: FiHome,
      color: "blue",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Tokenized Assets",
      value: tokenizedProperties.toLocaleString(),
      subtitle: "Fractional ownership",
      icon: BsCoin,
      color: "purple",
      trend: "+24%",
      trendUp: true
    },
    {
      title: "Average Price",
      value: formatPrice(averagePrice),
      subtitle: "Median property value",
      icon: FiDollarSign,
      color: "green",
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Average ROI",
      value: `${averageROI.toFixed(1)}%`,
      subtitle: "Expected annual return",
      icon: FiTrendingUp,
      color: "orange",
      trend: "+1.2%",
      trendUp: true
    },
    {
      title: "Token Market Cap",
      value: formatPrice(totalTokenValue),
      subtitle: "Total tokenized value",
      icon: BsCoin,
      color: "indigo",
      trend: "+18%",
      trendUp: true
    },
    {
      title: "Active Investors",
      value: "2,847",
      subtitle: "FXST token holders",
      icon: FiUsers,
      color: "pink",
      trend: "+31%",
      trendUp: true
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        trend: "text-blue-600"
      },
      purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        trend: "text-purple-600"
      },
      green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        trend: "text-green-600"
      },
      orange: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        trend: "text-orange-600"
      },
      indigo: {
        bg: "bg-indigo-50",
        icon: "text-indigo-600",
        trend: "text-indigo-600"
      },
      pink: {
        bg: "bg-pink-50",
        icon: "text-pink-600",
        trend: "text-pink-600"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => {
            const colors = getColorClasses(stat.color);
            const IconComponent = stat.icon;
            
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${colors.trend}`}>
                    <FiTrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Market Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex items-center mb-2">
              <FiTrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Market Trend</h3>
            </div>
            <p className="text-sm text-gray-700">
              Property values are up 8.3% this quarter, with tokenized assets showing the strongest growth at 24%.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
          >
            <div className="flex items-center mb-2">
              <BsCoin className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">FXST Performance</h3>
            </div>
            <p className="text-sm text-gray-700">
              FXST token holders earned an average of 12.5% returns last month through property dividends.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
          >
            <div className="flex items-center mb-2">
              <FiHome className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">New Listings</h3>
            </div>
            <p className="text-sm text-gray-700">
              45 new properties added this week, including 12 high-yield rental properties available for tokenization.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
