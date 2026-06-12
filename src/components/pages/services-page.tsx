'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle2, Heart as HeartIcon, Building2 as Building2Icon, PartyPopper as PartyPopperIcon } from 'lucide-react';
import PageBanner from '@/components/page-banner';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/types';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  Heart: HeartIcon,
  Building2: Building2Icon,
  PartyPopper: PartyPopperIcon,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((data) => {
        const active = data.filter((s) => s.active).sort((a, b) => a.order - b.order);
        setServices(active);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageBanner title="Our Services" subtitle="From intimate gatherings to grand celebrations, we offer comprehensive event planning services tailored to your needs." />
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-border">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComp = iconMap[service.icon] || HeartIcon;
                const features: string[] = service.features ? JSON.parse(service.features) : [];
                return (
                  <div key={service.id} className="group rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <IconComp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                      <ul className="space-y-2 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-rose shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full border-rose/30 text-rose-dark hover:bg-rose hover:text-white transition-colors duration-300" asChild>
                        <Link href="/contact">
                          Request Custom Quote
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
