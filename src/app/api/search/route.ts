// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, client } from "@/lib/db";
import { posts, categories } from "@/lib/db/schema";
import { generateEmbedding, embeddingToBuffer } from "@/lib/embeddings/model";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "10");
  const threshold = parseFloat(searchParams.get("threshold") || "0.3");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter required" },
      { status: 400 },
    );
  }

  try {
    // 1. Vygeneruj embedding pro search query
    const queryEmbedding = await generateEmbedding(query);
    const queryBuffer = embeddingToBuffer(queryEmbedding);

    // Převeď buffer na hex string pro SQL
    const embeddingHex = queryBuffer.toString("hex");

    // 2. Použij native Turso vector search s cosine distance
    // vector_distance_cos vrací distance (nižší = podobnější),
    // takže potřebujeme: similarity = 1 - distance
    const results = await client.execute({
      sql: `
        SELECT 
          p.id,
          p.title,
          p.excerpt,
          p.image,
          p.created_at as createdAt,
          p.category_id as categoryId,
          (1 - vector_distance_cos(p.embedding, ?)) as similarity
        FROM post p
        WHERE p.embedding IS NOT NULL
          AND (1 - vector_distance_cos(p.embedding, ?)) >= ?
        ORDER BY similarity DESC
        LIMIT ?
      `,
      args: [queryBuffer, queryBuffer, threshold, limit],
    });

    // 3. Přidej category names
    const resultsWithCategories = await Promise.all(
      results.rows.map(async (row: any) => {
        if (!row.categoryId) return row;

        const category = await db
          .select({ name: categories.name })
          .from(categories)
          .where(eq(categories.id, row.categoryId))
          .limit(1);

        return {
          ...row,
          category: category[0]?.name || null,
        };
      }),
    );

    return NextResponse.json({
      query,
      results: resultsWithCategories,
      count: resultsWithCategories.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
