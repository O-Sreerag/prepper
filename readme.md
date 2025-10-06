# README — Exam Prep App: AI + Upload → Parse → Review → Publish

> Complete step-by-step README for the upload/parsing workflow, APIs, realtime UX, worker flow, matching logic, error handling, and DB structure. Includes SQL DDL for the staging tables.

---

## Overview

This README describes how to implement the **upload → OCR/parse → review → confirm → publish** workflow for MCQ-only question papers using a multimodal LLM (Google Gemini Vision + Gemini Pro). It includes: technical flow, API contracts, realtime events, worker pseudocode, and the database structure (staging tables + canonical tables).

This workflow adds a **staging layer** (upload_jobs, upload_files, ocr_pages, parsed_questions, etc.) and keeps your existing canonical tables (`question_papers`, `questions`) as the final published source.

---

## Prerequisites

* Postgres (Supabase recommended)
* Node.js (or backend of choice)
* Worker queue (BullMQ/Redis, Cloud Tasks, or simple background worker)
* Google Gemini API key (Vision + Pro)
* File storage (Supabase Storage / S3)
* Optional: pgvector (for future retrieval features)

Environment variables (example):

```
DATABASE_URL=postgres://...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
S3_BUCKET=...
REDIS_URL=...
```

---

## High-level architecture

* **Frontend**: Upload modal, live review pane, confirm actions, test creation UI.
* **API server**: Accept uploads, create upload_job and upload_files, return job id.
* **Worker**: For each job: OCR pages → parse to questions → attempt answer-key matching → write parsed_questions → emit realtime events.
* **Realtime**: Supabase Realtime / WebSockets / Server-Sent Events (SSE) to stream parsed rows and progress.
* **Finalization**: User confirms parsed items → worker writes to canonical `question_papers` + `questions`.

---

## UI Flow (step-by-step)

1. User clicks **Add Question Paper** → open Upload Modal.
2. Upload Modal fields:

   * File input A: Question Paper pages (multi-file allowed)
   * File input B: Answer Sheet pages (multi-file allowed)
   * Title, Subject, Duration (minutes), Difficulty, Description, Tags
   * Submit → frontend calls `POST /api/upload`.
3. Response: `{ upload_job_id }`. UI opens Job Card with progress bar and subscribes to realtime channel for that job.
4. Worker starts processing: UI shows streaming parsed questions one-by-one in a Review Pane.

   * Each parsed question shows: text, options, detected_answer (if any), parse_confidence, edit controls, confirm single item, mark for review.
5. User can `Confirm` single, `Edit + Confirm`, or `Confirm All`.
6. When user confirms all (finalize), the job is published; `question_papers.status` becomes `published` and `questions` rows are created/updated.

---

## Backend Flow (worker logic — summary)

1. Worker loads `upload_job` by id.
2. For each `upload_file` (question & answer files):

   * Split into pages (if PDF)
   * Call Gemini Vision (OCR) for each page → store `ocr_pages`
   * For a question page: run a parsing prompt in Gemini Pro to extract one-or-many question blocks (Q text, options, numbering)
   * For an answer-sheet page: extract mappings like `Q1: B` → store in-memory or as `answer_key` rows
3. For each parsed question block: create `parsed_questions` row with detected_answer if matched.
4. Attempt to match parsed question to answer key using numbering or fuzzy matching.
5. Update `upload_progress` and emit realtime events.
6. If confidence low, mark `need_review=true`.
7. Wait for user review/confirm actions. When confirmed, create `questions` rows and a `question_papers` final record (or link to existing), and insert mapping into `parsed_to_questions`.

---

## API Endpoints (suggested)

```
POST   /api/uploads                        -- multipart/form-data (files + metadata) => { upload_job_id }
GET    /api/uploads/:jobId                 -- job status & summary
GET    /api/uploads/:jobId/parsed?cursor=   -- paginated parsed_questions (server-side cursor)
POST   /api/uploads/:jobId/parsed/:id/confirm -- confirm single parsed question => creates question row
POST   /api/uploads/:jobId/confirm-all     -- bulk confirm -> publish paper and create questions
WS/SSE /api/uploads/:jobId/stream          -- realtime stream: parsed_question, progress_update, parsing_error, job_complete
```

### Sample realtime event (parsed_question)

