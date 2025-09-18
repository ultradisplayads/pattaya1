// "use client"

// import { useState, useEffect } from "react"
// import {
//   Car,
//   Clock,
//   MapPin,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Navigation,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { buildApiUrl } from "@/lib/strapi-config"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { InteractiveTrafficMap } from "@/components/ui/interactive-traffic-map"

// interface TrafficRoute {
//   id: string
//   from: string
//   to: string
//   distance: string
//   normalTime: string
//   currentTime: string
//   delay: number
//   status: "clear" | "moderate" | "heavy" | "blocked"
//   incidents: number
//   lastUpdated: string
// }

// interface TrafficIncident {
//   id: string
//   type: "accident" | "construction" | "event" | "weather"
//   location: string
//   severity: "low" | "medium" | "high"
//   description: string
//   estimatedClearTime: string
// }

// interface StrapiTrafficRoute {
//   id: number
//   From: string
//   To: string
//   Distance: string
//   NormalTime: string
//   CurrentTime: string
//   Delay: number
//   Status: string
//   Incidents: number
//   IsActive: boolean
//   Featured: boolean
//   Order: number
//   Description?: string
//   LastUpdated: string
//   createdAt: string
//   updatedAt: string
//   publishedAt: string
// }

// interface StrapiTrafficIncident {
//   id: number
//   Type: string
//   Location: string
//   Severity: string
//   Description: string
//   EstimatedClearTime: string
//   IsActive: boolean
//   Featured: boolean
//   Order: number
//   Coordinates?: {
//     lat: number
//     lng: number
//   }
//   AffectedRoutes?: string[]
//   LastUpdated: string
//   createdAt: string
//   updatedAt: string
//   publishedAt: string
// }

// interface TrafficWidgetProps {
//   isExpanded?: boolean
//   onToggleExpand?: () => void
// }

// export function TrafficWidget({ isExpanded = false, onToggleExpand }: TrafficWidgetProps) {
//   const [routes, setRoutes] = useState<TrafficRoute[]>([])
//   const [incidents, setIncidents] = useState<TrafficIncident[]>([])
//   const [loading, setLoading] = useState(true)
//   const [currentTime, setCurrentTime] = useState(new Date())
//   const [activeTab, setActiveTab] = useState<"summary" | "map" | "parking" | "transport">("summary")

//   // Map tab state
//   const [mapImageUrl, setMapImageUrl] = useState<string>("")
  
//   // Interactive map modal state
//   const [isInteractiveMapOpen, setIsInteractiveMapOpen] = useState(false)

//   // Parking tab state
//   interface ParkingLot {
//     id: string
//     name: string
//     location?: string
//     status: "spaces" | "likely-full" | "closed"
//     spacesAvailable?: number | null
//     lastUpdated?: string
//   }
//   const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])

//   // Transport tab state
//   interface TransportStatus {
//     id: string
//     name: string
//     status: "on-schedule" | "delayed" | "suspended"
//     notes?: string
//     lastUpdated?: string
//   }
//   const [transportStatuses, setTransportStatuses] = useState<TransportStatus[]>([])

//   useEffect(() => {
//     loadTrafficData()
//     const timeInterval = setInterval(() => {
//       setCurrentTime(new Date())
//     }, 1000)

//     const dataInterval = setInterval(loadTrafficData, 120000) // Refresh every 2 minutes

//     return () => {
//       clearInterval(timeInterval)
//       clearInterval(dataInterval)
//     }
//   }, [])

//   const loadTrafficData = async () => {
//     try {
//       setLoading(true)
//       console.log('Fetching traffic data from Strapi...')
      
//       // Summary tab data: routes + incidents (existing behavior)
//       const routesResponse = await fetch(buildApiUrl("traffic-routes?populate=*&sort=Order:asc"))
//       const incidentsResponse = await fetch(buildApiUrl("traffic-incidents?populate=*&sort=Order:asc"))

//       // Map tab data: cached static map image URL (optional backend)
//       // Expected backend endpoint: GET /api/traffic-map returns { url: string }
//       const mapRespPromise = fetch(buildApiUrl("traffic-map"))

//       // Parking tab data: list of parking lots
//       // Expected backend endpoint: GET /api/parking-status returns { data: ParkingLot[] }
//       const parkingRespPromise = fetch(buildApiUrl("parking-status?sort=Order:asc"))

//       // Transport tab data: list of transport statuses
//       // Expected backend endpoint: GET /api/transport-status returns { data: TransportStatus[] }
//       const transportRespPromise = fetch(buildApiUrl("transport-status?sort=Order:asc"))
      
//       if (routesResponse.ok && incidentsResponse.ok) {
//         const routesData = await routesResponse.json()
//         const incidentsData = await incidentsResponse.json()
        
//         if (routesData.data && routesData.data.length > 0) {
//           const transformedRoutes: TrafficRoute[] = routesData.data.map((strapiRoute: StrapiTrafficRoute) => ({
//             id: strapiRoute.id.toString(),
//             from: strapiRoute.From,
//             to: strapiRoute.To,
//             distance: strapiRoute.Distance,
//             normalTime: strapiRoute.NormalTime,
//             currentTime: strapiRoute.CurrentTime,
//             delay: strapiRoute.Delay,
//             status: strapiRoute.Status as "clear" | "moderate" | "heavy" | "blocked",
//             incidents: strapiRoute.Incidents,
//             lastUpdated: strapiRoute.LastUpdated,
//           }))
//           setRoutes(transformedRoutes)
//         } else {
//           setRoutes(getFallbackRoutes())
//         }
        
