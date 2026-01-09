import { relations } from "drizzle-orm/relations";
import { testPapers, uploadFiles, parsedQuestions, parsingErrors, uploadProgress, users, tests, testResponses, chatSessions, chatMessages } from "./schema";

export const uploadFilesRelations = relations(uploadFiles, ({one, many}) => ({
	testPaper: one(testPapers, {
		fields: [uploadFiles.testPaperId],
		references: [testPapers.testPaperId]
	}),
	parsedQuestions: many(parsedQuestions),
	parsingErrors: many(parsingErrors),
}));

export const testPapersRelations = relations(testPapers, ({many}) => ({
	uploadFiles: many(uploadFiles),
	parsedQuestions: many(parsedQuestions),
	parsingErrors: many(parsingErrors),
	uploadProgresses: many(uploadProgress),
}));

export const parsedQuestionsRelations = relations(parsedQuestions, ({one}) => ({
	testPaper: one(testPapers, {
		fields: [parsedQuestions.testPaperId],
		references: [testPapers.testPaperId]
	}),
	uploadFile: one(uploadFiles, {
		fields: [parsedQuestions.uploadFileId],
		references: [uploadFiles.uploadFileId]
	}),
}));

export const parsingErrorsRelations = relations(parsingErrors, ({one}) => ({
	uploadFile: one(uploadFiles, {
		fields: [parsingErrors.uploadFileId],
		references: [uploadFiles.uploadFileId]
	}),
	testPaper: one(testPapers, {
		fields: [parsingErrors.uploadJobId],
		references: [testPapers.testPaperId]
	}),
}));

export const uploadProgressRelations = relations(uploadProgress, ({one}) => ({
	testPaper: one(testPapers, {
		fields: [uploadProgress.uploadJobId],
		references: [testPapers.testPaperId]
	}),
}));

export const usersRelations = relations(users, ({one}) => ({
	usersInAuth: one(users, {
		fields: [users.id],
		references: [users.id]
	}),
}));

export const usersInAuthRelations = relations(users, ({many}) => ({
	users: many(users),
}));

export const testResponsesRelations = relations(testResponses, ({one}) => ({
	test: one(tests, {
		fields: [testResponses.testId],
		references: [tests.id]
	}),
}));

export const testsRelations = relations(tests, ({many}) => ({
	testResponses: many(testResponses),
}));

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	chatSession: one(chatSessions, {
		fields: [chatMessages.sessionId],
		references: [chatSessions.id]
	}),
}));

export const chatSessionsRelations = relations(chatSessions, ({many}) => ({
	chatMessages: many(chatMessages),
}));