```json
{
  "type": "parsed_question",
  "payload": {
    "id": "uuid",
    "sequence_in_doc": 5,
    "question_text": "What is Newton's 3rd law?",
    "options": ["A...","B...","C...","D..."],
    "detected_answer": "C",
    "parse_confidence": 0.86,
    "need_review": false
  }
}
```

### Sample realtime event (progress_update)

```json
{
  "type": "progress_update",
  "payload": {
    "pages_processed": 4,
    "total_pages": 10,
    "questions_found": 48,
    "questions_parsed": 40,
    "questions_confirmed": 0
  }
}
```

---

## DB Structure — table summary (canonical + staging)

Below is a compact reference of the tables and their most important columns.

### Canonical (final) tables — source of truth

* **users**: `id, email, full_name, exam_name, exam_date`
* **question_papers**: `id, user_id, title, source, total_questions, created_at`
* **questions**: `id, paper_id, question_text, options (jsonb), correct_answer, explanation, created_at`
* **tests**: `id, user_id, paper_id, mode, start_time, end_time, score, accuracy`
* **test_responses**: `id, test_id, question_id, selected_answer, time_taken, is_correct`
* **notes**, **flashcards**, **chat_sessions**, **chat_messages**, **analytics**, **goals** (as discussed earlier)

### Staging tables (new: upload + parse + progress)

* **upload_jobs**: job metadata & overall status `id, user_id, title, subject, duration_minutes, difficulty, tags[], status`
* **upload_files**: files per job `id, upload_job_id, storage_url, filename, pages_count, file_role ('questions'|'answers')`
* **ocr_pages**: OCR output `id, upload_file_id, page_number, raw_text, ocr_confidence`
* **parsed_questions**: parsed drafts `id, upload_job_id, upload_file_id, page_number, sequence_in_doc, question_text, options(jsonb), detected_answer, parse_confidence, need_review, review_status`
* **parsing_errors**: capture parse failure details `id, upload_job_id, upload_file_id, page_number, error_message, details(jsonb)`
* **parsed_to_questions**: mapping from parsed item to final question `id, parsed_question_id, question_id, confirmed_by, confirmed_at, action`
* **upload_progress**: aggregated progress snapshot per job
* **tags**, **question_paper_tags**, **paper_versions** (optional)

---

## SQL: CREATE statements for staging tables (run as migration)

> Paste these into a single migration file and run them against your Supabase/Postgres DB.

```sql
-- Upload jobs
CREATE TABLE upload_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text,
  subject text,
  duration_minutes integer,
  difficulty text,
  description text,
  tags text[],
  status text NOT NULL DEFAULT 'queued', -- queued, processing, review, failed, published
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Files in a job
CREATE TABLE upload_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_job_id uuid REFERENCES upload_jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  storage_url text NOT NULL,
  filename text,
  mime_type text,
  pages_count int,
  file_role text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- OCR per page
CREATE TABLE ocr_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_file_id uuid REFERENCES upload_files(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  raw_text text,
  ocr_confidence real,
  processed boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Parsed questions
CREATE TABLE parsed_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_job_id uuid REFERENCES upload_jobs(id) ON DELETE CASCADE,
  upload_file_id uuid REFERENCES upload_files(id),
  page_number integer,
  sequence_in_doc integer,
  question_text text,
  options jsonb,
  detected_answer text,
  detected_answer_confidence real,
  ocr_text text,
  parse_confidence real,
  need_review boolean DEFAULT false,
  review_status text DEFAULT 'pending',
  reviewer_id uuid,
  reviewed_at timestamp,
  created_at timestamp DEFAULT now()
);

-- Parsing errors
CREATE TABLE parsing_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_job_id uuid REFERENCES upload_jobs(id) ON DELETE CASCADE,
  upload_file_id uuid REFERENCES upload_files(id),
  page_number integer,
  error_message text,
  details jsonb,
  created_at timestamp DEFAULT now()
);

-- Mapping parsed -> canonical question
CREATE TABLE parsed_to_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parsed_question_id uuid REFERENCES parsed_questions(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE SET NULL,
  confirmed_by uuid REFERENCES users(id),
  confirmed_at timestamp DEFAULT now(),
  action text CHECK (action IN ('created','updated','skipped')) DEFAULT 'created'
);

-- Progress snapshot
CREATE TABLE upload_progress (
  upload_job_id uuid PRIMARY KEY REFERENCES upload_jobs(id) ON DELETE CASCADE,
  total_files int DEFAULT 0,
  total_pages int DEFAULT 0,
  pages_processed int DEFAULT 0,
  questions_found int DEFAULT 0,
  questions_parsed int DEFAULT 0,
  questions_confirmed int DEFAULT 0,
  failed_count int DEFAULT 0,
  last_updated timestamp DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE
);

CREATE TABLE question_paper_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id uuid REFERENCES question_papers(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE
);

-- Optional: paper versions
CREATE TABLE paper_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id uuid REFERENCES question_papers(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamp DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Suggested indexes
CREATE INDEX idx_parsed_questions_job ON parsed_questions(upload_job_id);
CREATE INDEX idx_ocr_pages_file_page ON ocr_pages(upload_file_id, page_number);
CREATE INDEX idx_upload_jobs_user ON upload_jobs(user_id);
```

