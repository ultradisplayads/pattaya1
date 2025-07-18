"use client"

import { useState } from "react"
import { Plus, MessageCircle, Calendar, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonsProps {
  theme: "primary" | "nightlife"
}

export function FloatingActionButtons({ theme }: FloatingActionButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const actions = [
    { icon: MessageCircle, label: "Chat", color: "bg-blue-500" },
    { icon: Calendar, label: "Events", color: "bg-purple-500" },
    { icon: MapPin, label: "Nearby", color: "bg-green-500" },
    { icon: Phone, label: "Call", color: "bg-orange-500" },
  ]

  return (
    <div className="fixed bottom-20 right-4 z-30">
      <div className="flex flex-col items-end space-y-2">
        {isExpanded && (
          <>
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                className={`${action.color} text-white shadow-lg hover:scale-110 transition-all duration-200`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isExpanded ? "slideInRight 0.3s ease-out" : undefined,
                }}
              >
                <action.icon className="h-4 w-4" />
              </Button>
            ))}
          </>
        )}

        <Button
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${
            theme === "primary" ? "bg-blue-600" : "bg-purple-600"
          } text-white shadow-lg hover:scale-110 transition-all duration-200`}
        >
          <Plus className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-45" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
