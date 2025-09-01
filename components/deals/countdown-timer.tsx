"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  expiryDate: string
  showIcon?: boolean
  variant?: "default" | "destructive" | "secondary"
  size?: "sm" | "default" | "lg"
}

export function CountdownTimer({ 
  expiryDate, 
  showIcon = true, 
  variant = "default",
  size = "default"
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiryDate).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  if (isExpired) {
    return (
      <Badge variant="destructive" size={size} className="text-xs">
        EXPIRED
      </Badge>
    )
  }

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  const getVariant = () => {
    const totalHours = timeLeft.days * 24 + timeLeft.hours
    if (totalHours <= 1) return "destructive"
    if (totalHours <= 6) return "secondary"
    return variant
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "lg":
        return "text-base px-3 py-2"
      default:
        return "text-sm px-2 py-1"
    }
  }

  return (
    <Badge variant={getVariant()} className={`${getSizeClasses()} font-mono`}>
      {showIcon && <Clock className="h-3 w-3 mr-1" />}
      {timeLeft.days > 0 && (
        <>
          {timeLeft.days}d {timeLeft.hours}h
        </>
      )}
      {timeLeft.days === 0 && timeLeft.hours > 0 && (
        <>
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}
        </>
      )}
      {timeLeft.days === 0 && timeLeft.hours === 0 && (
        <>
          {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </>
      )}
    </Badge>
  )
}
