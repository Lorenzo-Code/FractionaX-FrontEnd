import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Clock,
  Eye,
  RefreshCw,
  ArrowUpDown,
  Target,
  Wallet,
  History,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Filter
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import TradingViewWidget from '../../../shared/components/TradingViewWidget';
import { generatePageSEO } from '../../../shared/utils';

export default function CustomerTrading() {
  const seoData = generatePageSEO({
    title: 'Trading - FractionaX',
    description: 'Buy and sell FXCT and FST tokens. View real-time market data, place orders, and track your trading history.',
    url: '/dashboard/trading',
    keywords: ['trading', 'buy', 'sell', 'FXCT', 'FST', 'market', 'orders', 'cryptocurrency']
  });

  // State management
  const [activeTab, setActiveTab] = useState('spot');
  const [selectedPair, setSelectedPair] = useState('FXCT/USDT');
  const [orderType, setOrderType] = useState('market');
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock market data
  const [marketData, setMarketData] = useState({
    'FXCT/USDT': {
      price: 0.2745,
      change24h: 3.24,
      volume24h: 1250000,
      high24h: 0.2890,
      low24h: 0.2650,
      marketCap: 27450000
    },
    'FST/USDT': {
      price: 1.4520,
      change24h: -1.82,
      volume24h: 850000,
      high24h: 1.4890,
      low24h: 1.4200,
      marketCap: 14520000
    },
    'FXCT/FST': {
      price: 0.1890,
      change24h: 5.12,
      volume24h: 420000,
      high24h: 0.1950,
      low24h: 0.1820,
      marketCap: null
    }
  });

  const [walletBalances] = useState({
    FXCT: 15000,
    FST: 8500,
    USDT: 12500.75,
    BTC: 0.0245,
    ETH: 1.2345
  });

  const [orderBook] = useState({
    bids: [
      { price: 0.2740, amount: 1500, total: 411 },
      { price: 0.2735, amount: 2200, total: 601.7 },
      { price: 0.2730, amount: 1800, total: 491.4 },
      { price: 0.2725, amount: 3500, total: 953.75 },
      { price: 0.2720, amount: 2100, total: 571.2 },
    ],
    asks: [
      { price: 0.2745, amount: 1200, total: 329.4 },
      { price: 0.2750, amount: 1800, total: 495 },
      { price: 0.2755, amount: 2500, total: 688.75 },
      { price: 0.2760, amount: 1600, total: 441.6 },
      { price: 0.2765, amount: 3200, total: 884.8 },
    ]
  });

  const [openOrders] = useState([
    {
      id: 1,
      pair: 'FXCT/USDT',
      type: 'limit',
      side: 'buy',
      amount: 1000,
      price: 0.2700,
      filled: 0,
      status: 'open',
      timestamp: '2024-08-30T10:30:00Z'
    },
    {
      id: 2,
      pair: 'FST/USDT',
      type: 'limit',
      side: 'sell',
      amount: 500,
      price: 1.4800,
      filled: 200,
      status: 'partial',
      timestamp: '2024-08-30T09:15:00Z'
    }
  ]);

  const [tradeHistory] = useState([
    {
      id: 1,
      pair: 'FXCT/USDT',
      type: 'market',
      side: 'buy',
      amount: 2000,
      price: 0.2745,
      total: 549,
      fee: 1.10,
      status: 'completed',
      timestamp: '2024-08-29T14:22:00Z'
    },
    {
      id: 2,
      pair: 'FST/USDT',
      type: 'limit',
      side: 'sell',
      amount: 1000,
      price: 1.4600,
      total: 1460,
      fee: 2.92,
      status: 'completed',
      timestamp: '2024-08-28T11:45:00Z'
    },
    {
      id: 3,
      pair: 'FXCT/FST',
      type: 'market',
      side: 'buy',
      amount: 5000,
      price: 0.1870,
      total: 935,
      fee: 0.935,
      status: 'completed',
      timestamp: '2024-08-27T16:30:00Z'
    }
  ]);

  const [recentTrades] = useState([
    { price: 0.2745, amount: 150, time: '14:32:15', type: 'buy' },
    { price: 0.2744, amount: 300, time: '14:32:10', type: 'sell' },
    { price: 0.2746, amount: 200, time: '14:32:05', type: 'buy' },
    { price: 0.2743, amount: 450, time: '14:32:00', type: 'sell' },
    { price: 0.2745, amount: 100, time: '14:31:55', type: 'buy' },
  ]);

  const handlePlaceOrder = () => {
    setLoading(true);
    console.log('Placing order:', {
      pair: selectedPair,
      type: orderType,
      side: tradeType,
      amount,
      price: orderType === 'limit' ? price : marketData[selectedPair].price
    });

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowOrderModal(false);
      setAmount('');
      setPrice('');
    }, 2000);
  };

  const formatNumber = (num, decimals = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    const orderPrice = orderType === 'market' ? marketData[selectedPair].price : (price || 0);
    return Number(amount) * Number(orderPrice);
  };

  const getCurrentMarketData = () => marketData[selectedPair];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <SEO {...seoData} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span>Trading Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">Buy and sell tokens with real-time market data</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.keys(marketData).map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-150">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Price</p>
          <p className="text-xl font-bold text-gray-900">
            ${formatNumber(getCurrentMarketData().price)}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">24h Change</p>
          <p className={`text-xl font-bold flex items-center space-x-1 ${
            getCurrentMarketData().change24h >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {getCurrentMarketData().change24h >= 0 ? 
              <TrendingUp className="w-4 h-4" /> : 
              <TrendingDown className="w-4 h-4" />
            }
            <span>{Math.abs(getCurrentMarketData().change24h)}%</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">24h High</p>
          <p className="text-xl font-bold text-gray-900">
            ${formatNumber(getCurrentMarketData().high24h)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">24h Low</p>
          <p className="text-xl font-bold text-gray-900">
            ${formatNumber(getCurrentMarketData().low24h)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">24h Volume</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(getCurrentMarketData().volume24h)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Market Cap</p>
          <p className="text-xl font-bold text-gray-900">
            {getCurrentMarketData().marketCap ? 
              formatCurrency(getCurrentMarketData().marketCap) : 
              'N/A'
            }
          </p>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{selectedPair} Chart</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Professional Trading Charts</span>
              </div>
            </div>
            <TradingViewWidget 
              symbol={selectedPair}
              height={450}
              theme="light"
              onTimeframeChange={(timeframe) => {
                console.log('Timeframe changed to:', timeframe);
                // You can add logic here to fetch new data based on timeframe
              }}
            />
          </div>

          {/* Order Book & Recent Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Book */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Book</h3>
              <div className="space-y-4">
                {/* Asks */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Price (USDT)</span>
                    <span>Amount</span>
                    <span>Total</span>
                  </div>
                  <div className="space-y-1">
                    {orderBook.asks.slice().reverse().map((ask, index) => (
                      <div key={index} className="flex justify-between text-xs py-1 hover:bg-red-50 cursor-pointer">
                        <span className="text-red-600 font-mono">{formatNumber(ask.price)}</span>
                        <span className="text-gray-900 font-mono">{ask.amount}</span>
                        <span className="text-gray-600 font-mono">{ask.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spread */}
                <div className="border-t border-b border-gray-200 py-2 text-center">
                  <span className="text-lg font-bold text-gray-900">
                    ${formatNumber(getCurrentMarketData().price)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    Spread: ${formatNumber(orderBook.asks[0].price - orderBook.bids[0].price)}
                  </span>
                </div>

                {/* Bids */}
                <div>
                  <div className="space-y-1">
                    {orderBook.bids.map((bid, index) => (
                      <div key={index} className="flex justify-between text-xs py-1 hover:bg-green-50 cursor-pointer">
                        <span className="text-green-600 font-mono">{formatNumber(bid.price)}</span>
                        <span className="text-gray-900 font-mono">{bid.amount}</span>
                        <span className="text-gray-600 font-mono">{bid.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Price (USDT)</span>
                  <span>Amount</span>
                  <span>Time</span>
                </div>
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex justify-between text-xs py-1">
                    <span className={`font-mono ${trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatNumber(trade.price)}
                    </span>
                    <span className="text-gray-900 font-mono">{trade.amount}</span>
                    <span className="text-gray-500">{trade.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Buy/Sell Panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Place Order</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                    tradeType === 'buy' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-150 ${
                    tradeType === 'sell' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors duration-150 ${
                      orderType === 'market' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors duration-150 ${
                      orderType === 'limit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Price (for limit orders) */}
              {orderType === 'limit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USDT)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.0000"
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({selectedPair.split('/')[0]})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Available: {formatNumber(walletBalances[selectedPair.split('/')[0]] || 0)}</span>
                  <div className="space-x-1">
                    <button onClick={() => setAmount(String((walletBalances[selectedPair.split('/')[0]] || 0) * 0.25))} className="hover:text-blue-600">25%</button>
                    <button onClick={() => setAmount(String((walletBalances[selectedPair.split('/')[0]] || 0) * 0.5))} className="hover:text-blue-600">50%</button>
                    <button onClick={() => setAmount(String((walletBalances[selectedPair.split('/')[0]] || 0) * 0.75))} className="hover:text-blue-600">75%</button>
                    <button onClick={() => setAmount(String(walletBalances[selectedPair.split('/')[0]] || 0))} className="hover:text-blue-600">Max</button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                </div>
                {orderType === 'market' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Market orders execute immediately at current market price
                  </p>
                )}
              </div>

              {/* Place Order Button */}
              <button
                onClick={() => setShowOrderModal(true)}
                disabled={!amount || (orderType === 'limit' && !price)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-150 ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300'
                    : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300'
                }`}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
              </button>
            </div>
          </div>

          {/* Wallet Balances */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Wallet Balances</span>
            </h3>
            <div className="space-y-3">
              {Object.entries(walletBalances).map(([token, balance]) => (
                <div key={token} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {token[0]}
                    </div>
                    <span className="font-medium">{token}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(balance)}</p>
                    <p className="text-xs text-gray-500">
                      ≈ {formatCurrency(balance * (marketData[`${token}/USDT`]?.price || 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders and History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['open-orders', 'order-history', 'trade-history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium capitalize transition-colors duration-150 border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Open Orders */}
          {activeTab === 'open-orders' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Open Orders</h3>
                <button className="text-sm text-red-600 hover:text-red-700">Cancel All</button>
              </div>
              {openOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pair</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filled</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {openOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.pair}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {order.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`capitalize ${order.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                              {order.side}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(order.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${formatNumber(order.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(order.filled)} ({Math.round((order.filled / order.amount) * 100)}%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'open' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-red-600 hover:text-red-700">Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No open orders</p>
                </div>
              )}
            </div>
          )}

          {/* Trade History */}
          {activeTab === 'trade-history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Side</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tradeHistory.map((trade) => (
                      <tr key={trade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trade.pair}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {trade.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`capitalize ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.side}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(trade.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${formatNumber(trade.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${formatNumber(trade.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${formatNumber(trade.fee)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-25" onClick={() => setShowOrderModal(false)}></div>
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm {tradeType} Order
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pair:</span>
                    <span className="font-semibold">{selectedPair}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Side:</span>
                    <span className={`font-semibold capitalize ${tradeType === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {tradeType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{amount} {selectedPair.split('/')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">
                      ${formatNumber(orderType === 'market' ? getCurrentMarketData().price : Number(price))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                {orderType === 'market' && (
                  <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Market orders execute immediately at the current market price, which may differ from the displayed price.
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors duration-150 ${
                      tradeType === 'buy'
                        ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300'
                        : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300'
                    }`}
                  >
                    {loading ? 'Placing...' : `${tradeType} Now`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
