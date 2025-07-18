"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hash, TrendingUp, Users, Heart, MessageCircle, Filter } from "lucide-react"

export default function SocialPage() {
  const [theme, setTheme] = useState<"primary" | "nightlife">("primary")
  const [activeFilter, setActiveFilter] = useState("all")

  const handleThemeChange = (newTheme: "primary" | "nightlife") => {
    setTheme(newTheme)
  }

  const socialStats = [
    { label: "Total Posts", value: "2,847", icon: Hash, color: "text-blue-600" },
    { label: "Active Users", value: "1,234", icon: Users, color: "text-green-600" },
    { label: "Total Likes", value: "15.2K", icon: Heart, color: "text-red-600" },
    { label: "Comments", value: "3,891", icon: MessageCircle, color: "text-purple-600" },
  ]

  const trendingHashtags = [
    { tag: "PattayaLife", posts: 1247, trending: true },
    { tag: "WalkingStreet", posts: 892, trending: true },
    { tag: "BeachLife", posts: 756, trending: false },
    { tag: "ThaiFood", posts: 634, trending: true },
    { tag: "Nightlife", posts: 523, trending: false },
    { tag: "Travel", posts: 445, trending: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header theme={theme} onThemeChange={handleThemeChange} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Hash className="w-8 h-8 text-pink-600 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Social Feed
            </h1>
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white animate-pulse">
              Live Updates
            </Badge>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with the latest social media buzz from around Pattaya. Real-time posts, trending topics, and community highlights.
          </p>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialStats.map((stat, index) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-bounce-subtle" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trending Hashtags */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-pink-800">
              <TrendingUp className="w-5 h-5" />
              <span>Trending Hashtags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map((hashtag) => (
                <Button
                  key={hashtag.tag}
                  variant="outline"
                  size="sm"
                  className={`hover:scale-105 transition-all duration-200 ${
                    hashtag.trending ? "border-pink-500 text-pink-700 bg-pink-50" : "border-gray-300"
                  }`}
                >
                  #{hashtag.tag}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {hashtag.posts}
                  </Badge>
                  {hashtag.trending && <TrendingUp className="w-3 h-3 ml-1 text-red-500" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-2">
          {["all", "instagram", "twitter", "facebook", "tiktok"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="capitalize hover:scale-105 transition-all duration-200"
            >
              <Filter className="w-3 h-3 mr-1" />
              {filter}
            </Button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Curator.io Feed - Takes up 2 columns */}
          <div className="\
