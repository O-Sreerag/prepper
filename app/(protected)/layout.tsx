"use client"

import React from "react"
import { DesktopSidebar, DesktopNavbar } from "@/app/(protected)/_components"

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />

      <DesktopSidebar />

      <div
        className="flex-1 flex flex-col transition-[margin-left] duration-300 ease-out"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <DesktopNavbar />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-safe">
          {children}
        </main>
      </div>
    </div>
  )
}