//         if (incidentsData.data && incidentsData.data.length > 0) {
//           const transformedIncidents: TrafficIncident[] = incidentsData.data.map((strapiIncident: StrapiTrafficIncident) => ({
//             id: strapiIncident.id.toString(),
//             type: strapiIncident.Type as "accident" | "construction" | "event" | "weather",
//             description: strapiIncident.Description,
//             estimatedClearTime: strapiIncident.EstimatedClearTime,
//             location: strapiIncident.Location,
//             severity: strapiIncident.Severity as "low" | "medium" | "high",
//           }))
//           setIncidents(transformedIncidents)
//         } else {
//           setIncidents(getFallbackIncidents())
//         }
//       } else {
//         console.error("Failed to load traffic data from Strapi:", routesResponse.status, incidentsResponse.status)
//         setRoutes(getFallbackRoutes())
//         setIncidents(getFallbackIncidents())
//       }

//       // Handle auxiliary tabs (best-effort; fall back silently on errors)
//       try {
//         const [mapResp, parkingResp, transportResp] = await Promise.allSettled([
//           mapRespPromise,
//           parkingRespPromise,
//           transportRespPromise,
//         ])

//         if (mapResp.status === "fulfilled" && mapResp.value.ok) {
//           const mapJson = await mapResp.value.json()
//           setMapImageUrl(mapJson.url || getFallbackMapImageUrl())
//         } else {
//           setMapImageUrl(getFallbackMapImageUrl())
//         }

//         if (parkingResp.status === "fulfilled" && parkingResp.value.ok) {
//           const prJson = await parkingResp.value.json()
//           const parsed: ParkingLot[] = (prJson.data || []).map((p: any) => ({
//             id: (p.id ?? Math.random()).toString(),
//             name: p.Name || p.name || "Parking Lot",
//             location: p.Location || p.location || undefined,
//             status: (p.Status || p.status || "spaces").replace(" ", "-") as ParkingLot["status"],
//             spacesAvailable: p.SpacesAvailable ?? p.spacesAvailable ?? null,
//             lastUpdated: p.LastUpdated || p.updatedAt || undefined,
//           }))
//           setParkingLots(parsed.length ? parsed : getFallbackParkingLots())
//         } else {
//           setParkingLots(getFallbackParkingLots())
//         }

