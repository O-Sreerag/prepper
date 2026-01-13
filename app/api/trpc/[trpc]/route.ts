import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/index";
import { createClient } from "@/services/supabase/server";

const handler = async (request: Request) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: async () => {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            return { user } as any;
        },
    });
};

export { handler as GET, handler as POST };
