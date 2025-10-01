import { NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"

// This is a simplified transaction-like process.
// In a real production environment, this should be handled in a single atomic database transaction
// using a Postgres function (RPC) to ensure data integrity.
export async function POST(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const supabase = createClient()
  const { jobId } = params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  if (!jobId) {
    return NextResponse.json({ success: false, error: "Job ID is required." }, { status: 400 })
  }

  try {
    // 1. Fetch the original upload job details
    const { data: job, error: jobError } = await supabase
      .from("upload_jobs")
      .select("*")
      .eq("id", jobId)
      .single()

    if (jobError || !job) {
      throw new Error("Upload job not found.")
    }

    // 2. Fetch all confirmed questions for this job
    const { data: confirmedQuestions, error: questionsError } = await supabase
      .from("parsed_questions")
      .select("*")
      .eq("upload_job_id", jobId)
      .eq("review_status", "confirmed")

    if (questionsError) {
      throw new Error(`Failed to fetch confirmed questions: ${questionsError.message}`)
    }

    if (!confirmedQuestions || confirmedQuestions.length === 0) {
      return NextResponse.json({ success: false, error: "No confirmed questions to publish." }, { status: 400 })
    }

    // 3. Create the final Question Paper record in the canonical table
    const { data: finalPaper, error: paperError } = await supabase
      .from("question_papers")
      .insert({
        user_id: user.id,
        title: job.title,
        source: `Uploaded via job ${job.id}`, // Add some trace
        total_questions: confirmedQuestions.length,
        // other fields like subject, difficulty etc. would go here if they exist in the canonical table
      })
      .select()
      .single()

    if (paperError || !finalPaper) {
      throw new Error(`Failed to create final question paper: ${paperError?.message}`)
    }

    // 4. Create the final Question records for the new paper
    const questionsToInsert = confirmedQuestions.map(q => ({
      paper_id: finalPaper.id,
      question_text: q.question_text,
      options: q.options, // Assuming the structure matches
      correct_answer: q.detected_answer,
      // explanation would go here if we had it
    }))

    const { error: finalQuestionsError } = await supabase
      .from("questions")
      .insert(questionsToInsert)

    if (finalQuestionsError) {
      // Attempt to clean up the created paper if questions fail
      await supabase.from("question_papers").delete().eq("id", finalPaper.id);
      throw new Error(`Failed to insert final questions: ${finalQuestionsError.message}`)
    }

    // 5. Update the upload job status to 'published'
    const { error: updateJobError } = await supabase
      .from("upload_jobs")
      .update({ status: "published" })
      .eq("id", jobId)

    if (updateJobError) {
      // This is not ideal, but we log it. The paper is live, but the job status is wrong.
      console.error(`Failed to update job status to published for job ${jobId}: ${updateJobError.message}`);
    }

    return NextResponse.json({ success: true, message: "Question paper published successfully.", paperId: finalPaper.id })
  } catch (error) {
    console.error("Confirm All API Error:", error)
    // If something fails, mark the job as 'failed' to prevent re-processing
    await supabase.from("upload_jobs").update({ status: "failed" }).eq("id", jobId)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      { success: false, error: `Failed to publish question paper: ${errorMessage}` },
      { status: 500 },
    )
  }
}
