import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.NEON_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
