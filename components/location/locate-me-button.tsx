"use client"

import { Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation } from './location-provider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function LocateMeButton() {
  const { locationPermission, requestLocation } = useLocation()

  const handleClick = () => {
    requestLocation()
  }

  const getTooltipText = () => {
    switch (locationPermission) {
      case 'granted':
        return 'Using your location'
      case 'denied':
        return 'Using Pattaya City. Tap to allow precise weather'
      default:
        return 'Tap to use your location'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className={`h-8 w-8 p-0 rounded-full transition-all duration-300 ${
              locationPermission === 'granted' 
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                : locationPermission === 'denied'
                ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 