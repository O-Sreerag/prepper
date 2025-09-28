"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UploadTestDialog } from "./upload-test-dialog"
import { TestCard } from "./test-card"
import { TESTS_OVERVIEW_STRINGS as STRINGS } from "@/constants"

interface Test {
  id: number
  title: string
  subject: string
  questions: number
  duration: number
  difficulty: string
  lastAttempt: string | null
  bestScore: number | null
  attempts: number
  status: string
}

interface TestsOverviewProps {
  tests: Test[]
}

export function TestsOverview({ tests }: TestsOverviewProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{STRINGS.title}</h2>
          <p className="text-muted-foreground">{STRINGS.description}</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Icons.upload className="mr-2 h-4 w-4" />
          {STRINGS.uploadNewTest}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{STRINGS.totalTests}</CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
            <p className="text-xs text-muted-foreground">{STRINGS.availableInLibrary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{STRINGS.completed}</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.filter((t) => t.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">{STRINGS.testsAttempted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{STRINGS.averageScore}</CardTitle>
            <Icons.target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81.5%</div>
            <p className="text-xs text-muted-foreground">{STRINGS.acrossAllAttempts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Library */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{STRINGS.testLibrary}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </div>

      <UploadTestDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}
