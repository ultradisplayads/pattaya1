// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Camera, Heart, MessageCircle, Eye, User, MapPin, Clock } from "lucide-react"
// import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
// import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

// interface PattayaPulsePhoto {
//   id: number
//   caption?: string
//   image?: {
//     id: number
//     name: string
//     url: string
//     formats?: {
//       thumbnail?: { url: string }
//       small?: { url: string }
//       medium?: { url: string }
//       large?: { url: string }
//     }
//   }
//   author?: {
//     id: number
//     username: string
//     email: string
//   }
//   hashtags?: Array<{
//     id: number
//     name: string
//     slug: string
//     color?: string
//   }>
//   location?: {
//     latitude: number
//     longitude: number
//     address?: string
//     city?: string
//     country: string
//   }
//   likes?: number
//   views?: number
//   width?: number
//   height?: number
//   orientation?: 'portrait' | 'landscape' | 'square'
//   sponsor_url?: string
//   featured?: boolean
//   uploaded_at?: string
//   approved_at?: string
//   createdAt?: string
// }

// export function PhotoGalleryWidget() {
//   const [photos, setPhotos] = useState<PattayaPulsePhoto[]>([])
//   const [currentPhoto, setCurrentPhoto] = useState(0)
//   const [loading, setLoading] = useState(true)
//   const [lightboxOpen, setLightboxOpen] = useState(false)
//   const [lightboxPhoto, setLightboxPhoto] = useState<PattayaPulsePhoto | null>(null)

