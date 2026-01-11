"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { RECENT_ACTIVITY_STRINGS as STRINGS } from "@/constants"

interface Activity {
  type: string
  title: string
  description: string
  time: string
  icon: React.ElementType
  color: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{STRINGS.title}</CardTitle>
        <CardDescription>{STRINGS.description}</CardDescription>
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
