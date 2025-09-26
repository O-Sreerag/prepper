import { DashboardLayout } from "@/components/dashboard-layout"
import { TestsOverview } from "@/components/tests-overview"

export default function TestsPage() {
  return (
    <DashboardLayout>
      <TestsOverview />
    </DashboardLayout>
  )
}
