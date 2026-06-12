'use client';

import BlogPostPage from '@/components/pages/blog-post-page';

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15+ uses async params
  return <BlogPostPageWrapper params={params} />;
}

function BlogPostPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  // We need to unwrap the async params - use a client-side approach
  return <AsyncBlogPost params={params} />;
}

import { use, useEffect, useState } from 'react';

function AsyncBlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <BlogPostPage slug={slug} />;
}
