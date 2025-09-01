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
  displayOrder: number
  website?: string
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
  isSponsored?: boolean
  sponsoredLabel?: string
  sponsoredUntil?: string
  audioPreRollAd?: string
  preRollAdText?: string
  preRollAdDuration?: number
  preRollAdActive?: boolean
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
  DisplayOrder: number
  Website: string
  Facebook: string
  Instagram: string
  Twitter: string
  IsSponsored?: boolean
  SponsoredLabel?: string
  SponsoredUntil?: string
  AudioPreRollAd?: {
    id: number
    name: string
    url: string
    formats?: {
      mp3?: { url: string }
    }
  }
  PreRollAdText?: string
  PreRollAdDuration?: number
  PreRollAdActive?: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface SponsoredWidgetBanner {
  isSponsored: boolean
  sponsorName?: string
  sponsorLogo?: string
  sponsorMessage?: string
  sponsorWebsite?: string
  sponsorColor?: string
  bannerPosition: "top" | "bottom" | "overlay"
}

export function RadioWidget({ className }: { className?: string }) {
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
  const [sponsoredBanner, setSponsoredBanner] = useState<SponsoredWidgetBanner>({
    isSponsored: false,
    bannerPosition: "top"
  })
  const [isPlayingPreRollAd, setIsPlayingPreRollAd] = useState(false)
  const [preRollAdProgress, setPreRollAdProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const preRollAdRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadStations()
    loadFavorites()
    loadSponsoredBanner()
    // Refresh every 5 minutes
    const interval = setInterval(loadStations, 300000)
    
    // Cleanup function
    return () => {
      clearInterval(interval)
      // Stop any playing audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const loadStations = async () => {
    try {
      setError(null)
      console.log('Fetching radio stations from Strapi...')
      
      // Call Strapi API to get radio stations with populated media
      const response = await fetch(buildApiUrl("radio-stations?populate=*&sort=DisplayOrder:asc"))
      
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

            // Get pre-roll ad URL if available
            let preRollAdUrl = ""
            if (strapiStation.AudioPreRollAd) {
              preRollAdUrl = buildStrapiUrl(strapiStation.AudioPreRollAd.url)
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
              displayOrder: strapiStation.DisplayOrder || 999,
              isSponsored: strapiStation.IsSponsored || false,
              sponsoredLabel: strapiStation.SponsoredLabel || "",
              sponsoredUntil: strapiStation.SponsoredUntil || "",
              audioPreRollAd: preRollAdUrl,
              preRollAdText: strapiStation.PreRollAdText || "",
              preRollAdDuration: strapiStation.PreRollAdDuration || 5,
              preRollAdActive: strapiStation.PreRollAdActive || false,
            }
          }).sort((a: RadioStation, b: RadioStation) => {
            // Sort sponsored stations first, then by display order
            if (a.isSponsored && !b.isSponsored) return -1
            if (!a.isSponsored && b.isSponsored) return 1
            return a.displayOrder - b.displayOrder
          })
          
          console.log('Transformed radio stations from Strapi (sorted by display order):', stationList)
          setStations(stationList)
          setError(null) // Clear any previous errors

          // Set first featured station as default, or first station by display order
          const defaultStation = stationList.find((s: RadioStation) => s.featured) || stationList[0]
          if (defaultStation) {
            setCurrentStation(defaultStation)
            console.log('Set default station from Strapi:', defaultStation.name, 'with stream URL:', defaultStation.streamUrl)
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
      
      // Fallback to hardcoded stations (already sorted by display order)
      console.log('Using fallback stations due to Strapi fetch error')
      const fallbackStations = getAllStations()
      setStations(fallbackStations)
      setCurrentStation(fallbackStations[0])
      console.log('Set fallback station:', fallbackStations[0].name, 'with stream URL:', fallbackStations[0].streamUrl)
    } finally {
      setLoading(false)
    }
  }

  const getAllStations = (): RadioStation[] => [
    {
      id: "1",
      name: "Fabulas 103 FM",
      frequency: "103.0",
      genre: "Pop/Rock",
      streamUrl: "https://stream.radiojar.com/4ywdgup3bnzuv",
      logo: "/placeholder.svg?height=40&width=40&text=F103",
      isLive: true,
      listeners: 1250,
      nowPlaying: "Live Stream",
      featured: true,
      description: "Pattaya's premier radio station playing the best pop and rock hits",
      website: "https://fabulous103.com",
      social: {
        facebook: "fabulous103",
        instagram: "fabulous103_official",
      },
      displayOrder: 1,
    },
    {
      id: "2",
      name: "Beach Radio",
      frequency: "95.7",
      genre: "Chill/Lounge",
      streamUrl: "http://163.172.158.94:8048/;stream.mp3",
      logo: "/placeholder.svg?height=40&width=40&text=BR",
      isLive: true,
      listeners: 890,
      nowPlaying: "Live Stream",
      featured: false,
      description: "Relaxing beach vibes and chill music for your perfect day",
      website: "https://beachradio.co.th",
      displayOrder: 2,
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
      displayOrder: 3,
    },
    {
      id: "4",
      name: "Radio Mirchi",
      frequency: "98.3",
      genre: "International",
      streamUrl: "https://stream.radiojar.com/4ywdgup3bnzuv",
      logo: "/placeholder.svg?height=40&width=40&text=RM",
      isLive: true,
      listeners: 650,
      nowPlaying: "Live Stream",
      featured: false,
      description: "News, music and entertainment for the international community",
      displayOrder: 4,
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
      displayOrder: 5,
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
      displayOrder: 6,
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
      displayOrder: 7,
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
      displayOrder: 8,
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
      displayOrder: 9,
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
      displayOrder: 10,
    },
  ].sort((a, b) => a.displayOrder - b.displayOrder)

  const loadFavorites = () => {
    const saved = localStorage.getItem("pattaya1-radio-favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const loadSponsoredBanner = () => {
    // TODO: Load sponsored banner from API or configuration
    // For now, set a sample sponsored banner
    setSponsoredBanner({
      isSponsored: false, // Set to true to enable sponsored banner
      sponsorName: "Singha Beer",
      sponsorLogo: "/placeholder.svg?height=24&width=24&text=SB",
      sponsorMessage: "Pattaya's Radio, brought to you by Singha Beer",
      sponsorWebsite: "https://singha.com",
      sponsorColor: "#1e40af",
      bannerPosition: "top"
    })
  }

  const refreshStations = () => {
    loadStations()
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleFavorite = (stationId: string) => {
    const updated = favorites.includes(stationId)
      ? favorites.filter((id) => id !== stationId)
      : [...favorites, stationId]
    setFavorites(updated)
    localStorage.setItem("pattaya1-radio-favorites", JSON.stringify(updated))
  }

  const playStation = async (station: RadioStation) => {
    console.log('Attempting to play station:', station.name, 'with URL:', station.streamUrl)
    
    // If clicking the same station, toggle play/pause
    if (currentStation?.id === station.id) {
      if (isPlaying) {
        // Pause current station
        if (audioRef.current) {
          audioRef.current.pause()
          setIsPlaying(false)
        }
      } else {
        // Resume current station
        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.error('Play failed:', err)
            setError(`Playback failed: ${err.message}`)
          })
          setIsPlaying(true)
        }
      }
      return
    }
    
    // Check if station has pre-roll ad
    if (station.preRollAdActive && station.audioPreRollAd) {
      await playPreRollAd(station)
    } else {
      // No pre-roll ad, play station directly
      playStationDirectly(station)
    }
  }

  const playPreRollAd = async (station: RadioStation) => {
    if (!station.audioPreRollAd || !preRollAdRef.current) return

    setIsPlayingPreRollAd(true)
    setPreRollAdProgress(0)

    try {
      preRollAdRef.current.src = station.audioPreRollAd
      preRollAdRef.current.load()
      
      // Play pre-roll ad
      await preRollAdRef.current.play()
      
      // Update progress bar
      const duration = station.preRollAdDuration || 5
      const interval = setInterval(() => {
        if (preRollAdRef.current) {
          const progress = (preRollAdRef.current.currentTime / duration) * 100
          setPreRollAdProgress(progress)
        }
      }, 100)

      // Wait for pre-roll ad to finish
      setTimeout(() => {
        clearInterval(interval)
        setIsPlayingPreRollAd(false)
        setPreRollAdProgress(0)
        
        // Now play the actual station
        playStationDirectly(station)
      }, duration * 1000)

    } catch (error) {
      console.error('Failed to play pre-roll ad:', error)
      // If pre-roll fails, play station directly
      playStationDirectly(station)
    }
  }

  const playStationDirectly = (station: RadioStation) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    // Create new Audio object for the new station
    try {
      const audio = new Audio(station.streamUrl)
      audioRef.current = audio
      
      // Set initial volume
      audio.volume = volume[0] / 100
      audio.muted = isMuted
      
      // Add event listeners
      audio.addEventListener('play', () => {
        console.log('Audio started playing:', station.name)
        setIsPlaying(true)
        setError(null)
      })
      
      audio.addEventListener('pause', () => {
        console.log('Audio paused:', station.name)
        setIsPlaying(false)
      })
      
      audio.addEventListener('ended', () => {
        console.log('Audio ended:', station.name)
        setIsPlaying(false)
      })
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error for station:', station.name, e)
        const audioElement = e.target as HTMLAudioElement
        
        let errorMessage = `Unable to play ${station.name}. `
        
        if (audioElement.error) {
          switch (audioElement.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage += "Playback was aborted."
              break
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage += "Network error occurred (stream may be offline)."
              break
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage += "Audio format not supported."
              break
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage += "Stream URL not supported or stream is offline."
              break
            default:
              errorMessage += `Error code: ${audioElement.error.code}`
          }
        } else {
          // Check if it's a network error (like 404)
          if (audioElement.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
            errorMessage += "Stream URL not accessible (404 or offline)."
          } else {
            errorMessage += "Unknown error occurred."
          }
        }
        
        setError(errorMessage)
        setIsPlaying(false)
      })
      
      audio.addEventListener('canplay', () => {
        console.log('Audio can play:', station.name)
        setError(null)
      })
      
      audio.addEventListener('loadstart', () => {
        console.log('Audio loading started:', station.name)
      })
      
      // Update current station and start playing
      setCurrentStation(station)
      setIsPlaying(true)
      
      // Start playback
      audio.play().catch((err) => {
        console.error('Failed to start playback:', err)
        setError(`Failed to start playback: ${err.message}`)
        setIsPlaying(false)
      })
      
    } catch (error) {
      console.error('Error creating audio object:', error)
      setError(`Error creating audio: ${String(error)}`)
      setIsPlaying(false)
    }
  }

  const validateStreamUrl = (url: string): boolean => {
    // Check if URL is not a placeholder
    if (url.includes('example.com') || url.includes('placeholder')) {
      return false
    }
    
    // Check if URL has a valid protocol and is a real streaming URL
    try {
      const urlObj = new URL(url)
      const isValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
      
      // Check for actual streaming URLs (not webpage URLs)
      const isStreamingUrl = (
        url.includes('.mp3') || 
        url.includes('.aac') || 
        url.includes('.ogg') || 
        url.includes('.m3u8') ||
        url.includes('/stream') ||
        url.includes('/live') ||
        url.includes('ice.infomaniak.ch') ||
        url.includes('stream.') ||
        url.includes('radio.') ||
        url.includes(':8000') ||
        url.includes(':8048') ||
        url.includes(':9050')
      )
      
      // Exclude webpage URLs
      const isNotWebpage = !(
        url.includes('/stations/') ||
        url.includes('/radio/') ||
        url.includes('.html') ||
        url.includes('.php') ||
        url.includes('onlineradiofm.in')
      )
      
      return isValidProtocol && isStreamingUrl && isNotWebpage
    } catch {
      return false
    }
  }

  const getStationStatus = (station: RadioStation) => {
    if (!validateStreamUrl(station.streamUrl)) {
      return { status: 'offline', message: 'Stream URL not configured' }
    }
    return { status: 'online', message: 'Live' }
  }

  const testStreamUrl = async (url: string) => {
    try {
      console.log('Testing stream URL:', url)
      
      // Try HEAD request first
      try {
        const response = await fetch(url, { method: 'HEAD' })
        console.log('Stream test HEAD response:', response.status, response.statusText)
        
        if (response.ok) {
          console.log('Stream URL is accessible via HEAD request')
          return { success: true, method: 'HEAD', status: response.status }
        }
      } catch (headError) {
        console.log('HEAD request failed, trying GET:', headError)
      }
      
      // If HEAD fails, try GET request
      try {
        const response = await fetch(url, { method: 'GET' })
        console.log('Stream test GET response:', response.status, response.statusText)
        
        if (response.ok) {
          console.log('Stream URL is accessible via GET request')
          return { success: true, method: 'GET', status: response.status }
        } else {
          console.log('Stream URL returned status:', response.status)
          return { success: false, method: 'GET', status: response.status, error: 'HTTP Error' }
        }
              } catch (getError) {
          console.error('GET request also failed:', getError)
          return { success: false, method: 'GET', error: String(getError) }
        }
      } catch (error) {
        console.error('Stream test failed:', error)
        return { success: false, error: String(error) }
      }
  }

  const getDataSourceInfo = () => {
    if (stations.length === 0) return 'Loading...'
    if (stations[0].streamUrl.includes('example.com')) return 'Fallback Data'
    return 'Strapi Backend'
  }

  const checkAudioSupport = () => {
    const audio = document.createElement('audio')
    const canPlayMP3 = audio.canPlayType('audio/mpeg')
    const canPlayAAC = audio.canPlayType('audio/aac')
    const canPlayOGG = audio.canPlayType('audio/ogg')
    
    console.log('Browser audio support:', {
      mp3: canPlayMP3,
      aac: canPlayAAC,
      ogg: canPlayOGG
    })
    
    return { canPlayMP3, canPlayAAC, canPlayOGG }
  }

  const getWorkingStreamExamples = () => {
    console.log('🎵 Working Streaming URL Examples:')
    console.log('MP3 Streams:')
    console.log('- https://stream.radiojar.com/4ywdgup3bnzuv (Radio Mirchi)')
    console.log('- http://163.172.158.94:8048/;stream.mp3 (Beach Radio)')
    console.log('')
    console.log('🎵 Additional Reliable Streams:')
    console.log('- https://ice1.somafm.com/groovesalad-128-mp3 (SomaFM Groove Salad)')
    console.log('- https://ice1.somafm.com/dronezone-128-mp3 (SomaFM Drone Zone)')
    console.log('- https://stream.radiojar.com/7csmg9f5c8quv (Another RadioJar stream)')
    console.log('')
    console.log('❌ Broken/Offline URLs:')
    console.log('- http://fabulous103.ice.infomaniak.ch/fabulous103-128.mp3 (404 - offline)')
    console.log('- https://radio.siaminterhost.com:9050/stream (may be offline)')
    console.log('')
    console.log('❌ Non-working URLs (webpages, not streams):')
    console.log('- https://onlineradiofm.in/stations/mirchi (webpage)')
    console.log('- https://example.com/radio (webpage)')
    console.log('- https://radio.com/stations (webpage)')
    console.log('')
    console.log('💡 Tips:')
    console.log('- Use URLs ending in .mp3, .aac, .ogg')
    console.log('- Use URLs with /stream, /live endpoints')
    console.log('- Avoid URLs with /stations/, /radio/ paths')
    console.log('- Test URLs in browser first to ensure they play audio')
    console.log('- Stream URLs can become inactive - always have backups')
    console.log('- SomaFM and RadioJar are generally reliable sources')
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    if (audioRef.current) {
      audioRef.current.muted = newMutedState
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
    <Card className="top-row-widget overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Sponsored Widget Banner */}
      {sponsoredBanner.isSponsored && (
        <div 
          className={`w-full p-3 text-center text-white font-medium ${
            sponsoredBanner.bannerPosition === 'overlay' 
              ? 'absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-75' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}
          style={{
            backgroundColor: sponsoredBanner.sponsorColor || undefined
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {sponsoredBanner.sponsorLogo && (
              <img 
                src={sponsoredBanner.sponsorLogo} 
                alt={sponsoredBanner.sponsorName || 'Sponsor'} 
                className="h-6 w-6 object-contain"
              />
            )}
            <span>{sponsoredBanner.sponsorMessage || `Pattaya's Radio, brought to you by ${sponsoredBanner.sponsorName}`}</span>
            {sponsoredBanner.sponsorWebsite && (
              <a 
                href={sponsoredBanner.sponsorWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 underline"
              >
                Visit Site
              </a>
            )}
          </div>
        </div>
      )}

      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span className="text-[15px] font-medium text-gray-900">Radio</span>
            
            {/* Offline Fallback Indicator */}
            {stations.length > 0 && stations[0].streamUrl.includes('example.com') && (
              <Badge className="bg-orange-500/10 text-orange-600 text-[10px] px-2 py-0.5 font-medium border border-orange-200 rounded-full">
                Offline Mode
              </Badge>
            )}
          </div>
          
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Pre-Roll Ad Display */}
        {isPlayingPreRollAd && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Playing Advertisement</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              {currentStation?.preRollAdText && (
                <p className="text-xs text-blue-700">{currentStation.preRollAdText}</p>
              )}
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${preRollAdProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600">
                Radio will start in {Math.ceil((currentStation?.preRollAdDuration || 5) - (preRollAdProgress / 100) * (currentStation?.preRollAdDuration || 5))} seconds
              </p>
            </div>
          </div>
        )}

        {/* Current Station Display */}
        {currentStation && (
          <div className="bg-gray-50/50 rounded-lg p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
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
                {currentStation.isSponsored && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                    SPONSORED
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-[15px] truncate">{currentStation.name}</h3>
                  {currentStation.isSponsored && currentStation.sponsoredLabel && (
                    <Badge variant="outline" className="text-[8px] px-1.5 py-0.5 bg-green-50 text-green-700 border-green-200">
                      {currentStation.sponsoredLabel}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600 mb-2">
                  <span className="font-mono font-medium text-purple-600">{currentStation.frequency} FM</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-medium">{currentStation.genre}</span>
                  {!validateStreamUrl(currentStation.streamUrl) && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Station Offline
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
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

        {/* Main Controls - Responsive Layout */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => currentStation && playStation(currentStation)}
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
              currentStation && validateStreamUrl(currentStation.streamUrl)
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={!currentStation || !validateStreamUrl(currentStation.streamUrl)}
          >
            {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />}
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </Button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border p-3 z-10">
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20 sm:w-24"
                />
                <p className="text-[11px] sm:text-xs text-center text-gray-500 mt-1">{volume[0]}%</p>
              </div>
            )}
          </div>

          {currentStation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-all duration-200 ${
                favorites.includes(currentStation.id)
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorites.includes(currentStation.id) ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        <Separator className="my-2" />

        {/* Station Selector - Responsive Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-gray-700">Quick Select:</span>
            <div className="flex gap-1 flex-wrap">
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
                  <span className="hidden sm:inline">All Stations</span>
                  <span className="sm:hidden">Stations</span>
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
                              {station.isSponsored && (
                                <Badge variant="outline" className="text-[8px] px-1 py-0.5 bg-green-50 text-green-700 border-green-200">
                                  SPONSORED
                                </Badge>
                              )}
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
      </CardContent>

      {/* Hidden audio element for pre-roll ads */}
      <audio
        ref={preRollAdRef}
        preload="none"
        onError={(e) => {
          console.error('Pre-roll ad error:', e)
          setIsPlayingPreRollAd(false)
        }}
      />
    </Card>
  )
}
