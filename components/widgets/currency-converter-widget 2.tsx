"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowUpDown, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Globe,
  Calculator,
  History,
  Star,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrencyConverter, useCurrencyConversion, useCurrencyHistory } from '@/hooks/use-currency-converter';
import { WidgetWrapper } from './WidgetWrapper';
import { SponsorshipBanner } from './sponsorship-banner';

interface CurrencyConverterWidgetProps {
  theme?: 'primary' | 'nightlife';
  className?: string;
}

export function CurrencyConverterWidget({ theme = 'primary', className }: CurrencyConverterWidgetProps) {
  const { currencies, rates, settings, loading: initialLoading, error: initialError, refreshRates } = useCurrencyConverter();
  const { result, loading: converting, error: convertError, convert, clearResult } = useCurrencyConversion();
  const { history, loading: historyLoading, error: historyError, fetchHistory, clearHistory } = useCurrencyHistory();
  
  const [fromCurrency, setFromCurrency] = useState('THB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('100');
  const [showHistory, setShowHistory] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isPrimary = theme === 'primary';

  // Initialize with settings
  useEffect(() => {
    if (settings) {
      setFromCurrency(settings.defaultFromCurrency);
      setToCurrency(settings.defaultToCurrency);
    }
  }, [settings]);

  // Update last updated timestamp when rates change
  useEffect(() => {
    if (rates?.timestamp) {
      setLastUpdated(new Date(rates.timestamp));
    }
  }, [rates]);

  const handleConvert = useCallback(async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    await convert(fromCurrency, toCurrency, numAmount);
  }, [fromCurrency, toCurrency, amount, convert]);

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    clearResult();
  }, [fromCurrency, toCurrency, clearResult]);

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value);
    clearResult();
  }, [clearResult]);

  const handleCurrencyChange = useCallback((field: 'from' | 'to', value: string) => {
    if (field === 'from') {
      setFromCurrency(value);
    } else {
      setToCurrency(value);
    }
    clearResult();
  }, []);

  const handleShowHistory = useCallback(async () => {
    if (!showHistory) {
      await fetchHistory(toCurrency, 7);
    }
    setShowHistory(!showHistory);
  }, [showHistory, toCurrency, fetchHistory]);

  const formatCurrency = (value: number, currency: string) => {
    const currencyInfo = currencies.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(value);
  };

  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code);
  };

  const getRateChange = () => {
    if (!history?.history || history.history.length < 2) return null;
    
    const current = history.history[history.history.length - 1];
    const previous = history.history[history.history.length - 2];
    
    const change = current.rate - previous.rate;
    const changePercent = (change / previous.rate) * 100;
    
    return {
      change,
      changePercent,
      isPositive: change > 0
    };
  };

  const rateChange = getRateChange();

  if (initialError) {
    return (
      <WidgetWrapper widgetId="currency-converter" className={className}>
        <Card className={`h-full ${isPrimary ? 'bg-white' : 'bg-gray-900 border-gray-700'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className={`text-sm ${isPrimary ? 'text-gray-600' : 'text-gray-400'}`}>
                  Failed to load currency converter
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshRates}
                  className="mt-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper widgetId="currency-converter" className={className}>
      <Card className={`h-full ${isPrimary ? 'bg-white' : 'bg-gray-900 border-gray-700'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isPrimary ? 'text-gray-900' : 'text-white'}`}>
              <Calculator className="w-5 h-5" />
              Currency Converter
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {lastUpdated.toLocaleTimeString()}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshRates}
                disabled={initialLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`w-4 h-4 ${initialLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Sponsorship Banner */}
          {settings?.sponsoredEnabled && settings?.sponsorName && (
            <SponsorshipBanner
              sponsorName={settings.sponsorName}
              sponsorLogo={settings.sponsorLogo}
              theme={theme}
            />
          )}

          {/* Conversion Form */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isPrimary ? 'text-gray-700' : 'text-gray-300'}`}>
                Amount
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount"
                className={isPrimary ? 'bg-white' : 'bg-gray-800 border-gray-600 text-white'}
                min="0"
                step="0.01"
              />
            </div>

            {/* From Currency */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isPrimary ? 'text-gray-700' : 'text-gray-300'}`}>
                From
              </label>
              <Select value={fromCurrency} onValueChange={(value) => handleCurrencyChange('from', value)}>
                <SelectTrigger className={isPrimary ? 'bg-white' : 'bg-gray-800 border-gray-600 text-white'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-gray-500">- {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapCurrencies}
                className="rounded-full w-10 h-10 p-0"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isPrimary ? 'text-gray-700' : 'text-gray-300'}`}>
                To
              </label>
              <Select value={toCurrency} onValueChange={(value) => handleCurrencyChange('to', value)}>
                <SelectTrigger className={isPrimary ? 'bg-white' : 'bg-gray-800 border-gray-600 text-white'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-gray-500">- {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={converting || !amount || parseFloat(amount) <= 0}
              className="w-full"
            >
              {converting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Convert
                </>
              )}
            </Button>
          </div>

          {/* Conversion Result */}
          {result && (
            <div className="space-y-3">
              <Separator />
              <div className={`p-4 rounded-lg ${isPrimary ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isPrimary ? 'text-blue-900' : 'text-blue-100'}`}>
                    {formatCurrency(result.to.amount, result.to.currency)}
                  </div>
                  <div className={`text-sm ${isPrimary ? 'text-blue-700' : 'text-blue-300'}`}>
                    {formatCurrency(result.from.amount, result.from.currency)} = {formatCurrency(result.to.amount, result.to.currency)}
                  </div>
                  <div className={`text-xs mt-1 ${isPrimary ? 'text-gray-600' : 'text-gray-400'}`}>
                    Rate: 1 {result.from.currency} = {result.rate.toFixed(4)} {result.to.currency}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {convertError && (
            <div className={`p-3 rounded-lg ${isPrimary ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-800'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className={`text-sm ${isPrimary ? 'text-red-700' : 'text-red-300'}`}>
                  {convertError}
                </span>
              </div>
            </div>
          )}

          {/* Rate Information */}
          {rates && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isPrimary ? 'text-gray-600' : 'text-gray-400'}`}>
                  Exchange Rate
                </span>
                <div className="flex items-center gap-2">
                  {rateChange && (
                    <div className="flex items-center gap-1">
                      {rateChange.isPositive ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${rateChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {rateChange.changePercent > 0 ? '+' : ''}{rateChange.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <History className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Exchange Rate History</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {historyLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          </div>
                        ) : history ? (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                              {toCurrency} vs {history.baseCurrency} (Last 7 days)
                            </div>
                            <div className="space-y-1">
                              {history.history.slice(-5).map((rate, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{new Date(rate.date).toLocaleDateString()}</span>
                                  <span className="font-mono">{rate.rate.toFixed(4)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => fetchHistory(toCurrency, 7)}
                            >
                              Load History
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className={`text-xs ${isPrimary ? 'text-gray-500' : 'text-gray-400'}`}>
                Source: {rates.source === 'fallback' ? 'Cached rates' : 'Live rates'} • Updated: {lastUpdated?.toLocaleString()}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount('100')}
              className="flex-1"
            >
              <Star className="w-3 h-3 mr-1" />
              100
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount('1000')}
              className="flex-1"
            >
              <Star className="w-3 h-3 mr-1" />
              1K
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount('10000')}
              className="flex-1"
            >
              <Star className="w-3 h-3 mr-1" />
              10K
            </Button>
          </div>
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
}
