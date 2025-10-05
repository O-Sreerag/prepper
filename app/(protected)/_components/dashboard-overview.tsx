"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { StudyStreakCard } from "./study-streak-card"
import { PerformanceChart } from "./performance-chart"
import { RecentActivity } from "./recent-activity"
import { ExamCountdown } from "./exam-countdown"
import { UploadQuestionPaper } from "./upload-question-paper"
import { DASHBOARD_STRINGS as STRINGS } from "@/constants"

const activities = [
  {
    type: "test",
    title: "Physics Mock Test #12",
    description: "Scored 78/100",
    time: "2 hours ago",
    icon: Icons.fileText,
    color: "text-blue-500",
  },
  {
    type: "study",
    title: "Organic Chemistry",
    description: "45 minutes study session",
    time: "5 hours ago",
    icon: Icons.bookOpen,
    color: "text-green-500",
  },
  {
    type: "flashcard",
    title: "Mathematics Formulas",
    description: "Reviewed 23 cards",
    time: "1 day ago",
    icon: Icons.brain,
    color: "text-purple-500",
  },
  {
    type: "goal",
    title: "Weekly Goal Achieved",
    description: "Solved 150 questions",
    time: "2 days ago",
    icon: Icons.target,
    color: "text-orange-500",
  },
]

const stats = [
  {
    title: STRINGS.questionsSolved,
    icon: Icons.checkCircle,
    value: "1,247",
    description: "+12% from last week",
  },
  {
    title: STRINGS.accuracyRate,
    icon: Icons.target,
    value: "87.3%",
    description: "+2.1% from last week",
  },
  {
    title: STRINGS.studyHours,
    icon: Icons.clock,
    value: "42.5h",
    description: "This month",
  },
  {
    title: STRINGS.mockTests,
    icon: Icons.fileText,
    value: "23",
    description: "Completed",
  },
]

const streak = {
  current: 12,
  longest: 28,
}

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{STRINGS.welcome("Alex")}</h1>
          <p className="text-lg text-muted-foreground">{STRINGS.progressOverview}</p>
        </div>
        <Button size="lg" className="shadow-lg">
          <Icons.play className="mr-2 h-5 w-5" />
          {STRINGS.startStudySession}
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <PerformanceChart />
          <RecentActivity activities={activities} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ExamCountdown />
          <StudyStreakCard currentStreak={streak.current} longestStreak={streak.longest} />
          <UploadQuestionPaper />
        </div>
      </div>
    </div>
  );
}
