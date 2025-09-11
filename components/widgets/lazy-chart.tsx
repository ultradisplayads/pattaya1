"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface LazyChartProps {
  currencyPair?: string
  data?: number[]
  trend?: "up" | "down" | "neutral"
  changePercent?: number
  historicalData?: Array<{ date: string; rate: number; timestamp: string }>
}

export function LazyChart({ 
  currencyPair = "USD/THB", 
  data = [32, 31.8, 31.9, 31.7, 31.6, 31.8, 31.76],
  trend = "up",
  changePercent = 0.5,
  historicalData
}: LazyChartProps) {
  // Use real historical data if available, otherwise use default data
  const chartData = historicalData && historicalData.length > 0 
    ? historicalData.map(item => item.rate)
    : data;
    
  const minValue = Math.min(...chartData)
  const maxValue = Math.max(...chartData)
  const range = maxValue - minValue

  return (
    <div className="h-full w-full flex flex-col" style={{ minHeight: '100%', minWidth: '100%' }}>
      <div className="text-center flex-shrink-0 mb-4">
        <div className="text-lg font-semibold text-gray-800">📊 Rate Charts</div>
        <div className="text-sm text-gray-600 mt-1">Live currency exchange rate trends</div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0 h-full w-full space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200 flex-1 min-h-0 h-full w-full flex flex-col">
          <div className="text-center mb-3 flex-shrink-0">
            <div className="text-lg font-semibold text-blue-800">{currencyPair}</div>
            <div className="text-sm text-blue-600">7-Day Trend</div>
          </div>
          <div className="flex-1 min-h-48 bg-white rounded-lg border-2 border-blue-300 flex items-end justify-between p-3 w-full">
            {chartData.map((rate, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-blue-500 to-blue-400 w-4 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${Math.max(((rate - minValue) / range) * 100, 10)}%` }}
                title={`Day ${i + 1}: ${rate}`}
              />
            ))}
          </div>
          
          <div className="text-center mt-3 flex-shrink-0">
            <div className="text-lg font-bold text-blue-800 mb-1">
              {changePercent > 0 ? "+" : ""}{changePercent}% this week
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              <span>Current Rate: {chartData[chartData.length - 1]}</span>
            </div>
          </div>
        </div>
        
        {/* Additional Chart Info */}
        <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-600">High</div>
            <div className="text-sm font-semibold text-green-600">{maxValue}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-600">Low</div>
            <div className="text-sm font-semibold text-red-600">{minValue}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-600">Avg</div>
            <div className="text-sm font-semibold text-blue-600">{(chartData.reduce((a, b) => a + b, 0) / chartData.length).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