---

## Worker pseudocode (Node.js / Typescript style)

```ts
async function processUploadJob(uploadJobId) {
  const job = await db.getUploadJob(uploadJobId);
  await db.updateUploadJobStatus(job.id, 'processing');

  const files = await db.getUploadFiles(job.id);
  const answerKey = await extractAnswerKey(files.filter(f => f.file_role === 'answers'));

  for (const file of files.filter(f => f.file_role === 'questions')) {
    const pages = await splitPdfToPages(file.storage_url);
    for (const [i,page] of pages.entries()) {
      const ocr = await geminiVision.ocr(page);
      await db.insertOcrPage(file.id, i+1, ocr.text, ocr.confidence);

      // Parse questions from this page
      const parsedBlocks = await geminiPro.parseQuestions(ocr.text);
      for (const [seq, block] of parsedBlocks.entries()) {
        const detectedAnswer = matchAnswer(block, answerKey);
        const parseConfidence = block.confidence || estimateConfidence(block);

        await db.insertParsedQuestion({
          upload_job_id: job.id,
          upload_file_id: file.id,
          page_number: i+1,
          sequence_in_doc: seq+1,
          question_text: block.question,
          options: block.options,
          detected_answer,
          parse_confidence: parseConfidence,
          need_review: parseConfidence < 0.7 || !detectedAnswer
        });

        // update progress and emit realtime event
        await db.incrementProgress(job.id, { questions_parsed: 1 });
        realtime.emit(job.id, 'parsed_question', { /* parsed data */ });
      }
    }
  }

  await db.updateUploadJobStatus(job.id, 'review');
  realtime.emit(job.id, 'job_complete', { upload_job_id: job.id });
}
```

---

## Matching algorithm (answer key ↔ parsed question)

1. **Numbered answer sheet**: map by number (Q1 -> parsed.sequence, or detect numbering in parsed text).
2. **Text-similarity fallback**: compute embeddings (or TF-IDF + cosine) between parsed question and answer-key context; choose highest similarity.
3. **Confidence thresholds**: if `match_confidence < 0.6` → mark `need_review = true` and store a `parsing_error` entry.
4. **Ambiguities**: surface ambiguous matches to reviewer with a side-by-side UI: parsed question vs answer-key snippet.

---

## Error handling & retries

* Retry OCR/parse calls up to 3x with exponential backoff.
* If OCR page fails permanently → flag page in `parsing_errors` and notify user to re-upload or correct.
* If Gemini times out → retry; if repeated failures, set job status = `failed`.
* Partial success: always persist parsed items even if some pages fail. Let the user confirm the rest.

---

## Pagination & performance suggestions

* Use cursor-based pagination for parsed items (cursor = sequence_in_doc or created_at).
* Virtualize large lists on the frontend (react-window/react-virtualized).
* Batch inserts to `parsed_questions` for speed.
* Throttle Gemini calls to respect rate limits. Use a queue and worker concurrency tuning.

---

## Client-side UX notes (smoothness checklist)

* Stream parsed questions as they arrive (don't wait for full job completion).
* Show confidence score and `need_review` badge for each parsed question.
* Allow inline edit (auto-save to parsed_questions row) before confirm.
* Provide bulk actions (Confirm All / Export / Retry Failed Pages).
* Keep job history + versioning so users can rollback mistakes.

---

## Next steps (actionable)

1. Run the SQL migration above to create staging tables.
2. Implement `POST /api/uploads` and file storage.
3. Implement worker (OCR -> parse -> write parsed_questions) skeleton.
4. Implement realtime subscription on the frontend and live review pane.
5. Implement confirm endpoints to move parsed -> final canonical `questions` and `question_papers`.
6. Add admin review dashboard for low-confidence jobs.

---

*End of README*
