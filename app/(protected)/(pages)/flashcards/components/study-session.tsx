"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

interface StudySessionProps {
  deck: {
    id: number
    title: string
    subject: string
    dueCount: number
  }
  onComplete: () => void
}

const mockCards = [
  {
    id: 1,
    front: "What is Newton's Second Law of Motion?",
    back: "F = ma (Force equals mass times acceleration)",
    difficulty: "medium",
  },
  {
    id: 2,
    front: "Define kinetic energy",
    back: "KE = ½mv² (Half of mass times velocity squared)",
    difficulty: "easy",
  },
  {
    id: 3,
    front: "What is the formula for gravitational potential energy?",
    back: "PE = mgh (Mass times gravitational acceleration times height)",
    difficulty: "medium",
  },
]

export function StudySession({ deck, onComplete }: StudySessionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: mockCards.length,
  })

  const currentCard = mockCards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / mockCards.length) * 100

  const handleResponse = (difficulty: "easy" | "medium" | "hard") => {
    if (difficulty === "easy") {
      setSessionStats((prev) => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setSessionStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }

    if (currentCardIndex < mockCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    } else {
      onComplete()
    }
  }

  const flipCard = () => {
    setShowAnswer(!showAnswer)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Study Session</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{deck.title}</p>
        </div>
        <Button variant="outline" onClick={onComplete} size="sm" className="w-full sm:w-auto bg-transparent">
          <Icons.xCircle className="mr-2 h-4 w-4" />
          End Session
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Card {currentCardIndex + 1} of {mockCards.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Flashcard */}
      <div className="flex justify-center px-2 sm:px-0">
        <Card
          className="w-full max-w-2xl min-h-[250px] sm:min-h-[300px] cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={flipCard}
        >
          <CardHeader className="text-center pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">
              {showAnswer ? "Answer" : "Question"}
              <Icons.rotateCcw className="ml-2 h-3 w-3 sm:h-4 sm:w-4 inline" />
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Tap to flip</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[150px] sm:min-h-[200px] p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm sm:text-lg leading-relaxed">{showAnswer ? currentCard.back : currentCard.front}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Buttons */}
      {showAnswer && (
        <div className="flex justify-center px-2 sm:px-0">
          <div className="flex gap-2 sm:gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:text-red-300 h-10 sm:h-11"
              onClick={() => handleResponse("hard")}
            >
              <Icons.xCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Hard</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300 h-10 sm:h-11"
              onClick={() => handleResponse("medium")}
            >
              <Icons.clock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Medium</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:text-green-300 h-10 sm:h-11"
              onClick={() => handleResponse("easy")}
            >
              <Icons.checkCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Easy</span>
            </Button>
          </div>
        </div>
      )}

      {/* Session Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Correct</CardTitle>
            <Icons.checkCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">{sessionStats.correct}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Need Review</CardTitle>
            <Icons.clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-orange-600">{sessionStats.incorrect}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Remaining</CardTitle>
            <Icons.brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{mockCards.length - currentCardIndex - 1}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
