"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NewsCarouselProps {
  theme: "primary" | "nightlife"
}

export function NewsCarousel({ theme }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [news] = useState([
    {
      id: 1,
      title: "New Beach Resort Opens in North Pattaya",
      summary: "Luxury beachfront property features world-class amenities and stunning ocean views.",
      image: "/placeholder.svg?height=200&width=400&text=Beach+Resort",
      category: "Tourism",
      readTime: "3 min read",
      isBreaking: true,
    },
    {
      id: 2,
      title: "Pattaya International Food Festival Announced",
      summary: "Three-day culinary celebration featuring cuisines from around the world.",
      image: "/placeholder.svg?height=200&width=400&text=Food+Festival",
      category: "Events",
      readTime: "2 min read",
      isBreaking: false,
    },
    {
      id: 3,
      title: "New Transportation Hub Opens",
      summary: "Modern terminal connects Pattaya to major cities across Thailand.",
      image: "/placeholder.svg?height=200&width=400&text=Transportation",
      category: "Infrastructure",
      readTime: "4 min read",
      isBreaking: false,
    },
  ])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)
  }

  const currentNews = news[currentIndex]

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={currentNews.image || "/placeholder.svg"}
            alt={currentNews.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            {currentNews.isBreaking && (
              <Badge variant="destructive" className="animate-pulse">
                BREAKING
              </Badge>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary">{currentNews.category}</Badge>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{currentNews.title}</h3>
          <p className="text-muted-foreground mb-4">{currentNews.summary}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{currentNews.readTime}</span>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read More
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" size="sm" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              {news.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={nextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