//         if (transportResp.status === "fulfilled" && transportResp.value.ok) {
//           const trJson = await transportResp.value.json()
//           const parsed: TransportStatus[] = (trJson.data || []).map((t: any) => ({
//             id: (t.id ?? Math.random()).toString(),
//             name: t.Name || t.name || "Service",
//             status: (t.Status || t.status || "on-schedule").replace(" ", "-") as TransportStatus["status"],
//             notes: t.Notes || t.notes || undefined,
//             lastUpdated: t.LastUpdated || t.updatedAt || undefined,
//           }))
//           setTransportStatuses(parsed.length ? parsed : getFallbackTransportStatuses())
//         } else {
//           setTransportStatuses(getFallbackTransportStatuses())
//         }
//       } catch (auxErr) {
//         console.warn("Auxiliary tab data failed, using fallbacks:", auxErr)
//         setMapImageUrl(getFallbackMapImageUrl())
//         setParkingLots(getFallbackParkingLots())
//         setTransportStatuses(getFallbackTransportStatuses())
//       }
//     } catch (error) {
//       console.error("Failed to load traffic data:", error)
//       setRoutes(getFallbackRoutes())
//       setIncidents(getFallbackIncidents())
//       setMapImageUrl(getFallbackMapImageUrl())
//       setParkingLots(getFallbackParkingLots())
//       setTransportStatuses(getFallbackTransportStatuses())
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFallbackRoutes = (): TrafficRoute[] => [
//     {
//       id: "1",
//       from: "Bangkok",
//       to: "Pattaya",
//       distance: "147 km",
//       normalTime: "1h 45m",
//       currentTime: "2h 15m",
//       delay: 30,
//       status: "moderate",
//       incidents: 2,
//       lastUpdated: new Date().toISOString(),
//     },
//     {
//       id: "2",
//       from: "Pattaya Center",
//       to: "Jomtien Beach",
//       distance: "6.2 km",
//       normalTime: "15m",
//       currentTime: "12m",
//       delay: -3,
//       status: "clear",
//       incidents: 0,
//       lastUpdated: new Date().toISOString(),
//     },
//     {
//       id: "3",
//       from: "Suvarnabhumi Airport",
//       to: "Pattaya",
//       distance: "120 km",
//       normalTime: "1h 30m",
//       currentTime: "2h 45m",
//       delay: 75,
//       status: "heavy",
//       incidents: 3,
//       lastUpdated: new Date().toISOString(),
//     },
//     {
//       id: "4",
//       from: "Walking Street",
//       to: "Terminal 21",
//       distance: "3.8 km",
//       normalTime: "8m",
//       currentTime: "8m",
//       delay: 0,
//       status: "clear",
//       incidents: 0,
//       lastUpdated: new Date().toISOString(),
//     },
//     {
//       id: "5",
//       from: "Pattaya",
//       to: "Rayong",
//       distance: "85 km",
//       normalTime: "1h 15m",
//       currentTime: "1h 35m",
//       delay: 20,
//       status: "moderate",
//       incidents: 1,
//       lastUpdated: new Date().toISOString(),
//     },
//   ]

//   const getFallbackIncidents = (): TrafficIncident[] => [
//     {
//       id: "1",
//       type: "accident",
//       location: "Highway 7, km 125",
//       severity: "high",
//       description: "Multi-vehicle accident blocking 2 lanes",
//       estimatedClearTime: "45 minutes",
//     },
//     {
//       id: "2",
//       type: "construction",
//       location: "Sukhumvit Road, Central Pattaya",
//       severity: "medium",
//       description: "Road maintenance, single lane closure",
//       estimatedClearTime: "2 hours",
//     },
//     {
//       id: "3",
//       type: "event",
//       location: "Beach Road",
//       severity: "low",
//       description: "Festival setup causing minor delays",
//       estimatedClearTime: "30 minutes",
//     },
//   ]

//   // Map fallback: placeholder image; replace with CDN-cached static map URL when backend ready
//   const getFallbackMapImageUrl = () => 
//     "https://maps.googleapis.com/maps/api/staticmap?center=Pattaya,Thailand&zoom=12&size=600x300&maptype=roadmap&style=feature:road|color:0xffffff&markers=color:red|Pattaya&key=FAKE_KEY_REPLACE"

//   const getParkingStatusBadge = (status: ParkingLot["status"]) => {
//     switch (status) {
//       case "spaces":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200"
//       case "likely-full":
//         return "bg-amber-50 text-amber-700 border-amber-200"
//       case "closed":
//         return "bg-gray-100 text-gray-700 border-gray-200"
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200"
//     }
//   }

//   const getFallbackParkingLots = (): ParkingLot[] => [
//     { id: "cf", name: "Central Festival Parking", status: "spaces", spacesAvailable: 120 },
//     { id: "t21", name: "Terminal 21 Parking", status: "likely-full", spacesAvailable: 25 },
//     { id: "br", name: "Beach Road Public Lot", status: "closed", spacesAvailable: null },
//   ]

//   const getFallbackTransportStatuses = (): TransportStatus[] => [
//     { id: "ferry", name: "Koh Larn Ferry", status: "on-schedule", notes: "Next departure 14:30" },
//     { id: "bus", name: "Bangkok Bus (Ekamai)", status: "delayed", notes: "+10m due to traffic" },
//     { id: "baht", name: "Baht Bus (Beach Rd)", status: "on-schedule" },
//   ]

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "clear":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200"
//       case "moderate":
//         return "bg-amber-50 text-amber-700 border-amber-200"
//       case "heavy":
//         return "bg-red-50 text-red-700 border-red-200"
//       case "blocked":
//         return "bg-red-100 text-red-800 border-red-300"
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "clear":
//         return <CheckCircle className="w-3 h-3" />
//       case "moderate":
//         return <Clock className="w-3 h-3" />
//       case "heavy":
//         return <AlertTriangle className="w-3 h-3" />
//       case "blocked":
//         return <XCircle className="w-3 h-3" />
//       default:
//         return <Car className="w-3 h-3" />
//     }
//   }

//   const getIncidentIcon = (type: string) => {
//     switch (type) {
//       case "accident":
//         return "🚗"
//       case "construction":
//         return "🚧"
//       case "event":
//         return "🎉"
//       case "weather":
//         return "🌧️"
//       default:
//         return "⚠️"
//     }
//   }

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case "low":
//         return "bg-amber-50 text-amber-700 border-amber-200"
//       case "medium":
//         return "bg-orange-50 text-orange-700 border-orange-200"
//       case "high":
//         return "bg-red-50 text-red-700 border-red-200"
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200"
//     }
//   }

//   if (loading) {
//     return (
//       <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] rounded-2xl">
//         <CardContent className="p-6">
//           <div className="animate-pulse space-y-4">
//             <div className="h-5 bg-gray-100 rounded-lg w-32"></div>
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const displayRoutes = isExpanded ? routes : routes.slice(0, 2)
//   const displayIncidents = isExpanded ? incidents : incidents.slice(0, 2)
//   const maxHeight = isExpanded ? "500px" : "280px"

//   return (
//     <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] rounded-2xl overflow-hidden">
//       <CardHeader className="pb-2 px-6 pt-6">
//         <CardTitle className="text-[15px] font-semibold text-gray-900 flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
//             Traffic & Transport
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="flex items-center text-[11px] text-gray-500 font-medium">
//               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
//               Live
//             </div>
//             {onToggleExpand && (
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 onClick={onToggleExpand} 
//                 className="h-6 w-6 p-0 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
//               </Button>
//             )}
//           </div>
//         </CardTitle>
//         <div className="mt-3">
//           <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
//             <TabsList className="bg-gray-100 p-1 rounded-lg">
//               <TabsTrigger value="summary" className="text-xs px-2 py-1">Summary</TabsTrigger>
//               <TabsTrigger value="map" className="text-xs px-2 py-1">Map View</TabsTrigger>
//               <TabsTrigger value="parking" className="text-xs px-2 py-1">Parking</TabsTrigger>
//               <TabsTrigger value="transport" className="text-xs px-2 py-1">Transport</TabsTrigger>
//             </TabsList>
//           </Tabs>
//         </div>
//       </CardHeader>
//       <CardContent className="px-6 pb-6">
//         <div className="overflow-y-auto transition-all duration-300" style={{ maxHeight }}>
//           <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
//             <TabsContent value="summary">
//               {/* Major Routes */}
//               <div className="space-y-3 mb-5">
//                 <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Major Routes</h5>
//                 {displayRoutes.map((route, index) => (
//               <div
//                 key={route.id}
//                 className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 border border-gray-100/50 hover:border-gray-200 transition-all duration-200 cursor-pointer group"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center space-x-2">
//                     <Badge 
//                       variant="outline" 
//                       className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(route.status)}`}
//                     >
//                       {getStatusIcon(route.status)}
//                       <span className="ml-1 capitalize">{route.status}</span>
//                     </Badge>
//                     {route.incidents > 0 && (
//                       <Badge 
//                         variant="outline" 
//                         className="text-[10px] font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 border-red-200"
//                       >
//                         {route.incidents} incident{route.incidents > 1 ? "s" : ""}
//                       </Badge>
//                     )}
//                   </div>
//                   <span className="text-[11px] text-gray-500 font-medium">{route.distance}</span>
//                 </div>

//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center space-x-1.5 text-[12px]">
//                     <MapPin className="w-3 h-3 text-gray-400" />
//                     <span className="font-medium text-gray-900 truncate max-w-[80px]">{route.from}</span>
//                     <span className="text-gray-300">→</span>
//                     <span className="font-medium text-gray-900 truncate max-w-[80px]">{route.to}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Clock className="w-3 h-3 text-gray-400" />
//                     <span
//                       className={`text-[12px] font-medium ${
//                         route.delay > 0
//                           ? "text-red-600"
//                           : route.delay < 0
//                             ? "text-emerald-600"
//                             : "text-gray-900"
//                       }`}
//                     >
//                       {route.currentTime}
//                     </span>
//                     <span className="text-[11px] text-gray-400">({route.normalTime})</span>
//                   </div>
//                   {route.delay !== 0 && (
//                     <span className={`text-[11px] font-semibold ${
//                       route.delay > 0 ? "text-red-600" : "text-emerald-600"
//                     }`}>
//                       {route.delay > 0 ? "+" : ""}
//                       {route.delay}m
//                     </span>
//                   )}
//                 </div>
//               </div>
//                 ))}
//               </div>

//               {/* Traffic Incidents */}
//               {displayIncidents.length > 0 && (
//                 <div className="space-y-3">
//                   <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Active Incidents</h5>
//                   <div className="space-y-2">
//                     {displayIncidents.map((incident, index) => (
//                   <div
//                     key={incident.id}
//                     className="p-3 rounded-xl bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-colors duration-200"
//                     style={{ animationDelay: `${(index + 3) * 100}ms` }}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <span className="text-sm mt-0.5">{getIncidentIcon(incident.type)}</span>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between mb-1.5">
//                           <span className="text-[12px] font-medium text-gray-900 line-clamp-1 max-w-[120px]">
//                             {incident.location}
//                           </span>
//                           <Badge 
//                             variant="outline" 
//                             className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getSeverityColor(incident.severity)}`}
//                           >
//                             {incident.severity}
//                           </Badge>
//                         </div>
//                         <p className="text-[11px] text-gray-600 line-clamp-2 mb-2 leading-relaxed">{incident.description}</p>
//                         <div className="flex items-center justify-between text-[10px]">
//                           <span className="text-gray-500 capitalize font-medium">{incident.type}</span>
//                           <span className="text-gray-500 font-medium">Clear in {incident.estimatedClearTime}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="map">
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Live Traffic Map</h5>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setIsInteractiveMapOpen(true)}
//                     className="h-6 text-[10px] font-medium hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <MapPin className="h-3 w-3 mr-1" />
//                     Expand
//                   </Button>
//                 </div>
//                 <div
//                   className="rounded-xl overflow-hidden border border-gray-100 cursor-pointer"
//                   role="button"
//                   tabIndex={0}
//                   aria-label="Open interactive traffic map"
//                   onClick={() => setIsInteractiveMapOpen(true)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") {
//                       e.preventDefault()
//                       setIsInteractiveMapOpen(true)
//                     }
//                   }}
//                 >
//                   {mapImageUrl ? (
//                     <img src={mapImageUrl} alt="Pattaya Traffic Map" className="w-full h-auto" />
//                   ) : (
//                     <div className="h-40 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">Map unavailable</div>
//                   )}
//                 </div>
//                 <p className="text-[11px] text-gray-500">Map auto-refreshes every few minutes. Click expand for interactive layers.</p>
//               </div>
//             </TabsContent>

