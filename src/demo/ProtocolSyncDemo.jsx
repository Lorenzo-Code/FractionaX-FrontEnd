import React from 'react';
import { useProtocolSync } from '../hooks/useProtocolSync';

/**
 * Demo component to test protocol sync functionality
 * This shows how changes in admin panel will reflect on homepage
 */
const ProtocolSyncDemo = () => {
  const {
    protocols,
    enabledProtocols,
    stats,
    updateProtocolAPY,
    toggleProtocolEnabled,
    toggleProtocolHighlighted,
    loading
  } = useProtocolSync();

  if (loading) {
    return <div>Loading protocol data...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Protocol Sync Demo</h1>
      
      {/* Current Stats */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Current Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-lg font-bold text-blue-600">${stats.totalValueLocked?.toFixed(1)}M</div>
            <div className="text-sm text-gray-500">Total Value Locked</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{stats.highestAPY?.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Highest APY</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{stats.activeProtocols}</div>
            <div className="text-sm text-gray-500">Active Protocols</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">{stats.totalStakers?.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Stakers</div>
          </div>
        </div>
      </div>

      {/* Protocol List with Controls */}
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">Protocol Controls (Admin Actions)</h2>
        <div className="space-y-3">
          {protocols.map((protocol) => (
            <div key={protocol.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{protocol.name}</div>
                <div className="text-sm text-gray-500">
                  APY: {protocol.apy}% | Min: {protocol.minStake.toLocaleString()} | Total: {protocol.totalStaked}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* APY Adjuster */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">APY:</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={protocol.apy}
                    onChange={(e) => updateProtocolAPY(protocol.id, parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>

                {/* Enabled Toggle */}
                <button
                  onClick={() => toggleProtocolEnabled(protocol.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    protocol.enabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {protocol.enabled ? 'Enabled' : 'Disabled'}
                </button>

                {/* Highlighted Toggle */}
                <button
                  onClick={() => toggleProtocolHighlighted(protocol.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    protocol.highlighted
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {protocol.highlighted ? 'Featured' : 'Standard'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enabled Protocols Preview */}
      <div className="bg-gray-50 rounded-lg border p-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">Homepage Preview (Enabled Protocols Only)</h2>
        <div className="space-y-2">
          {enabledProtocols.map((protocol) => (
            <div key={protocol.id} className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center">
                {protocol.highlighted && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2">
                    Featured
                  </span>
                )}
                <span className="font-medium">{protocol.name}</span>
              </div>
              <div className="text-green-600 font-bold">{protocol.apy}% APY</div>
            </div>
          ))}
        </div>
        
        {enabledProtocols.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No enabled protocols. Enable protocols above to see them here.
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How It Works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Changes you make above are automatically synced to localStorage</li>
          <li>• The homepage MarketOverview component reads from the same localStorage</li>
          <li>• Any changes in admin panel instantly reflect on the homepage</li>
          <li>• Stats are automatically recalculated when protocols change</li>
          <li>• No backend required - all sync happens in the browser</li>
        </ul>
      </div>
    </div>
  );
};

export default ProtocolSyncDemo;
