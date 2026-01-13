import { NextResponse } from "next/server"

import { createClient } from "@/services/supabase/server"
import { SUPABASE_DB_TABLES_CONSTANTS } from "@/constants"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: testPaper, error } = await supabase
      .from(SUPABASE_DB_TABLES_CONSTANTS.test_papers)
      .select(`
        *,
        upload_files (
          upload_file_id,
          filename,
          mime_type,
          storage_url,
          file_role,
          pages_count
        ),
        parsed_questions (
          parsed_questions_id,
          question_text,
          options,
          page_number,
          review_status,
          need_review
        )
      `)
      .eq("test_paper_id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching test paper:", error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: "Test paper not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch test paper.")
    }

    return NextResponse.json({ success: true, data: testPaper })
  } catch (error) {
    console.error("Fetch Test Paper API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      { success: false, error: `Failed to fetch test paper: ${errorMessage}` },
      { status: 500 },
    )
  }
}
