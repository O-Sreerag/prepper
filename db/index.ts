import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
// Configure connection pool with limited connections for Supabase session mode
export const client = postgres(connectionString!, {
  prepare: false,
  max: 1, // Limit to 1 connection in development to avoid MaxClientsInSessionMode error
  idle_timeout: 20,
  max_lifetime: 60 * 30, // 30 minutes
});

export const db = drizzle(client, { casing: "snake_case", schema });