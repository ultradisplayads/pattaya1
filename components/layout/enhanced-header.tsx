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
      color: "bg-blue-500",
      count: 1250,
    },
    {
      id: "events",
      title: "Events",
      icon: <Calendar className="w-4 h-4" />,
      href: "/events",
      color: "bg-green-500",
      count: 45,
    },
    {
      id: "restaurants",
      title: "Dining",
      icon: <Utensils className="w-4 h-4" />,
      href: "/restaurants",
      color: "bg-orange-500",
      count: 320,
    },
    {
      id: "nightlife",
      title: "Nightlife",
      icon: <Music className="w-4 h-4" />,
      href: "/nightlife",
      color: "bg-purple-500",
      count: 180,
    },
    {
      id: "shopping",
      title: "Shopping",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: "/shopping",
      color: "bg-pink-500",
      count: 95,
    },
    {
      id: "beaches",
      title: "Beaches",
      icon: <Waves className="w-4 h-4" />,
      href: "/beaches",
      color: "bg-cyan-500",
      count: 12,
    },
    {
      id: "forum",
      title: "Forum",
      icon: <MessageSquare className="w-4 h-4" />,
      href: "/forum",
      color: "bg-indigo-500",
      count: 890,
    },
    {
      id: "photos",
      title: "Photos",
      icon: <Camera className="w-4 h-4" />,
      href: "/photos",
      color: "bg-red-500",
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
      <header className="sticky top-0 z-40 w-full border-b border-gray-100/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 font-sans antialiased">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">P1</span>
                </div>
                <span className="font-semibold text-xl text-gray-900 tracking-tight">
                  Pattaya1
                </span>
              </div>
            </a>
          </div>

          {/* Quick Access Icons in Header */}
          <div className="hidden lg:flex items-center gap-3 mx-8 flex-wrap">
            {quickLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                className="group flex flex-col items-center p-2 rounded-xl hover:bg-gray-50/80 transition-all duration-300 hover:scale-105"
                title={`${link.title} (${link.count?.toLocaleString()})`}
              >
                <div
                  className={`${link.color} text-white p-2.5 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-sm`}
                >
                  {link.icon}
                </div>
                <span className="text-xs font-medium text-center mt-1.5 group-hover:text-blue-600 transition-colors duration-200 text-gray-600">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-[200px] lg:w-[300px] h-9 bg-gray-50/80 border-gray-200/50 rounded-xl focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-50 transition-colors duration-200">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                          <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
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
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-red-500 text-white text-xs font-medium">
                            !
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 border-gray-100/50 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm font-semibold leading-none text-gray-900">{user.displayName}</p>
                          <p className="text-xs leading-none text-gray-500">{user.email}</p>
                          {!user.emailVerified && (
                            <Badge variant="outline" className="text-xs font-medium bg-red-50 text-red-600 border-red-200 w-fit">
                              Email not verified
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-100/50" />
                      <DropdownMenuItem className="p-3 hover:bg-gray-50/80 transition-colors duration-200">
                        <User className="mr-3 h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 font-medium">Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-3 hover:bg-gray-50/80 transition-colors duration-200">
                        <Settings className="mr-3 h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 font-medium">Settings</span>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem className="p-3 hover:bg-gray-50/80 transition-colors duration-200">
                          <Shield className="mr-3 h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 font-medium">Admin Panel</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-gray-100/50" />
                      <DropdownMenuItem onClick={handleLogout} className="p-3 hover:bg-red-50/80 transition-colors duration-200">
                        <LogOut className="mr-3 h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Exit Admin Button */}
                  {user.role === "admin" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 font-medium rounded-lg transition-all duration-200"
                    >
                      Exit Admin
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsLoginOpen(true)}
                    className="h-9 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-all duration-200"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-sm"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Menu Button for Mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden h-9 w-9 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Menu className="h-5 w-5 text-gray-600" />
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
