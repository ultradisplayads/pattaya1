// 'use client'

// import React, { useState, useEffect, useCallback } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Plane, Search, Clock, MapPin, RefreshCw, Wifi, WifiOff, List, Filter, Cloud, Wind, Navigation, Compass, Zap, Globe, Eye, ChevronRight, Sun, Moon, Stars, Radar, Satellite, Rocket, Mountain, Waves, Sunrise, Sunset, Thermometer, Gauge } from "lucide-react"
// import { flightTrackerApi } from "@/lib/flightTrackerApi"

// type FlightStatus = 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted' | 'delayed' | 'boarding' | 'in_air'

// interface FlightData {
//   flight: {
//     iata: string
//     icao: string
//     number: string
//     airline: string
//   }
//   departure: {
//     airport: string
//     iata: string
//     scheduled: string
//     estimated?: string
//     terminal?: string
//     gate?: string
//     delay?: number
//   }
//   arrival: {
//     airport: string
//     iata: string
//     scheduled: string
//     estimated?: string
//     terminal?: string
//     baggage?: string
//     delay?: number
//   }
//   status: FlightStatus
//   codeshares?: string[]
//   lastUpdated: string
//   aircraft?: {
//     registration?: string
//     icao?: string
//     iata?: string
//     icao24?: string
//   }
//   live?: {
//     updated?: string
//     latitude?: number
//     longitude?: number
//     altitude?: number
//     direction?: number
//     speed_horizontal?: number
//     speed_vertical?: number
//     is_ground?: boolean
//   }
// }

// interface FlightTrackerWidgetProps {
//   className?: string
// }

// const FlightTrackerWidget: React.FC<FlightTrackerWidgetProps> = ({ className }) => {
//   const [flightNumber, setFlightNumber] = useState('')
//   const [searchType, setSearchType] = useState<'flight' | 'route'>('flight')
//   const [origin, setOrigin] = useState('')
//   const [destination, setDestination] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [flightData, setFlightData] = useState<FlightData | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
//   const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected')
//   const [viewMode, setViewMode] = useState<'search' | 'live'>('search')
//   const [liveFlights, setLiveFlights] = useState<FlightData[]>([])
//   const [statusFilter, setStatusFilter] = useState<string>('all')
//   const [serviceStatus, setServiceStatus] = useState<any>(null)
//   const [showExpandedModal, setShowExpandedModal] = useState(false)

//   const popularRoutes = [
//     { from: 'Bangkok (BKK)', to: 'Phuket (HKT)' },
//     { from: 'Bangkok (BKK)', to: 'Chiang Mai (CNX)' },
//     { from: 'Bangkok (BKK)', to: 'Pattaya (UTP)' },
//     { from: 'Phuket (HKT)', to: 'Bangkok (BKK)' }
//   ]

//   const airports = [
//     { name: 'Bangkok (BKK)', value: 'BKK' },
//     { name: 'Phuket (HKT)', value: 'HKT' },
//     { name: 'Chiang Mai (CNX)', value: 'CNX' },
//     { name: 'Pattaya (UTP)', value: 'UTP' },
//     { name: 'Krabi (KBV)', value: 'KBV' },
//   ]

//   const loadLiveFlights = useCallback(async () => {
//     try {
//       setConnectionStatus('connected')
//       setLoading(true)
//       setError(null)
      
//       const result = await flightTrackerApi.getLiveFlights({
//         airport: 'BKK',
//         flight_type: 'all',
//         limit: 50
//       })
      
//       if (result?.data) {
//         const now = new Date().toISOString()
//         // Transform cached data structure to match widget expectations
//         const transformedFlights = result.data.map((flight: any) => ({
//           flight: {
//             iata: flight.FlightNumber || 'N/A',
//             icao: flight.FlightNumber || 'N/A',
//             number: flight.FlightNumber || 'N/A',
//             airline: flight.Airline || 'Unknown Airline'
//           },
//           departure: {
//             airport: flight.OriginAirport || 'Unknown',
//             iata: flight.Airport || 'BKK',
//             scheduled: flight.ScheduledTime || now,
//             estimated: flight.EstimatedTime,
//             terminal: flight.Terminal,
//             gate: flight.Gate,
//             delay: flight.DelayMinutes || 0
//           },
//           arrival: {
//             airport: flight.DestinationAirport || 'Bangkok',
//             iata: flight.Airport || 'BKK',
//             scheduled: flight.ScheduledTime || now,
//             estimated: flight.EstimatedTime,
//             terminal: flight.Terminal,
//             baggage: flight.BaggageClaim,
//             delay: flight.DelayMinutes || 0
//           },
//           status: flight.FlightStatus || 'scheduled',
//           lastUpdated: now,
//           aircraft: {
//             registration: flight.Aircraft,
//             icao: flight.Aircraft,
//             iata: flight.Aircraft
//           }
//         }))
//         setLiveFlights(transformedFlights)
//       }
      
//       setLastUpdate(new Date())
//     } catch (err) {
//       console.error('Error loading live flights:', err)
//       setError('Failed to load live flight data')
//       setConnectionStatus('disconnected')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const loadFlightData = useCallback(async (query: string, type: 'flight' | 'route') => {
//     setLoading(true)
//     setError(null)
//     setConnectionStatus('connected')
    
//     try {
//       let result
      
//       if (type === 'flight') {
//         // Extract airline code and flight number (e.g., TG123 -> TG, 123)
//         const airlineMatch = query.match(/^([A-Za-z]{2})?(\d+)$/)
//         if (!airlineMatch) throw new Error('Invalid flight number format')
        
//         const airline = airlineMatch[1] || undefined
//         const flightNum = airlineMatch[2]
        
//         result = await flightTrackerApi.searchFlights({
//           flight_number: flightNum,
//           airline: airline
//         })
//       } else if (type === 'route' && origin && destination) {
//         result = await flightTrackerApi.searchFlights({
//           departure_airport: origin,
//           arrival_airport: destination,
//           date: new Date().toISOString().split('T')[0]
//         })
//       } else {
//         throw new Error('Please provide valid search criteria')
//       }
      
