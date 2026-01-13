import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { router, protectedProcedure } from "@/server/trpc"
import { db } from "@/db";
import { eq, desc, and, sql, ilike } from "drizzle-orm";
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

  getQuestions: protectedProcedure
    .input(z.object({ 
      testPaperId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(5),
      search: z.string().optional(),
      statusFilter: z.string().optional(),
      reviewFilter: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Build conditions array
        const conditions = [
          eq(parsedQuestions.testPaperId, input.testPaperId),
          eq(testPapers.userId, ctx.user.id)
        ];
        
        if (input.statusFilter && input.statusFilter !== 'all') {
          conditions.push(eq(parsedQuestions.reviewStatus, input.statusFilter));
        }
        
        if (input.reviewFilter && input.reviewFilter !== 'all') {
          if (input.reviewFilter === 'needs_review') {
            conditions.push(eq(parsedQuestions.needReview, true));
          } else if (input.reviewFilter === 'no_review_needed') {
            conditions.push(eq(parsedQuestions.needReview, false));
          }
        }

        // Add search to conditions if provided
        if (input.search) {
          conditions.push(
            sql`(${parsedQuestions.questionText} ILIKE ${'%' + input.search + '%'} OR 
                  ${parsedQuestions.options}::text ILIKE ${'%' + input.search + '%'})`
          );
        }

        // Build the base query
        const query = db
          .select({
            parsedQuestionsId: parsedQuestions.parsedQuestionsId,
            questionText: parsedQuestions.questionText,
            options: parsedQuestions.options,
            detectedAnswer: parsedQuestions.detectedAnswer,
            detectedAnswerConfidence: parsedQuestions.detectedAnswerConfidence,
            pageNumber: parsedQuestions.pageNumber,
            sequenceInDoc: parsedQuestions.sequenceInDoc,
            reviewStatus: parsedQuestions.reviewStatus,
            needReview: parsedQuestions.needReview,
            parseConfidence: parsedQuestions.parseConfidence,
            createdAt: parsedQuestions.createdAt,
          })
          .from(parsedQuestions)
          .innerJoin(testPapers, eq(parsedQuestions.testPaperId, testPapers.testPaperId))
          .where(and(...conditions))
          .orderBy(parsedQuestions.sequenceInDoc)
          .limit(input.limit)
          .offset((input.page - 1) * input.limit);

        // Get total count for pagination
        const countQuery = db
          .select({ count: sql<number>`count(*)` })
          .from(parsedQuestions)
          .innerJoin(testPapers, eq(parsedQuestions.testPaperId, testPapers.testPaperId))
          .where(and(...conditions));

        const [questions, totalCountResult] = await Promise.all([query, countQuery]);

        const totalCount = totalCountResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / input.limit);

        return {
          questions,
          pagination: {
            currentPage: input.page,
            totalPages,
            totalCount,
            limit: input.limit,
            hasNextPage: input.page < totalPages,
            hasPreviousPage: input.page > 1,
          }
        };
      } catch (err) {
        console.error("testPaper.getQuestions error", err);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch questions",
        });
      }
    }),
});