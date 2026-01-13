import { appRouter } from "@/server";
import { TestPapersList } from "@/app/(protected)/(pages)/test-papers/_components"
import { createClient } from "@/services/supabase/server"

export default async function TestPapersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const caller = appRouter.createCaller({ user } as any);

  const initialTestPapers = await caller.testPaper.getAll()

  return (
    <TestPapersList initialTestPapers={initialTestPapers} />
  )
}