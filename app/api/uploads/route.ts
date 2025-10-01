import { NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"

export async function GET(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: jobs, error } = await supabase
      .from("upload_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching upload jobs:", error)
      throw new Error("Failed to fetch upload jobs.")
    }

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error("Fetch Upload Jobs API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      { success: false, error: `Failed to fetch jobs: ${errorMessage}` },
      { status: 500 },
    )
  }
}
