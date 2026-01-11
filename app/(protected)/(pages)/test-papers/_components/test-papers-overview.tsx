"use client"

import { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { UploadPaperDialog } from "./upload-test-paper-dailog"
import { QuestionReview } from "./test-papers-review"
import { Icons } from "@/components/icons"
import { TEST_PAPERS_OVERVIEW_STRINGS as STRINGS } from "@/constants"
import { TestPaperType } from "@/app/(protected)/(pages)/test-papers/types"

export function TestPapersOverview() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [testPapers, setTestPapers] = useState<TestPaperType[]>([])
  const [selectedJob, setSelectedJob] = useState<TestPaperType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestPapers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/test-paper")
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to fetch test papers.")
      setTestPapers(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTestPapers()
    // const interval = setInterval(fetchTestPapers, 10000) // refresh every 10s
    // return () => clearInterval(interval)
  }, [fetchTestPapers]) 

  const handleProcessTestPaper = async (testPaperId: string) => {
    console.log("Processing test paper:", testPaperId)
    try {
      const response = await fetch(`/api/test-paper/process-upload-files/${testPaperId}`, { method: "POST" })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to process test paper.")
      fetchTestPapers()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error during processing.")
    }
  }

  if (selectedJob) {
    return <QuestionReview testPaper={selectedJob} onBack={() => setSelectedJob(null)} />
  }

  const statusColors: Record<TestPaperType["status"], string> = {
    queued: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    review: "bg-purple-100 text-purple-800",
    failed: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  }

  return (
    <>
      <UploadPaperDialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen} />

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{STRINGS.title}</h1>
            <p className="text-muted-foreground">{STRINGS.description}</p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Icons.upload className="mr-2 h-4 w-4" />
            {STRINGS.uploadNewPaper}
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="border rounded-lg p-8 text-center bg-destructive/10 text-destructive">
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {!isLoading && !error && testPapers.length === 0 && (
          <div className="border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold">{STRINGS.noUploadJobsFound}</h2>
            <p className="text-muted-foreground mt-2">{STRINGS.getStartedDescription}</p>
          </div>
        )}

        {!isLoading && !error && testPapers.length > 0 && (
          <div className="space-y-4">
            {testPapers.map((testPaper) => (
              <div key={testPaper.test_paper_id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{testPaper.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testPaper.subject} - {STRINGS.uploadedOn} {new Date(testPaper.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium capitalize px-2 py-1 rounded-md ${statusColors[testPaper.status]}`}
                  >
                    {testPaper.status}
                  </span>

                  {["queued", "failed"].includes(testPaper.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProcessTestPaper(testPaper.test_paper_id)}
                      disabled={testPaper.status === "processing"}
                    >
                      {testPaper.status === "failed" ? "Retry Processing" : "Process"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJob(testPaper)}
                    disabled={testPaper.status !== "review"}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
