"use client"

import { useState } from "react"
import { Sun, Moon, Search, MessageCircle, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StickyActionBarProps {
  theme: "primary" | "nightlife"
  onThemeToggle: (theme: "primary" | "nightlife") => void
}

export function StickyActionBar({ theme, onThemeToggle }: StickyActionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const quickActions = [
    { icon: Search, label: "Search", href: "/search" },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: MessageCircle, label: "Forum", href: "/forum" },
    { icon: MapPin, label: "Directory", href: "/directory" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = action.href)}
              className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onThemeToggle(theme === "primary" ? "nightlife" : "primary")}
          className="flex items-center gap-2"
        >
          {theme === "primary" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="text-xs">{theme === "primary" ? "Nightlife" : "Primary"}</span>
        </Button>
      </div>
    </div>
  )
}
