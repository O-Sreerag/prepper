"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { CreateGoalDialog } from "@/components/create-goal-dialog"

const mockGoals = [
  {
    id: 1,
    title: "Solve 150 Physics Questions",
    description: "Complete 150 physics questions this week",
    type: "weekly",
    target: 150,
    current: 127,
    deadline: "2024-03-15",
    status: "active",
    priority: "high",
    subject: "Physics",
  },
  {
    id: 2,
    title: "Study 25 Hours This Month",
    description: "Maintain consistent study schedule",
    type: "monthly",
    target: 25,
    current: 18.5,
    deadline: "2024-03-31",
    status: "active",
    priority: "medium",
    subject: "General",
  },
  {
    id: 3,
    title: "Complete 5 Mock Tests",
    description: "Take and analyze 5 full-length mock tests",
    type: "monthly",
    target: 5,
    current: 3,
    deadline: "2024-03-31",
    status: "active",
    priority: "high",
    subject: "General",
  },
  {
    id: 4,
    title: "Master Organic Chemistry",
    description: "Complete all organic chemistry flashcards",
    type: "custom",
    target: 100,
    current: 100,
    deadline: "2024-03-10",
    status: "completed",
    priority: "medium",
    subject: "Chemistry",
  },
]

export function GoalsOverview() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const activeGoals = mockGoals.filter((goal) => goal.status === "active")
  const completedGoals = mockGoals.filter((goal) => goal.status === "completed")
  const totalProgress =
    activeGoals.reduce((sum, goal) => sum + (goal.current / goal.target) * 100, 0) / activeGoals.length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "weekly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "monthly":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Goals & Targets</h2>
          <p className="text-muted-foreground">Track your progress and stay motivated</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Icons.target className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Icons.target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
            <p className="text-xs text-muted-foreground">Across active goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Icons.zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Days achieving goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Goals</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {activeGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                      {goal.priority}
                    </Badge>
                    <Badge className={getTypeColor(goal.type)} variant="secondary">
                      {goal.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {goal.current} / {goal.target} {goal.type === "monthly" && goal.target === 25 ? "hours" : ""}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icons.calendar className="h-4 w-4" />
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.bookOpen className="h-4 w-4" />
                    {goal.subject}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Icons.trendingUp className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Icons.fileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recently Completed</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icons.checkCircle className="h-4 w-4 text-green-600" />
                        {goal.title}
                      </CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Completed on {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <CreateGoalDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
