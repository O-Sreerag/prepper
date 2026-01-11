"use client"

import React from "react"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/api/auth.service"
import { ISidebarItem, SIDEBAR_ITEMS } from "@/config"

interface MobileSidebarProps {
  onClose: () => void
}

export const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
  const router = useRouter()
  const authService = new AuthService()

  const handleLogout = async () => {
    try {
      await authService.userLogout()
      router.push("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Icons.bookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">ExamPrep</span>
      </div>

      <nav className="flex-1 overflow-auto p-2">
        {SIDEBAR_ITEMS.map((item: ISidebarItem) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="mb-1">
              <a 
                href={item.href} 
                onClick={onClose} 
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/30"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
              {item.subItems && (
                <div className="pl-8 mt-1">
                  {item.subItems.map((s) => (
                    <a 
                      key={s.name} 
                      href={s.href} 
                      onClick={onClose} 
                      className="block px-2 py-1 rounded-md text-sm hover:bg-accent/40"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button 
          onClick={() => {
            router.push('/settings')
            onClose()
          }}
          className="w-full text-left px-2 py-2 rounded-md hover:bg-accent/30"
        >
          Settings
        </button>
        <button 
          onClick={() => {
            router.push('/help')
            onClose()
          }}
          className="w-full text-left px-2 py-2 rounded-md hover:bg-accent/30"
        >
          Help & Support
        </button>
        <div className="flex items-center justify-between mt-2">
          <span>Theme</span>
          <ThemeToggle />
        </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left px-2 py-2 rounded-md text-red-600 mt-3 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  )
}