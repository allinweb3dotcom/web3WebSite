import React, { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
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
import { getAllPrices, PriceData } from '../services/api';
import { useNumberAnimation } from '../hooks/useNumberAnimation';

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

interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  decimals?: number;
  className?: string;
  isIncreased?: boolean;
  isDecreased?: boolean;
}

const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  value,
  prefix = '$',
  decimals = 2,
  className = '',
  isIncreased,
  isDecreased,
}) => {
  const { value: animatedValue } = useNumberAnimation(value, 800);

  return (
    <span
      className={`
        ${className} 
        transition-all duration-300
        ${isIncreased ? 'text-green-400 scale-110' : ''}
        ${isDecreased ? 'text-red-400 scale-90' : ''}
      `}
    >
      {prefix}
      {animatedValue.toFixed(decimals)}
    </span>
  );
};

const DataDashboard = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});
  const [priceChanges, setPriceChanges] = useState<
    Record<string, { increased: boolean; decreased: boolean }>
  >({});

  const fetchPrices = useCallback(async () => {
    try {
      const data = await getAllPrices();
      const filteredData = data
        .filter((coin) => coin.name !== 'SUI')
        .slice(0, 10);

      // Calculate price changes
      const newPriceChanges: Record<
        string,
        { increased: boolean; decreased: boolean }
      > = {};
      filteredData.forEach((coin) => {
        const currentPrice = parseFloat(coin.lastPrice);
        const prevPrice = prevPrices[coin.name];

        if (prevPrice) {
          newPriceChanges[coin.name] = {
            increased: currentPrice > prevPrice,
            decreased: currentPrice < prevPrice,
          };
        }
      });

      // Store current prices for next comparison
      const newPrevPrices: Record<string, number> = {};
      filteredData.forEach((coin) => {
        newPrevPrices[coin.name] = parseFloat(coin.lastPrice);
      });

      setPrices(filteredData);
      setPrevPrices(newPrevPrices);
      setPriceChanges(newPriceChanges);

      // Reset animation states after animation duration
      setTimeout(() => {
        setPriceChanges({});
      }, 10000);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  }, [prevPrices]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const calculatePriceChange = (high: string, low: string) => {
    const highValue = parseFloat(high);
    const lowValue = parseFloat(low);
    const change = ((highValue - lowValue) / lowValue) * 100;
    return change.toFixed(2);
  };

  const chartData = {
    labels: prices.map((coin) => coin.name),
    datasets: [
      {
        label: 'Market Cap',
        data: prices.map((coin) => coin.marketCap / 1e9), // Convert to billions
        borderColor: 'rgba(255, 107, 107, 1)',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(255, 107, 107, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
      {
        label: '24h Volume',
        data: prices.map((coin) => coin.volume24h / 1e9), // Convert to billions
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value: number) => `$${value.toFixed(0)}B`,
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
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Space Grotesk', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.dataset.label}: $${value.toFixed(2)}B`;
          },
        },
      },
    },
  };

  return (
    <div className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl gradient-text">
            Live Market Data
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Real-time insights from across the blockchain ecosystem
          </p>
        </div>

        {/* <div className="mt-10 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Market Overview</h3>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div> */}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {prices.map((coin) => {
            const priceChange = calculatePriceChange(coin.high24h, coin.low24h);
            const isPositive = !priceChange.startsWith('-');
            const currentPrice = parseFloat(coin.lastPrice);
            const priceState = priceChanges[coin.name] || {
              increased: false,
              decreased: false,
            };

            return (
              <div
                key={coin.id}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 border border-gray-700 hover:border-primary-500 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-white">
                      {coin.name}
                    </span>
                  </div>
                  <div
                    className={`flex items-center ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span className="ml-1 text-sm">{priceChange}%</span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    <AnimatedPrice
                      value={currentPrice}
                      isIncreased={priceState.increased}
                      isDecreased={priceState.decreased}
                      className="transition-all duration-300"
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <span className="block">24h High</span>
                      <span className="text-white">
                        ${parseFloat(coin.high24h).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="block">24h Low</span>
                      <span className="text-white">
                        ${parseFloat(coin.low24h).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    <span className="block">Market Cap</span>
                    <span className="text-white">
                      {formatNumber(coin.marketCap)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
