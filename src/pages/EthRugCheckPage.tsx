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
  Lock,
  Unlock,
  Code,
  FileCode,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface TokenInfo {
  name: string;
  symbol: string;
  icon_url: string;
  holder_count: number;
  total_supply: string;
}

interface TokenSecurity {
  is_open_source: string;
  is_proxy: string;
  is_mintable: string;
  owner_address: string;
  can_take_back_ownership: string;
  owner_change_balance: string;
  hidden_owner: string;
  selfdestruct: string;
  external_call: string;
  buy_tax: string;
  sell_tax: string;
  cannot_buy: string;
  cannot_sell_all: string;
  slippage_modifiable: string;
  is_honeypot: string;
  transfer_pausable: string;
  is_blacklisted: string;
  is_whitelisted: string;
  is_in_dex: string;
  anti_whale_modifiable: string;
  trading_cooldown: string;
  personal_slippage_modifiable: string;
  dex: Array<{
    liquidity: string;
    liquidity_type: string;
    name: string;
    pair: string;
  }>;
  holders: Array<{
    address: string;
    balance: string;
    is_contract: number;
    is_locked: number;
    percent: string;
    tag?: string;
  }>;
  token_name: string;
  token_symbol: string;
  holder_count: string;
  total_supply: string;
}

const EthRugCheckPage = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [securityInfo, setSecurityInfo] = useState<TokenSecurity | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleCheck = async () => {
    if (!validateAddress(address)) {
      setError('Invalid Eth address format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [securityResponse, infoResponse] = await Promise.all([
        axios.get(
          `https://preserver.mytokenpocket.vip/v1/token/token_security?address=${address}&ns=ethereum&chain_id=1`
        ),
        axios.get(
          `https://preserver.mytokenpocket.vip/v1/token?blockchain_id=1&bl_symbol=${address}&address=${address}`
        ),
      ]);

      if (securityResponse.data.result === 0) {
        setSecurityInfo(securityResponse.data.data);
      }

      if (infoResponse.data.result === 0) {
        setTokenInfo(infoResponse.data.data);
      }
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
      const scale = 2;
      const dataUrl = await toPng(resultRef.current, {
        quality: 1.0,
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
        pixelRatio: 2,
        fontEmbedCSS: '',
        filter: (node) => {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `Eth-rugcheck-${
        securityInfo?.token_symbol.toLowerCase() || 'result'
      }.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current || !securityInfo) return;

    try {
      const scale = 2;
      const dataUrl = await toPng(resultRef.current, {
        quality: 1.0,
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
        pixelRatio: 2,
        fontEmbedCSS: '',
        filter: (node) => {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
            return false;
          }
          return true;
        },
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [800, 1200],
      });

      pdf.addImage(dataUrl, 'PNG', 20, 20, 760, 1160);

      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(12);
      pdf.text('Generated by AllInWeb3.com', 20, 1190);

      pdf.save(`Eth-rugcheck-${securityInfo.token_symbol.toLowerCase()}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const renderSecurityStatus = (isSecure: boolean, text: string) => (
    <div
      className={`flex items-center gap-2 ${
        isSecure ? 'text-green-400' : 'text-red-400'
      }`}
    >
      {isSecure ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertTriangle className="w-5 h-5" />
      )}
      <span>{text}</span>
    </div>
  );

  const getSecurityScore = (securityInfo: TokenSecurity): number => {
    let score = 0;
    const checks = [
      { condition: securityInfo.is_open_source === '1', weight: 2 },
      { condition: securityInfo.is_proxy === '0', weight: 1 },
      {
        condition:
          securityInfo.owner_address ===
          '0x0000000000000000000000000000000000000000',
        weight: 2,
      },
      { condition: securityInfo.owner_change_balance === '0', weight: 1 },
      { condition: securityInfo.hidden_owner === '0', weight: 1 },
      { condition: securityInfo.can_take_back_ownership === '0', weight: 2 },
      { condition: securityInfo.selfdestruct === '0', weight: 2 },
      { condition: securityInfo.external_call === '0', weight: 1 },
      { condition: securityInfo.is_honeypot === '0', weight: 2 },
      { condition: securityInfo.transfer_pausable === '0', weight: 1 },
    ];

    const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
    const earnedWeight = checks.reduce(
      (sum, check) => sum + (check.condition ? check.weight : 0),
      0
    );

    return (earnedWeight / totalWeight) * 10;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
            <p className="text-yellow-500 text-sm flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Security check results are based on on-chain data analysis and are
              for reference only. This does not mean the data is 100% accurate.
              Always do your own research and understand the risks involved.
            </p>
          </div>
          <h1 className="text-3xl font-bold gradient-text">
            ETH Token RugCheck
          </h1>
          <p className="mt-2 text-base text-gray-400">
            Check the safety and reliability of any ETH token
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Eth token address..."
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

        {securityInfo && (
          <>
            <div ref={resultRef} className="space-y-6">
              {/* Token Overview */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {tokenInfo?.icon_url && (
                      <img
                        src={tokenInfo.icon_url}
                        alt={securityInfo.token_name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {securityInfo.token_name} ({securityInfo.token_symbol})
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">{address}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">
                      Security Score
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        getSecurityScore(securityInfo) >= 8
                          ? 'text-green-400'
                          : getSecurityScore(securityInfo) >= 6
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {getSecurityScore(securityInfo).toFixed(1)}/10
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Total Supply</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {Number(securityInfo.total_supply).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Users className="w-5 h-5" />
                      <span>Holders</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {Number(securityInfo.holder_count).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Shield className="w-5 h-5" />
                      <span>Contract Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {securityInfo.is_honeypot === '0' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      )}
                      <span
                        className={
                          securityInfo.is_honeypot === '0'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {securityInfo.is_honeypot === '0' ? 'Safe' : 'Risky'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract Security Report */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Contract Security Report
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FileCode className="w-5 h-5" />
                          Source Code & Ownership
                        </h4>
                        <div className="space-y-3">
                          {renderSecurityStatus(
                            securityInfo.is_open_source === '1',
                            'Contract is open source'
                          )}
                          {renderSecurityStatus(
                            securityInfo.is_proxy === '0',
                            'No proxy contract'
                          )}
                          {renderSecurityStatus(
                            securityInfo.owner_address ===
                              '0x0000000000000000000000000000000000000000',
                            'Ownership renounced - No minting possible'
                          )}
                          {renderSecurityStatus(
                            securityInfo.owner_change_balance === '0',
                            'Cannot modify balances'
                          )}
                          {renderSecurityStatus(
                            securityInfo.hidden_owner === '0',
                            'No hidden owner'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5" />
                          Security Features
                        </h4>
                        <div className="space-y-3">
                          {renderSecurityStatus(
                            securityInfo.can_take_back_ownership === '0',
                            'Cannot reclaim ownership'
                          )}
                          {renderSecurityStatus(
                            securityInfo.selfdestruct === '0',
                            'No self-destruct function'
                          )}
                          {renderSecurityStatus(
                            securityInfo.external_call === '0',
                            'No external calls'
                          )}
                          {renderSecurityStatus(
                            securityInfo.is_honeypot === '0',
                            'Not a honeypot'
                          )}
                          {renderSecurityStatus(
                            securityInfo.transfer_pausable === '0',
                            'Transfers cannot be paused'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Trading Features
                        </h4>
                        <div className="space-y-3">
                          {renderSecurityStatus(
                            securityInfo.anti_whale_modifiable === '1',
                            'Anti-whale protection enabled'
                          )}
                          {renderSecurityStatus(
                            securityInfo.personal_slippage_modifiable === '0',
                            'No personal slippage modification'
                          )}
                          {renderSecurityStatus(
                            securityInfo.trading_cooldown === '0',
                            'No trading cooldown'
                          )}
                          <div className="flex justify-between items-center text-gray-300">
                            <span>Buy Tax:</span>
                            <span
                              className={
                                Number(securityInfo.buy_tax) > 0
                                  ? 'text-yellow-400'
                                  : 'text-green-400'
                              }
                            >
                              {securityInfo.buy_tax}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-gray-300">
                            <span>Sell Tax:</span>
                            <span
                              className={
                                Number(securityInfo.sell_tax) > 0
                                  ? 'text-yellow-400'
                                  : 'text-green-400'
                              }
                            >
                              {securityInfo.sell_tax}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Trading Status
                        </h4>
                        <div className="space-y-3">
                          {renderSecurityStatus(
                            securityInfo.cannot_buy === '0',
                            'Buying is enabled'
                          )}
                          {renderSecurityStatus(
                            securityInfo.cannot_sell_all === '0',
                            'Selling is enabled'
                          )}
                          {renderSecurityStatus(
                            securityInfo.is_in_dex === '1',
                            'Listed on DEX'
                          )}
                          {renderSecurityStatus(
                            securityInfo.is_blacklisted === '0',
                            'No blacklist'
                          )}
                          {renderSecurityStatus(
                            securityInfo.slippage_modifiable === '0',
                            'Fixed slippage'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DEX Information */}
                {securityInfo.is_in_dex === '1' && securityInfo.dex && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">
                      DEX Liquidity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {securityInfo.dex.map((dex, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 bg-opacity-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {dex.name}
                              </span>
                              <span className="text-sm text-gray-400">
                                ({dex.liquidity_type})
                              </span>
                            </div>
                            <span className="text-white font-medium">
                              $
                              {Number(dex.liquidity).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Pair: {dex.pair}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Holders */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Top Holders
                  </h3>
                  <div className="space-y-3">
                    {securityInfo.holders.slice(0, 10).map((holder, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-8 text-gray-400">#{index + 1}</div>
                        <div className="flex-1 bg-gray-700 rounded-lg h-2">
                          <div
                            className="bg-primary-500 rounded-lg h-2"
                            style={{
                              width: `${Number(holder.percent) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="w-32 text-right">
                          <div className="text-white">
                            {(Number(holder.percent) * 100).toFixed(2)}%
                          </div>
                          <div className="text-gray-400 text-sm">
                            {holder.is_contract === 1 ? 'Contract' : 'Wallet'}
                            {holder.tag && ` - ${holder.tag}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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

export default EthRugCheckPage;
