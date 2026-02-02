import { Config } from "drizzle-kit";

export default {
  dialect: "turso",
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",

  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
