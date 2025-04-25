import React, { useState, useRef } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  Users,
  Wallet,
  DollarSign,
  BarChart3,
  Share2,
  Download,
} from 'lucide-react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import MarketStats from '../components/MarketStats';
import { formatPrice, formatTokenAmount } from '../utils/formatPrice';

interface TokenData {
  mint: string;
  tokenMeta: {
    name: string;
    symbol: string;
    updateAuthority: string;
    mutable: boolean;
  };
  score: number;
  score_normalised: number;
  risks: Array<{
    name: string;
    description: string;
    score: number;
    level: string;
  }>;
  totalMarketLiquidity: number;
  totalHolders: number;
  verification: {
    jup_verified: boolean;
  } | null;
  topHolders: Array<{
    amount: number;
    pct: number;
  }>;
  token: {
    supply: number;
    decimals: number;
  };
  markets: Array<any>;
  price: number;
  tokenProgram: string;
  transferFee?: {
    pct: number;
    maxAmount: number;
    authority: string;
  };
}

const RugCheckPage = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const validateAddress = (address: string) => {
    return /^[A-Za-z0-9]{32,44}$/.test(address);
  };

  const handleCheck = async () => {
    if (!validateAddress(address)) {
      setError('Invalid Solana address format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.rugcheck.xyz/v1/tokens/${address}/report`
      );

      if (!response.data || !response.data.tokenMeta) {
        throw new Error('Invalid response format');
      }

      const processedData: TokenData = {
        ...response.data,
        verification: response.data.verification || { jup_verified: false },
        risks: response.data.risks || [],
        topHolders: response.data.topHolders || [],
        totalMarketLiquidity: response.data.totalMarketLiquidity || 0,
        totalHolders: response.data.totalHolders || 0,
        score: response.data.score || 0,
        score_normalised: response.data.score_normalised || 0,
      };

      setTokenData(processedData);
    } catch (err) {
      setError('Failed to fetch token data. Please try again.');
      console.error('Error fetching token data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!resultRef.current) return;

    try {
      const scale = 1.5;
      const dataUrl = await toPng(resultRef.current, {
        quality: 0.85,
        backgroundColor: '#111827',
        width: resultRef.current.offsetWidth * scale,
        height: resultRef.current.offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${resultRef.current.offsetWidth}px`,
          height: `${resultRef.current.offsetHeight}px`,
        },
        skipAutoScale: true,
        pixelRatio: 1.5,
        fontEmbedCSS: '',
        filter: (node) => {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK' || 
              node.tagName === 'SCRIPT' || node.tagName === 'META') {
            return false;
          }
          return true;
        },
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `rugcheck-${
        tokenData?.tokenMeta.symbol.toLowerCase() || 'result'
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current || !tokenData) return;

    try {
      const scale = 1.5;
      const dataUrl = await toPng(resultRef.current, {
        quality: 0.85,
        backgroundColor: '#111827',
        width: resultRef.current.offsetWidth * scale,
        height: resultRef.current.offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${resultRef.current.offsetWidth}px`,
          height: `${resultRef.current.offsetHeight}px`,
        },
        skipAutoScale: true,
        pixelRatio: 1.5,
        fontEmbedCSS: '',
        filter: (node) => {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK' || 
              node.tagName === 'SCRIPT' || node.tagName === 'META') {
            return false;
          }
          return true;
        },
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [800, 1200],
        compress: true,
      });

      pdf.addImage(dataUrl, 'PNG', 20, 20, 760, 1160, undefined, 'FAST');

      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(12);
      pdf.text('Generated by AllInWeb3.com', 20, 1190);

      pdf.save(`rugcheck-${tokenData.tokenMeta.symbol.toLowerCase()}.pdf`, {
        compress: true
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'warn':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'info':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const isVerified = tokenData?.verification?.jup_verified ?? false;

  const formatSupply = (supply: number, decimals: number) => {
    return (supply / Math.pow(10, decimals)).toLocaleString();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
            <p className="text-yellow-500 text-sm flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Security check results are based on on-chain data analysis and are for reference only. This does not mean the data is 100% accurate. Always do your own research and understand the risks involved.
            </p>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Solana Token RugCheck</h1>
          <p className="mt-2 text-base text-gray-400">
            Check the safety and reliability of any Solana token
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter token address..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading || !address}
              className="bg-primary-500 text-white rounded-lg px-6 py-2 hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Check
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {tokenData && (
          <>
            <div ref={resultRef} className="space-y-6">
              {/* Token Overview */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {tokenData.tokenMeta.name} ({tokenData.tokenMeta.symbol})
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {tokenData.mint}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">
                      Safety Score
                    </div>
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        tokenData.score_normalised
                      )}`}
                    >
                      {tokenData.score_normalised}/10
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Total Liquidity</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      ${tokenData.totalMarketLiquidity.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Users className="w-5 h-5" />
                      <span>Total Holders</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {tokenData.totalHolders.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Shield className="w-5 h-5" />
                      <span>Jupiter Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      )}
                      <span
                        className={
                          isVerified ? 'text-green-400' : 'text-yellow-400'
                        }
                      >
                        {isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Token Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Total Supply</div>
                    <div className="text-lg font-bold text-white">
                      {formatSupply(
                        tokenData.token.supply,
                        tokenData.token.decimals
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Price</div>
                    <div className="text-lg font-bold text-white">
                      {formatPrice(tokenData.price)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  Risk Analysis
                </h3>
                <div className="space-y-4">
                  {tokenData.risks.length > 0 ? (
                    tokenData.risks.map((risk, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 bg-opacity-50 rounded-lg p-4 flex items-start gap-4"
                      >
                        <div
                          className={`p-2 rounded-lg ${getRiskLevelColor(
                            risk.level
                          )}`}
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {risk.name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {risk.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-4">
                      No risks detected
                    </div>
                  )}
                </div>
              </div>

              {/* Top Holders */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  Top Holders Distribution
                </h3>
                <div className="space-y-3">
                  {tokenData.topHolders.slice(0, 5).map((holder, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 text-gray-400">#{index + 1}</div>
                      <div className="flex-1 bg-gray-700 rounded-lg h-2">
                        <div
                          className="bg-primary-500 rounded-lg h-2"
                          style={{ width: `${holder.pct}%` }}
                        />
                      </div>
                      <div className="w-24 text-right text-gray-400">
                        {holder.pct.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Statistics */}
              <MarketStats markets={tokenData.markets} />

              {/* Token Details */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  Token Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Token Program</div>
                    <div className="text-white break-all">
                      {tokenData.tokenProgram}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">
                      Update Authority
                    </div>
                    <div className="text-white break-all">
                      {tokenData.tokenMeta.updateAuthority || 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Decimals</div>
                    <div className="text-white">{tokenData.token.decimals}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">
                      Metadata Mutable
                    </div>
                    <div className="text-white">
                      {tokenData.tokenMeta.mutable ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Fee Info */}
              {tokenData.transferFee && (
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Transfer Fee
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Percentage</div>
                      <div className="text-white">
                        {tokenData.transferFee.pct}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">
                        Maximum Amount
                      </div>
                      <div className="text-white">
                        {formatTokenAmount(
                          tokenData.transferFee.maxAmount,
                          tokenData.token.decimals
                        )}
                      </div>
                    </div>
                    {tokenData.transferFee.authority !==
                      '11111111111111111111111111111111' && (
                      <div className="col-span-2">
                        <div className="text-sm text-gray-400">Authority</div>
                        <div className="text-white break-all">
                          {tokenData.transferFee.authority}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Watermark */}
              <div className="text-center text-gray-500 text-sm py-4">
                Generated by AllInWeb3.com
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share as Image
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RugCheckPage;