'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getFAQs } from '@/lib/api';
import type { FAQItem } from '@/lib/types';
import PageBanner from '@/components/page-banner';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFAQs().then(setFaqs).catch(() => setFaqs([])).finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div>
      <PageBanner title="Frequently Asked Questions" subtitle="Find answers to common questions about our event planning services" />
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {loading ? (
            <div className="space-y-4">{[1,2,3,4].map((i) => (<Skeleton key={i} className="h-16 w-full" />))}</div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-16"><HelpCircle className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" /><h3 className="text-xl font-semibold mb-2">No FAQs Yet</h3><p className="text-muted-foreground">Check back later for answers to common questions.</p></div>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="mb-8">
                <h3 className="text-lg font-bold text-rose-dark mb-4">{cat}</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.filter((f) => f.category === cat).map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-xl px-4 data-[state=open]:bg-champagne/30">
                      <AccordionTrigger className="text-left font-medium text-foreground hover:text-rose-dark hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
