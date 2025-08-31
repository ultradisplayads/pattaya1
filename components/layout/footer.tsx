"use client"

import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface FooterProps {
  theme: "primary" | "nightlife"
}

export function Footer({ theme }: FooterProps) {
  const footerLinks = {
    discover: [
      { label: "Restaurants", href: "/restaurants" },
      { label: "Hotels", href: "/hotels" },
      { label: "Attractions", href: "/attractions" },
      { label: "Shopping", href: "/shopping" },
    ],
    community: [
      { label: "Forum", href: "/forum" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
      { label: "Reviews", href: "/reviews" },
    ],
    business: [
      { label: "List Your Business", href: "/business/register" },
      { label: "Advertise", href: "/business/advertise" },
      { label: "Analytics", href: "/business/analytics" },
      { label: "Support", href: "/business/support" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="bg-white/50 border-t border-gray-100/50 backdrop-blur-sm font-sans antialiased">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">P1</span>
              </div>
              <span className="font-semibold text-xl text-gray-900 tracking-tight">
                Pattaya1
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Your ultimate guide to discovering the best of Pattaya.
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Pattaya, Thailand</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium">hello@pattaya1.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-medium">+66 XX XXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-base">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-base">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-base">Business</h3>
            <ul className="space-y-3">
              {footerLinks.business.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-6 text-base">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-gray-100/50" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">© 2024 Pattaya1. All rights reserved.</p>

          <div className="flex items-center space-x-2 mt-6 md:mt-0">
            {socialLinks.map((social) => (
              <Button 
                key={social.label} 
                variant="ghost" 
                size="icon" 
                asChild
                className="h-10 w-10 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <a href={social.href} aria-label={social.label}>
                  <social.icon className="h-4 w-4 text-gray-500 hover:text-blue-600 transition-colors duration-200" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
