import React, { useState } from 'react';
import { Shield, Lock, TrendingUp, Clock, DollarSign, Users, AlertTriangle, CheckCircle, Info, ArrowRight, Eye, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../../shared/components';
import { useAuth } from '../../../shared/hooks';

const InvestmentProtocols = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Protocol data matching admin panel configurations
  const investmentProtocols = [
    // Low-Risk Options (Currently Available)
    {
      id: 'lido-eth-staking',
      name: 'Lido (Liquid Staking for ETH)',
      type: 'Liquid Staking',
      apy: '3-5%',
      minInvestment: '0.01 ETH (~$32)',
      lockPeriod: 'No lock (liquid)',
      riskLevel: 'Low',
      totalStaked: '$32.5M',
      participants: 8420,
      description: 'Users stake ETH to earn network rewards while keeping liquidity via stETH tokens. Treasury deploys ETH here for passive validator yields.',
      features: [
        'Liquid staking—no lock-ups beyond unbonding',
        'Receive stETH tokens for immediate liquidity',
        'Audited by top security firms',
        'Ethereum 2.0 staking rewards'
      ],
      requirements: [
        'Minimum 0.01 ETH investment',
        'Valid Ethereum wallet',
        'Understanding of liquid staking risks',
        'Platform KYC verification'
      ],
      insurance: {
        coverage: 'Slashing Protection',
        provider: 'Lido Protocol Insurance',
        details: 'Protection against validator slashing events and smart contract risks'
      }
    },
    {
      id: 'curve-stablecoins',
      name: 'Curve Finance (Stablecoin Liquidity Pools)',
      type: 'Liquidity Provider',
      apy: '4-10%',
      minInvestment: '$100 stablecoins',
      lockPeriod: 'No lock (flexible)',
      riskLevel: 'Low',
      totalStaked: '$25.8M',
      participants: 6840,
      description: 'Provides liquidity for stablecoin swaps (e.g., USDC/USDT), earning trading fees with low impermanent loss.',
      features: [
        'Low impermanent loss on stablecoin pairs',
        'Trading fee rewards from swaps',
        'veCRV integration for boosted yields',
        'Multiple stablecoin pool options'
      ],
      requirements: [
        'Minimum $100 in stablecoins',
        'Understanding of liquidity provision',
        'Gas fee budget for transactions',
        'DeFi wallet setup'
      ],
      insurance: {
        coverage: 'Smart Contract Protection',
        provider: 'Protocol Insurance Fund',
        details: 'Coverage for audited pools and smart contract vulnerabilities'
      }
    },
    
    // Medium-Risk Options (Currently Available)
    {
      id: 'aave-lending',
      name: 'Aave (Lending Protocol)',
      type: 'Decentralized Lending',
      apy: '2-15%',
      minInvestment: '$50 equivalent',
      lockPeriod: 'No lock (flexible)',
      riskLevel: 'Medium',
      totalStaked: '$18.9M',
      participants: 5220,
      description: 'Lend treasury ETH/stablecoins to borrowers; earn interest adjusted by supply/demand.',
      features: [
        'Variable interest rates based on utilization',
        'Safety Module staking for extra rewards',
        'Flash loan integration capabilities',
        'Overcollateralized borrowing protection'
      ],
      requirements: [
        'Minimum $50 equivalent tokens',
        'Understanding of lending risks',
        'DeFi experience recommended',
        'Platform verification'
      ],
      insurance: {
        coverage: 'Protocol Risk Protection',
        provider: 'Aave Safety Module',
        details: 'Covers smart contract exploits through Safety Module insurance'
      }
    },
    {
      id: 'yearn-optimizer',
      name: 'Yearn.Finance (Yield Optimizer)',
      type: 'Automated Yield Farming',
      apy: '5-15%',
      minInvestment: '$100 equivalent',
      lockPeriod: 'No lock (flexible)',
      riskLevel: 'Medium',
      totalStaked: '$12.4M',
      participants: 2890,
      description: 'Automates shifting treasury funds across protocols (e.g., Aave, Compound) for max returns.',
      features: [
        'Automated yield optimization',
        'Vault strategies for passive management',
        'Gas cost optimization',
        'Multi-protocol diversification'
      ],
      requirements: [
        'Minimum $100 equivalent investment',
        'Understanding of automated strategies',
        'Tolerance for strategy changes',
        'DeFi experience recommended'
      ],
      insurance: {
        coverage: 'Strategy Risk Protection',
        provider: 'Yearn Insurance Fund',
        details: 'Coverage for vault strategies and underlying protocol risks'
      }
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Low-Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Medium-High': return 'text-red-600 bg-red-100';
      case 'High': return 'text-red-700 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ProtocolCard = ({ protocol }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{protocol.name}</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{protocol.type}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(protocol.riskLevel)}`}>
            {protocol.riskLevel} Risk
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{protocol.apy}</div>
            <div className="text-sm text-gray-600">APY Range</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{protocol.minInvestment}</div>
            <div className="text-sm text-gray-600">Min Investment</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-center text-sm">
          <div>
            <div className="font-semibold text-gray-900">{protocol.lockPeriod}</div>
            <div className="text-gray-500">Lock Period</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{protocol.totalStaked}</div>
            <div className="text-gray-500">Total Staked</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{protocol.participants}</div>
            <div className="text-gray-500">Participants</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{protocol.description}</p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedProtocol(protocol)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} />
              Invest Now
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} />
              Login to Invest
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const ProtocolModal = ({ protocol, onClose }) => {
    if (!protocol) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{protocol.name}</h2>
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">{protocol.type}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(protocol.riskLevel)}`}>
                    {protocol.riskLevel} Risk
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-600">{protocol.apy}</div>
                <div className="text-sm text-gray-600">APY Range</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-green-600">{protocol.minInvestment}</div>
                <div className="text-sm text-gray-600">Min Investment</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-purple-600">{protocol.lockPeriod}</div>
                <div className="text-sm text-gray-600">Lock Period</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-orange-600">{protocol.participants}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {protocol.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {protocol.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Insurance Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Investment Protection
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Coverage Type</div>
                  <div className="font-semibold text-gray-900">{protocol.insurance.coverage}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Insurance Provider</div>
                  <div className="font-semibold text-gray-900">{protocol.insurance.provider}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Details</div>
                  <div className="font-semibold text-gray-900 text-sm">{protocol.insurance.details}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Protocol</h3>
              <p className="text-gray-600 leading-relaxed">{protocol.description}</p>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <ArrowRight size={20} />
                  Start Investment
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <ArrowRight size={20} />
                  Login to Invest
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Platform Protocols | FractionaX"
        description="Explore platform participation opportunities including FXCT utility participation, property fractions, DeFi yield farming, and AI-managed portfolios. FXCT is a utility token for network services."
        keywords="platform protocols, FXCT utility token, network participation, real estate investment, DeFi yield farming, AI portfolio management, blockchain utility"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
          <div className="container mx-auto px-6 lg:px-24">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Platform Protocols
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Explore various platform participation opportunities and network utility protocols
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                  <h3 className="text-lg font-semibold mb-2">Fully Insured</h3>
                  <p className="text-blue-200 text-sm">All protocols protected by leading insurance providers</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                  <h3 className="text-lg font-semibold mb-2">High Returns</h3>
                  <p className="text-blue-200 text-sm">Competitive APY rates across all risk levels</p>
                </div>
                <div className="text-center">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                  <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                  <p className="text-blue-200 text-sm">Enterprise-grade security for your investments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Protocols Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6 lg:px-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Investment Strategy</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each protocol is designed for different risk tolerances and investment goals. 
                All options include comprehensive insurance coverage to protect your investment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {investmentProtocols.map((protocol) => (
                <ProtocolCard key={protocol.id} protocol={protocol} />
              ))}
            </div>
          </div>
        </section>

        {/* Security & Insurance Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Investment Protection</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We partner with leading insurance providers to ensure your investments are protected against various risks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Contract Insurance</h3>
                <p className="text-gray-600">
                  Protection against smart contract exploits and protocol vulnerabilities through leading DeFi insurance providers.
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Lock className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Asset Protection</h3>
                <p className="text-gray-600">
                  Real estate investments are backed by comprehensive property insurance and liability protection.
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <PieChart className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Guarantees</h3>
                <p className="text-gray-600">
                  AI-managed portfolios include performance insurance to protect against algorithm failures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-6 lg:px-24 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Investing?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Access your dashboard to begin investing in any of our protected protocols."
                : "Create an account to access our investment protocols and start building your portfolio."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowRight size={20} />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={20} />
                    Get Started
                  </Link>
                  <Link
                    to="/faq"
                    className="border-2 border-white text-white py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Legal Disclaimers Section */}
        <section className="py-12 bg-gray-100 border-t-2 border-gray-200">
          <div className="container mx-auto px-6 lg:px-24">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Important Legal Disclaimers
              </h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="font-semibold text-yellow-800 mb-2">FXCT Utility Token Notice:</p>
                  <p>FXCT tokens are utility tokens designed for platform usage and governance participation. They are not investment contracts or securities. Network rewards are based on utility consumption and platform participation, not investment returns. Token value may fluctuate based on utility demand and market conditions.</p>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p className="font-semibold text-red-800 mb-2">No Investment Advice:</p>
                  <p>Information provided on this page does not constitute investment advice, financial advice, or recommendations. Past performance does not guarantee future results. All protocol participation involves risk of loss. Consult with qualified professionals before making financial decisions.</p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="font-semibold text-blue-800 mb-2">Risk Disclosure:</p>
                  <p>All DeFi and blockchain protocols carry inherent risks including but not limited to: smart contract vulnerabilities, regulatory changes, market volatility, impermanent loss, and total loss of funds. Only participate with amounts you can afford to lose entirely.</p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                  <p className="font-semibold text-purple-800 mb-2">Regulatory Compliance:</p>
                  <p>Users are responsible for compliance with local laws and regulations. Some protocols may not be available in certain jurisdictions. FractionaX does not provide legal or tax advice. Consult appropriate professionals for guidance on regulatory compliance.</p>
                </div>
                
                <div className="text-xs text-gray-500 mt-6 border-t pt-4">
                  <p>* Network rewards are variable and depend on protocol performance, network participation, and platform utility usage. Historical performance is not indicative of future results. All figures are estimates and subject to change based on network conditions.</p>
                  <p className="mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Protocol Detail Modal */}
        {selectedProtocol && (
          <ProtocolModal 
            protocol={selectedProtocol} 
            onClose={() => setSelectedProtocol(null)} 
          />
        )}
      </div>
    </>
  );
};

export default InvestmentProtocols;
