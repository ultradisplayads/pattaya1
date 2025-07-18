"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Camera, Heart, Share2, Download, Search, Grid, List } from "lucide-react"

interface Photo {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  photographer: string
  location: string
  category: string
  likes: number
  views: number
  uploadDate: string
  tags: string[]
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Load photos - in real app, fetch from API
    const mockPhotos: Photo[] = [
      {
        id: "1",
        title: "Pattaya Beach Sunset",
        description: "Beautiful sunset over Pattaya Beach with vibrant colors",
        url: "/placeholder.svg?height=600&width=800&text=Sunset+Beach",
        thumbnail: "/placeholder.svg?height=300&width=400&text=Sunset+Beach",
        photographer: "John Photographer",
        location: "Pattaya Beach",
        category: "nature",
        likes: 234,
        views: 1520,
        uploadDate: "2024-01-15",
        tags: ["sunset", "beach", "nature", "pattaya"],
      },
      {
        id: "2",
        title: "Walking Street Nightlife",
        description: "Vibrant nightlife scene on Walking Street",
        url: "/placeholder.svg?height=600&width=800&text=Walking+Street",
        thumbnail: "/placeholder.svg?height=300&width=400&text=Walking+Street",
        photographer: "Night Explorer",
        location: "Walking Street",
        category: "nightlife",
        likes: 189,
        views: 980,
        uploadDate: "2024-01-14",
        tags: ["nightlife", "street", "lights", "entertainment"],
      },
      {
        id: "3",
        title: "Thai Street Food",
        description: "Delicious local street food at Thepprasit Market",
        url: "/placeholder.svg?height=600&width=800&text=Street+Food",
        thumbnail: "/placeholder.svg?height=300&width=400&text=Street+Food",
        photographer: "Food Lover",
        location: "Thepprasit Market",
        category: "food",
        likes: 156,
        views: 750,
        uploadDate: "2024-01-13",
        tags: ["food", "street food", "thai", "market"],
      },
    ]
    setPhotos(mockPhotos)
  }, [])

  const categories = ["all", "nature", "nightlife", "food", "culture", "activities"]

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Camera className="w-8 h-8 mr-3 text-blue-500" />
                Photo Gallery
              </h1>
              <p className="text-gray-600">Discover beautiful photos of Pattaya</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {viewMode === "grid" ? (
                <>
                  <div className="relative">
                    <img
                      src={photo.thumbnail || "/placeholder.svg"}
                      alt={photo.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{photo.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{photo.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{photo.photographer}</span>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {photo.likes}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex p-4">
                  <img
                    src={photo.thumbnail || "/placeholder.svg"}
                    alt={photo.title}
                    className="w-32 h-24 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{photo.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{photo.photographer}</span>
                          <span>{photo.location}</span>
                          <Badge variant="outline" size="sm">
                            {photo.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-sm text-gray-500">
                          <Heart className="w-3 h-3 mr-1" />
                          {photo.likes}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