//       if (result?.data?.[0]) {
//         const rawFlight = result.data[0]
//         // Transform cached data structure to match widget expectations
//         const transformedFlight = {
//           flight: {
//             iata: rawFlight.FlightNumber || rawFlight.flight?.iata || 'N/A',
//             icao: rawFlight.FlightNumber || rawFlight.flight?.icao || 'N/A',
//             number: rawFlight.FlightNumber || rawFlight.flight?.number || 'N/A',
//             airline: rawFlight.Airline || rawFlight.flight?.airline || 'Unknown Airline'
//           },
//           departure: {
//             airport: rawFlight.OriginAirport || rawFlight.departure?.airport || 'Unknown',
//             iata: rawFlight.Airport || rawFlight.departure?.iata || 'BKK',
//             scheduled: rawFlight.ScheduledTime || rawFlight.departure?.scheduled || new Date().toISOString(),
//             estimated: rawFlight.EstimatedTime || rawFlight.departure?.estimated,
//             terminal: rawFlight.Terminal || rawFlight.departure?.terminal,
//             gate: rawFlight.Gate || rawFlight.departure?.gate,
//             delay: rawFlight.DelayMinutes || rawFlight.departure?.delay || 0
//           },
//           arrival: {
//             airport: rawFlight.DestinationAirport || rawFlight.arrival?.airport || 'Bangkok',
//             iata: rawFlight.Airport || rawFlight.arrival?.iata || 'BKK',
//             scheduled: rawFlight.ScheduledTime || rawFlight.arrival?.scheduled || new Date().toISOString(),
//             estimated: rawFlight.EstimatedTime || rawFlight.arrival?.estimated,
//             terminal: rawFlight.Terminal || rawFlight.arrival?.terminal,
//             baggage: rawFlight.BaggageClaim || rawFlight.arrival?.baggage,
//             delay: rawFlight.DelayMinutes || rawFlight.arrival?.delay || 0
//           },
//           status: rawFlight.FlightStatus || rawFlight.status || 'scheduled',
//           lastUpdated: new Date().toISOString(),
//           aircraft: {
//             registration: rawFlight.Aircraft || rawFlight.aircraft?.registration,
//             icao: rawFlight.Aircraft || rawFlight.aircraft?.icao,
//             iata: rawFlight.Aircraft || rawFlight.aircraft?.iata
//           }
//         }
//         setFlightData(transformedFlight)
//         setViewMode('search')
//       } else {
//         throw new Error('No flights found')
//       }
      
