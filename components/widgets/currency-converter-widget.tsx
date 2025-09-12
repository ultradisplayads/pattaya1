"use client";

import type React from "react";

import { useState, useEffect, lazy, Suspense, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, BarChart3, Heart, Zap, Loader2, AlertCircle, ArrowRightLeft, DollarSign, Coins, Calculator, Sparkles, Star, RefreshCw, TrendingDown } from "lucide-react";
import { useCurrencyConverter, useCurrencyConversion, useCurrencyHistory } from '@/hooks/use-currency-converter';
import { WidgetWrapper } from './WidgetWrapper';
import { SponsorshipBanner } from './sponsorship-banner';

const LazyChart = lazy(() => import("./lazy-chart").then((module) => ({ default: module.LazyChart })));
const LazyConverter = lazy(() => import("./lazy-converter").then((module) => ({ default: module.LazyConverter })));

// Default trending currencies (will be replaced with real data from API)
const DEFAULT_TRENDING_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", trend: "+1.8%", rank: 2 },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭", trend: "+2.3%", rank: 1 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", trend: "+0.9%", rank: 3 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", trend: "+1.2%", rank: 4 },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", trend: "-0.5%", rank: 5 },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", trend: "+0.7%", rank: 6 },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", trend: "+1.1%", rank: 7 },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", trend: "-0.3%", rank: 8 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", trend: "+0.4%", rank: 9 },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", trend: "+0.8%", rank: 10 },
];

// Default popular pairs (will be replaced with real rates from API)
const DEFAULT_POPULAR_PAIRS = [
  { from: "USD", to: "THB", rate: "31.76" },
  { from: "EUR", to: "THB", rate: "37.18" },
  { from: "GBP", to: "THB", rate: "42.98" },
  { from: "JPY", to: "THB", rate: "0.216" },
  { from: "CNY", to: "THB", rate: "4.46" },
  { from: "SGD", to: "THB", rate: "24.81" },
];

interface CurrencyConverterWidgetProps {
  onCurrencySelect?: (from: string, to: string) => void;
  showCharts?: boolean;
  compact?: boolean;
  theme?: 'primary' | 'nightlife';
  className?: string;
}

