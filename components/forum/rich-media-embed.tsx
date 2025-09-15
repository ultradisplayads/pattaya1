"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Play, Image, FileText } from "lucide-react"

interface RichMediaEmbedProps {
  url: string
  className?: string
}

interface EmbedData {
  type: 'youtube' | 'twitter' | 'instagram' | 'image' | 'link'
  title?: string
  description?: string
  thumbnail?: string
  videoId?: string
  tweetId?: string
  instagramId?: string
}

export function RichMediaEmbed({ url, className = "" }: RichMediaEmbedProps) {
  const [embedData, setEmbedData] = useState<EmbedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    parseUrl(url)
  }, [url])

  const parseUrl = (url: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const parsedUrl = new URL(url)
      const hostname = parsedUrl.hostname.toLowerCase()

      // YouTube
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        const videoId = extractYouTubeId(url)
        if (videoId) {
          setEmbedData({
            type: 'youtube',
            videoId,
            title: 'YouTube Video',
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          })
        } else {
          setError('Invalid YouTube URL')
        }
      }
      // Twitter
      else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        const tweetId = extractTwitterId(url)
        if (tweetId) {
          setEmbedData({
            type: 'twitter',
            tweetId,
            title: 'Twitter Post'
          })
        } else {
          setError('Invalid Twitter URL')
        }
      }
      // Instagram
      else if (hostname.includes('instagram.com')) {
        const instagramId = extractInstagramId(url)
        if (instagramId) {
          setEmbedData({
            type: 'instagram',
            instagramId,
            title: 'Instagram Post'
          })
        } else {
          setError('Invalid Instagram URL')
        }
      }
      // Image
      else if (isImageUrl(url)) {
        setEmbedData({
          type: 'image',
          title: 'Image',
          thumbnail: url
        })
      }
      // Generic link
      else {
        setEmbedData({
          type: 'link',
          title: parsedUrl.hostname,
          description: url
        })
      }
    } catch (error) {
      setError('Invalid URL')
    } finally {
      setIsLoading(false)
    }
  }

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const extractTwitterId = (url: string): string | null => {
    const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const extractInstagramId = (url: string): string | null => {
    const regex = /instagram\.com\/p\/([^\/]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const isImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    return imageExtensions.some(ext => url.toLowerCase().includes(ext))
  }

  const renderEmbed = () => {
    if (isLoading) {
      return (
        <Card className={`${className}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (error || !embedData) {
      return (
        <Card className={`${className} border-red-200 bg-red-50`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-600">
              <FileText className="h-5 w-5" />
              <div>
                <div className="font-medium">Invalid Link</div>
                <div className="text-sm">{error || 'Unable to embed this content'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    switch (embedData.type) {
      case 'youtube':
        return (
          <Card className={`${className}`}>
            <CardContent className="p-0">
              <div className="relative group cursor-pointer" onClick={() => window.open(url, '_blank')}>
                <img
                  src={embedData.thumbnail}
                  alt="YouTube Video"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                  <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  YouTube
                </div>
              </div>
              <div className="p-3">
                <div className="font-medium text-sm">YouTube Video</div>
                <div className="text-xs text-gray-500 mt-1">Click to watch on YouTube</div>
              </div>
            </CardContent>
          </Card>
        )

      case 'twitter':
        return (
          <Card className={`${className}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">𝕏</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Twitter Post</div>
                  <div className="text-xs text-gray-500">Click to view on Twitter</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'instagram':
        return (
          <Card className={`${className}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IG</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Instagram Post</div>
                  <div className="text-xs text-gray-500">Click to view on Instagram</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'image':
        return (
          <Card className={`${className}`}>
            <CardContent className="p-0">
              <div className="relative group cursor-pointer" onClick={() => window.open(url, '_blank')}>
                <img
                  src={embedData.thumbnail}
                  alt="Embedded Image"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'link':
      default:
        return (
          <Card className={`${className}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{embedData.title}</div>
                  <div className="text-xs text-gray-500 truncate">{url}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return renderEmbed()
}
