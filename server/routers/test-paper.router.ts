import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { router, protectedProcedure } from "@/server/trpc"
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { testPapers, uploadFiles } from "@/db/schema";

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
});