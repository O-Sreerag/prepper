import { DashboardLayout } from "../components/dashboard-layout"
import { StudyMode } from "./components/study-mode"

const mockQuestion = {
  id: 1,
  question:
    "A particle moves in a straight line with constant acceleration. If it covers 20m in the first 2 seconds and 60m in the next 4 seconds, find the initial velocity and acceleration.",
  options: ["u = 5 m/s, a = 5 m/s²", "u = 2 m/s, a = 8 m/s²", "u = 0 m/s, a = 10 m/s²", "u = 3 m/s, a = 7 m/s²"],
  correctAnswer: 0,
  explanation:
    "Using kinematic equations: s = ut + ½at². For first 2s: 20 = u(2) + ½a(4). For next 4s: 60 = u(4) + ½a(16) - [u(2) + ½a(4)]. Solving these equations gives u = 5 m/s and a = 5 m/s².",
  subject: "Physics",
  topic: "Kinematics",
  difficulty: "Medium",
}

export default function StudyPage() {
  return (
    <DashboardLayout>
      <StudyMode question={mockQuestion} />
    </DashboardLayout>
  )
}
