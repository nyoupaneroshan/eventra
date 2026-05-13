'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, ArrowRight, Crown, Sparkles, Star } from 'lucide-react';
import PageBanner from '@/components/page-banner';
import { getPricingPackages } from '@/lib/api';
import type { PricingPackage } from '@/lib/types';

const pkgIconMap: Record<string, React.ElementType> = {
  Star,
  Sparkles,
  Crown,
};

export default function PricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPricingPackages()
      .then((data) => {
        const active = data.filter((p) => p.active).sort((a, b) => a.order - b.order);
        setPackages(active);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageBanner title="Pricing" subtitle="Every event is unique, and so are our packages. Select the one that fits your celebration." />
      <section className="section-padding bg-champagne/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-border p-6 md:p-8">
                  <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-24 mb-1" />
                  <Skeleton className="h-8 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="h-4 w-full mb-3" />
                  ))}
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No pricing packages available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg) => {
                const features: string[] = pkg.features ? JSON.parse(pkg.features) : [];
                const notIncluded: string[] = pkg.notIncluded ? JSON.parse(pkg.notIncluded) : [];
                const PkgIcon = pkgIconMap[pkg.name] || (pkg.popular ? Sparkles : Star);
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                      pkg.popular
                        ? 'bg-white border-2 border-rose shadow-xl scale-105 z-10'
                        : 'bg-white border border-border shadow-sm hover:shadow-lg'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-rose text-white text-center py-1.5 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className={`p-6 md:p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${pkg.popular ? 'bg-rose/10' : 'bg-gold/10'}`}>
                        <PkgIcon className={`w-7 h-7 ${pkg.popular ? 'text-rose' : 'text-gold-dark'}`} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                        <span className="text-muted-foreground text-sm">/event</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{pkg.description}</p>
                      <ul className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? 'text-rose' : 'text-gold-dark'}`} />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                        {notIncluded.map((feature, i) => (
                          <li key={`not-${i}`} className="flex items-start gap-2 text-sm">
                            <span className="w-4 h-4 shrink-0 mt-0.5 rounded-full border border-muted-foreground/30" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full rounded-full transition-all duration-300 ${
                          pkg.popular
                            ? 'bg-rose hover:bg-rose-dark text-white'
                            : 'bg-foreground hover:bg-foreground/90 text-white'
                        }`}
                        asChild
                      >
                        <a href="#/contact">
                          Get This Package
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-10">
            <p className="text-muted-foreground text-base">
              Every event is unique! These packages are starting points.
              <br />
              <a href="#/contact" className="text-rose-dark font-semibold hover:underline inline-flex items-center gap-1">
                Contact us for a personalized quote
                <ArrowRight className="w-4 h-4" />
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
