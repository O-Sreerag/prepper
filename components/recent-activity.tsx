"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

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

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest study sessions and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium">{activity.title}</div>
                <div className="text-xs text-muted-foreground">{activity.description}</div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
