"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Icons } from "@/components/icons"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
            <span className="sr-only">Toggle sidebar</span>
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
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <Icons.user className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden bg-transparent">
                <Icons.user className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-safe">{children}</main>
      </div>
    </div>
  )
}
