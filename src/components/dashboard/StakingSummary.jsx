import React from 'react';

export default function StakingSummary() {
  const stakedAmount = 5000;
  const rewardRate = 0.06; // 6% APY
  const claimableRewards = 120;
  const lockoutEnds = '2025-09-01'; // ISO format for lock end
  const now = new Date();
  const lockoutDate = new Date(lockoutEnds);
  const daysLeft = Math.ceil((lockoutDate - now) / (1000 * 60 * 60 * 24));

  const annualRewards = stakedAmount * rewardRate;
  const monthlyEstimate = (annualRewards / 12).toFixed(2);
  const projectedValueUSD = (monthlyEstimate * 0.27).toFixed(2); // Assume 1 FCT = $0.27

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-3 text-sm">
      <h3 className="text-lg font-semibold mb-2">📥 Staking Summary</h3>

      <div className="grid grid-cols-2 gap-4">
        <p><strong>Staked:</strong> {stakedAmount.toLocaleString()} FCT</p>
        <p><strong>Reward Rate:</strong> {(rewardRate * 100).toFixed(1)}% APY</p>
        <p><strong>Claimable:</strong> {claimableRewards} FCT</p>
        <p><strong>Est. Monthly Rewards:</strong> ~{monthlyEstimate} FCT (${projectedValueUSD})</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-gray-700">
        🔒 <strong>Lockout Period:</strong>{' '}
        {daysLeft > 0 ? (
          <>
            Ends in <strong>{daysLeft} days</strong> on {lockoutDate.toLocaleDateString()}
          </>
        ) : (
          <span className="text-green-600 font-bold">Unlocked ✅</span>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        <button className="px-4 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700">
          Claim Rewards
        </button>
        <a
          href="/staking"
          className="text-xs text-blue-600 hover:underline"
        >
          🔎 View Full Staking Page
        </a>
      </div>
    </div>
  );
}
