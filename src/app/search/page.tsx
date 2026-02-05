// src/app/search/page.tsx
import { SemanticSearch } from "@/components/semantic-search";

export default function SearchPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            🔍 Semantic Search
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered search — finds posts by meaning, not just keywords
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Powered by a local LLM model (Xenova/all-MiniLM-L6-v2)
          </p>
        </div>

        <SemanticSearch />
      </div>
    </div>
  );
}
