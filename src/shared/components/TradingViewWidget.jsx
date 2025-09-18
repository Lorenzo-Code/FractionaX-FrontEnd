import React, { useEffect, useRef, useState } from 'react';

const TradingViewWidget = ({ 
  symbol = 'FXCT/USDT', 
  height = 450,
  theme = 'light',
  onTimeframeChange 
}) => {
  const containerRef = useRef();
  const [activeTimeframe, setActiveTimeframe] = useState('4h');

  const timeframes = [
    { label: '1H', value: '1h' },
    { label: '4H', value: '4h' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' }
  ];

  // Map your symbols to TradingView symbols
  const getSymbolForTradingView = (symbol) => {
    switch(symbol) {
      case 'FXCT/USDT':
        return 'BINANCE:BTCUSDT'; // Using BTC as proxy until you have real data
      case 'FST/USDT':
        return 'BINANCE:ETHUSDT'; // Using ETH as proxy
      case 'FXCT/FST':
        return 'BINANCE:BTCETH';
      default:
        return 'BINANCE:BTCUSDT';
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing widget
      containerRef.current.innerHTML = '';

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": false,
        "width": "100%",
        "height": height,
        "symbol": getSymbolForTradingView(symbol),
        "interval": activeTimeframe,
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "withdateranges": true,
        "range": "6M",
        "hide_side_toolbar": false,
        "allow_symbol_change": false,
        "details": false,
        "hotlist": false,
        "calendar": false,
        "studies": [
          "Volume@tv-basicstudies"
        ],
        "show_popup_button": false,
        "popup_width": "1000",
        "popup_height": "650",
        "no_referral_id": true,
        "container_id": "tradingview_chart"
      });

      containerRef.current.appendChild(script);
    }
  }, [symbol, activeTimeframe, height, theme]);

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    if (onTimeframeChange) {
      onTimeframeChange(timeframe);
    }
  };

  return (
    <div className="w-full">
      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2 mb-4">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => handleTimeframeChange(timeframe.value)}
            className={`px-3 py-1 text-sm rounded transition-colors duration-150 ${
              activeTimeframe === timeframe.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>

      {/* TradingView Widget Container */}
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div 
          ref={containerRef} 
          id="tradingview_chart"
          style={{ height: `${height}px`, width: '100%' }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
        <span>Powered by TradingView</span>
        <span className="font-medium">{symbol}</span>
      </div>

      {/* Info about symbol mapping */}
      <div className="mt-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
        Currently showing proxy data ({getSymbolForTradingView(symbol).replace('BINANCE:', '')}). 
        Replace with your custom symbol feeds in production.
      </div>
    </div>
  );
};

export default TradingViewWidget;
