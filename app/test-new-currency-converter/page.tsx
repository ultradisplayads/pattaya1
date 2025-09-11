"use client";

import { NewCurrencyConverterWidget } from "@/components/widgets/new-currency-converter-widget";

export default function TestNewCurrencyConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            New Currency Converter Widget
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Completely redesigned currency converter with modern UI, real-time data, 
            and enhanced functionality including tabs, search, and trending currencies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Widget */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Enhanced Currency Converter
              </h2>
              <div className="h-[600px]">
                <NewCurrencyConverterWidget 
                  showCharts={true}
                  compact={false}
                  theme="primary"
                  className="h-full"
                />
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                New Features
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Tabbed Interface</h3>
                      <p className="text-sm text-gray-600">
                        Convert, Trending, Charts, Favorites, and Tools tabs for better organization
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Real-time Exchange Rates</h3>
                      <p className="text-sm text-gray-600">
                        Live data from multiple API sources with 2-minute refresh intervals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Enhanced Currency Selection</h3>
                      <p className="text-sm text-gray-600">
                        Search functionality, region filtering, and 30+ supported currencies
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Trending Currencies</h3>
                      <p className="text-sm text-gray-600">
                        Real-time trending data with 24h change indicators and volume metrics
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Favorites System</h3>
                      <p className="text-sm text-gray-600">
                        Save frequently used currency pairs for quick access
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Advanced Tools</h3>
                      <p className="text-sm text-gray-600">
                        Rate alerts, travel calculator, savings tracker, and investment calculator
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Modern UI Design</h3>
                      <p className="text-sm text-gray-600">
                        Clean, responsive design with smooth animations and intuitive navigation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                API Integration
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Multiple Data Sources</h3>
                      <p className="text-sm text-gray-600">
                        ExchangeRate-API, Fixer.io, and CurrencyAPI for maximum reliability
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Enhanced Backend</h3>
                      <p className="text-sm text-gray-600">
                        New API endpoints with filtering, search, and trending data
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Real-time Updates</h3>
                      <p className="text-sm text-gray-600">
                        2-minute cache intervals for fresh exchange rate data
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Error Handling</h3>
                      <p className="text-sm text-gray-600">
                        Graceful fallbacks and comprehensive error management
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How to Use
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Enter Amount</h3>
                      <p className="text-sm text-gray-600">
                        Type the amount you want to convert or use quick amount buttons
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Select Currencies</h3>
                      <p className="text-sm text-gray-600">
                        Choose from and to currencies using the dropdown menus or search
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">View Results</h3>
                      <p className="text-sm text-gray-600">
                        See the converted amount with current exchange rate and 24h change
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">4</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Explore Tabs</h3>
                      <p className="text-sm text-gray-600">
                        Check trending currencies, charts, favorites, and tools
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
