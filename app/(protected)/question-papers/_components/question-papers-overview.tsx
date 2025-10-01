"use client"

import { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { UploadPaperDialog } from "./upload-paper-dailog"
import { QuestionReview } from "./question-papers-review"
import { Icons } from "@/components/icons"
import { QUESTION_PAPERS_OVERVIEW_STRINGS as STRINGS } from "@/constants"
import { UploadJobType } from "@/app/(protected)/question-papers/types"

export function QuestionPapersOverview() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [jobs, setJobs] = useState<UploadJobType[]>([])
  const [selectedJob, setSelectedJob] = useState<UploadJobType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/uploads")
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to fetch jobs.")
      setJobs(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 10000) // refresh every 10s
    return () => clearInterval(interval)
  }, [fetchJobs])

  const handleProcessJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/process-upload/${jobId}`, { method: "POST" })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to process job.")
      fetchJobs()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error during processing.")
    }
  }

  if (selectedJob) {
    return <QuestionReview job={selectedJob} onBack={() => setSelectedJob(null)} />
  }

  const statusColors: Record<UploadJobType["status"], string> = {
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

        {!isLoading && !error && jobs.length === 0 && (
          <div className="border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold">{STRINGS.noUploadJobsFound}</h2>
            <p className="text-muted-foreground mt-2">{STRINGS.getStartedDescription}</p>
          </div>
        )}

        {!isLoading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.subject} - {STRINGS.uploadedOn} {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium capitalize px-2 py-1 rounded-md ${statusColors[job.status]}`}
                  >
                    {job.status}
                  </span>

                  {["queued", "failed"].includes(job.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProcessJob(job.id)}
                      disabled={job.status === "processing"}
                    >
                      {job.status === "failed" ? "Retry Processing" : "Process"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                    disabled={job.status !== "review"}
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
