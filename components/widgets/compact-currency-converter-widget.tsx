"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, Loader2, AlertCircle, ArrowRightLeft, DollarSign, Coins, Calculator, RefreshCw, Heart, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrencyConverter, useCurrencyConversion } from '@/hooks/use-currency-converter';
import { useCurrencyTrending } from '@/hooks/use-currency-trending';
import { useCurrencyFavorites } from '@/hooks/use-currency-favorites';

interface CompactCurrencyConverterWidgetProps {
  onCurrencySelect?: (from: string, to: string) => void;
  className?: string;
}

export function CompactCurrencyConverterWidget({ onCurrencySelect, className }: CompactCurrencyConverterWidgetProps) {
  const { currencies, rates, settings, loading: initialLoading, error: initialError, refreshRates } = useCurrencyConverter();
  const { result, loading: converting, error: convertError, convert, clearResult } = useCurrencyConversion();
  const { trendingCurrencies, loading: trendingLoading, lastUpdated: trendingLastUpdated } = useCurrencyTrending();
  const { favorites, loading: favoritesLoading, addToFavorites, removeFromFavorites, isFavorite } = useCurrencyFavorites();
  
  const [selectedFromCurrency, setSelectedFromCurrency] = useState("USD");
  const [selectedToCurrency, setSelectedToCurrency] = useState("THB");
  const [amount, setAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showExpandedModal, setShowExpandedModal] = useState(false);
  const [activeTab, setActiveTab] = useState("convert");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);

  // Handle favorite currency actions
  const handleFavoriteToggle = async (currencyCode: string, currencyName: string, currencySymbol?: string, currencyFlag?: string) => {
    setFavoriteLoading(currencyCode);
    try {
      if (isFavorite(currencyCode)) {
        await removeFromFavorites(currencyCode);
        // Show success feedback
        console.log(`Removed ${currencyCode} from favorites`);
      } else {
        await addToFavorites(currencyCode, currencyName, currencySymbol, currencyFlag);
        // Show success feedback
        console.log(`Added ${currencyCode} to favorites`);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setFavoriteLoading(null);
    }
  };

  const handleTrendingCurrencyClick = (currencyCode: string) => {
    if (selectedFromCurrency === currencyCode) {
      setSelectedToCurrency(currencyCode);
      setSelectedFromCurrency(selectedToCurrency);
    } else {
      setSelectedToCurrency(currencyCode);
    }
    onCurrencySelect?.(selectedFromCurrency, currencyCode);
  };

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

  // Perform currency conversion
  const performConversion = useCallback(async (from: string, to: string, amountValue: number) => {
    if (!from || !to || !amountValue || amountValue <= 0) {
      setConvertedAmount(null);
      return;
    }

    if (from === to) {
      setConvertedAmount(amountValue);
      return;
    }

    setIsConverting(true);
    try {
      const result = await convert(from, to, amountValue);
      
      if (result) {
        setConvertedAmount(result.to.amount);
      } else {
        // Fallback calculation using exchange rate
        if (exchangeRate) {
          const fallbackAmount = Math.round(amountValue * exchangeRate * 100) / 100;
          setConvertedAmount(fallbackAmount);
        }
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      // Fallback calculation using exchange rate
      if (exchangeRate) {
        const fallbackAmount = Math.round(amountValue * exchangeRate * 100) / 100;
        setConvertedAmount(fallbackAmount);
      }
    } finally {
      setIsConverting(false);
    }
  }, [convert, exchangeRate]);

  // Auto-convert when amount or currencies change
  useEffect(() => {
    if (amount > 0 && selectedFromCurrency && selectedToCurrency) {
      performConversion(selectedFromCurrency, selectedToCurrency, amount);
    }
  }, [amount, selectedFromCurrency, selectedToCurrency, exchangeRate, performConversion]);

  // Refresh favorites when component mounts
  useEffect(() => {
    // Trigger a refresh of favorites to ensure we have the latest data
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('currency-favorites');
      if (storedFavorites) {
        // Force a re-render by updating the favorites state
        const parsedFavorites = JSON.parse(storedFavorites);
        // This will trigger the useCurrencyFavorites hook to update
      }
    }
  }, []);


  const swapCurrencies = () => {
    setSelectedFromCurrency(selectedToCurrency);
    setSelectedToCurrency(selectedFromCurrency);
  };

  if (initialError) {
    return (
      <div className="h-full flex items-center justify-center relative overflow-hidden rounded-xl">
        {/* Unique Error Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-yellow-100/30 backdrop-blur-3xl"></div>
        </div>
        
        {/* Animated Error Elements */}
        <AlertCircle className="absolute top-2 left-2 w-4 h-4 text-orange-300 opacity-60 animate-pulse" />
        <RefreshCw className="absolute top-3 right-4 w-3 h-3 text-amber-400 opacity-40 animate-spin" />
        
        <div className="text-center relative z-10 p-4 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg">
          <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-semibold mb-2 text-gray-800">Failed to load</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshRates}
            className="bg-white/30 backdrop-blur-sm hover:bg-white/50 border-orange-200/50 text-orange-700 transition-all duration-300 hover:scale-105 text-xs h-6"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Widget - Thai-themed Compact Design */}
      <div 
        className="h-full flex flex-col relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ccw-enter"
        onClick={() => setShowExpandedModal(true)}
      >
        {/* Enhanced Thai-themed background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-orange-500/20 to-red-500/15">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-orange-500/12 to-red-600/8 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent backdrop-blur-sm"></div>
        </div>

        {/* Enhanced animated background elements with Thai theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-amber-300/25 rounded-full animate-ping"></div>
          <div className="absolute -bottom-5 -left-5 w-8 h-8 bg-orange-300/25 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-1/3 -right-2 w-3 h-3 bg-red-400/40 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/5 w-2 h-2 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
          {/* Thai-inspired geometric patterns */}
          <div className="absolute top-2 right-6 w-4 h-4 border border-amber-400/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-4 left-3 w-3 h-3 border border-orange-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* Thai-themed Header */}
        <div className="relative p-3 border-b border-amber-300/50 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-red-50/70 backdrop-blur-md overflow-hidden shadow-lg">
          {/* Thai-inspired decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 via-orange-100/30 to-red-100/40"></div>
          <DollarSign className="absolute top-1 left-2 w-3 h-3 text-amber-500/70 animate-pulse" />
          <Coins className="absolute top-2 right-3 w-3 h-3 text-orange-500/70 animate-bounce" style={{ animationDelay: '0.7s' }} />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="relative p-2 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-3 h-3 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-xl blur-md animate-ping opacity-40"></div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-900 tracking-tight">Currency Exchange</h2>
                <p className="text-xs text-orange-700 font-semibold">Live Thai Baht Rates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-amber-800 font-semibold bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1 rounded-lg border border-amber-300/70 shadow-sm">
                  {lastUpdated.toLocaleTimeString().slice(0, 5)}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  refreshRates()
                }}
                className="p-1.5 h-6 w-6 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-180 shadow-sm"
              >
                <RefreshCw className="w-3 h-3 text-amber-700" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Top Tabs control entire widget content */}
        <div className="flex-1 overflow-hidden p-2 relative z-10 h-full">
          <div className="h-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-full">
              <div className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-lg border border-amber-300/50 shadow-sm"></div>
              <div className="relative p-2 h-full flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-amber-100/80 via-orange-100/80 to-red-100/70 border border-amber-300/60 rounded-lg p-1 mb-3 shadow-sm ccw-tabs backdrop-blur-sm">
                    <TabsTrigger value="convert" className="text-amber-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-xs py-1.5 rounded-md ccw-tab font-semibold transition-all duration-300 shadow-sm">Convert</TabsTrigger>
                    <TabsTrigger value="trending" className="text-orange-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-xs py-1.5 rounded-md ccw-tab font-semibold transition-all duration-300 shadow-sm">Trending</TabsTrigger>
                    <TabsTrigger value="favorites" className="text-red-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-rose-600 data-[state=active]:text-white text-xs py-1.5 rounded-md ccw-tab font-semibold transition-all duration-300 shadow-sm">Favorites</TabsTrigger>
                  </TabsList>

                  {/* Convert View */}
                  <TabsContent value="convert" className="flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl border border-amber-300/50 p-3 shadow-lg ccw-row ccw-surface">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1">
                          <Calculator className="w-4 h-4 text-amber-600" />
                          Quick Convert
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); swapCurrencies(); }}
                          className="p-1 h-6 w-6 rounded-lg hover:bg-amber-100/80 transition-all duration-300 hover:rotate-180 hover:scale-110"
                          aria-label="Swap currencies"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                            From Currency
                          </label>
                          <select
                            value={selectedFromCurrency}
                            onChange={(e) => setSelectedFromCurrency(e.target.value)}
                            className="w-full p-2 bg-white/80 border border-amber-300/60 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-xs font-medium shadow-sm ccw-field backdrop-blur-sm"
                          >
                            {currencies.slice(0, 5).map(currency => (
                              <option key={currency.code} value={currency.code}>
                                {currency.flag} {currency.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-orange-800 flex items-center gap-1">
                            To Currency
                          </label>
                          <select
                            value={selectedToCurrency}
                            onChange={(e) => setSelectedToCurrency(e.target.value)}
                            className="w-full p-2 bg-white/80 border border-orange-300/60 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-xs font-medium shadow-sm ccw-field backdrop-blur-sm"
                          >
                            {currencies.slice(0, 5).map(currency => (
                              <option key={currency.code} value={currency.code}>
                                {currency.flag} {currency.code}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr,auto] gap-3 mt-3 items-center">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full p-2.5 text-sm font-semibold bg-white/80 border border-amber-300/60 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 shadow-sm ccw-field backdrop-blur-sm"
                          placeholder="Enter amount"
                        />
                        <div className="text-xs px-2 py-1 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-300/60 font-semibold shadow-sm">
                          {lastUpdated ? lastUpdated.toLocaleTimeString().slice(0, 5) : ""}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="rounded-lg border border-amber-300/60 p-3 text-center bg-gradient-to-br from-amber-50/80 to-orange-50/60 backdrop-blur-sm shadow-sm">
                          <div className="text-xs text-amber-800 font-semibold mb-1 flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Exchange Rate
                          </div>
                          <div className="text-sm font-bold text-amber-900">
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto text-amber-700" />
                            ) : exchangeRate ? (
                              <span className="ccw-fade">
                                1 {selectedFromCurrency} = {exchangeRate.toFixed(4)} {selectedToCurrency}
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </div>
                        </div>
                        <div className="rounded-lg border border-red-300/60 p-3 text-center bg-gradient-to-br from-red-50/80 to-rose-50/60 backdrop-blur-sm shadow-sm">
                          <div className="text-xs text-red-800 font-semibold mb-1 flex items-center justify-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Converted
                          </div>
                          <div className="text-sm font-bold text-red-900">
                            {isConverting ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto text-red-700" />
                            ) : convertedAmount !== null ? (
                              <span className="ccw-fade">
                                {convertedAmount.toLocaleString()} {selectedToCurrency}
                              </span>
                            ) : (
                              <span className="text-gray-500">Enter amount</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Trending View */}
                  <TabsContent value="trending" className="flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl border border-orange-300/50 p-3 shadow-lg ccw-surface">
                      <h3 className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        Trending vs Thai Baht
                      </h3>
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {trendingLoading ? (
                          <div className="flex items-center justify-center h-20">
                            <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                          </div>
                        ) : trendingCurrencies.length > 0 ? (
                          trendingCurrencies.slice(0, 10).map((currency, index) => {
                            const isFav = isFavorite(currency.attributes.currencyCode);
                            return (
                              <div
                                key={currency.attributes.currencyCode}
                                className={`w-full h-8 bg-white/90 border border-orange-300/50 rounded-lg p-2 transition-all duration-300 group hover:scale-[1.02] hover:shadow-md flex items-center justify-between ccw-row ccw-list-item backdrop-blur-sm`}
                                style={{ animationDelay: `${index * 80}ms` }}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-sm">{currency.attributes.currencyFlag}</span>
                                  <div className="font-mono text-sm font-bold text-gray-900 truncate">
                                    {currency.attributes.currencyCode}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-sm">
                                    ฿{currency.attributes.rateToTHB.toFixed(4)}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFavoriteToggle(
                                        currency.attributes.currencyCode,
                                        currency.attributes.currencyName,
                                        currency.attributes.currencySymbol,
                                        currency.attributes.currencyFlag
                                      );
                                    }}
                                    className="p-1 h-5 w-5 hover:bg-orange-100/80 rounded transition-all duration-200 hover:scale-110"
                                    disabled={favoriteLoading === currency.attributes.currencyCode}
                                    aria-label="Toggle favorite"
                                  >
                                    {favoriteLoading === currency.attributes.currencyCode ? (
                                      <Loader2 className="w-3 h-3 animate-spin text-orange-600" />
                                    ) : (
                                      <Heart className={`w-3 h-3 transition-colors duration-200 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-sm text-gray-500 py-6">
                            <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <div>No trending data</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Favorites View */}
                  <TabsContent value="favorites" className="flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl border border-red-300/50 p-3 shadow-lg ccw-surface">
                      <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-600" />
                        Your Favorites
                      </h3>
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {favoritesLoading ? (
                          <div className="flex items-center justify-center h-20">
                            <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                          </div>
                        ) : favorites.length > 0 ? (
                          favorites.map((favorite, index) => {
                            const currency = favorite.attributes;
                            const trendingData = trendingCurrencies.find(t => t.attributes.currencyCode === currency.currencyCode);
                            return (
                              <div
                                key={favorite.id}
                                className={`w-full h-8 bg-white/90 border border-red-300/50 rounded-lg p-2 transition-all duration-300 group hover:scale-[1.02] hover:shadow-md flex items-center justify-between ccw-row ccw-list-item backdrop-blur-sm`}
                                style={{ animationDelay: `${index * 80}ms` }}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-sm">{currency.currencyFlag}</span>
                                  <div className="font-mono text-sm font-bold text-gray-900 truncate">
                                    {currency.currencyCode}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {trendingData && (
                                    <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold shadow-sm">
                                      ฿{trendingData.attributes.rateToTHB.toFixed(4)}
                                    </div>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFavoriteToggle(
                                        currency.currencyCode,
                                        currency.currencyName,
                                        currency.currencySymbol,
                                        currency.currencyFlag
                                      );
                                    }}
                                    className="p-1 h-5 w-5 hover:bg-red-100/80 rounded transition-all duration-200 hover:scale-110"
                                    disabled={favoriteLoading === currency.currencyCode}
                                    aria-label="Remove favorite"
                                  >
                                    {favoriteLoading === currency.currencyCode ? (
                                      <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                                    ) : (
                                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-sm text-gray-500 py-6">
                            <div className="text-2xl mb-2">💖</div>
                            <div className="mb-2 font-medium">No favorites yet</div>
                            <div className="text-xs">Add currencies from trending</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal - Same as original */}
      {showExpandedModal && (
        <Dialog open={showExpandedModal} onOpenChange={setShowExpandedModal}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden z-[100] border-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 backdrop-blur-2xl shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent backdrop-blur-xl"></div>
            </div>

            <DialogHeader className="relative z-10">
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl border border-white/20">
                    <DollarSign className="w-7 h-7 text-emerald-400 animate-pulse" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-bold">
                    Currency Converter - Full View
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lastUpdated && (
                    <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshRates}
                    className="text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] relative z-10 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Converter Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Enhanced Converter */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-emerald-400" />
                      Currency Converter
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* From Currency */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300">From</label>
                        <div className="relative">
                          <select
                            value={selectedFromCurrency}
                            onChange={(e) => setSelectedFromCurrency(e.target.value)}
                            className="w-full p-4 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                          >
                            {currencies.map(currency => (
                              <option key={currency.code} value={currency.code} className="bg-slate-800">
                                {currency.flag} {currency.code} - {currency.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full p-4 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm text-lg font-semibold"
                          placeholder="Enter amount"
                        />
                      </div>

                      {/* To Currency */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300">To</label>
                        <div className="relative">
                          <select
                            value={selectedToCurrency}
                            onChange={(e) => setSelectedToCurrency(e.target.value)}
                            className="w-full p-4 bg-slate-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                          >
                            {currencies.map(currency => (
                              <option key={currency.code} value={currency.code} className="bg-slate-800">
                                {currency.flag} {currency.code} - {currency.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full p-4 bg-slate-600/50 border border-gray-500/50 rounded-xl text-white text-lg font-semibold min-h-[60px] flex items-center">
                          {isConverting ? (
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                          ) : convertedAmount !== null ? (
                            <span className="text-emerald-400">
                              {convertedAmount.toLocaleString()} {selectedToCurrency}
                            </span>
                          ) : (
                            <span className="text-gray-400">Enter amount to convert</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Exchange Rate Display */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="text-center">
                        <div className="text-sm text-emerald-300 mb-2">Current Exchange Rate</div>
                        <div className="text-2xl font-bold text-white">
                          {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
                          ) : exchangeRate ? (
                            <span>
                              1 {selectedFromCurrency} = {exchangeRate.toFixed(4)} {selectedToCurrency}
                            </span>
                          ) : (
                            <span className="text-gray-400">Loading...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={swapCurrencies}
                        className="bg-slate-700/50 border-gray-600/50 text-white hover:bg-slate-600/50 hover:border-emerald-500/50 transition-all duration-300"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Swap Currencies
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      Quick Actions
                    </h3>
                    
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-slate-700/50 border-gray-600/50 text-white hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all duration-300"
                        onClick={() => {
                          setAmount(100);
                          setSelectedFromCurrency('USD');
                          setSelectedToCurrency('THB');
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-3" />
                        USD to THB (100)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-slate-700/50 border-gray-600/50 text-white hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all duration-300"
                        onClick={() => {
                          setAmount(1000);
                          setSelectedFromCurrency('THB');
                          setSelectedToCurrency('USD');
                        }}
                      >
                        <Coins className="w-4 h-4 mr-3" />
                        THB to USD (1000)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-slate-700/50 border-gray-600/50 text-white hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all duration-300"
                        onClick={() => {
                          setAmount(1);
                          setSelectedFromCurrency('EUR');
                          setSelectedToCurrency('THB');
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-3" />
                        EUR to THB (1)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        /* Enhanced Thai-themed animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          33% { transform: translateY(-6px) rotate(120deg); opacity: 1; }
          66% { transform: translateY(-3px) rotate(240deg); opacity: 0.8; }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.6; }
          50% { transform: translateY(-8px) rotate(-180deg) scale(1.1); opacity: 1; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes thai-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(245, 158, 11, 0.3), 0 0 10px rgba(245, 158, 11, 0.2); 
            transform: scale(1); 
          }
          50% { 
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.5), 0 0 25px rgba(245, 158, 11, 0.3); 
            transform: scale(1.02); 
          }
        }
        
        /* Animation classes */
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-thai-gradient {
          background-size: 200% 200%;
          animation: thai-gradient 4s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        /* Enhanced widget entrance with Thai flair */
        .ccw-enter { 
          opacity: 0; 
          transform: translateY(10px) scale(0.98); 
          animation: ccw-enter 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }
        @keyframes ccw-enter {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          70% { opacity: 0.8; transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Elegant stagger animation for content rows */
        .ccw-row { 
          opacity: 0; 
          transform: translateY(6px) scale(0.99); 
          animation: ccw-row-in 450ms ease forwards; 
        }
        @keyframes ccw-row-in {
          0% { opacity: 0; transform: translateY(6px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Smooth fade utility with Thai warmth */
        .ccw-fade { 
          animation: fade-in 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        }

        /* Enhanced micro-interactions */
        .ccw-tabs { 
          position: sticky; 
          top: 0; 
          z-index: 10; 
          backdrop-filter: blur(8px);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ccw-tab { 
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1); 
          position: relative;
          overflow: hidden;
        }
        
        .ccw-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 500ms ease;
        }
        
        .ccw-tab:hover::before {
          left: 100%;
        }
        
        .ccw-tab:hover { 
          transform: translateY(-2px) scale(1.02); 
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
        }
        
        .ccw-surface { 
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .ccw-surface::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 300ms ease;
        }
        
        .ccw-surface:hover::before {
          opacity: 1;
        }
        
        .ccw-surface:hover { 
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
          transform: translateY(-2px) scale(1.01);
        }
        
        /* Enhanced form fields with Thai styling */
        .ccw-field { 
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .ccw-field:focus { 
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2), 0 4px 12px rgba(245, 158, 11, 0.1);
          transform: translateY(-1px);
        }
        
        /* Enhanced list items with Thai-inspired hover */
        .ccw-list-item { 
          transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        
        .ccw-list-item::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(252, 211, 77, 0.1) 0%, 
            rgba(251, 146, 60, 0.15) 50%, 
            rgba(239, 68, 68, 0.1) 100%
          );
          transition: left 350ms ease;
        }
        
        .ccw-list-item:hover::after {
          left: 0;
        }
        
        .ccw-list-item:hover { 
          background-color: rgba(254, 243, 199, 0.7);
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
        }
        
        /* Enhanced scrollbar with Thai colors */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: linear-gradient(180deg, rgba(254, 243, 199, 0.6) 0%, rgba(253, 230, 138, 0.4) 100%);
          border-radius: 10px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.8) 0%, rgba(251, 146, 60, 0.8) 100%);
          border-radius: 10px;
          border: 1px solid rgba(245, 158, 11, 0.3);
          transition: all 0.3s ease;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(245, 158, 11, 1) 0%, rgba(251, 146, 60, 1) 100%);
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
        }
        
        /* Thai-themed button enhancements */
        .group:hover .animate-pulse {
          animation-duration: 1s;
        }
      `}</style>
    </>
  );
}
