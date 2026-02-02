import React, { Suspense } from "react";
import { NewPostFormProvider } from "./new-post-form-provider";
import FormSkeleton from "./form-skeleton";

export default function NewPostPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Write New Post</h1>
      <Suspense fallback={<FormSkeleton />}>
        {/* server component that loads categories and renders the client form */}
        <NewPostFormProvider />
      </Suspense>
    </main>
  );
}
