import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { FearGreedData } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FearGreedChartProps {
  data: FearGreedData[];
}

const FearGreedChart: React.FC<FearGreedChartProps> = ({ data }) => {
  const chartData = {
    labels: data
      .map((item) =>
        new Date(parseInt(item.timestamp) * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      )
      .reverse(),
    datasets: [
      {
        label: 'Fear & Greed Index',
        data: data.map((item) => parseInt(item.value)).reverse(),
        fill: true,
        borderColor: 'rgba(255, 107, 107, 1)',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(255, 107, 107, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(255, 107, 107, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value: number) => {
            if (value <= 25) return 'Extreme Fear';
            if (value <= 45) return 'Fear';
            if (value <= 55) return 'Neutral';
            if (value <= 75) return 'Greed';
            return 'Extreme Greed';
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            let classification = '';
            if (value <= 25) classification = 'Extreme Fear';
            else if (value <= 45) classification = 'Fear';
            else if (value <= 55) classification = 'Neutral';
            else if (value <= 75) classification = 'Greed';
            else classification = 'Extreme Greed';
            return `Value: ${value} (${classification})`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Fear & Greed Index</h3>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
        <div className="text-red-400">
          0-25
          <br />
          Extreme Fear
        </div>
        <div className="text-orange-400">
          26-45
          <br />
          Fear
        </div>
        <div className="text-yellow-400">
          46-55
          <br />
          Neutral
        </div>
        <div className="text-green-400">
          56-75
          <br />
          Greed
        </div>
        <div className="text-emerald-400">
          76-100
          <br />
          Extreme Greed
        </div>
      </div>
    </div>
  );
};

export default FearGreedChart;
