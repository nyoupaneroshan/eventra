'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { getBlogPosts } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import PageBanner from '@/components/page-banner';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    getBlogPosts()
      .then((data) => setPosts(data.filter((p) => p.published)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = posts.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <PageBanner title="Our Blog" subtitle="Insights, tips, and stories from the world of event planning" />
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button key={cat} variant={category === cat ? 'default' : 'outline'} size="sm" onClick={() => setCategory(cat)}
                  className={category === cat ? 'bg-rose hover:bg-rose-dark text-white' : ''}>{cat}</Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map((i) => (<div key={i} className="rounded-2xl overflow-hidden border"><Skeleton className="h-48 w-full" /><div className="p-6 space-y-3"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div></div>))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16"><BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No Articles Found</h3><p className="text-muted-foreground">Check back soon for new content!</p></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white">
                  {post.image && (<div className="relative h-48 overflow-hidden"><img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>)}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-0.5 bg-rose/10 text-rose-dark rounded-full text-xs font-medium">{post.category}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-rose-dark transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    <span className="text-rose-dark font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
