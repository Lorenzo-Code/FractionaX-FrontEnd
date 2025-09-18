import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
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
  Legend,
  BarElement
);

const SimpleTradingChart = ({ symbol = 'FXCT/USDT', height = 400 }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('4H');
  
  // Generate sample price data
  const generateSampleData = () => {
    const basePrice = symbol.includes('FXCT') ? 0.2745 : 
                      symbol.includes('FST') ? 1.4520 : 0.1890;
    const labels = [];
    const prices = [];
    const now = new Date();
    
    for (let i = 50; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 3600 * 1000)); // hourly data
      const price = basePrice * (1 + Math.sin(i * 0.1) * 0.05 + (Math.random() - 0.5) * 0.02);
      
      labels.push(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }));
      prices.push(Number(price.toFixed(4)));
    }
    
    return { labels, prices };
  };

  const timeframes = [
    { label: '1H', value: '1H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' }
  ];

  const { labels, prices } = generateSampleData();

  const chartData = {
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${symbol}: $${context.parsed.y.toFixed(4)}`;
          }
        }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '$' + value.toFixed(4);
          }
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className="w-full">
      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2 mb-4">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => setActiveTimeframe(timeframe.value)}
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
      <div className="w-full border border-gray-200 rounded-lg p-4" style={{ height: `${height}px` }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <p className="text-sm text-gray-500 mt-2 text-center">
        {symbol} • Powered by Chart.js
      </p>
    </div>
  );
};

export default SimpleTradingChart;
