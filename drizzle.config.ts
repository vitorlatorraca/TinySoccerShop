import { defineConfig } from "drizzle-kit";

// Only require DATABASE_URL when actually running drizzle commands
// This allows the project to work without a database in development
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/tinysoccershop";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
