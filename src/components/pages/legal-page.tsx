'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLegalPageBySlug } from '@/lib/api';
import type { LegalPage } from '@/lib/types';
import PageBanner from '@/components/page-banner';
import Link from 'next/link';

export default function LegalPageView({ slug }: { slug: string }) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLegalPageBySlug(slug)
      .then(setPage)
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (<div><PageBanner title="Loading..." subtitle="" /><div className="section-padding bg-white"><div className="max-w-3xl mx-auto px-4"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></div></div></div>);

  if (!page) return (<div><PageBanner title="Not Found" subtitle="" /><div className="section-padding bg-white"><div className="max-w-3xl mx-auto px-4 text-center py-16"><FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" /><h2 className="text-2xl font-bold mb-4">Page Not Found</h2><Button asChild><Link href="/"><ArrowLeft className="w-4 h-4 mr-2" />Go Home</Link></Button></div></div></div>);

  return (
    <div>
      <PageBanner title={page.title} subtitle={`Last updated: ${new Date(page.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`} />
      <section className="section-padding bg-white">
        <article className="max-w-3xl mx-auto px-4 prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">{page.content}</article>
      </section>
    </div>
  );
}
