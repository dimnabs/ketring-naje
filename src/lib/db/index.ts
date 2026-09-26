import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/katering_naje";

const globalForDatabase = globalThis as unknown as {
  sqlClient?: ReturnType<typeof postgres>;
};

const sqlClient = globalForDatabase.sqlClient ?? postgres(databaseUrl, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.sqlClient = sqlClient;
}

export const db = drizzle(sqlClient, { schema });
