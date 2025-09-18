"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, AlertTriangle, Car } from "lucide-react"
import { buildApiUrl } from "@/lib/strapi-config"

interface InteractiveTrafficMapProps {
  isOpen: boolean
  onClose: () => void
}

interface ParkingLot {
  id: string
  name: string
  location: string
  status: "spaces" | "likely-full" | "closed"
  spacesAvailable?: number
  coordinates?: { lat: number; lng: number }
}

interface RoadReport {
  id: string
  type: "accident" | "hazard" | "construction" | "other"
  location: string
  description: string
  coordinates?: { lat: number; lng: number }
  severity: "low" | "medium" | "high"
}

export function InteractiveTrafficMap({ isOpen, onClose }: InteractiveTrafficMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null)
  const [parkingMarkers, setParkingMarkers] = useState<google.maps.Marker[]>([])
  const [reportMarkers, setReportMarkers] = useState<google.maps.Marker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'parking' | 'report'
    data: ParkingLot | RoadReport
  } | null>(null)

  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [roadReports, setRoadReports] = useState<RoadReport[]>([])

  // Fetch real data from Strapi
  const fetchParkingLots = async () => {
    try {
      const url = buildApiUrl("/parking-status")
      const res = await fetch(url)
      const json = await res.json()
      const items: any[] = json?.data || []
      const mapped: ParkingLot[] = items.map((item: any) => {
        const coords = item.Coordinates || item.coordinates
        let parsedCoords: { lat: number; lng: number } | undefined
        if (coords && typeof coords === 'object' && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
          parsedCoords = { lat: coords.lat, lng: coords.lng }
        }
        return {
          id: String(item.id ?? item.Id ?? item.Name),
          name: item.Name ?? item.name ?? 'Parking',
          location: item.Location ?? item.location ?? '',
          status: (item.Status ?? 'spaces') as ParkingLot['status'],
          spacesAvailable: item.SpacesAvailable ?? item.spacesAvailable,
          coordinates: parsedCoords,
        }
      })
      setParkingLots(mapped)
    } catch (e) {
      // ignore; keep empty
    }
  }

  const fetchApprovedRoadReports = async () => {
    try {
      const base = buildApiUrl("/road-reports")
      const qs = new URLSearchParams({
        "filters[Status][$eq]": "approved",
        "sort": "SubmittedAt:desc",
        "pagination[pageSize]": "100",
      }).toString()
      const url = `${base}?${qs}`
      const res = await fetch(url)
      const json = await res.json()
      const items: any[] = json?.data || []
      const mapped: RoadReport[] = items.map((item: any) => {
        const attrs = item.attributes || item
        const coords = attrs.Coordinates || attrs.coordinates
        let parsedCoords: { lat: number; lng: number } | undefined
        if (coords && typeof coords === 'object' && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
          parsedCoords = { lat: coords.lat, lng: coords.lng }
        }
        return {
          id: String(item.id ?? attrs.id),
          type: (attrs.ReportType ?? attrs.type ?? 'other') as RoadReport['type'],
          location: attrs.Location ?? attrs.location ?? '',
          description: attrs.Description ?? attrs.description ?? '',
          severity: (attrs.Severity ?? attrs.severity ?? 'low') as RoadReport['severity'],
          coordinates: parsedCoords,
        }
      })
      // Only keep those with coordinates
      setRoadReports(mapped.filter(r => !!r.coordinates))
    } catch (e) {
      // ignore; keep empty
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.error('Google Maps API key not configured')
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('Google Maps API loaded successfully')
        initializeMap()
      }
      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error)
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.google) {
        console.error('Map container or Google Maps API not available')
        return
      }

      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 12.9236, lng: 100.8825 }, // Pattaya center
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        mapInstanceRef.current = map

        // Add traffic layer
        const traffic = new google.maps.TrafficLayer()
        traffic.setMap(map)
        setTrafficLayer(traffic)

        // Kick off data fetch once map is ready
        void fetchParkingLots()
        void fetchApprovedRoadReports()

        setIsLoaded(true)
        console.log('Map initialized successfully')
      } catch (error) {
        console.error('Failed to initialize map:', error)
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup markers when component unmounts
      parkingMarkers.forEach(marker => marker.setMap(null))
      reportMarkers.forEach(marker => marker.setMap(null))
      if (trafficLayer) {
        trafficLayer.setMap(null)
      }
    }
  }, [isOpen])

  // Render parking markers when data changes
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !window.google) return

    // Clear old markers
    parkingMarkers.forEach(m => m.setMap(null))
    const map = mapInstanceRef.current
    const nextMarkers: google.maps.Marker[] = []

    parkingLots.filter(l => l.coordinates).forEach((lot) => {
      const marker = new google.maps.Marker({
        position: (lot.coordinates as google.maps.LatLngLiteral)!,
        map: map,
        title: lot.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="${lot.status === 'spaces' ? '#10b981' : lot.status === 'likely-full' ? '#f59e0b' : '#ef4444'}" stroke="white" stroke-width="2"/>
              <path d="M8 8h8v8H8z" fill="white"/>
              <text x="12" y="14" text-anchor="middle" fill="black" font-size="8" font-weight="bold">P</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      })

      marker.addListener('click', () => {
        setSelectedMarker({ type: 'parking', data: lot })
      })

      nextMarkers.push(marker)
    })

    setParkingMarkers(nextMarkers)
  }, [isOpen, parkingLots])

  // Render road report markers when data changes
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !window.google) return

    // Clear old markers
    reportMarkers.forEach(m => m.setMap(null))
    const map = mapInstanceRef.current
    const nextMarkers: google.maps.Marker[] = []

    roadReports.filter(r => r.coordinates).forEach((report) => {
      const marker = new google.maps.Marker({
        position: (report.coordinates as google.maps.LatLngLiteral)!,
        map: map,
        title: report.description,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="${report.severity === 'high' ? '#ef4444' : report.severity === 'medium' ? '#f59e0b' : '#10b981'}" stroke="white" stroke-width="2"/>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      })

      marker.addListener('click', () => {
        setSelectedMarker({ type: 'report', data: report })
      })

      nextMarkers.push(marker)
    })

    setReportMarkers(nextMarkers)
  }, [isOpen, roadReports])

  const toggleTrafficLayer = () => {
    if (trafficLayer && mapInstanceRef.current) {
      if (trafficLayer.getMap()) {
        trafficLayer.setMap(null)
      } else {
        trafficLayer.setMap(mapInstanceRef.current)
      }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'spaces': return 'bg-green-50 text-green-700 border-green-200'
      case 'likely-full': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'closed': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-2 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Interactive Traffic Map
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex min-h-0">
          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTrafficLayer}
                className="bg-white shadow-md"
              >
                <Car className="h-4 w-4 mr-2" />
                {trafficLayer?.getMap() ? 'Hide' : 'Show'} Traffic
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
              <div className="font-medium mb-2">Legend</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Parking Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Parking Limited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Parking Closed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  <span>Road Reports</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Parking Lots</h3>
                <div className="space-y-2">
                  {parkingLots.map((lot) => (
                    <div
                      key={lot.id}
                      className="p-3 bg-white rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => {
                        if (mapInstanceRef.current && lot.coordinates) {
                          mapInstanceRef.current.setCenter(lot.coordinates as google.maps.LatLngLiteral)
                          mapInstanceRef.current.setZoom(16)
                        }
                        setSelectedMarker({ type: 'parking', data: lot })
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{lot.name}</div>
                          <div className="text-xs text-gray-500">{lot.location}</div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(lot.status)}`}>
                          {lot.status === 'spaces' ? 'Available' : lot.status === 'likely-full' ? 'Limited' : 'Closed'}
                        </Badge>
                      </div>
                      {typeof lot.spacesAvailable === 'number' && (
                        <div className="text-xs text-gray-600 mt-1">
                          {lot.spacesAvailable} spaces
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Road Reports</h3>
                <div className="space-y-2">
                  {roadReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3 bg-white rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => {
                        if (mapInstanceRef.current && report.coordinates) {
                          mapInstanceRef.current.setCenter(report.coordinates as google.maps.LatLngLiteral)
                          mapInstanceRef.current.setZoom(16)
                        }
                        setSelectedMarker({ type: 'report', data: report })
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm capitalize">{report.type}</div>
                          <div className="text-xs text-gray-500">{report.location}</div>
                        </div>
                        <Badge className={`text-xs ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{report.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
