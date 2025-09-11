"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LazyConverterProps {
  amount: number
  fromCurrency: string
  toCurrency: string
  exchangeRate: number | null
  isLoading: boolean
  onAmountChange: (amount: number) => void
  onCurrencyChange: (from: string, to: string) => void
  currencies?: Array<{ code: string; name: string; flag: string; symbol: string }>
}

export function LazyConverter({
  amount,
  fromCurrency,
  toCurrency,
  exchangeRate,
  isLoading,
  onAmountChange,
  onCurrencyChange,
  currencies = []
}: LazyConverterProps) {
  const [localAmount, setLocalAmount] = useState(amount)

  useEffect(() => {
    setLocalAmount(amount)
  }, [amount])

  const handleAmountChange = (value: string) => {
    const numValue = Number(value) || 0
    setLocalAmount(numValue)
    onAmountChange(numValue)
  }

  const handleQuickAmount = (newAmount: number) => {
    setLocalAmount(newAmount)
    onAmountChange(newAmount)
  }

  const swapCurrencies = () => {
    onCurrencyChange(toCurrency, fromCurrency)
  }

  const convertedAmount = exchangeRate ? localAmount * exchangeRate : 0

  return (
    <div className="h-full w-full flex flex-col" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="text-center flex-shrink-0 mb-3">
        <div className="text-sm font-semibold text-gray-800">
          💱 Currency Converter
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Convert between 160+ currencies with real-time rates
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 w-full space-y-4 overflow-y-auto max-h-80">
        {/* Amount Input - Make it larger */}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700 block mb-2">Amount</label>
          <input
            type="number"
            value={localAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full text-lg p-3 border-2 border-gray-300 rounded-lg text-gray-800 bg-white focus:border-emerald-500 focus:outline-noe"
            placeholder="Enter amount"
          />
        </div>

        {/* Currency Selection - Side by side layout */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 block mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => onCurrencyChange(e.target.value, toCurrency)}
              className="w-full text-sm p-3 border-2 border-gray-300 rounded-lg text-gray-800 bg-white focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
            >
              {currencies.length > 0 ? (
                currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="USD">🇺🇸 USD - US Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="GBP">🇬🇧 GBP - British Pound</option>
                  <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                  <option value="THB">🇹🇭 THB - Thai Baht</option>
                  <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
                  <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                  <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                  <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                  <option value="KRW">🇰🇷 KRW - South Korean Won</option>
                </>
              )}
            </select>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 block mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => onCurrencyChange(fromCurrency, e.target.value)}
              className="w-full text-sm p-3 border-2 border-gray-300 rounded-lg text-gray-800 bg-white focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
            >
              {currencies.length > 0 ? (
                currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="THB">🇹🇭 THB - Thai Baht</option>
                  <option value="USD">🇺🇸 USD - US Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="GBP">🇬🇧 GBP - British Pound</option>
                  <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                  <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
                  <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                  <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                  <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                  <option value="KRW">🇰🇷 KRW - South Korean Won</option>
                </>
              )}
            </select>
          </div>
        </div>

        <button
          className="w-full text-lg py-4 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor: "#16a34a",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#15803d"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#16a34a"
          }}
          onClick={swapCurrencies}
        >
          🔄 Convert Currency
        </button>

        {/* Result Area - Make it much larger and more prominent */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border-2 border-emerald-200 w-full">
          {isLoading ? (
            <div className="flex items-center gap-3 justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-lg text-gray-600">Converting...</span>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="text-3xl font-bold text-emerald-800 mb-2">
                {toCurrency} {convertedAmount.toLocaleString()}
              </div>
              <div className="text-lg text-gray-700 mb-2">
                {fromCurrency} {localAmount.toLocaleString()} = {toCurrency} {convertedAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Rate: 1 {fromCurrency} = {exchangeRate?.toFixed(4) || "0.0000"} {toCurrency}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="text-sm text-gray-600 text-center mb-2">Quick Amounts:</div>
          <div className="grid grid-cols-4 gap-2 w-full">
            {[50, 100, 250, 500].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(quickAmount)}
                className="text-sm h-10 px-3 w-full border-2 hover:border-emerald-500 hover:bg-emerald-50"
              >
                {quickAmount}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
