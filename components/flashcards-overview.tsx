"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { CreateFlashcardDialog } from "@/components/create-flashcard-dialog"
import { FlashcardDeck } from "@/components/flashcard-deck"
import { StudySession } from "@/components/study-session"

const mockDecks = [
  {
    id: 1,
    title: "Physics Formulas",
    subject: "Physics",
    cardCount: 45,
    dueCount: 12,
    masteredCount: 28,
    lastStudied: "2 hours ago",
    difficulty: "Medium",
    color: "bg-blue-100 dark:bg-blue-900",
  },
  {
    id: 2,
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    cardCount: 67,
    dueCount: 23,
    masteredCount: 31,
    lastStudied: "1 day ago",
    difficulty: "Hard",
    color: "bg-green-100 dark:bg-green-900",
  },
  {
    id: 3,
    title: "Calculus Concepts",
    subject: "Mathematics",
    cardCount: 38,
    dueCount: 8,
    masteredCount: 25,
    lastStudied: "3 days ago",
    difficulty: "Easy",
    color: "bg-purple-100 dark:bg-purple-900",
  },
]

export function FlashcardsOverview() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [studySessionActive, setStudySessionActive] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<(typeof mockDecks)[0] | null>(null)

  const totalDue = mockDecks.reduce((sum, deck) => sum + deck.dueCount, 0)
  const totalCards = mockDecks.reduce((sum, deck) => sum + deck.cardCount, 0)
  const totalMastered = mockDecks.reduce((sum, deck) => sum + deck.masteredCount, 0)

  const startStudySession = (deck: (typeof mockDecks)[0]) => {
    setSelectedDeck(deck)
    setStudySessionActive(true)
  }

  if (studySessionActive && selectedDeck) {
    return (
      <StudySession
        deck={selectedDeck}
        onComplete={() => {
          setStudySessionActive(false)
          setSelectedDeck(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Flashcards</h2>
          <p className="text-muted-foreground">Spaced repetition learning with AI-powered cards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <Icons.brain className="mr-2 h-4 w-4" />
            Create Deck
          </Button>
          <Button disabled={totalDue === 0}>
            <Icons.zap className="mr-2 h-4 w-4" />
            Study Due Cards ({totalDue})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Icons.brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">Across all decks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalDue}</div>
            <p className="text-xs text-muted-foreground">Ready for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastered</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalMastered}</div>
            <p className="text-xs text-muted-foreground">Well learned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Icons.zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Decks Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Decks</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockDecks.map((deck) => (
            <FlashcardDeck key={deck.id} deck={deck} onStudy={() => startStudySession(deck)} />
          ))}
        </div>
      </div>

      <CreateFlashcardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
