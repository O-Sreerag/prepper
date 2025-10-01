import { NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const supabase = createClient()
  const { jobId } = params

  if (!jobId) {
    return NextResponse.json({ success: false, error: "Job ID is required." }, { status: 400 })
  }

  try {
    const { data: questions, error } = await supabase
      .from("parsed_questions")
      .select("*")
      .eq("upload_job_id", jobId)
      .order("sequence_in_doc", { ascending: true })

    if (error) {
      console.error("Error fetching parsed questions:", error)
      throw new Error("Failed to fetch parsed questions.")
    }

    return NextResponse.json({ success: true, data: questions })
  } catch (error) {
    console.error("Fetch Parsed Questions API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      { success: false, error: `Failed to fetch questions: ${errorMessage}` },
      { status: 500 },
    )
  }
}
