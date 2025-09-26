import { DashboardLayout } from "@/components/dashboard-layout"
import { GoalsOverview } from "@/components/goals-overview"

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <GoalsOverview />
    </DashboardLayout>
  )
}
