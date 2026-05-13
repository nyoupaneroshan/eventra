'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
  Heart as HeartIcon,
  Building2 as Building2Icon,
  PartyPopper as PartyPopperIcon,
} from 'lucide-react';
import { getHeroSlides, getServices, getTestimonials } from '@/lib/api';
import type { HeroSlide, Service, Testimonial } from '@/lib/types';

const iconMap: Record<string, React.ElementType> = {
  Heart: HeartIcon,
  Building2: Building2Icon,
  PartyPopper: PartyPopperIcon,
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ServiceHighlights />
      <TestimonialHighlights />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    getHeroSlides()
      .then((data) => {
        const active = data.filter((s) => s.active).sort((a, b) => a.order - b.order);
        setSlides(active.length > 0 ? active : []);
      })
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || slides.length === 0) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning, slides.length]
  );

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (loading) {
    return (
      <section className="relative w-full h-screen min-h-[600px] bg-champagne">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }

  const displaySlides = slides.length > 0
    ? slides
    : [
        { id: '0', title: 'We Plan, You Celebrate', subtitle: 'Professional event planning services in Nepal for weddings, corporate events, and private parties.', image: '/hero1.png', order: 0, active: true },
      ];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {displaySlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: current === index ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      ))}

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div key={`title-${current}`} className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              {displaySlides[current].title}
            </h1>
          </div>
          <div key={`subtitle-${current}`} className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              {displaySlides[current].subtitle}
            </p>
          </div>
          <div key={`cta-${current}`} className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="bg-rose hover:bg-rose-dark text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <a href="#/contact">
                Get Free Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full transition-all duration-300" asChild>
              <a href="#/services">Our Services</a>
            </Button>
          </div>
        </div>
      </div>

      {displaySlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}

function ServiceHighlights() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((data) => {
        const active = data.filter((s) => s.active).sort((a, b) => a.order - b.order).slice(0, 3);
        setServices(active);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-rose/10 text-rose-dark rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What We <span className="text-rose">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we offer comprehensive event planning services.
          </p>
        </div>

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
                      {features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-rose shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full border-rose/30 text-rose-dark hover:bg-rose hover:text-white transition-colors duration-300" asChild>
                      <a href="#/contact">
                        Request Custom Quote
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <a href="#/services" className="text-rose-dark font-semibold hover:underline inline-flex items-center gap-1">
            View All Services <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialHighlights() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((data) => {
        const active = data.filter((t) => t.active).sort((a, b) => a.order - b.order).slice(0, 2);
        setTestimonials(active);
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-champagne/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-rose/10 text-rose-dark rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-rose">Clients Say</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl bg-white">
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="relative p-6 md:p-8 rounded-2xl bg-white border border-border hover:shadow-lg transition-all duration-500">
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-rose" />
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center">
                    <span className="text-rose-dark font-bold text-sm">{testimonial.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a href="#/testimonials" className="text-rose-dark font-semibold hover:underline inline-flex items-center gap-1">
            Read All Reviews <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-rose-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Plan Your Perfect Event?
        </h2>
        <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Let us turn your vision into reality. Contact us today for a free consultation and personalized quote.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-rose-dark hover:bg-champagne text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300" asChild>
            <a href="#/contact">
              Get Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full transition-all duration-300" asChild>
            <a href="#/pricing">View Packages</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
