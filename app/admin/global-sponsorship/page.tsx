import { GlobalSponsorshipAdmin } from "@/components/admin/global-sponsorship-admin"

export default function GlobalSponsorshipPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Global Widget Sponsorship Management
          </h1>
          <p className="text-gray-600">
            Configure global sponsorship settings that can be applied to multiple widgets across the homepage.
            This allows you to display consistent sponsorship text across selected widgets.
          </p>
        </div>
        
        <GlobalSponsorshipAdmin />
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How It Works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enable global sponsorship to show consistent branding across multiple widgets</li>
            <li>• Select which widgets should display the sponsorship text using the checkboxes</li>
            <li>• Use "Select All" to quickly apply sponsorship to all available widgets</li>
            <li>• The sponsorship text appears at the top of each selected widget</li>
            <li>• Perfect for major brand partnerships and homepage-level advertising</li>
            <li>• Each widget can have its own individual sponsorship settings as well</li>
          </ul>
        </div>

        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Available Widgets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-green-800">
            <div>• Radio Widget - Live radio streaming</div>
            <div>• Weather Widget - Current weather and forecasts</div>
            <div>• News Widget - Latest news updates</div>
            <div>• Events Widget - Upcoming events</div>
            <div>• Deals Widget - Hot deals and offers</div>
            <div>• Business Widget - Business directory</div>
            <div>• Social Widget - Social media feeds</div>
            <div>• Traffic Widget - Traffic updates</div>
            <div>• YouTube Widget - Video content</div>
            <div>• Photos Widget - Photo gallery</div>
            <div>• Quick Links Widget - Quick navigation links</div>
            <div>• Trending Widget - Trending topics</div>
            <div>• Breaking News Widget - Breaking news alerts</div>
            <div>• Live Events Widget - Live event streaming</div>
            <div>• Business Spotlight Widget - Featured businesses</div>
            <div>• Hot Deals Widget - Enhanced hot deals</div>
          </div>
        </div>
      </div>
    </div>
  )
}
