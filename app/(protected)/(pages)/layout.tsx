"use client"

import React from "react"
import { DesktopSidebar, DesktopNavbar, TopHeader } from "@/app/(protected)/_components"
import { HeaderProvider } from "@/app/(protected)/_contexts"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />

      <div
        className="flex-1 flex flex-col transition-[margin-left] duration-300 ease-out"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <DesktopNavbar />

        <HeaderProvider>
          <div className="w-[calc(100%-var(--sidebar-width))] fixed top-16 z-10" >
            <TopHeader />
          </div>
          <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:pt-12 pb-safe">
            {children}
          </main>
        </HeaderProvider>
      </div>
    </div>
  )
}