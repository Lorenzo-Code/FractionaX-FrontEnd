import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ 
  data = [], 
  symbol = 'FXCT/USDT',
  height = 400,
  theme = 'light',
  onTimeframeChange,
  className = '' 
}) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const [activeTimeframe, setActiveTimeframe] = useState('4H');

  // Sample data for demonstration - in production, this would come from your API
  const generateSampleData = (symbol) => {
    const basePrice = symbol.includes('FXCT') ? 0.2745 : 
                      symbol.includes('FST') ? 1.4520 : 0.1890;
    const sampleData = [];
    const now = Math.floor(Date.now() / 1000);
    
    for (let i = 100; i >= 0; i--) {
      const time = now - (i * 3600 * 4); // 4-hour intervals
      const trend = Math.sin(i * 0.1) * 0.05; // Add some trending pattern
      const noise = (Math.random() - 0.5) * 0.02; // Random noise
      const price = basePrice * (1 + trend + noise);
      
      const open = price * (1 + (Math.random() - 0.5) * 0.005);
      const close = price * (1 + (Math.random() - 0.5) * 0.005);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      sampleData.push({
        time: time,
        open: Number(open.toFixed(4)),
        high: Number(high.toFixed(4)),
        low: Number(low.toFixed(4)),
        close: Number(close.toFixed(4))
      });
    }
    
    return sampleData.sort((a, b) => a.time - b.time);
  };

  const timeframes = [
    { label: '1H', value: '1H', interval: 3600 },
    { label: '4H', value: '4H', interval: 14400 },
    { label: '1D', value: '1D', interval: 86400 },
    { label: '1W', value: '1W', interval: 604800 }
  ];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: theme === 'dark' ? '#1a1a1a' : '#ffffff' },
        textColor: theme === 'dark' ? '#d1d5db' : '#374151',
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      grid: {
        vertLines: {
          color: theme === 'dark' ? '#374151' : '#f3f4f6',
        },
        horzLines: {
          color: theme === 'dark' ? '#374151' : '#f3f4f6',
        },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add candlestick series
    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    // Use provided data or generate sample data
    const chartData = data.length > 0 ? data : generateSampleData(symbol);
    seriesRef.current.setData(chartData);

    // Fit content to show all data
    chartRef.current.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: height,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, symbol, height, theme]);

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    if (onTimeframeChange) {
      onTimeframeChange(timeframe);
    }
    
    // In a real implementation, you would fetch new data based on the timeframe
    // For now, we'll just regenerate sample data
    if (seriesRef.current && chartRef.current) {
      const newData = generateSampleData(symbol);
      seriesRef.current.setData(newData);
      chartRef.current.timeScale().fitContent();
    }
  };

  return (
    <div className={`relative ${className}`}>
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

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full border border-gray-200 rounded-lg"
        style={{ height: `${height}px` }}
      />

      {/* Chart Info */}
      <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
        <span>Powered by Lightweight Charts</span>
        <span className="font-medium">{symbol}</span>
      </div>
    </div>
  );
};

export default TradingViewChart;
