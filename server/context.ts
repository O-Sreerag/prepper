import { createClient } from "@/services/supabase/server";

export async function createContext() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user: user ?? null,
    employeeDetails: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;