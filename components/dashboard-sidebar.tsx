"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Icons.barChart },
  { name: "Mock Tests", href: "/dashboard/tests", icon: Icons.fileText },
  { name: "Study Mode", href: "/dashboard/study", icon: Icons.bookOpen },
  { name: "Flashcards", href: "/dashboard/flashcards", icon: Icons.brain },
  { name: "Analytics", href: "/dashboard/analytics", icon: Icons.trendingUp },
  { name: "Goals", href: "/dashboard/goals", icon: Icons.target },
  { name: "Planner", href: "/dashboard/planner", icon: Icons.calendar },
  { name: "AI Tutor", href: "/dashboard/tutor", icon: Icons.zap },
]

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
          <span className="text-lg font-semibold text-sidebar-foreground">ExamPrep</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
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
                <item.icon className="h-4 w-4" />
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
          Account Settings
        </Button>
      </div>
    </div>
  )
}
