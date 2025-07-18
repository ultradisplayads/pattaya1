"use client"

import type React from "react"

import { useState } from "react"
import { Search, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function GoogleSearchWidget() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")
    }
  }

  return (
    <Card className="w-full h-16">
      <CardContent className="p-3 h-full">
        <form onSubmit={handleSearch} className="flex items-center space-x-2 h-full">
          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm text-gray-700 whitespace-nowrap">Google</span>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Search the web..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-7 pr-16 h-8 text-sm bg-white border border-blue-200 focus:border-blue-400 rounded-md"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
            >
              Go
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
