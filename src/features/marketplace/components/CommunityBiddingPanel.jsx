import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins,
  Users,
  TrendingUp,
  Star,
  Trophy,
  Target,
  ArrowUp,
  Share2,
  Gift,
  Crown,
  Zap,
  Timer
} from 'lucide-react';

const CommunityBiddingPanel = ({ propertyId, propertyTitle, propertyPrice, onPlaceBid }) => {
  const [bidAmount, setBidAmount] = useState(100);
  const [showBidForm, setShowBidForm] = useState(false);
  const [activeTab, setActiveTab] = useState('bidding');

  // Mock data - replace with real API calls
  const [biddingStats] = useState({
    totalCommitted: 12500,
    targetAmount: 15000,
    investorsCount: 45,
    timeRemaining: '6d 14h',
    progressPercent: 83,
    recentActivity: 8
  });

  const [recentBids] = useState([
    {
      id: 1,
      username: 'CryptoInvestor_TX',
      amount: 500,
      timestamp: '2 minutes ago',
      badge: 'gold',
      total_contributed: 2800,
      properties_invested: 12
    },
    {
      id: 2,
      username: 'REITBuilder',
      amount: 300,
      timestamp: '5 minutes ago',
      badge: 'silver',
      total_contributed: 1900,
      properties_invested: 8
    },
    {
      id: 3,
      username: 'PropertyHunter23',
      amount: 250,
      timestamp: '12 minutes ago',
      badge: 'bronze',
      total_contributed: 850,
      properties_invested: 3
    },
    {
      id: 4,
      username: 'AustinRealEstate',
      amount: 750,
      timestamp: '18 minutes ago',
      badge: 'platinum',
      total_contributed: 5200,
      properties_invested: 18
    },
    {
      id: 5,
      username: 'DiversifiedPortfolio',
      amount: 200,
      timestamp: '25 minutes ago',
      badge: 'silver',
      total_contributed: 1600,
      properties_invested: 6
    }
  ]);

  const [topBidders] = useState([
    {
      rank: 1,
      username: 'PropertyKing_ATX',
      totalContributed: 5800,
      badge: 'platinum',
      streak: 12,
      rewards: '580 FXCT earned'
    },
    {
      rank: 2,
      username: 'InvestmentGuru',
      totalContributed: 4200,
      badge: 'gold',
      streak: 8,
      rewards: '420 FXCT earned'
    },
    {
      rank: 3,
      username: 'REITechPro',
      totalContributed: 3900,
      badge: 'gold',
      streak: 6,
      rewards: '390 FXCT earned'
    },
    {
      rank: 4,
      username: 'CommunityBuilder',
      totalContributed: 2800,
      badge: 'silver',
      streak: 4,
      rewards: '280 FXCT earned'
    }
  ]);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'platinum': return <Crown className="w-4 h-4 text-gray-400" />;
      case 'gold': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'silver': return <Star className="w-4 h-4 text-gray-400" />;
      case 'bronze': return <Target className="w-4 h-4 text-orange-500" />;
      default: return <Coins className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'platinum': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'bronze': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const handlePlaceBid = () => {
    if (bidAmount >= 50) {
      onPlaceBid({
        amount: bidAmount,
        propertyId,
        timestamp: new Date().toISOString()
      });
      setShowBidForm(false);
      setBidAmount(100);
    }
  };

  const shareOnSocial = () => {
    const shareText = `🏠 Just backed the ${propertyTitle} investment opportunity on @FractionaX! Join our community of smart investors. #FractionalInvesting #RealEstate #FXCT`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Community Bidding</h3>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-medium">{biddingStats.timeRemaining}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{biddingStats.totalCommitted.toLocaleString()} FXCT committed</span>
            <span>{biddingStats.progressPercent}% of target</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${biddingStats.progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{biddingStats.investorsCount}</div>
            <div className="text-xs text-blue-100">Investors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{biddingStats.targetAmount.toLocaleString()}</div>
            <div className="text-xs text-blue-100">Target FXCT</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{biddingStats.recentActivity}</div>
            <div className="text-xs text-blue-100">Recent Activity</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          {['bidding', 'leaderboard', 'rewards'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'bidding' && <Coins className="w-4 h-4 mr-2 inline" />}
              {tab === 'leaderboard' && <Trophy className="w-4 h-4 mr-2 inline" />}
              {tab === 'rewards' && <Gift className="w-4 h-4 mr-2 inline" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'bidding' && (
          <div className="space-y-6">
            {/* Bid Form */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-green-900">Place Your Bid</h4>
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-green-600" />
                  <button
                    onClick={shareOnSocial}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Share for +10% rewards
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FXCT Amount (minimum 50)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Math.max(50, parseInt(e.target.value) || 50))}
                      min="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter FXCT amount"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Coins className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBidAmount(amount)}
                      className="py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Rewards Preview */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700">Expected Reward:</span>
                    <span className="font-semibold text-orange-800">
                      +{Math.floor(bidAmount * 0.07)} FXCT (7% bonus)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceBid}
                  disabled={bidAmount < 50}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Place Bid</span>
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                <AnimatePresence>
                  {recentBids.map((bid) => (
                    <motion.div
                      key={bid.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded-full border text-xs font-semibold flex items-center space-x-1 ${getBadgeColor(bid.badge)}`}>
                          {getBadgeIcon(bid.badge)}
                          <span>{bid.badge}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{bid.username}</div>
                          <div className="text-xs text-gray-500">{bid.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+{bid.amount} FXCT</div>
                        <div className="text-xs text-gray-500">{bid.properties_invested} properties</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Top Contributors</h4>
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                This Property
              </div>
            </div>
            
            <div className="space-y-3">
              {topBidders.map((bidder) => (
                <motion.div
                  key={bidder.rank}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      bidder.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      bidder.rank === 2 ? 'bg-gray-100 text-gray-700' :
                      bidder.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {bidder.rank === 1 ? <Crown className="w-4 h-4" /> : bidder.rank}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">{bidder.username}</div>
                      <div className="text-sm text-gray-500">{bidder.rewards}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {bidder.totalContributed.toLocaleString()} FXCT
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {bidder.streak} streak
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h5 className="font-semibold text-blue-900 mb-1">Climb the Leaderboard!</h5>
              <p className="text-sm text-blue-700">
                Higher ranks unlock exclusive deals and bonus rewards
              </p>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Active Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Gift className="w-5 h-5 text-green-600" />
                  <h5 className="font-semibold text-green-900">Bidding Rewards</h5>
                </div>
                <div className="text-2xl font-bold text-green-700 mb-1">7-10%</div>
                <p className="text-sm text-green-600">Bonus FXCT on every bid</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <h5 className="font-semibold text-blue-900">Social Sharing</h5>
                </div>
                <div className="text-2xl font-bold text-blue-700 mb-1">+10%</div>
                <p className="text-sm text-blue-600">Extra rewards for sharing</p>
              </div>
            </div>

            {/* Staking Rewards */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h5 className="font-semibold text-purple-900">FXCT Staking</h5>
                </div>
                <div className="text-lg font-bold text-purple-700">5-10% APY</div>
              </div>
              <p className="text-sm text-purple-700 mb-4">
                Stake your earned FXCT tokens to earn passive yield while supporting the ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-purple-800">Marketplace Staking</div>
                  <div className="text-purple-600">5-7% APY • Flexible terms</div>
                </div>
                <div>
                  <div className="font-medium text-purple-800">DeFi Integration</div>
                  <div className="text-purple-600">6-10% APY • External protocols</div>
                </div>
              </div>
            </div>

            {/* Community Achievements */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Community Achievements</h5>
              <div className="space-y-3">
                {[
                  { title: 'First Bid', desc: 'Place your first community bid', reward: '+50 FXCT', completed: true },
                  { title: 'Social Sharer', desc: 'Share 3 investment opportunities', reward: '+100 FXCT', completed: false },
                  { title: 'Community Builder', desc: 'Bid on 5 different properties', reward: '+250 FXCT', completed: false },
                  { title: 'Top Contributor', desc: 'Reach top 10 on any leaderboard', reward: '+500 FXCT', completed: false }
                ].map((achievement, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                    achievement.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {achievement.completed ? <Trophy className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.desc}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      achievement.completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.reward}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityBiddingPanel;
