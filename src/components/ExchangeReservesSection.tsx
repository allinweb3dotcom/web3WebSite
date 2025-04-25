import React, { useState } from 'react';
import ExchangeReserves from './ExchangeReserves';

const ExchangeReservesSection = () => {
  const [selectedExchange, setSelectedExchange] = useState('Binance');

  const exchanges = [
    'Binance',
    'OKX',
    'Bitget',
    'KuCoin',
    'Crypto.com',
    'Bybit',
    'Deribit',
    'Bitfinex',
    'Gate.io'
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Real-time Exchange Reserves</h3>
        <div className="flex flex-wrap gap-2">
          {exchanges.map((exchange) => (
            <button
              key={exchange}
              onClick={() => setSelectedExchange(exchange)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedExchange === exchange
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {exchange}
            </button>
          ))}
        </div>
      </div>
      <ExchangeReserves selectedExchange={selectedExchange} />
    </div>
  );
};

export default ExchangeReservesSection;