import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { router, protectedProcedure } from "@/server/trpc"
import { db } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { testPapers, uploadFiles, parsedQuestions } from "@/db/schema";

export const testPaperRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const papers = await db
        .select({
          testPaperId: testPapers.testPaperId,
          userId: testPapers.userId,
          title: testPapers.title,
          subject: testPapers.subject,
          durationMinutes: testPapers.durationMinutes,
          difficulty: testPapers.difficulty,
          description: testPapers.description,
          tags: testPapers.tags,
          status: testPapers.status,
          createdAt: testPapers.createdAt,
          updatedAt: testPapers.updatedAt,
          uploadFiles: {
            uploadFileId: uploadFiles.uploadFileId,
            storageUrl: uploadFiles.storageUrl,
            filename: uploadFiles.filename,
            mimeType: uploadFiles.mimeType,
            fileRole: uploadFiles.fileRole,
          }
        })
        .from(testPapers)
        .leftJoin(uploadFiles, eq(testPapers.testPaperId, uploadFiles.testPaperId))
        .where(eq(testPapers.userId, ctx.user.id))
        .orderBy(desc(testPapers.createdAt));

      return papers;
    } catch (err) {
      console.error("testPaper.getAll error", err);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch test papers",
      });
    }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const paper = await db
          .select({
            testPaperId: testPapers.testPaperId,
            userId: testPapers.userId,
            title: testPapers.title,
            subject: testPapers.subject,
            durationMinutes: testPapers.durationMinutes,
            difficulty: testPapers.difficulty,
            description: testPapers.description,
            tags: testPapers.tags,
            status: testPapers.status,
            createdAt: testPapers.createdAt,
            updatedAt: testPapers.updatedAt,
            uploadFiles: {
              uploadFileId: uploadFiles.uploadFileId,
              storageUrl: uploadFiles.storageUrl,
              filename: uploadFiles.filename,
              mimeType: uploadFiles.mimeType,
              fileRole: uploadFiles.fileRole,
            },
            parsedQuestions: {
              parsedQuestionsId: parsedQuestions.parsedQuestionsId,
              questionText: parsedQuestions.questionText,
              options: parsedQuestions.options,
              pageNumber: parsedQuestions.pageNumber,
              reviewStatus: parsedQuestions.reviewStatus,
              needReview: parsedQuestions.needReview,
            }
          })
          .from(testPapers)
          .leftJoin(uploadFiles, eq(testPapers.testPaperId, uploadFiles.testPaperId))
          .leftJoin(parsedQuestions, eq(testPapers.testPaperId, parsedQuestions.testPaperId))
          .where(and(eq(testPapers.testPaperId, input.id), eq(testPapers.userId, ctx.user.id)))
          .limit(1);

        if (!paper || paper.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Test paper not found",
          });
        }

        // Transform the flat result into nested structure
        const testPaper = {
          ...paper[0],
          uploadFiles: paper[0].uploadFiles?.uploadFileId ? paper[0].uploadFiles : null,
          parsed_questions: paper
            .filter(row => row.parsedQuestions?.parsedQuestionsId)
            .map(row => row.parsedQuestions),
        };

        return testPaper;
      } catch (err) {
        console.error("testPaper.getById error", err);

        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch test paper",
        });
      }
    }),
});