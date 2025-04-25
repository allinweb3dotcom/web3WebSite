import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Cpu,
  Database,
  Boxes,
} from 'lucide-react';
import {
  getHashRate,
  getBlockchainInfo,
  getLargeTransactions,
  getFearGreedIndex,
  getAllPrices,
  HashRateData,
  BlockchainInfo,
  TransactionResponse,
  FearGreedResponse,
  PriceData,
} from '../services/api';
import { formatDate } from '../utils/dateFormatter';
import FearGreedChart from '../components/FearGreedChart';
import { formatTimestampToDate } from '../utils/formatTimestampToDate';
import { Line } from 'react-chartjs-2';
import ExchangeReservesSection from '../components/ExchangeReservesSection';
import GasFees from '../components/GasFees';

const AnalysisPage = () => {
  const [hashRate, setHashRate] = useState<HashRateData[]>([]);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo[]>([]);
  const [btcTransactions, setBtcTransactions] = useState<TransactionResponse[]>([]);
  const [ethTransactions, setEthTransactions] = useState<TransactionResponse[]>([]);
  const [bscTransactions, setBscTransactions] = useState<TransactionResponse[]>([]);
  const [fearGreedData, setFearGreedData] = useState<FearGreedResponse | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    hashRate: true,
    blockchainInfo: true,
    transactions: true,
    fearGreed: true,
    prices: true
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch prices first as they're used in the market overview
      getAllPrices().then(priceData => {
        setPrices(priceData.filter(coin => coin.name !== 'SUI').slice(0, 10));
        setLoadingStates(prev => ({ ...prev, prices: false }));
      }).catch(console.error);

      // Fetch hash rate and blockchain info
      Promise.all([
        getHashRate(),
        getBlockchainInfo()
      ]).then(([hashRateData, blockchainInfoData]) => {
        setHashRate(hashRateData);
        setBlockchainInfo(blockchainInfoData);
        setLoadingStates(prev => ({
          ...prev,
          hashRate: false,
          blockchainInfo: false
        }));
      }).catch(console.error);

      // Fetch transactions in parallel
      Promise.all([
        getLargeTransactions('btc'),
        getLargeTransactions('eth'),
        getLargeTransactions('bsc')
      ]).then(([btcTx, ethTx, bscTx]) => {
        setBtcTransactions(btcTx);
        setEthTransactions(ethTx);
        setBscTransactions(bscTx);
        setLoadingStates(prev => ({ ...prev, transactions: false }));
      }).catch(console.error);

      // Fetch fear and greed index
      getFearGreedIndex().then(fgIndex => {
        setFearGreedData(fgIndex);
        setLoadingStates(prev => ({ ...prev, fearGreed: false }));
      }).catch(console.error);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const marketChartData = {
    labels: prices.map((coin) => coin.name),
    datasets: [
      {
        label: 'Market Cap',
        data: prices.map((coin) => coin.marketCap / 1e9),
        borderColor: 'rgba(255, 107, 107, 1)',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: '24h Volume',
        data: prices.map((coin) => coin.volume24h / 1e9),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const marketChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
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

  const info = blockchainInfo[0];
  const stats = hashRate[0];

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    const addresses = address.split(',');
    if (addresses.length === 1) {
      return address.length > 20
        ? `${address.slice(0, 10)}...${address.slice(-10)}`
        : address;
    }
    return `${addresses[0].slice(0, 10)}...${addresses[0].slice(-10)} (+${
      addresses.length - 1
    } more)`;
  };

  const renderTransactionList = (
    transactions: TransactionResponse[],
    title: string
  ) => {
    if (!transactions.length || !transactions[0].transactionList) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="space-y-4">
          {transactions[0].transactionList.map((tx) => (
            <div
              key={tx.txid}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-400">
                      {formatTimestampToDate(Number(tx.transactionTime))}
                    </span>
                  </div>
                  <div className="group relative">
                    <div className="text-sm text-gray-300 truncate">
                      <span className="text-gray-400">From: </span>
                      <span title={tx.input}>{truncateAddress(tx.input)}</span>
                    </div>
                    <div className="hidden group-hover:block fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-900 rounded-lg shadow-xl z-50 max-w-2xl w-full mx-4 border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">
                          From Address{tx.input.includes(',') ? 'es' : ''}
                        </span>
                        <button
                          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                          onClick={() => navigator.clipboard.writeText(tx.input)}
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-sm text-gray-300 break-all select-text">
                        {tx.input.split(',').map((address, idx) => (
                          <div key={idx} className="mb-1">
                            {address.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="text-sm text-gray-300 truncate">
                      <span className="text-gray-400">To: </span>
                      <span title={tx.output}>{truncateAddress(tx.output)}</span>
                    </div>
                    <div className="hidden group-hover:block fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-900 rounded-lg shadow-xl z-50 max-w-2xl w-full mx-4 border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">
                          To Address{tx.output.includes(',') ? 'es' : ''}
                        </span>
                        <button
                          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                          onClick={() => navigator.clipboard.writeText(tx.output)}
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-sm text-gray-300 break-all select-text">
                        {tx.output.split(',').map((address, idx) => (
                          <div key={idx} className="mb-1">
                            {address.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right flex-shrink-0">
                  <div className="text-lg font-bold text-white">
                    {formatAmount(tx.amount)} {tx.transactionSymbol}
                  </div>
                  <div className="text-sm text-gray-400">Fee: {tx.txfee}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        {/* <h1 className="text-3xl font-bold gradient-text">Blockchain Analysis</h1> */}
        <p className="mt-2 text-base text-gray-400">
          Real-time blockchain statistics and transaction analysis
        </p>
      </div>

      <GasFees />
      <ExchangeReservesSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Market Overview</h3>
          {loadingStates.prices ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="h-[400px]">
              <Line data={marketChartData} options={marketChartOptions} />
            </div>
          )}
        </div>

        {fearGreedData && fearGreedData.data.length > 0 && (
          <div>
            <FearGreedChart data={fearGreedData.data} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: <Activity className="h-8 w-8 text-primary-400" />,
            title: 'Hash Rate',
            value: stats?.hashRate,
            change: stats?.hashRateChange24h,
            loading: loadingStates.hashRate,
          },
          {
            icon: <Cpu className="h-8 w-8 text-primary-400" />,
            title: 'Current Difficulty',
            value: info?.currentDiff,
            loading: loadingStates.blockchainInfo,
          },
          {
            icon: <Database className="h-8 w-8 text-primary-400" />,
            title: 'Block Height',
            value: info?.lastHeight,
            loading: loadingStates.blockchainInfo,
          },
          {
            icon: <Boxes className="h-8 w-8 text-primary-400" />,
            title: 'TPS',
            value: info?.tps,
            loading: loadingStates.blockchainInfo,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {stat.icon}
                <h3 className="ml-2 text-lg font-semibold text-white">
                  {stat.title}
                </h3>
              </div>
              {stat.change && (
                <span
                  className={`flex items-center ${
                    parseFloat(stat.change) >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {parseFloat(stat.change) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="ml-1">
                    {Math.abs(parseFloat(stat.change) * 100).toFixed(2)}%
                  </span>
                </span>
              )}
            </div>
            {stat.loading ? (
              <div className="flex items-center justify-center h-8 mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <p className="mt-4 text-2xl font-bold text-white">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {renderTransactionList(btcTransactions, 'Bitcoin Large Transactions')}
        {renderTransactionList(ethTransactions, 'Ethereum Large Transactions')}
        {renderTransactionList(bscTransactions, 'BSC Large Transactions')}
      </div>
    </div>
  );
};

export default AnalysisPage;