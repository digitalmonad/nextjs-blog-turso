import "dotenv/config";
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function initVectorExtension() {
  console.log("🔧 Initializing vector search in Turso...");

  try {
    // Load and run SQL migration
    const migrationPath = join(
      __dirname,
      "migrations",
      "0001_add_vector_support.sql",
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    // Split SQL into statements and execute them
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await client.execute(statement);
    }

    console.log("✅ Vector search initialized!");
    console.log("⚠️  WARNING: Embeddings were reset, run: pnpm db:embeddings");
  } catch (error: any) {
    console.error("❌ Error:", error);
    if (error.message?.includes("no such table: post_new")) {
      console.log("✅ Migration has already been applied");
    } else if (error.message?.includes("already exists")) {
      console.log("✅ Vector index already exists");
    } else {
      process.exit(1);
    }
  } finally {
    client.close();
  }
}

initVectorExtension();
