import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

import { posts } from "@/lib//db/schema";

export const PostSchema = createInsertSchema(posts, {
  title: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Title is required." : "Invalid input.",
    })
    .trim()
    .min(3, { message: "Title is too short" })
    .max(100, { message: "Title is too long" }),
  content: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Content is required." : "Invalid input.",
    })
    .trim()
    .min(1, { message: "Content is too short" })
    .max(3000, { message: "Content is too long" }),
}).omit({ id: true, createdAt: true });
