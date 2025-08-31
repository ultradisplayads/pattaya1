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
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky-bar)] bg-white/80 backdrop-blur-xl border-t border-gray-100/50 p-3 shadow-[0_-1px_3px_0_rgba(0,0,0,0.1),0_-1px_2px_0_rgba(0,0,0,0.06)] font-sans antialiased">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = action.href)}
              className="flex flex-col items-center gap-1.5 h-auto py-2.5 px-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
            >
              <action.icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
                {action.label}
              </span>
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onThemeToggle(theme === "primary" ? "nightlife" : "primary")}
          className="flex items-center gap-2.5 h-9 px-4 rounded-xl border-gray-200/50 bg-white/50 hover:bg-gray-50/80 transition-all duration-200 shadow-sm"
        >
          {theme === "primary" ? (
            <Moon className="h-4 w-4 text-gray-600" />
          ) : (
            <Sun className="h-4 w-4 text-gray-600" />
          )}
          <span className="text-xs font-medium text-gray-700">
            {theme === "primary" ? "Nightlife" : "Primary"}
          </span>
        </Button>
      </div>
    </div>
  )
}
