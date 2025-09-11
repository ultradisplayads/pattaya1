"use client";

import type React from "react";

import { useState, useEffect, lazy, Suspense, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Heart, Zap, Loader2, AlertCircle } from "lucide-react";
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
      <WidgetWrapper widgetId="currency-converter" className={className}>
        <div className="relative">
          <Card className="shadow-lg border border-gray-200 bg-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                  Failed to load currency converter
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshRates}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper widgetId="currency-converter" className={`${className} h-full w-full`}>
      <div className="relative h-full w-full flex flex-col">
        <Card
          ref={widgetRef}
          className="shadow-lg border border-gray-200 bg-white overflow-hidden relative flex flex-col h-full w-full"
          style={{
            minWidth: `${dimensions.width}px`,
            minHeight: `${dimensions.height}px`,
            width: "100%",
            height: "100%",
            transition: isResizing ? "none" : "all 0.2s ease",
          }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-transparent hover:bg-blue-200 opacity-0 hover:opacity-50 transition-opacity"
            onMouseDown={(e) => handleMouseDown(e, "horizontal")}
            title="Resize horizontally"
          />
          <div
            className="absolute left-0 bottom-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-blue-200 opacity-0 hover:opacity-50 transition-opacity"
            onMouseDown={(e) => handleMouseDown(e, "vertical")}
            title="Resize vertically"
          />
          <div
            className="absolute right-0 bottom-0 w-4 h-4 cursor-nw-resize bg-transparent hover:bg-blue-300 opacity-0 hover:opacity-70 transition-opacity"
            onMouseDown={(e) => handleMouseDown(e, "both")}
            title="Resize both directions"
          />

          <div
            className="flex-shrink-0"
            style={{
              background: "#059669",
              color: "#ffffff",
              padding: "6px 10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <div className="text-xs flex items-center gap-1 font-semibold" style={{ color: "#ffffff" }}>
              💱 Currency Exchange
              <span className="ml-auto text-xs opacity-70">
                {dimensions.width}×{dimensions.height}
              </span>
            </div>
            <p className="text-xs" style={{ color: "#d1fae5" }}>
              Live rates • Pattaya focused
            </p>
          </div>

          <CardContent className="p-3 flex flex-col flex-1 min-h-0 h-full w-full">
            <Tabs defaultValue="convert" className="w-full h-full flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-5 h-8 bg-gray-100 mb-2 flex-shrink-0">
                <TabsTrigger value="convert" className="text-xs px-2 py-1">
                  <Zap className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="trending" className="text-xs px-2 py-1">
                  <TrendingUp className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="charts" className="text-xs px-2 py-1">
                  <BarChart3 className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="favorites" className="text-xs px-2 py-1">
                  <Heart className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs px-2 py-1">
                  ⚙️
                </TabsTrigger>
              </TabsList>

              <TabsContent value="convert" className="mt-0 flex-1 flex flex-col min-h-0 h-full w-full data-[state=active]:flex">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
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
              </TabsContent>

              <TabsContent value="trending" className="mt-0 flex-1 flex flex-col min-h-0 h-full w-full data-[state=active]:flex">
                <div className="space-y-4 w-full h-full flex-1 flex flex-col overflow-y-auto max-h-96">
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      📈 Trending Currencies
                    </div>
                    <div className="text-sm text-gray-600">
                      Most popular currencies in Pattaya
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 flex-1">
                    {trendingCurrencies.slice(0, 6).map((currency) => (
                      <Button
                        key={currency.code}
                        variant="ghost"
                        onClick={() => handleTrendingCurrencyClick(currency.code)}
                        className="w-full justify-between text-sm h-14 hover:bg-emerald-50 transition-all duration-200 border-2 border-gray-200 rounded-lg p-3 hover:border-emerald-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm bg-emerald-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-emerald-700">
                            #{currency.rank}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{currency.flag}</span>
                              <div>
                                <div className="font-mono text-sm font-bold text-gray-900">{currency.code}</div>
                                <div className="text-xs text-gray-600">{currency.name}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="text-sm px-3 py-1 rounded-full font-bold"
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

                  <div className="pt-4 border-t border-gray-200 flex-shrink-0">
                    <div className="text-sm font-semibold text-gray-800 mb-3 text-center">Popular Pairs for Pattaya</div>
                    <div className="grid grid-cols-2 gap-3">
                      {popularPairs.slice(0, 4).map((pair) => (
                        <div key={`${pair.from}-${pair.to}`} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold text-gray-800">
                              {pair.from} → {pair.to}
                            </span>
                            <span className="font-bold text-lg text-emerald-600">{pair.rate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="charts" className="mt-0 flex-1 flex flex-col min-h-0 h-full w-full data-[state=active]:flex">
                <div className="flex-1 flex flex-col min-h-0 h-full w-full overflow-y-auto max-h-96">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
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

              <TabsContent value="favorites" className="mt-0 flex-1 flex flex-col min-h-0 h-full w-full data-[state=active]:flex">
                <div className="flex-1 flex flex-col justify-center h-full w-full">
                  <div className="text-center space-y-4">
                    <div className="text-lg font-semibold text-gray-800">❤️ My Favorites</div>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-2 border-amber-200 text-center">
                      <Heart className="h-12 w-12 mx-auto text-amber-600 mb-3" />
                      <div className="text-lg text-amber-800 mb-3">Sign in to save your favorite currency pairs</div>
                      <Button size="lg" className="text-sm h-10 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
                        Sign In
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-0 flex-1 flex flex-col min-h-0 h-full w-full data-[state=active]:flex">
                <div className="space-y-4 flex-1 flex flex-col min-h-0 h-full w-full overflow-y-auto max-h-96">
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg font-semibold text-gray-800">🛠️ Currency Tools</div>
                    <div className="text-sm text-gray-600">Advanced currency utilities</div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      📊 Rate Alerts
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      🧮 Travel Calculator
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      💰 Savings Goal Tracker
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-sm h-12 bg-white border-2 hover:border-emerald-300 hover:bg-emerald-50">
                      📈 Investment Calculator
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex-shrink-0">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center border-2 border-blue-200">
                      <div className="text-sm text-blue-800 font-semibold mb-1">Sponsored by ExchangeRate-API</div>
                      <div className="text-xs text-blue-600">Free • Reliable • Fast</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

        {isResizing && (
          <div className="absolute -bottom-8 left-0 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow border">
            Resizing: {dimensions.width}×{dimensions.height}
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
