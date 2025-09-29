import { DashboardLayout } from "../components/dashboard-layout"
import { FlashcardsOverview } from "./components/flashcards-overview"

const mockDecks = [
  {
    id: 1,
    title: "Physics Formulas",
    subject: "Physics",
    cardCount: 45,
    dueCount: 12,
    masteredCount: 28,
    lastStudied: "2 hours ago",
    difficulty: "Medium",
    color: "bg-blue-100 dark:bg-blue-900",
  },
  {
    id: 2,
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    cardCount: 67,
    dueCount: 23,
    masteredCount: 31,
    lastStudied: "1 day ago",
    difficulty: "Hard",
    color: "bg-green-100 dark:bg-green-900",
  },
  {
    id: 3,
    title: "Calculus Concepts",
    subject: "Mathematics",
    cardCount: 38,
    dueCount: 8,
    masteredCount: 25,
    lastStudied: "3 days ago",
    difficulty: "Easy",
    color: "bg-purple-100 dark:bg-purple-900",
  },
]

export default function FlashcardsPage() {
  return (
    <DashboardLayout>
      <FlashcardsOverview decks={mockDecks} />
    </DashboardLayout>
  )
}
