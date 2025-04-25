import React from 'react';
import { formatPrice } from '../utils/formatPrice';

interface Market {
  pubkey: string;
  marketType: string;
  lp: {
    quoteUSD: number;
    baseUSD: number;
    lpLockedUSD: number;
  };
}

interface MarketStatsProps {
  markets: Market[];
}

const MarketStats: React.FC<MarketStatsProps> = ({ markets }) => {
  const totalLiquidity = markets.reduce((sum, market) => sum + market.lp.quoteUSD + market.lp.baseUSD, 0);
  const totalLocked = markets.reduce((sum, market) => sum + market.lp.lpLockedUSD, 0);
  
  const marketsByType = markets.reduce((acc, market) => {
    const type = market.marketType.replace(/_/g, ' ').toUpperCase();
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        liquidity: 0,
        locked: 0
      };
    }
    acc[type].count++;
    acc[type].liquidity += market.lp.quoteUSD + market.lp.baseUSD;
    acc[type].locked += market.lp.lpLockedUSD;
    return acc;
  }, {} as Record<string, { count: number; liquidity: number; locked: number; }>);

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Market Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
          <div className="text-sm text-gray-400">Total Liquidity</div>
          <div className="text-lg font-bold text-white">
            ${totalLiquidity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
          <div className="text-sm text-gray-400">Total Locked Value</div>
          <div className="text-lg font-bold text-white">
            ${totalLocked.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(marketsByType).map(([type, stats]) => (
          <div key={type} className="bg-gray-700 bg-opacity-30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{type}</span>
              <span className="text-gray-400 text-sm">{stats.count} pool{stats.count !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Liquidity</div>
                <div className="text-white">${stats.liquidity.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-gray-400">Locked</div>
                <div className="text-white">${stats.locked.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketStats;