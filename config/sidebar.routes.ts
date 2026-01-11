import {
  BarChart,
  BookOpen,
  FileText,
  Brain,
  TrendingUp,
  Target,
  Calendar,
  Zap,
} from "lucide-react"

import { ROUTES } from "@/config"

export const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: BarChart,
  },
  {
    id: "test-papers",
    name: "Test Papers",
    href: ROUTES.TEST_PAPERS.ROOT,
    icon: BookOpen,
    // subItems: [
    //   {
    //     id: "test-papers-all",
    //     name: "All Papers",
    //     href: ROUTES.TEST_PAPERS.ROOT,
    //   },
    //   {
    //     id: "test-papers-create",
    //     name: "Create Paper",
    //     href: ROUTES.TEST_PAPERS.CREATE,
    //   },
    // ],
  },
  {
    id: "mock-tests",
    name: "Mock Tests",
    href: ROUTES.MOCK_TESTS,
    icon: FileText,
  },
  {
    id: "flashcards",
    name: "Flashcards",
    href: ROUTES.FLASHCARDS,
    icon: Brain,
  },
  {
    id: "analytics",
    name: "Analytics",
    href: ROUTES.ANALYTICS,
    icon: TrendingUp,
  },
  {
    id: "goals",
    name: "Goals",
    href: ROUTES.GOALS,
    icon: Target,
  },
  {
    id: "planner",
    name: "Planner",
    href: ROUTES.PLANNER,
    icon: Calendar,
  },
  {
    id: "ai-tutor",
    name: "AI Tutor",
    href: ROUTES.AI_TUTOR,
    icon: Zap,
  },
]
