"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen, BarChart, FileText, Brain, TrendingUp, Target,
  Calendar, Zap, Settings, HelpCircle, LogOut, Moon, Sun,
  ChevronRight, Menu
} from "lucide-react"

const NAV = [
  { name: "Overview", href: "/", icon: BarChart },
  {
    name: "Test Papers",
    href: "/test-papers",
    icon: BookOpen,
    subItems: [
      { name: "All Papers", href: "/test-papers" },
      { name: "Create Paper", href: "/test-papers/create" },
    ],
  },
  { name: "Mock Tests", href: "/tests", icon: FileText },
  { name: "Flashcards", href: "/flashcards", icon: Brain },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Planner", href: "/planner", icon: Calendar },
  { name: "AI Tutor", href: "/tutor", icon: Zap },
]

export const DesktopSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pathname, setPathname] = useState("/")
  const [darkMode, setDarkMode] = useState(false)

  const expandedW = 256
  const collapsedW = 72
  const shouldExpand = !collapsed || hovering

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const handleLogout = () => {
    console.log("Logout clicked")
  }

  return (
    <div className="hidden md:flex h-screen bg-background dark:bg-background">
      <motion.aside
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        animate={{ width: shouldExpand ? expandedW : collapsedW }}
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex flex-col bg-card dark:bg-card border-r border-border dark:border-border overflow-hidden shadow-sleek"
      >

        {/* Logo / top */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border dark:border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-card" />
            </div>
            <AnimatePresence>
              {shouldExpand && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-semibold text-foreground tracking-wide"
                >
                  ExamPrep
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {shouldExpand && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-md hover:bg-accent/10 transition-colors"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="h-4 w-4 text-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-4 px-2 custom-scrollbar">
          {NAV.map((item, idx) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              expanded={shouldExpand}
              active={pathname === item.href}
              delay={idx * 0.03}
            />
          ))}
        </nav>

        {/* Bottom area */}
        <div className="p-3 border-t border-border dark:border-border/50 space-y-2">
          <SidebarButton icon={Settings} label="Settings" expanded={shouldExpand} onClick={() => console.log("Settings")} />
          <SidebarButton icon={HelpCircle} label="Help & Support" expanded={shouldExpand} onClick={() => console.log("Help")} />
          <SidebarButton icon={LogOut} label="Logout" expanded={shouldExpand} onClick={handleLogout} />

          <div className="pt-2 border-t border-border/40 dark:border-border/40">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-all group"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-accent" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
              <AnimatePresence>
                {shouldExpand && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-foreground font-medium"
                  >
                    {darkMode ? "Light" : "Dark"} Mode
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70" />
      </motion.aside>
    </div>
  )
}

const SidebarNavItem = ({ item, expanded, active, delay }: any) => {
  const [open, setOpen] = useState(false)
  const Icon = item.icon

  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="mb-1">
      <button
        onClick={() => (item.subItems ? setOpen(!open) : console.log("Navigate to", item.href))}
        className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden ${
          active
            ? "bg-primary/15 text-primary dark:text-primary shadow-sm"
            : "hover:bg-accent/10 text-foreground"
        }`}
      >
        <Icon className="h-5 w-5 flex-shrink-0 relative z-10" />
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-medium truncate relative z-10"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
        {item.subItems && expanded && (
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="ml-auto relative z-10">
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>

      <AnimatePresence>
        {item.subItems && open && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-11 pr-2 pt-1 pb-1 space-y-1">
              {item.subItems.map((s: any) => (
                <button
                  key={s.name}
                  onClick={() => console.log("Navigate to", s.href)}
                  className="block w-full text-left px-3 py-1.5 rounded-md text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SidebarButton = ({ icon: Icon, label, expanded, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-all group"
    >
      <Icon className="h-4 w-4 text-foreground flex-shrink-0" />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-foreground font-medium truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
