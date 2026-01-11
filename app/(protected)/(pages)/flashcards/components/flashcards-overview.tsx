"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { CreateFlashcardDialog } from "./create-flashcard-dialog"
import { FlashcardDeck } from "./flashcard-deck"
import { StudySession } from "./study-session"
import { FLASHCARD_STRINGS } from "@/constants"

interface Deck {
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

interface FlashcardsOverviewProps {
  decks: Deck[]
}

export function FlashcardsOverview({ decks }: FlashcardsOverviewProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [studySessionActive, setStudySessionActive] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)

  const totalDue = decks.reduce((sum, deck) => sum + deck.dueCount, 0)
  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0)
  const totalMastered = decks.reduce((sum, deck) => sum + deck.masteredCount, 0)

  const startStudySession = (deck: Deck) => {
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
          <h2 className="text-2xl font-bold text-foreground">{FLASHCARD_STRINGS.title}</h2>
          <p className="text-muted-foreground">{FLASHCARD_STRINGS.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <Icons.brain className="mr-2 h-4 w-4" />
            {FLASHCARD_STRINGS.createDeck}
          </Button>
          <Button disabled={totalDue === 0}>
            <Icons.zap className="mr-2 h-4 w-4" />
            {FLASHCARD_STRINGS.studyDue} ({totalDue})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{FLASHCARD_STRINGS.totalCards}</CardTitle>
            <Icons.brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">{FLASHCARD_STRINGS.totalCardsDescription}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{FLASHCARD_STRINGS.dueToday}</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalDue}</div>
            <p className="text-xs text-muted-foreground">{FLASHCARD_STRINGS.dueTodayDescription}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{FLASHCARD_STRINGS.mastered}</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalMastered}</div>
            <p className="text-xs text-muted-foreground">{FLASHCARD_STRINGS.masteredDescription}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{FLASHCARD_STRINGS.studyStreak}</CardTitle>
            <Icons.zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">{FLASHCARD_STRINGS.studyStreakDescription}</p>
          </CardContent>
        </Card>
      </div>

      {/* Decks Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{FLASHCARD_STRINGS.yourDecks}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <FlashcardDeck key={deck.id} deck={deck} onStudy={() => startStudySession(deck)} />
          ))}
        </div>
      </div>

      <CreateFlashcardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
