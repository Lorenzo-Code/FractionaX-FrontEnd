import React from 'react';

export default function StatCard({
  title,
  amount,
  usd,
  balance,
  icon,
  price,
  bid,
  ask,
  change24h,
  loading = false
}) {
  const isToken = price !== undefined && bid !== undefined && ask !== undefined;
  const spread = isToken ? (ask - bid).toFixed(4) : null;
  const spreadPercent = isToken ? (((ask - bid) / bid) * 100).toFixed(2) : null;

  const priceColor =
    isToken && (price >= bid && price <= ask) ? 'text-blue-600' : 'text-red-500';

  const getChangeColor = (change) => {
    if (!change) return 'text-gray-500';
    return parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    if (!change) return '';
    return parseFloat(change) >= 0 ? '↗️' : '↘️';
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-xl p-5 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-1 text-sm hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h4>
        {icon && <div className="text-lg">{icon}</div>}
      </div>

      {/* Balance (if available) */}
      {balance && (
        <h2 className="text-2xl font-bold text-gray-900">
          {balance.toLocaleString()} {title.includes('FXCT') ? 'FXCT' : 'FST'}
        </h2>
      )}

      {/* Primary Display: Amount or Token Price */}
      <div className="flex items-center space-x-2">
        <p className={`text-lg font-semibold ${isToken ? priceColor : 'text-gray-800'}`}>
          {isToken ? `$${price.toFixed(4)}` : amount}
        </p>
        {change24h && (
          <span className={`text-xs ${getChangeColor(change24h)} flex items-center`}>
            {getChangeIcon(change24h)} {Math.abs(parseFloat(change24h)).toFixed(2)}%
          </span>
        )}
      </div>

      {/* USD equivalent (optional if not token) */}
      {usd && !isToken && (
        <p className="text-xs text-gray-400">≈ ${parseFloat(usd).toFixed(2)}</p>
      )}

      {/* Token-specific Data */}
      {isToken && (
        <div className="space-y-1 text-xs pt-2 border-t border-gray-100">
          <div className="flex justify-between">
            <span className="text-green-600">🟢 Bid: ${bid.toFixed(4)}</span>
            <span className="text-red-500">Ask: ${ask.toFixed(4)} 🔴</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Spread: ${spread}</span>
            <span>({spreadPercent}%)</span>
          </div>
        </div>
      )}
    </div>
  );
}
