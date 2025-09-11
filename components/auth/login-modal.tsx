"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialLoginButtons } from "./social-login-buttons"
import { useAuth } from "./auth-provider"
import { useEffect, useState } from "react"
import { strapiAPI } from "@/lib/strapi-api"
import { MapPin, Waves, Utensils, Camera } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister?: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { loginWithEmail } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      const content = await strapiAPI.getAuthPanelContent()
      setPanel(content)
    })()
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await loginWithEmail(email, password)
      onClose()
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[999999] max-w-[680px] w-[88vw] overflow-hidden p-0 rounded-2xl shadow-2xl border border-white/10 bg-white/60 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[300px]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-800 text-white p-4 md:p-5 flex flex-col justify-between">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <MapPin className="absolute -top-4 -left-4 h-24 w-24 auth-float" />
              <Waves className="absolute top-16 right-6 h-16 w-16 auth-float" style={{ animationDelay: '0.8s' }} />
              <Utensils className="absolute bottom-8 left-10 h-20 w-20 auth-float" style={{ animationDelay: '1.2s' }} />
              <Camera className="absolute -bottom-6 -right-6 h-28 w-28 auth-float" style={{ animationDelay: '1.6s' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">
                {panel.title}
              </h3>
              <ul className="space-y-3 text-xs">
                {panel.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 shrink-0">✓</span>
                    <span className="opacity-90 leading-snug">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-[10px] opacity-75">
              Seamless access on Web and Apps
            </div>
          </div>

          <div className="p-3 md:p-4 bg-white/80">
            <DialogHeader className="mb-2">
              <DialogTitle>Log In</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <SocialLoginButtons onSuccess={onClose} onError={setError} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <Button type="submit" className="w-full h-9" disabled={loading}>
                  {loading ? "Signing in..." : "LOG IN"}
                </Button>
              </form>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={onSwitchToRegister}>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Gentle float animation for background icons
// Using styled-jsx to keep this local and avoid Tailwind config changes
// eslint-disable-next-line @next/next/no-css-tags
<style jsx global>{`
  @keyframes auth-float {
    0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.9; }
    25% { transform: translate3d(4px, -6px, 0) scale(1.02); opacity: 1; }
    50% { transform: translate3d(0, -10px, 0) scale(1.01); opacity: 0.95; }
    75% { transform: translate3d(-4px, -6px, 0) scale(1.02); opacity: 1; }
    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.9; }
  }
  .auth-float {
    animation: auth-float 8s ease-in-out infinite;
    will-change: transform, opacity;
  }
`}</style>
