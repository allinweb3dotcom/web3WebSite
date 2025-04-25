export interface BalanceDetail {
  symbol: string;
  balance: string;
  balanceUsd: string;
  change: string;
}

export interface ExchangeData {
  institutionName: string;
  totalBalance: string;
  balanceDetails: BalanceDetail[];
}

export interface ExchangeResponse {
  code: string;
  msg: string;
  data: ExchangeData[];
}

export interface GasFeeData {
  chainFullName: string;
  chainShortName: string;
  symbol: string;
  bestTransactionFee: string;
  bestTransactionFeeSat: string;
  recommendedGasPrice: string;
  rapidGasPrice: string;
  standardGasPrice: string;
  slowGasPrice: string;
  baseFee: string;
  gasUsedRatio: string;
}

export interface GasFeeResponse {
  code: string;
  msg: string;
  data: GasFeeData[];
}