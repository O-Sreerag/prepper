import { NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"

export async function POST(
  request: Request,
  { params }: { params: { jobId: string; questionId: string } }
) {
  const supabase = createClient()
  const { jobId, questionId } = params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  if (!jobId || !questionId) {
    return NextResponse.json({ success: false, error: "Job ID and Question ID are required." }, { status: 400 })
  }

  try {
    const body = await request.json();
    const { question_text, options, detected_answer } = body;

    // Validate that we have the data we need to update
    if (!question_text || !options || !detected_answer) {
        return NextResponse.json({ success: false, error: "Missing question data in request body." }, { status: 400 });
    }

    const { error } = await supabase
      .from("parsed_questions")
      .update({
        question_text,
        options: { options: options }, // Match jsonb structure
        detected_answer,
        review_status: 'confirmed',
        reviewer_id: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", questionId)
      .eq("upload_job_id", jobId)

    if (error) {
      console.error("Error confirming parsed question:", error)
      throw new Error("Failed to confirm parsed question.")
    }

    return NextResponse.json({ success: true, message: "Question confirmed successfully." })
  } catch (error) {
    console.error("Confirm Question API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      { success: false, error: `Failed to confirm question: ${errorMessage}` },
      { status: 500 },
    )
  }
}
