'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/api';
import type { BlogPost } from '@/lib/types';

export default function BlogPostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPostBySlug(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (<div className="section-padding bg-white"><div className="max-w-3xl mx-auto px-4"><Skeleton className="h-8 w-3/4 mb-4" /><Skeleton className="h-4 w-1/2 mb-8" /><Skeleton className="h-64 w-full mb-8" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></div></div>);

  if (!post) return (<div className="section-padding bg-white"><div className="max-w-3xl mx-auto px-4 text-center py-16"><h2 className="text-2xl font-bold mb-4">Post Not Found</h2><p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p><Button asChild><a href="#/blog"><ArrowLeft className="w-4 h-4 mr-2" />Back to Blog</a></Button></div></div>);

  const tags: string[] = post.tags ? JSON.parse(post.tags) : [];

  return (
    <div className="section-padding bg-white">
      <article className="max-w-3xl mx-auto px-4">
        <a href="#/blog" className="inline-flex items-center gap-1 text-rose-dark hover:underline text-sm mb-6"><ArrowLeft className="w-4 h-4" />Back to Blog</a>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>By {post.author}</span>
          <span className="px-2.5 py-0.5 bg-rose/10 text-rose-dark rounded-full text-xs font-medium">{post.category}</span>
        </div>
        {post.image && (<div className="rounded-2xl overflow-hidden mb-8"><img src={post.image} alt={post.title} className="w-full h-auto" /></div>)}
        <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</div>
        {tags.length > 0 && (<div className="mt-8 pt-8 border-t"><div className="flex items-center gap-2 flex-wrap"><Tag className="w-4 h-4 text-muted-foreground" />{tags.map((tag) => (<span key={tag} className="px-3 py-1 bg-champagne rounded-full text-sm text-foreground">{tag}</span>))}</div></div>)}
        <div className="mt-8 pt-8 border-t flex items-center justify-between">
          <a href="#/blog" className="text-rose-dark font-semibold hover:underline inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />All Posts</a>
          <Button variant="outline" size="sm" onClick={() => { if (navigator.share) navigator.share({ title: post.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}><Share2 className="w-4 h-4 mr-1" />Share</Button>
        </div>
      </article>
    </div>
  );
}
