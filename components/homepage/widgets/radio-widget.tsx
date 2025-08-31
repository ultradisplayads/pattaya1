"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Heart, Radio, MoreVertical, Users, Music, Star, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"

interface RadioStation {
  id: string
  name: string
  frequency: string
  genre: string
  streamUrl: string
  logo: string
  isLive: boolean
  listeners: number
  nowPlaying: string
  featured: boolean
  description: string
  website?: string
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
}

interface StrapiRadioStation {
  id: number
  Name: string
  Frequency: string
  Genre: string
  Description: string
  StreamURL: string
  Logo?: {
    id: number
    name: string
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }
  CoverImage?: {
    id: number
    name: string
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }
  IsLive: boolean
  Featured: boolean
  Verified: boolean
  Listeners: number
  CurrentTrack: string
  Website: string
  Facebook: string
  Instagram: string
  Twitter: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function RadioWidget() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [isMuted, setIsMuted] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadStations()
    loadFavorites()
    // Refresh every 5 minutes
    const interval = setInterval(loadStations, 300000)
    return () => clearInterval(interval)
  }, [])

  const loadStations = async () => {
    try {
      setError(null)
      console.log('Fetching radio stations from Strapi...')
      
      // Call Strapi API to get radio stations with populated media
      const response = await fetch(buildApiUrl("radio-stations?populate=*&sort=Listeners:desc"))
      
      if (response.ok) {
        const data = await response.json()
        console.log('Strapi radio stations response:', data)
        
        if (data.data && data.data.length > 0) {
          // Transform Strapi data to match component interface
          const stationList: RadioStation[] = data.data.map((strapiStation: any) => {
            // Get logo URL with fallback
            let logoUrl = "/placeholder.svg?height=40&width=40&text=RF"
            if (strapiStation.Logo) {
              logoUrl = buildStrapiUrl(strapiStation.Logo.url)
            }

            return {
              id: strapiStation.id.toString(),
              name: strapiStation.Name,
              frequency: strapiStation.Frequency,
              genre: strapiStation.Genre,
              streamUrl: strapiStation.StreamURL,
              logo: logoUrl,
              isLive: strapiStation.IsLive,
              listeners: strapiStation.Listeners || 0,
              nowPlaying: strapiStation.CurrentTrack || "Live Stream",
              featured: strapiStation.Featured,
              description: strapiStation.Description || "",
              website: strapiStation.Website,
              social: {
                facebook: strapiStation.Facebook,
                twitter: strapiStation.Twitter,
                instagram: strapiStation.Instagram,
              },
            }
          })
          
          console.log('Transformed radio stations:', stationList)
          setStations(stationList)

          // Set first featured station as default, or first station
          const defaultStation = stationList.find((s: RadioStation) => s.featured) || stationList[0]
          if (defaultStation) {
            setCurrentStation(defaultStation)
          }
        } else {
          throw new Error("No radio stations available")
        }
      } else {
        console.error("Failed to fetch radio stations from Strapi:", response.status)
        throw new Error("Failed to fetch radio stations")
      }
    } catch (error) {
      console.error("Failed to load radio stations:", error)
      setError("Unable to load radio stations")
      
      // Fallback to hardcoded stations
      const fallbackStations = getAllStations()
      setStations(fallbackStations)
      setCurrentStation(fallbackStations[0])
    } finally {
      setLoading(false)
    }
  }

  const getAllStations = (): RadioStation[] => [
    {
      id: "1",
      name: "Pattaya FM",
      frequency: "103.5",
      genre: "Pop/Rock",
      streamUrl: "https://stream.example.com/pattaya-fm",
      logo: "/placeholder.svg?height=40&width=40&text=PFM",
      isLive: true,
      listeners: 1250,
      nowPlaying: "Summer Vibes Mix",
      featured: true,
      description: "Pattaya's premier radio station playing the best pop and rock hits",
      website: "https://pattayafm.com",
      social: {
        facebook: "pattayafm",
        instagram: "pattayafm_official",
      },
    },
    {
      id: "2",
      name: "Beach Radio",
      frequency: "95.7",
      genre: "Chill/Lounge",
      streamUrl: "https://stream.example.com/beach-radio",
      logo: "/placeholder.svg?height=40&width=40&text=BR",
      isLive: true,
      listeners: 890,
      nowPlaying: "Sunset Sessions",
      featured: false,
      description: "Relaxing beach vibes and chill music for your perfect day",
      website: "https://beachradio.co.th",
    },
    {
      id: "3",
      name: "Thai Hits",
      frequency: "101.2",
      genre: "Thai Pop",
      streamUrl: "https://stream.example.com/thai-hits",
      logo: "/placeholder.svg?height=40&width=40&text=TH",
      isLive: true,
      listeners: 2100,
      nowPlaying: "ลูกทุ่งใหม่",
      featured: true,
      description: "The best of Thai pop and traditional music",
      social: {
        facebook: "thaihitsradio",
      },
    },
    {
      id: "4",
      name: "Expat Radio",
      frequency: "88.9",
      genre: "International",
      streamUrl: "https://stream.example.com/expat-radio",
      logo: "/placeholder.svg?height=40&width=40&text=ER",
      isLive: true,
      listeners: 650,
      nowPlaying: "International News Hour",
      featured: false,
      description: "News, music and entertainment for the international community",
    },
    {
      id: "5",
      name: "Dance FM",
      frequency: "107.1",
      genre: "Electronic/Dance",
      streamUrl: "https://stream.example.com/dance-fm",
      logo: "/placeholder.svg?height=40&width=40&text=DFM",
      isLive: true,
      listeners: 1800,
      nowPlaying: "Club Anthems 2024",
      featured: false,
      description: "Non-stop electronic dance music and club hits",
    },
    {
      id: "6",
      name: "Classic Rock",
      frequency: "92.3",
      genre: "Classic Rock",
      streamUrl: "https://stream.example.com/classic-rock",
      logo: "/placeholder.svg?height=40&width=40&text=CR",
      isLive: true,
      listeners: 1100,
      nowPlaying: "Led Zeppelin - Stairway to Heaven",
      featured: false,
      description: "The greatest rock classics from the 60s, 70s, and 80s",
    },
    {
      id: "7",
      name: "Jazz Lounge",
      frequency: "99.5",
      genre: "Jazz",
      streamUrl: "https://stream.example.com/jazz-lounge",
      logo: "/placeholder.svg?height=40&width=40&text=JL",
      isLive: true,
      listeners: 420,
      nowPlaying: "Miles Davis - Kind of Blue",
      featured: false,
      description: "Smooth jazz and contemporary instrumental music",
    },
    {
      id: "8",
      name: "News Talk",
      frequency: "106.7",
      genre: "News/Talk",
      streamUrl: "https://stream.example.com/news-talk",
      logo: "/placeholder.svg?height=40&width=40&text=NT",
      isLive: true,
      listeners: 980,
      nowPlaying: "Morning News Briefing",
      featured: false,
      description: "Local and international news, talk shows, and current affairs",
    },
    {
      id: "9",
      name: "Reggae Vibes",
      frequency: "94.1",
      genre: "Reggae",
      streamUrl: "https://stream.example.com/reggae-vibes",
      logo: "/placeholder.svg?height=40&width=40&text=RV",
      isLive: true,
      listeners: 750,
      nowPlaying: "Bob Marley - Three Little Birds",
      featured: false,
      description: "Classic and modern reggae music from around the world",
    },
    {
      id: "10",
      name: "Country Roads",
      frequency: "91.7",
      genre: "Country",
      streamUrl: "https://stream.example.com/country-roads",
      logo: "/placeholder.svg?height=40&width=40&text=CR",
      isLive: true,
      listeners: 580,
      nowPlaying: "Johnny Cash - Ring of Fire",
      featured: false,
      description: "Classic and contemporary country music hits",
    },
  ]

  const loadFavorites = () => {
    const saved = localStorage.getItem("pattaya1-radio-favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleFavorite = (stationId: string) => {
    const updated = favorites.includes(stationId)
      ? favorites.filter((id) => id !== stationId)
      : [...favorites, stationId]
    setFavorites(updated)
    localStorage.setItem("pattaya1-radio-favorites", JSON.stringify(updated))
  }

  const playStation = (station: RadioStation) => {
    if (currentStation?.id === station.id && isPlaying) {
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      setCurrentStation(station)
      setIsPlaying(true)
      if (audioRef.current) {
        audioRef.current.src = station.streamUrl
        audioRef.current.play().catch(console.error)
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  if (loading) {
    return (
      <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
            </div>
            <div className="w-8 h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span className="text-[15px] font-medium text-gray-900">Radio</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 text-[11px] px-2 py-0.5 font-medium border border-purple-200 rounded-full">
              Live
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadStations} 
              className="h-7 w-7 p-0 hover:bg-gray-100/80 rounded-full transition-colors" 
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Current Station Display */}
        {currentStation && (
          <div className="bg-gray-50/50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentStation.logo || "/placeholder.svg"}
                  alt={currentStation.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                {currentStation.featured && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-[15px] truncate">{currentStation.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-600 mb-2">
                  <span className="font-mono font-medium text-purple-600">{currentStation.frequency} FM</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {currentStation.genre}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{currentStation.listeners.toLocaleString()} listeners</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    <span className="truncate max-w-32">{currentStation.nowPlaying}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => currentStation && playStation(currentStation)}
            className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border p-3 z-10">
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20"
                />
                <p className="text-[11px] text-center text-gray-500 mt-1">{volume[0]}%</p>
              </div>
            )}
          </div>

          {currentStation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`h-8 w-8 rounded-full transition-all duration-200 ${
                favorites.includes(currentStation.id)
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.includes(currentStation.id) ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        <Separator className="my-2" />

        {/* Station Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-gray-700">Quick Select:</span>
            <div className="flex gap-1">
              {stations.slice(0, 3).map((station) => (
                <Button
                  key={station.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => playStation(station)}
                  className={`h-7 px-2 rounded-full text-[11px] transition-all duration-200 ${
                    currentStation?.id === station.id
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {station.frequency}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Error indicator */}
            {error && (
              <div className="flex items-center gap-1 text-[11px] text-amber-600">
                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                <span className="font-medium">Connection issue</span>
              </div>
            )}

            {/* All Stations Menu */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 px-2 rounded-full text-[11px]">
                <MoreVertical className="w-3 h-3 mr-1" />
                All Stations
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="p-3">
                <div className="text-[13px] font-semibold text-gray-700 mb-3 flex items-center justify-between">
                  <span>All Stations ({stations.length})</span>
                  <Badge variant="secondary" className="text-[11px]">
                    {favorites.length} Favorites
                  </Badge>
                </div>
                <div className="space-y-1">
                  {stations.map((station) => (
                    <DropdownMenuItem
                      key={station.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        currentStation?.id === station.id
                          ? "bg-purple-50 border border-purple-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => playStation(station)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="relative">
                          <img
                            src={station.logo || "/placeholder.svg"}
                            alt={station.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          {station.featured && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                              <Star className="w-1.5 h-1.5 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[13px] truncate">{station.name}</p>
                            {station.isLive && (
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                            <span className="font-mono font-medium text-purple-600">{station.frequency} FM</span>
                            <span>•</span>
                            <span>{station.genre}</span>
                            <span>•</span>
                            <span>{station.listeners.toLocaleString()} listeners</span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate mt-1">{station.nowPlaying}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(station.id)
                          }}
                          className={`h-5 w-5 p-0 rounded-full ${
                            favorites.includes(station.id)
                              ? "text-red-500 hover:bg-red-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          <Heart className={`w-2.5 h-2.5 ${favorites.includes(station.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        <audio ref={audioRef} preload="none" />
      </CardContent>
    </Card>
  )
}
