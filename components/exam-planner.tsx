"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

const mockPlan = {
  examDate: "2024-06-15",
  daysLeft: 85,
  totalDays: 120,
  subjects: [
    { name: "Physics", progress: 75, color: "bg-blue-500" },
    { name: "Chemistry", progress: 60, color: "bg-green-500" },
    { name: "Mathematics", progress: 85, color: "bg-purple-500" },
  ],
}

const mockSchedule = [
  {
    date: "2024-03-15",
    day: "Today",
    tasks: [
      { id: 1, title: "Physics - Mechanics", type: "study", duration: 120, completed: false, priority: "high" },
      { id: 2, title: "Math Mock Test #5", type: "test", duration: 180, completed: false, priority: "medium" },
      { id: 3, title: "Chemistry Flashcards", type: "review", duration: 30, completed: true, priority: "low" },
    ],
  },
  {
    date: "2024-03-16",
    day: "Tomorrow",
    tasks: [
      {
        id: 4,
        title: "Chemistry - Organic Reactions",
        type: "study",
        duration: 90,
        completed: false,
        priority: "high",
      },
      { id: 5, title: "Physics Problem Solving", type: "practice", duration: 60, completed: false, priority: "medium" },
      { id: 6, title: "Weekly Review", type: "review", duration: 45, completed: false, priority: "low" },
    ],
  },
  {
    date: "2024-03-17",
    day: "Sunday",
    tasks: [
      { id: 7, title: "Full Mock Test", type: "test", duration: 180, completed: false, priority: "high" },
      { id: 8, title: "Test Analysis", type: "analysis", duration: 60, completed: false, priority: "high" },
    ],
  },
]

export function ExamPlanner() {
  const [selectedView, setSelectedView] = useState<"timeline" | "calendar">("timeline")

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "test":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "practice":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "analysis":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const overallProgress = ((mockPlan.totalDays - mockPlan.daysLeft) / mockPlan.totalDays) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exam Planner</h2>
          <p className="text-muted-foreground">AI-generated study roadmap for your exam preparation</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedView === "timeline" ? "default" : "outline"}
            onClick={() => setSelectedView("timeline")}
          >
            <Icons.calendar className="mr-2 h-4 w-4" />
            Timeline
          </Button>
          <Button
            variant={selectedView === "calendar" ? "default" : "outline"}
            onClick={() => setSelectedView("calendar")}
          >
            <Icons.barChart className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Exam Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.calendar className="h-5 w-5 text-primary" />
                JEE Main 2024
              </CardTitle>
              <CardDescription>Your preparation timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary">{mockPlan.daysLeft}</div>
                  <div className="text-sm text-muted-foreground">days remaining</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-muted-foreground">preparation complete</div>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subject Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPlan.subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                      {subject.name}
                    </span>
                    <span>{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Study Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Study Schedule</h3>
          <Button variant="outline" size="sm">
            <Icons.rotateCcw className="mr-2 h-4 w-4" />
            Regenerate Plan
          </Button>
        </div>

        <div className="space-y-4">
          {mockSchedule.map((daySchedule, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{daySchedule.day}</CardTitle>
                    <CardDescription>{new Date(daySchedule.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {daySchedule.tasks.filter((task) => task.completed).length} / {daySchedule.tasks.length} completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {daySchedule.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${
                        task.completed ? "bg-green-50 dark:bg-green-950" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {task.completed ? (
                          <Icons.checkCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </span>
                          <Badge className={getTaskTypeColor(task.type)} variant="secondary">
                            {task.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icons.clock className="h-3 w-3" />
                          {task.duration} minutes
                        </div>
                      </div>
                      {!task.completed && (
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
