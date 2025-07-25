"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { ModularHomepage } from "@/components/homepage/modular-homepage"
import { StickyActionBar } from "@/components/layout/sticky-action-bar"
import { FloatingActionButtons } from "@/components/ui/floating-action-buttons"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

export default function HomePage() {
  const [theme, setTheme] = useState<"primary" | "nightlife">("primary")

  const handleThemeChange = (newTheme: "primary" | "nightlife") => {
    setTheme(newTheme)
  }

  return (
    <div className="min-h-screen">
      <Header theme={theme} onThemeChange={handleThemeChange} />

      {/* V0.1 Static Layout Homepage */}
      <ModularHomepage />

      {/* Sticky Action Bar */}
      <StickyActionBar theme={theme} onThemeToggle={handleThemeChange} />

      {/* Floating Action Buttons */}
      <FloatingActionButtons theme={theme} />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}
