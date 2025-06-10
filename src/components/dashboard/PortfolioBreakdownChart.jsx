import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PortfolioBreakdownChart() {
  const data = {
    labels: ['Houston Duplex', 'Miami STR', 'Chicago Mixed-Use', 'Dallas Office'],
    datasets: [
      {
        label: 'Investment ($)',
        data: [15000, 12000, 8000, 5000],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '💼 Portfolio Breakdown: Investment by Property',
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <Bar data={data} options={options} />
    </div>
  );
}
