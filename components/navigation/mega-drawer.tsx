"use client"

import { useState } from "react"
import { X, ChevronRight, Home, MapPin, Calendar, Users, BookOpen, Building2, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MegaDrawerProps {
  isOpen: boolean
  onClose: () => void
  onThemeChange: (theme: "primary" | "nightlife") => void
  theme: "primary" | "nightlife"
  navigationData?: any
}

export function MegaDrawer({ isOpen, onClose, onThemeChange, theme, navigationData }: MegaDrawerProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "directory",
      label: "Directory",
      icon: MapPin,
      href: "/directory",
      children: navigationData?.data?.map((category: any) => ({
        label: category.attributes.name,
        href: `/${category.attributes.slug}`,
        children:
          category.attributes.sub_categories?.data?.map((sub: any) => ({
            label: sub.attributes.name,
            href: `/${category.attributes.slug}/${sub.attributes.slug}`,
          })) || [],
      })) || [
        { label: "Restaurants", href: "/dining-food/thai-restaurants" },
        { label: "Hotels", href: "/accommodation/hotels" },
        { label: "Attractions", href: "/explore-pattaya/top-attractions" },
        { label: "Shopping", href: "/shopping/malls" },
        { label: "Services", href: "/services/visa-agencies" },
      ],
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      href: "/events",
      badge: "Live",
    },
    {
      id: "forum",
      label: "Forum",
      icon: Users,
      href: "/forum",
    },
    {
      id: "blog",
      label: "Blog",
      icon: BookOpen,
      href: "/blog",
    },
    {
      id: "business",
      label: "Business",
      icon: Building2,
      href: "/business",
      badge: "Free",
    },
  ]

  const handleItemClick = (item: any) => {
    if (item.children) {
      setActiveSection(activeSection === item.id ? null : item.id)
    } else {
      window.location.href = item.href
      onClose()
    }
  }

  const handleChildClick = (child: any) => {
    window.location.href = child.href
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <Button variant="ghost" className="w-full justify-between" onClick={() => handleItemClick(item)}>
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {item.children && <ChevronRight className="h-4 w-4" />}
              </Button>

              {item.children && activeSection === item.id && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child: any) => (
                    <div key={child.label}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => (child.children ? setActiveSection(child.label) : handleChildClick(child))}
                      >
                        <span>{child.label}</span>
                        {child.children && <ChevronRight className="h-3 w-3" />}
                      </Button>

                      {child.children && activeSection === child.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {child.children.map((subChild: any) => (
                            <Button
                              key={subChild.label}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs"
                              onClick={() => handleChildClick(subChild)}
                            >
                              {subChild.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator className="mx-4" />

        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onThemeChange(theme === "primary" ? "nightlife" : "primary")}
            >
              {theme === "primary" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "primary" ? "Nightlife" : "Primary"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
