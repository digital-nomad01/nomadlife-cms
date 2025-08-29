/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BlogForm from "@/features/blog/ui/blog-form";

export default function BlogPostPage({ params }: any) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog ID: {params.id}</h1>
      <BlogForm />
    </div>
  );
} 