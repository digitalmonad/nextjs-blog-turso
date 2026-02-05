// src/components/semantic-search.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: number;
  title: string;
  excerpt: string | null;
  image: string | null;
  createdAt: string;
  category: string | null;
  similarity: number;
}

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<number | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      handleSearch(value);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Semantic search... (e.g. 'artificial intelligence', 'web development')"
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-4 py-6 text-lg"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
        )}
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Searching...</p>
          ) : results.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Found {results.length} relevant posts
              </p>

              {results.map((result) => (
                <Link key={result.id} href={`/posts/${result.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {result.image && (
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                              {result.title}
                            </h3>
                            <Badge variant="outline" className="ml-2">
                              {Math.round(result.similarity * 100)}% match
                            </Badge>
                          </div>
                          {result.category && (
                            <Badge variant="secondary" className="mb-2">
                              {result.category}
                            </Badge>
                          )}
                          {result.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.excerpt}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {result.createdAt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              No results found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
