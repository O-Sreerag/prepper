import { TRPCError } from "@trpc/server"

import { router, protectedProcedure } from "@/server/trpc"
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { testPapers } from "@/db/schema";

export const testPaperRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const papers = await db
        .select()
        .from(testPapers)
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