//       setLastUpdate(new Date())
//     } catch (err) {
//       console.error('Error fetching flight data:', err)
//       setError(err instanceof Error ? err.message : 'An unknown error occurred')
//       setConnectionStatus('disconnected')
//     } finally {
//       setLoading(false)
//     }
//   }, [origin, destination])

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (searchType === 'flight' && flightNumber.trim()) {
//       loadFlightData(flightNumber.trim(), 'flight')
//     } else if (searchType === 'route' && origin && destination) {
//       loadFlightData(`${origin}-${destination}`, 'route')
//     } else {
//       setError('Please provide all required search criteria')
//     }
//   }

//   const refreshData = useCallback(() => {
//     if (viewMode === 'live') {
//       loadLiveFlights()
//     } else if (flightData) {
//       if (searchType === 'flight' && flightNumber) {
//         loadFlightData(flightNumber, 'flight')
//       } else if (searchType === 'route' && origin && destination) {
//         loadFlightData(`${origin}-${destination}`, 'route')
//       }
//     }
//   }, [viewMode, flightData, searchType, flightNumber, origin, destination, loadFlightData, loadLiveFlights])

//   // Load service status
//   const loadServiceStatus = useCallback(async () => {
//     try {
//       const status = await flightTrackerApi.getServiceStatus()
//       setServiceStatus(status)
//     } catch (err) {
//       console.warn('Could not load service status:', err)
//     }
//   }, [])

//   // Load initial data
//   useEffect(() => {
//     loadLiveFlights()
//     loadServiceStatus()
    
//     // Set up auto-refresh every 30 seconds
//     const interval = setInterval(() => {
//       refreshData()
//     }, 30000)
    
//     return () => clearInterval(interval)
//   }, [loadLiveFlights, loadServiceStatus, refreshData])

//   const formatTime = (dateString?: string) => {
//     if (!dateString) return '--:--'
//     const date = new Date(dateString)
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
//   }

//   const getDelayMinutes = (scheduled: string, estimated?: string) => {
//     if (!estimated) return 0
//     const scheduledTime = new Date(scheduled).getTime()
//     const estimatedTime = new Date(estimated).getTime()
//     return Math.round((estimatedTime - scheduledTime) / (1000 * 60))
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'scheduled':
//         return 'bg-blue-100 text-blue-800'
//       case 'active':
//       case 'in_air':
//         return 'bg-green-100 text-green-800'
//       case 'landed':
//         return 'bg-gray-100 text-gray-800'
//       case 'delayed':
//       case 'incident':
//         return 'bg-red-100 text-red-800'
//       case 'boarding':
//         return 'bg-yellow-100 text-yellow-800'
//       case 'cancelled':
//         return 'bg-gray-100 text-gray-500 line-through'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const formatStatus = (status: string) => {
//     return status
//       .replace(/_/g, ' ')
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ')
//   }

//   // Filter live flights based on status
//   const filteredLiveFlights = statusFilter === 'all' 
//     ? liveFlights 
//     : liveFlights.filter(flight => flight.status === statusFilter)

//   return (
//     <>
//       {/* Main Widget - Clickable to expand */}
//       <div 
//         className={`${className} h-full flex flex-col bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 rounded-xl overflow-hidden relative shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition-shadow duration-300`}
//         onClick={() => setShowExpandedModal(true)}
//       >
//       {/* Sky Background Icons - Enhanced */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Top Row */}
//         <Cloud className="absolute top-2 left-2 w-4 h-4 text-blue-200 animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
//         <Sun className="absolute top-3 right-12 w-5 h-5 text-yellow-200 animate-spin" style={{ animationDelay: '1s', animationDuration: '8s' }} />
//         <Stars className="absolute top-4 right-4 w-4 h-4 text-blue-300 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
//         <Wind className="absolute top-6 left-16 w-4 h-4 text-cyan-200 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
        
//         {/* Middle Row */}
//         <Plane className="absolute top-1/3 left-4 w-6 h-6 text-blue-200 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
//         <Rocket className="absolute top-1/3 right-8 w-5 h-5 text-orange-200 animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
//         <Satellite className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-200 animate-spin" style={{ animationDelay: '2.5s', animationDuration: '6s' }} />
//         <Radar className="absolute top-1/2 left-1/4 w-5 h-5 text-green-200 animate-ping" style={{ animationDelay: '1.2s', animationDuration: '3s' }} />
        
//         {/* Bottom Row */}
//         <Navigation className="absolute bottom-12 left-6 w-5 h-5 text-sky-200 animate-ping" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
//         <Compass className="absolute bottom-8 right-6 w-5 h-5 text-cyan-200 animate-spin" style={{ animationDelay: '1.8s', animationDuration: '6s' }} />
//         <Globe className="absolute bottom-6 left-12 w-4 h-4 text-emerald-200 animate-pulse" style={{ animationDelay: '2.2s', animationDuration: '5s' }} />
//         <Gauge className="absolute bottom-4 right-12 w-4 h-4 text-indigo-200 animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '2.5s' }} />
        
//         {/* Additional Atmospheric Icons */}
//         <Mountain className="absolute bottom-2 left-2 w-6 h-6 text-gray-300 animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }} />
//         <Waves className="absolute bottom-3 right-2 w-5 h-5 text-blue-300 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
//         <Sunrise className="absolute top-8 left-8 w-4 h-4 text-orange-200 animate-pulse" style={{ animationDelay: '2.8s', animationDuration: '6s' }} />
//         <Sunset className="absolute top-12 right-6 w-4 h-4 text-red-200 animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '7s' }} />
//         <Thermometer className="absolute top-16 left-12 w-4 h-4 text-amber-200 animate-bounce" style={{ animationDelay: '1.9s', animationDuration: '3s' }} />
        
//         {/* Scattered Small Icons */}
//         <Zap className="absolute top-20 left-20 w-3 h-3 text-yellow-300 animate-ping" style={{ animationDelay: '0.6s', animationDuration: '2s' }} />
//         <Eye className="absolute top-24 right-16 w-3 h-3 text-blue-400 animate-pulse" style={{ animationDelay: '2.3s', animationDuration: '4s' }} />
//         <Moon className="absolute top-28 left-24 w-3 h-3 text-indigo-300 animate-spin" style={{ animationDelay: '1.1s', animationDuration: '10s' }} />
//       </div>

//       {/* Clean Header */}
//       <div className="relative p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-sm">
//               <Plane className="w-6 h-6 text-white animate-pulse" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Flight Tracker</h2>
//               <p className="text-xs text-gray-500">Live flight information</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//               {connectionStatus === 'connected' ? (
//               <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
//             ) : (
//               <WifiOff className="w-4 h-4 text-red-500" />
//             )}
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               onClick={(e) => {
//                 e.stopPropagation()
//                 refreshData()
//               }}
//               disabled={loading}
//               className="h-8 px-2"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//             </Button>
//           </div>
//         </div>
//             </div>
            
//       {/* Clean Content Area */}
//       <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//         <div className="p-4 space-y-4">
//           {/* View Mode Toggle */}
//           <div className="flex gap-2">
//             <Button 
//               variant={viewMode === 'search' ? 'default' : 'outline'}
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setViewMode('search')
//               }}
//               className={viewMode === 'search' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
//             >
//               <Search className="h-4 w-4 mr-2" />
//               Search
//             </Button>
//             <Button 
//               variant={viewMode === 'live' ? 'default' : 'outline'}
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setViewMode('live')
//                 loadLiveFlights()
//               }}
//               className={viewMode === 'live' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
//             >
//               <List className="h-4 w-4 mr-2" />
//               Live
//             </Button>
//               </div>

//           {/* Search Form */}
//           {viewMode === 'search' && (
//             <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
//               <form onSubmit={handleSearch} className="space-y-4" onClick={(e) => e.stopPropagation()}>
//                 <div className="flex flex-wrap items-stretch gap-2">
//                   <Select 
//                     value={searchType} 
//                     onValueChange={(value: 'flight' | 'route') => setSearchType(value)}
//                   >
//                     <SelectTrigger 
//                       className="w-32 bg-white/80 border-blue-200"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <SelectValue placeholder="Search by" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="flight">Flight #</SelectItem>
//                       <SelectItem value="route">Route</SelectItem>
//                     </SelectContent>
//                   </Select>
                
//                   {searchType === 'flight' ? (
//                     <Input
//                       placeholder="e.g., TG123"
//                       value={flightNumber}
//                       onChange={(e) => setFlightNumber(e.target.value)}
//                       onClick={(e) => e.stopPropagation()}
//                       className="flex-1 bg-white/80 border-blue-200"
//                     />
//                   ) : (
//                     <div className="flex-1 min-w-0 flex gap-2 flex-wrap">
//                       <Select 
//                         value={origin}
//                         onValueChange={setOrigin}
//                       >
//                         <SelectTrigger 
//                           className="flex-1 min-w-0 bg-white/80 border-blue-200"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <SelectValue placeholder="From" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {airports.map((airport) => (
//                             <SelectItem key={airport.value} value={airport.value}>
//                               {airport.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
                      
//                       <ChevronRight className="w-4 h-4 text-blue-400 self-center" />
                      
//                       <Select 
//                         value={destination}
//                         onValueChange={setDestination}
//                       >
//                         <SelectTrigger 
//                           className="flex-1 min-w-0 bg-white/80 border-blue-200"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <SelectValue placeholder="To" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {airports.map((airport) => (
//                             <SelectItem key={airport.value} value={airport.value}>
//                               {airport.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//               </div>
//             )}
            
//             <Button 
//                     type="submit"
//                     disabled={loading || (searchType === 'flight' ? !flightNumber.trim() : !origin || !destination)}
//                     onClick={(e) => e.stopPropagation()}
//                     className="shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
//                   >
//                     <Search className="h-4 w-4" />
//                   </Button>
//               </div>
              
//                 {/* Popular Routes */}
//                 <div className="flex flex-wrap gap-2 text-sm">
//                   <span className="text-gray-500">Popular:</span>
//                   {popularRoutes.map((route, index) => (
//                     <Button 
//                       key={index} 
//                       type="button"
//               variant="ghost" 
//               size="sm" 
//                       className="h-6 text-xs hover:bg-blue-100"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         setOrigin(route.from.match(/\(([A-Z]{3})\)/)?.[1] || '')
//                         setDestination(route.to.match(/\(([A-Z]{3})\)/)?.[1] || '')
//                         setSearchType('route')
//                       }}
//                     >
//                       {route.from.split(' (')[0]} → {route.to.split(' (')[0]}
//             </Button>
//                   ))}
//           </div>
//               </form>
//         </div>
//           )}

//           {/* Live Flights Filter */}
//           {viewMode === 'live' && (
//             <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
//               <Filter className="h-4 w-4 text-blue-500" />
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger 
//                   className="w-48 bg-white/80 border-blue-200"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Flights</SelectItem>
//                   <SelectItem value="scheduled">Scheduled</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="delayed">Delayed</SelectItem>
//                   <SelectItem value="landed">Landed</SelectItem>
//                   <SelectItem value="cancelled">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
          
//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
//               <span className="text-sm">{error}</span>
//             </div>
//           )}
          
//           {/* Loading State */}
//           {loading && (
//             <div className="flex justify-center p-8">
//               <div className="flex flex-col items-center gap-2">
//                 <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
//                 <span className="text-sm text-gray-500">Loading flight data...</span>
//               </div>
//             </div>
//           )}
        
//           {/* Flight Details View */}
//           {!loading && viewMode === 'search' && flightData && (
//             <div className="space-y-4">
//               <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">Flight {flightData.flight?.iata || flightData.flight?.number || 'N/A'}</h3>
//                   <div className="flex items-center gap-2">
//                     <Badge variant="outline" className={getStatusColor(flightData.status)}>
//                       {formatStatus(flightData.status)}
//                     </Badge>
//                     {flightData.live && (
//                       <Badge variant="outline" className="bg-green-100 text-green-800">
//                         <Eye className="w-3 h-3 mr-1" />
//                         Live
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
            
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Departure */}
//                   <div className="bg-white/40 p-4 rounded-lg border border-blue-100">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Navigation className="w-4 h-4 text-blue-500" />
//                       <span className="text-sm font-medium text-gray-700">Departure</span>
//                     </div>
//                     <div className="text-xl font-bold text-gray-900">{flightData.departure.airport}</div>
//                     <div className="text-sm text-gray-500">{flightData.departure.iata}</div>
                    
//                     <div className="mt-3 space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Scheduled:</span>
//                         <span className="font-medium">{formatTime(flightData.departure.scheduled)}</span>
//                       </div>
//                       {flightData.departure.estimated && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-500">Estimated:</span>
//                           <div className="flex items-center">
//                             <span className={flightData.departure.delay ? 'text-amber-600 font-medium' : 'font-medium'}>
//                               {formatTime(flightData.departure.estimated)}
//                             </span>
//                             {flightData.departure.delay && (
//                               <span className="ml-1 text-xs text-amber-600">
//                                 +{getDelayMinutes(flightData.departure.scheduled, flightData.departure.estimated)}m
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                       {flightData.departure.terminal && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-500">Terminal:</span>
//                           <span className="font-medium">{flightData.departure.terminal}</span>
//                         </div>
//                       )}
//                       {flightData.departure.gate && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-500">Gate:</span>
//                           <span className="font-medium">{flightData.departure.gate}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Arrival */}
//                   <div className="bg-white/40 p-4 rounded-lg border border-blue-100">
//                     <div className="flex items-center gap-2 mb-2">
//                       <MapPin className="w-4 h-4 text-green-500" />
//                       <span className="text-sm font-medium text-gray-700">Arrival</span>
//                     </div>
//                     <div className="text-xl font-bold text-gray-900">{flightData.arrival.airport}</div>
//                     <div className="text-sm text-gray-500">{flightData.arrival.iata}</div>
                    
//                     <div className="mt-3 space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Scheduled:</span>
//                         <span className="font-medium">{formatTime(flightData.arrival.scheduled)}</span>
//                       </div>
//                       {flightData.arrival.estimated && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-500">Estimated:</span>
//                           <div className="flex items-center">
//                             <span className={flightData.arrival.delay ? 'text-amber-600 font-medium' : 'font-medium'}>
//                               {formatTime(flightData.arrival.estimated)}
//                             </span>
//                             {flightData.arrival.delay && (
//                               <span className="ml-1 text-xs text-amber-600">
//                                 +{getDelayMinutes(flightData.arrival.scheduled, flightData.arrival.estimated)}m
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                       {flightData.arrival.terminal && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-500">Terminal:</span>
//                           <span className="font-medium">{flightData.arrival.terminal}</span>
//                         </div>
//                       )}
//                       {flightData.arrival.baggage && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-500">Baggage:</span>
//                           <span className="font-medium">{flightData.arrival.baggage}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}


//           {/* Live Flights List */}
//           {!loading && viewMode === 'live' && (
//             <div className="space-y-4">
//               <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">Live Flights - Bangkok (BKK)</h3>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500">
//                       {filteredLiveFlights.length} flights
//                     </span>
//                     {serviceStatus?.api_limit_reached && (
//                       <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
//                         Cached
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
                
//                 {filteredLiveFlights.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <Plane className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                     <p>No flights found for the selected filter</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 max-h-80 overflow-y-auto">
//                     {filteredLiveFlights.slice(0, 15).map((flight, index) => (
//                       <div key={index} className="bg-white/40 p-3 rounded-lg border border-blue-100 hover:bg-white/60 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-1">
//                               <span className="font-semibold text-gray-900">{flight.flight.iata}</span>
//                               <Badge variant="outline" className={getStatusColor(flight.status)}>
//                                 {formatStatus(flight.status)}
//                               </Badge>
//                             </div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               {flight.departure.airport} → {flight.arrival.airport}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {flight.flight.airline}
//                             </div>
//                           </div>
//                           <div className="text-right text-sm">
//                             <div className="font-medium text-gray-900">{formatTime(flight.departure.scheduled)}</div>
//                             <div className="text-xs text-gray-500">
//                               {flight.departure.terminal && `T${flight.departure.terminal}`}
//                               {flight.departure.gate && ` • Gate ${flight.departure.gate}`}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       </div>

//       {/* Expanded Modal */}
//       {showExpandedModal && (
//         <Dialog open={showExpandedModal} onOpenChange={setShowExpandedModal}>
//           <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden z-[100]">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Plane className="w-6 h-6 text-blue-500 animate-pulse" />
//                 Flight Tracker - Full View
//               </DialogTitle>
//             </DialogHeader>
//             <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
//               {/* Expanded widget content */}
//               <div className="space-y-6">
//         {/* View Mode Toggle */}
//         <div className="flex gap-2">
//           <Button 
//             variant={viewMode === 'search' ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => setViewMode('search')}
//                     className={viewMode === 'search' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
//           >
//             <Search className="h-4 w-4 mr-2" />
//             Search Flight
//           </Button>
//           <Button 
//             variant={viewMode === 'live' ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => {
//               setViewMode('live')
//               loadLiveFlights()
//             }}
//                     className={viewMode === 'live' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
//           >
//             <List className="h-4 w-4 mr-2" />
//             Live Flights
//           </Button>
//         </div>

//         {/* Search Form */}
//         {viewMode === 'search' && (
//                   <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg border border-blue-100">
//             <form onSubmit={handleSearch} className="space-y-4">
//                       <div className="flex gap-2">
//                 <Select 
//                   value={searchType} 
//                   onValueChange={(value: 'flight' | 'route') => setSearchType(value)}
//                 >
//                           <SelectTrigger className="w-40 bg-white/80 border-blue-200">
//                     <SelectValue placeholder="Search by" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="flight">Flight #</SelectItem>
//                     <SelectItem value="route">Route</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 {searchType === 'flight' ? (
//                     <Input
//                             placeholder="e.g., TG123"
//                       value={flightNumber}
//                       onChange={(e) => setFlightNumber(e.target.value)}
//                             className="flex-1 bg-white/80 border-blue-200"
//                     />
//                 ) : (
//                           <div className="flex-1 flex gap-2">
//                     <Select 
//                       value={origin}
//                       onValueChange={setOrigin}
//                     >
//                               <SelectTrigger className="flex-1 bg-white/80 border-blue-200">
//                         <SelectValue placeholder="From" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {airports.map((airport) => (
//                           <SelectItem key={airport.value} value={airport.value}>
//                             {airport.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
                            
//                             <ChevronRight className="w-4 h-4 text-blue-400 self-center" />
                    
//                     <Select 
//                       value={destination}
//                       onValueChange={setDestination}
//                     >
//                               <SelectTrigger className="flex-1 bg-white/80 border-blue-200">
//                         <SelectValue placeholder="To" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {airports.map((airport) => (
//                           <SelectItem key={airport.value} value={airport.value}>
//                             {airport.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
                
//                 <Button 
//                   type="submit"
//                   disabled={loading || (searchType === 'flight' ? !flightNumber.trim() : !origin || !destination)}
//                           className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
//                 >
//                           <Search className="h-4 w-4" />
//                 </Button>
//               </div>
              
//               {/* Popular Routes */}
//               <div className="flex flex-wrap gap-2 text-sm">
//                         <span className="text-gray-500">Popular:</span>
//                 {popularRoutes.map((route, index) => (
//                   <Button 
//                     key={index} 
//                     type="button"
//                     variant="ghost" 
//                     size="sm" 
//                             className="h-6 text-xs hover:bg-blue-100"
//                     onClick={() => {
//                       setOrigin(route.from.match(/\(([A-Z]{3})\)/)?.[1] || '')
//                       setDestination(route.to.match(/\(([A-Z]{3})\)/)?.[1] || '')
//                       setSearchType('route')
//                     }}
//                   >
//                     {route.from.split(' (')[0]} → {route.to.split(' (')[0]}
//                   </Button>
//                 ))}
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Live Flights Filter */}
//         {viewMode === 'live' && (
//           <div className="flex items-center gap-2">
//                     <Filter className="h-4 w-4 text-blue-500" />
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//                       <SelectTrigger className="w-48 bg-white/80 border-blue-200">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Flights</SelectItem>
//                 <SelectItem value="scheduled">Scheduled</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="delayed">Delayed</SelectItem>
//                 <SelectItem value="landed">Landed</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         )}
        
//         {/* Error Message */}
//         {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
//                     <span className="text-sm">{error}</span>
//           </div>
//         )}
        
//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center p-8">
//                     <div className="flex flex-col items-center gap-2">
//                       <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
//                       <span className="text-sm text-gray-500">Loading flight data...</span>
//                     </div>
//           </div>
//         )}
        
//         {/* Flight Details View */}
//         {!loading && viewMode === 'search' && flightData && (
//           <div className="space-y-4">
//                     <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg border border-blue-100">
//                       <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-2xl font-semibold text-gray-900">Flight {flightData.flight?.iata || flightData.flight?.number || 'N/A'}</h3>
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className={getStatusColor(flightData.status)}>
//                   {formatStatus(flightData.status)}
//                 </Badge>
//                 {flightData.live && (
//                   <Badge variant="outline" className="bg-green-100 text-green-800">
//                               <Eye className="w-3 h-3 mr-1" />
//                               Live
//                   </Badge>
//                 )}
//               </div>
//             </div>
            
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Departure */}
//                         <div className="bg-white/40 p-6 rounded-lg border border-blue-100">
//                           <div className="flex items-center gap-2 mb-4">
//                             <Navigation className="w-5 h-5 text-blue-500" />
//                             <span className="text-lg font-medium text-gray-700">Departure</span>
//                           </div>
//                           <div className="text-2xl font-bold text-gray-900 mb-2">{flightData.departure.airport}</div>
//                           <div className="text-lg text-gray-500 mb-4">{flightData.departure.iata}</div>
                          
//                           <div className="space-y-3">
//                             <div className="flex justify-between text-base">
//                               <span className="text-gray-500">Scheduled:</span>
//                               <span className="font-medium">{formatTime(flightData.departure.scheduled)}</span>
//                   </div>
//                   {flightData.departure.estimated && (
//                               <div className="flex justify-between text-base">
//                                 <span className="text-gray-500">Estimated:</span>
//                       <div className="flex items-center">
//                                   <span className={flightData.departure.delay ? 'text-amber-600 font-medium' : 'font-medium'}>
//                           {formatTime(flightData.departure.estimated)}
//                         </span>
//                         {flightData.departure.delay && (
//                                     <span className="ml-2 text-sm text-amber-600">
//                             +{getDelayMinutes(flightData.departure.scheduled, flightData.departure.estimated)}m
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                   {flightData.departure.terminal && (
//                               <div className="flex justify-between text-base">
//                                 <span className="text-gray-500">Terminal:</span>
//                                 <span className="font-medium">{flightData.departure.terminal}</span>
//                     </div>
//                   )}
//                   {flightData.departure.gate && (
//                               <div className="flex justify-between text-base">
//                                 <span className="text-gray-500">Gate:</span>
//                                 <span className="font-medium">{flightData.departure.gate}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Arrival */}
//                         <div className="bg-white/40 p-6 rounded-lg border border-blue-100">
//                           <div className="flex items-center gap-2 mb-4">
//                             <MapPin className="w-5 h-5 text-green-500" />
//                             <span className="text-lg font-medium text-gray-700">Arrival</span>
//                           </div>
//                           <div className="text-2xl font-bold text-gray-900 mb-2">{flightData.arrival.airport}</div>
//                           <div className="text-lg text-gray-500 mb-4">{flightData.arrival.iata}</div>
                          
//                           <div className="space-y-3">
//                             <div className="flex justify-between text-base">
//                               <span className="text-gray-500">Scheduled:</span>
//                               <span className="font-medium">{formatTime(flightData.arrival.scheduled)}</span>
//                   </div>
//                   {flightData.arrival.estimated && (
//                               <div className="flex justify-between text-base">
//                                 <span className="text-gray-500">Estimated:</span>
//                       <div className="flex items-center">
//                                   <span className={flightData.arrival.delay ? 'text-amber-600 font-medium' : 'font-medium'}>
//                           {formatTime(flightData.arrival.estimated)}
//                         </span>
//                         {flightData.arrival.delay && (
//                                     <span className="ml-2 text-sm text-amber-600">
//                             +{getDelayMinutes(flightData.arrival.scheduled, flightData.arrival.estimated)}m
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                   {flightData.arrival.terminal && (
//                               <div className="flex justify-between text-base">
//                                 <span className="text-gray-500">Terminal:</span>
//                                 <span className="font-medium">{flightData.arrival.terminal}</span>
//                     </div>
//                   )}
//                   {flightData.arrival.baggage && (
//                               <div className="flex justify-between text-base">
//                                 <span className="text-gray-500">Baggage:</span>
//                                 <span className="font-medium">{flightData.arrival.baggage}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//                     </div>
//           </div>
//         )}

//         {/* Live Flights List */}
//         {!loading && viewMode === 'live' && (
//                   <div className="space-y-4">
//                     <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg border border-blue-100">
//                       <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-2xl font-semibold text-gray-900">Live Flights - Bangkok (BKK)</h3>
//               <div className="flex items-center gap-2">
//                           <span className="text-base text-gray-500">
//                   {filteredLiveFlights.length} flights
//                 </span>
//                 {serviceStatus?.api_limit_reached && (
//                             <Badge variant="outline" className="bg-blue-100 text-blue-800">
//                               Cached
//                   </Badge>
//                 )}
//               </div>
//             </div>
            
//             {filteredLiveFlights.length === 0 ? (
//                         <div className="text-center py-12 text-gray-500">
//                           <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                           <p className="text-lg">No flights found for the selected filter</p>
//               </div>
//             ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
//                           {filteredLiveFlights.slice(0, 30).map((flight, index) => (
//                             <div key={index} className="bg-white/40 p-4 rounded-lg border border-blue-100 hover:bg-white/60 transition-colors">
//                               <div className="flex justify-between items-start mb-2">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-semibold text-gray-900">{flight.flight.iata}</span>
//                           <Badge variant="outline" className={getStatusColor(flight.status)}>
//                             {formatStatus(flight.status)}
//                           </Badge>
//                         </div>
//                               </div>
//                               <div className="text-sm text-gray-600 mb-2">
//                           {flight.departure.airport} → {flight.arrival.airport}
//                         </div>
//                               <div className="text-xs text-gray-500 mb-2">
//                                 {flight.flight.airline}
//                         </div>
//                               <div className="flex justify-between items-center text-sm">
//                                 <span className="font-medium text-gray-900">{formatTime(flight.departure.scheduled)}</span>
//                                 <span className="text-xs text-gray-500">
//                                   {flight.departure.terminal && `T${flight.departure.terminal}`}
//                           {flight.departure.gate && ` • Gate ${flight.departure.gate}`}
//                                 </span>
//                         </div>
//                       </div>
//                           ))}
//                     </div>
//                       )}
//                   </div>
//               </div>
//             )}
//           </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//         )}
//     </>
//   )
// }

// export default FlightTrackerWidget


'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plane, Search, Clock, MapPin, RefreshCw, Wifi, WifiOff, List, Filter, Cloud, Wind, Navigation, Compass, Zap, Globe, Eye, ChevronRight, Sun, Moon, Stars, Radar, Satellite, Rocket, Mountain, Waves, Sunrise, Sunset, Thermometer, Gauge, Paperclip } from "lucide-react"
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
  const [showExpandedModal, setShowExpandedModal] = useState(false)

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

  const loadServiceStatus = useCallback(async () => {
    try {
      const status = await flightTrackerApi.getServiceStatus()
      setServiceStatus(status)
    } catch (err) {
      console.warn('Could not load service status:', err)
    }
  }, [])

  useEffect(() => {
    loadLiveFlights()
    loadServiceStatus()
    
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

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-500/20'
      case 'active':
      case 'in_air':
        return 'bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/20'
      case 'landed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30 shadow-gray-500/10'
      case 'delayed':
      case 'incident':
        return 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/20'
      case 'boarding':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20'
      case 'cancelled':
        return 'bg-gray-600/10 text-gray-500 border-gray-600/30 line-through'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30 shadow-gray-500/10'
    }
  }

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const filteredLiveFlights = statusFilter === 'all' 
    ? liveFlights 
    : liveFlights.filter(flight => flight.status === statusFilter)

  return (
    <>
      <div 
        className={`${className} h-full flex flex-col bg-slate-900 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-sky-900/40 rounded-2xl overflow-hidden relative shadow-2xl shadow-slate-900/50 border border-white/10 cursor-pointer group transition-all duration-500 ease-in-out`}
        onClick={() => setShowExpandedModal(true)}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500">
            <Sun className="absolute -top-4 -left-4 w-24 h-24 text-yellow-500/20 animate-spin" style={{ animationDuration: '20s' }} />
            <Cloud className="absolute top-10 right-10 w-32 h-32 text-white/10 animate-pulse" style={{ animationDuration: '8s' }} />
            <Plane className="absolute bottom-20 left-10 w-16 h-16 text-sky-400/20 -rotate-45 animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
            <Stars className="absolute bottom-5 right-5 w-20 h-20 text-indigo-400/20 animate-pulse" style={{ animationDelay: '1s', animationDuration: '10s' }} />
        </div>

        <div className="relative p-2 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg shadow-lg shadow-sky-500/20">
                        <Plane className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wider">Flight Tracker</h2>
                        <p className="text-xs text-sky-300/70">Real-time status</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {connectionStatus === 'connected' ? (
                        <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
                    ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); refreshData(); }}
                        disabled={loading}
                        className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white transition-all rounded-full"
                    >
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
            
        <div className="flex-1 overflow-y-auto p-1.5 space-y-3">
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" onClick={() => setViewMode('search')} className={`flex-1 transition-all duration-300 text-xs ${viewMode === 'search' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'}`}>
                    <Search className="h-3 w-3 mr-1" /> Search
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setViewMode('live'); loadLiveFlights(); }} className={`flex-1 transition-all duration-300 text-xs ${viewMode === 'live' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'}`}>
                    <List className="h-3 w-3 mr-1" /> Live
                </Button>
            </div>

            {viewMode === 'search' && (
                <div className="bg-black/20 backdrop-blur-md p-3 rounded-lg border border-white/10 animate-fade-in-up">
                    <form onSubmit={handleSearch} className="space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={searchType} onValueChange={(value: 'flight' | 'route') => setSearchType(value)}>
                                <SelectTrigger className="w-28 bg-slate-800/70 border-white/20 text-white text-xs">
                                    <SelectValue placeholder="Search by" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20 text-white">
                                    <SelectItem value="flight">Flight #</SelectItem>
                                    <SelectItem value="route">Route</SelectItem>
                                </SelectContent>
                            </Select>
                        
                            {searchType === 'flight' ? (
                                <Input placeholder="e.g., TG123" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} className="flex-1 bg-slate-800/70 border-white/20 text-white placeholder:text-slate-400 focus:ring-sky-500 focus:border-sky-500 text-xs h-8" />
                            ) : (
                                <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                                    <Select value={origin} onValueChange={setOrigin}>
                                        <SelectTrigger className="bg-slate-800/70 border-white/20 text-white text-xs h-8"><SelectValue placeholder="From" /></SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/20 text-white">{airports.map((a) => <SelectItem key={a.value} value={a.value}>{a.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Plane className="w-4 h-4 text-sky-400 justify-self-center" />
                                    <Select value={destination} onValueChange={setDestination}>
                                        <SelectTrigger className="bg-slate-800/70 border-white/20 text-white text-xs h-8"><SelectValue placeholder="To" /></SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/20 text-white">{airports.map((a) => <SelectItem key={a.value} value={a.value}>{a.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            )}
                            <Button type="submit" disabled={loading} size="icon" className="shrink-0 bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg hover:shadow-sky-500/30 transition-all w-8 h-8">
                                <Search className="h-3 w-3" />
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {viewMode === 'live' && (
                <div className="flex items-center gap-2 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                    <Filter className="h-4 w-4 text-sky-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48 bg-slate-800/70 border-white/20 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/20 text-white">
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
            
            {error && <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm animate-fade-in-up">{error}</div>}
            
            {loading && (
                <div className="flex justify-center p-8"><div className="flex flex-col items-center gap-2 text-sky-300">
                    <RefreshCw className="h-8 w-8 animate-spin" /><span className="text-sm">Loading flight data...</span>
                </div></div>
            )}
        
            {!loading && viewMode === 'search' && flightData && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-lg border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Flight {flightData.flight?.iata || 'N/A'}</h3>
                            <Badge variant="outline" className={`border text-xs shadow-sm ${getStatusClasses(flightData.status)}`}>{formatStatus(flightData.status)}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            <div className="text-center md:text-left"><p className="text-sm text-slate-400">Departure</p><p className="text-xl font-bold text-white truncate">{flightData.departure.airport}</p><p className="text-lg text-sky-400">{flightData.departure.iata}</p></div>
                            <div className="flex justify-center items-center"><div className="w-full md:w-px h-px md:h-16 bg-gradient-to-b from-transparent via-sky-500 to-transparent"></div></div>
                            <div className="text-center md:text-right"><p className="text-sm text-slate-400">Arrival</p><p className="text-xl font-bold text-white truncate">{flightData.arrival.airport}</p><p className="text-lg text-sky-400">{flightData.arrival.iata}</p></div>
                        </div>
                        <div className="w-1/2 mx-auto my-2 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div>
                                <div className="flex justify-between"><span className="text-slate-400">Scheduled:</span><span className="font-medium text-white">{formatTime(flightData.departure.scheduled)}</span></div>
                                {flightData.departure.estimated && <div className="flex justify-between"><span className="text-slate-400">Est:</span><span className={flightData.departure.delay ? 'text-yellow-400 font-medium' : 'font-medium text-white'}>{formatTime(flightData.departure.estimated)}</span></div>}
                                {flightData.departure.gate && <div className="flex justify-between"><span className="text-slate-400">Gate:</span><span className="font-medium text-white">{flightData.departure.gate}</span></div>}
                            </div>
                            <div className="text-right">
                                <div className="flex justify-between"><span className="text-slate-400">Scheduled:</span><span className="font-medium text-white">{formatTime(flightData.arrival.scheduled)}</span></div>
                                {flightData.arrival.estimated && <div className="flex justify-between"><span className="text-slate-400">Est:</span><span className={flightData.arrival.delay ? 'text-yellow-400 font-medium' : 'font-medium text-white'}>{formatTime(flightData.arrival.estimated)}</span></div>}
                                {flightData.arrival.baggage && <div className="flex justify-between"><span className="text-slate-400">Baggage:</span><span className="font-medium text-white">{flightData.arrival.baggage}</span></div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && viewMode === 'live' && (
                <div className="bg-black/20 backdrop-blur-md rounded-lg border border-white/10 animate-fade-in-up">
                    <div className="p-3 flex justify-between items-center"><h3 className="text-sm font-semibold text-white">Live Flights</h3><span className="text-xs text-slate-400">{filteredLiveFlights.length} flights</span></div>
                    {filteredLiveFlights.length === 0 ? (
                        <div className="text-center py-6 text-slate-500"><Plane className="w-6 h-6 mx-auto mb-2" /><p className="text-sm">No flights found</p></div>
                    ) : (
                        <div className="space-y-1 p-2 max-h-60 overflow-y-auto">
                            {filteredLiveFlights.slice(0, 12).map((flight, index) => (
                                <div key={index} className="bg-slate-800/50 p-2 rounded-lg border border-transparent hover:border-sky-500/50 hover:bg-slate-800/80 transition-all duration-300" style={{ animation: `fade-in-up 0.5s ${index * 0.05}s ease-out both`}}>
                                    <div className="flex justify-between items-center text-xs">
                                        <div className="flex-1 min-w-0"><p className="font-bold text-white truncate">{flight.flight.iata}</p><p className="text-xs text-slate-400 truncate">{flight.departure.airport} → {flight.arrival.airport}</p></div>
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            <span className="font-mono text-slate-300 w-10 text-right">{formatTime(flight.departure.scheduled)}</span>
                                            <Badge variant="outline" className={`border text-xs shadow-sm w-20 justify-center ${getStatusClasses(flight.status)}`}>{formatStatus(flight.status)}</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      
      {/* Expanded Modal */}
      {showExpandedModal && (
        <Dialog open={showExpandedModal} onOpenChange={setShowExpandedModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] z-[100] bg-slate-900/80 backdrop-blur-xl border-white/20 text-white overflow-hidden flex flex-col">
            <DialogHeader className="p-6 border-b border-white/10">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <Plane className="w-8 h-8 text-sky-400" />
                Flight Tracker - Full View
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                    {/* Left Panel: Search & Filters */}
                    <div className="space-y-6">
                        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
                             <Button variant="ghost" size="sm" onClick={() => setViewMode('search')} className={`flex-1 transition-all duration-300 ${viewMode === 'search' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'}`}>
                                <Search className="h-4 w-4 mr-2" /> Search
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setViewMode('live'); loadLiveFlights(); }} className={`flex-1 transition-all duration-300 ${viewMode === 'live' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-300 hover:text-white'}`}>
                                <List className="h-4 w-4 mr-2" /> Live Board
                            </Button>
                        </div>

                        {viewMode === 'search' && (
                            <div className="bg-black/20 p-4 rounded-lg border border-white/10 animate-fade-in-up">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <Select value={searchType} onValueChange={(value: 'flight' | 'route') => setSearchType(value)}>
                                        <SelectTrigger className="w-full bg-slate-800/70 border-white/20 text-white"><SelectValue placeholder="Search by" /></SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/20 text-white"><SelectItem value="flight">Flight #</SelectItem><SelectItem value="route">Route</SelectItem></SelectContent>
                                    </Select>
                                    {searchType === 'flight' ? (<Input placeholder="e.g., TG123" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} className="bg-slate-800/70 border-white/20 text-white" />) : (
                                        <div className="space-y-2"><Select value={origin} onValueChange={setOrigin}><SelectTrigger className="bg-slate-800/70 border-white/20 text-white"><SelectValue placeholder="From" /></SelectTrigger><SelectContent className="bg-slate-800 border-white/20 text-white">{airports.map((a) => <SelectItem key={a.value} value={a.value}>{a.name}</SelectItem>)}</SelectContent></Select><Select value={destination} onValueChange={setDestination}><SelectTrigger className="bg-slate-800/70 border-white/20 text-white"><SelectValue placeholder="To" /></SelectTrigger><SelectContent className="bg-slate-800 border-white/20 text-white">{airports.map((a) => <SelectItem key={a.value} value={a.value}>{a.name}</SelectItem>)}</SelectContent></Select></div>
                                    )}
                                    <Button type="submit" disabled={loading} className="w-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white"><Search className="h-4 w-4 mr-2" /> Search Now</Button>
                                </form>
                            </div>
                        )}
                         {viewMode === 'live' && (
                            <div className="flex items-center gap-2 animate-fade-in-up">
                                <Filter className="h-4 w-4 text-sky-400" />
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full bg-slate-800/70 border-white/20 text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/20 text-white"><SelectItem value="all">All Flights</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="delayed">Delayed</SelectItem><SelectItem value="landed">Landed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Data Display */}
                    <div className="flex-1">
                        {error && <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
                        {loading && <div className="flex justify-center p-8"><RefreshCw className="h-8 w-8 animate-spin text-sky-400" /></div>}
                        
                        {!loading && viewMode === 'search' && flightData && (
                            <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg border border-white/10 animate-fade-in-up">
                                {/* Flight Details content same as compact view, but with more spacing */}
                                <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-white">Flight {flightData.flight?.iata || 'N/A'}</h3><Badge variant="outline" className={`border text-sm shadow-sm ${getStatusClasses(flightData.status)}`}>{formatStatus(flightData.status)}</Badge></div>
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center"><div className="text-center md:text-left"><p className="text-md text-slate-400">Departure</p><p className="text-2xl font-bold text-white truncate">{flightData.departure.airport}</p><p className="text-xl text-sky-400">{flightData.departure.iata}</p></div><div className="flex justify-center items-center"><div className="w-full md:w-px h-px md:h-24 bg-gradient-to-b from-transparent via-sky-500 to-transparent"></div></div><div className="text-center md:text-right"><p className="text-md text-slate-400">Arrival</p><p className="text-2xl font-bold text-white truncate">{flightData.arrival.airport}</p><p className="text-xl text-sky-400">{flightData.arrival.iata}</p></div></div>
                                <div className="w-1/2 mx-auto my-4 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
                                <div className="grid grid-cols-2 gap-6 text-base mt-4"><div><div className="flex justify-between"><span className="text-slate-400">Scheduled:</span><span className="font-medium text-white">{formatTime(flightData.departure.scheduled)}</span></div>{flightData.departure.estimated && <div className="flex justify-between"><span className="text-slate-400">Est:</span><span className={flightData.departure.delay ? 'text-yellow-400 font-medium' : 'font-medium text-white'}>{formatTime(flightData.departure.estimated)}</span></div>}{flightData.departure.gate && <div className="flex justify-between"><span className="text-slate-400">Gate:</span><span className="font-medium text-white">{flightData.departure.gate}</span></div>}</div><div className="text-right"><div className="flex justify-between"><span className="text-slate-400">Scheduled:</span><span className="font-medium text-white">{formatTime(flightData.arrival.scheduled)}</span></div>{flightData.arrival.estimated && <div className="flex justify-between"><span className="text-slate-400">Est:</span><span className={flightData.arrival.delay ? 'text-yellow-400 font-medium' : 'font-medium text-white'}>{formatTime(flightData.arrival.estimated)}</span></div>}{flightData.arrival.baggage && <div className="flex justify-between"><span className="text-slate-400">Baggage:</span><span className="font-medium text-white">{flightData.arrival.baggage}</span></div>}</div></div>
                            </div>
                        )}
                        {!loading && viewMode === 'live' && (
                             <div className="bg-black/20 backdrop-blur-md rounded-lg border border-white/10 animate-fade-in-up">
                                <div className="p-4 flex justify-between items-center"><h3 className="text-lg font-semibold text-white">Live Flights from Bangkok (BKK)</h3><span className="text-sm text-slate-400">{filteredLiveFlights.length} flights</span></div>
                                {filteredLiveFlights.length === 0 ? (<div className="text-center py-12 text-slate-500"><Plane className="w-12 h-12 mx-auto mb-4" /><p>No flights found</p></div>) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 max-h-[calc(90vh-300px)] overflow-y-auto">
                                        {filteredLiveFlights.map((flight, index) => (
                                            <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-transparent hover:border-sky-500/50 hover:bg-slate-800/80 transition-all duration-300">
                                                <div className="flex justify-between items-center text-sm"><div className="flex-1 min-w-0"><p className="font-bold text-white truncate">{flight.flight.iata}</p><p className="text-xs text-slate-400 truncate">{flight.departure.airport} → {flight.arrival.airport}</p></div><div className="flex items-center gap-2 shrink-0 ml-2"><span className="font-mono text-slate-300 w-12 text-right">{formatTime(flight.departure.scheduled)}</span><Badge variant="outline" className={`border text-xs shadow-sm w-24 justify-center ${getStatusClasses(flight.status)}`}>{formatStatus(flight.status)}</Badge></div></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default FlightTrackerWidget