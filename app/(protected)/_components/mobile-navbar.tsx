"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { MobileSidebar } from "./mobile-sidebar"

interface MobileNavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const MobileNavbar = ({ sidebarOpen, setSidebarOpen }: MobileNavbarProps) => {
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-40 bg-background/80 backdrop-blur-sm border-border/50"
          onClick={() => setSidebarOpen(true)}
        >
          <Icons.menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <MobileSidebar onClose={() => setSidebarOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}