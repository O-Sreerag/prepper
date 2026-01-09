-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "upload_files" (
	"upload_file_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_paper_id" uuid,
	"user_id" uuid,
	"storage_url" text NOT NULL,
	"filename" text,
	"mime_type" text,
	"pages_count" integer,
	"file_role" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_papers" (
	"test_paper_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" text,
	"subject" text,
	"duration_minutes" integer,
	"difficulty" text,
	"description" text,
	"tags" text[],
	"status" text DEFAULT 'queued' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parsed_questions" (
	"parsed_questions_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_paper_id" uuid,
	"upload_file_id" uuid,
	"page_number" integer,
	"sequence_in_doc" integer,
	"question_text" text,
	"options" jsonb,
	"detected_answer" text,
	"detected_answer_confidence" real,
	"ocr_text" text,
	"parse_confidence" real,
	"need_review" boolean DEFAULT false,
	"review_status" text DEFAULT 'pending',
	"reviewer_id" uuid,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parsing_errors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"upload_job_id" uuid,
	"upload_file_id" uuid,
	"page_number" integer,
	"error_message" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "upload_progress" (
	"upload_job_id" uuid PRIMARY KEY NOT NULL,
	"total_files" integer DEFAULT 0,
	"total_pages" integer DEFAULT 0,
	"pages_processed" integer DEFAULT 0,
	"questions_found" integer DEFAULT 0,
	"questions_parsed" integer DEFAULT 0,
	"questions_confirmed" integer DEFAULT 0,
	"failed_count" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"exam_name" text,
	"exam_date" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "test_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid,
	"question_id" uuid,
	"selected_answer" text,
	"time_taken" integer,
	"is_correct" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"question_id" uuid,
	"note_text" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"paper_id" uuid,
	"mode" text,
	"start_time" timestamp,
	"end_time" timestamp,
	"score" double precision,
	"accuracy" double precision,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tests_mode_check" CHECK (mode = ANY (ARRAY['prep'::text, 'test'::text, 'analysis'::text]))
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"question_id" uuid,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"context" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid,
	"role" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "chat_messages_role_check" CHECK (role = ANY (ARRAY['user'::text, 'ai'::text]))
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"total_questions_solved" integer DEFAULT 0,
	"total_time_spent" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"last_active" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "upload_files" ADD CONSTRAINT "upload_files_test_paper_id_fkey" FOREIGN KEY ("test_paper_id") REFERENCES "public"."test_papers"("test_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parsed_questions" ADD CONSTRAINT "parsed_questions_test_paper_id_fkey" FOREIGN KEY ("test_paper_id") REFERENCES "public"."test_papers"("test_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parsed_questions" ADD CONSTRAINT "parsed_questions_upload_file_id_fkey" FOREIGN KEY ("upload_file_id") REFERENCES "public"."upload_files"("upload_file_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parsing_errors" ADD CONSTRAINT "parsing_errors_upload_file_id_fkey" FOREIGN KEY ("upload_file_id") REFERENCES "public"."upload_files"("upload_file_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parsing_errors" ADD CONSTRAINT "parsing_errors_upload_job_id_fkey" FOREIGN KEY ("upload_job_id") REFERENCES "public"."test_papers"("test_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_progress" ADD CONSTRAINT "upload_progress_upload_job_id_fkey" FOREIGN KEY ("upload_job_id") REFERENCES "public"."test_papers"("test_paper_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
*/