//             <TabsContent value="parking">
//               <div className="space-y-3">
//                 <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Parking Status</h5>
//                 <div className="space-y-2">
//                   {parkingLots.map((lot) => (
//                     <div key={lot.id} className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/50 flex items-center justify-between">
//                       <div>
//                         <div className="text-[12px] font-medium text-gray-900">{lot.name}</div>
//                         {lot.location && <div className="text-[11px] text-gray-500">{lot.location}</div>}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {typeof lot.spacesAvailable === "number" && (
//                           <Badge variant="outline" className="text-[10px] font-medium bg-white border-gray-200 text-gray-700">
//                             {lot.spacesAvailable} spaces
//                           </Badge>
//                         )}
//                         <Badge variant="outline" className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getParkingStatusBadge(lot.status)}`}>
//                           {lot.status === "spaces" ? "Spaces Available" : lot.status === "likely-full" ? "Likely Full" : "Closed"}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="transport">
//               <div className="space-y-3">
//                 <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Public Transport</h5>
//                 <div className="space-y-2">
//                   {transportStatuses.map((svc) => (
//                     <div key={svc.id} className="p-3 rounded-xl bg-gray-50/50 border border-gray-100/50 flex items-center justify-between">
//                       <div>
//                         <div className="text-[12px] font-medium text-gray-900">{svc.name}</div>
//                         {svc.notes && <div className="text-[11px] text-gray-500">{svc.notes}</div>}
//                       </div>
//                       <div>
//                         <Badge variant="outline" className={`text-[10px] font-medium px-2 py-1 rounded-full border ${svc.status === "on-schedule" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : svc.status === "delayed" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
//                           {svc.status === "on-schedule" ? "On Schedule" : svc.status === "delayed" ? "Delayed" : "Suspended"}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Last Updated */}
//         <div className="mt-5 pt-4 border-t border-gray-100/50 flex items-center justify-between text-[10px] text-gray-500">
//           <span className="font-medium">Updated: {currentTime.toLocaleTimeString("en-US", { hour12: false })}</span>
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             className="h-6 text-[10px] font-medium hover:bg-gray-100 rounded-lg transition-colors" 
//             onClick={loadTrafficData}
//           >
//             <Navigation className="h-3 w-3 mr-1.5" />
//             Refresh
//           </Button>
//         </div>
//       </CardContent>
      
//       {/* Interactive Map Modal */}
//       <InteractiveTrafficMap 
//         isOpen={isInteractiveMapOpen} 
//         onClose={() => setIsInteractiveMapOpen(false)} 
//       />
//     </Card>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import {
    Car,
    Clock,
    MapPin,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Navigation,
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildApiUrl } from "@/lib/strapi-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveTrafficMap } from "@/components/ui/interactive-traffic-map"
import { motion, AnimatePresence } from "framer-motion"

interface TrafficRoute {
    id: string
    from: string
    to: string
    distance: string
    normalTime: string
    currentTime: string
    delay: number
    status: "clear" | "moderate" | "heavy" | "blocked"
    incidents: number
    lastUpdated: string
}

