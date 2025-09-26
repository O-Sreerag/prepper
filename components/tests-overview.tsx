"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UploadTestDialog } from "@/components/upload-test-dialog"
import { TestCard } from "@/components/test-card"

const mockTests = [
  {
    id: 1,
    title: "Physics Mock Test #12",
    subject: "Physics",
    questions: 60,
    duration: 180,
    difficulty: "Medium",
    lastAttempt: "2 days ago",
    bestScore: 78,
    attempts: 3,
    status: "completed",
  },
  {
    id: 2,
    title: "Mathematics Practice Set #8",
    subject: "Mathematics",
    questions: 45,
    duration: 120,
    difficulty: "Hard",
    lastAttempt: "1 week ago",
    bestScore: 85,
    attempts: 2,
    status: "completed",
  },
  {
    id: 3,
    title: "Chemistry Organic Compounds",
    subject: "Chemistry",
    questions: 50,
    duration: 150,
    difficulty: "Easy",
    lastAttempt: null,
    bestScore: null,
    attempts: 0,
    status: "new",
  },
]

export function TestsOverview() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mock Tests</h2>
          <p className="text-muted-foreground">Practice with real exam-like conditions</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Icons.upload className="mr-2 h-4 w-4" />
          Upload New Test
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTests.length}</div>
            <p className="text-xs text-muted-foreground">Available in library</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTests.filter((t) => t.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Tests attempted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Icons.target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81.5%</div>
            <p className="text-xs text-muted-foreground">Across all attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Library */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test Library</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </div>

      <UploadTestDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}
