import { publicProcedure, router } from "./trpc";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { testPaperRouter } from "./routers";

export const appRouter = router({
    hello: publicProcedure.query(() => "Hello, world!"),
    testPaper: testPaperRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
