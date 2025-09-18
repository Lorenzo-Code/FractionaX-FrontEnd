import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradingChart = ({ 
  symbol = 'FXCT/USDT', 
  height = 400,
  onTimeframeChange 
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState('4H');
  
  const timeframes = [
    { label: '1H', value: '1H', interval: 3600000 },
    { label: '4H', value: '4H', interval: 14400000 },
    { label: '1D', value: '1D', interval: 86400000 },
    { label: '1W', value: '1W', interval: 604800000 }
  ];

  // Generate realistic price data
  const generatePriceData = () => {
    const basePrice = symbol.includes('FXCT') ? 0.2745 : 
                      symbol.includes('FST') ? 1.4520 : 0.1890;
    const labels = [];
    const prices = [];
    const now = new Date();
    const interval = timeframes.find(tf => tf.value === activeTimeframe)?.interval || 14400000;
    
    for (let i = 50; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval));
      
      // Create realistic price movement
      const trend = Math.sin(i * 0.1) * 0.03;
      const volatility = (Math.random() - 0.5) * 0.02;
      const price = basePrice * (1 + trend + volatility);
      
      labels.push(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }));
      prices.push(Number(price.toFixed(6)));
    }
    
    return { labels, prices };
  };

  const chartData = useMemo(() => {
    const { labels, prices } = generatePriceData();
    return {
      labels: labels,
      datasets: [
        {
          label: symbol,
          data: prices,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [symbol, activeTimeframe]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${symbol}: $${context.parsed.y.toFixed(6)}`;
          }
        }
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
        },
      },
      y: {
        position: 'right',
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '$' + value.toFixed(symbol.includes('FXCT') ? 4 : 2);
          }
        },
      },
    },
  };

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

      {/* Chart */}
      <div className="w-full border border-gray-200 rounded-lg p-4 bg-white" style={{ height: `${height}px` }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
        <span>Professional Trading Charts</span>
        <span className="font-medium">{symbol}</span>
      </div>
    </div>
  );
};

export default TradingChart;
