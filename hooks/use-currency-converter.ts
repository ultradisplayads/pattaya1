'use client';

import { useState, useEffect, useCallback } from 'react';
import { currencyApi, Currency, ExchangeRates, ConversionResult, HistoricalData, CurrencyConverterSettings } from '@/lib/currency-api';

export function useCurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [settings, setSettings] = useState<CurrencyConverterSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      const data = await currencyApi.getCurrencies();
      setCurrencies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch currencies');
      console.error('Failed to fetch currencies:', err);
    }
  }, []);

  const fetchRates = useCallback(async () => {
    try {
      const data = await currencyApi.getRates();
      setRates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exchange rates');
      console.error('Failed to fetch exchange rates:', err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await currencyApi.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
      console.error('Failed to fetch settings:', err);
    }
  }, []);

  const convertCurrency = useCallback(async (from: string, to: string, amount: number): Promise<ConversionResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await currencyApi.convert(from, to, amount);
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
      const data = await currencyApi.getHistory(currency, days);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch historical data');
      console.error('Failed to fetch historical data:', err);
      return null;
    } finally {
      setLoading(false);
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
          fetchSettings()
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize currency converter');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchCurrencies, fetchRates, fetchSettings]);

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
    loading,
    error,
    convertCurrency,
    getHistoricalData,
    refreshRates,
    fetchCurrencies,
    fetchRates,
    fetchSettings
  };
}

export function useCurrencyConversion() {
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
      const conversionResult = await currencyApi.convert(from, to, amount);
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

export function useCurrencyHistory() {
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
      const historicalData = await currencyApi.getHistory(currency, days);
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
