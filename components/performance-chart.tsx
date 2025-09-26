"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export function PerformanceChart() {
  // Mock data for the chart
  const data = [
    { week: "Week 1", accuracy: 65, questions: 45 },
    { week: "Week 2", accuracy: 72, questions: 67 },
    { week: "Week 3", accuracy: 78, questions: 89 },
    { week: "Week 4", accuracy: 85, questions: 112 },
    { week: "Week 5", accuracy: 87, questions: 134 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.trendingUp className="h-5 w-5 text-green-500" />
          Performance Trends
        </CardTitle>
        <CardDescription>Your accuracy and question-solving progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.week}</span>
                  <span className="text-muted-foreground">
                    {item.accuracy}% • {item.questions} questions
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-chart-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.questions / 150) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span>Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-2 rounded-full" />
              <span>Questions Solved</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
