"use client"

import { useState, useEffect } from "react"

interface WeatherOverlayProps {
  theme: "primary" | "nightlife"
}

export function WeatherOverlay({ theme }: WeatherOverlayProps) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Create animated weather particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full opacity-10 animate-float ${
            theme === "primary" ? "bg-blue-300" : "bg-pink-300"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.id * 0.2}s`,
            animationDuration: `${3 + particle.speed}s`,
          }}
        />
      ))}
    </div>
  )
}
