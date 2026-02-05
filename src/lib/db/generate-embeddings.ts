// src/lib/db/generate-embeddings.ts
import "dotenv/config";

// Disable use of sharp in @xenova/transformers (not needed for text embeddings)
process.env.USE_SHARP = "false";

import { db } from "./index";
import { posts } from "./schema";
import { generateEmbedding, embeddingToBuffer } from "../embeddings/model";
import { eq, isNotNull } from "drizzle-orm";

async function generateAllEmbeddings() {
  console.log("🚀 Generating embeddings for existing posts...");

  try {
    // Load all posts
    const allPosts = await db
      .select()
      .from(posts)
      .where(isNotNull(posts.content));

    console.log(`📝 Found ${allPosts.length} posts`);

    for (const post of allPosts) {
      console.log(`⚙️ Processing: ${post.title}`);

      // Combine title + excerpt + content for better embeddings
      const textToEmbed =
        `${post.title}. ${post.excerpt || ""} ${post.content}`.trim();

      // Generate embedding
      const embedding = await generateEmbedding(textToEmbed);
      const embeddingBuffer = embeddingToBuffer(embedding);

      // Save to DB
      await db
        .update(posts)
        .set({ embedding: embeddingBuffer })
        .where(eq(posts.id, post.id));

      console.log(`✅ Saved embedding for: ${post.title}`);
    }

    console.log("🎉 All embeddings generated!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

generateAllEmbeddings();
