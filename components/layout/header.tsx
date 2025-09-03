"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  ChevronDown,
  MoreHorizontal,
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navigationData, setNavigationData] = useState(null)

  const { user, logout, loading, syncWithStrapi, getStrapiToken } = useAuth()
  const isPrimary = theme === "primary"

  // Close auth modals when user logs in/creates account
  useEffect(() => {
    if (user) {
      setIsLoginOpen(false)
      setIsRegisterOpen(false)
    }
  }, [user])

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

  // Handle body scroll when mega menu is open
  useEffect(() => {
    if (isMegaMenuOpen || isMobileMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }

    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isMegaMenuOpen, isMobileMenuOpen])

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
        className={`sticky top-0 z-[var(--z-header)] w-full border-b backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300 font-sans antialiased ${
          isPrimary
            ? "bg-white/80 border-gray-100/50"
            : "bg-gray-900/80 border-gray-700/50"
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <a href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                    isPrimary
                      ? "bg-blue-500"
                      : "bg-purple-500"
                  }`}
                >
                  <span className="text-white font-semibold text-sm">P1</span>
                </div>
                <span
                  className={`font-semibold text-xl tracking-tight ${
                    isPrimary
                      ? "text-gray-900"
                      : "text-white"
                  }`}
                >
                  Pattaya1
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Menu - Desktop (Converted to Dropdown) */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Main Navigation Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 h-9 px-4 font-medium transition-all duration-200 ${
                    isPrimary 
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span>Menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 border-gray-100/50 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl">
                <DropdownMenuLabel className="font-semibold text-gray-900 p-4">Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100/50" />
                <DropdownMenuItem 
                  onClick={() => handleMegaMenuOpen("directory")}
                  className="p-3 hover:bg-gray-50/80 transition-colors duration-200"
                >
                  <MapPin className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Directory</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleMegaMenuOpen("business")}
                  className="p-3 hover:bg-gray-50/80 transition-colors duration-200"
                >
                  <Shield className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Business</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50/80 transition-colors duration-200">
                  <Calendar className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Events</span>
                  <Badge variant="secondary" className="ml-auto bg-red-500 text-white text-xs font-medium">
                    Live
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50/80 transition-colors duration-200">
                  <MessageSquare className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Forum</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50/80 transition-colors duration-200">
                  <Camera className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Blog</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Access Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 h-9 px-4 font-medium transition-all duration-200 ${
                    isPrimary 
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span>Quick Access</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 border-gray-100/50 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl">
                <DropdownMenuLabel className="font-semibold text-gray-900 p-4">Quick Access</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100/50" />
                <div className="grid grid-cols-2 gap-2 p-3">
                  {quickLinks.map((link) => (
                    <DropdownMenuItem key={link.id} asChild>
                      <a
                        href={link.href}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
                      >
                        <div className={`${link.color} text-white p-2 rounded-xl shadow-sm`}>
                          {link.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900">{link.title}</div>
                          <div className="text-xs text-gray-500 font-medium">{link.count?.toLocaleString()} items</div>
                        </div>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side with Search and User Menu */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Search Bar */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    isPrimary ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <Input
                  type="search"
                  placeholder="Search businesses, events..."
                  className={`pl-10 w-[200px] lg:w-[250px] h-9 rounded-xl transition-all duration-200 ${
                    isPrimary
                      ? "bg-gray-50/80 border-gray-200/50 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                      : "bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:bg-gray-800 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  }`}
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
                    className={`h-9 px-4 font-medium transition-all duration-200 ${
                      isPrimary 
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50" 
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setIsRegisterOpen(true)}
                    className={`h-9 px-4 font-medium rounded-lg transition-all duration-200 shadow-sm ${
                      isPrimary 
                        ? "bg-blue-500 hover:bg-blue-600 text-white" 
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Menu Button for Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden h-9 w-9 rounded-lg transition-colors duration-200 ${
                  isPrimary 
                    ? "hover:bg-gray-50" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
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
    </>
  )
}
