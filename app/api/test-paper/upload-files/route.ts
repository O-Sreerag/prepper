import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { createClient } from "@/services/supabase/server";
import { uploadSchema } from "@/app/(protected)/test-papers/_schemas";
import { formDataToObject } from "@/lib/utils";
import { SUPABASE_DB_BUCKET_CONSTANTS, SUPABASE_DB_TABLES_CONSTANTS } from "@/constants";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const obj = formDataToObject(formData);

    const parsed = uploadSchema.safeParse(obj);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, subject, duration, difficulty, description, tags } = parsed.data;

    const questionFile = formData.get("questionFile") as File | null;
    const answerFile = formData.get("answerFile") as File | null;

    if (!questionFile) {
      return NextResponse.json({ success: false, error: "Missing question file" }, { status: 400 });
    }

    // --- DB Insert ---
    const { data: testPaperData, error: testPaperError } = await supabase
      .from(SUPABASE_DB_TABLES_CONSTANTS.test_papers)
      .insert({
        user_id: user.id,
        title,
        subject,
        duration_minutes: duration ? parseInt(duration, 10) : null,
        difficulty: difficulty || null,
        description: description || null,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        status: "queued",
      })
      .select()
      .single();

    if (testPaperError) throw testPaperError;
    const testPaperId = testPaperData.test_paper_id;

    // --- File Upload ---
    const questionPath = `${user.id}/${testPaperId}/${uuidv4()}-${questionFile.name}`;
    const { error: qErr } = await supabase.storage.from(SUPABASE_DB_BUCKET_CONSTANTS.uploads).upload(questionPath, questionFile);
    if (qErr) throw qErr;

    await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.upload_files).insert({
      test_paper_id: testPaperId,
      user_id: user.id,
      storage_url: questionPath,
      filename: questionFile.name,
      mime_type: questionFile.type,
      file_role: "questions",
    });

    if (answerFile) {
      const answerPath = `${user.id}/${testPaperId}/${uuidv4()}-${answerFile.name}`;
      const { error: aErr } = await supabase.storage.from(SUPABASE_DB_BUCKET_CONSTANTS.uploads).upload(answerPath, answerFile);
      if (!aErr) {
        await supabase.from(SUPABASE_DB_TABLES_CONSTANTS.upload_files).insert({
          test_paper_id: testPaperId,
          user_id: user.id,
          storage_url: answerPath,
          filename: answerFile.name,
          mime_type: answerFile.type,
          file_role: "answers",
        });
      }
    }

    return NextResponse.json({ success: true, test_paper_id: testPaperId });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
