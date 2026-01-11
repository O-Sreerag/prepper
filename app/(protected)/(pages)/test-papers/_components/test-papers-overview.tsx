"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/tables"
import { Badge } from "@/components/ui/badge"

import { trpc } from '@/app/_trpc/client'
import { UploadPaperDialog } from "./upload-test-paper-dailog"
import { QuestionReview } from "./test-papers-review"
import { TEST_PAPERS_OVERVIEW_STRINGS as STRINGS } from "@/constants"
import { TestPaperGetAllType } from "@/lib/types"

type Props = {
  initialTestPapers: TestPaperGetAllType[]
}

export function TestPapersOverview({ initialTestPapers }: Props) {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<TestPaperGetAllType | null>(null)

  const {
    data: testPapers = initialTestPapers,
    isFetching,
    error,
    refetch,
  } = trpc.testPaper.getAll.useQuery(undefined, {
    initialData: initialTestPapers,
    refetchOnMount: true,
  })

  const isLoading = isFetching && initialTestPapers.length === 0

  const handleProcessTestPaper = async (testPaperId: string) => {
    console.log("Processing test paper:", testPaperId)
    try {
      const response = await fetch(`/api/test-paper/process-upload-files/${testPaperId}`, { method: "POST" })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to process test paper.")
      await refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error during processing.")
    }
  }

  if (selectedJob) {
    return <QuestionReview testPaper={selectedJob} onBack={() => setSelectedJob(null)} />
  }

  const testPaperColumns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {row.original.subject}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.difficulty}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const map: Record<string, string> = {
          queued: "bg-yellow-100 text-yellow-800",
          processing: "bg-blue-100 text-blue-800",
          review: "bg-purple-100 text-purple-800",
          failed: "bg-red-100 text-red-800",
          completed: "bg-green-100 text-green-800",
        }

        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[status]}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Uploaded",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const paper = row.original

        return (
          <div className="flex gap-2">
            {["queued", "failed"].includes(paper.status) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleProcessTestPaper(paper.test_paper_id)}
                disabled={paper.status === "processing"}
              >
                {paper.status === "failed" ? "Retry" : "Process"}
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={paper.status !== "review"}
              onClick={() => setSelectedJob(paper)}
            >
              Review
            </Button>
          </div>
        )
      },
    },
  ]

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
            <p className="mt-2">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && (
          <DataTable
            data={testPapers}
            columns={testPaperColumns}
            pageSize={8}
          />
        )}
      </div>
    </>
  )
}
