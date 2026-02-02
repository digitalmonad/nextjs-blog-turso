"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  category: z.union([z.string(), z.number()]).optional(),
});

export type CreatePostData = z.infer<typeof createPostSchema>;

export type ActionState =
  | {
      success: false;
      errors: {
        title?: string[];
        content?: string[];
        excerpt?: string[];
        image?: string[];
        category?: string[];
        _form?: string[];
      };
    }
  | {
      success: true;
      post: {
        id: number;
        title: string;
        content: string;
        excerpt: string | null;
        image: string | null;
        category: number | null;
      };
    };

export async function createPost(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt") || null,
    image: formData.get("image") || null,
    category: formData.get("category") || undefined,
  };

  const parsed = createPostSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        title: errors.title,
        content: errors.content,
        excerpt: errors.excerpt,
        image: errors.image,
        category: errors.category,
      },
    };
  }

  const valid = parsed.data;

  const categoryValue: number | undefined =
    valid.category === undefined
      ? undefined
      : typeof valid.category === "number"
        ? valid.category
        : valid.category
          ? Number(valid.category)
          : undefined;

  try {
    const [newPost] = await db
      .insert(posts)
      .values({
        title: valid.title,
        content: valid.content,
        excerpt: valid.excerpt ?? null,
        image: valid.image ?? null,
        category: categoryValue,
      })
      .returning();

    if (!newPost) {
      return {
        success: false,
        errors: {
          _form: ["Failed to create post"],
        },
      };
    }

    redirect(`/posts/${newPost.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }

    console.error("Error creating post:", error);
    return {
      success: false,
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    };
  }
}
