"use client";
import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createPost, type ActionState } from "./actions";
import { Textarea } from "@/components/ui/textarea";

type Category = { id: number; name: string };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex items-center px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Saving..." : "Create post"}
    </button>
  );
}

export function NewPostForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createPost,
    null as unknown as ActionState,
  );

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
  });

  const errors = state?.success === false ? state.errors : null;

  return (
    <form action={formAction} className="space-y-4">
      {errors?._form && (
        <div className="rounded border border-red-400 bg-red-50 p-3 text-red-800">
          {errors._form.join(", ")}
        </div>
      )}

      <div>
        <Label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          className="w-full"
          aria-describedby={errors?.title ? "title-error" : undefined}
        />
        {errors?.title && (
          <p id="title-error" className="text-red-600 text-sm mt-1">
            {errors.title.join(", ")}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="excerpt" className="block text-sm font-medium mb-1">
          Excerpt
        </Label>
        <Input
          id="excerpt"
          name="excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))}
          className="w-full"
          aria-describedby={errors?.excerpt ? "excerpt-error" : undefined}
        />
        {errors?.excerpt && (
          <p id="excerpt-error" className="text-red-600 text-sm mt-1">
            {errors.excerpt.join(", ")}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="content" className="block text-sm font-medium mb-1">
          Content (HTML allowed)
        </Label>
        <Textarea
          id="content"
          name="content"
          value={form.content}
          onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
          rows={8}
          className="w-full"
          aria-describedby={errors?.content ? "content-error" : undefined}
        />
        {errors?.content && (
          <p id="content-error" className="text-red-600 text-sm mt-1">
            {errors.content.join(", ")}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="image" className="block text-sm font-medium mb-1">
          Image URL
        </Label>
        <Input
          id="image"
          name="image"
          value={form.image}
          onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
          className="w-full"
          aria-describedby={errors?.image ? "image-error" : undefined}
        />
        {errors?.image && (
          <p id="image-error" className="text-red-600 text-sm mt-1">
            {errors.image.join(", ")}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </Label>
        <div>
          <Select
            value={form.category || undefined}
            onValueChange={(v) =>
              setForm((s) => ({
                ...s,
                category: v === "__none" ? "" : (v ?? ""),
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- none --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"__none"}>-- none --</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Hidden native input so FormData from the form includes category */}
          <input type="hidden" name="category" value={form.category} />

          {errors?.category && (
            <p id="category-error" className="text-red-600 text-sm mt-1">
              {errors.category.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
