import React from 'react';

const ProtocolCard = ({
  protocol,
  analyticsData,
  getRiskColor,
  formatNumber,
  formatCurrency,
  toggleEnabled,
  toggleHighlighted,
  handleApiChange
}) => {
  return (
    <div className={`p-6 rounded-lg border-2 ${getRiskColor(protocol.category)} transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{protocol.name}</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-semibold text-blue-600">{protocol.apyRange}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              protocol.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {protocol.enabled ? 'Active' : 'Inactive'}
            </span>
            {protocol.highlighted && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⭐ Highlighted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{protocol.description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4 text-xs text-gray-600">
        <div><strong>Blockchains:</strong> {protocol.blockchains}</div>
        <div><strong>Unique Features:</strong> {protocol.uniqueFeatures}</div>
        <div><strong>Risk Level:</strong> {protocol.risks}</div>
      </div>

      {/* Analytics Stats */}
      <div className="border-t pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-blue-50 rounded p-2 text-center">
            <div className="font-semibold text-blue-800">{formatNumber(analyticsData.protocolMetrics[protocol.name]?.connectedWallets || 0)}</div>
            <div className="text-blue-600">Wallets</div>
          </div>
          <div className="bg-green-50 rounded p-2 text-center">
            <div className="font-semibold text-green-800">{formatNumber(analyticsData.protocolMetrics[protocol.name]?.fxctStaked || 0)}</div>
            <div className="text-green-600">FXCT Staked</div>
          </div>
        </div>
        
        {/* USD Value Display */}
        <div className="mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-900">Total Value Locked</div>
              <div className="text-lg font-bold text-purple-800">
                {formatCurrency(analyticsData.protocolMetrics[protocol.name]?.tvl || 0)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-600">24h Volume</div>
              <div className="text-sm font-semibold text-purple-700">
                {formatCurrency(analyticsData.protocolMetrics[protocol.name]?.volume24h || 0)}
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-200 flex justify-between items-center">
            <span className="text-xs text-purple-600">Commission Earned:</span>
            <span className="text-sm font-bold text-green-600">
              {formatCurrency(analyticsData.protocolMetrics[protocol.name]?.commissionEarned || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={protocol.enabled}
              onChange={() => toggleEnabled(protocol.originalIndex)}
              className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable Protocol</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={protocol.highlighted}
              onChange={() => toggleHighlighted(protocol.originalIndex)}
              className="mr-2 h-4 w-4 text-yellow-600 rounded focus:ring-yellow-500"
            />
            <span className="text-sm font-medium text-gray-700">Highlight/Promote</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Commission Rate:</label>
          <div className="flex items-center">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={protocol.apiPercentage}
              onChange={(e) => handleApiChange(protocol.originalIndex, parseFloat(e.target.value) || 0)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="ml-1 text-sm text-gray-500">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolCard;
