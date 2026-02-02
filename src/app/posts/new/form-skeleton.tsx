import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Skeleton className="h-9 w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <Skeleton className="h-9 w-full mb-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Content (HTML allowed)
        </label>
        <Skeleton className="h-44 w-full mb-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <Skeleton className="h-9 w-full mb-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Skeleton className="h-9 w-full mb-2" />
      </div>

      <div>
        <Skeleton className="h-9 w-30 mb-2" />
      </div>
    </div>
  );
}
