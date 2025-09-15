'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plane, Search, Clock, MapPin, RefreshCw, Wifi, WifiOff, List, Filter } from "lucide-react"
import { flightTrackerApi } from "@/lib/flightTrackerApi"

type FlightStatus = 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted' | 'delayed' | 'boarding' | 'in_air'

interface FlightData {
  flight: {
    iata: string
    icao: string
    number: string
    airline: string
  }
  departure: {
    airport: string
    iata: string
    scheduled: string
    estimated?: string
    terminal?: string
    gate?: string
    delay?: number
  }
  arrival: {
    airport: string
    iata: string
    scheduled: string
    estimated?: string
    terminal?: string
    baggage?: string
    delay?: number
  }
  status: FlightStatus
  codeshares?: string[]
  lastUpdated: string
  aircraft?: {
    registration?: string
    icao?: string
    iata?: string
    icao24?: string
  }
  live?: {
    updated?: string
    latitude?: number
    longitude?: number
    altitude?: number
    direction?: number
    speed_horizontal?: number
    speed_vertical?: number
    is_ground?: boolean
  }
}

interface FlightTrackerWidgetProps {
  className?: string
}

const FlightTrackerWidget: React.FC<FlightTrackerWidgetProps> = ({ className }) => {
  const [flightNumber, setFlightNumber] = useState('')
  const [searchType, setSearchType] = useState<'flight' | 'route'>('flight')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [flightData, setFlightData] = useState<FlightData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected')
  const [viewMode, setViewMode] = useState<'search' | 'live'>('search')
  const [liveFlights, setLiveFlights] = useState<FlightData[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceStatus, setServiceStatus] = useState<any>(null)

  const popularRoutes = [
    { from: 'Bangkok (BKK)', to: 'Phuket (HKT)' },
    { from: 'Bangkok (BKK)', to: 'Chiang Mai (CNX)' },
    { from: 'Bangkok (BKK)', to: 'Pattaya (UTP)' },
    { from: 'Phuket (HKT)', to: 'Bangkok (BKK)' }
  ]

  const airports = [
    { name: 'Bangkok (BKK)', value: 'BKK' },
    { name: 'Phuket (HKT)', value: 'HKT' },
    { name: 'Chiang Mai (CNX)', value: 'CNX' },
    { name: 'Pattaya (UTP)', value: 'UTP' },
    { name: 'Krabi (KBV)', value: 'KBV' },
  ]

  const loadLiveFlights = useCallback(async () => {
    try {
      setConnectionStatus('connected')
      setLoading(true)
      setError(null)
      
      const result = await flightTrackerApi.getLiveFlights({
        airport: 'BKK',
        flight_type: 'all',
        limit: 50
      })
      
      if (result?.data) {
        const now = new Date().toISOString()
        // Transform cached data structure to match widget expectations
        const transformedFlights = result.data.map((flight: any) => ({
          flight: {
            iata: flight.FlightNumber || 'N/A',
            icao: flight.FlightNumber || 'N/A',
            number: flight.FlightNumber || 'N/A',
            airline: flight.Airline || 'Unknown Airline'
          },
          departure: {
            airport: flight.OriginAirport || 'Unknown',
            iata: flight.Airport || 'BKK',
            scheduled: flight.ScheduledTime || now,
            estimated: flight.EstimatedTime,
            terminal: flight.Terminal,
            gate: flight.Gate,
            delay: flight.DelayMinutes || 0
          },
          arrival: {
            airport: flight.DestinationAirport || 'Bangkok',
            iata: flight.Airport || 'BKK',
            scheduled: flight.ScheduledTime || now,
            estimated: flight.EstimatedTime,
            terminal: flight.Terminal,
            baggage: flight.BaggageClaim,
            delay: flight.DelayMinutes || 0
          },
          status: flight.FlightStatus || 'scheduled',
          lastUpdated: now,
          aircraft: {
            registration: flight.Aircraft,
            icao: flight.Aircraft,
            iata: flight.Aircraft
          }
        }))
        setLiveFlights(transformedFlights)
      }
      
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error loading live flights:', err)
      setError('Failed to load live flight data')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFlightData = useCallback(async (query: string, type: 'flight' | 'route') => {
    setLoading(true)
    setError(null)
    setConnectionStatus('connected')
    
    try {
      let result
      
      if (type === 'flight') {
        // Extract airline code and flight number (e.g., TG123 -> TG, 123)
        const airlineMatch = query.match(/^([A-Za-z]{2})?(\d+)$/)
        if (!airlineMatch) throw new Error('Invalid flight number format')
        
        const airline = airlineMatch[1] || undefined
        const flightNum = airlineMatch[2]
        
        result = await flightTrackerApi.searchFlights({
          flight_number: flightNum,
          airline: airline
        })
      } else if (type === 'route' && origin && destination) {
        result = await flightTrackerApi.searchFlights({
          departure_airport: origin,
          arrival_airport: destination,
          date: new Date().toISOString().split('T')[0]
        })
      } else {
        throw new Error('Please provide valid search criteria')
      }
      
      if (result?.data?.[0]) {
        const rawFlight = result.data[0]
        // Transform cached data structure to match widget expectations
        const transformedFlight = {
          flight: {
            iata: rawFlight.FlightNumber || rawFlight.flight?.iata || 'N/A',
            icao: rawFlight.FlightNumber || rawFlight.flight?.icao || 'N/A',
            number: rawFlight.FlightNumber || rawFlight.flight?.number || 'N/A',
            airline: rawFlight.Airline || rawFlight.flight?.airline || 'Unknown Airline'
          },
          departure: {
            airport: rawFlight.OriginAirport || rawFlight.departure?.airport || 'Unknown',
            iata: rawFlight.Airport || rawFlight.departure?.iata || 'BKK',
            scheduled: rawFlight.ScheduledTime || rawFlight.departure?.scheduled || new Date().toISOString(),
            estimated: rawFlight.EstimatedTime || rawFlight.departure?.estimated,
            terminal: rawFlight.Terminal || rawFlight.departure?.terminal,
            gate: rawFlight.Gate || rawFlight.departure?.gate,
            delay: rawFlight.DelayMinutes || rawFlight.departure?.delay || 0
          },
          arrival: {
            airport: rawFlight.DestinationAirport || rawFlight.arrival?.airport || 'Bangkok',
            iata: rawFlight.Airport || rawFlight.arrival?.iata || 'BKK',
            scheduled: rawFlight.ScheduledTime || rawFlight.arrival?.scheduled || new Date().toISOString(),
            estimated: rawFlight.EstimatedTime || rawFlight.arrival?.estimated,
            terminal: rawFlight.Terminal || rawFlight.arrival?.terminal,
            baggage: rawFlight.BaggageClaim || rawFlight.arrival?.baggage,
            delay: rawFlight.DelayMinutes || rawFlight.arrival?.delay || 0
          },
          status: rawFlight.FlightStatus || rawFlight.status || 'scheduled',
          lastUpdated: new Date().toISOString(),
          aircraft: {
            registration: rawFlight.Aircraft || rawFlight.aircraft?.registration,
            icao: rawFlight.Aircraft || rawFlight.aircraft?.icao,
            iata: rawFlight.Aircraft || rawFlight.aircraft?.iata
          }
        }
        setFlightData(transformedFlight)
        setViewMode('search')
      } else {
        throw new Error('No flights found')
      }
      
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error fetching flight data:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }, [origin, destination])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (searchType === 'flight' && flightNumber.trim()) {
      loadFlightData(flightNumber.trim(), 'flight')
    } else if (searchType === 'route' && origin && destination) {
      loadFlightData(`${origin}-${destination}`, 'route')
    } else {
      setError('Please provide all required search criteria')
    }
  }

  const refreshData = useCallback(() => {
    if (viewMode === 'live') {
      loadLiveFlights()
    } else if (flightData) {
      if (searchType === 'flight' && flightNumber) {
        loadFlightData(flightNumber, 'flight')
      } else if (searchType === 'route' && origin && destination) {
        loadFlightData(`${origin}-${destination}`, 'route')
      }
    }
  }, [viewMode, flightData, searchType, flightNumber, origin, destination, loadFlightData, loadLiveFlights])

  // Load service status
  const loadServiceStatus = useCallback(async () => {
    try {
      const status = await flightTrackerApi.getServiceStatus()
      setServiceStatus(status)
    } catch (err) {
      console.warn('Could not load service status:', err)
    }
  }, [])

  // Load initial data
  useEffect(() => {
    loadLiveFlights()
    loadServiceStatus()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [loadLiveFlights, loadServiceStatus, refreshData])

  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const getDelayMinutes = (scheduled: string, estimated?: string) => {
    if (!estimated) return 0
    const scheduledTime = new Date(scheduled).getTime()
    const estimatedTime = new Date(estimated).getTime()
    return Math.round((estimatedTime - scheduledTime) / (1000 * 60))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'active':
      case 'in_air':
        return 'bg-green-100 text-green-800'
      case 'landed':
        return 'bg-gray-100 text-gray-800'
      case 'delayed':
      case 'incident':
        return 'bg-red-100 text-red-800'
      case 'boarding':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-500 line-through'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Filter live flights based on status
  const filteredLiveFlights = statusFilter === 'all' 
    ? liveFlights 
    : liveFlights.filter(flight => flight.status === statusFilter)

  return (
    <Card className={`${className} w-full max-w-4xl mx-auto`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Tracker
          </CardTitle>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              {connectionStatus === 'connected' ? (
                <Wifi className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500 mr-1" />
              )}
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
            
            {lastUpdate && (
              <div className="hidden sm:flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            
            {serviceStatus && (
              <div className="hidden md:flex items-center text-xs">
                <Badge variant="outline" className={serviceStatus.api_limit_reached ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                  {serviceStatus.api_limit_reached ? 'Cached Data' : 'Live Data'}
                </Badge>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshData}
              disabled={loading}
              className="h-8"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'search' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('search')}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Flight
          </Button>
          <Button 
            variant={viewMode === 'live' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setViewMode('live')
              loadLiveFlights()
            }}
          >
            <List className="h-4 w-4 mr-2" />
            Live Flights
          </Button>
        </div>

        {/* Search Form */}
        {viewMode === 'search' && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select 
                  value={searchType} 
                  onValueChange={(value: 'flight' | 'route') => setSearchType(value)}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Search by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight #</SelectItem>
                    <SelectItem value="route">Route</SelectItem>
                  </SelectContent>
                </Select>
                
                {searchType === 'flight' ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="e.g., TG123 or 123"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select 
                      value={origin}
                      onValueChange={setOrigin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.value} value={airport.value}>
                            {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={destination}
                      onValueChange={setDestination}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        {airports.map((airport) => (
                          <SelectItem key={airport.value} value={airport.value}>
                            {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Button 
                  type="submit"
                  disabled={loading || (searchType === 'flight' ? !flightNumber.trim() : !origin || !destination)}
                  className="w-full sm:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {/* Popular Routes */}
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-muted-foreground">Popular:</span>
                {popularRoutes.map((route, index) => (
                  <Button 
                    key={index} 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => {
                      setOrigin(route.from.match(/\(([A-Z]{3})\)/)?.[1] || '')
                      setDestination(route.to.match(/\(([A-Z]{3})\)/)?.[1] || '')
                      setSearchType('route')
                    }}
                  >
                    {route.from.split(' (')[0]} → {route.to.split(' (')[0]}
                  </Button>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* Live Flights Filter */}
        {viewMode === 'live' && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Flights</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="landed">Landed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {/* Flight Details View */}
        {!loading && viewMode === 'search' && flightData && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Flight {flightData.flight?.iata || flightData.flight?.number || 'N/A'}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(flightData.status)}>
                  {formatStatus(flightData.status)}
                </Badge>
                {flightData.live && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Live Tracking
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Departure</div>
                <div className="text-2xl font-bold">{flightData.departure.airport}</div>
                <div className="text-muted-foreground">{flightData.departure.iata}</div>
                
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled:</span>
                    <span>{formatTime(flightData.departure.scheduled)}</span>
                  </div>
                  {flightData.departure.estimated && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated:</span>
                      <div className="flex items-center">
                        <span className={flightData.departure.delay ? 'text-amber-600' : ''}>
                          {formatTime(flightData.departure.estimated)}
                        </span>
                        {flightData.departure.delay && (
                          <span className="ml-2 text-xs text-amber-600">
                            +{getDelayMinutes(flightData.departure.scheduled, flightData.departure.estimated)}m
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {flightData.departure.terminal && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Terminal:</span>
                      <span>{flightData.departure.terminal}</span>
                    </div>
                  )}
                  {flightData.departure.gate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gate:</span>
                      <span>{flightData.departure.gate}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Arrival */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Arrival</div>
                <div className="text-2xl font-bold">{flightData.arrival.airport}</div>
                <div className="text-muted-foreground">{flightData.arrival.iata}</div>
                
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled:</span>
                    <span>{formatTime(flightData.arrival.scheduled)}</span>
                  </div>
                  {flightData.arrival.estimated && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated:</span>
                      <div className="flex items-center">
                        <span className={flightData.arrival.delay ? 'text-amber-600' : ''}>
                          {formatTime(flightData.arrival.estimated)}
                        </span>
                        {flightData.arrival.delay && (
                          <span className="ml-2 text-xs text-amber-600">
                            +{getDelayMinutes(flightData.arrival.scheduled, flightData.arrival.estimated)}m
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {flightData.arrival.terminal && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Terminal:</span>
                      <span>{flightData.arrival.terminal}</span>
                    </div>
                  )}
                  {flightData.arrival.baggage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Baggage:</span>
                      <span>{flightData.arrival.baggage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Aircraft Info */}
            {flightData.aircraft && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Aircraft</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {flightData.aircraft.registration && (
                    <div>
                      <span className="text-muted-foreground">Registration:</span>
                      <div className="font-medium">{flightData.aircraft.registration}</div>
                    </div>
                  )}
                  {flightData.aircraft.icao && (
                    <div>
                      <span className="text-muted-foreground">ICAO:</span>
                      <div className="font-medium">{flightData.aircraft.icao}</div>
                    </div>
                  )}
                  {flightData.aircraft.iata && (
                    <div>
                      <span className="text-muted-foreground">IATA:</span>
                      <div className="font-medium">{flightData.aircraft.iata}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Flights List */}
        {!loading && viewMode === 'live' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Live Flights - Bangkok (BKK)</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredLiveFlights.length} flights
                </span>
                {serviceStatus?.api_limit_reached && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                    Cached Data
                  </Badge>
                )}
              </div>
            </div>
            
            {filteredLiveFlights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No flights found for the selected filter
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLiveFlights.slice(0, 20).map((flight, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{flight.flight.iata}</span>
                          <Badge variant="outline" className={getStatusColor(flight.status)}>
                            {formatStatus(flight.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {flight.departure.airport} → {flight.arrival.airport}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {flight.flight.airline} • {flight.aircraft?.registration || 'Aircraft N/A'}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{formatTime(flight.departure.scheduled)}</div>
                        <div className="text-muted-foreground text-xs">
                          {flight.departure.terminal && `Terminal ${flight.departure.terminal}`}
                          {flight.departure.gate && ` • Gate ${flight.departure.gate}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FlightTrackerWidget
