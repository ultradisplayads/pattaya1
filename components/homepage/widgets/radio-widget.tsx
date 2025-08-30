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
      const response = await fetch("http://localhost:1337/api/radio-stations?populate=*&sort=Listeners:desc")
      
      if (response.ok) {
        const data = await response.json()
        console.log('Strapi radio stations response:', data)
        
        if (data.data && data.data.length > 0) {
          // Transform Strapi data to match component interface
          const stationList: RadioStation[] = data.data.map((strapiStation: any) => {
            // Get logo URL with fallback
            let logoUrl = "/placeholder.svg?height=40&width=40&text=RF"
            if (strapiStation.Logo) {
              logoUrl = `http://localhost:1337${strapiStation.Logo.url}`
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
      <Card className="top-row-widget bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-800">Live Radio</CardTitle>
                <p className="text-xs text-gray-500">Pattaya's Finest Stations</p>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget bg-gradient-to-br from-blue-50 via-white to-purple-50 border-0 shadow-xl overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Live Radio</CardTitle>
              <p className="text-xs text-blue-100">Pattaya's Finest Stations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadStations} 
              className="h-7 w-7 p-0 hover:bg-white/20 rounded-full transition-colors text-white" 
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode} 
              className="scale-75 data-[state=checked]:bg-white/20" 
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Current Station Display */}
        {currentStation && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={currentStation.logo || "/placeholder.svg"}
                  alt={currentStation.name}
                  className="w-16 h-16 rounded-xl object-cover shadow-md"
                />
                {currentStation.featured && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg truncate">{currentStation.name}</h3>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                  <span className="font-mono font-semibold text-blue-600">{currentStation.frequency} FM</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                    {currentStation.genre}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{currentStation.listeners.toLocaleString()} listeners</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Music className="w-3 h-3" />
                    <span className="truncate max-w-32">{currentStation.nowPlaying}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => currentStation && playStation(currentStation)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                <p className="text-xs text-center text-gray-500 mt-1">{volume[0]}%</p>
              </div>
            )}
          </div>

          {currentStation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`h-10 w-10 rounded-full transition-all duration-200 ${
                favorites.includes(currentStation.id)
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorites.includes(currentStation.id) ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        <Separator className="my-2" />

        {/* Station Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Quick Select:</span>
            <div className="flex space-x-1">
              {stations.slice(0, 3).map((station) => (
                <Button
                  key={station.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => playStation(station)}
                  className={`h-8 px-3 rounded-full text-xs transition-all duration-200 ${
                    currentStation?.id === station.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {station.frequency}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Error indicator */}
            {error && (
              <div className="flex items-center space-x-1 text-xs text-amber-600">
                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                <span className="font-medium">Connection issue</span>
              </div>
            )}

            {/* All Stations Menu */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 rounded-full text-xs">
                <MoreVertical className="w-3 h-3 mr-1" />
                All Stations
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="p-3">
                <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                  <span>All Stations ({stations.length})</span>
                  <Badge variant="secondary" className="text-xs">
                    {favorites.length} Favorites
                  </Badge>
                </div>
                <div className="space-y-1">
                  {stations.map((station) => (
                    <DropdownMenuItem
                      key={station.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        currentStation?.id === station.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => playStation(station)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="relative">
                          <img
                            src={station.logo || "/placeholder.svg"}
                            alt={station.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          {station.featured && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star className="w-2 h-2 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm truncate">{station.name}</p>
                            {station.isLive && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span className="font-mono font-semibold text-blue-600">{station.frequency} FM</span>
                            <span>•</span>
                            <span>{station.genre}</span>
                            <span>•</span>
                            <span>{station.listeners.toLocaleString()} listeners</span>
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-1">{station.nowPlaying}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(station.id)
                          }}
                          className={`h-6 w-6 p-0 rounded-full ${
                            favorites.includes(station.id)
                              ? "text-red-500 hover:bg-red-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${favorites.includes(station.id) ? "fill-current" : ""}`} />
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
