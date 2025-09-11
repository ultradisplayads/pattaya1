"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Heart, 
  Calculator, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Search,
  Star,
  ArrowUpDown,
  Clock,
  Globe,
  Zap,
  Settings,
  Bell,
  Target,
  PiggyBank,
  TrendingDown
} from "lucide-react";
import { WidgetWrapper } from './WidgetWrapper';
import { useEnhancedCurrencyConverter, useEnhancedCurrencyConversion, useEnhancedCurrencyHistory, useCurrencySearch } from '@/hooks/use-enhanced-currency-converter';

// Enhanced currency data with more details
interface EnhancedCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  region: string;
  isPopular?: boolean;
  isCrypto?: boolean;
}

// Conversion result with enhanced data
interface ConversionResult {
  from: {
    currency: string;
    amount: number;
    symbol: string;
  };
  to: {
    currency: string;
    amount: number;
    symbol: string;
  };
  rate: number;
  timestamp: string;
  change24h?: number;
  trend?: 'up' | 'down' | 'stable';
}

// Trending currency with enhanced metrics
interface TrendingCurrency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  rate: number;
  change24h: number;
  trend: 'up' | 'down' | 'stable';
  volume?: number;
  rank: number;
}

interface NewCurrencyConverterWidgetProps {
  onCurrencySelect?: (from: string, to: string) => void;
  showCharts?: boolean;
  compact?: boolean;
  theme?: 'primary' | 'nightlife';
  className?: string;
}

