"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface TestCardProps {
  test: {
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
}

export function TestCard({ test }: TestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{test.title}</CardTitle>
            <CardDescription>{test.subject}</CardDescription>
          </div>
          <Badge className={getStatusColor(test.status)} variant="secondary">
            {test.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icons.fileText className="h-4 w-4" />
            {test.questions} questions
          </div>
          <div className="flex items-center gap-1">
            <Icons.clock className="h-4 w-4" />
            {test.duration} min
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={getDifficultyColor(test.difficulty)} variant="secondary">
            {test.difficulty}
          </Badge>
          {test.bestScore && <div className="text-sm font-medium">Best: {test.bestScore}%</div>}
        </div>

        {test.lastAttempt && (
          <div className="text-xs text-muted-foreground">
            Last attempt: {test.lastAttempt} • {test.attempts} attempts
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Icons.play className="mr-2 h-4 w-4" />
            Start Test
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Icons.bookOpen className="mr-2 h-4 w-4" />
            Study Mode
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
