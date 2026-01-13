"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { trpc } from "@/app/_trpc/client"
import { TestPaperOverView, TestPaperQuestions } from "@/app/(protected)/(pages)/test-papers/_components"
import { statusColors } from "@/app/(protected)/(pages)/test-papers/_constants"

interface TestPaperOverViewPageProps {
  params: {
    id: string
  }
}

export default function TestPaperOverViewPage({ params }: TestPaperOverViewPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab")

    if (!tabFromUrl) {
      router.replace(
        `/test-papers/${params.id}?tab=overview`,
        { scroll: false }
      )
    }
  }, [router, searchParams, params.id])

  // Get initial tab from URL or default to "overview"
  const initialTab = searchParams.get("tab") || "overview"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isAnimating, setIsAnimating] = useState(false)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    if (value === activeTab || isAnimating) return

    setIsAnimating(true)
    setTimeout(() => {
      setActiveTab(value)
      const newUrl = `/test-papers/${params.id}?tab=${value}`
      router.push(newUrl, { scroll: false })
      setTimeout(() => setIsAnimating(false), 50)
    }, 150)
  }

  // Sync tab state with URL changes
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "overview"
    if (currentTab !== activeTab) {
      setActiveTab(currentTab)
    }
  }, [searchParams, activeTab])

  const {
    data: testPaper,
    isLoading,
    error,
  } = trpc.testPaper.getById.useQuery({ id: params.id })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !testPaper) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-semibold">Test Paper Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The test paper doesn’t exist or you don’t have access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{testPaper.title}</h1>
          <p className="text-muted-foreground">{testPaper.description || 'No description available'}</p>
        </div>
        <Badge className={statusColors[testPaper.status]}>
          {testPaper.status}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 relative">
          <div
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-200 ease-in-out"
            style={{
              left: `${(activeTab === 'overview' ? 0 : activeTab === 'questions' ? 25 : activeTab === 'analytics' ? 50 : 75)}%`,
              width: '25%'
            }}
          />
          <TabsTrigger
            value="overview"
            className="relative transition-all duration-200 ease-in-out hover:bg-muted/50 data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="relative transition-all duration-200 ease-in-out hover:bg-muted/50 data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="relative transition-all duration-200 ease-in-out hover:bg-muted/50 data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="relative transition-all duration-200 ease-in-out hover:bg-muted/50 data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-6"
        >
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'overview' && !isAnimating
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}>
            <TestPaperOverView testPaper={testPaper} />
          </div>
        </TabsContent>

        <TabsContent
          value="questions"
          className="mt-6"
        >
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'questions' && !isAnimating
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}>
            <TestPaperQuestions testPaperId={params.id} />
          </div>
        </TabsContent>

        <TabsContent
          value="analytics"
          className="mt-6"
        >
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'analytics' && !isAnimating
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">Analytics Tab</h3>
              <p className="text-sm text-muted-foreground mt-2">Analytics coming soon...</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="settings"
          className="mt-6"
        >
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'settings' && !isAnimating
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
            }`}>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">Settings Tab</h3>
              <p className="text-sm text-muted-foreground mt-2">Settings coming soon...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
