import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: { id: string } };

export async function generateStaticParams() {
  const rows = await db.select({ id: posts.id }).from(posts).limit(100);
  return rows.map((r) => ({ id: String(r.id) }));
}

export default async function PostPage({ params }: Params) {
  const { id } = await params;

  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      excerpt: posts.excerpt,
      image: posts.image,
      createdAt: posts.createdAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.category, categories.id))
    .where(eq(posts.id, Number(id)))
    .limit(1);

  const post = result[0];
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground mb-6 inline-block"
      >
        ← Back
      </Link>

      <article className="prose prose-invert mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          {post.title}
        </h1>

        <div className="text-sm text-muted-foreground mb-4">
          {post.createdAt} • {post.categoryName}
        </div>

        {post.image && (
          <div className="w-full h-64 relative mb-6 rounded overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Full story</h2>
          <div
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>
      </article>
    </main>
  );
}
