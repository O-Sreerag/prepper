"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { FLASHCARD_DECK_STRINGS as STRINGS } from "@/constants"

interface FlashcardDeckProps {
  deck: {
    id: number
    title: string
    subject: string
    cardCount: number
    dueCount: number
    masteredCount: number
    lastStudied: string
    difficulty: string
    color: string
  }
  onStudy: () => void
}

export function FlashcardDeck({ deck, onStudy }: FlashcardDeckProps) {
  const masteryPercentage = (deck.masteredCount / deck.cardCount) * 100

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{deck.title}</CardTitle>
            <CardDescription>{deck.subject}</CardDescription>
          </div>
          <div className={`w-4 h-4 rounded-full ${deck.color}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Icons.brain className="h-4 w-4 text-muted-foreground" />
            {deck.cardCount} {STRINGS.cards}
          </div>
          <Badge className={getDifficultyColor(deck.difficulty)} variant="secondary">
            {deck.difficulty}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{STRINGS.masteryProgress}</span>
            <span>{Math.round(masteryPercentage)}%</span>
          </div>
          <Progress value={masteryPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icons.clock className="h-4 w-4" />
            {STRINGS.due} {deck.dueCount}
          </div>
          <div>
            {STRINGS.last} {deck.lastStudied}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={onStudy} className="flex-1" disabled={deck.dueCount === 0}>
            <Icons.play className="mr-2 h-4 w-4" />
            {STRINGS.study} ({deck.dueCount})
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent">
            <Icons.fileText className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
