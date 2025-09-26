"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export function StudyStreakCard() {
  const currentStreak = 12
  const longestStreak = 28

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.zap className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
        <CardDescription>Keep up the momentum!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current streak</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-muted-foreground">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Best streak</div>
            </div>
          </div>

          {/* Weekly streak visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-sm ${i < 5 ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
