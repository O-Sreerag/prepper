"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { usePathname } from "next/navigation"
import { DASHBOARD_SIDEBAR_STRINGS as STRINGS, DASHBOARD_SIDEBAR_NAVIGATION } from "@/constants"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Icons.bookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">{STRINGS.logo}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {DASHBOARD_SIDEBAR_NAVIGATION.map((item) => {
          const Icon = Icons[item.iconName as keyof typeof Icons]
          const isActive = pathname === item.href
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              asChild
            >
              <a href={item.href}>
                <Icon className="h-4 w-4" />
                {item.name}
              </a>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" size="sm">
          <Icons.user className="h-4 w-4" />
          {STRINGS.accountSettings}
        </Button>
      </div>
    </div>
  )
}
