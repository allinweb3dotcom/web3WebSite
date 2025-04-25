import React, { useEffect, useState } from 'react';
import { fetchGasFee } from '../services/exchangeService';
import type { GasFeeData } from '../types/api';
import { Zap } from 'lucide-react';

const GasFees = () => {
  const [gasFees, setGasFees] = useState<Record<string, GasFeeData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGasFees = async () => {
      try {
        setLoading(true);
        const [btcFee, ethFee, bscFee] = await Promise.all([
          fetchGasFee('btc'),
          fetchGasFee('eth'),
          fetchGasFee('bsc'),
        ]);

        setGasFees({
          btc: btcFee.data[0],
          eth: ethFee.data[0],
          bsc: bscFee.data[0],
        });
      } catch (error) {
        console.error('Error fetching gas fees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGasFees();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['BTC', 'ETH', 'BSC'].map((chain) => (
          <div
            key={chain}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-center h-[200px]">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderBTCFees = (fee: GasFeeData) => (
    <div className="space-y-3">
      <div>
        <div className="text-sm text-gray-400">Best Transaction Fee (BTC)</div>
        <div className="text-xl font-bold text-white">
          {fee.bestTransactionFee} BTC
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">Best Transaction Fee (Satoshi)</div>
        <div className="text-xl font-bold text-white">
          {fee.bestTransactionFeeSat} sat
        </div>
      </div>
    </div>
  );

  const renderETHFees = (fee: GasFeeData) => (
    <div className="space-y-3">
      <div>
        <div className="text-sm text-gray-400">Recommended Gas Fee</div>
        <div className="text-xl font-bold text-white">
          {fee.recommendedGasPrice} Gwei
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-xs text-gray-400">Est. 15s Confirmation</div>
          <div className="text-sm font-bold text-white">
            {fee.rapidGasPrice} Gwei
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Est. 3min Confirmation</div>
          <div className="text-sm font-bold text-white">
            {fee.standardGasPrice} Gwei
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Est. over 15min Confirmation</div>
          <div className="text-sm font-bold text-white">
            {fee.slowGasPrice} Gwei
          </div>
        </div>
      </div>
    </div>
  );

  const renderBSCFees = (fee: GasFeeData) => (
    <div className="space-y-3">
      <div>
        <div className="text-sm text-gray-400">Standard Gas Fee</div>
        <div className="text-xl font-bold text-white">
          {parseFloat(fee.standardGasPrice).toFixed(8)} Gwei
        </div>
      </div>
      <div className="text-sm text-gray-400">
        Estimated confirmation within 3 minutes
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Object.entries(gasFees).map(([chain, fee]) => (
        <div
          key={chain}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700 min-h-[200px]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-primary-400" />
              <span className="ml-2 font-medium text-white">
                {fee.chainFullName} Gas
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {chain.toUpperCase()}
            </span>
          </div>
          
          {chain === 'btc' && renderBTCFees(fee)}
          {chain === 'eth' && renderETHFees(fee)}
          {chain === 'bsc' && renderBSCFees(fee)}
        </div>
      ))}
    </div>
  );
};

export default GasFees;