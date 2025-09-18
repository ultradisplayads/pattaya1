# Traffic Widget Setup Guide

## Overview
The Traffic Widget now includes four tabs:
1. **Summary** - Shows major routes and traffic incidents
2. **Map View** - Interactive traffic map with road status
3. **Parking** - Parking lot availability and status
4. **Transport** - Public transport schedules and delays

## Environment Configuration

To enable the interactive map functionality, you need to set up a Google Maps API key:

1. Create a `.env.local` file in the `pattaya_frontend` directory
2. Add the following environment variable:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Get your API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
4. Make sure to enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Roads API (for traffic data)

## Features

### Map View Tab
- Shows an interactive placeholder that opens the full Google Maps modal
- Displays live traffic conditions when clicked
- Includes traffic layer overlay
- Shows parking locations and road incidents

### Parking Tab
- Lists parking lots with availability status
- Shows number of available spaces
- Color-coded status indicators (Available, Likely Full, Closed)

### Transport Tab
- Public transport schedules and delays
- Real-time status updates
- Service notes and estimated arrival times

## Backend Endpoints

The widget expects the following Strapi endpoints:

- `GET /api/traffic-routes` - Traffic route data
- `GET /api/traffic-incidents` - Traffic incident data
- `GET /api/traffic-map` - Map image URL (optional)
- `GET /api/parking-status` - Parking lot data
- `GET /api/transport-status` - Transport service data

## Fallback Data

If backend endpoints are not available, the widget will display fallback data for demonstration purposes.

## Styling

The widget uses a modern glassmorphism design with:
- Gradient backgrounds
- Backdrop blur effects
- Smooth animations
- Color-coded status indicators
- Responsive design
