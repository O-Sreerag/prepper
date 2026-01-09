import { initTRPC, TRPCError } from "@trpc/server";
import { createClient } from "@/services/supabase/server";
// import { SupabaseViewsEnum } from "@/lib/constants";
// import { IHrmsEmployeeDetails } from "@/app/(protected)/(pages)/(admin)/admin/employee-directory/employee-list/_types";

const t = initTRPC.context<{ user: any, employeeDetails: any | null }>().create();

export const isAuthed = t.middleware(async ({ next, ctx }) => {
    // --- 1. Get Supabase user ---
    const supabase = await createClient();

    // --- 2. Get employee details from internal view ---
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // const { data, error: employeeError } = await supabase
    //     .from(SupabaseViewsEnum.VIEW_USERS_WITH_ROLES_DEPARTMENTS)
    //     .select("*")
    //     .eq("users_id", user.id)
    //     .limit(1);

    // const employeeDetails = (data?.[0] ?? null) as any | null;

    // if (!employeeDetails) {
    //     console.warn(`⚠️ No employee record found for user ${user.id}`);
    // }

    // console.log("user", user);
    // console.log("employeeDetails", employeeDetails);

        // if (!user || employeeError) {
        //     throw new TRPCError({ code: "UNAUTHORIZED" });
        // }

    // --- 4. Pass both user + employee in context ---
    return next({ ctx: { user } });
    // return next({ ctx: { user: {id: "1e68dd30-45a0-42a0-90ff-c4f85cb9902f"} } });
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);