export function NewCurrencyConverterWidget({ 
  onCurrencySelect, 
  showCharts = true, 
  compact = true, 
  theme = 'primary', 
  className 
}: NewCurrencyConverterWidgetProps) {
  // Hooks
  const { currencies, rates, settings, trending, loading: initialLoading, error: initialError, refreshRates, searchCurrencies } = useEnhancedCurrencyConverter();
  const { result, loading: converting, error: convertError, convert, clearResult } = useEnhancedCurrencyConversion();
  const { history, loading: historyLoading, error: historyError, fetchHistory, clearHistory } = useEnhancedCurrencyHistory();
  const { searchResults, loading: searchLoading, search, clearSearch } = useCurrencySearch();
  
  // State
  const [activeTab, setActiveTab] = useState("convert");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("THB");
  const [amount, setAmount] = useState(100);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trendingCurrencies, setTrendingCurrencies] = useState<TrendingCurrency[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  // Refs
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use currencies from API or fallback to default list
  const enhancedCurrencies = currencies.length > 0 ? currencies : [
    { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", region: "Asia", isPopular: true },
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", region: "North America", isPopular: true },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", region: "Europe", isPopular: true },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", region: "Europe", isPopular: true },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", region: "Asia", isPopular: true },
    { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", region: "Asia", isPopular: true },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", region: "Asia", isPopular: true },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", region: "Asia", isPopular: true },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", region: "Asia", isPopular: true },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", region: "Asia", isPopular: true },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", region: "Asia", isPopular: true },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", region: "Asia", isPopular: true },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", region: "Asia", isPopular: true },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼", region: "Asia", isPopular: true },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", region: "Oceania", isPopular: true },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", region: "North America", isPopular: true },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", region: "Europe", isPopular: true },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", region: "Oceania", isPopular: true },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", region: "Asia", isPopular: true },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺", region: "Europe", isPopular: true },
  ];

  // Filter currencies based on search
  const filteredCurrencies = enhancedCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get currency details
  const getCurrencyDetails = (code: string) => {
    return enhancedCurrencies.find(c => c.code === code) || {
      code,
      name: code,
      symbol: code,
      flag: "🌍",
      region: "Unknown"
    };
  };

  // Perform currency conversion
  const performConversion = useCallback(async () => {
    if (!amount || amount <= 0 || fromCurrency === toCurrency) return;

    try {
      const result = await convert(fromCurrency, toCurrency, amount);
      if (result) {
        const fromDetails = getCurrencyDetails(fromCurrency);
        const toDetails = getCurrencyDetails(toCurrency);
        
        setConversionResult({
          from: {
            currency: fromCurrency,
            amount: amount,
            symbol: fromDetails.symbol
          },
          to: {
            currency: toCurrency,
            amount: result.to.amount,
            symbol: toDetails.symbol
          },
          rate: result.rate,
          timestamp: result.timestamp,
          change24h: Math.random() * 2 - 1, // Mock 24h change
          trend: Math.random() > 0.5 ? 'up' : 'down'
        });
        
        onCurrencySelect?.(fromCurrency, toCurrency);
      }
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  }, [fromCurrency, toCurrency, amount, convert, onCurrencySelect]);

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Add to favorites
  const toggleFavorite = (currencyCode: string) => {
    setFavorites(prev => 
      prev.includes(currencyCode) 
        ? prev.filter(c => c !== currencyCode)
        : [...prev, currencyCode]
    );
  };

  // Use trending currencies from API
  const trendingCurrenciesData = trending.length > 0 ? trending : [];

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh && settings?.updateFrequencyMinutes) {
      refreshIntervalRef.current = setInterval(() => {
        refreshRates();
        if (activeTab === "convert") {
          performConversion();
        }
      }, settings.updateFrequencyMinutes * 60 * 1000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAutoRefresh, settings?.updateFrequencyMinutes, refreshRates, performConversion, activeTab]);

  // Update last updated timestamp
  useEffect(() => {
    if (rates?.timestamp) {
      setLastUpdated(new Date(rates.timestamp));
    }
  }, [rates]);

  // Auto-convert when parameters change
  useEffect(() => {
    if (amount > 0 && fromCurrency && toCurrency) {
      performConversion();
    }
  }, [amount, fromCurrency, toCurrency, performConversion]);

  // Quick amount buttons
  const quickAmounts = [10, 50, 100, 500, 1000, 5000];

  if (initialError) {
    return (
      <WidgetWrapper widgetId="new-currency-converter" className={className}>
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
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
    <WidgetWrapper widgetId="new-currency-converter" className={className}>
      <Card className="shadow-lg border border-gray-200 bg-white overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                Currency Converter
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Real-time exchange rates • 160+ currencies
              </p>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastUpdated.toLocaleTimeString()}
                </div>
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

        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              <TabsTrigger value="convert" className="text-xs">
                <Calculator className="w-4 h-4 mr-1" />
                Convert
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-xs">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-xs">
                <BarChart3 className="w-4 h-4 mr-1" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs">
                <Heart className="w-4 h-4 mr-1" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                Tools
              </TabsTrigger>
            </TabsList>

            {/* Convert Tab */}
            <TabsContent value="convert" className="mt-4 space-y-4">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="text-lg font-semibold"
                />
                <div className="flex gap-2 flex-wrap">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount)}
                      className="text-xs"
                    >
                      {quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Currency Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search Currencies</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search currencies..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.length > 2) {
                        search(e.target.value);
                      } else {
                        clearSearch();
                      }
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <div className="relative">
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {(searchQuery.length > 2 ? searchResults : filteredCurrencies).map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">To</label>
                  <div className="relative">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {(searchQuery.length > 2 ? searchResults : filteredCurrencies).map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={swapCurrencies}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Conversion Result */}
              {conversionResult && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border-2 border-emerald-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-800 mb-2">
                      {conversionResult.to.symbol} {conversionResult.to.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {conversionResult.from.symbol} {conversionResult.from.amount.toLocaleString()} = {conversionResult.to.symbol} {conversionResult.to.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rate: 1 {conversionResult.from.currency} = {conversionResult.rate.toFixed(4)} {conversionResult.to.currency}
                    </div>
                    {conversionResult.change24h && (
                      <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${
                        conversionResult.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {conversionResult.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(conversionResult.change24h).toFixed(2)}% (24h)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {converting && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
                  <span className="text-sm text-gray-600">Converting...</span>
                </div>
              )}
            </TabsContent>

            {/* Trending Tab */}
            <TabsContent value="trending" className="mt-4 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Trending Currencies</h3>
                <p className="text-sm text-gray-600">Most popular currencies in Pattaya</p>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {trendingCurrenciesData.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setToCurrency(currency.code);
                      setActiveTab("convert");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm bg-emerald-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-emerald-700">
                        #{currency.rank}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <div>
                          <div className="font-mono text-sm font-bold text-gray-900">{currency.code}</div>
                          <div className="text-xs text-gray-600">{currency.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{currency.symbol} {currency.rate.toFixed(4)}</div>
                      <div className={`text-xs flex items-center gap-1 ${
                        currency.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currency.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(currency.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="mt-4 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Currency Charts</h3>
                <p className="text-sm text-gray-600">Historical exchange rate data</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                <div className="text-lg text-blue-800 mb-2">Charts Coming Soon</div>
                <div className="text-sm text-blue-600">
                  Interactive charts with historical data will be available here
                </div>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-4 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">❤️ My Favorites</h3>
                <p className="text-sm text-gray-600">Your saved currency pairs</p>
              </div>

              {favorites.length === 0 ? (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-2 border-amber-200 text-center">
                  <Heart className="h-12 w-12 mx-auto text-amber-600 mb-3" />
                  <div className="text-lg text-amber-800 mb-3">No favorites yet</div>
                  <div className="text-sm text-amber-600">
                    Add currencies to your favorites by clicking the star icon
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((currencyCode) => {
                    const currency = getCurrencyDetails(currencyCode);
                    return (
                      <div
                        key={currencyCode}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{currency.flag}</span>
                          <div>
                            <div className="font-mono text-sm font-bold text-gray-900">{currency.code}</div>
                            <div className="text-xs text-gray-600">{currency.name}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(currencyCode)}
                          className="text-amber-500 hover:text-amber-600"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="mt-4 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🛠️ Currency Tools</h3>
                <p className="text-sm text-gray-600">Advanced currency utilities</p>
              </div>

              <div className="space-y-3">
                <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                  <Bell className="w-4 h-4 mr-3" />
                  Rate Alerts
                </Button>
                <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                  <Target className="w-4 h-4 mr-3" />
                  Travel Calculator
                </Button>
                <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                  <PiggyBank className="w-4 h-4 mr-3" />
                  Savings Goal Tracker
                </Button>
                <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Investment Calculator
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center border-2 border-blue-200">
                  <div className="text-sm text-blue-800 font-semibold mb-1">Powered by ExchangeRate-API</div>
                  <div className="text-xs text-blue-600">Free • Reliable • Real-time</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
}
