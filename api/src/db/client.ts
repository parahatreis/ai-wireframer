import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../config.js";
import * as schema from "./schema.js";

const { Pool } = pg;

// Database connection - optional for now, uncomment when ready to use DB
let db: ReturnType<typeof drizzle> | null = null;

if (env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });
  db = drizzle(pool, { schema });
}

export { db };

