import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("post", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title", { length: 256 }).notNull(),

  content: text("content", { length: 1000 }).notNull(),

  excerpt: text("excerpt", { length: 1000 }),

  image: text("image", { length: 1000 }),

  category: integer("category_id", { mode: "number" })
    .references(() => categories.id)
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const categories = sqliteTable("category", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 128 }).notNull(),
  count: integer("count", { mode: "number" }).notNull(),
});
