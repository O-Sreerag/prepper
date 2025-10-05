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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const authService = new AuthService();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authService.getActiveUser();
        if (session?.user) {
          setUser({
            name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? "Unknown",
            email: session.user.email ?? "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.userLogout();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary/50">
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <DashboardSidebar />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40 bg-background/80 backdrop-blur-sm rounded-full"
          >
            <Icons.menu className="h-5 w-5" />
            <span className="sr-only">{STRINGS.toggleSidebar}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <div className="lg:hidden" /> {/* Spacer for mobile menu button */}
          <h1 className="text-lg font-semibold text-foreground">
            {STRINGS.dashboard}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div ref={profileRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setProfileOpen((s) => !s)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <Icons.user className="h-5 w-5" />
                <span className="sr-only">{STRINGS.profile}</span>
              </Button>
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-xl border bg-card p-4 shadow-xl z-[1000]"
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-center">
                      <p className="font-bold truncate">{user?.name ?? "Guest"}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email ?? ""}</p>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full justify-start"
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <div className="flex items-center gap-2">
                        <Icons.logout className="h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
