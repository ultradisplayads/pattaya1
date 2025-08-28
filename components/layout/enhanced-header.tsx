"use client"

import type React from "react"
import { useEffect } from "react"

import { useState } from "react"
import {
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
  MapPin,
  Calendar,
  Utensils,
  Music,
  ShoppingBag,
  Waves,
  MessageSquare,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"
import { EmailVerificationModal } from "@/components/auth/email-verification-modal"
import { useAuth } from "@/components/auth/auth-provider"

interface QuickLink {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  color: string
  count?: number
}

export function EnhancedHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { user, logout, loading, syncWithStrapi, getStrapiToken } = useAuth()

  // Auto-sync with Strapi when user is present but token is missing
  useEffect(() => {
    const maybeSync = async () => {
      try {
        if (user && !getStrapiToken()) {
          await syncWithStrapi()
        }
      } catch {}
    }
    maybeSync()
  }, [user, getStrapiToken, syncWithStrapi])

  const quickLinks: QuickLink[] = [
    {
      id: "directory",
      title: "Directory",
      icon: <MapPin className="w-4 h-4" />,
      href: "/directory",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      count: 1250,
    },
    {
      id: "events",
      title: "Events",
      icon: <Calendar className="w-4 h-4" />,
      href: "/events",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      count: 45,
    },
    {
      id: "restaurants",
      title: "Dining",
      icon: <Utensils className="w-4 h-4" />,
      href: "/restaurants",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      count: 320,
    },
    {
      id: "nightlife",
      title: "Nightlife",
      icon: <Music className="w-4 h-4" />,
      href: "/nightlife",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      count: 180,
    },
    {
      id: "shopping",
      title: "Shopping",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: "/shopping",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      count: 95,
    },
    {
      id: "beaches",
      title: "Beaches",
      icon: <Waves className="w-4 h-4" />,
      href: "/beaches",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      count: 12,
    },
    {
      id: "forum",
      title: "Forum",
      icon: <MessageSquare className="w-4 h-4" />,
      href: "/forum",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      count: 890,
    },
    {
      id: "photos",
      title: "Photos",
      icon: <Camera className="w-4 h-4" />,
      href: "/photos",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      count: 2100,
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const switchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const switchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const openVerification = (email: string) => {
    setIsRegisterOpen(false)
    setIsVerificationOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P1</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pattaya1 Dashboard
                </span>
              </div>
            </a>
          </div>

          {/* Quick Access Icons in Header */}
          <div className="hidden lg:flex items-center gap-2 mx-8 flex-wrap">
            {quickLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                className="group flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                title={`${link.title} (${link.count?.toLocaleString()})`}
              >
                <div
                  className={`${link.color} text-white p-2 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md`}
                >
                  {link.icon}
                </div>
                <span className="text-xs font-medium text-center mt-1 group-hover:text-blue-600 transition-colors duration-200">
                  {link.title}
                </span>
              </a>
            ))}
          </div>

          {/* Right side with Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                          <AvatarFallback>
                            {(() => {
                              const fromNames = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.trim()
                              if (fromNames) return fromNames.toUpperCase()
                              const fromDisplay = (user.displayName || '')
                                .split(' ')
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join('')
                              if (fromDisplay) return fromDisplay.toUpperCase()
                              const email = user.email || ''
                              const emailInitial = email ? email[0] : '?'
                              return String(emailInitial).toUpperCase()
                            })()}
                          </AvatarFallback>
                        </Avatar>
                        {!user.emailVerified && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 p-0">
                            !
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          {!user.emailVerified && (
                            <Badge variant="outline" className="text-xs">
                              Email not verified
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Exit Admin Button */}
                  {user.role === "admin" && (
                    <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                      Exit Admin
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => setIsLoginOpen(true)}>
                    Sign In
                  </Button>
                  <Button onClick={() => setIsRegisterOpen(true)}>Sign Up</Button>
                </div>
              )}

              {/* Menu Button for Mobile */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToRegister={switchToRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={switchToLogin} />
      <EmailVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        email={user?.email || ""}
      />
    </>
  )
}
