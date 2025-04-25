import axios from 'axios';

const API_BASE_URL = 'https://allinweb3.com';
const OKLINK_API_URL = 'https://www.oklink.com/api/v5';

const OKLINK_HEADERS = {
  'Ok-Access-Key': '001a0e3f-483c-4396-a281-79820a6ba937',
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 10000; // 10 second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string,
  options: any,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
) => {
  try {
    const response = await axios(url, options);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 429 && retries > 0) {
      await sleep(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export interface NewsItem {
  create_time: string;
  id: number;
  title: string;
  content: string;
}

export interface PriceData {
  marketCap: number;
  high24h: string;
  totalSupply: string;
  volume24h: number;
  name: string;
  id: number;
  maxSupply: string;
  low24h: string;
  circulatingSupply: string;
  lastPrice: string;
}

export interface HashRateData {
  chainFullName: string;
  chainShortName: string;
  symbol: string;
  hashRate: string;
  hashRateChange24h: string;
}

export interface BlockchainInfo {
  chainFullName: string;
  chainShortName: string;
  symbol: string;
  rank: string;
  mineable: boolean;
  algorithm: string;
  consensus: string;
  diffEstimation: string;
  currentDiff: string;
  diffAdjustTime: string;
  circulatingSupply: string;
  totalSupply: string;
  tps: string;
  lastHeight: string;
  lastBlockTime: string;
  issueDate: string;
}

export interface Transaction {
  txid: string;
  blockHash: string;
  height: string;
  transactionTime: string;
  input: string;
  output: string;
  isInputContract: boolean;
  isOutputContract: boolean;
  amount: string;
  transactionSymbol: string;
  txfee: string;
  methodId: string;
  transactionType: string;
  state: string;
}

export interface TransactionResponse {
  page: string;
  limit: string;
  totalPage: string;
  chainFullName: string;
  chainShortName: string;
  transactionList: Transaction[];
}

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: {
    error: null | string;
  };
}

export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllNews`);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching news:', error.message);
    }
    return [];
  }
};

export const getAllPrices = async (): Promise<PriceData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllPrice`);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching prices:', error.message);
    }
    return [];
  }
};

export const getHashRate = async (): Promise<HashRateData[]> => {
  try {
    const response = await fetchWithRetry(
      `${OKLINK_API_URL}/explorer/blockchain/hashes?chainShortName=btc`,
      { headers: OKLINK_HEADERS }
    );
    return response.data.data || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching hash rate:', error.message);
    }
    return [];
  }
};

export const getBlockchainInfo = async (): Promise<BlockchainInfo[]> => {
  try {
    await sleep(500); // Add delay between requests
    const response = await fetchWithRetry(
      `${OKLINK_API_URL}/explorer/blockchain/info?chainShortName=btc`,
      { headers: OKLINK_HEADERS }
    );
    return response.data.data || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching blockchain info:', error.message);
    }
    return [];
  }
};

export const getLargeTransactions = async (
  chain: string
): Promise<TransactionResponse[]> => {
  try {
    await sleep(1000); // Add delay between requests
    const response = await fetchWithRetry(
      `${OKLINK_API_URL}/explorer/transaction/large-transaction-list?chainShortName=${chain}&limit=5`,
      { headers: OKLINK_HEADERS }
    );
    return response.data.data || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching ${chain} transactions:`, error.message);
    }
    return [];
  }
};

export const getFearGreedIndex = async (): Promise<FearGreedResponse> => {
  try {
    const response = await axios.get(
      'https://api.alternative.me/fng/?limit=10'
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching fear and greed index:', error.message);
    }
    return {
      name: '',
      data: [],
      metadata: { error: null },
    };
  }
};
