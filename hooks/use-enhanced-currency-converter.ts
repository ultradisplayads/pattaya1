'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  enhancedCurrencyApi, 
  EnhancedCurrency, 
  ExchangeRates, 
  ConversionResult, 
  HistoricalData, 
  CurrencyConverterSettings,
  TrendingCurrency,
  CurrencyListResponse
} from '@/lib/enhanced-currency-api';

export function useEnhancedCurrencyConverter() {
  const [currencies, setCurrencies] = useState<EnhancedCurrency[]>([]);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [settings, setSettings] = useState<CurrencyConverterSettings | null>(null);
  const [trending, setTrending] = useState<TrendingCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencies = useCallback(async (options?: {
    search?: string;
    region?: string;
    popular?: boolean;
  }) => {
    try {
      const data = await enhancedCurrencyApi.getCurrencies(options);
      setCurrencies(data.currencies);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch currencies');
      console.error('Failed to fetch currencies:', err);
      return null;
    }
  }, []);

  const fetchRates = useCallback(async () => {
    try {
      const data = await enhancedCurrencyApi.getRates();
      setRates(data);
      if (data.trending) {
        setTrending(data.trending);
      }
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exchange rates');
      console.error('Failed to fetch exchange rates:', err);
      return null;
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const data = await enhancedCurrencyApi.getTrending();
      setTrending(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trending currencies');
      console.error('Failed to fetch trending currencies:', err);
      return null;
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await enhancedCurrencyApi.getSettings();
      setSettings(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
      console.error('Failed to fetch settings:', err);
      return null;
    }
  }, []);

  const convertCurrency = useCallback(async (from: string, to: string, amount: number): Promise<ConversionResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await enhancedCurrencyApi.convert(from, to, amount);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to convert currency');
      console.error('Failed to convert currency:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistoricalData = useCallback(async (currency: string, days: number = 7): Promise<HistoricalData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await enhancedCurrencyApi.getHistory(currency, days);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch historical data');
      console.error('Failed to fetch historical data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCurrencies = useCallback(async (query: string): Promise<EnhancedCurrency[]> => {
    try {
      const results = await enhancedCurrencyApi.searchCurrencies(query);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search currencies');
      console.error('Failed to search currencies:', err);
      return [];
    }
  }, []);

  const getCurrenciesByRegion = useCallback(async (region: string): Promise<EnhancedCurrency[]> => {
    try {
      const results = await enhancedCurrencyApi.getCurrenciesByRegion(region);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch currencies by region');
      console.error('Failed to fetch currencies by region:', err);
      return [];
    }
  }, []);

  const getPopularCurrencies = useCallback(async (): Promise<EnhancedCurrency[]> => {
    try {
      const results = await enhancedCurrencyApi.getPopularCurrencies();
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch popular currencies');
      console.error('Failed to fetch popular currencies:', err);
      return [];
    }
  }, []);

  const refreshRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchRates();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh rates');
    } finally {
      setLoading(false);
    }
  }, [fetchRates]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchCurrencies(),
          fetchRates(),
          fetchSettings(),
          fetchTrending()
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize currency converter');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchCurrencies, fetchRates, fetchSettings, fetchTrending]);

  // Auto-refresh rates based on settings
  useEffect(() => {
    if (!settings?.updateFrequencyMinutes || !rates) return;

    const interval = setInterval(() => {
      fetchRates();
    }, settings.updateFrequencyMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [settings?.updateFrequencyMinutes, rates, fetchRates]);

  return {
    currencies,
    rates,
    settings,
    trending,
    loading,
    error,
    convertCurrency,
    getHistoricalData,
    refreshRates,
    fetchCurrencies,
    fetchRates,
    fetchSettings,
    fetchTrending,
    searchCurrencies,
    getCurrenciesByRegion,
    getPopularCurrencies
  };
}

export function useEnhancedCurrencyConversion() {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (from: string, to: string, amount: number) => {
    if (!from || !to || !amount || amount <= 0) {
      setError('Invalid conversion parameters');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const conversionResult = await enhancedCurrencyApi.convert(from, to, amount);
      setResult(conversionResult);
      return conversionResult;
    } catch (err: any) {
      setError(err.message || 'Failed to convert currency');
      console.error('Failed to convert currency:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    convert,
    clearResult
  };
}

export function useEnhancedCurrencyHistory() {
  const [history, setHistory] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (currency: string, days: number = 7) => {
    if (!currency) {
      setError('Currency is required');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const historicalData = await enhancedCurrencyApi.getHistory(currency, days);
      setHistory(historicalData);
      return historicalData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch historical data');
      console.error('Failed to fetch historical data:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory(null);
    setError(null);
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
    clearHistory
  };
}

export function useCurrencySearch() {
  const [searchResults, setSearchResults] = useState<EnhancedCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await enhancedCurrencyApi.searchCurrencies(query);
      setSearchResults(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search currencies');
      console.error('Failed to search currencies:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    search,
    clearSearch
  };
}