//   useEffect(() => {
//     loadPhotoData()
//     const interval = setInterval(loadPhotoData, 180000) // Refresh every 3 minutes
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     if (photos.length > 0) {
//       // Auto-rotate photos every 3 seconds
//       const interval = setInterval(() => {
//         setCurrentPhoto((prev) => (prev + 1) % photos.length)
//       }, 3000)
//       return () => clearInterval(interval)
//     }
//   }, [photos])

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (lightboxOpen && lightboxPhoto) {
//         if (event.key === 'Escape') {
//           closeLightbox()
//         } else if (event.key === 'ArrowLeft') {
//           const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
//           const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
//           setLightboxPhoto(photos[prevIndex])
//         } else if (event.key === 'ArrowRight') {
//           const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
//           const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
//           setLightboxPhoto(photos[nextIndex])
//         }
//       }
//     }

//     document.addEventListener('keydown', handleKeyDown)
//     return () => document.removeEventListener('keydown', handleKeyDown)
//   }, [lightboxOpen, lightboxPhoto, photos])

//   const loadPhotoData = async () => {
//     try {
//       setLoading(true)
//       console.log('Fetching Pattaya Pulse photos from Strapi...')
//       const response = await fetch(buildApiUrl("photos/latest?limit=5&populate=*"))
      
//       if (response.ok) {
//         const data = await response.json()
        
//         if (data.data && data.data.length > 0) {
//           setPhotos(data.data)
//         } else {
//           setPhotos([])
//         }
//       } else {
//         console.error("Failed to load Pattaya Pulse photos:", response.status)
//         setPhotos([])
//       }
//     } catch (error) {
//       console.error("Failed to load Pattaya Pulse photos:", error)
//       setPhotos([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatTimeAgo = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
//     if (diffInSeconds < 60) return "Just now"
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
//     return date.toLocaleDateString()
//   }

//   const handlePhotoClick = (photo: PattayaPulsePhoto) => {
//     if (photo.sponsor_url) {
//       window.open(photo.sponsor_url, '_blank')
//     } else {
//       setLightboxPhoto(photo)
//       setLightboxOpen(true)
//     }
//   }

//   const closeLightbox = () => {
//     setLightboxOpen(false)
//     setLightboxPhoto(null)
//   }

//   if (loading) {
//     return (
//       <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
//         <CardContent className="p-6">
//           <div className="animate-pulse space-y-4">
//             <div className="h-5 bg-gray-100 rounded-full w-28"></div>
//             <div className="h-24 bg-gray-50 rounded-2xl"></div>
//             <div className="space-y-3">
//               <div className="h-4 bg-gray-100 rounded-full"></div>
//               <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (photos.length === 0) {
//     return (
//       <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
//         <CardHeader className="pb-4 px-6 pt-6">
//         <CardTitle className="text-base font-medium text-gray-900 flex items-center">
//           <Camera className="w-4 h-4 mr-2 text-gray-600" />
//           Pattaya Pulse
//         </CardTitle>
//         </CardHeader>
//         <CardContent className="px-6 pb-6">
//           <div className="text-center text-gray-400 py-12">
//             <p className="text-sm font-medium">No photos available</p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const photo = photos[currentPhoto]

//   return (
//     <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
//       {/* Global Sponsorship Banner */}
//       <SponsorshipBanner widgetType="photos" />
//       <CardHeader className="pb-4 px-6 pt-6">
//         <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
//           <div className="flex items-center">
//             <Camera className="w-4 h-4 mr-2 text-gray-600" />
//             Photo Gallery
//           </div>
//           <span className="text-xs text-gray-400 font-medium">
//             {photos.length} photos
//           </span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="px-6 pb-6 space-y-4">
//         {/* Photo */}
//         <div className="relative cursor-pointer" onClick={() => handlePhotoClick(photo)}>
//           <img
//             src={photo.image ? buildStrapiUrl(photo.image.url) : "/placeholder.svg"}
//             alt={photo.caption || "Pattaya photo"}
//             className="w-full h-64 object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity"
//           />
//           {photo.featured && (
//             <Badge className="absolute top-3 left-3 text-xs bg-yellow-500 text-white border-0 font-medium">
//               Featured
//             </Badge>
//           )}
//           {photo.sponsor_url && (
//             <Badge className="absolute top-3 right-3 text-xs bg-green-500 text-white border-0 font-medium">
//               Sponsored
//             </Badge>
//           )}
//           <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
//             {currentPhoto + 1}/{photos.length}
//           </div>
//         </div>

//         {/* Photo Info */}
//         <div className="space-y-3">
//           <div>
//             {photo.caption && (
//               <h3 className="text-sm font-medium text-gray-900 line-clamp-1 leading-tight">{photo.caption}</h3>
//             )}
//             <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
//               <div className="flex items-center space-x-1 min-w-0">
//                 <User className="w-3 h-3 flex-shrink-0" />
//                 <span className="truncate font-medium">{photo.author?.username || 'Anonymous'}</span>
//               </div>
//               <span className="flex-shrink-0 font-medium">{formatTimeAgo(photo.uploaded_at || photo.createdAt || '')}</span>
//             </div>
//           </div>

//           {photo.location?.address && (
//             <div className="flex items-center text-xs text-gray-500">
//               <MapPin className="w-3 h-3 mr-1" />
//               <span>{photo.location.address}</span>
//             </div>
//           )}

//           {/* Hashtags */}
//           {photo.hashtags && photo.hashtags.length > 0 && (
//             <div className="flex flex-wrap gap-1">
//               {photo.hashtags.slice(0, 2).map((hashtag) => (
//                 <Badge key={hashtag.id} variant="secondary" className="text-xs">
//                   #{hashtag?.name}
//                 </Badge>
//               ))}
//             </div>
//           )}

//           {/* Stats */}
//           <div className="flex items-center justify-between text-xs text-gray-400">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-1">
//                 <Heart className="w-3 h-3 text-red-400 flex-shrink-0" />
//                 <span className="font-medium">{photo.likes || 0}</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <Eye className="w-3 h-3 flex-shrink-0" />
//                 <span className="font-medium">{photo.views || 0}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation dots */}
//         <div className="flex justify-center space-x-2">
//           {photos.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPhoto(index)}
//               className={`w-2 h-2 rounded-full transition-all duration-200 ${
//                 index === currentPhoto ? "bg-gray-600" : "bg-gray-200"
//               }`}
//             />
//           ))}
//         </div>
//       </CardContent>
      
//       {/* Lightbox Modal */}
//       {lightboxOpen && lightboxPhoto && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
//           <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
//             {/* Close Button */}
//             <button
//               onClick={closeLightbox}
//               className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
            
//             {/* Image */}
//             <div className="relative">
//               <img
//                 src={lightboxPhoto.image ? buildStrapiUrl(lightboxPhoto.image.url) : "/placeholder.svg"}
//                 alt={lightboxPhoto.caption || "Pattaya photo"}
//                 className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
//               />
              
//               {/* Navigation Arrows */}
//               {photos.length > 1 && (
//                 <>
//                   <button
//                     onClick={() => {
//                       const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
//                       const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
//                       setLightboxPhoto(photos[prevIndex])
//                     }}
//                     className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() => {
//                       const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
//                       const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
//                       setLightboxPhoto(photos[nextIndex])
//                     }}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </button>
//                 </>
//               )}
//             </div>
            
//             {/* Photo Info in Lightbox */}
//             <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
//               {lightboxPhoto.caption && (
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{lightboxPhoto.caption}</h3>
//               )}
//               <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
//                 <div className="flex items-center space-x-1">
//                   <User className="w-4 h-4" />
//                   <span className="font-medium">{lightboxPhoto.author?.username || 'Anonymous'}</span>
//                 </div>
//                 <span className="font-medium">{formatTimeAgo(lightboxPhoto.uploaded_at || lightboxPhoto.createdAt || '')}</span>
//               </div>
//               {lightboxPhoto.location?.address && (
//                 <div className="flex items-center text-sm text-gray-500 mb-3">
//                   <MapPin className="w-4 h-4 mr-1" />
//                   <span>{lightboxPhoto.location.address}</span>
//                 </div>
//               )}
              
//               {/* Hashtags */}
//               {lightboxPhoto.hashtags && lightboxPhoto.hashtags.length > 0 && (
//                 <div className="flex flex-wrap gap-1 mb-3">
//                   {lightboxPhoto.hashtags.map((hashtag) => (
//                     <Badge key={hashtag.id} variant="secondary" className="text-xs">
//                       #{hashtag?.name}
//                     </Badge>
//                   ))}
//                 </div>
//               )}
              
//               {/* Stats */}
//               <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-1">
//                     <Heart className="w-4 h-4 text-red-400" />
//                     <span className="font-medium">{lightboxPhoto.likes || 0}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Eye className="w-4 h-4" />
//                     <span className="font-medium">{lightboxPhoto.views || 0}</span>
//                   </div>
//                 </div>
//                 {lightboxPhoto.featured && (
//                   <Badge className="text-xs bg-yellow-500 text-white border-0 font-medium">
//                     Featured
//                   </Badge>
//                 )}
//               </div>
              
//               {/* Submit Your Photo Button */}
//               <div className="text-center">
//                 <button
//                   onClick={() => {
//                     // Navigate to photo submission page
//                     window.location.href = '/photos/upload'
//                   }}
//                   className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Camera className="w-4 h-4 mr-2" />
//                   Submit Your Photo
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Card>
//   )
// }


"use client"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, Eye, User, MapPin } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

interface PattayaPulsePhoto {
  id: number
  caption?: string
  image?: { id: number; name: string; url: string; formats?: any }
  author?: { id: number; username: string; email: string }
  hashtags?: Array<{ id: number; name: string; slug: string; color?: string }>
  location?: { latitude: number; longitude: number; address?: string; city?: string; country: string }
  likes?: number
  views?: number
  width?: number
  height?: number
  orientation?: 'portrait' | 'landscape' | 'square'
  sponsor_url?: string
  featured?: boolean
  uploaded_at?: string
  approved_at?: string
  createdAt?: string
}

export function PhotoGalleryWidget() {
  const [photos, setPhotos] = useState<PattayaPulsePhoto[]>([])
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<PattayaPulsePhoto | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadPhotoData()
    const interval = setInterval(loadPhotoData, 180000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % photos.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [photos])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!lightboxOpen || !lightboxPhoto) return
      if (event.key === 'Escape') closeLightbox()
      else if (event.key === 'ArrowLeft') {
        const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
        setLightboxPhoto(photos[prevIndex])
      } else if (event.key === 'ArrowRight') {
        const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
        const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
        setLightboxPhoto(photos[nextIndex])
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxPhoto, photos])

  const loadPhotoData = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("photos/latest?limit=5&populate=*"))
      if (response.ok) {
        const data = await response.json()
        const newPhotos = data.data?.length ? data.data : []
        setPhotos(newPhotos)
        if (newPhotos?.length) {
          const firstUrl = newPhotos[0]?.image?.url ? buildStrapiUrl(newPhotos[0].image.url) : ""
          // eslint-disable-next-line no-console
          console.log("PhotoGalleryWidget: loaded", newPhotos.length, "photos. First image URL:", firstUrl)
        } else {
          // eslint-disable-next-line no-console
          console.warn("PhotoGalleryWidget: no photos returned from API")
        }
      } else setPhotos([])
    } catch {
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return "Just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const handlePhotoClick = (photo: PattayaPulsePhoto) => {
    if (photo.sponsor_url) window.open(photo.sponsor_url, '_blank')
    else {
      setLightboxPhoto(photo)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxPhoto(null)
  }

  // Lightbox Modal Component
  const LightboxModal = () => {
    if (!lightboxOpen || !lightboxPhoto || !mounted) return null

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl transition-all duration-700">
        <div className={`relative max-w-6xl max-h-[95vh] w-full mx-4 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border-2 border-white/20 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-purple-400/10`}>
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-30 bg-red-500/60 hover:bg-red-500/80 text-white p-3 rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/30 hover:scale-110"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative flex justify-center items-center p-6">
            {(() => {
              const lbUrl = lightboxPhoto?.image?.url ? buildStrapiUrl(lightboxPhoto.image.url) : "/placeholder.svg"
              return (
                <img
                  src={lbUrl}
                  alt={lightboxPhoto.caption || "Pattaya photo"}
                  className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-transform duration-300"
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    if (target.src !== window.location.origin + "/placeholder.svg" && !target.src.endsWith("/placeholder.svg")) {
                      // eslint-disable-next-line no-console
                      console.error("PhotoGalleryWidget: lightbox image failed to load, fallback to placeholder:", target.src)
                      target.src = "/placeholder.svg"
                    }
                  }}
                />
              )
            })()}

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
                    setLightboxPhoto(photos[prevIndex])
                  }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-cyan-500/60 hover:bg-cyan-500/80 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/30 hover:scale-110"
                  aria-label="Previous photo"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
                    const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
                    setLightboxPhoto(photos[nextIndex])
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-cyan-500/60 hover:bg-cyan-500/80 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/30 hover:scale-110"
                  aria-label="Next photo"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="mt-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-b-3xl p-8 text-gray-800 select-text border-t border-white/20">
            {lightboxPhoto.caption && (
              <h3 className="text-3xl font-bold mb-4 text-gray-800">
                {lightboxPhoto.caption}
              </h3>
            )}
            
            <div className="flex items-center justify-between text-base mb-6 bg-white/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/40">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500/40 rounded-xl">
                  <User className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-bold text-lg text-gray-800">{lightboxPhoto.author?.username || 'Anonymous'}</span>
              </div>
              <span className="font-bold text-cyan-600">{formatTimeAgo(lightboxPhoto.uploaded_at || lightboxPhoto.createdAt || '')}</span>
            </div>

            {lightboxPhoto.location?.address && (
              <div className="flex items-center text-sm bg-teal-500/20 backdrop-blur-md rounded-xl px-4 py-3 mb-6 border border-teal-400/30">
                <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                <span className="font-medium text-gray-700">📍 {lightboxPhoto.location.address}</span>
              </div>
            )}

            {lightboxPhoto.hashtags && lightboxPhoto.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {lightboxPhoto.hashtags.map((h) => (
                  <Badge
                    key={h.id}
                    className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-pink-400/30 to-purple-400/30 backdrop-blur-md border border-pink-300/40 rounded-xl text-gray-800 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
                  >
                    #{h?.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-base text-gray-700 mb-8 font-bold bg-white/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/40">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <div className="p-2 bg-red-500/40 rounded-xl group-hover:bg-red-500/60 transition-colors duration-200">
                    <Heart className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                  </div>
                  <span className="font-bold text-lg text-gray-800">{lightboxPhoto.likes || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/40 rounded-xl">
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-bold text-lg text-gray-800">{lightboxPhoto.views || 0}</span>
                </div>
              </div>
              {lightboxPhoto.featured && (
                <Badge className="text-sm bg-gradient-to-r from-amber-400 to-yellow-400 text-white border-0 font-bold shadow-lg px-4 py-2 rounded-xl">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => (window.location.href = '/photos/upload')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500/70 to-blue-500/70 hover:from-cyan-500/90 hover:to-blue-500/90 backdrop-blur-md text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl border border-white/30 hover:scale-105 group"
                aria-label="Submit your photo"
              >
                <Camera className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                📸 Share Your Pattaya Moment
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // linear gradient glassmorphic background CSS string
  const glassGradientBg = "bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-teal-400/20"

  if (loading) {
    return (
      <Card className={`h-full bg-gradient-to-br from-cyan-400/15 via-blue-400/15 to-teal-400/15 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-xl animate-pulse select-none relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <CardContent className="p-6 relative z-10">
          <div className="space-y-4">
            <div className="h-5 bg-gray-300/50 rounded-full w-28 animate-pulse shadow-sm" />
            <div className="h-24 bg-gray-200/50 rounded-3xl animate-pulse shadow-sm" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-300/50 rounded-full animate-pulse shadow-sm" />
              <div className="h-3 bg-gray-300/50 rounded-full w-1/2 animate-pulse shadow-sm" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!photos.length) {
    return (
      <Card className={`h-full bg-gradient-to-br from-cyan-400/15 via-blue-400/15 to-teal-400/15 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-xl flex flex-col justify-center items-center text-gray-800 select-none relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-cyan-300/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-teal-300/30 rounded-full animate-bounce"></div>
        </div>
        <CardHeader className="pb-4 px-6 pt-6 relative z-10">
          <CardTitle className="text-lg font-bold flex items-center justify-center gap-3 drop-shadow-lg text-gray-800">
            <div className="p-2 bg-cyan-500/30 rounded-2xl backdrop-blur-sm">
              <Camera className="w-6 h-6 text-cyan-600" />
            </div>
            <span>Pattaya Gallery</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 relative z-10">
          <p className="text-center text-sm font-semibold drop-shadow-md opacity-90 text-gray-700">📸 No photos available yet</p>
          <p className="text-center text-xs mt-2 opacity-70 text-gray-600">Check back soon for amazing Pattaya moments!</p>
        </CardContent>
      </Card>
    )
  }

  const photo = photos[currentPhoto]

  return (
    <Card className={`bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-teal-400/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all duration-700 overflow-hidden h-full flex flex-col relative group`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-24 right-12 w-12 h-12 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-16 left-16 w-10 h-10 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-32 right-20 w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full animate-pulse delay-700"></div>
      </div>
      <SponsorshipBanner widgetType="photos" />
      <CardHeader className="pb-3 px-4 pt-4 relative z-10">
        <CardTitle className="text-sm font-bold text-gray-800 flex items-center justify-between select-none drop-shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-xl backdrop-blur-md shadow-lg border border-white/30">
              <Camera className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-800">Gallery</span>
              <span className="text-xs text-cyan-600 font-normal">📸 {photos.length} photos</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4 flex-1 flex flex-col min-h-0">
        <div
          className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-cyan-500/20 h-48 group border border-white/20 bg-gradient-to-br from-gray-100/50 to-gray-200/30"
          onClick={() => handlePhotoClick(photo)}
          role="button"
          tabIndex={0}
          aria-label="View photo details"
          onKeyDown={(e) => { if (e.key === 'Enter') handlePhotoClick(photo) }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          {(() => {
            const imageUrl = photo?.image?.url ? buildStrapiUrl(photo.image.url) : "/placeholder.svg"
            return (
              <img
                src={imageUrl}
                alt={photo.caption || "Pattaya photo"}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 z-0"
                draggable={false}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  if (target.src !== window.location.origin + "/placeholder.svg" && !target.src.endsWith("/placeholder.svg")) {
                    // eslint-disable-next-line no-console
                    console.error("PhotoGalleryWidget: image failed to load, falling back to placeholder:", target.src)
                    target.src = "/placeholder.svg"
                  }
                }}
              />
            )
          })()}
          
          {/* Enhanced overlay with tropical elements */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl border border-white/50">
              <div className="flex items-center gap-2 text-cyan-600">
                <Eye className="w-5 h-5" />
                <span className="font-semibold text-sm">View Photo</span>
              </div>
            </div>
          </div>

          {photo.featured && (
            <Badge className="absolute top-4 left-4 text-xs bg-gradient-to-r from-amber-400 to-yellow-400 text-white border-0 font-bold shadow-lg backdrop-blur-sm px-3 py-1.5 rounded-xl animate-pulse">
              ⭐ Featured
            </Badge>
          )}
          {photo.sponsor_url && (
            <Badge className="absolute top-4 right-4 text-xs bg-gradient-to-r from-emerald-400 to-green-400 text-white border-0 font-bold shadow-lg backdrop-blur-sm px-3 py-1.5 rounded-xl">
              💎 Sponsored
            </Badge>
          )}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg select-none border border-white/20">
            <span className="text-cyan-300">{currentPhoto + 1}</span>
            <span className="mx-1 opacity-60">/</span>
            <span>{photos.length}</span>
          </div>
        </div>

        <div className="space-y-3 select-none text-gray-800 drop-shadow-md relative z-10">
          {photo.caption && (
            <h3 className="text-base font-semibold line-clamp-2 leading-tight text-gray-800">
              {photo.caption}
            </h3>
          )}
          <div className="flex items-center justify-between text-sm font-medium bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30">
            <div className="flex items-center space-x-2 min-w-0">
              <User className="w-4 h-4 text-cyan-600" />
              <span className="truncate font-medium text-gray-800">{photo.author?.username || 'Anonymous'}</span>
            </div>
            <span className="flex-shrink-0 font-medium text-cyan-600 text-sm">
              {formatTimeAgo(photo.uploaded_at || photo.createdAt || '')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-medium bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-medium text-gray-800">{photo.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-800">{photo.views || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-2 select-none mt-auto pt-3 relative z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPhoto(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm border hover:scale-110 ${
                i === currentPhoto 
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-400/60 scale-110 shadow-cyan-400/30" 
                  : "bg-gray-300/50 border-gray-400/40 hover:bg-gray-400/50 hover:border-gray-500/60"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      </CardContent>

      <LightboxModal />
    </Card>
  )
}

export default PhotoGalleryWidget