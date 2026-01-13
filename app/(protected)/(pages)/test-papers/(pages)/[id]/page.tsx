"use client"

import { trpc } from "@/app/_trpc/client"
import { TestPaperOverView } from "@/app/(protected)/(pages)/test-papers/_components"

interface TestPaperDetailsPageProps {
  params: {
    id: string
  }
}

export default function TestPaperDetailsPage({ params }: TestPaperDetailsPageProps) {
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

  return <TestPaperOverView testPaper={testPaper} />
}
