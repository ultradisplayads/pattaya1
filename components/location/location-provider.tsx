"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Location {
  lat: number
  lon: number
  name?: string
}

interface LocationContextType {
  location: Location | null
  locationPermission: 'prompted' | 'granted' | 'denied'
  units: 'metric' | 'imperial'
  requestLocation: () => Promise<void>
  setUnits: (units: 'metric' | 'imperial') => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [locationPermission, setLocationPermission] = useState<'prompted' | 'granted' | 'denied'>('prompted')
  const [units, setUnitsState] = useState<'metric' | 'imperial'>('metric')

  useEffect(() => {
    // Load saved preferences
    const savedUnits = localStorage.getItem('weather-units') as 'metric' | 'imperial'
    if (savedUnits) setUnitsState(savedUnits)
    
    const savedLocation = localStorage.getItem('user-location')
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation))
      setLocationPermission('granted')
    }
  }, [])

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const newLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }

      setLocation(newLocation)
      setLocationPermission('granted')
      localStorage.setItem('user-location', JSON.stringify(newLocation))
      
      console.log('Location granted:', newLocation)
    } catch (error) {
      console.log('Location denied or error:', error)
      setLocationPermission('denied')
    }
  }

  const setUnits = (newUnits: 'metric' | 'imperial') => {
    setUnitsState(newUnits)
    localStorage.setItem('weather-units', newUnits)
  }

  return (
    <LocationContext.Provider value={{
      location,
      locationPermission,
      units,
      requestLocation,
      setUnits
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
} 