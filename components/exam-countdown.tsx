"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

export function ExamCountdown() {
  const examDate = new Date("2024-06-15")
  const today = new Date()
  const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = 120 // Total preparation period
  const progress = ((totalDays - daysLeft) / totalDays) * 100

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icons.calendar className="h-5 w-5 text-primary" />
              JEE Main 2024
            </CardTitle>
            <CardDescription>Your target exam is approaching</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{daysLeft}</div>
            <div className="text-sm text-muted-foreground">days left</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Preparation Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
