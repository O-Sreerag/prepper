"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/api/auth.service"

export const DesktopNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const authService = new AuthService()

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!profileRef.current) return
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false)
    }
    document.addEventListener("click", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authService.userLogout()
      router.push("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="border-b border-border bg-background dark:bg-background sticky top-0 z-30">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              {/* mobile menu button handled by MobileNavbar component */}
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <div ref={profileRef} className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:inline-flex bg-transparent" 
              onClick={() => setProfileOpen((s) => !s)} 
              aria-expanded={profileOpen} 
              aria-haspopup="menu"
            >
              <Icons.user className="mr-2 h-4 w-4" />
              Profile
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              className="sm:hidden bg-transparent" 
              onClick={() => setProfileOpen((s) => !s)} 
              aria-expanded={profileOpen} 
              aria-haspopup="menu"
            >
              <Icons.user className="h-4 w-4" />
            </Button>

            {profileOpen && (
              <div 
                role="menu" 
                className="absolute right-0 mt-2 w-64 rounded-lg border bg-card p-3 shadow-lg z-[1000]"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col">
                    <span className="font-medium truncate">Guest</span>
                    <span className="text-xs text-muted-foreground truncate">
                      guest@example.com
                    </span>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <button 
                    onClick={() => router.push('/profile')} 
                    className="w-full text-left px-2 py-2 rounded-md hover:bg-accent/50"
                  >
                    View Profile
                  </button>

                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-2 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}