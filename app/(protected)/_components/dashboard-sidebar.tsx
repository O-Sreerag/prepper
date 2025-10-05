"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { usePathname } from "next/navigation"
import { DASHBOARD_SIDEBAR_STRINGS as STRINGS, DASHBOARD_SIDEBAR_NAVIGATION } from "@/constants"

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6">
        <a href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Icons.carrot className="h-6 w-6 text-primary" />
          <span className="text-xl">{STRINGS.logo}</span>
        </a>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {DASHBOARD_SIDEBAR_NAVIGATION.map((item) => {
          const Icon = Icons[item.iconName as keyof typeof Icons];
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 rounded-lg",
                isActive
                  ? "text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground",
              )}
              asChild
            >
              <a href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="text-base">{item.name}</span>
              </a>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
          <Icons.settings className="h-5 w-5" />
          <span className="text-base">{STRINGS.accountSettings}</span>
        </Button>
      </div>
    </div>
  );
}
