import "dotenv/config";

import { db } from "./index";
import * as schema from "./schema";
import mockData from "../data/mock-data.json";

async function main() {
  const data = mockData;

  const posts = data.featuredPosts ?? [];
  const categories = data.categories ?? [];

  // Insert categories
  for (const c of categories) {
    await db.insert(schema.categories).values({
      id: Number(c.id),
      name: c.name,
      count: posts.reduce((acc, i) => (c.id === i.category ? acc + 1 : acc), 0),
      icon: c.icon,
    });
  }

  // Insert posts
  for (const p of posts) {
    const rawDate = typeof p.date === "string" ? p.date : String(p.date);
    const parsed = new Date(rawDate);
    const createdAt = isNaN(parsed.getTime())
      ? new Date().toISOString().slice(0, 10)
      : parsed.toISOString().slice(0, 10);

    await db.insert(schema.posts).values({
      title: p.title,
      content: p.excerpt ?? "",
      excerpt: p.excerpt ?? null,
      image: p.image ?? null,
      category: Number(p.category),
      createdAt,
    });
  }

  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
