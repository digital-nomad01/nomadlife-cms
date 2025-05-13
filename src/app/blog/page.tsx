"use client";
import * as React from 'react'
import BlogForm from '@/features/blog/ui/blog-form';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <BlogForm />
    </div>
  );
} 