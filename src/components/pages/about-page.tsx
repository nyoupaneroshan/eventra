'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Palette, MapPin, Sparkles } from 'lucide-react';
import PageBanner from '@/components/page-banner';
import { getAboutContent } from '@/lib/api';
import type { AboutContent, AboutFeature } from '@/lib/types';

const defaultFeatures: AboutFeature[] = [
  { icon: 'Heart', title: 'Attention to Detail', description: 'Every element is carefully considered, from table settings to lighting, ensuring nothing is overlooked.' },
  { icon: 'Palette', title: 'Creative Design', description: 'We bring fresh, innovative ideas to every event, crafting unique themes and atmospheres that leave lasting impressions.' },
  { icon: 'MapPin', title: 'Venue Selection', description: 'Access to the finest venues in and around Butwal, handpicked to match your event style and guest count perfectly.' },
  { icon: 'Sparkles', title: 'Full Coordination', description: 'From decoration to catering, we manage every vendor and detail so you can relax and enjoy your celebration.' },
];

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Palette,
  MapPin,
  Sparkles,
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutContent()
      .then((data) => setAbout(data))
      .catch(() => setAbout(null))
      .finally(() => setLoading(false));
  }, []);

  let features: AboutFeature[] = defaultFeatures;
  if (about?.features) {
    try {
      const parsed = JSON.parse(about.features);
      if (Array.isArray(parsed) && parsed.length > 0) {
        features = parsed;
      }
    } catch {
      // use defaults
    }
  }

  return (
    <div>
      <PageBanner title="About Us" subtitle="Passionate event planners based in Butwal, Nepal" />
      <section className="section-padding bg-champagne/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Photos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={about?.image1 || '/about1.png'}
                      alt="Our team planning an event"
                      className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={about?.image3 || '/about3.png'}
                      alt="Attention to detail in decoration"
                      className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={about?.image2 || '/about2.png'}
                      alt="Elegant venue setup"
                      className="w-full h-full min-h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {about?.sectionTitle || 'Making Every Event Smooth, Beautiful & Memorable'}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  {about?.description || 'At Eventra, we believe that every celebration deserves to be extraordinary. Based in the heart of Butwal, our passionate team has been transforming ordinary spaces into breathtaking experiences. Whether it is an intimate wedding, a grand corporate gala, or a joyful private party, we pour our hearts into every detail.'}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed mb-8">
                  {about?.subtitle || 'Our approach is simple yet thorough — we listen to your vision, understand your style, and bring it to life with precision and creativity. From venue selection and decoration to catering coordination and on-site management, we handle it all so you can focus on what truly matters: celebrating with the people you love.'}
                </p>

                {/* Feature Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const IconComp = iconMap[feature.icon] || Heart;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center shrink-0">
                          <IconComp className="w-5 h-5 text-rose" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground text-xs mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
