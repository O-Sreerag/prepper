"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useHeader } from "@/app/(protected)/_contexts"
import { cn } from "@/lib/utils"

export const TopHeader = () => {
  const { breadcrumbs, backButton } = useHeader()

  // If nothing to show → render nothing (important)
  if (!backButton?.show && breadcrumbs.length === 0) {
    return null
  }

  return (
    <div className="border-b bg-card px-6 py-2">
      <div className="flex items-center justify-between gap-3">
        {/* Back Button */}
        {backButton?.show && backButton.href && (
          <Link
            href={backButton.href}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        )}

        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={cn(
              "flex items-center text-sm text-muted-foreground",
              backButton?.show && "ml-2"
            )}
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <span key={item.href} className="flex items-center">
                  {!isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                  )}

                  {!isLast && (
                    <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/60" />
                  )}
                </span>
              )
            })}
          </nav>
        )}
      </div>
    </div>
  )
}
