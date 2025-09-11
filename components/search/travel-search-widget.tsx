"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Plane, Hotel, MapPin, Calendar, Users, Search, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TravelWidget {
  id: number
  Title: string
  Description: string
  IsActive: boolean
  WidgetType: string
  DefaultOrigin: string
  DefaultDestination: string
  PopularDestinations: Array<{
    name: string
    code: string
    country: string
  }>
  SkyscannerConfig: {
    AffiliateId: string
    DefaultCurrency: string
    DefaultLocale: string
    DefaultCabinClass: string
  }
  TrivagoConfig: {
    ScriptUrl: string
    AffiliateId: string
    DefaultCurrency: string
  }
  Styling: {
    Theme: string
    PrimaryColor: string
    BackgroundColor: string
  }
}

interface FlightSearchData {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
}

export default function TravelSearchWidget() {
  const [widget, setWidget] = useState<TravelWidget | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('flights')
  const [popularDestinations, setPopularDestinations] = useState<Array<{name: string, code: string, country: string}>>([])
  
  // Flight search state
  const [flightSearch, setFlightSearch] = useState<FlightSearchData>({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy'
  })

  // Hotel search state
  const [hotelSearch, setHotelSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const trivagoScriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    loadWidgetConfiguration()
    loadPopularDestinations()
  }, [])

  useEffect(() => {
    if (widget && activeTab === 'hotels') {
      loadTrivagoScript()
    }
    return () => {
      // Cleanup Trivago script when component unmounts or tab changes
      if (trivagoScriptRef.current) {
        document.head.removeChild(trivagoScriptRef.current)
        trivagoScriptRef.current = null
      }
    }
  }, [widget, activeTab])

  const loadWidgetConfiguration = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/travel-widget/config')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          const widgetConfig = data.data
          setWidget(widgetConfig)
          
          // Set default values from widget config
          setFlightSearch(prev => ({
            ...prev,
            origin: widgetConfig.DefaultOrigin || 'Bangkok',
            destination: widgetConfig.DefaultDestination || 'Phuket'
          }))
          
          setHotelSearch(prev => ({
            ...prev,
            destination: widgetConfig.DefaultDestination || ''
          }))
        }
      } else {
        // Fallback: Create a default widget config if API returns 404
        const defaultWidget = {
          id: 1,
          Title: "Travel Search",
          Description: "Search flights and hotels with Skyscanner & Trivago",
          IsActive: true,
          WidgetType: "travel",
          DefaultOrigin: "Bangkok",
          DefaultDestination: "Phuket",
          PopularDestinations: [],
          SkyscannerConfig: {
            AffiliateId: "default",
            DefaultCurrency: "THB",
            DefaultLocale: "th-TH",
            DefaultCabinClass: "economy"
          },
          TrivagoConfig: {
            ScriptUrl: "https://www.trivago.com/",
            AffiliateId: "default",
            DefaultCurrency: "THB"
          },
          Styling: {
            Theme: "light",
            PrimaryColor: "#3b82f6",
            BackgroundColor: "#ffffff"
          }
        }
        setWidget(defaultWidget)
        
        setFlightSearch(prev => ({
          ...prev,
          origin: defaultWidget.DefaultOrigin,
          destination: defaultWidget.DefaultDestination
        }))
        
        setHotelSearch(prev => ({
          ...prev,
          destination: defaultWidget.DefaultDestination
        }))
      }
    } catch (error) {
      console.error('Error loading widget configuration:', error)
      // Set a minimal default widget to prevent loading state
      setWidget({
        id: 1,
        Title: "Travel Search",
        Description: "Search flights and hotels",
        IsActive: true,
        WidgetType: "travel",
        DefaultOrigin: "Bangkok",
        DefaultDestination: "Phuket",
        PopularDestinations: [],
        SkyscannerConfig: { AffiliateId: "default", DefaultCurrency: "THB", DefaultLocale: "th-TH", DefaultCabinClass: "economy" },
        TrivagoConfig: { ScriptUrl: "https://www.trivago.com/", AffiliateId: "default", DefaultCurrency: "THB" },
        Styling: { Theme: "light", PrimaryColor: "#3b82f6", BackgroundColor: "#ffffff" }
      })
    }
  }

  const loadPopularDestinations = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/travel-widget/destinations')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setPopularDestinations(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading popular destinations:', error)
    }
  }

  const loadTrivagoScript = () => {
    if (!widget || trivagoScriptRef.current) return

    const script = document.createElement('script')
    script.src = widget.TrivagoConfig.ScriptUrl
    script.async = true
    script.setAttribute('data-noptimize', '1')
    script.setAttribute('data-cfasync', 'false')
    
    trivagoScriptRef.current = script
    document.head.appendChild(script)
  }

  const generateFlightUrl = async (searchData: FlightSearchData) => {
    if (!widget) return

    setLoading(true)
    try {
      // Convert city names to airport codes for Trivago flights
      const getAirportCode = (cityName: string) => {
        const codes: { [key: string]: string } = {
          'Bangkok': 'BKK',
          'Phuket': 'HKT', 
          'Pattaya': 'UTP',
          'Chiang Mai': 'CNX'
        }
        return codes[cityName] || cityName
      }

      const params = new URLSearchParams({
        origin: getAirportCode(searchData.origin),
        destination: getAirportCode(searchData.destination),
        departureDate: searchData.departDate,
        adults: searchData.passengers.toString()
      })

      if (searchData.returnDate) {
        params.append('returnDate', searchData.returnDate)
      }

      const response = await fetch(`http://localhost:1337/api/travel-widget/flight-search?${params}`)

      if (response.ok) {
        const data = await response.json()
        console.log('Trivago flight search response:', data)
        if (data.success && data.data.searchUrl) {
          console.log('Opening Trivago flight URL:', data.data.searchUrl)
          window.open(data.data.searchUrl, '_blank')
          
          // Track the click
          trackClick('flight', searchData)
        } else {
          console.error('Invalid response structure:', data)
        }
      } else {
        console.error('Flight search failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error generating flight URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackClick = async (type: string, searchParams: any) => {
    if (!widget) return

    try {
      await fetch('http://localhost:1337/api/travel-widget/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: widget.id,
          type,
          destination: searchParams.destination,
          searchParams
        })
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (flightSearch.origin && flightSearch.destination && flightSearch.departDate) {
      generateFlightUrl(flightSearch)
    }
  }

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hotelSearch.destination || !hotelSearch.checkIn || !hotelSearch.checkOut) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        destination: hotelSearch.destination,
        checkinDate: hotelSearch.checkIn,
        checkoutDate: hotelSearch.checkOut,
        adults: hotelSearch.guests.toString()
      })

      const response = await fetch(`http://localhost:1337/api/travel-widget/hotel-search?${params}`)

      if (response.ok) {
        const data = await response.json()
        console.log('Hotel search response:', data)
        if (data.success && data.data.searchUrl) {
          console.log('Opening hotel URL:', data.data.searchUrl)
          window.open(data.data.searchUrl, '_blank')
          
          // Track the click
          trackClick('hotel', hotelSearch)
        } else {
          console.error('Invalid hotel response structure:', data)
        }
      } else {
        console.error('Hotel search failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error generating hotel URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatDate(tomorrow.toISOString())
  }

  const getNextWeekDate = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return formatDate(nextWeek.toISOString())
  }

  if (!widget) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm">Loading travel widget...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor: widget.Styling.BackgroundColor }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plane className="h-5 w-5" style={{ color: widget.Styling.PrimaryColor }} />
          {widget.Title} - Powered by Trivago
        </CardTitle>
        <p className="text-sm text-gray-600">{widget.Description}</p>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Hotels
            </TabsTrigger>
          </TabsList>

          {/* Flight Search Tab */}
          <TabsContent value="flights" className="space-y-3">
            <form onSubmit={handleFlightSearch} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">From</label>
                  <Select value={flightSearch.origin} onValueChange={(value) => setFlightSearch(prev => ({ ...prev, origin: value }))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularDestinations.map(dest => (
                        <SelectItem key={dest.code} value={dest.name}>{dest.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">To</label>
                  <Select value={flightSearch.destination} onValueChange={(value) => setFlightSearch(prev => ({ ...prev, destination: value }))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularDestinations.map(dest => (
                        <SelectItem key={dest.code} value={dest.name}>{dest.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">Departure</label>
                  <Input
                    type="date"
                    value={flightSearch.departDate}
                    onChange={(e) => setFlightSearch(prev => ({ ...prev, departDate: e.target.value }))}
                    min={getTomorrowDate()}
                    className="h-8 text-xs"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Return</label>
                  <Input
                    type="date"
                    value={flightSearch.returnDate}
                    onChange={(e) => setFlightSearch(prev => ({ ...prev, returnDate: e.target.value }))}
                    min={flightSearch.departDate || getTomorrowDate()}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">Passengers</label>
                  <Select value={flightSearch.passengers.toString()} onValueChange={(value) => setFlightSearch(prev => ({ ...prev, passengers: parseInt(value) }))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Class</label>
                  <Select value={flightSearch.cabinClass} onValueChange={(value) => setFlightSearch(prev => ({ ...prev, cabinClass: value }))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-8 text-xs"
                style={{ backgroundColor: widget.Styling.PrimaryColor }}
                disabled={loading || !flightSearch.origin || !flightSearch.destination || !flightSearch.departDate}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="h-3 w-3 mr-2" />
                )}
                Search Flights
              </Button>
            </form>

            {/* Popular Destinations */}
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Popular Destinations</p>
              <div className="flex flex-wrap gap-1">
                {popularDestinations.slice(0, 4).map(dest => (
                  <button
                    key={dest.code}
                    onClick={() => setFlightSearch(prev => ({ ...prev, destination: dest.name }))}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Hotel Search Tab */}
          <TabsContent value="hotels" className="space-y-3">
            <form onSubmit={handleHotelSearch} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Destination</label>
                <Select value={hotelSearch.destination} onValueChange={(value) => setHotelSearch(prev => ({ ...prev, destination: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDestinations.map(dest => (
                      <SelectItem key={dest.code} value={dest.name}>{dest.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">Check-in</label>
                  <Input
                    type="date"
                    value={hotelSearch.checkIn}
                    onChange={(e) => setHotelSearch(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={getTomorrowDate()}
                    className="h-8 text-xs"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Check-out</label>
                  <Input
                    type="date"
                    value={hotelSearch.checkOut}
                    onChange={(e) => setHotelSearch(prev => ({ ...prev, checkOut: e.target.value }))}
                    min={hotelSearch.checkIn || getTomorrowDate()}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Guests</label>
                <Select value={hotelSearch.guests.toString()} onValueChange={(value) => setHotelSearch(prev => ({ ...prev, guests: parseInt(value) }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-8 text-xs"
                style={{ backgroundColor: widget.Styling.PrimaryColor }}
                disabled={!hotelSearch.destination || !hotelSearch.checkIn || !hotelSearch.checkOut}
              >
                <Hotel className="h-3 w-3 mr-2" />
                Search Hotels
              </Button>
            </form>

            {/* Trivago Integration Area */}
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                Powered by Trivago - Hotel search results will appear here
              </p>
              <div id="trivago-widget-container" className="mt-2 min-h-[100px] bg-white rounded border border-gray-200 flex items-center justify-center">
                <div className="text-xs text-gray-500">
                  <Hotel className="h-4 w-4 mx-auto mb-1" />
                  Trivago Widget Loading...
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Affiliate Disclaimer */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          <p>Affiliate ID: {widget.TrivagoConfig.AffiliateId}</p>
        </div>
      </CardContent>
    </Card>
  )
}
