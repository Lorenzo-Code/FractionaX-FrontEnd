import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  Eye,
  Plus
} from 'lucide-react';

const CustomerInvestments = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1M');
  const [filterType, setFilterType] = useState('all');

  // Mock investment data
  const portfolioStats = {
    totalValue: 125750.50,
    totalInvested: 95000.00,
    totalReturns: 30750.50,
    returnPercentage: 32.37,
    monthlyIncome: 1247.83,
    totalProperties: 12
  };

  const activeInvestments = [
    {
      id: 1,
      propertyName: "Luxury Downtown Condo",
      location: "Austin, TX",
      investment: 15000,
      currentValue: 18500,
      returns: 3500,
      returnRate: 23.33,
      monthlyIncome: 185.50,
      status: "Active",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      propertyName: "Suburban Family Home",
      location: "Dallas, TX",
      investment: 25000,
      currentValue: 28200,
      returns: 3200,
      returnRate: 12.80,
      monthlyIncome: 295.00,
      status: "Active",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      propertyName: "Modern Office Complex",
      location: "Houston, TX",
      investment: 35000,
      currentValue: 42500,
      returns: 7500,
      returnRate: 21.43,
      monthlyIncome: 445.75,
      status: "Active",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop"
    }
  ];

  const investmentHistory = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Investment",
      property: "Luxury Downtown Condo",
      amount: 15000,
      status: "Completed",
      transactionId: "INV-2024-001"
    },
    {
      id: 2,
      date: "2024-01-20",
      type: "Returns",
      property: "Suburban Family Home", 
      amount: 295.00,
      status: "Received",
      transactionId: "RET-2024-045"
    },
    {
      id: 3,
      date: "2024-02-01",
      type: "Investment",
      property: "Modern Office Complex",
      amount: 35000,
      status: "Completed",
      transactionId: "INV-2024-007"
    }
  ];

  const performanceData = [
    { month: 'Jan', value: 95000 },
    { month: 'Feb', value: 102500 },
    { month: 'Mar', value: 108750 },
    { month: 'Apr', value: 115200 },
    { month: 'May', value: 121400 },
    { month: 'Jun', value: 125750 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Investments</h1>
          <p className="text-gray-600">Track your real estate investment portfolio</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus size={20} />
          <span>New Investment</span>
        </button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${portfolioStats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{portfolioStats.returnPercentage}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs invested</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-green-600">
                +${portfolioStats.totalReturns.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm text-gray-600">
              Total Invested: ${portfolioStats.totalInvested.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-purple-600">
                ${portfolioStats.monthlyIncome.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+8.5%</span>
            <span className="text-sm text-gray-500 ml-2">this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Properties</p>
              <p className="text-2xl font-bold text-orange-600">
                {portfolioStats.totalProperties}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm text-gray-600">Active investments</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 rounded-t-xl">
        <nav className="flex space-x-8 px-6">
          {['overview', 'active', 'history', 'performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart Placeholder */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance chart visualization</p>
                    <p className="text-sm text-gray-400">Last 6 months growth</p>
                  </div>
                </div>
              </div>

              {/* Asset Allocation */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Portfolio distribution</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Residential: 45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commercial: 35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mixed Use: 20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Investments Tab */}
        {activeTab === 'active' && (
          <div className="p-6">
            <div className="space-y-4">
              {activeInvestments.map((investment) => (
                <div key={investment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-6">
                    <img 
                      src={investment.image} 
                      alt={investment.propertyName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{investment.propertyName}</h3>
                          <p className="text-gray-600">{investment.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {investment.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Invested</p>
                          <p className="font-semibold">${investment.investment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Value</p>
                          <p className="font-semibold text-green-600">${investment.currentValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Returns</p>
                          <p className="font-semibold text-green-600">+${investment.returns.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Monthly Income</p>
                          <p className="font-semibold text-purple-600">${investment.monthlyIncome}</p>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option value="all">All Types</option>
                  <option value="investment">Investments</option>
                  <option value="returns">Returns</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investmentHistory.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Investment' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.property}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'Completed' || transaction.status === 'Received'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.transactionId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['1W', '1M', '3M', '6M', '1Y'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timeRange === range
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Value Over Time</h3>
                  <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Performance chart</p>
                      <p className="text-sm text-gray-400">Portfolio growth visualization</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Return</span>
                      <span className="text-sm font-medium text-green-600">+32.37%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Annualized Return</span>
                      <span className="text-sm font-medium text-green-600">+18.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best Month</span>
                      <span className="text-sm font-medium text-green-600">+8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst Month</span>
                      <span className="text-sm font-medium text-red-600">-2.1%</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Top Performers</h4>
                  <div className="space-y-3">
                    {activeInvestments.slice(0, 3).map((investment) => (
                      <div key={investment.id} className="flex items-center space-x-3">
                        <img 
                          src={investment.image} 
                          alt={investment.propertyName}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {investment.propertyName}
                          </p>
                          <p className="text-xs text-gray-500">{investment.location}</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          +{investment.returnRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInvestments;