export function CurrencyConverterWidget({ onCurrencySelect, showCharts = true, compact = true, theme = 'primary', className }: CurrencyConverterWidgetProps) {
  const { currencies, rates, settings, loading: initialLoading, error: initialError, refreshRates } = useCurrencyConverter();
  const { result, loading: converting, error: convertError, convert, clearResult } = useCurrencyConversion();
  const { history, loading: historyLoading, error: historyError, fetchHistory, clearHistory } = useCurrencyHistory();
  
  const [selectedFromCurrency, setSelectedFromCurrency] = useState("USD");
  const [selectedToCurrency, setSelectedToCurrency] = useState("THB");
  const [amount, setAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showExpandedModal, setShowExpandedModal] = useState(false);

  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<"horizontal" | "vertical" | "both" | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 0, height: 0 });

  const isPrimary = theme === 'primary';

  // Generate trending currencies from real API data
  const getTrendingCurrencies = () => {
    if (currencies.length === 0) return DEFAULT_TRENDING_CURRENCIES;
    
    // Get top currencies with mock trend data (in production, this would come from real analytics)
    const topCurrencies = currencies.slice(0, 10).map((currency, index) => ({
      code: currency.code,
      name: currency.name,
      flag: currency.flag,
      trend: index % 3 === 0 ? `+${(Math.random() * 2 + 0.5).toFixed(1)}%` : 
             index % 3 === 1 ? `-${(Math.random() * 1 + 0.2).toFixed(1)}%` : 
             `+${(Math.random() * 1.5 + 0.3).toFixed(1)}%`,
      rank: index + 1
    }));
    
    return topCurrencies;
  };

  const trendingCurrencies = getTrendingCurrencies();

  // Generate popular pairs from real exchange rates
  const getPopularPairs = () => {
    if (!rates?.rates) return DEFAULT_POPULAR_PAIRS;
    
    const popularPairs = [
      { from: "USD", to: "THB" },
      { from: "EUR", to: "THB" },
      { from: "GBP", to: "THB" },
      { from: "JPY", to: "THB" },
      { from: "CNY", to: "THB" },
      { from: "SGD", to: "THB" },
    ];
    
    return popularPairs.map(pair => {
      // For pairs like USD to THB, the rate is directly from rates.rates[USD]
      const rate = rates.rates[pair.from] || 1;
      return {
        ...pair,
        rate: rate.toFixed(4)
      };
    });
  };

  const popularPairs = getPopularPairs();

  // Load historical data for charts
  const loadHistoricalData = useCallback(async () => {
    if (selectedFromCurrency && selectedToCurrency && selectedFromCurrency !== selectedToCurrency) {
      try {
        await fetchHistory(selectedToCurrency, 7);
      } catch (error) {
        console.error('Failed to load historical data:', error);
      }
    }
  }, [selectedFromCurrency, selectedToCurrency, fetchHistory]);

  // Initialize with settings
  useEffect(() => {
    if (settings) {
      setSelectedFromCurrency(settings.defaultFromCurrency);
      setSelectedToCurrency(settings.defaultToCurrency);
    }
  }, [settings]);

  // Update last updated timestamp when rates change
  useEffect(() => {
    if (rates?.timestamp) {
      setLastUpdated(new Date(rates.timestamp));
    }
  }, [rates]);

  // Load exchange rate using real API
  useEffect(() => {
    const loadExchangeRate = async () => {
      if (selectedFromCurrency === selectedToCurrency) {
        setExchangeRate(1);
        return;
      }

      setIsLoading(true);
      try {
        // Use the real API to convert currency
        const result = await convert(selectedFromCurrency, selectedToCurrency, 1);
        if (result) {
          setExchangeRate(result.rate);
        } else if (rates && rates.rates) {
          // Backend uses THB as base currency, rates are "THB per unit of other currency"
          let calculatedRate;
          
          if (selectedFromCurrency === 'THB') {
            // Converting from THB to another currency: divide by rate
            calculatedRate = 1 / (rates.rates[selectedToCurrency] || 1);
          } else if (selectedToCurrency === 'THB') {
            // Converting from another currency to THB: multiply by rate
            calculatedRate = rates.rates[selectedFromCurrency] || 1;
          } else {
            // Converting between two non-THB currencies: convert via THB
            const fromRate = rates.rates[selectedFromCurrency] || 1;
            const toRate = rates.rates[selectedToCurrency] || 1;
            calculatedRate = fromRate / toRate;
          }
          
          setExchangeRate(calculatedRate);
        }
      } catch (error) {
        console.error("Failed to load exchange rate:", error);
        // Fallback to mock data only if API completely fails
        setExchangeRate(selectedFromCurrency === 'THB' ? 0.03176 : 31.76);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedFromCurrency && selectedToCurrency) {
      loadExchangeRate();
    }
  }, [selectedFromCurrency, selectedToCurrency, rates, convert]);

  // Load historical data when currencies change
  useEffect(() => {
    loadHistoricalData();
  }, [loadHistoricalData]);

  const handleTrendingCurrencyClick = (currencyCode: string) => {
    if (selectedFromCurrency === currencyCode) {
      setSelectedToCurrency(currencyCode);
      setSelectedFromCurrency(selectedToCurrency);
    } else {
      setSelectedToCurrency(currencyCode);
    }
    onCurrencySelect?.(selectedFromCurrency, currencyCode);
  };

  const handleQuickAmount = (newAmount: number) => {
    setAmount(newAmount);
  };

  const swapCurrencies = () => {
    setSelectedFromCurrency(selectedToCurrency);
    setSelectedToCurrency(selectedFromCurrency);
  };

  const handleMouseDown = (e: React.MouseEvent, direction: "horizontal" | "vertical" | "both") => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    const newDimensions = { ...startDimensions.current };

    if (resizeDirection === "horizontal" || resizeDirection === "both") {
      newDimensions.width = Math.max(280, Math.min(600, startDimensions.current.width + deltaX));
    }

    if (resizeDirection === "vertical" || resizeDirection === "both") {
      newDimensions.height = Math.max(350, Math.min(800, startDimensions.current.height + deltaY));
    }

    setDimensions(newDimensions);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeDirection(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  if (initialError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl">
        <div className="text-center text-gray-600">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-medium mb-2">Failed to load currency converter</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshRates}
            className="bg-white hover:bg-emerald-50 border-emerald-200"
                >
            <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
    );
  }

  return (
    <>
      {/* Main Widget - Clickable to expand */}
      <div 
        className="h-full flex flex-col bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl overflow-hidden relative shadow-sm border border-emerald-200 cursor-pointer hover:shadow-md transition-shadow duration-300"
        onClick={() => setShowExpandedModal(true)}
      >
        {/* Clean Header with Animated Icons */}
        <div className="relative p-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-100 to-green-100 overflow-hidden">
          {/* Animated Background Icons */}
          <DollarSign className="absolute top-2 left-2 w-4 h-4 text-emerald-300 opacity-60 animate-pulse" />
          <Coins className="absolute top-3 right-4 w-5 h-5 text-green-400 opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <TrendingUp className="absolute bottom-1 left-6 w-3 h-3 text-teal-400 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
          <Star className="absolute bottom-2 right-2 w-4 h-4 text-emerald-300 opacity-30 animate-ping" style={{ animationDelay: '1.5s' }} />
          <Sparkles className="absolute top-1 right-8 w-3 h-3 text-green-300 opacity-50 animate-spin" style={{ animationDelay: '2s', animationDuration: '3s' }} />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-sm">
                <DollarSign className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Currency Converter</h2>
                <p className="text-xs text-gray-600">Live exchange rates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  refreshRates()
                }}
                className="p-1 h-6 w-6"
              >
                <RefreshCw className="w-3 h-3 text-emerald-600" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Clean Content Area */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Quick Converter */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Quick Convert</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    swapCurrencies()
                  }}
                  className="p-1 h-6 w-6"
                >
                  <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                </Button>
              </div>
              
              {/* Amount Input */}
              <div className="mb-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 text-lg font-semibold border border-emerald-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter amount"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Currency Selection */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">From</label>
                  <select
                    value={selectedFromCurrency}
                    onChange={(e) => setSelectedFromCurrency(e.target.value)}
                    className="w-full p-2 border border-emerald-200 rounded-lg bg-white/80 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">To</label>
                  <select
                    value={selectedToCurrency}
                    onChange={(e) => setSelectedToCurrency(e.target.value)}
                    className="w-full p-2 border border-emerald-200 rounded-lg bg-white/80 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Exchange Rate Display */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Exchange Rate</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : exchangeRate ? (
                      `1 ${selectedFromCurrency} = ${exchangeRate.toFixed(4)} ${selectedToCurrency}`
                    ) : (
                      'Loading...'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</h3>
              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 1000, 2000, 5000, 10000].map(quickAmount => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickAmount(quickAmount)
                    }}
                    className="text-xs h-8 bg-white/80 hover:bg-emerald-50 border-emerald-200"
                  >
                    {quickAmount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Popular Pairs */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Pairs</h3>
              <div className="grid grid-cols-2 gap-2">
                {popularPairs.slice(0, 4).map((pair) => (
                  <Button
                    key={`${pair.from}-${pair.to}`}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFromCurrency(pair.from)
                      setSelectedToCurrency(pair.to)
                    }}
                    className="h-12 bg-white/60 hover:bg-emerald-50 border border-emerald-200 rounded-lg"
                  >
                    <div className="text-left">
                      <div className="text-xs font-semibold">{pair.from} → {pair.to}</div>
                      <div className="text-sm font-bold text-emerald-600">{pair.rate}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
          </div>

      {/* Expanded Modal */}
      {showExpandedModal && (
        <Dialog open={showExpandedModal} onOpenChange={setShowExpandedModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden z-[100]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-500 animate-pulse" />
                Currency Converter - Full View
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <Tabs defaultValue="convert" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-4">
                  <TabsTrigger value="convert" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Convert
                </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                </TabsTrigger>
                  <TabsTrigger value="charts" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Charts
                </TabsTrigger>
                  <TabsTrigger value="favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Favorites
                </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Tools
                </TabsTrigger>
              </TabsList>

                <TabsContent value="convert" className="mt-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                  }
                >
                  <LazyConverter
                    amount={amount}
                    fromCurrency={selectedFromCurrency}
                    toCurrency={selectedToCurrency}
                    exchangeRate={exchangeRate}
                    isLoading={isLoading}
                    onAmountChange={setAmount}
                    onCurrencyChange={(from, to) => {
                      setSelectedFromCurrency(from);
                      setSelectedToCurrency(to);
                    }}
                    currencies={currencies}
                  />
                </Suspense>
                  </div>
              </TabsContent>

                <TabsContent value="trending" className="mt-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      📈 Trending Currencies
                      </h3>
                      <p className="text-gray-600">
                      Most popular currencies in Pattaya
                      </p>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trendingCurrencies.slice(0, 10).map((currency) => (
                      <Button
                        key={currency.code}
                        variant="ghost"
                        onClick={() => handleTrendingCurrencyClick(currency.code)}
                          className="w-full justify-between h-16 hover:bg-emerald-50 transition-all duration-200 border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-300"
                      >
                          <div className="flex items-center gap-4">
                            <div className="text-sm bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-emerald-700">
                            #{currency.rank}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{currency.flag}</span>
                              <div>
                                  <div className="font-mono text-lg font-bold text-gray-900">{currency.code}</div>
                                  <div className="text-sm text-gray-600">{currency.name}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                            className="text-sm px-4 py-2 rounded-full font-bold"
                          style={{
                            backgroundColor: currency.trend.startsWith("+") ? "#22c55e" : "#ef4444",
                            color: "#ffffff",
                          }}
                        >
                          {currency.trend}
                        </div>
                      </Button>
                    ))}
                  </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Popular Pairs for Pattaya</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {popularPairs.map((pair) => (
                          <div key={`${pair.from}-${pair.to}`} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                          <div className="flex items-center justify-between">
                              <span className="font-mono text-lg font-semibold text-gray-800">
                              {pair.from} → {pair.to}
                            </span>
                              <span className="font-bold text-xl text-emerald-600">{pair.rate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

                <TabsContent value="charts" className="mt-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Suspense
                    fallback={
                        <div className="flex items-center justify-center h-64">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                      </div>
                    }
                  >
                    <LazyChart 
                      currencyPair={`${selectedFromCurrency}/${selectedToCurrency}`}
                      historicalData={history?.history}
                    />
                  </Suspense>
                </div>
              </TabsContent>

                <TabsContent value="favorites" className="mt-4">
                  <div className="text-center space-y-6">
                    <div className="text-xl font-semibold text-gray-800">❤️ My Favorites</div>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-lg border-2 border-amber-200 text-center">
                      <Heart className="h-16 w-16 mx-auto text-amber-600 mb-4" />
                      <div className="text-xl text-amber-800 mb-4">Sign in to save your favorite currency pairs</div>
                      <Button size="lg" className="text-lg h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
                        Sign In
                      </Button>
                  </div>
                </div>
              </TabsContent>

                <TabsContent value="tools" className="mt-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800">🛠️ Currency Tools</h3>
                      <p className="text-gray-600">Advanced currency utilities</p>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" size="lg" className="w-full justify-start text-lg h-16 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      📊 Rate Alerts
                    </Button>
                      <Button variant="outline" size="lg" className="w-full justify-start text-lg h-16 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      🧮 Travel Calculator
                    </Button>
                      <Button variant="outline" size="lg" className="w-full justify-start text-lg h-16 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      💰 Savings Goal Tracker
                    </Button>
                      <Button variant="outline" size="lg" className="w-full justify-start text-lg h-16 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      📈 Investment Calculator
                    </Button>
                  </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center border-2 border-blue-200">
                        <div className="text-lg text-blue-800 font-semibold mb-2">Sponsored by ExchangeRate-API</div>
                        <div className="text-sm text-blue-600">Free • Reliable • Fast</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          </DialogContent>
        </Dialog>
        )}
    </>
  );
}
