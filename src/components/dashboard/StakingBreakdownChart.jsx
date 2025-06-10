import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StakingBreakdownChart() {
  const data = {
    labels: ['Staked FCT', 'Unstaked FCT'],
    datasets: [
      {
        data: [5000, 7000], // Adjust with real values if needed
        backgroundColor: ['#3B82F6', '#E5E7EB'],
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: '📥 FCT Staking Breakdown',
        font: { size: 18 },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <Doughnut data={data} options={options} />
      <div className="mt-4 text-sm text-center">
        <p><strong>Claimable Rewards:</strong> 120 FCT</p>
        <p><strong>APY:</strong> 6%</p>
      </div>
    </div>
  );
}
