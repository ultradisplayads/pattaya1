// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Star, MapPin, Clock, Phone, ExternalLink, Heart } from "lucide-react"
// import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
// import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

// interface Business {
//   id: string
//   name: string
//   category: string
//   rating: number
//   reviews: number
//   location: string
//   image: string
//   description: string
//   hours: string
//   phone: string
//   featured: boolean
//   deal?: string
//   tags: string[]
// }

// interface StrapiBusinessSpotlight {
//   id: number
//   Name: string
//   Category: string
//   Rating: number
//   Reviews: number
//   Location: string
//   Image?: {
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
//   Description: string
//   Hours: string
//   Phone: string
//   Website: string
//   Featured: boolean
//   Deal: string
//   Tags: string[]
//   IsActive: boolean
//   Address: string
//   Email: string
//   SocialMedia: {
//     facebook?: string
//     instagram?: string
//     twitter?: string
//   }
//   LastUpdated: string
//   createdAt: string
//   updatedAt: string
//   publishedAt: string
// }

// export function BusinessSpotlightWidget() {
//   const [businesses, setBusinesses] = useState<Business[]>([])
//   const [currentBusiness, setCurrentBusiness] = useState(0)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     loadBusinessSpotlights()
//     const interval = setInterval(loadBusinessSpotlights, 300000) // Update every 5 minutes
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     if (businesses.length > 0) {
//       // Auto-rotate businesses every 5 seconds
//       const interval = setInterval(() => {
//         setCurrentBusiness((prev) => (prev + 1) % businesses.length)
//       }, 5000)
//       return () => clearInterval(interval)
//     }
//   }, [businesses])

//   const loadBusinessSpotlights = async () => {
//     try {
//       setLoading(true)
//       console.log('Fetching business spotlights from Strapi...')
      
//       const response = await fetch(buildApiUrl("business-spotlights?populate=*&sort=Rating:desc"))
      
//       if (response.ok) {
//         const data = await response.json()
        
//         if (data.data && data.data.length > 0) {
//           const transformedBusinesses: Business[] = data.data.map((strapiBusiness: StrapiBusinessSpotlight) => {
//             // Get image URL with fallback
//             let imageUrl = "/placeholder.svg?height=120&width=200&text=Business"
//             if (strapiBusiness.Image) {
//               imageUrl = buildStrapiUrl(strapiBusiness.Image.url)
//             }

//             return {
//               id: strapiBusiness.id.toString(),
//               name: strapiBusiness.Name,
//               category: strapiBusiness.Category,
//               rating: strapiBusiness.Rating,
//               reviews: strapiBusiness.Reviews,
//               location: strapiBusiness.Location,
//               image: imageUrl,
//               description: strapiBusiness.Description,
//               hours: strapiBusiness.Hours,
//               phone: strapiBusiness.Phone,
//               featured: strapiBusiness.Featured,
//               deal: strapiBusiness.Deal,
//               tags: strapiBusiness.Tags || [],
//             }
//           })
          
//           setBusinesses(transformedBusinesses)
//         } else {
//           setBusinesses(getFallbackBusinesses())
//         }
//       } else {
//         console.error("Failed to load business spotlights from Strapi:", response.status)
//         setBusinesses(getFallbackBusinesses())
//       }
//     } catch (error) {
//       console.error("Failed to load business spotlights:", error)
//       setBusinesses(getFallbackBusinesses())
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFallbackBusinesses = (): Business[] => [
//     {
//       id: "1",
//       name: "Ocean View Restaurant",
//       category: "Fine Dining",
//       rating: 4.8,
//       reviews: 324,
//       location: "Beach Road, Pattaya",
//       image: "/placeholder.svg?height=120&width=200&text=Restaurant",
//       description: "Authentic Thai cuisine with stunning ocean views. Fresh seafood daily.",
//       hours: "11:00 AM - 11:00 PM",
//       phone: "+66 38 123 456",
//       featured: true,
//       deal: "20% off dinner menu",
//       tags: ["Seafood", "Thai", "Ocean View"],
//     },
//     {
//       id: "2",
//       name: "Sunset Spa & Wellness",
//       category: "Health & Beauty",
//       rating: 4.9,
//       reviews: 189,
//       location: "Central Pattaya",
//       image: "/placeholder.svg?height=120&width=200&text=Spa",
//       description: "Traditional Thai massage and modern wellness treatments in luxury setting.",
//       hours: "9:00 AM - 10:00 PM",
//       phone: "+66 38 234 567",
//       featured: true,
//       deal: "Buy 2 get 1 free massage",
//       tags: ["Massage", "Wellness", "Luxury"],
//     },
//     {
//       id: "3",
//       name: "Adventure Dive Center",
//       category: "Water Sports",
//       rating: 4.7,
//       reviews: 156,
//       location: "Jomtien Beach",
//       image: "/placeholder.svg?height=120&width=200&text=Diving",
//       description: "Professional diving courses and underwater adventures for all levels.",
//       hours: "7:00 AM - 6:00 PM",
//       phone: "+66 38 345 678",
//       featured: true,
//       deal: "Free equipment rental",
//       tags: ["Diving", "Adventure", "Certified"],
//     },
//   ]

//   if (loading) {
//     return (
//       <Card className="h-full bg-white/95 backdrop-blur-xl border-0 shadow-sm">
//         <CardContent className="p-4">
//           <div className="animate-pulse space-y-4">
//             <div className="h-6 bg-gray-100 rounded"></div>
//             <div className="h-24 bg-gray-100 rounded-lg"></div>
//             <div className="space-y-2">
//               <div className="h-4 bg-gray-100 rounded"></div>
//               <div className="h-3 bg-gray-100 rounded w-3/4"></div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (businesses.length === 0) return <div className="animate-pulse bg-gray-100 rounded-lg h-full"></div>

//   const business = businesses[currentBusiness]

//   return (
//     <Card className="h-full bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300">
//       {/* Global Sponsorship Banner */}
//       <SponsorshipBanner widgetType="business-spotlight" />
//       <CardHeader className="pb-3">
//         <CardTitle className="text-[15px] font-medium text-gray-900 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
//             <span>Business Spotlight</span>
//           </div>
//           <Heart className="w-4 h-4 text-red-500" />
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="pt-0 space-y-2">
//         {/* Business Image */}
//         <div className="relative">
//           <img
//             src={business.image || "/placeholder.svg"}
//             alt={business.name}
//             className="w-full h-24 object-cover rounded-lg"
//           />
//           {business.featured && (
//             <Badge className="absolute top-2 left-2 text-[11px] px-2 py-0.5 font-medium bg-amber-500/10 text-amber-600 border border-amber-200 rounded-full">
//               Featured
//             </Badge>
//           )}
//           {business.deal && (
//             <Badge className="absolute top-2 right-2 text-[11px] px-2 py-0.5 font-medium bg-red-500/10 text-red-600 border border-red-200 rounded-full">
//               Deal
//             </Badge>
//           )}
//         </div>

//         {/* Business Info */}
//         <div className="space-y-1.5">
//           <div className="flex items-start justify-between">
//             <div className="flex-1 min-w-0">
//               <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1">{business.name}</h3>
//               <p className="text-[13px] text-gray-600">{business.category}</p>
//             </div>
//             <div className="flex items-center gap-1 text-[11px]">
//               <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//               <span className="font-medium">{business.rating}</span>
//               <span className="text-gray-500">({business.reviews})</span>
//             </div>
//           </div>

//           <p className="text-[13px] text-gray-600 line-clamp-1">{business.description}</p>

//           {/* Deal */}
//           {business.deal && (
//             <div className="bg-red-50/50 border border-red-100 rounded-lg p-1.5">
//               <p className="text-[13px] font-medium text-red-600">🎉 {business.deal}</p>
//             </div>
//           )}

//           {/* Tags */}
//           <div className="flex flex-wrap gap-1">
//             {business.tags.slice(0, 2).map((tag, index) => (
//               <Badge key={index} className="text-[11px] px-2 py-0.5 font-medium bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
//                 {tag}
//               </Badge>
//             ))}
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-0.5 text-[11px] text-gray-500">
//             <div className="flex items-center gap-1.5">
//               <MapPin className="w-3 h-3" />
//               <span className="line-clamp-1">{business.location}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Clock className="w-3 h-3" />
//               <span>{business.hours}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Phone className="w-3 h-3" />
//               <span>{business.phone}</span>
//             </div>
//           </div>

//           {/* Action Button */}
//           <button className="w-full bg-emerald-500/10 text-emerald-600 text-[13px] py-1.5 rounded-lg hover:bg-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 border border-emerald-200 font-medium">
//             <span>View Details</span>
//             <ExternalLink className="w-3.5 h-3.5" />
//           </button>
//         </div>

//         {/* Navigation dots */}
//         <div className="flex justify-center gap-1">
//           {businesses.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentBusiness(index)}
//               className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
//                 index === currentBusiness ? "bg-emerald-500" : "bg-gray-200"
//               }`}
//             />
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Phone, ExternalLink, Heart, Sparkles, Utensils, Gem, Zap } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"
import { motion, AnimatePresence } from "framer-motion"

interface Business {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  location: string
  image: string
  description: string
  hours: string
  phone: string
  featured: boolean
  deal?: string
  tags: string[]
}

interface StrapiBusinessSpotlight {
  id: number
  Name: string
  Category: string
  Rating: number
  Reviews: number
  Location: string
  Image?: {
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
  Description: string
  Hours: string
  Phone: string
  Website: string
  Featured: boolean
  Deal: string
  Tags: string[]
  IsActive: boolean
  Address: string
  Email: string
  SocialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function BusinessSpotlightWidget() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [currentBusiness, setCurrentBusiness] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadBusinessSpotlights()
    const interval = setInterval(loadBusinessSpotlights, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (businesses.length > 0 && !isHovered) {
      // Auto-rotate businesses every 5 seconds
      const interval = setInterval(() => {
        setCurrentBusiness((prev) => (prev + 1) % businesses.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [businesses, isHovered])

  const loadBusinessSpotlights = async () => {
    try {
      setLoading(true)
      console.log('Fetching business spotlights from Strapi...')
      
      const response = await fetch(buildApiUrl("business-spotlights?populate=*&sort=Rating:desc"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          const transformedBusinesses: Business[] = data.data.map((strapiBusiness: StrapiBusinessSpotlight) => {
            // Get image URL with fallback
            let imageUrl = "/placeholder.svg?height=120&width=200&text=Business"
            if (strapiBusiness.Image) {
              imageUrl = buildStrapiUrl(strapiBusiness.Image.url)
            }

            return {
              id: strapiBusiness.id.toString(),
              name: strapiBusiness.Name,
              category: strapiBusiness.Category,
              rating: strapiBusiness.Rating,
              reviews: strapiBusiness.Reviews,
              location: strapiBusiness.Location,
              image: imageUrl,
              description: strapiBusiness.Description,
              hours: strapiBusiness.Hours,
              phone: strapiBusiness.Phone,
              featured: strapiBusiness.Featured,
              deal: strapiBusiness.Deal,
              tags: strapiBusiness.Tags || [],
            }
          })
          
          setBusinesses(transformedBusinesses)
        } else {
          setBusinesses(getFallbackBusinesses())
        }
      } else {
        console.error("Failed to load business spotlights from Strapi:", response.status)
        setBusinesses(getFallbackBusinesses())
      }
    } catch (error) {
      console.error("Failed to load business spotlights:", error)
      setBusinesses(getFallbackBusinesses())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackBusinesses = (): Business[] => [
    {
      id: "1",
      name: "Ocean View Restaurant",
      category: "Fine Dining",
      rating: 4.8,
      reviews: 324,
      location: "Beach Road, Pattaya",
      image: "/placeholder.svg?height=120&width=200&text=Restaurant",
      description: "Authentic Thai cuisine with stunning ocean views. Fresh seafood daily.",
      hours: "11:00 AM - 11:00 PM",
      phone: "+66 38 123 456",
      featured: true,
      deal: "20% off dinner menu",
      tags: ["Seafood", "Thai", "Ocean View"],
    },
    {
      id: "2",
      name: "Sunset Spa & Wellness",
      category: "Health & Beauty",
      rating: 4.9,
      reviews: 189,
      location: "Central Pattaya",
      image: "/placeholder.svg?height=120&width=200&text=Spa",
      description: "Traditional Thai massage and modern wellness treatments in luxury setting.",
      hours: "9:00 AM - 10:00 PM",
      phone: "+66 38 234 567",
      featured: true,
      deal: "Buy 2 get 1 free massage",
      tags: ["Massage", "Wellness", "Luxury"],
    },
    {
      id: "3",
      name: "Adventure Dive Center",
      category: "Water Sports",
      rating: 4.7,
      reviews: 156,
      location: "Jomtien Beach",
      image: "/placeholder.svg?height=120&width=200&text=Diving",
      description: "Professional diving courses and underwater adventures for all levels.",
      hours: "7:00 AM - 6:00 PM",
      phone: "+66 38 345 678",
      featured: true,
      deal: "Free equipment rental",
      tags: ["Diving", "Adventure", "Certified"],
    },
  ]

  // Enhanced Floating icons component with multiple icon types
  const FloatingIcons = () => {
    const icons = [
      { component: Sparkles, color: "text-amber-400/30", size: 14 },
      { component: Utensils, color: "text-rose-400/30", size: 12 },
      { component: Gem, color: "text-blue-400/30", size: 13 },
      { component: Zap, color: "text-emerald-400/30", size: 12 },
      { component: Star, color: "text-yellow-400/30", size: 12 },
      { component: Heart, color: "text-pink-400/30", size: 12 },
    ];
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => {
          const IconComponent = icons[i % icons.length].component;
          const color = icons[i % icons.length].color;
          const size = icons[i % icons.length].size;
          
          return (
            <motion.div
              key={i}
              className={`absolute ${color}`}
              initial={{ 
                x: Math.random() * 100, 
                y: Math.random() * 100,
                rotate: Math.random() * 360,
                scale: 0.8 + Math.random() * 0.7
              }}
              animate={{ 
                y: [null, (Math.random() * 30) - 15, 0],
                x: [null, (Math.random() * 20) - 10, 0],
                rotate: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.7
              }}
            >
              <IconComponent size={size} />
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg rounded-xl overflow-hidden relative">
        <FloatingIcons />
        <CardContent className="p-4 relative z-10">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"></div>
            <div className="h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"></div>
              <div className="h-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (businesses.length === 0) return (
    <div className="animate-pulse bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl h-full relative">
      <FloatingIcons />
    </div>
  )

  const business = businesses[currentBusiness]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full bg-gradient-to-br from-pink-300 to-blue-300 border-0 shadow-lg rounded-xl overflow-hidden relative">
        {/* Floating icons */}
        <FloatingIcons />
        
        {/* Background gradient elements for more depth */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
        
        {/* Global Sponsorship Banner */}
        <SponsorshipBanner widgetType="business-spotlight" />
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-[15px] font-medium text-gray-900 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <span>Business Spotlight</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2 relative z-10">
          {/* Business Image */}
          <div className="relative overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={business.id}
                src={business.image || "/placeholder.svg"}
                alt={business.name}
                className="w-full h-24 object-cover rounded-xl"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            {business.featured && (
              <motion.div 
                className="absolute top-2 left-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="text-[11px] px-2 py-0.5 font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-full shadow-sm">
                  Featured
                </Badge>
              </motion.div>
            )}
            
            {business.deal && (
              <motion.div 
                className="absolute top-2 right-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge className="text-[11px] px-2 py-0.5 font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 rounded-full shadow-sm">
                  Deal
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Business Info */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <motion.h3 
                  className="text-[15px] font-semibold text-gray-900 line-clamp-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {business.name}
                </motion.h3>
                <motion.p 
                  className="text-[13px] text-cyan-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {business.category}
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center gap-1 text-[11px] bg-amber-100 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-medium">{business.rating}</span>
                <span className="text-gray-500">({business.reviews})</span>
              </motion.div>
            </div>

            <motion.p 
              className="text-[13px] text-gray-600 line-clamp-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {business.description}
            </motion.p>

            {/* Deal */}
            {business.deal && (
              <motion.div 
                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-xl p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-[13px] font-medium text-red-600 flex items-center">
                  <motion.span 
                    className="mr-1"
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                  >
                    🎉
                  </motion.span>
                  {business.deal}
                </p>
              </motion.div>
            )}

            {/* Tags */}
            <motion.div 
              className="flex flex-wrap gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {business.tags.slice(0, 2).map((tag, index) => (
                <Badge 
                  key={index} 
                  className="text-[11px] px-2 py-0.5 font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 border-0 rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="space-y-0.5 text-[11px] text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="line-clamp-1">{business.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-purple-500" />
                <span>{business.hours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-emerald-500" />
                <span>{business.phone}</span>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button 
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[13px] py-2 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span>View Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Navigation dots */}
          <motion.div 
            className="flex justify-center gap-1 pt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {businesses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBusiness(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentBusiness 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 scale-125" 
                    : "bg-gray-300"
                }`}
              />
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}