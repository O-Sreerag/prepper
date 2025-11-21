"use client"

import React, { useState } from "react"
import { DesktopSidebar, MobileNavbar, DesktopNavbar } from "@/app/(protected)/_components"

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div>
            <div className="flex min-h-screen bg-background">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
                <DesktopSidebar />
                <MobileNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col">
                    <DesktopNavbar />
                    <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-safe">{children}</main>
                </div>
            </div>
        </div>
    )
}