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
import { strapiAPI } from "@/lib/strapi-api"
import { MapPin, Waves, Utensils, Camera } from "lucide-react"

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
  const [panel, setPanel] = useState<{ title: string; bullets: Array<{ icon?: string; text: string }> }>({
    title: "Benefits of a Free Account",
    bullets: [
      { text: "A personalised calendar with your favourite listings" },
      { text: "Alerts to stay up-to-date with competitions and fixtures" },
      { text: "Bespoke emails with content you will love" },
      { text: "Seamless access on web and app" },
    ],
  })
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
      ;(async () => {
        const content = await strapiAPI.getAuthPanelContent()
        setPanel(content)
      })()
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
        <DialogContent className="z-[9999] max-w-[700px] w-[88vw] overflow-hidden p-0 rounded-2xl shadow-2xl border border-white/10 bg-white/60 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px]">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-800 text-white p-4 md:p-5 flex flex-col justify-between">
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <MapPin className="absolute -top-4 -left-4 h-24 w-24 auth-float" />
                <Waves className="absolute top-16 right-6 h-16 w-16 auth-float" style={{ animationDelay: '0.8s' }} />
                <Utensils className="absolute bottom-8 left-10 h-20 w-20 auth-float" style={{ animationDelay: '1.2s' }} />
                <Camera className="absolute -bottom-6 -right-6 h-28 w-28 auth-float" style={{ animationDelay: '1.6s' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">{panel.title}</h3>
                <ul className="space-y-3 text-xs">
                  {panel.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 shrink-0">✓</span>
                      <span className="opacity-90 leading-snug">{b.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-[10px] opacity-75">Seamless access on Web and Apps</div>
            </div>

            <div className="p-3 md:p-4 bg-white/80">
              <DialogHeader className="mb-2">
                <DialogTitle>Sign Up</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {step === 1 ? (
                  <>
                    <SocialLoginButtons onSuccess={onClose} onError={setError} />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or register with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleStep1Submit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required className="w-full" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required className="w-full" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required className="w-full" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required className="w-full" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required className="w-full" />
                      </div>

                      {error && <div className="text-sm text-red-600">{error}</div>}

                      <Button type="submit" className="w-full h-9">Continue</Button>
                    </form>
                  </>
                ) : (
                  <form onSubmit={handleStep2Submit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} required className="w-full" />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} required className="w-full" />
                    </div>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <div className="flex space-x-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-9">Back</Button>
                      <Button type="submit" className="flex-1 h-9" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
                    </div>
                  </form>
                )}

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Button variant="link" className="p-0" onClick={onSwitchToLogin}>Sign in</Button>
                </div>
              </div>
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
