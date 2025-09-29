"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { StudyStreakCard } from "./study-streak-card"
import { PerformanceChart } from "./performance-chart"
import { RecentActivity } from "./recent-activity"
import { ExamCountdown } from "./exam-countdown"
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
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{STRINGS.welcome("Alex")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{STRINGS.progressOverview}</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Icons.play className="mr-2 h-4 w-4" />
          {STRINGS.startStudySession}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <ExamCountdown />
          <PerformanceChart />
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          <StudyStreakCard currentStreak={streak.current} longestStreak={streak.longest} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  )
}
