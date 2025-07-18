"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Heart, Radio, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

export function RadioWidget() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [isMuted, setIsMuted] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadStations()
    loadFavorites()
  }, [])

  const loadStations = async () => {
    try {
      const response = await fetch("/api/radio/stations")
      if (response.ok) {
        const data = await response.json()
        const stationList = data.stations || getAllStations()
        setStations(stationList)

        // Set first featured station as default, or first station
        const defaultStation = stationList.find((s: RadioStation) => s.featured) || stationList[0]
        if (defaultStation) {
          setCurrentStation(defaultStation)
        }
      } else {
        const fallbackStations = getAllStations()
        setStations(fallbackStations)
        setCurrentStation(fallbackStations[0])
      }
    } catch (error) {
      console.error("Failed to load stations:", error)
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

  if (loading) {
    return (
      <Card className="top-row-widget">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Radio className="w-4 h-4" />
            <span>Radio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`top-row-widget radio-widget-proper ${darkMode ? "bg-gray-900 text-white" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span className="radio-frequency">{currentStation?.frequency || "103.5"} FM</span>
            <span className="radio-genre">{currentStation?.genre || "Pop/Rock"}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} className="scale-75" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Station Info */}
        {currentStation && (
          <div className="station-info">
            <div className="flex items-center space-x-3">
              <img
                src={currentStation.logo || "/placeholder.svg"}
                alt={currentStation.name}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="station-name">{currentStation.name}</span>
                  {currentStation.featured && <span className="text-yellow-400 text-sm">⭐</span>}
                </div>
                <div className="now-playing truncate text-gray-600">{currentStation.nowPlaying}</div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="radio-controls-layout">
          <div className="radio-play-controls">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentStation && playStation(currentStation)}
              className="h-10 w-10 p-0"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleMute} className="h-10 w-10 p-0">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          <div className="radio-menu-controls">
            {currentStation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(currentStation.id)
                }}
                className="h-10 w-10 p-0"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.includes(currentStation.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </Button>
            )}

            {/* Station Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto radio-station-menu">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 mb-2">All Stations ({stations.length})</div>
                  {stations.map((station) => (
                    <div
                      key={station.id}
                      className={`station-item flex items-center space-x-2 p-2 rounded cursor-pointer ${
                        currentStation?.id === station.id ? "active" : ""
                      }`}
                      onClick={() => playStation(station)}
                    >
                      <img
                        src={station.logo || "/placeholder.svg"}
                        alt={station.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-xs font-medium truncate">{station.name}</p>
                          {station.featured && <span className="text-yellow-400 text-xs">⭐</span>}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{station.frequency} FM</span>
                          <span>•</span>
                          <span>{station.genre}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(station.id)
                          }}
                          className="h-5 w-5 p-0"
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              favorites.includes(station.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  ))}
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
