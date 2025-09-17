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

  // Handle favorite currency actions
  const handleFavoriteToggle = async (currencyCode: string, currencyName: string, currencySymbol?: string, currencyFlag?: string) => {
    try {
      if (isFavorite(currencyCode)) {
        await removeFromFavorites(currencyCode);
      } else {
        await addToFavorites(currencyCode, currencyName, currencySymbol, currencyFlag);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
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
      {/* Main Widget - Compact Design */}
      <div 
        className="h-full flex flex-col relative overflow-hidden rounded-xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        onClick={() => setShowExpandedModal(true)}
      >
        {/* Unique Color Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-teal-500/15 to-emerald-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-teal-500/8 to-emerald-600/5 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-cyan-200/20 rounded-full animate-ping"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-teal-200/20 rounded-full animate-ping delay-500"></div>
          <div className="absolute top-1/4 -right-1 w-2 h-2 bg-emerald-300/40 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-cyan-300/50 rounded-full animate-pulse"></div>
        </div>

        {/* Compact Header */}
        <div className="relative p-2 border-b border-cyan-200/50 bg-gradient-to-r from-cyan-50/80 via-teal-50/60 to-emerald-50/80 backdrop-blur-sm overflow-hidden">
          {/* Animated Background Icons */}
          <DollarSign className="absolute top-1 left-1 w-2 h-2 text-cyan-400/60 animate-pulse" />
          <Coins className="absolute top-1 right-2 w-2 h-2 text-teal-400/60 animate-bounce" style={{ animationDelay: '0.5s' }} />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <div className="relative p-1.5 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-2.5 h-2.5 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg blur-sm animate-ping opacity-30"></div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-cyan-800">Currency</h2>
                <p className="text-xs text-cyan-600 font-medium">Live rates</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {lastUpdated && (
                <span className="text-xs text-cyan-600 font-medium bg-gradient-to-r from-cyan-100 to-teal-100 px-1.5 py-0.5 rounded-lg border border-cyan-200/50">
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
                className="p-1 h-5 w-5 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-180"
              >
                <RefreshCw className="w-2.5 h-2.5 text-cyan-600" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Compact Content with Tabs */}
        <div className="flex-1 overflow-hidden p-1.5 relative z-10 h-full">
          <div className="h-full" onClick={(e) => e.stopPropagation()}>
            {/* Compact Tabs */}
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/80 via-teal-50/60 to-emerald-50/80 backdrop-blur-sm rounded-lg border border-cyan-200/50 shadow-lg"></div>
              <div className="relative p-1.5 h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-cyan-100/50 via-teal-100/50 to-emerald-100/50 border border-cyan-200/50 rounded-lg p-0.5 mb-1.5 shadow-lg backdrop-blur-sm flex-shrink-0">
                    <TabsTrigger value="convert" className="flex items-center justify-center gap-0.5 text-cyan-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-xs py-1.5 hover:scale-105 group">
                      <Calculator className="h-2.5 w-2.5 group-hover:animate-bounce" />
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="flex items-center justify-center gap-0.5 text-teal-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-xs py-1.5 hover:scale-105 group">
                      <TrendingUp className="h-2.5 w-2.5 group-hover:animate-bounce" />
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center justify-center gap-0.5 text-emerald-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-xs py-1.5 hover:scale-105 group">
                      <Heart className="h-2.5 w-2.5 group-hover:animate-bounce" />
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="flex items-center justify-center gap-0.5 text-green-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md transition-all duration-300 text-xs py-1.5 hover:scale-105 group">
                      <Zap className="h-2.5 w-2.5 group-hover:animate-bounce" />
                    </TabsTrigger>
                  </TabsList>

                  {/* Convert Tab Content */}
                  <TabsContent value="convert" className="flex-1 overflow-y-auto">
                    <div className="space-y-1.5 h-full">
                      {/* Main Converter */}
                      <div className="bg-gradient-to-br from-cyan-50/80 via-teal-50/60 to-emerald-50/80 rounded-lg border border-cyan-200/50 p-1.5 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-xs font-bold text-cyan-800">Convert</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              swapCurrencies()
                            }}
                            className="p-0.5 h-4 w-4 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 rounded transition-all duration-300 hover:scale-110 hover:rotate-180"
                          >
                            <ArrowRightLeft className="w-2 h-2 text-cyan-600" />
                          </Button>
                        </div>
                        
                        {/* Amount Input */}
                        <div className="mb-1.5">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full p-1 text-xs font-medium bg-white/80 border border-cyan-200/50 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 shadow-sm backdrop-blur-sm"
                            placeholder="Amount"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        {/* Currency Selection */}
                        <div className="grid grid-cols-2 gap-1 mb-1.5">
                          <div>
                            <label className="text-xs font-semibold text-cyan-700 mb-0.5 block">From</label>
                            <select
                              value={selectedFromCurrency}
                              onChange={(e) => setSelectedFromCurrency(e.target.value)}
                              className="w-full p-0.5 bg-white/80 border border-cyan-200/50 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 text-xs shadow-sm backdrop-blur-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {currencies.slice(0, 5).map(currency => (
                                <option key={currency.code} value={currency.code}>
                                  {currency.flag} {currency.code}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-teal-700 mb-0.5 block">To</label>
                            <select
                              value={selectedToCurrency}
                              onChange={(e) => setSelectedToCurrency(e.target.value)}
                              className="w-full p-0.5 bg-white/80 border border-teal-200/50 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-xs shadow-sm backdrop-blur-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {currencies.slice(0, 5).map(currency => (
                                <option key={currency.code} value={currency.code}>
                                  {currency.flag} {currency.code}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {/* Exchange Rate Display */}
                        <div className="bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 border border-cyan-300/50 rounded p-1.5 text-center shadow-lg backdrop-blur-sm">
                          <div className="text-xs text-cyan-700 font-semibold mb-0.5">Rate</div>
                          <div className="text-xs font-bold text-cyan-800">
                            {isLoading ? (
                              <Loader2 className="w-2.5 h-2.5 animate-spin mx-auto text-cyan-600" />
                            ) : exchangeRate ? (
                              <span className="animate-fade-in">
                                1 {selectedFromCurrency} = {exchangeRate.toFixed(4)} {selectedToCurrency}
                              </span>
                            ) : (
                              <span className="text-gray-500">Loading...</span>
                            )}
                          </div>
                        </div>

                        {/* Conversion Result Display */}
                        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-300/50 rounded p-1.5 text-center shadow-lg backdrop-blur-sm">
                          <div className="text-xs text-emerald-700 font-semibold mb-0.5">Result</div>
                          <div className="text-xs font-bold text-emerald-800">
                            {isConverting ? (
                              <Loader2 className="w-2.5 h-2.5 animate-spin mx-auto text-emerald-600" />
                            ) : convertedAmount !== null ? (
                              <span className="animate-fade-in">
                                {amount.toLocaleString()} {selectedFromCurrency} = {convertedAmount.toLocaleString()} {selectedToCurrency}
                              </span>
                            ) : (
                              <span className="text-gray-500">Enter amount to convert</span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </TabsContent>

                  {/* Trending Tab Content */}
                  <TabsContent value="trending" className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-br from-teal-50/80 via-emerald-50/60 to-green-50/80 rounded-lg border border-teal-200/50 p-1.5 shadow-lg backdrop-blur-sm h-full">
                        <h3 className="text-xs font-bold text-teal-800 mb-1.5">📈 Trending vs THB</h3>
                      <div className="space-y-1 max-h-full overflow-y-auto">
                        {trendingLoading ? (
                          <div className="flex items-center justify-center h-16">
                            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                          </div>
                        ) : trendingCurrencies.length > 0 ? (
                          trendingCurrencies.slice(0, 6).map((currency, index) => {
                            const changePercent = currency.attributes.changePercent24h;
                            const trend = currency.attributes.trend;
                            const isFav = isFavorite(currency.attributes.currencyCode);
                            
                            return (
                              <div
                                key={currency.attributes.currencyCode}
                                className="w-full h-7 bg-white/80 hover:bg-gradient-to-r hover:from-teal-100/80 hover:to-emerald-100/80 border border-teal-200/50 rounded p-1 hover:border-teal-300/50 transition-all duration-300 group hover:scale-105 shadow-sm backdrop-blur-sm flex items-center justify-between"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div className="flex items-center gap-1 flex-1">
                                  <div className="w-3.5 h-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    {currency.attributes.rank}
                                  </div>
                                  <div className="flex items-center gap-1 flex-1">
                                    <span className="text-xs">{currency.attributes.currencyFlag}</span>
                                    <div className="font-mono text-xs font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                                      {currency.attributes.currencyCode}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {currency.attributes.rateToTHB.toFixed(4)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div
                                    className={`text-xs px-1 py-0.5 rounded-full font-bold shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                      trend === 'up' 
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-400" 
                                        : trend === 'down'
                                        ? "bg-gradient-to-r from-red-500 to-rose-500 text-white border border-red-400"
                                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-400"
                                    }`}
                                  >
                                    {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
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
                                    className="p-0.5 h-4 w-4 hover:bg-teal-100 rounded transition-all duration-300"
                                  >
                                    <Heart 
                                      className={`w-2.5 h-2.5 ${
                                        isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'
                                      }`} 
                                    />
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-xs text-gray-500 py-4">
                            No trending data available
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Favorites Tab Content */}
                  <TabsContent value="favorites" className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 rounded-lg border border-emerald-200/50 p-1.5 shadow-lg backdrop-blur-sm h-full">
                      <h3 className="text-xs font-bold text-emerald-800 mb-1.5">❤️ Favorites</h3>
                      <div className="space-y-1 max-h-full overflow-y-auto">
                        {favoritesLoading ? (
                          <div className="flex items-center justify-center h-16">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          </div>
                        ) : favorites.length > 0 ? (
                          favorites.map((favorite, index) => {
                            const currency = favorite.attributes;
                            const trendingData = trendingCurrencies.find(t => t.attributes.currencyCode === currency.currencyCode);
                            
                            return (
                              <div
                                key={favorite.id}
                                className="w-full h-7 bg-white/80 hover:bg-gradient-to-r hover:from-emerald-100/80 hover:to-green-100/80 border border-emerald-200/50 rounded p-1 hover:border-emerald-300/50 transition-all duration-300 group hover:scale-105 shadow-sm backdrop-blur-sm flex items-center justify-between"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div className="flex items-center gap-1 flex-1">
                                  <span className="text-xs">{currency.currencyFlag}</span>
                                  <div className="font-mono text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                                    {currency.currencyCode}
                                  </div>
                                  {trendingData && (
                                    <div className="text-xs text-gray-600">
                                      {trendingData.attributes.rateToTHB.toFixed(4)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {trendingData && (
                                    <div
                                      className={`text-xs px-1 py-0.5 rounded-full font-bold shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                        trendingData.attributes.trend === 'up' 
                                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-400" 
                                          : trendingData.attributes.trend === 'down'
                                          ? "bg-gradient-to-r from-red-500 to-rose-500 text-white border border-red-400"
                                          : "bg-gradient-to-r from-gray-500 to-gray-600 text-white border border-gray-400"
                                      }`}
                                    >
                                      {trendingData.attributes.changePercent24h > 0 ? '+' : ''}{trendingData.attributes.changePercent24h.toFixed(2)}%
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
                                    className="p-0.5 h-4 w-4 hover:bg-emerald-100 rounded transition-all duration-300"
                                  >
                                    <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-xs text-gray-500 py-4">
                            <div className="text-lg mb-1.5">❤️</div>
                            <div className="mb-1.5">No favorites yet</div>
                            <div className="text-xs">Add currencies from trending tab</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tools Tab Content */}
                  <TabsContent value="tools" className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 rounded-lg border border-green-200/50 p-1.5 shadow-lg backdrop-blur-sm h-full">
                        <h3 className="text-xs font-bold text-green-800 mb-1.5">🛠️ Tools</h3>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { icon: "📊", title: "Alerts" },
                          { icon: "🧮", title: "Calc" },
                          { icon: "💰", title: "Savings" },
                          { icon: "📈", title: "Invest" }
                        ].map((tool, index) => (
                          <Button 
                            key={tool.title}
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start h-6 bg-white/80 hover:bg-gradient-to-r hover:from-green-100/80 hover:to-emerald-100/80 border-green-300/50 text-gray-700 rounded transition-all duration-300 group hover:scale-105 shadow-sm backdrop-blur-sm"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <span className="text-xs mr-1 group-hover:animate-bounce">{tool.icon}</span>
                            <span className="font-semibold text-xs">{tool.title}</span>
                          </Button>
                        ))}
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden z-[100] border-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 backdrop-blur-2xl shadow-2xl">
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
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] relative z-10">
              <div className="text-center p-8">
                <div className="text-white text-lg mb-4">
                  Full currency converter with charts, trending currencies, and advanced tools
                </div>
                <div className="text-white/70 text-sm">
                  This would show the complete currency converter interface with all features
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-180deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
