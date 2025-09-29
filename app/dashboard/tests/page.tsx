import { DashboardLayout } from "../components/dashboard-layout"
import { TestsOverview } from "./components/tests-overview"

const mockTests = [
  {
    id: 1,
    title: "Physics Mock Test #12",
    subject: "Physics",
    questions: 60,
    duration: 180,
    difficulty: "Medium",
    lastAttempt: "2 days ago",
    bestScore: 78,
    attempts: 3,
    status: "completed",
  },
  {
    id: 2,
    title: "Mathematics Practice Set #8",
    subject: "Mathematics",
    questions: 45,
    duration: 120,
    difficulty: "Hard",
    lastAttempt: "1 week ago",
    bestScore: 85,
    attempts: 2,
    status: "completed",
  },
  {
    id: 3,
    title: "Chemistry Organic Compounds",
    subject: "Chemistry",
    questions: 50,
    duration: 150,
    difficulty: "Easy",
    lastAttempt: null,
    bestScore: null,
    attempts: 0,
    status: "new",
  },
]

export default function TestsPage() {
  return (
    <DashboardLayout>
      <TestsOverview tests={mockTests} />
    </DashboardLayout>
  )
}
