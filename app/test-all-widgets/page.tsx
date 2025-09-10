import { RadioWidget } from "@/components/homepage/widgets/radio-widget"
import { NewsHeroWidget } from "@/components/homepage/widgets/news-hero-widget"
import { EventsCalendarWidget } from "@/components/homepage/widgets/events-calendar-widget"
import { SocialFeedWidget } from "@/components/homepage/widgets/social-feed-widget"
import { BusinessSpotlightWidget } from "@/components/homepage/widgets/business-spotlight-widget"
import { TrendingWidget } from "@/components/homepage/widgets/trending-widget"
import { PhotoGalleryWidget } from "@/components/homepage/widgets/photo-gallery-widget"
import { QuickLinksWidget } from "@/components/homepage/widgets/quick-links-widget"
import { EnhancedHotDealsWidget } from "@/components/homepage/widgets/enhanced-hot-deals-widget"
import { EnhancedBreakingNewsWidget } from "@/components/homepage/widgets/enhanced-breaking-news-widget"
import { LiveEventsWidget } from "@/components/homepage/widgets/live-events-widget"
import { WeatherWidget } from "@/components/homepage/widgets/weather-widget"
import { SponsorshipDebug } from "@/components/debug/sponsorship-debug"

export default function TestAllWidgetsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Widgets Sponsorship Test
          </h1>
          <p className="text-gray-600">
            This page shows all widgets with sponsorship banners. Check if sponsorship appears on top of each widget.
          </p>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Row 1 */}
          <div className="h-80">
            <RadioWidget />
          </div>
          
          <div className="h-80">
            <NewsHeroWidget />
          </div>
          
          <div className="h-80">
            <EventsCalendarWidget />
          </div>
          
          <div className="h-80">
            <SocialFeedWidget />
          </div>
          
          {/* Row 2 */}
          <div className="h-80">
            <BusinessSpotlightWidget />
          </div>
          
          <div className="h-80">
            <TrendingWidget />
          </div>
          
          <div className="h-80">
            <PhotoGalleryWidget />
          </div>
          
          <div className="h-80">
            <QuickLinksWidget />
          </div>
          
          {/* Row 3 */}
          <div className="h-80">
            <EnhancedHotDealsWidget />
          </div>
          
          <div className="h-80">
            <EnhancedBreakingNewsWidget />
          </div>
          
          <div className="h-80">
            <LiveEventsWidget />
          </div>
          
          <div className="h-80">
            <WeatherWidget />
          </div>
          
        </div>
        
        {/* Debug Info */}
        <div className="mt-8">
          <SponsorshipDebug />
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Testing Instructions
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Go to Strapi admin: <a href="https://api.pattaya1.com/admin" target="_blank" className="underline">https://api.pattaya1.com/admin</a></li>
            <li>Navigate to Content Manager → Global Sponsorship</li>
            <li>Create a new sponsorship entry with multiple titles</li>
            <li>Set "Is Active" to true</li>
            <li>Select which widgets to show sponsorship on</li>
            <li>Save and publish the sponsorship</li>
            <li>Refresh this page to see sponsorship banners on selected widgets</li>
            <li>If you have multiple titles, you should see marquee animation</li>
            <li>If you have one title, you should see static text</li>
          </ol>
        </div>
        
        <div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Widget Types Available
          </h3>
          <div className="text-sm text-green-800 grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>• radio</div>
            <div>• news</div>
            <div>• events</div>
            <div>• social</div>
            <div>• business-spotlight</div>
            <div>• trending</div>
            <div>• photos</div>
            <div>• quick-links</div>
            <div>• hot-deals</div>
            <div>• breaking-news</div>
            <div>• live-events</div>
            <div>• weather</div>
          </div>
        </div>
      </div>
    </div>
  )
}
