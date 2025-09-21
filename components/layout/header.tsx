"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
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
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { EnhancedMegaMenu } from "@/components/navigation/enhanced-mega-menu"
import { MegaDrawer } from "@/components/navigation/mega-drawer"

interface HeaderProps {
  theme: "primary" | "nightlife"
  onThemeChange: (theme: "primary" | "nightlife") => void
}

interface QuickLink {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  color: string
  count?: number
}

export function Header({ theme, onThemeChange }: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navigationData, setNavigationData] = useState(null)

  const { user, logout, loading } = useAuth()
  const isPrimary = theme === "primary"

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
      href: "/dining",
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

  useEffect(() => {
    loadNavigationData()
  }, [])

  const loadNavigationData = async () => {
    try {
      const response = await fetch("/api/parent-categories?populate=sub-categories")
      if (response.ok) {
        const data = await response.json()
        setNavigationData(data)
      }
    } catch (error) {
      console.error("Failed to load navigation data:", error)
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

  const handleMegaMenuOpen = (menuType: string) => {
    setActiveMegaMenu(menuType)
    setIsMegaMenuOpen(true)
  }

  const handleMegaMenuClose = () => {
    setIsMegaMenuOpen(false)
    setActiveMegaMenu(null)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
          isPrimary
            ? "bg-white/95 border-amber-200/50"
            : "bg-gradient-to-r from-purple-900/95 to-pink-900/95 border-pink-500/30"
        }`}
        style={{ minWidth: 0 }}
      >
        <div className="max-w-full px-4 flex h-16 items-center justify-between" style={{ minWidth: 0 }}>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isPrimary
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-pink-500 to-purple-500"
                  }`}
                >
                  <span className="text-white font-bold text-sm">P1</span>
                </div>
                <span
                  className={`font-bold text-xl ${
                    isPrimary
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      : "text-white"
                  }`}
                >
                  Pattaya1
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6" style={{ minWidth: 0, flexShrink: 1 }}>
            <Button
              variant="ghost"
              className={`flex items-center space-x-1 ${
                isPrimary ? "hover:bg-amber-50 hover:text-amber-700" : "text-white hover:bg-purple-800"
              }`}
              onClick={() => handleMegaMenuOpen("directory")}
            >
              <span>Directory</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              className={`flex items-center space-x-1 ${
                isPrimary ? "hover:bg-amber-50 hover:text-amber-700" : "text-white hover:bg-purple-800"
              }`}
              onClick={() => handleMegaMenuOpen("business")}
            >
              <span>Business</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <a
              href="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isPrimary
                  ? "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                  : "text-white hover:text-pink-200 hover:bg-purple-800"
              }`}
            >
              Events
              <Badge variant="secondary" className="ml-2 bg-red-500 text-white text-xs">
                Live
              </Badge>
            </a>

            <a
              href="/forum"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isPrimary
                  ? "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                  : "text-white hover:text-pink-200 hover:bg-purple-800"
              }`}
            >
              Forum
            </a>

            <a
              href="/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isPrimary
                  ? "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                  : "text-white hover:text-pink-200 hover:bg-purple-800"
              }`}
            >
              Blog
            </a>
          </nav>

          {/* Quick Access Icons in Header */}
          <div className="hidden lg:flex items-center space-x-2 mx-4" style={{ minWidth: 0, flexShrink: 1 }}>
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

          {/* Right side with User Menu */}
          <div className="flex items-center space-x-4" style={{ minWidth: 0, flexShrink: 0 }}>
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
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
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
                    <Button
                      variant="ghost"
                      onClick={() => setIsLoginOpen(true)}
                      className={isPrimary ? "" : "text-white hover:bg-purple-800"}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => setIsRegisterOpen(true)}
                      className={
                        isPrimary ? "bg-amber-600 hover:bg-amber-700" : "bg-pink-600 hover:bg-pink-700 text-white"
                      }
                    >
                      Sign Up
                    </Button>
                  </div>
              )}

              {/* Menu Button for Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${isPrimary ? "" : "text-white hover:bg-purple-800"}`}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mega Menu */}
      <EnhancedMegaMenu
        isOpen={isMegaMenuOpen}
        activeMenu={activeMegaMenu}
        onClose={handleMegaMenuClose}
        theme={theme}
        onThemeChange={onThemeChange}
      />

      {/* Mobile Drawer */}
      <MegaDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onThemeChange={onThemeChange}
        theme={theme}
        navigationData={navigationData}
      />

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
