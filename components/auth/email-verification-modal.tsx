"use client"

import type React from "react"

import { useState } from "react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (code === "12345") {
      onClose()
    } else {
      setError("Invalid verification code")
    }

    setLoading(false)
  }

  const handleResend = async () => {
    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500))
    alert("Verification code sent!")
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
