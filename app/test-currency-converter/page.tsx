"use client";

import { CurrencyConverterWidget } from '@/components/widgets/currency-converter-widget';

export default function TestCurrencyConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Currency Converter Widget Test
          </h1>
          <p className="text-gray-600">
            Test the currency converter widget with real-time exchange rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Primary Theme */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Primary Theme</h2>
            <CurrencyConverterWidget theme="primary" />
          </div>

          {/* Nightlife Theme */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Nightlife Theme</h2>
            <CurrencyConverterWidget theme="nightlife" />
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Core Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time exchange rates</li>
                <li>• 20+ major currencies</li>
                <li>• Thai Baht (THB) as base currency</li>
                <li>• Instant conversion</li>
                <li>• Currency swap functionality</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Advanced Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Historical rate tracking</li>
                <li>• Rate change indicators</li>
                <li>• Quick amount buttons</li>
                <li>• Auto-refresh rates</li>
                <li>• Error handling & fallbacks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
