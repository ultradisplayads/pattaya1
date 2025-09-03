# Sponsored Content Integration Guide

## Overview
This guide covers the complete integration of sponsored content into your Pattaya news application, including widgets, news feeds, and analytics tracking.

## Components Created

### 1. SponsoredPost Component (`/components/news/sponsored-post.tsx`)
- Displays sponsored content with distinctive styling
- Includes sponsor badges, logos, and call-to-action buttons
- Tracks impressions and clicks automatically
- Responsive design with mobile optimizations

### 2. Widget Sponsorship Interface (`/components/admin/widget-sponsorship-interface.tsx`)
- Admin interface for configuring widget sponsorships
- Toggle for enabling/disabling sponsorship
- Sponsor name, logo, and URL configuration
- Live preview of sponsor banner
- Three sponsorship types: banner, content, mixed

### 3. Analytics Hook (`/hooks/use-analytics.ts`)
- Tracks sponsored content impressions and clicks
- Integrates with Google Analytics
- Sends data back to Strapi for metrics storage
- Handles error cases gracefully

## API Endpoints

### 1. Mixed Feed API (`/app/api/news/mixed-feed/route.ts`)
- Fetches both news articles and sponsored posts from Strapi
- Intelligently mixes content (sponsored posts every 3-4 news items)
- Supports search and category filtering
- Returns structured response with metadata

### 2. Analytics Tracking API (`/app/api/analytics/track/route.ts`)
- Receives analytics data from frontend
- Forwards tracking data to Strapi
- Handles impression and click events

### 3. Breaking News Live API (`/app/api/breaking-news/live/route.ts`)
- Enhanced breaking news endpoint with Strapi integration
- Supports filtering for breaking news only
- Transforms data to expected frontend format

## Strapi Configuration

### Sponsored Posts Content Type
Use the schema in `strapi-sponsored-posts-schema.json` to create the sponsored-posts content type in Strapi with these fields:

**Required Fields:**
- Title (string, max 200 chars)
- Content (text)
- URL (string)
- Sponsor (string, max 100 chars)

**Optional Fields:**
- CallToAction (string, default: "Learn More")
- Category (string, default: "Sponsored")
- Active (boolean, default: true)
- Priority (integer, 1-10)
- Image (media)
- SponsorLogo (media)
- Logo (media)
- PublishedTimestamp (datetime)
- ExpiryDate (datetime)
- TargetWidgets (JSON array)
- impressions (integer)
- clicks (integer)
- clickThroughRate (decimal)
- SponsorshipType (enum: banner/content/mixed)
- DisplayText (string, max 150 chars)
- SponsorWebsite (string)

## Updated Components

### 1. News Feed Component (`/components/news/strapi-articles-feed.tsx`)
- Now supports mixed content feeds
- Type checking for news vs sponsored content
- Renders appropriate component based on content type
- Analytics integration for tracking

### 2. Enhanced Breaking News Widget
- Fallback to Strapi articles when primary APIs fail
- Analytics tracking for sponsored content
- Updated API endpoint usage

### 3. News Hero Widget
- Fixed image URL construction for Strapi media
- Uses article slugs for proper routing

## CSS Styles (`/styles/globals.css`)

### Sponsored Content Classes:
- `.sponsored-post` - Main sponsored post styling with gradients
- `.sponsored-badge` - Gradient badge for "Sponsored" labels
- `.sponsor-cta-button` - Call-to-action button styling
- `.widget-sponsor-banner` - Widget sponsor banner styling

### Responsive Design:
- Mobile-first approach with breakpoints at 640px and 768px
- Responsive sponsor logo sizing
- Mobile-optimized CTA buttons

## Implementation Steps

### 1. Strapi Setup
```bash
# In your Strapi admin panel:
1. Create the "Sponsored Posts" content type using the provided schema
2. Add some test sponsored posts
3. Ensure the API permissions allow public read access
```

### 2. Frontend Integration
```tsx
// Use the mixed feed in your components:
import { StrapiArticlesFeed } from '@/components/news/strapi-articles-feed'

// Enable sponsored content
<StrapiArticlesFeed showSponsored={true} maxArticles={10} />

// Use widget sponsorship interface in admin panels
import { WidgetSponsorshipInterface } from '@/components/admin/widget-sponsorship-interface'

<WidgetSponsorshipInterface
  widgetId="news-hero"
  widgetTitle="News Hero"
  isEditMode={isAdmin}
  onSave={handleSponsorshipSave}
/>
```

### 3. Analytics Setup
```tsx
// Analytics are automatically tracked when using SponsoredPost component
// Ensure Google Analytics is configured in your environment
```

## Environment Variables
Add these to your `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
STRAPI_API_URL=your_strapi_url
STRAPI_API_TOKEN=your_strapi_token
```

## Testing

### 1. Test Sponsored Content Display
- Create sponsored posts in Strapi
- Verify they appear in mixed feeds
- Check responsive design on mobile

### 2. Test Analytics Tracking
- Monitor console logs for tracking events
- Verify data appears in Google Analytics
- Check Strapi for updated impression/click counts

### 3. Test Widget Sponsorship Interface
- Enable edit mode in admin panels
- Configure widget sponsorships
- Verify sponsor banners display correctly

## Troubleshooting

### Common Issues:
1. **Sponsored posts not showing**: Check Strapi API permissions and Active field
2. **Analytics not tracking**: Verify Google Analytics configuration
3. **Images not loading**: Check Strapi media URL construction
4. **TypeScript errors**: Ensure all interfaces are properly imported

### Debug Commands:
```bash
# Test Strapi connection
node scripts/test-strapi-endpoints.js

# Check mixed feed API
curl "http://localhost:3000/api/news/mixed-feed?limit=5"

# Verify analytics endpoint
curl -X POST "http://localhost:3000/api/analytics/track" \
  -H "Content-Type: application/json" \
  -d '{"eventType":"impression","postId":"test","sponsorName":"Test Sponsor"}'
```

## Next Steps
1. Create sponsored posts in Strapi admin
2. Test the mixed feed functionality
3. Configure widget sponsorships in admin mode
4. Monitor analytics data collection
5. Adjust sponsored content distribution ratios as needed

The sponsored content system is now fully integrated and ready for use!
