import axios from 'axios';
import cacheService from './cacheService';
import type { ExchangeResponse, GasFeeResponse } from '../types/api';

const OKLINK_API_URL = 'https://www.oklink.com/api/v5';
const OKLINK_HEADERS = {
  'Ok-Access-Key': '001a0e3f-483c-4396-a281-79820a6ba937',
};

// Rate limiting and retry configuration
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async <T>(
  url: string,
  options: any,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    const response = await axios.get<T>(url, options);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 429 && retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw error;
  }
};

export const fetchExchangeReserves = async (exchange: string): Promise<ExchangeResponse> => {
  const cacheKey = `exchange_reserves_${exchange}`;
  const cachedData = cacheService.get<ExchangeResponse>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetchWithRetry<ExchangeResponse>(
      `${OKLINK_API_URL}/explorer/por/proof-of-reserves?institutionName=${exchange}`,
      { headers: OKLINK_HEADERS }
    );

    if (response.code === '0') {
      // Ensure data is serializable before caching
      const serializableResponse = JSON.parse(JSON.stringify(response));
      cacheService.set(cacheKey, serializableResponse);
      return serializableResponse;
    }

    throw new Error('Failed to fetch exchange data');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching exchange reserves:', error.message);
    }
    throw error;
  }
};

export const fetchGasFee = async (chain: string): Promise<GasFeeResponse> => {
  const cacheKey = `gas_fee_${chain}`;
  const cachedData = cacheService.get<GasFeeResponse>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetchWithRetry<GasFeeResponse>(
      `${OKLINK_API_URL}/explorer/blockchain/fee?chainShortName=${chain}`,
      { headers: OKLINK_HEADERS }
    );

    if (response.code === '0') {
      const responseData: GasFeeResponse = {
        code: response.code,
        msg: response.msg,
        data: response.data.map((item: any) => ({
          chainFullName: String(item.chainFullName || ''),
          chainShortName: String(item.chainShortName || ''),
          symbol: String(item.symbol || ''),
          bestTransactionFee: String(item.bestTransactionFee || ''),
          bestTransactionFeeSat: String(item.bestTransactionFeeSat || ''),
          recommendedGasPrice: String(item.recommendedGasPrice || ''),
          rapidGasPrice: String(item.rapidGasPrice || ''),
          standardGasPrice: String(item.standardGasPrice || ''),
          slowGasPrice: String(item.slowGasPrice || ''),
          baseFee: String(item.baseFee || ''),
          gasUsedRatio: String(item.gasUsedRatio || '')
        }))
      };
      
      // Ensure data is serializable before caching
      const serializableResponse = JSON.parse(JSON.stringify(responseData));
      cacheService.set(cacheKey, serializableResponse);
      return serializableResponse;
    }

    throw new Error('Failed to fetch gas fee data');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching gas fee:', error.message);
    }
    throw error;
  }
};