"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialLoginButtons } from "./social-login-buttons"
import { EmailVerificationModal } from "./email-verification-modal"
import { useAuth } from "./auth-provider"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { registerWithEmail, firebaseUser } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phoneNumber: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [otpRequested, setOtpRequested] = useState(false)

  const handleClose = () => {
    setVerifyOpen(false)
    setOtpRequested(false)
    setStep(1)
    onClose()
  }

  // Ensure OTP state is reset whenever the register dialog is opened fresh
  useEffect(() => {
    if (isOpen) {
      setVerifyOpen(false)
      setOtpRequested(false)
    }
  }, [isOpen])

  // Close OTP flow if user is already authenticated (e.g., sign-in elsewhere)
  useEffect(() => {
    if (firebaseUser) {
      setVerifyOpen(false)
      setOtpRequested(false)
    }
  }, [firebaseUser])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    setError("")
    setStep(2)
    // send OTP and open verification modal once per flow
    if (!otpRequested) {
      setOtpRequested(true)
      try {
        const res = await fetch("/api/auth/email-otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        })
        const json = await res.json().catch(() => ({}))
        if (res.ok && json?.ok) {
          setVerifyOpen(true)
        } else {
          setOtpRequested(false)
          setError(json?.message || "Failed to send verification code")
        }
      } catch (err: any) {
        setOtpRequested(false)
        setError(err?.message || "Failed to send verification code")
      }
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await registerWithEmail({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
      })
      onClose()
    } catch (error: any) {
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
          {step === 1 ? (
            <>
              <SocialLoginButtons onSuccess={onClose} onError={setError} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or register with email</span>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
                Sign in
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isOpen && (
        <EmailVerificationModal isOpen={verifyOpen} onClose={() => setVerifyOpen(false)} email={formData.email} />
      )}
    </>
  )
}
