import { DashboardLayout } from "../_components/dashboard-layout"
import { GoalsOverview } from "./components/goals-overview"

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

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <GoalsOverview goals={mockGoals} />
    </DashboardLayout>
  )
}
