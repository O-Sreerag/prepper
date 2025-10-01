import { NextResponse } from "next/server"

import { createClient } from "@/services/supabase/server"
import { processQuestionPaperWithGemini } from "@/lib/gemini"

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const uploadJobId = params.id

    try {
        // 1. Fetch job
        const { data: job } = await supabase.from("upload_jobs").select("*").eq("id", uploadJobId).single()
        if (!job) throw new Error("Job not found")

        await supabase.from("upload_jobs").update({ status: "processing", last_error: null }).eq("id", uploadJobId)

        // 2. Fetch question file from storage
        const { data: fileMeta } = await supabase.from("upload_files")
            .select("*")
            .eq("upload_job_id", uploadJobId)
            .eq("file_role", "questions")
            .single()
        if (!fileMeta) throw new Error("Question file not found")

        const fileRes = await supabase.storage.from("uploads").download(fileMeta.storage_url)

        if (fileRes.error || !fileRes.data) {
            throw new Error(fileRes.error?.message || "Failed to download file")
        }

        // Convert Blob to Buffer
        const arrayBuffer = await fileRes.data.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 3. Process with Gemini AI using helper
        const parsedData = await processQuestionPaperWithGemini(buffer, fileMeta.mime_type)

        // 4. Insert parsed questions
        const questionsToInsert = parsedData.map((q, i) => ({
            upload_job_id: uploadJobId,
            sequence_in_doc: i + 1,
            question_text: q.question,
            options: { options: q.options },
            detected_answer: q.answer,
            parse_confidence: 0.9,
            review_status: 'pending',
        }))
        await supabase.from("parsed_questions").insert(questionsToInsert)

        // 5. Update job status
        await supabase.from("upload_jobs").update({ status: "review" }).eq("id", uploadJobId)

        return NextResponse.json({ success: true })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        console.error("Processing failed:", message)
        await supabase.from("upload_jobs").update({ status: "failed", last_error: message }).eq("id", uploadJobId)
        return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
}
