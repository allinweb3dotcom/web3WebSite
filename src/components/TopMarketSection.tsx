import React, { useState } from 'react';
import BubbleMap from './BubbleMap';

const networks = [
  { id: 'solana', name: 'Solana' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'bsc', name: 'BSC' },
  { id: 'base', name: 'Base' },
];

const TopMarketSection = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('solana');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">24h Top Market</h3>
        <div className="flex space-x-2">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => setSelectedNetwork(network.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedNetwork === network.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {network.name}
            </button>
          ))}
        </div>
      </div>
      <BubbleMap selectedNetwork={selectedNetwork} />
    </div>
  );
};

export default TopMarketSection;