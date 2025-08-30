"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { strapiAPI } from "@/lib/strapi-api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function EmailVerificationModal({ isOpen, onClose, email }: EmailVerificationModalProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { updateUserProfile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/email-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      const json = await res.json()
      if (!res.ok || !json?.ok) {
        setError(json?.message || "Invalid verification code")
        return
      }
      // Mark verified locally
      await updateUserProfile({ emailVerified: true, verified: true })
      // Also confirm in Strapi (best-effort)
      try {
        const idToken = await (window as any)?.firebaseAuthCurrentUser?.getIdToken?.() // optional if you expose it
        await strapiAPI.confirmUser(email)
      } catch {}
      onClose()
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/email-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok || !json?.ok) {
        setError(json?.message || "Failed to send code")
        return
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">We've sent a 5-digit verification code to {email}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 5-digit code"
                maxLength={5}
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" onClick={handleResend}>
              Resend Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
