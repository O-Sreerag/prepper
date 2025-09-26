"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

const mockQuestion = {
  id: 1,
  question:
    "A particle moves in a straight line with constant acceleration. If it covers 20m in the first 2 seconds and 60m in the next 4 seconds, find the initial velocity and acceleration.",
  options: ["u = 5 m/s, a = 5 m/s²", "u = 2 m/s, a = 8 m/s²", "u = 0 m/s, a = 10 m/s²", "u = 3 m/s, a = 7 m/s²"],
  correctAnswer: 0,
  explanation:
    "Using kinematic equations: s = ut + ½at². For first 2s: 20 = u(2) + ½a(4). For next 4s: 60 = u(4) + ½a(16) - [u(2) + ½a(4)]. Solving these equations gives u = 5 m/s and a = 5 m/s².",
  subject: "Physics",
  topic: "Kinematics",
  difficulty: "Medium",
}

export function StudyMode() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [notes, setNotes] = useState("")
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(false)

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Study Mode</h2>
          <p className="text-muted-foreground">Review questions at your own pace with detailed explanations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.rotateCcw className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button>
            Next Question
            <Icons.play className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Question Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{mockQuestion.subject}</Badge>
                  <Badge variant="outline">{mockQuestion.topic}</Badge>
                  <Badge
                    className={
                      mockQuestion.difficulty === "Easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : mockQuestion.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }
                    variant="secondary"
                  >
                    {mockQuestion.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">Question 1 of 60</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-base leading-relaxed">{mockQuestion.question}</div>

              <div className="space-y-2">
                {mockQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-4 ${
                      showExplanation && index === mockQuestion.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : showExplanation && selectedAnswer === index && index !== mockQuestion.correctAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-950"
                          : ""
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {showExplanation && index === mockQuestion.correctAnswer && (
                      <Icons.checkCircle className="ml-auto h-4 w-4 text-green-600" />
                    )}
                    {showExplanation && selectedAnswer === index && index !== mockQuestion.correctAnswer && (
                      <Icons.xCircle className="ml-auto h-4 w-4 text-red-600" />
                    )}
                  </Button>
                ))}
              </div>

              {showExplanation && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icons.brain className="h-4 w-4" />
                      Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{mockQuestion.explanation}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
              <CardDescription>Add your personal notes for this question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Save Note
                </Button>
                <Button
                  size="sm"
                  variant={isMarkedForRevision ? "default" : "outline"}
                  onClick={() => setIsMarkedForRevision(!isMarkedForRevision)}
                >
                  <Icons.target className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Icons.brain className="mr-2 h-4 w-4" />
                Create Flashcard
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Icons.zap className="mr-2 h-4 w-4" />
                Ask AI Tutor
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Icons.fileText className="mr-2 h-4 w-4" />
                Similar Questions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
