'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Crown, Sparkles, Star } from 'lucide-react';

const packages = [
  {
    name: 'Basic',
    icon: Star,
    price: 'NPR 25,000',
    description: 'Perfect for small gatherings and intimate celebrations with essential planning services.',
    features: [
      'Venue selection assistance',
      'Basic decoration setup',
      'Event day coordination',
      'Vendor recommendations',
      'Up to 50 guests',
      '1 planning consultation',
    ],
    notIncluded: [
      'Custom theme design',
      'Catering management',
      'Photography coordination',
    ],
    popular: false,
    color: 'gold',
  },
  {
    name: 'Standard',
    icon: Sparkles,
    price: 'NPR 55,000',
    description: 'Ideal for medium-sized events with enhanced styling, catering, and full-day coordination.',
    features: [
      'Venue selection & booking',
      'Custom theme & decoration',
      'Catering coordination',
      'Full event day management',
      'Photography arrangement',
      'Up to 150 guests',
      '3 planning consultations',
      'Sound & lighting setup',
    ],
    notIncluded: ['Premium entertainment', 'VIP guest management'],
    popular: true,
    color: 'rose',
  },
  {
    name: 'Premium',
    icon: Crown,
    price: 'NPR 95,000',
    description: 'The ultimate package for grand celebrations. Everything is handled with luxury and precision.',
    features: [
      'Premium venue selection',
      'Luxury theme & decoration',
      'Full catering management',
      'Multi-day event coordination',
      'Photography & videography',
      'Unlimited guests',
      'Unlimited consultations',
      'Premium sound & lighting',
      'Entertainment arrangement',
      'VIP guest management',
      'After-party coordination',
    ],
    notIncluded: [],
    popular: false,
    color: 'gold',
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCTA = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="section-padding bg-champagne/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-rose/10 text-rose-dark rounded-full text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="text-rose">Package</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every event is unique, and so are our packages. Select the one that
            fits your celebration, or reach out for a personalized quote.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                pkg.popular
                  ? 'bg-white border-2 border-rose shadow-xl scale-105 z-10'
                  : 'bg-white border border-border shadow-sm hover:shadow-lg'
              } ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-rose text-white text-center py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className={`p-6 md:p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                {/* Package Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    pkg.popular ? 'bg-rose/10' : 'bg-gold/10'
                  }`}
                >
                  <pkg.icon
                    className={`w-7 h-7 ${
                      pkg.popular ? 'text-rose' : 'text-gold-dark'
                    }`}
                  />
                </div>

                {/* Name & Price */}
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-foreground">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/event</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {pkg.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          pkg.popular ? 'text-rose' : 'text-gold-dark'
                        }`}
                      />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                  {pkg.notIncluded.map((feature, i) => (
                    <li
                      key={`not-${i}`}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="w-4 h-4 shrink-0 mt-0.5 rounded-full border border-muted-foreground/30" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full rounded-full transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-rose hover:bg-rose-dark text-white'
                      : 'bg-foreground hover:bg-foreground/90 text-white'
                  }`}
                  onClick={handleCTA}
                >
                  Get This Package
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Quote Note */}
        <div
          className={`text-center mt-10 transition-all duration-700 delay-500 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <p className="text-muted-foreground text-base">
            Every event is unique! These packages are starting points.
            <br />
            <button
              onClick={handleCTA}
              className="text-rose-dark font-semibold hover:underline inline-flex items-center gap-1"
            >
              Contact us for a personalized quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
