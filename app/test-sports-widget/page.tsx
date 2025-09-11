'use client';

import React from 'react';
import SportsFixturesWidget from '@/components/widgets/sports-fixtures-widget';

export default function TestSportsWidgetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sports Fixtures Widget Test
            </h1>
            <p className="text-gray-600">
              Testing the new Sports Fixtures Widget with fallback data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Widget */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Default Widget</h2>
              <SportsFixturesWidget />
            </div>

            {/* Custom Widget */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Custom Widget (Small)</h2>
              <SportsFixturesWidget
                title="Live Sports"
                maxFixtures={4}
                className="h-96"
              />
            </div>

            {/* Large Widget */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Large Widget (No Header)</h2>
              <SportsFixturesWidget
                title=""
                showHeader={false}
                maxFixtures={8}
                className="h-auto"
              />
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Widget Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">✅ Implemented Features:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Modern responsive UI with tabs</li>
                  <li>• Live/Upcoming/Finished status filtering</li>
                  <li>• Team logos and match details</li>
                  <li>• Competition badges and venue info</li>
                  <li>• Real-time refresh functionality</li>
                  <li>• Fallback data for demonstration</li>
                  <li>• Responsive design for all screen sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔧 Ready for Integration:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• API endpoint: /api/sports-fixtures</li>
                  <li>• Commented API functions ready</li>
                  <li>• Backend widget configuration added</li>
                  <li>• Dynamic homepage integration complete</li>
                  <li>• Admin controls and permissions set</li>
                  <li>• Widget tracking and analytics ready</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🚀 Next Steps:</h4>
            <p className="text-blue-800 text-sm">
              When you're ready to connect to your sportsfixtures.net API, simply uncomment the API functions 
              in the widget component and add your API credentials to the environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
