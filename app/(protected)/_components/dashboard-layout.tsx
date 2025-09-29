"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardSidebar } from "./dashboard-sidebar"
import { Icons } from "@/components/icons"
import { DASHBOARD_LAYOUT_STRINGS as STRINGS } from "@/constants"
import { AuthService } from "@/services/api/auth.service"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const authService = new AuthService()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authService.getActiveUser()
        if (session?.user) {
          setUser({
            name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? "Unknown",
            email: session.user.email ?? "",
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  // Close on outside click or escape
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
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40 bg-background/80 backdrop-blur-sm border-border/50"
          >
            <Icons.menu className="h-4 w-4" />
            <span className="sr-only">{STRINGS.toggleSidebar}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-30">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-6">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-12" /> {/* Spacer for mobile menu button */}
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                {STRINGS.dashboard}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />

              {/* Profile wrapper (relative) */}
              <div ref={profileRef} className="relative">
                {/* Desktop / tablet full label button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex bg-transparent"
                  onClick={() => setProfileOpen((s) => !s)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <Icons.user className="mr-2 h-4 w-4" />
                  {STRINGS.profile}
                </Button>

                {/* Mobile icon-only button */}
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

                {/* Dropdown panel */}
                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 rounded-lg border bg-card p-3 shadow-lg z-[1000]"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{user?.name ?? "Guest"}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</span>
                      </div>

                      <div className="h-px bg-border my-2" />

                      <button
                        onClick={() => {
                          setProfileOpen(false)
                          router.push("/profile")
                        }}
                        className="w-full text-left px-2 py-2 rounded-md hover:bg-accent/50"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-2 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <div className="flex items-center gap-2">
                          <Icons.logout className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-safe">{children}</main>
      </div>
    </div>
  )
}
