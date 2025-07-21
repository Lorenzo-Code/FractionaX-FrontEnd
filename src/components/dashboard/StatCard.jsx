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
}) {
  const isToken = price !== undefined && bid !== undefined && ask !== undefined;
  const spread = isToken ? (ask - bid).toFixed(4) : null;

  const priceColor =
    isToken && (price >= bid && price <= ask) ? 'text-blue-600' : 'text-red-500';

  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-1 text-sm">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h4>
        {icon && <div className="text-lg">{icon}</div>}
      </div>

      {/* Balance (if available) */}
      {balance && (
        <h2 className="text-2xl font-bold">
          {balance.toLocaleString()} {title.includes('FXCT') ? 'FXCT' : 'FST'}
        </h2>
      )}

      {/* Primary Display: Amount or Token Price */}
      <p className={`text-sm ${isToken ? priceColor : 'text-gray-800'}`}>
        {isToken ? `$${price.toFixed(4)}` : amount}
      </p>

      {/* USD equivalent (optional if not token) */}
      {usd && !isToken && (
        <p className="text-xs text-gray-400">≈ ${parseFloat(usd).toFixed(2)}</p>
      )}

      {/* Token-specific Data */}
      {isToken && (
        <div className="space-y-1 text-xs pt-1">
          <div className="flex justify-between">
            <span className="text-green-600">🟢 Bid: ${bid.toFixed(4)}</span>
            <span className="text-red-500">Ask: ${ask.toFixed(4)} 🔴</span>
          </div>
          <p className="text-gray-400">Spread: ${spread}</p>
        </div>
      )}
    </div>
  );
}
