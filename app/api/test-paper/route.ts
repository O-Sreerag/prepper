import { NextResponse } from "next/server"

import { createClient } from "@/services/supabase/server"
import { SUPABASE_DB_TABLES_CONSTANTS } from "@/constants"

export async function GET(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: testPapers, error } = await supabase
      .from(SUPABASE_DB_TABLES_CONSTANTS.test_papers)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching test papers:", error)
      throw new Error("Failed to fetch test papers.")
    }

    return NextResponse.json({ success: true, data: testPapers })
  } catch (error) {
    console.error("Fetch Test Papers API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      { success: false, error: `Failed to fetch test papers: ${errorMessage}` },
      { status: 500 },
    )
  }
}
