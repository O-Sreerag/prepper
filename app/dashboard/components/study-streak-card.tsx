"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { STUDY_STREAK_CARD_STRINGS as STRINGS } from "@/constants"

interface StudyStreakCardProps {
  currentStreak: number
  longestStreak: number
}

export function StudyStreakCard({ currentStreak, longestStreak }: StudyStreakCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.zap className="h-5 w-5 text-orange-500" />
          {STRINGS.title}
        </CardTitle>
        <CardDescription>{STRINGS.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">{STRINGS.currentStreak}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-muted-foreground">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">{STRINGS.bestStreak}</div>
            </div>
          </div>

          {/* Weekly streak visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-sm ${i < 5 ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{STRINGS.mon}</span>
            <span>{STRINGS.sun}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
