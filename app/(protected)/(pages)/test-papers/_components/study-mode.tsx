"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  subject: string
  topic: string
  difficulty: string
}

interface StudyModeProps {
  question: Question
}

export function StudyMode({ question }: StudyModeProps) {
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
                  <Badge variant="secondary">{question.subject}</Badge>
                  <Badge variant="outline">{question.topic}</Badge>
                  <Badge
                    className={
                      question.difficulty === "Easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : question.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }
                    variant="secondary"
                  >
                    {question.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">Question 1 of 60</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-base leading-relaxed">{question.question}</div>

              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-4 ${
                      showExplanation && index === question.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : showExplanation && selectedAnswer === index && index !== question.correctAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-950"
                          : ""
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {showExplanation && index === question.correctAnswer && (
                      <Icons.checkCircle className="ml-auto h-4 w-4 text-green-600" />
                    )}
                    {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
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
                    <p className="text-sm leading-relaxed">{question.explanation}</p>
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
