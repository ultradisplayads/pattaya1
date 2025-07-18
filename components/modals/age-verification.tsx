"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AgeGate } from "./age-gate"
import { useAuth } from "@/components/auth/auth-provider"

interface AgeVerificationProps {
  children: React.ReactNode
}

export function AgeVerification({ children }: AgeVerificationProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [showAgeGate, setShowAgeGate] = useState(false)
  const { user, checkAge } = useAuth()

  useEffect(() => {
    // Check if user is logged in and age verified
    if (user) {
      const userIsOfAge = checkAge()
      if (userIsOfAge) {
        setIsVerified(true)
        sessionStorage.setItem("ageVerified", "true")
      } else {
        setShowAgeGate(true)
      }
    } else {
      // Check session storage for non-logged in users
      const sessionVerified = sessionStorage.getItem("ageVerified")
      if (sessionVerified === "true") {
        setIsVerified(true)
      } else {
        setShowAgeGate(true)
      }
    }
  }, [user, checkAge])

  const handleVerification = (verified: boolean) => {
    if (verified) {
      setIsVerified(true)
      sessionStorage.setItem("ageVerified", "true")
    }
    setShowAgeGate(false)
  }

  if (!isVerified && showAgeGate) {
    return <AgeGate onVerification={handleVerification} />
  }

  return <>{children}</>
}
