"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useParams, usePathname } from "next/navigation"
import { ROUTES } from "@/config"

type HeaderContextType = {
  breadcrumbs: Array<{ label: string; href: string }>
  backButton?: {
    href: string
    show: boolean
  }
}

const HeaderContext = createContext<HeaderContextType>({
  breadcrumbs: [],
  backButton: {
    href: "",
    show: false,
  },
})

export const useHeader = () => useContext(HeaderContext)

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const params = useParams()
  const id = params?.id as string | undefined

  const value = useMemo<HeaderContextType>(() => {

    if (pathname === ROUTES.TEST_PAPERS.CREATE) {
      return {
        backButton: {
          href: ROUTES.TEST_PAPERS.ROOT,
          show: true,
        },
        breadcrumbs: [
          { label: "Test Papers", href: ROUTES.TEST_PAPERS.ROOT },
          { label: "Create", href: ROUTES.TEST_PAPERS.CREATE },
        ],
      }
    }

    if (id && pathname === ROUTES.TEST_PAPERS.VIEW(id)) {
      return {
        backButton: {
          href: ROUTES.TEST_PAPERS.ROOT,
          show: true,
        },
        breadcrumbs: [
          { label: "Test Papers", href: ROUTES.TEST_PAPERS.ROOT },
          { label: "View", href: ROUTES.TEST_PAPERS.VIEW(id) },
        ],
      }
    }

    return {
      breadcrumbs: [],
      backButton: {
        href: "",
        show: false,
      },
    }
  }, [pathname, id])

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  )
}