interface TrafficIncident {
    id: string
    type: "accident" | "construction" | "event" | "weather"
    location: string
    severity: "low" | "medium" | "high"
    description: string
    estimatedClearTime: string
}

interface ParkingLot {
    id: string
    name: string
    location?: string
    status: "spaces" | "likely-full" | "closed"
    spacesAvailable?: number | null
    lastUpdated?: string
}

interface TransportStatus {
    id: string
    name: string
    status: "on-schedule" | "delayed" | "suspended"
    notes?: string
    lastUpdated?: string
}

interface TrafficWidgetProps {
    isExpanded?: boolean
    onToggleExpand?: () => void
}

export function TrafficWidget({ isExpanded = false, onToggleExpand }: TrafficWidgetProps) {
    const [routes, setRoutes] = useState<TrafficRoute[]>([])
    const [incidents, setIncidents] = useState<TrafficIncident[]>([])
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [activeTab, setActiveTab] = useState<"summary" | "map" | "parking" | "transport">("summary")

    const [mapImageUrl, setMapImageUrl] = useState<string>("")
    const [isInteractiveMapOpen, setIsInteractiveMapOpen] = useState(false)
    const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
    const [transportStatuses, setTransportStatuses] = useState<TransportStatus[]>([])

    useEffect(() => {
        loadTrafficData()
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        const dataInterval = setInterval(loadTrafficData, 120000) // Refresh every 2 minutes

        return () => {
            clearInterval(timeInterval)
            clearInterval(dataInterval)
        }
    }, [])

    const loadTrafficData = async () => {
        try {
            setLoading(true)

            const routesResponse = await fetch(buildApiUrl("traffic-routes?populate=*&sort=Order:asc"))
            const incidentsResponse = await fetch(buildApiUrl("traffic-incidents?populate=*&sort=Order:asc"))
            const mapRespPromise = fetch(buildApiUrl("traffic-map"))
            const parkingRespPromise = fetch(buildApiUrl("parking-status?sort=Order:asc"))
            const transportRespPromise = fetch(buildApiUrl("transport-status?sort=Order:asc"))

            if (routesResponse.ok && incidentsResponse.ok) {
                const routesData = await routesResponse.json()
                const incidentsData = await incidentsResponse.json()

                if (routesData.data && routesData.data.length > 0) {
                    const transformedRoutes: TrafficRoute[] = routesData.data.map((item: any) => {
                        const r = item.attributes ? item.attributes : item
                        const getVal = (obj: any, keys: string[]) => {
                            for (const k of keys) {
                                if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k]
                            }
                            return undefined
                        }
                        const id = String(item.id ?? r.id ?? Math.random())
                        const from = getVal(r, ["From", "from"]) || ""
                        const to = getVal(r, ["To", "to"]) || ""
                        const distance = getVal(r, ["Distance", "distance"]) || ""
                        const normalTime = getVal(r, ["NormalTime", "normalTime"]) || ""
                        const currentTime = getVal(r, ["CurrentTime", "currentTime"]) || ""
                        const delay = Number(getVal(r, ["Delay", "delay"]) ?? 0)
                        const status = (getVal(r, ["Status", "status"]) || "clear") as TrafficRoute["status"]
                        const incidentsCount = Number(getVal(r, ["Incidents", "incidents"]) ?? 0)
                        const lastUpdated = getVal(r, ["LastUpdated", "updatedAt", "createdAt"]) || new Date().toISOString()
                        return {
                            id,
                            from,
                            to,
                            distance,
                            normalTime,
                            currentTime,
                            delay,
                            status,
                            incidents: incidentsCount,
                            lastUpdated,
                        }
                    })
                    setRoutes(transformedRoutes)
                    if (process.env.NODE_ENV !== "production") {
                        console.debug("TrafficWidget: loaded routes", transformedRoutes.length)
                    }
                } else {
                    setRoutes(getFallbackRoutes())
                }

                if (incidentsData.data && incidentsData.data.length > 0) {
                    const transformedIncidents: TrafficIncident[] = incidentsData.data.map((item: any) => {
                        const r = item.attributes ? item.attributes : item
                        const getVal = (obj: any, keys: string[]) => {
                            for (const k of keys) {
                                if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k]
                            }
                            return undefined
                        }
                        return {
                            id: String(item.id ?? r.id ?? Math.random()),
                            type: (getVal(r, ["Type", "type"]) || "event") as TrafficIncident["type"],
                            description: getVal(r, ["Description", "description"]) || "",
                            estimatedClearTime: getVal(r, ["EstimatedClearTime", "estimatedClearTime"]) || "",
                            location: getVal(r, ["Location", "location"]) || "",
                            severity: (getVal(r, ["Severity", "severity"]) || "low") as TrafficIncident["severity"],
                        }
                    })
                    setIncidents(transformedIncidents)
                    if (process.env.NODE_ENV !== "production") {
                        console.debug("TrafficWidget: loaded incidents", transformedIncidents.length)
                    }
                } else {
                    setIncidents(getFallbackIncidents())
                }
            } else {
                setRoutes(getFallbackRoutes())
                setIncidents(getFallbackIncidents())
            }

            try {
                const [mapResp, parkingResp, transportResp] = await Promise.allSettled([
                    mapRespPromise,
                    parkingRespPromise,
                    transportRespPromise,
                ])

                if (mapResp.status === "fulfilled" && mapResp.value.ok) {
                    const mapJson = await mapResp.value.json()
                    setMapImageUrl(mapJson.url || getFallbackMapImageUrl())
                } else {
                    setMapImageUrl(getFallbackMapImageUrl())
                }

                if (parkingResp.status === "fulfilled" && parkingResp.value.ok) {
                    const prJson = await parkingResp.value.json()
                    const parsed: ParkingLot[] = (prJson.data || []).map((p: any) => ({
                        id: (p.id ?? Math.random()).toString(),
                        name: p.Name || p.name || "Parking Lot",
                        location: p.Location || p.location || undefined,
                        status: (p.Status || p.status || "spaces").replace(" ", "-") as ParkingLot["status"],
                        spacesAvailable: p.SpacesAvailable ?? p.spacesAvailable ?? null,
                        lastUpdated: p.LastUpdated || p.updatedAt || undefined,
                    }))
                    setParkingLots(parsed.length ? parsed : getFallbackParkingLots())
                } else {
                    setParkingLots(getFallbackParkingLots())
                }

                if (transportResp.status === "fulfilled" && transportResp.value.ok) {
                    const trJson = await transportResp.value.json()
                    const parsed: TransportStatus[] = (trJson.data || []).map((t: any) => ({
                        id: (t.id ?? Math.random()).toString(),
                        name: t.Name || t.name || "Service",
                        status: (t.Status || t.status || "on-schedule").replace(" ", "-") as TransportStatus["status"],
                        notes: t.Notes || t.notes || undefined,
                        lastUpdated: t.LastUpdated || t.updatedAt || undefined,
                    }))
                    setTransportStatuses(parsed.length ? parsed : getFallbackTransportStatuses())
                } else {
                    setTransportStatuses(getFallbackTransportStatuses())
                }
            } catch {
                setMapImageUrl(getFallbackMapImageUrl())
                setParkingLots(getFallbackParkingLots())
                setTransportStatuses(getFallbackTransportStatuses())
            }

        } catch {
            setRoutes(getFallbackRoutes())
            setIncidents(getFallbackIncidents())
            setMapImageUrl(getFallbackMapImageUrl())
            setParkingLots(getFallbackParkingLots())
            setTransportStatuses(getFallbackTransportStatuses())
        } finally {
            setLoading(false)
        }
    }

    // Helper color & icon functions

    const getStatusColor = (status: string) => {
        switch (status) {
            case "clear":
                return "bg-emerald-400/20 text-emerald-700 border-emerald-400/30 backdrop-blur-sm"
            case "moderate":
                return "bg-amber-400/20 text-amber-700 border-amber-400/30 backdrop-blur-sm"
            case "heavy":
                return "bg-orange-400/20 text-orange-700 border-orange-400/30 backdrop-blur-sm"
            case "blocked":
                return "bg-rose-400/20 text-rose-700 border-rose-400/30 backdrop-blur-sm"
            default:
                return "bg-indigo-400/20 text-indigo-700 border-indigo-400/30 backdrop-blur-sm"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "clear":
                return <CheckCircle className="w-3 h-3" />
            case "moderate":
                return <Clock className="w-3 h-3" />
            case "heavy":
                return <AlertTriangle className="w-3 h-3" />
            case "blocked":
                return <XCircle className="w-3 h-3" />
            default:
                return <Car className="w-3 h-3" />
        }
    }

    const getIncidentIcon = (type: string) => {
        switch (type) {
            case "accident":
                return "🚗"
            case "construction":
                return "🚧"
            case "event":
                return "🎉"
            case "weather":
                return "🌧️"
            default:
                return "⚠️"
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "low":
                return "bg-amber-400/20 text-amber-700 border-amber-400/30 backdrop-blur-sm"
            case "medium":
                return "bg-orange-400/20 text-orange-700 border-orange-400/30 backdrop-blur-sm"
            case "high":
                return "bg-rose-400/20 text-rose-700 border-rose-400/30 backdrop-blur-sm"
            default:
                return "bg-indigo-400/20 text-indigo-700 border-indigo-400/30 backdrop-blur-sm"
        }
    }

    const getParkingStatusBadge = (status: ParkingLot["status"]) => {
        switch (status) {
            case "spaces":
                return "bg-emerald-400/20 text-emerald-700 border-emerald-400/30 backdrop-blur-sm"
            case "likely-full":
                return "bg-amber-400/20 text-amber-700 border-amber-400/30 backdrop-blur-sm"
            case "closed":
                return "bg-slate-400/20 text-slate-700 border-slate-400/30 backdrop-blur-sm"
            default:
                return "bg-indigo-400/20 text-indigo-700 border-indigo-400/30 backdrop-blur-sm"
        }
    }

    // Fallback data functions
    const getFallbackRoutes = (): TrafficRoute[] => [
        {
            id: "1",
            from: "Bangkok",
            to: "Pattaya",
            distance: "147 km",
            normalTime: "1h 45m",
            currentTime: "2h 15m",
            delay: 30,
            status: "moderate",
            incidents: 2,
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "2",
            from: "Pattaya Center",
            to: "Jomtien Beach",
            distance: "6.2 km",
            normalTime: "15m",
            currentTime: "12m",
            delay: -3,
            status: "clear",
            incidents: 0,
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "3",
            from: "Suvarnabhumi Airport",
            to: "Pattaya",
            distance: "120 km",
            normalTime: "1h 30m",
            currentTime: "2h 45m",
            delay: 75,
            status: "heavy",
            incidents: 3,
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "4",
            from: "Walking Street",
            to: "Terminal 21",
            distance: "3.8 km",
            normalTime: "8m",
            currentTime: "8m",
            delay: 0,
            status: "clear",
            incidents: 0,
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "5",
            from: "Pattaya",
            to: "Rayong",
            distance: "85 km",
            normalTime: "1h 15m",
            currentTime: "1h 35m",
            delay: 20,
            status: "moderate",
            incidents: 1,
            lastUpdated: new Date().toISOString(),
        },
    ]

    const getFallbackIncidents = (): TrafficIncident[] => [
        {
            id: "1",
            type: "accident",
            location: "Highway 7, km 125",
            severity: "high",
            description: "Multi-vehicle accident blocking 2 lanes",
            estimatedClearTime: "45 minutes",
        },
        {
            id: "2",
            type: "construction",
            location: "Sukhumvit Road, Central Pattaya",
            severity: "medium",
            description: "Road maintenance, single lane closure",
            estimatedClearTime: "2 hours",
        },
        {
            id: "3",
            type: "event",
            location: "Beach Road",
            severity: "low",
            description: "Festival setup causing minor delays",
            estimatedClearTime: "30 minutes",
        },
    ]

    const getFallbackMapImageUrl = () => {
        // Use a placeholder image or create a simple map representation
        // For now, return empty string to show the interactive placeholder
        return ""
    }

    const getFallbackParkingLots = (): ParkingLot[] => [
        { id: "cf", name: "Central Festival Parking", status: "spaces", spacesAvailable: 120 },
        { id: "t21", name: "Terminal 21 Parking", status: "likely-full", spacesAvailable: 25 },
        { id: "br", name: "Beach Road Public Lot", status: "closed", spacesAvailable: null },
    ]

    const getFallbackTransportStatuses = (): TransportStatus[] => [
        { id: "ferry", name: "Koh Larn Ferry", status: "on-schedule", notes: "Next departure 14:30" },
        { id: "bus", name: "Bangkok Bus (Ekamai)", status: "delayed", notes: "+10m due to traffic" },
        { id: "baht", name: "Baht Bus (Beach Rd)", status: "on-schedule" },
    ]

    if (loading) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="h-full bg-gradient-to-br from-purple-50/70 to-blue-50/70 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-5 bg-white/40 rounded-lg w-32 backdrop-blur-sm"></div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-white/30 rounded-xl backdrop-blur-sm"></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    const displayRoutes = isExpanded ? routes : routes.slice(0, 2)
    const displayIncidents = isExpanded ? incidents : incidents.slice(0, 2)
    const maxHeight = isExpanded ? "500px" : "280px"

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full">
            <Card className="h-full bg-gradient-to-br from-purple-50/70 to-blue-50/70 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="pb-2 px-6 pt-6">
                    <CardTitle className="text-[15px] font-semibold text-slate-800 flex items-center justify-between">
                        <div className="flex items-center">
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mr-3" />
                            Traffic & Transport
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center text-[11px] text-slate-600 font-medium">
                                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mr-1.5" />
                                Live
                            </div>
                            {onToggleExpand && (
                                <Button variant="ghost" size="sm" onClick={onToggleExpand} className="h-6 w-6 p-0 hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm">
                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </Button>
                            )}
                        </div>
                    </CardTitle>
                    <div className="mt-3">
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                            <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-white/30">
                                <TabsTrigger value="summary" className="text-xs px-2 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400/20 data-[state=active]:to-blue-400/20 data-[state=active]:text-slate-800 data-[state=active]:border data-[state=active]:border-white/30 data-[state=active]:backdrop-blur-sm">
                                    Summary
                                </TabsTrigger>
                                <TabsTrigger value="map" className="text-xs px-2 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400/20 data-[state=active]:to-blue-400/20 data-[state=active]:text-slate-800 data-[state=active]:border data-[state=active]:border-white/30 data-[state=active]:backdrop-blur-sm">
                                    Map View
                                </TabsTrigger>
                                <TabsTrigger value="parking" className="text-xs px-2 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400/20 data-[state=active]:to-blue-400/20 data-[state=active]:text-slate-800 data-[state=active]:border data-[state=active]:border-white/30 data-[state=active]:backdrop-blur-sm">
                                    Parking
                                </TabsTrigger>
                                <TabsTrigger value="transport" className="text-xs px-2 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400/20 data-[state=active]:to-blue-400/20 data-[state=active]:text-slate-800 data-[state=active]:border data-[state=active]:border-white/30 data-[state=active]:backdrop-blur-sm">
                                    Transport
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="overflow-y-auto transition-all duration-300" style={{ maxHeight }}>
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                            <AnimatePresence mode="wait">
                                <TabsContent value="summary" key="summary">
                                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 mb-5">
                                        <h5 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Major Routes</h5>
                                        {displayRoutes.map((route) => (
                                            <motion.div
                                                key={route.id}
                                                variants={itemVariants}
                                                className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-all duration-200 cursor-pointer group"
                                                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(route.status)}`}>
                                                            {getStatusIcon(route.status)}
                                                            <span className="ml-1 capitalize">{route.status}</span>
                                                        </Badge>
                                                        {route.incidents > 0 && (
                                                            <Badge variant="outline" className="text-[10px] font-medium px-2 py-1 rounded-full bg-rose-400/20 text-rose-700 border-rose-400/30 backdrop-blur-sm">
                                                                {route.incidents} incident{route.incidents > 1 ? "s" : ""}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-slate-600 font-medium">{route.distance}</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-1.5 text-[12px]">
                                                        <MapPin className="w-3 h-3 text-slate-500" />
                                                        <span className="font-medium text-slate-800 truncate max-w-[80px]">{route.from}</span>
                                                        <span className="text-slate-400">→</span>
                                                        <span className="font-medium text-slate-800 truncate max-w-[80px]">{route.to}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-3 h-3 text-slate-500" />
                                                        <span
                                                            className={`text-[12px] font-medium ${route.delay > 0 ? "text-rose-600" : route.delay < 0 ? "text-emerald-600" : "text-slate-800"}`}
                                                        >
                                                            {route.currentTime}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">({route.normalTime})</span>
                                                    </div>
                                                    {route.delay !== 0 && (
                                                        <span className={`text-[11px] font-semibold ${route.delay > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                                            {route.delay > 0 ? "+" : ""}
                                                            {route.delay}m
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {displayIncidents.length > 0 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
                                            <h5 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Active Incidents</h5>
                                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
                                                {displayIncidents.map((incident) => (
                                                    <motion.div
                                                        key={incident.id}
                                                        variants={itemVariants}
                                                        className="p-3 rounded-xl bg-rose-400/10 border border-rose-400/20 hover:bg-rose-400/15 transition-colors duration-200 backdrop-blur-sm"
                                                        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <span className="text-sm mt-0.5">{getIncidentIcon(incident.type)}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1.5">
                                                                    <span className="text-[12px] font-medium text-slate-800 line-clamp-1 max-w-[120px]">{incident.location}</span>
                                                                    <Badge variant="outline" className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getSeverityColor(incident.severity)}`}>
                                                                        {incident.severity}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">{incident.description}</p>
                                                                <div className="flex items-center justify-between text-[10px]">
                                                                    <span className="text-slate-500 capitalize font-medium">{incident.type}</span>
                                                                    <span className="text-slate-500 font-medium">Clear in {incident.estimatedClearTime}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </TabsContent>

                                <TabsContent value="map" key="map">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Live Traffic Map</h5>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsInteractiveMapOpen(true)}
                                                className="h-6 text-[10px] font-medium hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm border border-white/30"
                                            >
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Expand
                                            </Button>
                                        </div>
                                        <div
                                            className="rounded-xl overflow-hidden border border-white/30 cursor-pointer bg-white/20 backdrop-blur-sm"
                                            role="button"
                                            tabIndex={0}
                                            aria-label="Open interactive traffic map"
                                            onClick={() => setIsInteractiveMapOpen(true)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault()
                                                    setIsInteractiveMapOpen(true)
                                                }
                                            }}
                                        >
                                            <div className="h-40 bg-gradient-to-br from-purple-100/50 to-blue-100/50 flex flex-col items-center justify-center text-slate-500 text-sm backdrop-blur-sm relative overflow-hidden">
                                                {/* Compact Map Image */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
                                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-amber-100 to-rose-100 relative">
                                                        {/* Simulated map roads */}
                                                        <div className="absolute inset-0 opacity-30">
                                                            <div className="absolute top-1/4 left-0 right-0 h-1 bg-slate-400 transform -skew-y-1"></div>
                                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-400 transform skew-y-1"></div>
                                                            <div className="absolute top-3/4 left-0 right-0 h-1 bg-slate-400 transform -skew-y-1"></div>
                                                            <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-400 transform -skew-x-1"></div>
                                                            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-400 transform skew-x-1"></div>
                                                            <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-400 transform -skew-x-1"></div>
                                                        </div>
                                                        
                                                        {/* Traffic indicators */}
                                                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                                        <div className="absolute top-3/4 left-3/4 w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                                        
                                                        {/* Parking indicators */}
                                                        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
                                                        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-amber-500 rounded-sm"></div>
                                                        
                                                        {/* Map center marker */}
                                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Overlay content */}
                                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                                                    <motion.div
                                                        animate={{ 
                                                            scale: [1, 1.1, 1],
                                                            rotate: [0, 5, -5, 0]
                                                        }}
                                                        transition={{ 
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                        className="mb-2"
                                                    >
                                                        <MapPin className="h-6 w-6 text-white drop-shadow-lg" />
                                                    </motion.div>
                                                    <p className="text-xs font-medium text-white drop-shadow-lg">Live Traffic Map</p>
                                                    <p className="text-[10px] mt-1 text-white/80 drop-shadow">Click to expand</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-500">Map auto-refreshes every few minutes. Click expand for interactive layers.</p>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="parking" key="parking">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
                                        <h5 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Parking Status</h5>
                                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
                                            {parkingLots.map((lot) => (
                                                <motion.div
                                                    key={lot.id}
                                                    variants={itemVariants}
                                                    className="p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-between hover:bg-white/60 transition-all duration-200"
                                                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                                                >
                                                    <div>
                                                        <div className="text-[12px] font-medium text-slate-800">{lot.name}</div>
                                                        {lot.location && <div className="text-[11px] text-slate-500">{lot.location}</div>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {typeof lot.spacesAvailable === "number" && (
                                                            <Badge variant="outline" className="text-[10px] font-medium bg-white/50 border-white/30 text-slate-700 backdrop-blur-sm">
                                                                {lot.spacesAvailable} spaces
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline" className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getParkingStatusBadge(lot.status)}`}>
                                                            {lot.status === "spaces" ? "Spaces Available" : lot.status === "likely-full" ? "Likely Full" : "Closed"}
                                                        </Badge>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="transport" key="transport">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
                                        <h5 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Public Transport</h5>
                                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
                                            {transportStatuses.map((svc) => (
                                                <motion.div
                                                    key={svc.id}
                                                    variants={itemVariants}
                                                    className="p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-between hover:bg-white/60 transition-all duration-200"
                                                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                                                >
                                                    <div>
                                                        <div className="text-[12px] font-medium text-slate-800">{svc.name}</div>
                                                        {svc.notes && <div className="text-[11px] text-slate-500">{svc.notes}</div>}
                                                    </div>
                                                    <div>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`text-[10px] font-medium px-2 py-1 rounded-full border ${
                                                                svc.status === "on-schedule" 
                                                                    ? "bg-emerald-400/20 text-emerald-700 border-emerald-400/30 backdrop-blur-sm" 
                                                                    : svc.status === "delayed" 
                                                                        ? "bg-amber-400/20 text-amber-700 border-amber-400/30 backdrop-blur-sm" 
                                                                        : "bg-slate-400/20 text-slate-700 border-slate-400/30 backdrop-blur-sm"
                                                            }`}
                                                        >
                                                            {svc.status === "on-schedule" ? "On Schedule" : svc.status === "delayed" ? "Delayed" : "Suspended"}
                                                        </Badge>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                </TabsContent>

                            </AnimatePresence>
                        </Tabs>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/30 flex items-center justify-between text-[10px] text-slate-600">
                        <span className="font-medium">Updated: {currentTime.toLocaleTimeString("en-US", { hour12: false })}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] font-medium hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm"
                            onClick={loadTrafficData}
                        >
                            <Navigation className="h-3 w-3 mr-1.5" />
                            Refresh
                        </Button>
                    </div>
                </CardContent>

                <InteractiveTrafficMap isOpen={isInteractiveMapOpen} onClose={() => setIsInteractiveMapOpen(false)} />
            </Card>
        </motion.div>
    )
}

// Animation variants outside component
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
}

const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 10,
        },
    },
}

export default TrafficWidget