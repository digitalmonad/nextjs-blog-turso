import { db } from "@/lib/db";
import { categories as categoriesTable } from "@/lib/db/schema";
import { NewPostForm } from "./new-post-form";

type Category = { id: number; name: string };

export async function NewPostFormProvider() {
  // Intenional timeout
  await new Promise((res) => setTimeout(() => res(true), 1000));

  const rows = await db
    .select({ id: categoriesTable.id, name: categoriesTable.name })
    .from(categoriesTable)
    .orderBy(categoriesTable.name);

  const cats: Category[] = rows.map((r: { id: number; name: string }) => ({
    id: r.id,
    name: r.name,
  }));

  return <NewPostForm categories={cats} />;
}
