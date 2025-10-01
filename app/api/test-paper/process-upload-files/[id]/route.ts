import { NextResponse } from "next/server"

import { createClient } from "@/services/supabase/server"
import { processQuestionPaperWithGemini } from "@/lib/gemini"
import { SUPABASE_DB_BUCKET_CONSTANTS, SUPABASE_DB_TABLES_CONSTANTS } from "@/constants"

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const testPaperId = params.id

    try {
        // 1. Fetch test paper
        const { data: testPaper } = await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.test_papers).select("*").eq("test_paper_id", testPaperId).single()
        if (!testPaper) throw new Error("Test paper not found")

        await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.test_papers).update({ status: "processing", last_error: null }).eq("test_paper_id", testPaperId)

        // 2. Fetch question file from storage
        const { data: fileMeta } = await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.upload_files)
            .select("*")
            .eq("test_paper_id", testPaperId)
            .eq("file_role", "questions")
            .single()
        if (!fileMeta) throw new Error("Question file not found")

        const fileRes = await supabase.storage.from(SUPABASE_DB_BUCKET_CONSTANTS.uploads).download(fileMeta.storage_url)

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
            test_paper_id: testPaperId,
            sequence_in_doc: i + 1,
            question_text: q.question,
            options: { options: q.options },
            detected_answer: q.answer,
            parse_confidence: 0.9,
            review_status: 'pending',
        }))
        await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.parsed_questions).insert(questionsToInsert)

        // 5. Update job status
        await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.test_papers).update({ status: "review" }).eq("test_paper_id", testPaperId)

        return NextResponse.json({ success: true }) 
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        console.error("Processing failed:", message)
        await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.test_papers).update({ status: "failed", last_error: message }).eq("test_paper_id", testPaperId)
        return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
}
