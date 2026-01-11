import { pgTable, foreignKey, uuid, text, integer, timestamp, jsonb, real, boolean, unique, date, check, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const uploadFiles = pgTable("upload_files", {
	uploadFileId: uuid("upload_file_id").defaultRandom().primaryKey().notNull(),
	testPaperId: uuid("test_paper_id"),
	userId: uuid("user_id"),
	storageUrl: text("storage_url").notNull(),
	filename: text(),
	mimeType: text("mime_type"),
	pagesCount: integer("pages_count"),
	fileRole: text("file_role").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.testPaperId],
			foreignColumns: [testPapers.testPaperId],
			name: "upload_files_test_paper_id_fkey"
		}).onDelete("cascade"),
]);

export const testPapers = pgTable("test_papers", {
	testPaperId: uuid("test_paper_id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	title: text(),
	subject: text(),
	durationMinutes: integer("duration_minutes"),
	difficulty: text(),
	description: text(),
	tags: text().array(),
	status: text().default('queued').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const parsedQuestions = pgTable("parsed_questions", {
	parsedQuestionsId: uuid("parsed_questions_id").defaultRandom().primaryKey().notNull(),
	testPaperId: uuid("test_paper_id"),
	uploadFileId: uuid("upload_file_id"),
	pageNumber: integer("page_number"),
	sequenceInDoc: integer("sequence_in_doc"),
	questionText: text("question_text"),
	options: jsonb(),
	detectedAnswer: text("detected_answer"),
	detectedAnswerConfidence: real("detected_answer_confidence"),
	ocrText: text("ocr_text"),
	parseConfidence: real("parse_confidence"),
	needReview: boolean("need_review").default(false),
	reviewStatus: text("review_status").default('pending'),
	reviewerId: uuid("reviewer_id"),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.testPaperId],
			foreignColumns: [testPapers.testPaperId],
			name: "parsed_questions_test_paper_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploadFileId],
			foreignColumns: [uploadFiles.uploadFileId],
			name: "parsed_questions_upload_file_id_fkey"
		}),
]);

export const parsingErrors = pgTable("parsing_errors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	uploadJobId: uuid("upload_job_id"),
	uploadFileId: uuid("upload_file_id"),
	pageNumber: integer("page_number"),
	errorMessage: text("error_message"),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.uploadFileId],
			foreignColumns: [uploadFiles.uploadFileId],
			name: "parsing_errors_upload_file_id_fkey"
		}),
	foreignKey({
			columns: [table.uploadJobId],
			foreignColumns: [testPapers.testPaperId],
			name: "parsing_errors_upload_job_id_fkey"
		}).onDelete("cascade"),
]);

export const uploadProgress = pgTable("upload_progress", {
	uploadJobId: uuid("upload_job_id").primaryKey().notNull(),
	totalFiles: integer("total_files").default(0),
	totalPages: integer("total_pages").default(0),
	pagesProcessed: integer("pages_processed").default(0),
	questionsFound: integer("questions_found").default(0),
	questionsParsed: integer("questions_parsed").default(0),
	questionsConfirmed: integer("questions_confirmed").default(0),
	failedCount: integer("failed_count").default(0),
	lastUpdated: timestamp("last_updated", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.uploadJobId],
			foreignColumns: [testPapers.testPaperId],
			name: "upload_progress_upload_job_id_fkey"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	email: text().notNull(),
	fullName: text("full_name"),
	examName: text("exam_name"),
	examDate: date("exam_date"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}).onDelete("cascade"),
	unique("users_email_key").on(table.email),
]);

export const testResponses = pgTable("test_responses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	testId: uuid("test_id"),
	questionId: uuid("question_id"),
	selectedAnswer: text("selected_answer"),
	timeTaken: integer("time_taken"),
	isCorrect: boolean("is_correct"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.testId],
			foreignColumns: [tests.id],
			name: "test_responses_test_id_fkey"
		}).onDelete("cascade"),
]);

export const notes = pgTable("notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	questionId: uuid("question_id"),
	noteText: text("note_text").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const tests = pgTable("tests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	paperId: uuid("paper_id"),
	mode: text(),
	startTime: timestamp("start_time", { mode: 'string' }),
	endTime: timestamp("end_time", { mode: 'string' }),
	score: doublePrecision(),
	accuracy: doublePrecision(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	check("tests_mode_check", sql`mode = ANY (ARRAY['prep'::text, 'test'::text, 'analysis'::text])`),
]);

export const flashcards = pgTable("flashcards", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	questionId: uuid("question_id"),
	front: text().notNull(),
	back: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	context: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sessionId: uuid("session_id"),
	role: text(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [chatSessions.id],
			name: "chat_messages_session_id_fkey"
		}).onDelete("cascade"),
	check("chat_messages_role_check", sql`role = ANY (ARRAY['user'::text, 'ai'::text])`),
]);

export const analytics = pgTable("analytics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	totalQuestionsSolved: integer("total_questions_solved").default(0),
	totalTimeSpent: integer("total_time_spent").default(0),
	streakDays: integer("streak_days").default(0),
	lastActive: timestamp("last_active", { mode: 'string' }).defaultNow(),
});
