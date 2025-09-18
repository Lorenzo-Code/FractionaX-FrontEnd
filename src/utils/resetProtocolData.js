/**
 * Utility to reset protocol data and switch to FXST tokens
 * Run this once to migrate from FXCT to FXST
 */
import protocolSyncService from '../shared/services/protocolSyncService';

export const resetToFXST = () => {
  console.log('🔄 Resetting protocol data to use FXST tokens...');
  
  // Clear existing data
  protocolSyncService.clearData();
  
  // Initialize with FXST protocols
  const fxstProtocols = [
    {
      id: 'lido-eth-fxst',
      name: 'Lido ETH Staking',
      protocol: 'Lido (Liquid Staking for ETH)',
      token: 'FXST',
      apy: 4.2,
      duration: 'Flexible',
      minStake: 1000,
      totalStaked: '$32.5M',
      risk: 'Low',
      status: 'Active',
      enabled: true,
      highlighted: false,
      description: 'Stake FXST to earn network rewards while keeping liquidity via stETH tokens',
      category: 'Low-Risk',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'curve-stablecoin-fxst',
      name: 'Curve Stablecoin Pool',
      protocol: 'Curve Finance (Stablecoin Liquidity Pools)',
      token: 'FXST',
      apy: 7.8,
      duration: 'Flexible',
      minStake: 2500,
      totalStaked: '$25.8M',
      risk: 'Low',
      status: 'Active',
      enabled: true,
      highlighted: true,
      description: 'Provide FXST liquidity for stablecoin swaps earning trading fees',
      category: 'Low-Risk',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'aave-lending-fxst',
      name: 'Aave Lending Protocol',
      protocol: 'Aave (Lending Protocol)',
      token: 'FXST',
      apy: 9.1,
      duration: 'Flexible',
      minStake: 5000,
      totalStaked: '$18.9M',
      risk: 'Medium',
      status: 'Active',
      enabled: true,
      highlighted: false,
      description: 'Lend FXST tokens to borrowers and earn interest based on supply/demand',
      category: 'Medium-Risk',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'yearn-optimizer-fxst',
      name: 'Yearn Yield Optimizer',
      protocol: 'Yearn.Finance (Yield Optimizer)',
      token: 'FXST',
      apy: 11.5,
      duration: 'Flexible',
      minStake: 10000,
      totalStaked: '$12.4M',
      risk: 'Medium',
      status: 'Active',
      enabled: true,
      highlighted: true,
      description: 'Automated FXST yield farming across multiple DeFi protocols',
      category: 'Medium-Risk',
      lastUpdated: new Date().toISOString()
    }
  ];
  
  // Save the new FXST protocols
  protocolSyncService.saveProtocols(fxstProtocols);
  
  console.log('✅ Successfully reset protocol data to FXST tokens');
  console.log('📊 Updated protocols:', fxstProtocols.length);
  
  return fxstProtocols;
};

// Export the service as well for direct access
export { protocolSyncService };

export default resetToFXST;
